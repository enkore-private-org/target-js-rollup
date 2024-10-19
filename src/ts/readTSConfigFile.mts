import ts from "typescript"
import path from "node:path"
import fs from "node:fs/promises"

export async function tsReadTSConfigFile(
	tsconfig_path : string,
	project_root : string
) {
	const tsconfig_data = await fs.readFile(tsconfig_path)
	const tsconfig = JSON.parse(tsconfig_data.toString())

	const {errors, options} = ts.convertCompilerOptionsFromJson(
		tsconfig.compilerOptions, project_root
	)

	if (errors.length) {
		throw new Error(
			`Failed to load '${tsconfig_path}': \n    • ` +
			errors.map(({messageText}) => messageText).join("\n    • ")
		)
	}

	return options
}
