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
import { parse } from "path";

const lng = "simplicity";

type SimplicityData = {
  term: string;
  program: string;
};

const terms = [{ word: "unit" }, { word: "comp" }, { word: "pair" }, { word: "case" }, { word: "injl" }, { word: "injr" }, { word: "take" }, { word: "drop" }, { word: "iden" }];

export const SimplicityEditor = () => {
  const monaco = useMonaco();

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
  const [programData, setProgramData] = useState<SimplicityData[]>([]);
  const [termList, setTermList] = useState<{ word: string }[]>(terms);

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
          const suggestions = languageOptions.languageSuggestions(monaco.languages, model, position, termList);
          return { suggestions: suggestions };
        },
      });

      disposeCompletionItemProvider = disposeRegisterCompletionItemProvider;
    }

    return () => {
      if (monaco !== undefined) {
        disposeLanguageConfiguration();
        disposeMonarchTokensProvider();
        disposeCompletionItemProvider();
      }
    };
  }, [monaco, termList]);

  const onChangeEditor = (value: string | undefined) => {
    if (value && value !== "") {
      const lines: string = value;
      const newLines = lines.split("\n");
      const filteredLines = newLines.filter((x) => x !== "" && !x.startsWith("//"));
      let finalData: SimplicityData[] = [];

      filteredLines.forEach((fl) => {
        const parsedData = fl.split(" ");

        if (parsedData.length > 2) {
          const isFunction = parsedData[1] === ":=";
          if (isFunction) {
            const term = parsedData[0];
            const program = parsedData.slice(2).join("");

            const functionIndex = finalData.findIndex((pd) => pd.term === term);

            if (functionIndex > -1) {
              setErrorMessage("Duplicate term!");
            } else {
              const result = { term, program };
              finalData.push(result);
            }
          }
        }

        const newTerms = finalData.map((fd) => {
          return { word: fd.term };
        });

        setTermList([...terms, ...newTerms]);
        setProgramData(finalData);
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
          onChange={(value: string | undefined) => {
            onChangeEditor(value);
          }}
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
