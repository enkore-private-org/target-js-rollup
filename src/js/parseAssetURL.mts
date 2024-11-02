import {jsNormalizePath} from "./normalizePath.mjs"
import type {
	JsParseAssetURLResult,
	JsAssetURLProtocol
} from "@fourtune/types/base-realm-js-and-web/v0/"

export function jsParseAssetURL(
	url : string
) : JsParseAssetURLResult {
	const protocols = [
		// return asset as raw text
		"text://",
		// return asset as a javascript bundle
		"js-bundle://"
	]

	let used_protocol = null

	for (const protocol of protocols) {
		if (url.startsWith(protocol)) {
			used_protocol = protocol
			break
		}
	}

	if (used_protocol === null) {
		throw new Error(`Invalid protocol in URL "${url}".`)
	}

	return {
		// remove trailing "://"
		protocol: used_protocol.slice(0, -3) as JsAssetURLProtocol,
		path: jsNormalizePath(url.slice(used_protocol.length))
	}
}
