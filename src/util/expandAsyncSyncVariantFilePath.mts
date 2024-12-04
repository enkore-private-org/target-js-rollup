import path from "node:path"
import {utilIsExpandableFilePath} from "./isExpandableFilePath.mjs"
import {utilExpandAsyncSyncVariantName} from "./expandAsyncSyncVariantName.mjs"

export function utilExpandAsyncSyncVariantFilePath(
	file_path: string
) : [string, string] {
	if (!utilIsExpandableFilePath(file_path)) {
		throw new Error(
			`expandAsyncSyncVariantFilePath: unexpandable name '${file_path}'.`
		)
	}

	const base_dir = path.dirname(file_path)

	// remove __
	let file_name = path.basename(file_path).slice(2)
	const type = file_name.endsWith(".as.d.mts") ? "d.mts" : "mts"

	// remove extension
	file_name = file_name.slice(0, -(`.as.${type}`.length))

	const [async_file_name, sync_file_name] = utilExpandAsyncSyncVariantName(file_name)

	return [
		path.join(base_dir, `${async_file_name}.${type}`),
		path.join(base_dir, `${sync_file_name}.${type}`)
	]
}
