import type {TsGetExportedFunctionFromCodeResult} from "@fourtune/types/base-realm-js-and-web/v0/"
import ts from "typescript"

type Result = null | {
	name: string,
	is_async: boolean
}

function handleFunctionDeclaration(
	root_node: ts.Node,
	node: ts.FunctionDeclaration
) : Result {
	if (!node.name || !node.modifiers) return null

	const modifiers = node.modifiers.map(modifier => {
		return modifier.getText(root_node as ts.SourceFile)
	})

	if (!modifiers.includes("export")) return null

	return {
		name: node.name.getText(root_node as ts.SourceFile),
		is_async: modifiers.includes("async")
	}
}

function transformerFactory(
	export_name: string, result: {value: Result}
) {
	return function transformer(context: ts.TransformationContext) {
		return (root_node: ts.Node) => {
			const visit = (node: ts.Node) : ts.Node => {
				const new_node = ts.visitEachChild(node, visit, context)

				if (ts.isFunctionDeclaration(new_node)) {
					const ret = handleFunctionDeclaration(root_node, new_node)

					if (ret !== null && ret.name === export_name) {
						result.value = ret
					}
				}

				return new_node
			}

			return ts.visitNode(root_node, visit)
		}
	}
}

export async function tsGetExportedFunctionFromCode(
	code: string, export_name: string
) : Promise<TsGetExportedFunctionFromCodeResult> {
	const result : {value: Result} = {value: null}

	const source_file = ts.createSourceFile(
		"index.mts",
		code,
		ts.ScriptTarget.ESNext
	)

	const transformer = transformerFactory(export_name, result)

	ts.transform(source_file, [
		transformer
	])

	if (result.value === null) return null

	return {
		is_async: result.value.is_async
	}
}
