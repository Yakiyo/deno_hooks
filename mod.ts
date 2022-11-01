/**
 * The entry point. Handles the command line arguments
 * and passes it to individual commands from the main file
 */
import * as cmd from './main.ts';

/**
 * Shows help command and exists process with status code
 */
function help(code: number, str = '') {
	console.log(`${str}Help Menu:
    install [dir] (default: .hooks)
    uninstall
    add <file> [cmd]`);
	Deno.exit(code);
}
// Taking out the args
// c as in command, f as in flag
const len = Deno.args.length;

const [c, f1, f2] = Deno.args;

try {
	switch (c) {
		case 'install': {
			cmd.install(f1);
			break;
		}
		case 'uninstall': {
			cmd.uninstall();
			break;
		}
		case 'add': {
			len < 3
				? help(
					2,
					'Invalid command usage. Insufficient arguments passed\n',
				)
				: cmd.add(f1, f2);
			break;
		}
		default:
			help(0, 'No arguments provided.');
			break;
	}
} catch (e) {
	console.error(e instanceof Error ? `Hook error - ${e.message}` : e);
	Deno.exit(1);
}
