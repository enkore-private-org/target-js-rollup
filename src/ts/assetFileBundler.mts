import type {
	JsBundlerPlugin,
	TsAssetFileBundlerOptions
} from "@fourtune/types/base-realm-js-and-web/v0"

import {jsBundler} from "../js/bundler.mjs"
import {tsStripTypesFromCode} from "./stripTypesFromCode.mjs"

export async function tsAssetFileBundler(
	project_root : string, entry_code : string, {
		minify = false,
		additional_plugins = [],
		on_rollup_log_fn = null
	} : TsAssetFileBundlerOptions = {}
) : Promise<string> {
	const plugin : JsBundlerPlugin = {
		when: "pre",
		plugin: {
			async transform(code : string, id : string) {
				// this also handles d.mts
				if (!id.endsWith(".mts")) return null

				return await tsStripTypesFromCode(
					code, {replace_import_extensions: false}
				)
			}
		}
	}

	return await jsBundler(
		project_root, entry_code, {
			input_file_type: "mjs",
			minify,
			treeshake: false,
			externals: [],
			additional_plugins: [
				plugin,
				...additional_plugins
			],
			on_rollup_log_fn
		}
	)
}
