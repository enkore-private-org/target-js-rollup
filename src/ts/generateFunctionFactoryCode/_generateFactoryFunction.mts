import * as ts from "typescript"
import {_functionTypeParametersToString} from "../_helper/functionTypeParametersToString.mjs"
import {_functionModifiersToString} from "../_helper/functionModifiersToString.mjs"
import {_functionParametersToString} from "../_helper/functionParametersToString.mjs"
import type {AnioJsDependencyMap} from "./_getDeclaredAnioSoftwareDependencies.mjs"
import {_convertAndSortDependencies} from "./_convertAndSortDependencies.mjs"

export function _generateFactoryFunction(
	factory_name: string,
	function_name: string,
	source: ts.SourceFile,
	implementation: ts.FunctionDeclaration,
	dependency_map: AnioJsDependencyMap
) : string {
	const generic_types = _functionTypeParametersToString(source, implementation)
	const modifiers = _functionModifiersToString(source, implementation)
	const is_async = modifiers.includes("async")
	const rest_params = _functionParametersToString(source, implementation.parameters.slice(2), false)
	const params = implementation.parameters.slice(2).map(param => {
		return param.getText(source)
	}).join(", ")

	const jsdoc = ts.getJSDocCommentsAndTags(implementation)
	const jsdoc_str = jsdoc.length ? jsdoc.map(doc => doc.getText(source)).join("\n") : ""

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

	let ret = ``

	ret += dependencies_import
	ret += (dependencies_import.length ? "\n" : "")

	ret += `${jsdoc_str}\n`
	ret += `declare function impl(${params}) : ReturnType<Signature>\n`

	ret += `export function ${factory_name}(user: UserContext = {}) : typeof impl {\n`

	ret += `\tconst project = getProject()\n`
	ret += `\tconst context = useContext(project, user)\n`
	ret += `\tconst dependencies : AnioJsDependencies = {${dependencies_init}}\n`
	ret += `\n`

	ret += `\treturn ${is_async ? "async " : ""}function${function_name.length ? ` ${function_name}` : ""}${generic_types}(${params}) {\n`
	ret += `\t\treturn ${is_async ? "await " : ""}implementation(context, dependencies${rest_params.length ? `, ${rest_params}` : ""})\n`
	ret += `\t}\n`

	ret += `}\n`

	return ret
}
