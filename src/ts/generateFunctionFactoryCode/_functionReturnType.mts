import * as ts from "typescript"
import {_functionModifiersToString} from "../_helper/functionModifiersToString.mjs"

export function _functionReturnType(
	source: ts.SourceFile,
	fn: ts.FunctionDeclaration
) : string {
	const modifiers = _functionModifiersToString(source, fn)

	if (modifiers.includes("async")) {
		if (!fn.type) {
			return "Promise<any>"
		}
	} else {
		if (!fn.type) {
			return "any"
		}
	}

	return fn.type.getText(source)
}
