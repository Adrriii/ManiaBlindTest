// JS rather than JSON so `tsconfigRootDir` can use __dirname.
// @typescript-eslint resolves parserOptions.project against the process cwd,
// not this file's location, so linting from the repo root (which has no
// tsconfig.json — it only contains back/ and web/) failed with
// "Cannot read file '/main/osu/blindtest/tsconfig.json'". Anchoring to
// __dirname makes it resolve to web/tsconfig.json from any cwd.
module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"next/core-web-vitals"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: ["./tsconfig.json"],
		tsconfigRootDir: __dirname
	},
	plugins: [
		"@typescript-eslint"
	],
	// Same reason: the Next plugin looks for pages/ relative to the cwd, so
	// point it at the app root explicitly.
	settings: {
		next: {
			rootDir: __dirname
		}
	},
	rules: {
		"no-empty-function": "off",
		"@next/next/no-img-element": "off",
		"@next/next/google-font-display": "off",
		"react-hooks/exhaustive-deps": "off"
	}
};
