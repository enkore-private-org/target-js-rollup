import path from "node:path"

function isModuleTypeScriptFile(id : string) {
	return id.endsWith(".mts") && !id.endsWith(".d.mts")
}

export default function(project_root : string) {
	return {
		id: "jsbundler-dts-resolver",

		resolveId(id : string) {
			// mark all "node:" imports as external
			if (id.startsWith("node:")) {
				return {id, external: true}
			}

			if (!id.startsWith("#/")) {
				return null
			}

			id = id.slice(2)

			//
			// files will be located at objects/src
			//
			id = path.join(
				project_root, "objects", "src", id
			)

			// resolve .mts ---> .d.mts
			if (isModuleTypeScriptFile(id)) {
				return {
					id: `${id.slice(0, -4)}.d.mts`
				}
			}

			// leave d.mts as is
			return {id}
		}
	}
}
