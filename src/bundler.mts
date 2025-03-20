import type {
	JsBundlerOptions
} from "#~src/types/JsBundlerOptions.d.mts"

export type BundlerInputFileType = "mjs" | "dts"

export async function bundler(
	inputFileType: BundlerInputFileType,
	projectRoot: string,
	entryCode: string,
	options: JsBundlerOptions
): Promise<string> {
	return ""
}
