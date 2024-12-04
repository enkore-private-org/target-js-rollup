import ts from "typescript"

import type {TsGenerateFunctionFactoryCodeForRealmJSAndWebV0Source as Source} from "@fourtune/types/base-realm-js-and-web/v0"

import type {AnioJsDependency} from "./getAnioJsDependencies.mts"
import {
	type Instance,
	getAllTopLevelTypesNeededForNode
} from "@aniojs/node-ts-utils"

export function generateFactoryCode(
	inst: Instance,
	fn: ts.FunctionDeclaration,
	dependencies: AnioJsDependency[]|false,
	source: Source|([Source, Source])
) : string {
	let code = ``

	const types_needed = getAllTopLevelTypesNeededForNode(
		inst, fn, ["RuntimeWrappedContextInstance", "AnioJsDependencies"]
	)

	if (types_needed.length) {
		types_needed.sort((a, b) => {
			return a.name.localeCompare(b.name)
		})

		code += `\n`
		code += `// vvv--- types needed for implementation\n`

		for (const type of types_needed) {
			code += `${type.definition}\n`
		}

		code += `// ^^^--- types needed for implementation\n`
	}

	let anio_js_dependencies_type_import = ``

	if (dependencies !== false) {
		anio_js_dependencies_type_import = `, type AnioJsDependencies`
	}

	//code += `import {implementation${anio_js_dependencies_type_import}} from "${source.source}"\n`
	//code += `import type {RuntimeWrappedContextInstance} from "@fourtune/realm-js/runtime"\n`
	//code += `import {getProject} from "@fourtune/realm-js/v0/project"\n`

	return code
}
