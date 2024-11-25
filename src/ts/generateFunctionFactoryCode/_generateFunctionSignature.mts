import * as ts from "typescript"
import {_functionModifiersToString} from "../_helper/functionModifiersToString.mjs"
import {_functionTypeParametersToString} from "../_helper/functionTypeParametersToString.mjs"
import {_functionParametersToString} from "../_helper/functionParametersToString.mjs"
import {_functionReturnType} from "./_functionReturnType.mjs"

export function _generateFunctionSignature(
	source: ts.SourceFile,
	implementation: ts.FunctionDeclaration
) : string {
	let ret = ``
	const params = implementation.parameters.slice(2)
	const generic_types = _functionTypeParametersToString(source, implementation)

	ret += `export type Signature = ${generic_types}(`
	ret += _functionParametersToString(source, params, true)
	ret += `) => ${_functionReturnType(source, implementation)}\n`

	return ret
}
