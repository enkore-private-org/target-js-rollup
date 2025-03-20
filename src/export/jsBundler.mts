import type {JsBundlerOptions} from "./JsBundlerOptions.d.mts"
import {bundler} from "#~src/bundler.mts"

export async function jsBundler(
	projectRoot: string,
	entryCode: string,
	options: JsBundlerOptions = {
		minify: false,
		treeshake: false,
		externals: [],
		additionalPlugins: [],
		onRollupLogFunction: undefined
	}
): Promise<string> {
	const {
		minify,
		treeshake,
		externals,
		additionalPlugins,
		onRollupLogFunction
	} = options

	return await bundler("mjs", projectRoot, entryCode, {
		minify,
		treeshake,
		externals,
		additionalPlugins,
		onRollupLogFunction
	})
}
