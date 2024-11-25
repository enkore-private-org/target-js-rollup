import * as ts from "typescript"
import type {TsGenerateFunctionFactoryCodeSource} from "@fourtune/types/base-realm-js-and-web/v0"
import path from "node:path"

export async function _generateFunctionFileCode(
	source: TsGenerateFunctionFactoryCodeSource,
	ts_ast: ts.SourceFile,
	implementation: ts.FunctionDeclaration
) : Promise<string> {
	const factory_name : string = path.basename(source.output.factory).slice(0, -4)
	const function_name : string = path.basename(source.output.fn).slice(0, -4)

	const jsdoc = ts.getJSDocCommentsAndTags(implementation)
	const jsdoc_str = jsdoc.length ? jsdoc.map(doc => doc.getText(ts_ast)).join("\n") : ""

	return `
import {${factory_name} as factory, type Signature} from "${path.join("#~auto", source.output.factory)}"

${jsdoc_str}
export const ${function_name} : Signature = factory()
`.slice(1)
}
