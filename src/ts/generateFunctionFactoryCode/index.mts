import * as ts from "typescript"
import {_createASTFromCode} from "../_helper/createASTFromCode.mjs"
import {_getDeclaredAnioSoftwareDependencies, type AnioJsDependencyMap} from "./_getDeclaredAnioSoftwareDependencies.mjs"
import {_isolateExportedFunction} from "../_helper/isolateExportedFunction.mjs"
import {_isolateTypesUsedInFunction} from "../_helper/isolateTypesUsedInFunction.mjs"
import {_resolveUsedTypesInFunction} from "../_helper/resolveUsedTypesInFunction.mjs"
import {_generateFunctionSignature} from "./_generateFunctionSignature.mjs"
import {_generateFactoryFunction} from "./_generateFactoryFunction.mjs"
import {_sortResolvedEntries} from "./_sortResolvedEntries.mjs"

export async function tsGenerateFunctionFactoryCode(
	source_file: string,
	code: string
) : Promise<string> {
	let ret = ``
	const source = await _createASTFromCode(code)
	const implementation = await _isolateExportedFunction(source, "implementation")

	if (!implementation) return "/* unable to find implementation export */\n"

	const function_types = await _isolateTypesUsedInFunction(source, implementation)
	const resolved_types = await _resolveUsedTypesInFunction(source, function_types)

	const anio_js_dependency_map : AnioJsDependencyMap = await _getDeclaredAnioSoftwareDependencies(source)

	const function_signature = _generateFunctionSignature(source, implementation)

	ret += `import {useContext} from "@fourtune/realm-js/v0"\n`
	ret += `import type {AnioJsDependencies} from "${source_file}"\n`
	ret += `import {implementation} from "${source_file}"\n`

	for (const [k, v] of _sortResolvedEntries(resolved_types)) {
		if (v.source === "unknown") {
			ret += `// unresolved type "${k}"\n`

			continue
		}

		if (k === "AnioJsDependencies") continue

		ret += `${v.definition()}\n`
	}

	ret += `\n`
	ret += function_signature
	ret += `\n`
	ret += _generateFactoryFunction(
		"factory",
		source,
		implementation,
		anio_js_dependency_map
	)

	return ret
}
