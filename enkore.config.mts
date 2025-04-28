import {
	createConfig,
	createTargetJSNodeOptions
} from "enkore/spec/factory"

export const config: unknown = createConfig({
	target: {
		name: "js-node",
		options: createTargetJSNodeOptions({
			publishWithExactDependencyVersions: true,
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
