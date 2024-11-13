import path from "node:path"
import fs from "node:fs/promises"

async function readJSONFile(file_path: string) {
	return JSON.parse(
		(await fs.readFile(file_path)).toString()
	)
}

export async function _getBaseTsConfigPath(
	project_root: string
) : Promise<string> {
	const candidates: Map<string, string> = new Map()

	const tsconfig = await readJSONFile(
		path.join(project_root, "tsconfig.json")
	)

	if (!("references" in tsconfig)) {
		throw new Error(`Missing "references" field in tsconfig.json.`)
	}

	const {references} = tsconfig

	if (!Array.isArray(references)) {
		throw new Error(`"references" field must be an array.`)
	}

	for (const reference of references) {
		if (!("path" in reference)) {
			throw new Error(`Missing "path" field in reference (tsconfig.json).`)
		}

		const tmp = await readJSONFile(
			path.join(project_root, reference.path)
		)

		if (!("extends" in tmp)) {
			throw new Error(`Referenced tsconfig (${reference.path}) doesn't have "extends" property.`)
		}

		candidates.set(tmp.extends, reference.path)
	}

	if (candidates.size !== 1) {
		throw new Error(
			`Have too little or too many base tsconfig candidates (size = ${candidates.size}).`
		)
	}

	const referenced_from = candidates.values().next().value
	const relative_path = candidates.keys().next().value

	return path.join(
		project_root,
		path.dirname(referenced_from as string),
		relative_path as string
	)
}
