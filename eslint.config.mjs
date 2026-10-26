import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// Keep the project on its existing React Hooks policy until React Compiler is enabled.
const reactCompilerRules = {
  "react-hooks/config": "off",
  "react-hooks/error-boundaries": "off",
  "react-hooks/gating": "off",
  "react-hooks/globals": "off",
  "react-hooks/immutability": "off",
  "react-hooks/incompatible-library": "off",
  "react-hooks/preserve-manual-memoization": "off",
  "react-hooks/purity": "off",
  "react-hooks/refs": "off",
  "react-hooks/set-state-in-effect": "off",
  "react-hooks/set-state-in-render": "off",
  "react-hooks/static-components": "off",
  "react-hooks/unsupported-syntax": "off",
  "react-hooks/use-memo": "off",
};

export default defineConfig([
  ...nextVitals,
  { rules: reactCompilerRules },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
