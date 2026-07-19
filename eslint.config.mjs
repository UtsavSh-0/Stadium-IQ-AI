import nextConfig from "eslint-config-next";

// Migrated from the legacy .eslintrc.json ("extends": ["next/core-web-vitals"]).
// ESLint 9 / `next lint` in Next.js 16 only read the flat config format, so the
// old file was being silently ignored and `npm run lint` was not actually
// linting anything. eslint-config-next now ships a native flat config array,
// which is more reliable here than routing through @eslint/eslintrc's
// FlatCompat shim (which hits a circular-JSON bug with this plugin version).
const eslintConfig = [
  ...nextConfig,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**"],
  },
];

export default eslintConfig;
