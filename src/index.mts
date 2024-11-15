import type {DefaultExportObject} from "@fourtune/types/base-realm-js-and-web/v0/"

import {tsStripTypesFromCode} from "./ts/stripTypesFromCode.mjs"
import {tsReadTSConfigFile} from "./ts/readTSConfigFile.mjs"
import {tsInvokeTypeScript} from "./ts/invokeTypeScript.mjs"
import {tsBundler} from "./ts/bundler.mjs"
import {tsGetDeclaredExportNamesFromCode} from "./ts/getDeclaredExportNamesFromCode.mjs"
import {tsGetDeclaredExportNamesFromCode as jsGetDeclaredExportNamesFromCode} from "./ts/getDeclaredExportNamesFromCode.mjs"
import {tsResolveImportAliases} from "./ts/resolveImportAliases.mjs"
import {tsGetDeclaredAnioSoftwareDependenciesFromCode} from "./ts/getDeclaredAnioSoftwareDependenciesFromCode.mjs"
import {tsGetExportedFunctionFromCode} from "./ts/getExportedFunctionFromCode.mjs"

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
	tsBundler,
	tsGetDeclaredExportNamesFromCode,
	tsGetDeclaredAnioSoftwareDependenciesFromCode,
	tsGetExportedFunctionFromCode,
	ts,
	jsBundler,
	jsResolveImportAliases,
	jsGetDeclaredExportNamesFromCode,
	tsResolveImportAliases,
	jsGetRequestedAssetsFromCode,
	jsGetRequestedAssetsFromFiles,
	jsNormalizePath,
	jsParseAssetURL,
	jsGetBaseTsConfigPath
}

export default _default
