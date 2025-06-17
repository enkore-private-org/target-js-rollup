import type {JsBundlerOptions} from "./JsBundlerOptions.mts"
import {bundler} from "#~src/bundler.mts"

export async function jsBundler(
	projectRoot: string,
	entryCode: string,
	options: JsBundlerOptions = {
		outputFormat: "es",
		minify: false,
		treeshake: false,
		externals: [],
		additionalPlugins: [],
		onRollupLogFunction: undefined
	}
): Promise<string> {
	const {
		outputFormat,
		minify,
		treeshake,
		externals,
		additionalPlugins,
		onRollupLogFunction
	} = options

	return await bundler("js", projectRoot, entryCode, {
		outputFormat,
		minify,
		treeshake,
		externals,
		additionalPlugins,
		onRollupLogFunction
	})
}
