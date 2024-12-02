import * as ts from "typescript"
import {isolateNodes} from "./isolateNodes.mjs"
import {convertFunctionDeclaration} from "./convertFunctionDeclaration.mjs"

export function isolateExportedFunction(
	source: ts.SourceFile,
	function_name: string
) : ts.FunctionDeclaration|null {
	const nodes = (isolateNodes(
		source, (node: ts.Node) => {
			if (node.parent !== source) return false
			if (!ts.isFunctionDeclaration(node)) return false

			const decl = convertFunctionDeclaration(node)

			if (!decl.modifiers.includes("export")) return false

			return decl.name === function_name
		}
	)) as ts.FunctionDeclaration[]

	if (nodes.length === 1) return nodes[0]

	return null
}
