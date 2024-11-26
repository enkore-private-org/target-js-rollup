import * as ts from "typescript"
import path from "node:path"
import type {TsGenerateFunctionFactoryCodeSource} from "@fourtune/types/base-realm-js-and-web/v0"
import {getTypesReferencedInNode} from "../utils/getTypesReferencedInNode.mjs"
import {convertFunctionDeclaration} from "../utils/convertFunctionDeclaration.mjs"
import {generateFunctionSignature} from "../utils/generateFunctionSignature.mjs"
import {getTopLevelTypes} from "../utils/getTopLevelTypes.mjs"
import {resolveTopLevelTypesRecursively} from "../utils/resolveTopLevelTypesRecursively.mjs"
import {_getDeclaredAnioSoftwareDependencies} from "./_getDeclaredAnioSoftwareDependencies.mjs"
import {_convertAndSortDependencies} from "./_convertAndSortDependencies.mjs"

export function generateFactoryCode(
	source: TsGenerateFunctionFactoryCodeSource,
	implementation: ts.FunctionDeclaration
) : string {
	const function_name = path.basename(source.output.fn).slice(0, -4)
	const factory_name = path.basename(source.output.factory).slice(0, -4)

	const fn = convertFunctionDeclaration(implementation)
	const is_async = fn.modifiers.includes("async")
	const used_types = getTypesReferencedInNode(implementation, [
		...fn.type_params.map(type => type.name),
		"AnioJsDependencies",
		"ContextInstance"
	])
	const top_level_types = getTopLevelTypes(implementation.getSourceFile())

	const fn_signature = generateFunctionSignature({
		...fn,
		params: fn.params.slice(2)
	}, {
		new_function_name: function_name,
		use_jsdocs: true
	})

	const dependency_map = _getDeclaredAnioSoftwareDependencies(implementation.getSourceFile())
	const dependencies = _convertAndSortDependencies(dependency_map)

	let dependencies_import = "", dependencies_init = ""

	for (const dependency of dependencies) {
		dependencies_import += `import {${dependency.origin.export_name}Factory} from "${dependency.origin.module_name}"\n`

		dependencies_init += `\t\t${dependency.prop_name}: ${dependency.origin.export_name}Factory(user),\n`
	}

	// remove trailing new line and comma
	if (dependencies_init.length) {
		dependencies_init = dependencies_init.slice(0, -2)
	}

	if (dependencies_init.length) dependencies_init = `\n${dependencies_init}\n\t`

	let code = ``

	code += `import {implementation, type AnioJsDependencies} from "${source.source}"\n`
	code += `import type {UserContext} from "@fourtune/realm-js/v0/runtime"\n`
	code += `import {getProject} from "@fourtune/realm-js/v0/project"\n`
	code += `import {useContext} from "@fourtune/realm-js/v0/runtime"\n`
	code += dependencies_import

	code += resolveTopLevelTypesRecursively(
		top_level_types, used_types, true
	)

	code += `${fn_signature}\n`
	code += `\n`

	code += `export function ${factory_name}(user : UserContext = {}) : typeof ${function_name} {\n`
	code += `\tconst project = getProject()\n`
	code += `\tconst context = useContext(project, user)\n`
	code += `\tconst dependencies : AnioJsDependencies = {${dependencies_init}}\n`

	code += `\treturn ${is_async ? "async " : ""}function ${function_name}${fn.type_params_definition}(${fn.params.slice(2).map(param => param.definition).join(", ")}) : ${fn.return_type} {\n`
	code += `\t\treturn ${is_async ? "await " : ""}implementation(context, dependencies, ${fn.params.slice(2).map(param => param.name).join(", ")})\n`
	code += `\t}\n`

	code += `}\n`

	return code
}
