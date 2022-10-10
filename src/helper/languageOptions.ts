/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable no-template-curly-in-string */
import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

const languageConfigurations = (monaco: typeof Monaco.languages): Monaco.languages.LanguageConfiguration => {
  return {
    autoClosingPairs: [
      { open: "<", close: ">" },
      { open: "(", close: ")" },
      { open: '"', close: '"', notIn: ["string"] },
      { open: "'", close: "'", notIn: ["string", "comment"] },
      { open: "/**", close: " */", notIn: ["string"] },
      { open: "pair", close: "()()", notIn: ["string"] },
      { open: "comp", close: "()()", notIn: ["string"] },
      { open: "case", close: "()()", notIn: ["string"] },
      { open: "take", close: "()", notIn: ["string"] },
      { open: "drop", close: "()", notIn: ["string"] },
      { open: "injl", close: "()", notIn: ["string"] },
      { open: "injr", close: "()", notIn: ["string"] },
    ],
    brackets: [
      ["<", ">"],
      ["$(", ")"],
    ],
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"],
    },
    onEnterRules: [
      {
        // e.g. /** | */
        beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
        afterText: /^\s*\*\/$/,
        action: {
          indentAction: monaco.IndentAction.IndentOutdent,
          appendText: " * ",
        },
      },
      {
        // e.g. /** ...|
        beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
        action: {
          indentAction: monaco.IndentAction.None,
          appendText: " * ",
        },
      },
      {
        // e.g.  * ...|
        beforeText: /^(\t|[ ])*[ ]\*([ ]([^*]|\*(?!\/))*)?$/,
        afterText: /^(\s*(\/\*\*|\*)).*/,
        action: {
          indentAction: monaco.IndentAction.None,
          appendText: "* ",
        },
      },
      {
        // e.g.  */|
        beforeText: /^(\t|[ ])*[ ]\*\/\s*$/,
        action: {
          indentAction: monaco.IndentAction.None,
          removeText: 1,
        },
      },
      {
        // e.g.  *-----*/|
        beforeText: /^(\t|[ ])*[ ]\*[^/]*\*\/\s*$/,
        action: {
          indentAction: monaco.IndentAction.None,
          removeText: 1,
        },
      },
    ],
  };
};

const tokenProviders: Monaco.languages.IMonarchLanguage = {
  bigint: /-?\d+(_+\d+)*/,
  brackets: [
    { open: "(", close: ")", token: "delimiter.evaluation" },
    { open: "<", close: ">", token: "delimiter.push" },
    { open: "(", close: " )", token: "delimiter.push" },
  ],
  binary: /[01]+(?:[01_]*[01]+)*/,
  hex: /[0-9a-fA-F]_*(?:_*[0-9a-fA-F]_*[0-9a-fA-F]_*)*[0-9a-fA-F]/,
  syntax: /:=/,
  terms: ["unit", "comp", "pair", "case", "injl", "injr", "take", "drop", "iden"],
  tokenizer: {
    root: [
      [
        /[a-zA-Z_][.a-zA-Z0-9_-]+/,
        {
          cases: {
            "@terms": "simplicity.terms",
            "@default": "identifier",
          },
        },
      ],
      [/0x(@hex)/, "literal.hex"], // HexLiteral
      [/(@bigint)/, "literal.bigint"], // BigIntLiteral
      [/(@funcEqual)/, "literal.funcEqual"], // BigIntLiteral
      { include: "@whitespace" },
      [/[<>)]|\$\(/, "@brackets"],
      [/"/, "string", "@string_double"], // UTF8Literal
      [/'/, "string", "@string_single"], // UTF8Literal
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"],
    ],
    comment: [
      [/[^/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[/*]/, "comment"],
    ],
    string_double: [
      [/[^"$]+/, "string"],
      [/"/, "string", "@pop"],
    ],
    string_single: [
      [/[^'$]+/, "string"],
      [/'/, "string", "@pop"],
    ],
  },
};

const languageSuggestions = (monaco: typeof Monaco.languages, model: Monaco.editor.ITextModel, position: Monaco.Position, termsData: any[]): Monaco.languages.CompletionItem[] => {
  // const query = model.getWordAtPosition(position);
  const columns = model.getWordUntilPosition(position);

  const range: Monaco.IRange = {
    startColumn: columns.startColumn,
    endColumn: columns.endColumn,
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
  };

  return termsData.map((term) => ({
    label: term.word,
    insertText: term.word,
    kind: monaco.CompletionItemKind.Function,
    range,
  }));
};

export { languageConfigurations, tokenProviders, languageSuggestions };
