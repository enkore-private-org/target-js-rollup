import babel from "@babel/core"
import presetTypeScript from "@babel/preset-typescript"

export async function tsStripTypesFromCode(
	code, {
		filename = "index.mts",
		replace_import_extensions = false
	} = {}
) {
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

	return await babel.transformAsync(
		code, options
	)
}
