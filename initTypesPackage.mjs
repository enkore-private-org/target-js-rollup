import {rollup} from "rollup"
import {dts} from "rollup-plugin-dts"
import fs from "node:fs/promises"
import { type } from "node:os"

await fs.mkdir("dist.types")

const bundle = await rollup({
	input: "./src/index.mts",
	plugins: [dts()]
})

const {output} = await bundle.generate({})

const package_json_str = (await fs.readFile("./package.json")).toString()
let package_json = JSON.parse(package_json_str)

package_json["name"] += "-types"

const typescript = package_json["dependencies"]["typescript"]

delete package_json["dependencies"]
delete package_json["devDependencies"]

package_json["dependencies"] = {
	"typescript": typescript
}

package_json["exports"]["."]["import"] = ""
package_json["exports"]["."]["types"] = "./index.d.mts"
package_json["files"] = ["./index.d.mts"]

await fs.writeFile(
	"./dist.types/index.d.mts", output[0].code + "\n"
)

await fs.writeFile(
	"./dist.types/package.json", JSON.stringify(package_json, null, 4) + "\n"
)

