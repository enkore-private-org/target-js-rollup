import * as ts from "typescript"
import {_functionModifiersToString} from "../_helper/functionModifiersToString.mjs"

export function _checkImplementation(
	source: ts.SourceFile,
	implementation: ts.FunctionDeclaration,
	expect_async_implementation: boolean|null
) : string {
	if (2 > implementation.parameters.length) return "implementation must have at least 2 parameters."

	const [context_param, deps_param] = implementation.parameters

	if (!context_param.type || !deps_param.type) {
		return "context or dependencies parameter does not have a type"
	}

	const context_param_type = context_param.type.getText(source)
	const deps_param_type = deps_param.type.getText(source)

	if (context_param_type !== "ContextInstance") {
		return "context parameter must be of type ContextInstance"
	} else if (deps_param_type !== "AnioJsDependencies") {
		return "dependencies parameter must be of type AnioJsDependencies"
	}

	const modifiers = _functionModifiersToString(source, implementation)

	if (expect_async_implementation === true && !modifiers.includes("async")) {
		return "expected async implementation, but got sync implementation instead"
	} else if (expect_async_implementation === false && modifiers.includes("async")) {
		return "expected sync implementation, but got async implementation instead"
	}

	return ""
}
