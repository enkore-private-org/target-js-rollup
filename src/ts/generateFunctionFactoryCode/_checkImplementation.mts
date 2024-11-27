import * as ts from "typescript"
import {convertFunctionDeclaration} from "../utils/convertFunctionDeclaration.mjs"

export function _checkImplementation(
	implementation: ts.FunctionDeclaration,
	expect_async_implementation: boolean|null
) : string {
	const fn = convertFunctionDeclaration(implementation)

	if (2 > fn.params.length) return "implementation must have at least 2 parameters."

	const [context_param, deps_param] = fn.params

	if (context_param.type !== "RuntimeWrappedContextInstance") {
		return "context parameter must be of type RuntimeWrappedContextInstance"
	} else if (deps_param.type !== "AnioJsDependencies") {
		return "dependencies parameter must be of type AnioJsDependencies"
	}

	if (expect_async_implementation === true && !fn.modifiers.includes("async")) {
		return "expected async implementation, but got sync implementation instead"
	} else if (expect_async_implementation === false && fn.modifiers.includes("async")) {
		return "expected sync implementation, but got async implementation instead"
	}

	return ""
}
