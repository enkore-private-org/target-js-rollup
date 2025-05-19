import {
	createConfig,
	createTargetJSNodeOptions
} from "@anio-software/enkore/spec/factory"

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
			],

			registry: {
				"anioSoftware": {
					url: "https://npm-registry.anio.software",
					authTokenFilePath: "secrets/anio_npm_auth_token",
					clientPrivateKeyFilePath: "secrets/npm_client.pkey",
					clientCertificateFilePath: "secrets/npm_client.cert"
				}
			},

			packageSourceRegistryByScope: {
				"@anio-software": {
					registry: "anioSoftware"
				}
			},

			publish: [{
				packageName: "@anio-software/enkore-private.target-js-rollup",
				registry: "anioSoftware"
			}]
		})
	}
})
