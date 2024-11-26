import * as ts from "typescript"
import {isolateNodes} from "./isolateNodes.mjs"
import {getImportMap} from "./getImportMap.mjs"
import {getTypesReferencedInNode} from "./getTypesReferencedInNode.mjs"
import {getJSDocAsStringFromNode} from "./getJSDocAsStringFromNode.mjs"

export type TopLevelTypes = Map<string, {
	definition: string,
	jsdoc: string,
	depends_on_types: string[]
}>

function convertSpacesToTabs(
	str: string
) : string {
	let ret_lines : string[] = []

	const lines = str.split("\n")

	for (const line of lines) {
		let last_space_position = 0

		for (; last_space_position < line.length; ++last_space_position) {
			if (line[last_space_position] !== " ") break;
		}

		const indent_level = Math.floor(last_space_position / 4)

		ret_lines.push("\t".repeat(indent_level) + `${line.slice(
			indent_level * 4
		)}`)
	}

	return ret_lines.join("\n")
}

export function getTopLevelTypes(
	source: ts.SourceFile
) : TopLevelTypes {
	const top_level_types : TopLevelTypes = new Map()

	function addType(
		node: ts.Node|null,
		name: string,
		definition: string
	) : undefined {
		top_level_types.set(name, {
			definition,
			jsdoc: node ? getJSDocAsStringFromNode(node) : "",
			depends_on_types: node ? getTypesReferencedInNode(node) : []
		})
	}

	const top_level_type_aliases : ts.TypeAliasDeclaration[] = (
		isolateNodes(
			source, (node: ts.Node) => {
				if (node.parent !== source) return false
				if (!ts.isTypeAliasDeclaration(node)) return false

				return true
			}
		)
	) as ts.TypeAliasDeclaration[]

	for (const top_level_type_alias of top_level_type_aliases) {
		const new_type_alias_node = ts.factory.createTypeAliasDeclaration(
			[],
			top_level_type_alias.name,
			top_level_type_alias.typeParameters,
			top_level_type_alias.type
		)

		addType(
			top_level_type_alias,
			top_level_type_alias.name.getText(source),
			convertSpacesToTabs(
				ts.createPrinter().printNode(
					ts.EmitHint.Unspecified, new_type_alias_node, source
				)
			)
		)
	}

	const import_map = getImportMap(source)

	for (const [identifier, import_info] of import_map.entries()) {
		if (!import_info.is_type_only) continue
		let definition = ``

		if (import_info.kind === "default") {
			definition = `import type ${identifier} from "${import_info.module_name}"`
		} else if (import_info.kind === "named") {
			if (import_info.import_name === identifier) {
				definition = `import type {${identifier}} from "${import_info.module_name}"`
			} else {
				definition = `import type {${import_info.import_name} as ${identifier}} from "${import_info.module_name}"`
			}
		} else {
			definition = `import type * as ${identifier} from "${import_info.module_name}"`
		}

		addType(null, identifier, definition)
	}

	return top_level_types
}
