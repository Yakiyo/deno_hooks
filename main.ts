/**
 * The main file, where all the cli commands are created.
 */
import { join } from 'https://deno.land/std@0.161.0/path/posix.ts';

import { exists, git, set } from './util.ts';
import { script } from './hook.ts';

/**
 * Install hooks
 */
export async function install(dir = '.hooks') {
	if ((await git(['rev-parse']).status()).code !== 0) {
		throw new Error(
			'Not a git repository. You can only use this in a git repository',
		);
	}
	if (!exists('.git/')) {
		throw new Error(
			'.git directory not found. Run again in the git repository\'s top level directory.',
		);
	}

	try {
		// Create dirs
		Deno.mkdirSync(join(dir, '_'), { recursive: true });

		// Create .gitignore
		Deno.writeFileSync(
			join(dir, '_/.gitignore'),
			new TextEncoder().encode('*'),
		);

		// Write hook.sh file using string from hook.ts
		Deno.writeFileSync(
			join(dir, '_/hook.sh'),
			new TextEncoder().encode(script),
		);

		// Copy hook.sh file to the repos .hooks/_hook.sh
		// Deno.copyFileSync('./hook.sh', join(dir, '_/hook.sh'));

		const p = git(['config', 'core.hooksPath', dir]);
		const rawError = await p.stderrOutput();
		if ((await p.status()).code !== 0) {
			throw rawError;
		}
	} catch (e) {
		console.error('Failed to install hook');
		throw e;
	}
	console.log('Successfully installed hooks');
}

/**
 * Adds a new hook or append the command to an existing hook file
 */
export function add(file: string, cmd: string) {
	if (exists(file)) {
		Deno.writeFileSync(file, new TextEncoder().encode(`${cmd}\n`), {
			append: true,
		});
	} else {
		set(file, cmd);
	}
}

/**
 * Uninstall hooks by resetting git hook path to default
 */
export function uninstall() {
	git(['config', '--unset', 'core.hooksPath']);
	console.log(
		'Successfully reset git hook path. You can delete your hook directory.',
	);
}
