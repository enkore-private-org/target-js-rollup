import * as ts from "typescript"
import {_printNode} from "./printNode.mjs"

export function _functionParametersToString(
	source: ts.SourceFile,
	params: ts.ParameterDeclaration[],
	signature: boolean = false
) : string {
	if (!signature) {
		return params.map(param => {
			return param.name.getText(source)
		}).join(", ")
	}

	let ret = ``

	if (params.length) ret += `\n`

	for (let i = 0; i < params.length; ++i) {
		if (i > 0) ret += `\n`

		ret += _printNode(source, params[i], 1, false)

		if ((i + 1) >= params.length) {
			ret += "\n"
		} else {
			ret += ",\n"
		}
	}

	return ret
}
