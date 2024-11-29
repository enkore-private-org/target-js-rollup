import * as ts from "typescript"
import type {
	TsGetExportsFromCodeDeclarationElement,
	TsGetExportsFromCodeEntity
} from "@fourtune/types/base-realm-js-and-web/v0"

import {createSourceFile} from "./utils/createSourceFile.mjs"
import {mapNodes} from "./utils/mapNodes.mjs"

export async function tsGetExportsFromCode(
	code: string
) : Promise<TsGetExportsFromCodeEntity[]> {
	const source = createSourceFile(code)

	return mapNodes(source, (node: ts.Node) : TsGetExportsFromCodeEntity|null => {
		if (node.parent !== source) return null

		if (ts.isExportDeclaration(node)) {
			// .exportClause will not be assigned in the case of
			// export * from "foo"
			if (node.exportClause) {
				if (ts.isNamedExports(node.exportClause)) {
					const elements : TsGetExportsFromCodeDeclarationElement[] = []

					for (const element of node.exportClause.elements) {
						elements.push({
							is_type_only: element.isTypeOnly || node.isTypeOnly,
							export_name: element.name.getText(source),
							original_name: element.propertyName?.getText(source) || element.name.getText(source)
						})
					}

					let ret : TsGetExportsFromCodeEntity = {
						node,
						kind: "named",
						elements
					}

					if (node.moduleSpecifier) {
						ret.module_name = node.moduleSpecifier.getText(source).slice(1, -1)
					}

					return ret
				}
				// doesn't exist for types afaik
				else if (ts.isDefaultClause(node.exportClause)) {
					return null
				} else {
					throw new Error(`Unknown node kind for node.exportClause.`)
				}
			}

			if (!node.moduleSpecifier) {
				throw new Error(`node.moduleSpecifier must be set.`)
			}

			return {
				node,
				kind: "star",
				module_name: node.moduleSpecifier.getText(source).slice(1, -1)
			}
		} else if (ts.isTypeAliasDeclaration(node) && node.modifiers) {
			const modifiers = node.modifiers.map(m => m.kind)

			if (!modifiers.includes(ts.SyntaxKind.ExportKeyword)) return null

			return {
				node,
				kind: "type",
				name: node.name.getText(source)
			}
		} else if (ts.isFunctionDeclaration(node) && node.modifiers) {
			const modifiers = node.modifiers.map(m => m.kind)

			if (!modifiers.includes(ts.SyntaxKind.ExportKeyword)) return null

			if (node.name) {
				return {
					node,
					kind: "namedFunction",
					name: node.name.getText(source)
				}
			}

			return {
				node,
				kind: "defaultFunction"
			}
		} else if (ts.isVariableStatement(node) && node.modifiers) {
			const modifiers = node.modifiers.map(m => m.kind)

			if (!modifiers.includes(ts.SyntaxKind.ExportKeyword)) return null

			let ret : TsGetExportsFromCodeEntity = {
				node,
				kind: "variables",
				elements: []
			}

			for (const element of node.declarationList.declarations) {
				ret.elements.push({
					name: element.name.getText(source)
				})
			}

			return ret
		} else if (ts.isExportAssignment(node)) {
			return {
				kind: "default",
				node,
				expression: node.expression.getText(source)
			}
		}

		return null
	}).filter(n => n !== null)
}
