import * as ts from "typescript"

export function _printNode(
	source: ts.SourceFile,
	node: ts.Node,
	indent_level: number = 0,
	remove_comments: boolean = false
) : string {
	const str = ts.createPrinter({
		removeComments: remove_comments
	}).printNode(
		ts.EmitHint.Unspecified,
		node,
		source
	)

	let result = str

	if (indent_level > 0) {
		const indent = "\t".repeat(indent_level)

		result  = `${indent}`
		result += str.split("\n").join(`\n${indent}`)
	}

	return result
}
