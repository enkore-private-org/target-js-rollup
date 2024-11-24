import * as ts from "typescript"

import {_isolateNodes} from "./isolateNodes.mjs"

export async function _isolateExportedFunction(
	source: ts.SourceFile,
	function_name: string
) : Promise<ts.FunctionDeclaration|null> {
	const nodes = await _isolateNodes(
		source, (node: ts.Node) => {
			if (node.parent !== source) return false
			if (!ts.isFunctionDeclaration(node)) return false
			if (!node.modifiers) return false
			if (!node.name) return false

			const modifiers = node.modifiers.map(m => m.getText(source))

			if (!modifiers.includes("export")) return false

			return node.name.getText(source) === function_name
		}
	)

	return nodes.length ? (
		nodes[0] as ts.FunctionDeclaration
	) : null
}
