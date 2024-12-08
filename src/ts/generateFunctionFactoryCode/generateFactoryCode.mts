import ts from "typescript"
import path from "node:path"
import type {TsGenerateFunctionFactoryCodeForRealmJSAndWebV0Source as Source} from "@fourtune/types/base-realm-js-and-web/v0"
import type {AnioJsDependency} from "./getAnioJsDependencies.mts"
import {
	type Instance,
	getAllTopLevelTypesNeededForNode,
	convertFunctionDeclaration,
	generateFunctionSignature
} from "@aniojs/node-ts-utils"

function generateDependenciesInitCode(
	dependencies: AnioJsDependency[]
) : string {
	let code = ``

	if (dependencies.length) {
		code += `\n`
	}

	for (const dependency of dependencies) {
		code += `\t\t${dependency.name}: ${dependency.factory}(context),\n`
	}

	if (code.length) {
		code = code.slice(0, -2)
		code += `\n\t`
	}

	return code
}

export function generateFactoryCode(
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

	let anio_js_dependencies_type_import = ``

	if (dependencies !== false) {
		anio_js_dependencies_type_import = `, type AnioJsDependencies`
	}

	code += `import {implementation${anio_js_dependencies_type_import}} from "${source.source}"\n`
	code += `import type {RuntimeWrappedContextInstance} from "@fourtune/realm-js/runtime"\n`
	code += `import {getProject} from "@fourtune/realm-js/v0/project"\n`

	if (dependencies !== false && dependencies.length) {
		code += `\n`
		code += `// vvv dependencies declared via AnioJsDependencies type\n`

		for (const dependency of dependencies) {
			code += dependency.definition + `\n`
		}

		code += `// ^^^ dependencies declared via AnioJsDependencies type\n`
	}

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
	code += generateFunctionSignature(
		{
			...fn,
			params: fn.params.slice(params_offset)
		}, {
			new_function_name: function_name,
			use_jsdocs: true
		}
	) + "\n"

	code += `\n`

	const factory_jsdoc = `
/**
 * @brief
 * Create an instance of the function '${function_name}'.
 *
 * @param user
 * Options object (see @fourtune/realm-js/v0/runtime) or an already
 * created context with createContext().
 * This parameter is optional.
 *
 * @return
 * An instance of the function '${function_name}'.
 */
`.slice(1)

	code += factory_jsdoc
	code += `export function ${factory_name}(context: RuntimeWrappedContextInstance) : typeof ${function_name} {\n`

	if (dependencies !== false) {
		code += `\tconst dependencies : AnioJsDependencies = {${generateDependenciesInitCode(dependencies)}}\n`
		code += `\n`
	}

	let fn_params : string[] = ["local_context"]

	if (dependencies !== false) {
		fn_params.push("dependencies")
	}

	const rest_params = fn.params.slice(params_offset)

	if (rest_params.length) {
		fn_params = [
			...fn_params,
			...fn.params.slice(params_offset).map(param => param.name)
		]
	}

	let type_params_definition = ""

	if (fn.type_params.length) {
		type_params_definition = `<${fn.type_params.map(t => t.name).join(", ")}>`
	}

	code += `\tconst project = getProject()\n`
	code += `\tconst local_context : RuntimeWrappedContextInstance = {\n`
	code += `\t\t...context,\n`
	code += `\t\t_package: {\n`
	code += `\t\t\tname: project.package_json.name,\n`
	code += `\t\t\tversion: project.package_json.version,\n`
	code += `\t\t\tauthor: project.package_json.author,\n`
	code += `\t\t\tlicense: project.package_json.license\n`
	code += `\t\t}\n`
	code += `\t}\n`

	code += `\n`

	code += `\treturn ${is_async ? "async " : ""}`

	code += `function ${function_name}${type_params_definition}`
	code += `(`
	code += fn.params.slice(params_offset).map(param => param.definition).join(", ")
	code += `) : ${fn.return_type} {\n`

	code += `\t\treturn ${is_async ? "await " : ""}`
	code += `implementation(${fn_params.join(", ")})\n`
	code += `\t}\n`
	code += `}\n`

	return code
}
