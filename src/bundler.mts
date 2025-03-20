import type {
	JsBundlerOptions
} from "#~src/types/JsBundlerOptions.d.mts"

import {
	type OutputOptions as RollupOutputOptions,
	type Plugin as RollupPlugin,
	type RollupOptions,
	rollup
} from "rollup"

import nodeResolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"

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

		const {onRollupLogFunction} = options
		let onLog: RollupOptions["onLog"]|undefined = undefined

		if (typeof onRollupLogFunction === "function") {
			onLog = (level, {message}) => {
				onRollupLogFunction(level, message)
			}
		}

		if (inputFileType === "mjs") {
			// @ts-ignore:next-line
			rollupPlugins.push(nodeResolve())
		} else {
			// todo: implement dts bundling
		}

		if (options.minify === true && inputFileType === "mjs") {
			// @ts-ignore:next-line
			rollupPlugins.push(terser())
		}

		const rollupOptions: RollupOptions = {
			output: rollupOutputOptions,
			plugins: rollupPlugins,
			treeshake: options.treeshake === true,
			onLog
		}

		const bundle = await rollup(rollupOptions)

		const {output} = await bundle.generate(rollupOutputOptions)

		return output[0].code
	} finally {
		process.chdir(savedCWD)
	}
}
