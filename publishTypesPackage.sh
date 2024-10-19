#!/bin/bash -eufx

rm -rf dist.types

node initTypesPackage.mjs

cd dist.types

npm publish --access public
