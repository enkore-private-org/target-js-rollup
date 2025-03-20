import type {
	JsBundlerOptions
} from "#~src/types/JsBundlerOptions.d.mts"

import {
	type OutputOptions as RollupOutputOptions,
	type Plugin as RollupPlugin,
	type RollupOptions,
	rollup
} from "rollup"

export type BundlerInputFileType = "mjs" | "dts"

export async function bundler(
	inputFileType: BundlerInputFileType,
	projectRoot: string,
	entryCode: string,
	options: JsBundlerOptions
): Promise<string> {
	const savedCWD = process.cwd()

	//
	// needed to make node resolve work properly
	//
	process.chdir(projectRoot)

	try {
		const rollupOutputOptions: RollupOutputOptions = {
			format: "es"
		}

		const rollupPlugins: RollupPlugin[] = []

		const rollupOptions: RollupOptions = {
			output: rollupOutputOptions,
			plugins: rollupPlugins,
			treeshake: options.treeshake === true
		}

		const bundle = await rollup(rollupOptions)

		const {output} = await bundle.generate(rollupOutputOptions)

		return output[0].code
	} finally {
		process.chdir(savedCWD)
	}
}
