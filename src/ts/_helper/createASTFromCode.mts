import * as ts from "typescript"

export async function _createASTFromCode(
	code: string
) : Promise<ts.SourceFile> {
	return ts.createSourceFile(
		"index.mts",
		code,
		ts.ScriptTarget.ESNext,
		true // needed to make JSDocs work
	)
}
