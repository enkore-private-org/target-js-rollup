export type TsDeclarationBundlerOptions = {
	externals?: string[]
	onRollupLogFunction?: ((level: string, message: string) => undefined)|undefined
}
