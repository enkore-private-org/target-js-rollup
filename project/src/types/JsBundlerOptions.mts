import type {Plugin as RollupPlugin} from "rollup"

export type JsBundlerPlugin = {
	when: "pre" | "post"
	plugin: RollupPlugin
}

export type JsBundlerOptions = {
	minify?: boolean
	treeshake?: boolean
	externals?: string[]

	additionalPlugins?: JsBundlerPlugin[]
	onRollupLogFunction?: ((level: string, message: string) => undefined)|undefined
}
