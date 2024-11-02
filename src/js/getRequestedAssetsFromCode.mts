// @ts-ignore:next-line
import _traverse from "@babel/traverse"
// @ts-ignore:next-line
import {parse} from "@babel/core"

// see https://github.com/babel/babel/issues/13855
const traverse = _traverse.default

import {jsParseAssetURL} from "./parseAssetURL.mjs"
import type {JsParseAssetURLResult} from "@fourtune/types/base-realm-js-and-web/v0/"

export async function jsGetRequestedAssetsFromCode(code : string) {
	let asset_urls : false|JsParseAssetURLResult[] = []

	const ast = parse(code, {
		sourceType: "module"
	})

	traverse(ast, {
		CallExpression(path : any) {
			//
			// get the binding for the callee
			//
			const binding = path.scope.getBinding(path.node.callee.name)

			if (!binding) return

			// we are only interested in module bindings
			if (binding.kind !== "module") return

			// access the module node
			const module_node = binding.path.parentPath.node

			//
			// check if this is a call to getAsset()
			// from @fourtune/realm-js/assets
			//
			let is_call_to_getAsset = false

			for (const specifier of module_node.specifiers) {
				// ignore default imports
				if (specifier.type === "ImportDefaultSpecifier") {
					continue
				}

				if (
					// local name is the name used in the scope
					// {getAsset as localName}
					//              ^^^ local name
					specifier.local.name !== path.node.callee.name
				) {
					continue
				}

				if (
					specifier.imported.name === "getAsset" &&
					module_node.source.value === "@fourtune/realm-js/assets"
				) {
					is_call_to_getAsset = true
					break
				}
			}

			if (!is_call_to_getAsset) return

			if (path.node.arguments.length !== 1) {
				throw new Error(
					`getAsset() takes exactly one argument.`
				)
			}

			const url_param = path.node.arguments[0]

			if (url_param.type !== "StringLiteral") {
				// it doesn't make sense to continue from here
				// on since we can't know what
				// this call to getAsset is requesting so we
				// have to include all assets (this is the worst case)
				asset_urls = false

				path.stop()

				return
			}

			if (asset_urls === false) {
				throw new Error(`shouldn't be able to be here`)
			} else {
				asset_urls.push(
					jsParseAssetURL(url_param.value)
				)
			}
		}
	})

	return asset_urls
}
