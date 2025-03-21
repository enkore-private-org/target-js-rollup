import type {
	JsBundlerOptions,
	JsBundlerPlugin
} from "#~src/types/JsBundlerOptions.mts"

import {
	type OutputOptions as RollupOutputOptions,
	type Plugin as RollupPlugin,
	type RollupOptions,
	rollup
} from "rollup"

import path from "node:path"
import {readTSConfigFile} from "@aniojs/node-ts-utils"

import virtual from "@rollup/plugin-virtual"
import nodeResolve from "@rollup/plugin-node-resolve"
import commonJs from "@rollup/plugin-commonjs"
import dts from "rollup-plugin-dts"
import terser from "@rollup/plugin-terser"

export type BundlerInputFileType = "mjs" | "dts"

function getVirtualEntryPath(inputFileType: BundlerInputFileType) {
	if (inputFileType === "dts") {
		return "virtualEntry.d.mts"
	}

	return "virtualEntry.mjs"
}

function filterPlugins(plugins: JsBundlerPlugin[]|undefined, what: "pre" | "post") {
	if (!plugins) return []

	return plugins.filter(x => {
		return x.when === what
	}).map(x => x.plugin)
}

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

		const {onRollupLogFunction} = options
		let onLog: RollupOptions["onLog"]|undefined = undefined

		if (typeof onRollupLogFunction === "function") {
			onLog = (level, {message}) => {
				onRollupLogFunction(level, message)
			}
		}

		const virtualEntryPath = getVirtualEntryPath(inputFileType)

		const rollupPlugins: RollupPlugin[] = [
			// @ts-ignore:next-line
			virtual({
				[virtualEntryPath]: entryCode
			})
		]

		if (options.externals) {
			const {externals} = options

			rollupPlugins.push({
				name: "enkore-externals-plugin",
				resolveId(id) {
					if (externals.includes(id)) {
						return {id, external: true}
					}

					return null
				}
			})
		}

		if (inputFileType === "mjs") {
			// @ts-ignore:next-line
			rollupPlugins.push(nodeResolve())
			// @ts-ignore:next-line
			rollupPlugins.push(commonJs())
		} else {
			const {compilerOptions} = readTSConfigFile(
				projectRoot, path.join(projectRoot, "tsconfig", "base.json")
			)

			delete compilerOptions.baseUrl
			delete compilerOptions.paths

			compilerOptions.declaration = true
			compilerOptions.emitDeclarationOnly = true
			compilerOptions.skipLibCheck = false

			rollupPlugins.push(dts({
				respectExternal: true,
				compilerOptions
			}))
		}

		if (options.minify === true && inputFileType === "mjs") {
			// @ts-ignore:next-line
			rollupPlugins.push(terser())
		}

		const rollupOptions: RollupOptions = {
			input: virtualEntryPath,
			output: rollupOutputOptions,
			plugins: [
				...filterPlugins(options.additionalPlugins, "pre"),
				...rollupPlugins,
				...filterPlugins(options.additionalPlugins, "post")
			],
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
