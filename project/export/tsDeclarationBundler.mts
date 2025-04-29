import type {TsDeclarationBundlerOptions} from "./TsDeclarationBundlerOptions.mts"
import {bundler} from "#~src/bundler.mts"

function removeConsecutiveEmptyLines(str: string): string {
	while (str.indexOf("\n\n") !== -1) {
		str = str.split("\n\n").join("\n")
	}

	return str
}

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

	// for some reason this emits a lot of empty lines
	const bundle = await bundler("dts", projectRoot, entryCode, {
		externals,
		onRollupLogFunction
	})

	return removeConsecutiveEmptyLines(bundle)
}
