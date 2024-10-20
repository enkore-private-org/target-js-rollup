import type {DefaultExportObject} from "@fourtune/types/base-realm-js-and-web/v0/"

import {tsStripTypesFromCode} from "./ts/stripTypesFromCode.mjs"
import {tsReadTSConfigFile} from "./ts/readTSConfigFile.mjs"
import {tsInvokeTypeScript} from "./ts/invokeTypeScript.mjs"
import {tsBundler} from "./ts/bundler.mjs"

import * as ts from "typescript"

import {jsBundler} from "./js/bundler.mjs"
import {jsResolveImportAliases} from "./js/resolveImportAliases.mjs"

const _default : DefaultExportObject = {
	tsStripTypesFromCode,
	tsReadTSConfigFile,
	tsInvokeTypeScript,
	tsBundler,
	ts,
	jsBundler,
	jsResolveImportAliases
}

export default _default
