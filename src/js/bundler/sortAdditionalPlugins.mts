import type {JsBundlerPlugin} from "../bundler.mjs"

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
