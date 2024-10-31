import type {JsBundlerPlugin} from "../js/bundler.mjs"
import {jsBundler} from "../js/bundler.mjs"
import {tsStripTypesFromCode} from "./stripTypesFromCode.mjs"
import {jsResolveImportAliases } from "../js/resolveImportAliases.mjs"

export type TsBundlerOptions = {
	minify? : boolean
	treeshake? : boolean
	additional_plugins? : JsBundlerPlugin[],
	aliases? : any,
	on_rollup_log_fn? : ((...args: any[]) => any) | null
}

export async function tsBundler(
	project_root : string, entry_code : string, {
		minify = false,
		treeshake = true,
		additional_plugins = [],
		aliases = {},
		on_rollup_log_fn = null
	} : TsBundlerOptions = {}
) : Promise<string> {
	const plugin : JsBundlerPlugin = {
		when: "pre",
		plugin: {
			async transform(code : string, id : string) {
				if (!id.endsWith(".mts")) return null

				const js_code = await tsStripTypesFromCode(
					code, {replace_import_extensions: false}
				)

				return await jsResolveImportAliases(
					js_code, {aliases}
				)
			}
		}
	}

	return await jsBundler(
		project_root, entry_code, {
			input_file_type: "mjs",
			minify,
			treeshake,
			additional_plugins: [
				plugin,
				...additional_plugins
			],
			on_rollup_log_fn
		}
	)
}
