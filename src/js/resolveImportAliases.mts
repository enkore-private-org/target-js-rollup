// @ts-ignore:next-line
import babel from "@babel/core"
// @ts-ignore:next-line
import moduleResolver from "babel-plugin-module-resolver"

export type ResolveImportAliasesOptions = {
	filename? : string
	aliases? : any
}

export async function jsResolveImportAliases(
	code : string, {
		filename = "index.mjs",
		aliases = {}
	} : ResolveImportAliasesOptions = {}
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
