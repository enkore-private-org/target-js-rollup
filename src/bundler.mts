import type {
	JsBundlerOptions
} from "#~src/types/JsBundlerOptions.d.mts"

export type JsBundlerInputFileType = "mjs" | "dts"

export async function bundler(
	inputFileType: JsBundlerInputFileType,
	projectRoot: string,
	entryCode: string,
	options: JsBundlerOptions
): Promise<string> {
	return ""
}
