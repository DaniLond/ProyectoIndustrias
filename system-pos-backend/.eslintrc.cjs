module.exports = {
	root: true,
	env: { node: true, es2020: true },
	extends: ['eslint:recommended', 'eslint-config-prettier'],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
};
