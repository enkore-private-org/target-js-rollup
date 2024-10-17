import process from "node:process"
import {rollup} from "rollup"
import virtual from "@rollup/plugin-virtual"
import terser from "@rollup/plugin-terser"
import resolveNode from "@rollup/plugin-node-resolve"
import path from "node:path"

import createVirtualEntry from "./bundler/createVirtualEntry.mjs"
import sortAdditionalPlugins from "./bundler/sortAdditionalPlugins.mjs"
import dts_resolver from "./bundler/dts_resolver.mjs"
import {tsReadTSConfigFile} from "../ts/readTSConfigFile.mjs"
import {dts} from "rollup-plugin-dts"

export async function jsBundler(
	project_root, entry_code, {
		input_file_type = "mjs",
		minify = false,
		additional_plugins = [],
		on_rollup_log_fn = null
	} = {}
) {
	const options = {input_file_type}
	const plugins = sortAdditionalPlugins(additional_plugins)

	const saved_cwd = process.cwd()

	//
	// needed to make node resolve work properly
	//
	process.chdir(project_root)

	try {
		const virtual_entries = createVirtualEntry(options, entry_code)

		const rollup_options = {
			input: Object.keys(virtual_entries)[0],
			output: {
				format: "es"
			}
		}

		const rollup_plugins = [virtual(virtual_entries)]

		if (input_file_type === "dts") {
			const compiler_options = await tsReadTSConfigFile(
				path.join(project_root, "tsconfig.json")
			)

			rollup_plugins.push(dts_resolver(project_root))

			rollup_plugins.push(dts({
				respectExternal: true,
				compilerOptions: {
					...compiler_options,
					//
					// overwrite paths alias since
					// those will be resolved by "dts_resolver"
					//
					paths: {}
				}
			}))
		} else if (input_file_type === "mjs") {
			rollup_plugins.push(resolveNode())
		}

		if (input_file_type === "mjs" && minify) {
			rollup_plugins.push(terser())
		}

		const bundle = await rollup({
			...rollup_options,
			plugins: [
				...plugins.pre,
				...rollup_plugins,
				...plugins.post
			],
			onLog(level, error) {
				if (on_rollup_log_fn === null) return

				on_rollup_log_fn(level, error)
			}
		})

		const {output} = await bundle.generate(rollup_options.output)

		return output[0].code
	} finally {
		process.chdir(saved_cwd)
	}
}
