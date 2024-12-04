import ts from "typescript"
import {
	getExportByName,
	type Instance,
	getImportByIdentifier
} from "@aniojs/node-ts-utils"

export function generateFactoryCode(
	inst: Instance,
	implementation: ts.FunctionDeclaration
) : string {
	const anio_js_dependencies_export = getExportByName(inst, "AnioJsDependencies", "type-only")

	if (anio_js_dependencies_export) {
		let source : ts.TypeAliasDeclaration|ts.ImportDeclaration|undefined

		const {node} = anio_js_dependencies_export

		// export type {AnioJsDependencies} style
		if (ts.isExportSpecifier(node)) {
			const anio_js_dependencies_import = getImportByIdentifier(inst, "AnioJsDependencies", "type-only")

			if (!anio_js_dependencies_import) {
				throw new Error(
					`Unable to find import statement for "AnioJsDependencies".`
				)
			}

			source = anio_js_dependencies_import.node
		}
		// export type AnioJsDependencies = {} style
		else if (ts.isTypeAliasDeclaration(node)) {
			source = node
		} else {
			throw new Error(`Invalid node kind for "AnioJsDependencies" type export.`)
		}

	}

	return ""

}
