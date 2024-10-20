#!/bin/bash -euf

./node_modules/.bin/tsc -p tsconfig.json

npm publish --provenance --access public
