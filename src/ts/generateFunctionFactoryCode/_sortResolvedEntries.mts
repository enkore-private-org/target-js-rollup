import type {Result as ResolvedTypesResult} from "../_helper/resolveUsedTypesInFunction.mjs"

export function _sortResolvedEntries(
	resolved_types: ResolvedTypesResult
) : any {
	const imports = []
	const rest = []

	for (const [k, v] of resolved_types.entries()) {
		if (v.source === "import") {
			imports.push([k,v])
		} else {
			rest.push([k,v])
		}
	}

	const ret = [
		...imports,
		...rest
	]

	return ret
}
