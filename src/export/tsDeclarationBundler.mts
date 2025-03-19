import type {TsDeclarationBundlerOptions} from "./TsDeclarationBundlerOptions.d.mts"
import {jsBundler} from "#~src/jsBundler.mts"

export async function tsDeclarationBundler(
	projectRoot: string,
	entryCode: string,
	options: TsDeclarationBundlerOptions = {
		externals: [],
		onRollupLogFunction: undefined
	}
): Promise<string> {
	const {
		externals,
		onRollupLogFunction
	} = options

	return await jsBundler("dts", projectRoot, entryCode, {
		externals,
		onRollupLogFunction
	})
}
