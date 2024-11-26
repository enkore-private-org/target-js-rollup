import type {TsGenerateFunctionFactoryCodeSource} from "@fourtune/types/base-realm-js-and-web/v0"
import {createSourceFile} from "../utils/createSourceFile.mjs"
import {_checkImplementation} from "./_checkImplementation.mjs"
import {isolateExportedFunction} from "../utils/isolateExportedFunction.mjs"

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
	const ts_ast = createSourceFile(code)
	const implementation = isolateExportedFunction(ts_ast, "implementation")

	if (!implementation) {
		return error("unable to find implementation export")
	}

	const error_msg = _checkImplementation(
		implementation,
		expect_async_implementation
	)

	if (error_msg.length) {
		return error(error_msg)
	}

	return {
		factory: ``,
		fn: ``
	}
}
