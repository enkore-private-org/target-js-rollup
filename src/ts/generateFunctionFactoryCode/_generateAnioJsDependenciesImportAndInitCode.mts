import type {AnioJsDependencyMap} from "./_getDeclaredAnioSoftwareDependencies.mjs";
import {_convertAndSortDependencies} from "./_convertAndSortDependencies.mjs";

export function _generateAnioJsDependenciesImportAndInitCode(
	dependency_map: AnioJsDependencyMap|null
) : {
	import_code: string,
	init_code: string
} {
	let import_code = ``, init_code = ``

	if (dependency_map) {
		const dependencies = _convertAndSortDependencies(dependency_map)

		for (const dependency of dependencies) {
			import_code += `import {${dependency.origin.export_name}Factory} from "${dependency.origin.module_name}"\n`

			init_code += `\t\t${dependency.prop_name}: ${dependency.origin.export_name}Factory(user),\n`
		}

		// remove trailing new line and comma
		if (init_code.length) {
			init_code = init_code.slice(0, -2)
		}

		if (init_code.length) init_code = `\n${init_code}\n\t`
	}

	return {
		import_code,
		init_code
	}
}
