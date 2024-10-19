export default function({input_file_type}, entry_code) {
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
