import {parse} from "@babel/parser"

export async function tsGetDeclaredExportNamesFromCode(
	input : string
) {
	const export_map = new Map()

	const result = parse(
		input, {
			sourceType: "module",
			plugins: ["typescript"]
		}
	)

	for (const node of result.program.body) {
		if (node.type === "ExportDefaultDeclaration") {
			export_map.set("default", 1)
		} else if (node.type === "ExportNamedDeclaration") {
			let export_name = ""

			if (node.declaration) {
				if (node.declaration.type === "FunctionDeclaration") {
					if (node.declaration.id && "name" in node.declaration.id) {
						export_name = node.declaration.id.name
					}
				} else if (node.declaration.type === "VariableDeclaration") {
					if (node.declaration.declarations.length !== 1) {
						throw new Error(`tsGetDeclaredExportNamesFromCode: error condition 1`)
					}

					const tmp = node.declaration.declarations[0].id

					if (tmp && "name" in tmp) {
						export_name = tmp.name
					}
				}
			} else if (node.specifiers.length >= 1) {
				for (const specifier of node.specifiers) {
					if (specifier.exported && "name" in specifier.exported) {
						export_name = specifier.exported.name
					}
				}
			} else {
				throw new Error(`tsGetDeclaredExportNamesFromCode: error condition 2`)
			}

			if (export_name.length) {
				export_map.set(export_name, 1)
			}
		}
	}

	return [...export_map.entries()].map(([key, value]) => {
		return key
	})
}
