import * as ts from "typescript"
import {getJSDocAsStringFromNode} from "./getJSDocAsStringFromNode.mjs"

export type FunctionDeclaration = {
	name: string|null,
	jsdoc: string
	modifiers: string[],

	type_params: {
		name: string,
		definition: string
	}[]

	params: {
		name: string,
		type: string,
		jsdoc: string,
		definition: string
	}[],

	return_type: string
}

export function convertFunctionDeclaration(
	fn: ts.FunctionDeclaration
) : FunctionDeclaration {
	const source : ts.SourceFile = fn.getSourceFile()

	const function_name : string|null = fn.name ? fn.name.getText(source) : null

	const modifiers : string[] = fn.modifiers ? fn.modifiers.map(modifier => {
		return modifier.getText(source).toLowerCase()
	}) : []

	const type_params : FunctionDeclaration["type_params"] = []

	if (fn.typeParameters) {
		for (const type_param of fn.typeParameters) {
			type_params.push({
				name: type_param.name.getText(source),
				definition: type_param.getText(source)
			})
		}
	}

	const params : FunctionDeclaration["params"] = []

	if (fn.parameters) {
		for (const param of fn.parameters) {
			const name : string = param.name.getText(source)
			const type : string = param.type ? param.type.getText(source) : "any"

			params.push({
				name,
				type,
				jsdoc: getJSDocAsStringFromNode(param),
				definition: `${name}: ${type}`
			})
		}
	}

	let return_type : string = modifiers.includes("async") ? "Promise<any>" : "any"

	if (fn.type) {
		return_type = fn.type.getText(source)
	}

	return {
		name: function_name,

		jsdoc: getJSDocAsStringFromNode(fn),
		modifiers,

		type_params,
		params,

		return_type
	}
}
