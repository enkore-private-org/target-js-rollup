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
	const savedCWD = process.cwd()

	//
	// needed to make node resolve work properly
	//
	process.chdir(projectRoot)

	try {
		return ""
	} finally {
		process.chdir(savedCWD)
	}
}
