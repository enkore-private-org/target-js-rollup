import * as ts from "typescript"
import {_isolateNodes} from "./isolateNodes.mjs"

export type Result = {
	types: string[],
	generic_types: string[]
}

const global_types = ["Promise"]

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

	return {
		types,
		generic_types
	}
}
