import type {TsDeclarationBundlerOptions} from "./TsDeclarationBundlerOptions.d.mts"
import {bundler} from "#~src/bundler.mts"

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

	return await bundler("dts", projectRoot, entryCode, {
		externals,
		onRollupLogFunction
	})
}
