import fs from "node:fs/promises"
import path from "node:path"
import {fileURLToPath} from "node:url"

const __dirname = path.dirname(
	fileURLToPath(import.meta.url)
)

await fs.mkdir(
	path.join(__dirname, "types.pkg")
)

let package_json = JSON.parse(
	await fs.readFile(
		path.join(__dirname, "package.json")
	)
)

delete package_json.dependencies
delete package_json.devDependencies
delete package_json.repository
delete package_json.files
delete package_json.scripts

package_json.name = "@enkore-types/realm-js-and-web-utils"

package_json.exports = {
	".": {
		types: "./index.d.mts"
	}
}

await fs.writeFile(
	path.join(
		__dirname, "types.pkg", "package.json"
	), JSON.stringify(package_json, undefined, 4) + "\n"
)

await fs.copyFile(
	path.join(__dirname, "dist", "default", "ModuleExport.d.mts"),
	path.join(__dirname, "types.pkg", "index.d.mts")
)
