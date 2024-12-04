import type {DefaultExportObject} from "@fourtune/types/base-realm-js-and-web/v0/"

import {tsStripTypesFromCode} from "./ts/stripTypesFromCode.mjs"
import {tsReadTSConfigFile} from "./ts/readTSConfigFile.mjs"
import {tsInvokeTypeScript} from "./ts/invokeTypeScript.mjs"
import {tsGetDeclaredExportNamesFromCode} from "./ts/getDeclaredExportNamesFromCode.mjs"
import {tsGetDeclaredExportNamesFromCode as jsGetDeclaredExportNamesFromCode} from "./ts/getDeclaredExportNamesFromCode.mjs"
import {tsResolveImportAliases} from "./ts/resolveImportAliases.mjs"
import {tsGenerateFunctionFactoryCode} from "./ts/generateFunctionFactoryCode/index.mjs"
import {tsGetExportedEntities} from "./ts/getExportedEntities.mjs"

import * as ts from "typescript"

import {jsBundler} from "./js/bundler.mjs"
import {jsResolveImportAliases} from "./js/resolveImportAliases.mjs"
import {jsGetRequestedAssetsFromCode} from "./js/getRequestedAssetsFromCode/index.mjs"
import {jsGetRequestedAssetsFromFiles} from "./js/getRequestedAssetsFromFiles.mjs"
import {jsNormalizePath} from "./js/normalizePath.mjs"
import {jsParseAssetURL} from "./js/parseAssetURL.mjs"
import {jsGetBaseTsConfigPath} from "./js/getBaseTsConfigPath.mjs"

const _default : DefaultExportObject = {
	tsStripTypesFromCode,
	tsReadTSConfigFile,
	tsInvokeTypeScript,
	tsGetDeclaredExportNamesFromCode,
	tsGenerateFunctionFactoryCode,
	ts,
	jsBundler,
	jsResolveImportAliases,
	jsGetDeclaredExportNamesFromCode,
	tsResolveImportAliases,
	tsGetExportedEntities,
	jsGetRequestedAssetsFromCode,
	jsGetRequestedAssetsFromFiles,
	jsNormalizePath,
	jsParseAssetURL,
	jsGetBaseTsConfigPath
}

export default _default
