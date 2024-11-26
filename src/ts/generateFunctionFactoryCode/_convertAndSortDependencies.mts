import type {AnioJsDependencyMap} from "./_getDeclaredAnioSoftwareDependencies.mjs"

export function _convertAndSortDependencies(
	dependencies: AnioJsDependencyMap
) {
	let ret = []

	for (const [prop_name, origin] of dependencies.entries()) {
		ret.push({
			prop_name,
			origin
		})
	}

	ret.sort((a, b) => {
		return a.prop_name.localeCompare(b.prop_name)
	})

	return ret
}
