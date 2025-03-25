import {defineConfig} from "enkore"
import {defineRealmConfig} from "@enkore/realm-js"

export default defineConfig({
	realm: {
		name: "js",
		config: defineRealmConfig({
			runtime: "node",
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
