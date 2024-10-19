import babel from "@babel/core"
import moduleResolver from "babel-plugin-module-resolver"

export async function jsResolveImportAliases(
	code, {
		filename = "index.mjs",
		aliases = {}
	}
) {
	if (!filename.endsWith(".mjs")) {
		throw new Error(
			`Filename must end with ".mjs".`
		)
	}

	return await babel.transformAsync(
		code, {
			plugins: [
				[moduleResolver, {
					alias: aliases
				}]
			]
		}
	)
}
