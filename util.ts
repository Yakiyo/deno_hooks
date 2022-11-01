/**
 * Utility functions used in the main file.
 */

import { dirname } from 'https://deno.land/std@0.161.0/path/posix.ts';

/**
 * Run git commands
 */
export function git(args: string[]) {
	return Deno.run({
		cmd: [
			'git',
			...args,
		],
		stdout: 'piped',
		stdin: 'piped',
		stderr: 'piped',
	});
}

/**
 * Creates a new hook file
 */
export function set(file: string, cmd: string) {
	const dir = dirname(file);
	if (!exists(dir)) {
		throw new Error(
			`Cannot create hook. Directory ${dir} doesn't exist.
		Make sure you have provided a valid directory or install before running this command.`,
		);
	}
	Deno.writeFileSync(
		file,
		new TextEncoder().encode(
			`#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/hook.sh"\n\n${cmd}\n`,
		),
		{ mode: 0o0755 },
	);
	console.log('Successfully created file');
}
/**
 * Check if a dir/file exists
 *
 * std::fs::exists is deprecated, so this is a roundabout way of
 * checking things.
 */
export function exists(p: string): boolean {
	try {
		Deno.statSync(p);
		return true;
	} catch (_) {
		return false;
	}
}
