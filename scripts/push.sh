#!/bin/bash

pushd .
# echo "Generating new site.."
# hugo -d ../tokencard.github.io -b https://tokencard.io

# Github updates

echo "Pulling static site"

cd ../tokencard.github.io
git pull

echo "Pushing"

git add .
git commit -m "update: $1"
git push

popd
