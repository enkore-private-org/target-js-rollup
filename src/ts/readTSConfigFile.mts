import ts from "typescript"
import fs from "node:fs/promises"

export async function tsReadTSConfigFile(
	tsconfig_path
) {
	const tsconfig_data = await fs.readFile(tsconfig_path)
	const tsconfig = JSON.parse(tsconfig_data.toString())

	const {errors, options} = ts.convertCompilerOptionsFromJson(
		tsconfig.compilerOptions
	)

	if (errors.length) {
		throw new Error(
			`Failed to load '${tsconfig_path}': \n    • ` +
			errors.map(({messageText}) => messageText).join("\n    • ")
		)
	}

	return options
}
