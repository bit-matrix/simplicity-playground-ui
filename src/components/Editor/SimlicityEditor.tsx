import React, { useEffect, useState } from "react";
import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
import Editor, { useMonaco } from "@monaco-editor/react";
import styled from "styled-components";
import editorOptions from "../../helper/editorOptions";
import themeOptions from "../../helper/themeOptions";
import * as languageOptions from "../../helper/languageOptions";

export const SimplicityEditor = () => {
  const [lng] = useState("simplicity" + (Math.random() * 1000).toFixed(2));

  const monaco = useMonaco();
  const terms = [{ word: "unit" }, { word: "comp" }, { word: "pair" }, { word: "case" }, { word: "injl" }, { word: "injr" }, { word: "take" }, { word: "drop" }, { word: "iden" }];

  const [termData, setTermData] = useState(terms);

  const [editorValue, setEditorValue] = useState<Array<string>>([]);
  const [terminalValue, setTerminalValue] = useState<string>("");
  const [result, setResult] = useState<string>();

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
  }, [monaco, lng, termData]);

  const onChangeEditor = (value: string | undefined, ev: Monaco.editor.IModelContentChangedEvent) => {
    if (value) {
      const lines: string = value;
      const newLines = lines.split("\n");
      const filteredLines = newLines.filter((x) => x !== "");
      setEditorValue(filteredLines);
      console.log(filteredLines, "filtered");
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

  const onChangeEditorTwo = (value: string | undefined, event: Monaco.editor.IModelContentChangedEvent) => {
    if (value) {
      let lastLine = "";
      const lines: string = value;
      const newLines = lines.split("\n");
      if (event.changes[0].text.charCodeAt(0) === 10) {
        lastLine = newLines[newLines.length - 2];
        const cLine = lastLine.split(" ");
        if (cLine[0] !== "run") {
          setResult("ERROR");
        } else {
          setResult(cLine[1]);
        }
      }
    }
  };

  if (monaco != null) {
    return (
      <>
        <EditorHeader>Editor</EditorHeader>
        <Editor
          key="editor-one"
          height="70vh"
          onChange={onChangeEditor}
          theme="simplicityTheme"
          defaultValue="// let's write some broken code 😈"
          options={editorOptions}
          language={lng}
        />

        <Wrapper>
          <Width60>
            <EditorSection>
              <EditorHeader>Terminal</EditorHeader>
              <Editor key="editor-two" height="70vh" onChange={onChangeEditorTwo} theme="simplicityTheme" options={editorOptions} defaultValue="run" language={lng} />
            </EditorSection>
          </Width60>
          <Width40>
            <EditorSection>
              <EditorHeader>Output</EditorHeader>
              {result}
            </EditorSection>
          </Width40>
        </Wrapper>
      </>
    );
  }

  return null;
};

const Wrapper = styled.section`
  background: #1e1e1e;
  height: 30vh;
  display: flex;
  width: 100%;
`;

const Width60 = styled.section`
  background: #1e1e1e;
  height: 30vh;
  display: flex;
  width: 60%;
`;

const Width40 = styled.section`
  background: #1e1e1e;
  height: 30vh;
  display: flex;
  width: 40%;
  color: orange;
  font-size: 14px;
`;

const EditorHeader = styled.section`
  background: rgb(77, 78, 79);
  height: 0.7rem;
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
