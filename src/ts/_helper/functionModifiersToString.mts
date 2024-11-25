import * as ts from "typescript"

export function _functionModifiersToString(
	source: ts.SourceFile,
	fn: ts.FunctionDeclaration
) : string[] {
	if (!fn.modifiers) return []

	return fn.modifiers.map(modifier => {
		return modifier.getText(source)
	})
}
