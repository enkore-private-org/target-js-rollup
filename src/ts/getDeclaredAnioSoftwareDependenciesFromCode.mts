import type {TsGetDeclaredAnioSoftwareDependenciesFromCode} from "@fourtune/types/base-realm-js-and-web/v0/"
import ts from "typescript"

// this API is used to extract defined anio-software dependencies
// in a function file format like this:

// myFunction.mts
//
// import {dep1Function} from "@anio-software/dep1"
// import {dep2Function} from "@anio-software/dep2"
//
// type Dependencies = {
// 	dep1: typeof dep1Function
// 	dep2: typeof dep2Function
// }

// this allows us to automatically generate the code
// that calls the factories (dep1FunctionFactory, dep2FunctionFactory)
// for both dependencies.

type Entry = {
	module_name: string,
	export_name: string
}

function handleImportDeclaration(
	root_node: ts.Node,
	import_identifier_map: Map<string, Entry>,
	node: ts.ImportDeclaration
) {
	const module_name = node.moduleSpecifier.getText(
		root_node as ts.SourceFile
	).toString().slice(1).slice(0, -1)

	if (!node.importClause) return

	const clause : ts.ImportClause = node.importClause

	if (!clause.namedBindings) return

	if (!ts.isNamedImports(clause.namedBindings)) return

	const bindings = clause.namedBindings

	for (const element of bindings.elements) {
		const identifier = element.name.getText(
			root_node as ts.SourceFile
		)
		
		const export_name = element.propertyName ? element.propertyName.getText(
			root_node as ts.SourceFile
		) : identifier

		import_identifier_map.set(identifier, {
			module_name,
			export_name
		})
	}
}

function handleTypeAliasDeclaration(
	root_node: ts.Node,
	import_identifier_map: Map<string, Entry>,
	node: ts.TypeAliasDeclaration,
	dependencies: Map<string, Entry>
) {
	// only consider export'ed "Dependencies" type
	if (!node.modifiers) return
	if (node.modifiers[0].getText(root_node as ts.SourceFile) !== "export") return

	if (!ts.isTypeLiteralNode(node.type)) return

	for (const member of node.type.members) {
		if (!member.name) continue
		if (!ts.isPropertySignature(member)) continue
		if (!member.type) continue
		if (!ts.isTypeQueryNode(member.type)) continue

		const dependency_key = member.name.getText(
			root_node as ts.SourceFile
		)

		const dependency_identifier = member.type.exprName.getText(
			root_node as ts.SourceFile
		)

		if (!import_identifier_map.has(dependency_identifier)) continue

		dependencies.set(
			dependency_key,
			import_identifier_map.get(dependency_identifier)!
		)
	}
}

function transformerFactory(dependencies: Map<string, Entry>) {
	const import_identifier_map : Map<string, Entry> = new Map()

	return function transformer(context: ts.TransformationContext) {
		return (root_node: ts.Node) => {
			const visit = (node: ts.Node) : ts.Node => {
				const new_node = ts.visitEachChild(node, visit, context)

				if (ts.isImportDeclaration(new_node)) {
					handleImportDeclaration(root_node, import_identifier_map, new_node)
				} else if (ts.isTypeAliasDeclaration(new_node)) {
					const type_name = new_node.name.getText(
						root_node as ts.SourceFile
					)

					if (type_name === "Dependencies") {
						handleTypeAliasDeclaration(
							root_node,
							import_identifier_map,
							new_node,
							dependencies
						)
					}
				}

				return new_node
			}

			return ts.visitNode(root_node, visit)
		}
	}
}

export async function tsGetDeclaredAnioSoftwareDependenciesFromCode(
	code: string
) : ReturnType<TsGetDeclaredAnioSoftwareDependenciesFromCode> {
	const ret : Map<string, Entry> = new Map()

	const source_file = ts.createSourceFile(
		"index.mts",
		code,
		ts.ScriptTarget.ESNext
	)

	const transformer = transformerFactory(ret)

	ts.transform(source_file, [
		transformer
	])

	return ret
}
