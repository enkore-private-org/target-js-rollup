import * as ts from "typescript"

export function createSourceFile(
	code: string
) : ts.SourceFile {
	return ts.createSourceFile(
		"index.mts",
		code,
		ts.ScriptTarget.ESNext,
		true // needed to make JSDocs work
	)
}
