import * as ts from "typescript"

export function _functionTypeParametersToString(
	source: ts.SourceFile,
	fn: ts.FunctionDeclaration
) : string {
	if (!fn.typeParameters) return ""

	return "<" + fn.typeParameters.map(type => {
		return type.getText(source)
	}).join(", ") + ">"
}
