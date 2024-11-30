import type {TsAliases, TsGenerateFunctionFactoryCodeForRealmJSAndWebV0Source} from "@fourtune/types/base-realm-js-and-web/v0"

export async function tsGenerateFunctionFactoryCodeForRealmJSAndWebV0(
	project_root: string,
	source: TsGenerateFunctionFactoryCodeForRealmJSAndWebV0Source,
	code: string,
	expect_async_implementation: boolean|null,
	aliases: TsAliases = {}
) : Promise<{
	factory: string,
	fn: string
}> {
	return {
		factory: ``,
		fn: ``
	}
}
