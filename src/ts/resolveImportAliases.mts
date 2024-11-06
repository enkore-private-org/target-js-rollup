import * as ts from "typescript"
import type {TsResolveImportAliasesOptions} from "@fourtune/types/base-realm-js-and-web/v0/"
import type {TsAliases} from "@fourtune/types/base-realm-js-and-web/v0/"

function sortAliases(aliases : TsAliases) {
	let sorted = []

	for (const key in aliases) {
		sorted.push({key, value: aliases[key]})
	}

	sorted.sort((a, b) => {
		return b.key.length - a.key.length
	})

	return sorted.map(entry => {
		return {
			alias: entry.key,
			substitute: entry.value
		}
	})
}

function resolveImportAlias(
	sorted_aliases: {alias: string, substitute: string}[],
	import_specifier: string
) {
	let new_import_specifier = import_specifier

	for (const {alias, substitute} of sorted_aliases) {
		if (import_specifier.startsWith(alias)) {
			new_import_specifier = import_specifier.slice(alias.length)
			new_import_specifier = `${substitute}${new_import_specifier}`

			break
		}
	}

	return new_import_specifier
}

function transformerFactory(
	aliases : TsAliases
) {
	const sorted_aliases = sortAliases(aliases)

	return function transformer(context: ts.TransformationContext) {
		return (root_node: ts.Node) => {
			const visit = (node: ts.Node) : ts.Node => {
				const new_node = ts.visitEachChild(node, visit, context)

				if (ts.isImportDeclaration(new_node)) {
					const import_specifier = new_node.moduleSpecifier.getText(
						root_node as ts.SourceFile
					).toString().slice(1).slice(0, -1)

					const new_import_specifier = resolveImportAlias(sorted_aliases, import_specifier)

					return context.factory.createImportDeclaration(
						new_node.modifiers,
						new_node.importClause,
						ts.factory.createStringLiteral(new_import_specifier),
						new_node.attributes
					)
				} else if (ts.isExportDeclaration(new_node) && new_node.moduleSpecifier) {
					const import_specifier = new_node.moduleSpecifier.getText(
						root_node as ts.SourceFile
					).toString().slice(1).slice(0, -1)

					const new_import_specifier = resolveImportAlias(sorted_aliases, import_specifier)

					return context.factory.createExportDeclaration(
						new_node.modifiers,
						new_node.isTypeOnly,
						new_node.exportClause,
						ts.factory.createStringLiteral(new_import_specifier),
						new_node.attributes
					)
				}

				return new_node
			}

			return ts.visitNode(root_node, visit)
		}
	}
}

export async function tsResolveImportAliases(
	code : string, {
		filename = "index.d.mts",
		aliases = {}
	} : TsResolveImportAliasesOptions = {}
) {
	const source_file = ts.createSourceFile(
		filename,
		code,
		ts.ScriptTarget.ESNext
	)

	const transformer = transformerFactory(aliases)

	const {transformed} = ts.transform(source_file, [
		transformer
	])

	const printer = ts.createPrinter()

	return printer.printNode(
		ts.EmitHint.Unspecified,
		transformed[0],
		ts.createSourceFile("", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS)
	)
}
