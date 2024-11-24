import * as ts from "typescript"
import {_isolateNodes} from "./isolateNodes.mjs"

export type Entry = ({
	module_name: string
	is_type_only: boolean
}) & ({
	kind: "named",
	import_name: string
} | {
	kind: "star"
} | {
	kind: "default"
})

export type ImportMap = Map<string, Entry>

export async function _getImportMap(
	source: ts.SourceFile
) : Promise<ImportMap> {
	const ret : ImportMap = new Map()

	const import_nodes : ts.ImportDeclaration[] = (
		await _isolateNodes(source, (node: ts.Node) => {
			if (!ts.isImportDeclaration(node)) return false
			if (!node.importClause) return false

			return true
		})
	) as ts.ImportDeclaration[]

	for (const import_node of import_nodes) {
		const module_name = import_node.moduleSpecifier.getText(
			source
		).toString().slice(1).slice(0, -1)

		const clause : ts.ImportClause = import_node.importClause!

		const is_type_only = clause.isTypeOnly

		if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
			for (const element of clause.namedBindings.elements) {
				const identifier = element.name.getText(source)
				
				const import_name = element.propertyName ? element.propertyName.getText(
					source
				) : identifier

				ret.set(
					identifier, {
						kind: "named",
						is_type_only,
						module_name,
						import_name
					}
				)
			}
		} else if (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
			ret.set(
				clause.namedBindings.name.getText(source), {
					kind: "star",
					is_type_only,
					module_name,
				}
			)
		} else if (clause.name) {
			ret.set(
				clause.name!.getText(source), {
					kind: "default",
					is_type_only,
					module_name,
				}
			)
		}
	}

	return ret
}
