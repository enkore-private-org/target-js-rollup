import type {
	JsParseAssetURLResult,
	JsGetRequestedAssetsFromCodeResult
} from "@fourtune/types/base-realm-js-and-web/v0/"

import fs from "node:fs/promises"

import {tsStripTypesFromCode} from "../ts/stripTypesFromCode.mjs"
import {jsGetRequestedAssetsFromCode} from "./getRequestedAssetsFromCode/index.mjs"
import {jsParseAssetURL} from "./parseAssetURL.mjs"

export async function jsGetRequestedAssetsFromFiles(
	files : string[]
) : Promise<JsGetRequestedAssetsFromCodeResult> {
	const asset_map = new Map()

	for (const file of files) {
		let code = (await fs.readFile(
			file
		)).toString()

		if (file.endsWith(".mts")) {
			code = await tsStripTypesFromCode(code)
		}

		const tmp = await jsGetRequestedAssetsFromCode(code)

		// ignore files that don't use any assets
		if (tmp.used === false) continue

		// it's not clear which assets are used,
		// return immediately
		if (tmp.assets === "unknown") {
			return {used: true, assets: "unknown", reason: tmp.reason}
		}

		for (const asset of tmp.assets) {
			asset_map.set(`${asset.protocol}://${asset.path}`, 1)
		}
	}

	const assets : JsParseAssetURLResult[] = []

	for (const [key] of asset_map.entries()) {
		assets.push(jsParseAssetURL(key))
	}

	return {
		used: true,
		assets
	}
}
