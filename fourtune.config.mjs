export default {
	realm: {
		name: "js",
		type: "package",

		options: {
			runtime: "node",
			external_npm_packages: [
				"rollup",
				"@rollup/plugin-virtual",
				"@rollup/plugin-node-resolve",
				"@rollup/plugin-commonjs",
				"@rollup/plugin-terser"
			]
		}
	}
}
