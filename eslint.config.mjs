import antfu from "@antfu/eslint-config";

export default antfu({
	stylistic: {
		semi: true,
		indent: "tab",
		quotes: "double",
		commaDangle: "always-multiline",
	},
});
