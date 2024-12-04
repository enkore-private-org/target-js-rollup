// @ts-ignore:next-line
import babel from "@babel/core"
// @ts-ignore:next-line
import presetTypeScript from "@babel/preset-typescript"

import type {TsStripTypesFromCodeOptions} from "@fourtune/types/base-realm-js-and-web/v0"

export async function tsStripTypesFromCode(
	code : string, {
		filename = "index.mts",
		replace_import_extensions = false
	} : TsStripTypesFromCodeOptions = {}
) : Promise<string> {
	if (!filename.endsWith(".mts")) {
		throw new Error(
			`Filename must end with ".mts".`
		)
	}

	const options = {
		presets: [
			[presetTypeScript, {
				rewriteImportExtensions: replace_import_extensions
			}]
		],
		filename: filename
	}

	return (await babel.transformAsync(
		code, options
	)).code
}
