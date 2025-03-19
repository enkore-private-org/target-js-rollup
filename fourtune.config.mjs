export default {
	realm: {
		name: "js",
		type: "package",

		options: {
			runtime: "node",
			external_npm_packages: [
				"typescript",
				"@babel/core",
				"@babel/preset-typescript"
			]
		}
	}
}
