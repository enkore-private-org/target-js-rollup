#!/bin/bash -euf

npm publish --provenance --access public

./publishTypesPackage.sh
