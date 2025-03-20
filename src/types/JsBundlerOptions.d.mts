export type JsBundlerPlugin = {
	when: "pre" | "post"
	plugin: (...args: any[]) => any
}

export type JsBundlerOptions = {
	minify?: boolean
	treeshake?: boolean
	externals?: string[]

	additionalPlugins?: JsBundlerPlugin[]
	onRollupLogFunction?: ((level: string, message: string) => undefined)|undefined
}
