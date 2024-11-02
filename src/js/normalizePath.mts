export function jsNormalizePath(path : string) {
	while (path.indexOf("//") !== -1) {
		path = path.split("//").join("/")
	}

	return path
}
