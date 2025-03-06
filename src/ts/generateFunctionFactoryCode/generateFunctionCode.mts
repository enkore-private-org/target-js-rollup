import ts from "typescript"
import path from "node:path"
import type {TsGenerateFunctionFactoryCodeForRealmJSAndWebV0Source as Source} from "@fourtune/types/base-realm-js-and-web/v0"
import type {AnioJsDependency} from "./getAnioJsDependencies.mts"

import {
	type Instance,
	convertFunctionDeclaration,
	getAllTopLevelTypesNeededForNode
} from "@aniojs/node-ts-utils"

export function generateFunctionCode(
	inst: Instance,
	implementation: ts.FunctionDeclaration,
	dependencies: AnioJsDependency[]|false,
	source: Source
) : string {
	const function_name = path.basename(source.output.fn).slice(0, -4)
	const factory_name = path.basename(source.output.factory).slice(0, -4)
	const fn = convertFunctionDeclaration(implementation)
	const params_offset = dependencies === false ? 1 : 2
	const is_async = fn.modifiers.includes("async")

	let code = ``

	code += `import {createContext} from "@fourtune/realm-js/v0/runtime"\n`

	const types_needed = getAllTopLevelTypesNeededForNode(
		inst, implementation, ["RuntimeWrappedContextInstance", "AnioJsDependencies"]
	)

	if (types_needed.length) {
		code += `\n`

		types_needed.sort((a, b) => {
			return a.name.localeCompare(b.name)
		})

		code += `// vvv--- types needed for implementation\n`

		for (const type of types_needed) {
			code += `${type.definition}\n`
		}

		code += `// ^^^--- types needed for implementation\n`
	}

	code += `\n`
	code += `import {${factory_name} as factory} from "${path.join("#~synthetic", "user", source.output.factory)}"\n`
	code += `\n`

//	code += `let __fnImplementation: any = null\n`
//	code += `\n`

	if (fn.jsdoc.length) {
		code += fn.jsdoc + "\n"
	}

	let type_params_definition = ""

	if (fn.type_params.length) {
		type_params_definition = `<${fn.type_params.map(t => t.definition).join(", ")}>`
	}

	const param_names = fn.params.slice(params_offset).map(param => param.name).join(", ")
	code += `export ${is_async ? "async " : ""}`

	code += `function ${function_name}${type_params_definition}`
	code += `(`
	code += fn.params.slice(params_offset).map(param => param.definition).join(", ")
	code += `) : ${fn.return_type} {\n`

	code += `\tconst __fnImplementation = factory(createContext())\n`
	code += `\n`
	code += `\treturn ${is_async ? "await " : ""}__fnImplementation(${param_names})\n`
	code += `}\n`

	return code
}
