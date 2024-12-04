import {utilIsExpandableName} from "./isExpandableName.mjs"

export function utilExpandAsyncSyncVariantName(
	name: string
) : [string, string] {
	if (!utilIsExpandableName(name)) {
		throw new Error(
			`expandAsyncSyncVariantNew: unexpandable name '${name}'.`
		)
	}

	const tmp = name.split("XXX")

	if (tmp.length > 3) {
		throw new Error(
			`expandAsyncSyncVariantNew: ambiguous expansion '${name}'.`
		)
	}

	const sync_name = tmp.join("Sync")
	const async_name = tmp.join("")

	return [async_name, sync_name]
}
