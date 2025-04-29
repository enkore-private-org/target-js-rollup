//
// NB: simplified type, in order to not have to include
// all types defined in the "rollup" package
//
type RollupPlugin = {
	name: string

	intro?: () => string
	resolveId?: (id: string) => string|null|Promise<string|null>
	load?: (id: string) => string|null|Promise<string|null>
	transform?: (code: string, id: string) => string|null|Promise<string|null>
}

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
