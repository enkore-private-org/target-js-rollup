// @ts-ignore:next-line
import babel from "@babel/core"
// @ts-ignore:next-line
import presetTypeScript from "@babel/preset-typescript"

export type TsStripTypesFromCodeOptions = {
	filename? : string
	replace_import_extensions? : boolean
}

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
