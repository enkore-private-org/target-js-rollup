export function pathResolvesToFourtuneGetAssetExport(
	path : any, binding_name : string
) : boolean {
	const binding = path.scope.getBinding(binding_name)

	if (!binding) return false

	// we are only interested in module bindings
	if (binding.kind !== "module") return false

	// access the module node
	const module_node = binding.path.parentPath.node

	//
	// check if this is a call to getAsset()
	// from @fourtune/realm-js/assets
	//
	for (const specifier of module_node.specifiers) {
		// ignore default imports
		if (specifier.type === "ImportDefaultSpecifier") {
			continue
		}

		if (
			// local name is the name used in the scope
			// {getAsset as localName}
			//              ^^^ local name
			specifier.local.name !== binding_name
		) {
			continue
		}

		if (
			specifier.imported.name === "getAsset" &&
			module_node.source.value === "@fourtune/realm-js/assets"
		) {
			return true
		}
	}

	return false
}
