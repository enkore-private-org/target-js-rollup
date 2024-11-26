import type {FunctionDeclaration} from "./convertFunctionDeclaration.mjs"

function indent(str: string, level: number) : string {
	const indent = "\t".repeat(level)

	if (!str.includes("\n")) {
		return `${indent}${str}`
	}

	let ret = ``

	for (const line of str.split("\n")) {
		ret += `${indent}${line}\n`
	}

	return ret.slice(0, -1)
}

type Options = {
	new_function_name?: string
	use_jsdocs?: boolean,
	as_type?: boolean
}

export function generateFunctionSignature(
	fn: FunctionDeclaration,
	options : Options = {
		new_function_name: undefined,
		use_jsdocs: true,
		as_type: false
	}
) : string {
	let signature = ``
	let function_name : string = fn.name ? fn.name : ""

	if (options.new_function_name !== undefined) {
		function_name = options.new_function_name
	}

	if (fn.jsdoc.length && options.use_jsdocs) {
		signature += fn.jsdoc + "\n"
	}

	if (options.as_type) {
		if (function_name.length) {
			signature += `type ${function_name} = `
		} else {
			signature += `type Function = `
		}
	} else {
		if (function_name.length) {
			signature += `declare function ${function_name}`
		} else {
			signature += `declare function fn`
		}
	}

	const type_params = fn.type_params.map(type_param => type_param.definition)

	if (type_params.length) {
		signature += `<${type_params.join(", ")}>`
	}

	signature += `(\n`

	if (fn.params.length) {
		for (const param of fn.params) {
			if (param.jsdoc.length && options.use_jsdocs) {
				signature += indent(param.jsdoc, 1) + "\n"
			}

			signature += `\t${param.definition},\n`
		}

		signature = signature.slice(0, -2)
	}

	signature += `\n) => ${fn.return_type}`

	return signature
}
