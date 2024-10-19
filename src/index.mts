import {tsStripTypesFromCode} from "./ts/stripTypesFromCode.mjs"
import {tsReadTSConfigFile} from "./ts/readTSConfigFile.mjs"
import {tsInvokeTypeScript} from "./ts/invokeTypeScript.mjs"
import {tsBundler} from "./ts/bundler.mjs"

import * as ts from "typescript"

import {jsBundler} from "./js/bundler.mjs"
import {jsResolveImportAliases} from "./js/resolveImportAliases.mjs"

export type TsStripTypesFromCode = typeof tsStripTypesFromCode
export type TsReadTSConfigFile = typeof tsReadTSConfigFile
export type TsInvokeTypeScript = typeof tsInvokeTypeScript
export type TsBundler = typeof tsBundler
export type JsBundler = typeof jsBundler
export type JsResolveImportAliases = typeof jsResolveImportAliases

export default {
	tsStripTypesFromCode,
	tsReadTSConfigFile,
	tsInvokeTypeScript,
	tsBundler,
	ts,
	jsBundler,
	jsResolveImportAliases
}
