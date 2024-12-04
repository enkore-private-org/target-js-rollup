import type {JsBundlerOptions} from "@fourtune/types/base-realm-js-and-web/v0"

export default function(options : JsBundlerOptions, entry_code : string) {
	const {input_file_type} = options

	if (input_file_type === "mjs") {
		return {
			"virtual_entry.mjs": entry_code
		}
	} else if (input_file_type === "dts") {
		return {
			"virtual_entry.d.mts": entry_code
		}
	} else {
		throw new Error(`Invalid input file type "${input_file_type}".`)
	}
}
