#!/bin/bash -euf

./node_modules/.bin/fourtune .
./createTypesPackage.sh

npm publish --provenance --access public

cd types.pkg

npm publish --access public
