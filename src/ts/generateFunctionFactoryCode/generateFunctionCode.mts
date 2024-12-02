import * as ts from "typescript"
import path from "node:path"
import type {TsGenerateFunctionFactoryCodeSource} from "@fourtune/types/base-realm-js-and-web/v0"
import {convertFunctionDeclaration} from "../_utils_to_be_removed/convertFunctionDeclaration.mjs"
import {getTypesReferencedInNode} from "../_utils_to_be_removed/getTypesReferencedInNode.mjs"
import {getTopLevelTypes} from "../_utils_to_be_removed/getTopLevelTypes.mjs"
import {resolveTopLevelTypesRecursively} from "../_utils_to_be_removed/resolveTopLevelTypesRecursively.mjs"
import {_usesAnioJsDependencies} from "./_usesAnioJsDependencies.mjs"

export function generateFunctionCode(
	source: TsGenerateFunctionFactoryCodeSource,
	implementation: ts.FunctionDeclaration
) : string {
	const function_name = path.basename(source.output.fn).slice(0, -4)
	const factory_name = path.basename(source.output.factory).slice(0, -4)

	const fn = convertFunctionDeclaration(implementation)
	const uses_dependencies = _usesAnioJsDependencies(fn)
	const is_async = fn.modifiers.includes("async")
	const params_offset = uses_dependencies ? 2 : 1

	let code = ``

	code += `import {createContext} from "@fourtune/realm-js/v0/runtime"\n`

	const top_level_types = getTopLevelTypes(implementation.getSourceFile())
	const used_types = getTypesReferencedInNode(implementation, [
		...fn.type_params.map(type => type.name),
		"AnioJsDependencies",
		"RuntimeWrappedContextInstance"
	])

	const resolved_types = resolveTopLevelTypesRecursively(
		top_level_types, used_types, true
	)

	if (resolved_types.length) {
		code += `// vvv types needed for function signature\n`
		code += resolved_types
		code += `// ^^^ types needed for function signature\n`
		code += `\n`
	}

	code += `import {${factory_name} as factory} from "${path.join("#~auto", source.output.factory)}"\n`
	code += `\n`
	code += `const fn = factory(createContext())\n`
	code += `\n`

	if (fn.jsdoc.length) {
		code += fn.jsdoc + "\n"
	}

	const param_names = fn.params.slice(params_offset).map(param => param.name).join(", ")

	code += `export ${is_async ? "async " : ""}`

	code += `function ${function_name}${fn.type_params_definition}`
	code += `(`
	code += fn.params.slice(params_offset).map(param => param.definition).join(", ")
	code += `) : ${fn.return_type} {\n`

	code += `\treturn ${is_async ? "await " : ""}fn(${param_names})\n`
	code += `}\n`

	return code
}
