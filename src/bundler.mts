import type {
	JsBundlerInputFileType,
	JsBundlerOptions
} from "#~src/types/JsBundlerOptions.d.mts"

export async function bundler(
	inputFileType: JsBundlerInputFileType,
	projectRoot: string,
	entryCode: string,
	options: JsBundlerOptions
): Promise<string> {
	return ""
}
