/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
import Editor, { useMonaco } from "@monaco-editor/react";
import styled from "styled-components";
import editorOptions from "../../helper/editorOptions";
import themeOptions from "../../helper/themeOptions";
import * as languageOptions from "../../helper/languageOptions";
import { SimplicityEditorNavBar } from "./SimplicityEditorNavBar";
import ReactTerminal from "react-terminal-component";
import { EmulatorState, OutputFactory, CommandMapping, defaultCommandMapping } from "javascript-terminal";

const lng = "simplicity";

export const SimplicityEditor = () => {
  const monaco = useMonaco();
  const terms = [{ word: "unit" }, { word: "comp" }, { word: "pair" }, { word: "case" }, { word: "injl" }, { word: "injr" }, { word: "take" }, { word: "drop" }, { word: "iden" }];

  const customState = EmulatorState.create({
    commandMapping: CommandMapping.create({
      ...defaultCommandMapping,
      run: {
        function: (state: any, opts: any) => {
          const input = opts.join(" ");

          return {
            output: OutputFactory.makeTextOutput(input),
          };
        },
        optDef: {},
      },
    }),
  });

  const [terminalState, setTerminalState] = useState({ emulatorState: customState, inputStr: "" });
  const [termData, setTermData] = useState(terms);

  const [editorValue, setEditorValue] = useState<Array<string>>([]);
  const [result, setResult] = useState<string>();

  const [errorMessage, setErrorMessage] = useState<string>("");

  let disposeLanguageConfiguration = () => {};
  let disposeMonarchTokensProvider = () => {};
  let disposeCompletionItemProvider = () => {};

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: lng });

      monaco.editor.defineTheme("simplicityTheme", themeOptions);

      const { dispose: disposeSetLanguageConfiguration } = monaco.languages.setLanguageConfiguration(lng, languageOptions.languageConfigurations(monaco.languages));
      disposeLanguageConfiguration = disposeSetLanguageConfiguration;

      // Register a tokens provider for the language
      const { dispose: disposeSetMonarchTokensProvider } = monaco.languages.setMonarchTokensProvider(lng, languageOptions.tokenProviders);
      disposeMonarchTokensProvider = disposeSetMonarchTokensProvider;

      const { dispose: disposeRegisterCompletionItemProvider } = monaco.languages.registerCompletionItemProvider(lng, {
        provideCompletionItems: (model: any, position: any) => {
          const suggestions = languageOptions.languageSuggestions(monaco.languages, model, position, termData);
          return { suggestions: suggestions };
        },
      });

      disposeCompletionItemProvider = disposeRegisterCompletionItemProvider;
    }

    return () => {
      if (monaco !== undefined) {
        // monaco.editor.getModels().forEach((model) => model.dispose());

        disposeLanguageConfiguration();
        disposeMonarchTokensProvider();
        disposeCompletionItemProvider();
      }
    };
  }, [monaco, termData]);

  const onChangeEditor = (value: string | undefined, ev: Monaco.editor.IModelContentChangedEvent) => {
    if (value) {
      const lines: string = value;
      const newLines = lines.split("\n");
      const filteredLines = newLines.filter((x) => x !== "");
      setEditorValue(filteredLines);

      filteredLines.forEach((fl) => {
        if (fl.includes(" := ")) {
          const index = termData.findIndex((object) => object.word === fl.split(" ")[0]);
          if (index === -1) {
            setTermData([...termData, { word: fl.split(" ")[0] }]);
          }
        }
      });
    }
  };

  if (monaco != null) {
    return (
      <>
        <SimplicityEditorNavBar />
        <EditorHeader>Editor</EditorHeader>
        <Editor
          key="editor-one"
          height="50vh"
          onChange={onChangeEditor}
          theme="simplicityTheme"
          defaultValue="// let's write some broken code 😈"
          options={editorOptions}
          language={lng}
        />

        <Wrapper>
          <TerminalSection>
            <EditorSection>
              <EditorHeader>Terminal</EditorHeader>
              <ReactTerminal
                promptSymbol="₿"
                inputStr={terminalState.inputStr}
                autoFocus={false}
                emulatorState={terminalState.emulatorState}
                onInputChange={(data: string) => {
                  setTerminalState({ ...terminalState, inputStr: data });
                }}
                onStateChange={(data: any) => {
                  console.log("state", data);
                }}
              />
            </EditorSection>
          </TerminalSection>
        </Wrapper>
      </>
    );
  }

  return null;
};

const Wrapper = styled.section`
  background: #1e1e1e;
  height: 40vh;
  display: flex;
  width: 100%;
`;

const TerminalSection = styled.section`
  height: 40vh;
  display: flex;
  width: 100%;
`;

const EditorHeader = styled.section`
  background: rgb(77, 78, 79);
  height: 1.7rem;
  display: flex;
  color: white;
  font-size: 13px;
  padding: 7px;
  align-items: center;
`;

const EditorSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ErrorMessage = styled.span`
  color: red;
`;
