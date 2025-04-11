import {
	createConfig,
	createTargetJSNodeOptions
} from "enkore/spec/factory"

export default createConfig({
	target: {
		name: "js-node",
		options: createTargetJSNodeOptions({
			publishWithExactDependencyVersions: true,
			createTypesPackage: {
				orgName: "@enkore-types"
			},
			externalPackages: [
				"rollup",
				"@rollup/plugin-virtual",
				"@rollup/plugin-node-resolve",
				"@rollup/plugin-commonjs",
				"@rollup/plugin-terser",
				"@aniojs/node-ts-utils",
				"rollup-plugin-dts"
			]
		})
	}
})
