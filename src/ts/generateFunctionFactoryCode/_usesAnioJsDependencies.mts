import type {FunctionDeclaration} from "../_utils_to_be_removed/convertFunctionDeclaration.mjs"

export function _usesAnioJsDependencies(
	fn: FunctionDeclaration
) : boolean {
	if (2 > fn.params.length) return false

	return fn.params[1].type === "AnioJsDependencies"
}
