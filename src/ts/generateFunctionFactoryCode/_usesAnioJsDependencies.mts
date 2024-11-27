import type {FunctionDeclaration} from "../utils/convertFunctionDeclaration.mjs"

export function _usesAnioJsDependencies(
	fn: FunctionDeclaration
) : boolean {
	if (2 > fn.params.length) return false

	return fn.params[1].type === "AnioJsDependencies"
}
