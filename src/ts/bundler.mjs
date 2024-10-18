import {jsBundler} from "../js/bundler.mjs"
import {tsStripTypesFromCode} from "./stripTypesFromCode.mjs"
import {jsResolveImportAliases } from "../js/resolveImportAliases.mjs"

export async function tsBundler(
	project_root, entry_code, {
		aliases = {},
		on_rollup_log_fn = null
	} = {}
) {
	const additional_plugins = []

	additional_plugins.push({
		when: "pre",
		plugin: {
			async transform(code, id) {
				if (!id.endsWith(".mts")) return null

				const {code: js} = await tsStripTypesFromCode(
					code, {replace_import_extensions: false}
				)

				return (await jsResolveImportAliases(
					js, {aliases}
				)).code
			}
		}
	})

	return await jsBundler(
		project_root, entry_code, {
			input_file_type: "mjs",
			minify: false,
			additional_plugins,
			on_rollup_log_fn
		}
	)
}
