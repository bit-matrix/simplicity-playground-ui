import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

const themeOptions: Monaco.editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: false,
  rules: [
    { token: "delimiter.evaluation", foreground: "#3c9dda" },
    { token: "delimiter.push", foreground: "#3c9dda" },
    { token: "simplicity.terms", foreground: "#d9daa2" },
    { token: "identifier", foreground: "#209be3" },
    { token: "literal.bigint", foreground: "#87edae" },
    { token: "literal.hex", foreground: "#034a03" },
    { token: "literal.binary", foreground: "#ab64de" },
    { token: "literal.syntax", foreground: "#ffffff" },
    { token: "invalid", foreground: "#fa0c18" },
    { token: "comment", foreground: "#6A9955" },
    { token: "", background: "#181B1E" },
    { token: "", foreground: "#3c9dda" },
  ],
  colors: {
    "editor.foreground": "#FFFFFF",
    "editor.background": "#181B1E",
  },
};

export default themeOptions;
