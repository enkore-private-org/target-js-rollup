import type {JsBundlerPlugin} from "@fourtune/types/base-realm-js-and-web/v0"

export default function(plugins : JsBundlerPlugin[]) {
	const ret = {
		pre: [],
		post: []
	}

	for (const plugin of plugins) {
		// @ts-ignore:next-line
		ret[plugin.when].push(plugin.plugin)
	}

	return ret
}
