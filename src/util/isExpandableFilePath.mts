import path from "node:path"
import {utilIsExpandableName} from "./isExpandableName.mjs"

export function utilIsExpandableFilePath(
	file_path: string
) : boolean {
	const file_name = path.basename(file_path)

	if (!file_name.startsWith("__")) return false
	if (!utilIsExpandableName(file_name)) return false

	if (file_name.endsWith(".as.d.mts")) return true
	if (file_name.endsWith(".as.mts")) return true

	return false
}
