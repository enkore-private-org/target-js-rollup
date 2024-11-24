import * as ts from "typescript"
import {_getImportMap} from "./getImportMap.mjs"
import {_isolateNodes} from "./isolateNodes.mjs"
import {_isolateTypesUsedInFunction} from "./isolateTypesUsedInFunction.mjs"
import type {Result as FunctionTypes} from "./isolateTypesUsedInFunction.mjs"
import type {Entry as ModuleSource} from "./getImportMap.mjs"

export type Entry = ({
	source: "import",
	module: ModuleSource,
	definition: () => string
}) | ({
	source: "local",
	definition: () => string
}) | ({
	source: "unknown"
})

export type Result = Map<string, Entry>

export async function _resolveUsedTypesInFunction(
	source: ts.SourceFile,
	function_types: FunctionTypes
) : Promise<Result> {
	const result : Result = new Map()
	const import_map = await _getImportMap(source)

	const local_top_level_type_nodes : ts.TypeAliasDeclaration[] = (await _isolateNodes(
		source, (node: ts.Node) => {
			if (node.parent !== source) return false
			if (!ts.isTypeAliasDeclaration(node)) return false

			return true
		}
	)) as ts.TypeAliasDeclaration[]

	const local_top_level_types = local_top_level_type_nodes.map(node => {
		return node.name.getText(source)
	})

	for (const type of function_types.types) {
		if (import_map.has(type)) {
			result.set(type, {
				source: "import",
				module: import_map.get(type)!,
				definition() {
					const used_import = import_map.get(type)!

					if (used_import.kind === "named") {
						return `import type {${used_import.import_name}} from "${used_import.module_name}"`
					} else if (used_import.kind === "default") {
						return `import type ${type} from "${used_import.module_name}"`
					} else if (used_import.kind === "star") {
						return `import type * as ${type} from "${used_import.module_name}"`
					}

					return ""
				}
			})
		} else if (local_top_level_types.includes(type)) {
			result.set(type, {
				source: "local",
				definition() {
					const node = local_top_level_type_nodes.filter(node => {
						return node.name.getText(source) === type
					})[0]

					return node.getText(source)
				}
			})
		} else {
			result.set(type, {
				source: "unknown"
			})
		}
	}

	return result
}
