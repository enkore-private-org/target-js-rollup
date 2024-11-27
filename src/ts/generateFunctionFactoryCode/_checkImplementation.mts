import * as ts from "typescript"
import {convertFunctionDeclaration} from "../utils/convertFunctionDeclaration.mjs"

export function _checkImplementation(
	implementation: ts.FunctionDeclaration,
	expect_async_implementation: boolean|null
) : string {
	const fn = convertFunctionDeclaration(implementation)

	if (1 > fn.params.length) return "Implementation must have at least 1 parameter."

	const [context_param] = fn.params

	if (context_param.type !== "RuntimeWrappedContextInstance") {
		return "Context parameter must be of type RuntimeWrappedContextInstance"
	}

	if (expect_async_implementation === true && !fn.modifiers.includes("async")) {
		return "Expected async implementation, but got sync implementation instead."
	} else if (expect_async_implementation === false && fn.modifiers.includes("async")) {
		return "Expected sync implementation, but got async implementation instead."
	}

	return ""
}
