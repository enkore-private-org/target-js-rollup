export default function(plugins) {
	const ret = {
		pre: [],
		post: []
	}

	for (const plugin of plugins) {
		ret[plugin.when].push(plugin.plugin)
	}

	return ret
}
