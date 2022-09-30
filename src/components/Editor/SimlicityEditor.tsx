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
  const [result, setResult] = useState<string>();

  let disposeLanguageConfiguration = () => {};
  let disposeMonarchTokensProvider = () => {};
  let disposeCompletionItemProvider = () => {};

  useEffect(() => {
    if (monaco) {
      console.log(termData);

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
  const onChangeEditorTwo = (value: string | undefined, ev: Monaco.editor.IModelContentChangedEvent) => {
    if (value) {
      const lines: string = value;
      const newLines = lines.split("\n");
      if (newLines.length > 1) {
        setResult(newLines[0]);
      }
    }
  };

  if (monaco != null) {
    return (
      <>
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
            <Editor
              key="editor-two"
              height="70vh"
              onChange={onChangeEditorTwo}
              theme="simplicityTheme"
              defaultValue="// let's write some broken code 😈"
              options={editorOptions}
              language={lng}
            />
          </Width60>
          <Width40>{result}</Width40>
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
`;
