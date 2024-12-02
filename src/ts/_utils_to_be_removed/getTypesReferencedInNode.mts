import * as ts from "typescript"
import {isolateNodes} from "./isolateNodes.mjs"

const global_types : string[] = [
	"Promise"
]

export function getTypesReferencedInNode(
	node: ts.Node,
	ignored_types?: string[]
) : string[] {
	const required_types : string[] = []

	const type_reference_nodes : ts.TypeReferenceNode[] = (
		isolateNodes(node, (node: ts.Node) => {
			if (!ts.isTypeReferenceNode(node)) return false

			return true
		})
	) as ts.TypeReferenceNode[]

	for (const type_reference_node of type_reference_nodes) {
		const type_name = type_reference_node.typeName.getText(
			type_reference_node.getSourceFile()
		)

		if (global_types.includes(type_name)) continue
		if (required_types.includes(type_name)) continue
		if (ignored_types && ignored_types.includes(type_name)) continue

		required_types.push(type_name)
	}

	return required_types
}
