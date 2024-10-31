import * as ts from "typescript"
import type {TsResolveImportAliasesOptions} from "@fourtune/types/base-realm-js-and-web/v0/"
import type {TsAliases} from "@fourtune/types/base-realm-js-and-web/v0/"

function transformerFactory(
	aliases : TsAliases
) {
	return function transformer(context: ts.TransformationContext) {
		return (root_node: ts.Node) => {
			const visit = (node: ts.Node) : ts.Node => {
				const new_node = ts.visitEachChild(node, visit, context)

				if (ts.isImportDeclaration(new_node)) {
					const import_specifier = new_node.moduleSpecifier.getText(
						root_node as ts.SourceFile
					).toString().slice(1).slice(0, -1)

					let new_import_specifier = import_specifier

					for (const alias in aliases) {
						if (import_specifier.startsWith(alias)) {
							new_import_specifier = import_specifier.slice(alias.length)
							new_import_specifier = `${aliases[alias]}${new_import_specifier}`

							break
						}
					}

					return context.factory.createImportDeclaration(
						new_node.modifiers,
						new_node.importClause,
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
