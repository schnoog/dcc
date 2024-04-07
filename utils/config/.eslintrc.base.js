module.exports = {
	extends: [require.resolve("@kilcekru/ts-basics/.eslintrc.js")],
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			rules: {
				"@typescript-eslint/no-redundant-type-constituents": "off",
			},
		},
	],
};
