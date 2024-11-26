import type {TopLevelTypes} from "./getTopLevelTypes.mjs";

export function resolveTopLevelTypesRecursively(
	top_level_types: TopLevelTypes,
	types: string[],
	add_jsdoc_comments: boolean = false
) : string {
	let ret = ``

	for (const type of types) {
		if (!top_level_types.has(type)) continue

		const type_info = top_level_types.get(type)!

		if (!type_info.depends_on_types.length) {
			if (type_info.jsdoc.length && add_jsdoc_comments) {
				ret += `${type_info.jsdoc}\n`
			}

			ret += type_info.definition + "\n"
		} else {
			ret += resolveTopLevelTypesRecursively(
				top_level_types,
				type_info.depends_on_types,
				add_jsdoc_comments
			)

			if (type_info.jsdoc.length && add_jsdoc_comments) {
				ret += `${type_info.jsdoc}\n`
			}

			ret += type_info.definition + "\n"
		}
	}

	return ret
}
