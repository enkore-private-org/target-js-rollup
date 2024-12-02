import type {TsGenerateFunctionFactoryCodeSource} from "@fourtune/types/base-realm-js-and-web/v0"
import {createSourceFile} from "../_utils_to_be_removed/createSourceFile.mjs"
import {_checkImplementation} from "./_checkImplementation.mjs"
import {isolateExportedFunction} from "../_utils_to_be_removed/isolateExportedFunction.mjs"

import {generateFactoryCode} from "./generateFactoryCode.mjs"
import {generateFunctionCode} from "./generateFunctionCode.mjs"

export async function tsGenerateFunctionFactoryCode(
	source: TsGenerateFunctionFactoryCodeSource,
	code: string,
	expect_async_implementation: boolean|null
) : Promise<{
	factory: string,
	fn: string
}> {
	const ts_ast = createSourceFile(code)
	const implementation = isolateExportedFunction(ts_ast, "implementation")

	if (!implementation) {
		throw new Error(`${source.source}: Unable to find implementation export.`)
	}

	const error_msg = _checkImplementation(
		implementation,
		expect_async_implementation
	)

	if (error_msg.length) {
		throw new Error(`${source.source}: ${error_msg}`)
	}

	return {
		factory: generateFactoryCode(source, implementation),
		fn: generateFunctionCode(source, implementation)
	}
}
