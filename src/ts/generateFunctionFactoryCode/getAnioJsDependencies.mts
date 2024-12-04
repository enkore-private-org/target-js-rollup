import ts from "typescript"

import type {TsAliases} from "@fourtune/types/base-realm-js-and-web/v0"

import {
	type Instance,
	getExportByName
} from "@aniojs/node-ts-utils"

export function getAnioJsDependencies(
	project_root: string,
	inst: Instance,
	aliases: TsAliases = {}
) : any[]|false {
	const dep_export = getExportByName(inst, "AnioJsDependencies", "type-only")

	if (!dep_export) {
		return false
	}

	return []
}
