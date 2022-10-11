import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

const terminalOptions: Monaco.editor.IEditorConstructionOptions = {
  cursorBlinking: "smooth",
  dragAndDrop: true,
  fontSize: 14,
  lineHeight: 18,
  fontFamily: "'Fira Mono', monospace",
  scrollBeyondLastLine: false,
  contextmenu: false,
  folding: false,
  wrappingIndent: "same",
  minimap: { enabled: false },
  scrollbar: {
    verticalScrollbarSize: 6,
    horizontalScrollbarSize: 6,
    alwaysConsumeMouseWheel: false,
    vertical: "hidden",
  },
  lineNumbers: () => ">",
};

export default terminalOptions;
