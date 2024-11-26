import * as ts from "typescript"

export type Test = (node: ts.Node) => boolean

export function isolateNodes(
	input_node: ts.Node,
	test: Test
) : ts.Node[] {
	const result : ts.Node[] = []

	function visitor(node: ts.Node) {
		if (test(node)) {
			result.push(node)
		}

		return ts.visitEachChild(node, visitor, undefined)
	}

	ts.visitNode(input_node, visitor)

	return result
}
