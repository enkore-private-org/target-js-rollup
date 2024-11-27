import * as ts from "typescript"
import {isolateNodes} from "../utils/isolateNodes.mjs"
import {getImportMap, type ImportMap} from "../utils/getImportMap.mjs"

// this API is used to extract defined anio-software dependencies
// in a function file format like this:

// myFunction.mts
//
// import {dep1Function} from "@anio-software/dep1"
// import {dep2Function} from "@anio-software/dep2"
//
// export type AnioJsDependencies = {
// 	dep1: typeof dep1Function
// 	dep2: typeof dep2Function
// }

// this allows us to automatically generate the code
// that calls the factories (dep1FunctionFactory, dep2FunctionFactory)
// for both dependencies.

type Entry = {
	module_name: string,
	export_name: string
}

export type AnioJsDependencyMap = Map<string, Entry>

function handleTypeAliasDeclaration(
	source: ts.SourceFile,
	node: ts.TypeAliasDeclaration,
	dependencies: AnioJsDependencyMap
) {
	const import_map : ImportMap = getImportMap(source)

	// only consider export'ed "Dependencies" type
	if (!node.modifiers) return
	if (node.modifiers[0].getText(source) !== "export") return

	if (!ts.isTypeLiteralNode(node.type)) return

	for (const member of node.type.members) {
		if (!member.name) continue
		if (!ts.isPropertySignature(member)) continue
		if (!member.type) continue
		if (!ts.isTypeQueryNode(member.type)) continue

		const dependency_key = member.name.getText(source)
		const dependency_identifier = member.type.exprName.getText(source)

		if (!import_map.has(dependency_identifier)) continue

		const import_info = import_map.get(dependency_identifier)!

		if (import_info.kind !== "named") continue

		dependencies.set(
			dependency_key,
			{
				module_name: import_info.module_name,
				export_name: import_info.import_name
			}
		)
	}
}

export function _getDeclaredAnioSoftwareDependencies(
	source: ts.SourceFile,
) : AnioJsDependencyMap|null {
	const ret : AnioJsDependencyMap = new Map()

	const anio_js_dependencies_type_nodes : ts.TypeAliasDeclaration[] = (isolateNodes(
		source, (node: ts.Node) => {
			if (node.parent !== source) return false
			if (!ts.isTypeAliasDeclaration(node)) return false
			if (node.name.getText(source) !== "AnioJsDependencies") return false

			return true
		}
	)) as ts.TypeAliasDeclaration[]

	if (anio_js_dependencies_type_nodes.length !== 1) {
		return null
	}

	handleTypeAliasDeclaration(
		source,
		anio_js_dependencies_type_nodes[0],
		ret
	)

	return ret
}
