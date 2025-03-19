#!/bin/bash -eufx

rm -rf types.pkg

node ./createTypesPackage.mjs
