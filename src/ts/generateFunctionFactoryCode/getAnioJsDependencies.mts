import ts from "typescript"
import path from "node:path"
import fs from "node:fs/promises"

import {
	type Instance,
	getExportByName,
	getImportByIdentifier,
	getImports,
	parseCode
} from "@aniojs/node-ts-utils"

export type AnioJsDependency = {
	name: string
	definition: string
	factory: string
}

function processTypeAliasDeclaration(
	inst: Instance,
	node: ts.TypeAliasDeclaration
) : AnioJsDependency[]|false {
	const ret : AnioJsDependency[] = []

	const {source} = inst
	const imports = getImports(inst)

	// only consider export'ed "Dependencies" type
	if (!node.modifiers) return false
	if (node.modifiers[0].getText(source) !== "export") return false

	if (!ts.isTypeLiteralNode(node.type)) return false

	for (const member of node.type.members) {
		if (!member.name) continue
		if (!ts.isPropertySignature(member)) continue

		if (!member.type) continue
		if (!ts.isTypeQueryNode(member.type)) continue

		const dependency_key = member.name.getText(source)
		const dependency_identifier = member.type.exprName.getText(source)

		const import_decl = getImportDeclarationByIdentifier(dependency_identifier)

		if (!import_decl) continue

		ret.push({
			name: dependency_key,
			...import_decl
		})
	}

	ret.sort((a, b) => {
		return a.name.localeCompare(b.name)
	})

	return ret

	function getImportDeclarationByIdentifier(identifier: string) {
		for (const imp of imports) {
			if (imp.identifier === identifier && imp.kind === "named") {
				return {
					definition: `import {${imp.import_name}Factory} from "${imp.module_name}"`,
					factory: `${imp.import_name}Factory`
				}
			}
		}

		return null
	}
}

export async function getAnioJsDependencies(
	project_root: string,
	inst: Instance
) : Promise<AnioJsDependency[]|false> {
	const dep_export = getExportByName(inst, "AnioJsDependencies", "type-only")

	if (!dep_export) {
		return false
	}

	const {node} = dep_export

	let type_alias_node : ts.TypeAliasDeclaration|null = null
	// needs to be updated if
	// AnioJsDependencies was declared in another file
	let type_alias_node_instance : Instance = inst

	// export type {AnioJsDependencies} style
	if (ts.isExportSpecifier(node)) {
		const anio_js_dependencies_import = getImportByIdentifier(inst, "AnioJsDependencies", "type-only")

		if (!anio_js_dependencies_import) {
			throw new Error(
				`Unable to find import statement for "AnioJsDependencies".`
			)
		}

		const unresolved_path = anio_js_dependencies_import.module_name
		let resolved_path = ""

		if (unresolved_path.startsWith("#~src/")) {
			resolved_path = path.join(
				project_root, "src", unresolved_path.slice(6)
			)
		}
		// NB: async.sync auto files are generated before user files
		//     so this OK (will not lead ot out of sync behaviour)
		else if (unresolved_path.startsWith("#~synthetic/async.sync/")) {
			console.log("p",unresolved_path.slice(23))
			resolved_path = path.join(
				project_root, "auto", "synthetic", "async.sync", "src", unresolved_path.slice(23)
			)
		} else {
			throw new Error(
				`Import path for AnioJsDependencies must start with "#~src/" or "#~synthetic/".`
			)
		}

		const source = parseCode(
			(await fs.readFile(resolved_path)).toString()
		)

		const exp = getExportByName(source, "AnioJsDependencies", "type-only")

		if (exp && ts.isTypeAliasDeclaration(exp.node)) {
			type_alias_node = exp.node
			type_alias_node_instance = source
		}
	}
	// export type AnioJsDependencies = {} style
	else if (ts.isTypeAliasDeclaration(node)) {
		type_alias_node = node
	} else {
		throw new Error(`Invalid node kind for "AnioJsDependencies" type export.`)
	}

	if (!type_alias_node) {
		return false
	}

	return processTypeAliasDeclaration(
		type_alias_node_instance,
		type_alias_node
	)
}
