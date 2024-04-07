module.exports = {
	extends: ["../../../utils/config/.eslintrc.node.js"],
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"],
	},
};
