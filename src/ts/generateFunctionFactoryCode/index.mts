import * as ts from "typescript"
import type {TsGenerateFunctionFactoryCodeSource} from "@fourtune/types/base-realm-js-and-web/v0"
import {_createASTFromCode} from "../_helper/createASTFromCode.mjs"
import {_checkImplementation} from "./_checkImplementation.mjs"
import {_isolateExportedFunction} from "../_helper/isolateExportedFunction.mjs"
import {_generateFactoryFileCode} from "./_generateFactoryFileCode.mjs"
import {_generateFunctionFileCode} from "./_generateFunctionFileCode.mjs"

function error(str: string) {
	return {
		factory: `/* ${str} */\n`,
		fn: `/* ${str} */\n`
	}
}

export async function tsGenerateFunctionFactoryCode(
	source: TsGenerateFunctionFactoryCodeSource,
	code: string,
	expect_async_implementation: boolean|null
) : Promise<{
	factory: string,
	fn: string
}> {
	const ts_ast = await _createASTFromCode(code)
	const implementation = await _isolateExportedFunction(ts_ast, "implementation")

	if (!implementation) {
		return error("unable to find implementation export")
	}

	const error_msg = _checkImplementation(
		ts_ast,
		implementation,
		expect_async_implementation
	)

	if (error_msg.length) {
		return error(error_msg)
	}

	return {
		factory: await _generateFactoryFileCode(source, ts_ast, implementation),
		fn: await _generateFunctionFileCode(source, ts_ast, implementation)
	}
}
