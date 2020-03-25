#!/bin/bash

ws_name="$1"
ws_scoped_name="@local/$ws_name"
ws_dir="local_modules/$ws_name"

logError() {
	echo -e "[ ERROR ] $1"
}

# make the workspace directory if it doesn't already exist
if [ ! -d "$ws_dir" ]; then
	mkdir -pv "$ws_dir"
else
	logError "A local module with that name already exists"
	exit 1
fi

# initialize the workspace
if [ -d "$ws_dir" ]; then
	# put the scoped name as the package name
	echo "{\"name\": \"$ws_scoped_name\"}" > "$ws_dir/package.json"
	# initialize the rest of the package.json
	cd "$ws_dir" && npm init --yes; yarn init --yes --private; cd -
else
	logError "A local module with that name already exists"
	exit 1
fi