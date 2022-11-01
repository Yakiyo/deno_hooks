#!/usr/bin/env sh

# This was taken from husky. Credits to typicode
# Husky Repo: https://github.com/typicode/husky

# Finally understood what this if block is for
if [ -z "$skip_init" ]; then
	if [ "$HOOK" = "0" ]; then
		echo "HOOK env set to 0, skipping hook"
		exit 0
	fi

	readonly hook="$(basename -- "$0")"

	echo "Running $hook hook"

	readonly skip_init=1
	export skip_init
	sh -e "$0" "$@"

	eCode=$?
	
	if [ $eCode != 0 ]; then
		echo "hook - $hook hook exited with code $eCode (error)"
	fi

	if [ $eCode = 127 ]; then
		echo "hook - command not found in PATH=$PATH"
	fi

	exit $eCode
fi