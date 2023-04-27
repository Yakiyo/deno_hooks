# Deno Hooks [![CI](https://github.com/Yakiyo/deno_hooks/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Yakiyo/deno_hooks/actions/workflows/ci.yml)

A husky inspired git hooks manager for Deno.

Zero dependency, lightweight and fast.

## Usage

Run the script through Deno in your project/workspace

```bash
$ deno run --allow-read --allow-write https://deno.land/x/deno_hooks@0.1.1/mod.ts install
```

Optionally, add it as a deno task (recommended):

In your projects `deno.json` file, add it to the task section.

```json
{
	// --snip--
	"tasks": {
		"hook": "deno run --allow-read --allow-write https://deno.land/x/deno_hooks@0.1.1/mod.ts"
	}
}
```

Now you can run this quickly with `deno task hook`. Any additional
arguments provided after the invocation will get passed to the file.

### Commands:

- Install it once

```bash
$ deno task hook install
```

This creates a folder called `.hooks` for your git hooks. You can pass
a folder name of your choice too if you want. Defaults to `.hooks`

- Add a hook

```bash
$ deno task hook add .hooks/pre-commit "deno fmt --check"
```

This creates a shell file named `pre-commit`. Now, everytime u make a
commit, git will run the command `deno fmt --check` to check for
formatting errors. If theres no error, the commit passes, otherwise it
throws an error and aborts the commit. If u try to add an existing
task, then the provided command gets appended to the existing hook
file.

You can find a list of all git hooks
[here](https://git-scm.com/docs/githooks). Just add a new hook with
the corresponding name to make it work.

- Uninstall

```bash
$ deno task hook uninstall
```

This resets git's hookpath to the default. All hooks in your custom
directory becomes unusable after that. You can delete the directory if
you want.

### Customization

It's pretty straight forward. So theres nothing much to customize in
it. If for some reason you don't want to run the pre-commit or
corresponding hook for a git action u can use the `--no-verify` flag

```bash
$ git commit --no-verify -m "Rip Hooks"
```

This skips the pre-commit hook. For git actions that dont have a no
verify flag, u can use the `HOOK` environment variable to skip the
check. Just pass the value of HOOK as 0

```bash
$ HOOK=0 git commit -m "Skipping hook"
```

If you want to test your git hooks without making a commit, just add
`exit 1` to the end of your hook file so that git aborts the commit in
the end.

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/hook.sh"

deno lint
deno fmt --check
exit 1
```

The hook files themselves need to be shell scripts, but you can run
external scripts from it.

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/hook.sh"

# Running a ts file with deno
deno run scripts/test.ts

# Or maybe running a python file
python script.py
```

## Using with non-deno projects

The module only depends on deno to run, but it doesn't necessarily
need to be used only in a deno project. Unlike husky or npm, deno
doesnt have anything like a `package.json` file, so as long as you
have deno, u can use it in any project without any extra config files.

## Credits

This project was completely inspired by typicode's
[husky](https://github.com/typicode/husky) and most of the code
adapted from husky's code too. If you like this project, consider
giving husky's repository a visit too. Please star this project if it
was useful to you.

## Author

**deno_hooks** © [Yakiyo](https://github.com/Yakiyo). Authored and
maintained by Yakiyo.

Released under [MIT](https://opensource.org/licenses/MIT) License.
