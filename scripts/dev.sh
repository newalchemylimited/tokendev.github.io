#!/bin/bash

pushd .
echo "Dev Site: You must have ../tokendev.github.io set up and cloned"

# echo "Generating new site.."
# hugo -d ../tokendev.github.io

# Github updates

echo "Pulling static site"

cd ../tokendev.github.io
git pull

echo "Pushing"

git add .
git commit -m "update: $1"
git push

popd
