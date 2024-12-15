import ts from "typescript"

export async function tsReadTSConfigFile(
	tsconfig_path : string,
	project_root : string
) {
	// Don't use JSON.parse to parse the config file
	// because TypeScript configs are allowed to have
	// comments in them.
	const tsconfig = ts.readConfigFile(
		tsconfig_path, ts.sys.readFile
	).config

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
