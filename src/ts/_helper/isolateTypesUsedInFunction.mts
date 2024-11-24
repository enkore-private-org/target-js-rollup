import * as ts from "typescript"
import {_isolateNodes} from "./isolateNodes.mjs"

export type Result = {
	types: string[],
	generic_types: string[]
}

const global_types = ["Promise"]

async function _resolveDeep(
	source: ts.SourceFile,
	generic_types: string[],
	parameter_types: string[],
) : Promise<Result> {
	const result : string[] = []

	const top_level_source_types : ts.TypeAliasDeclaration[] = (await _isolateNodes(
		source, (node: ts.Node) => {
			if (node.parent !== source) return false
			if (!ts.isTypeAliasDeclaration(node)) return false

			return true
		}
	)) as ts.TypeAliasDeclaration[]

	for (const top_level_type_node of top_level_source_types) {
		const type_reference_nodes : ts.TypeReferenceNode[] = (await _isolateNodes(
			top_level_type_node, (node: ts.Node) => {
				if (!ts.isTypeReferenceNode(node)) return false

				return true
			}
		)) as ts.TypeReferenceNode[]

		for (const type_node of type_reference_nodes) {
			const type_name = type_node.typeName.getText(source)

			// ignore generic types from function
			if (generic_types.includes(type_name)) continue
			// ignore global types
			if (global_types.includes(type_name)) continue
			if (result.includes(type_name)) continue

			result.push(type_name)
		}
	}

	// add other types
	for (const type_name of parameter_types) {
		if (result.includes(type_name)) continue

		result.push(type_name)
	}

	return {
		types: result,
		generic_types
	}
}

export async function _isolateTypesUsedInFunction(
	source: ts.SourceFile,
	fn: ts.FunctionDeclaration
) : Promise<Result> {
	const generic_types = fn.typeParameters ? fn.typeParameters.map(t => {
		return t.getText(source)
	}) : []

	const type_nodes : ts.TypeReferenceNode[] = (await _isolateNodes(
		fn, (node: ts.Node) => {
			if (!ts.isTypeReferenceNode(node)) return false

			return true
		}
	)) as ts.TypeReferenceNode[]

	const types = type_nodes.map(node => {
		return node.typeName.getText(source)
	}).filter(type => {
		return !generic_types.includes(type)
	}).filter(type => {
		return !global_types.includes(type)
	})

	return await _resolveDeep(
		source, generic_types, types
	)
}
