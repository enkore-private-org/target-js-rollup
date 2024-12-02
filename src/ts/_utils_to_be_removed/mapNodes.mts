import * as ts from "typescript"

export type Map<T> = (node: ts.Node) => T|null

export function mapNodes<T>(
	input_node: ts.Node,
	map: Map<T>
) : (T|null)[] {
	const result : (T|null)[] = []

	function visitor(node: ts.Node) {
		result.push(map(node))

		return ts.visitEachChild(node, visitor, undefined)
	}

	ts.visitNode(input_node, visitor)

	return result
}
