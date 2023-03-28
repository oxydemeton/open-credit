# Open Credit

An small open project to search for packages you use and mention them in one
file.<br> It uses Deno as a typescript runtime.

## Running Opencredit

### Ways to execute

1. Run the latest version directly with deno from github:

```sh
$ deno run https://raw.githubusercontent.com/oxydemeton/open-credit/master/src/index.ts
```

2. Download the source code and execute the `index.ts` file from the src
   directory. If you are not running windows and want an executable script add
   `#!/usr/bin/env -S deno run <permissions>` at the top of the `index.ts`.
   [Permissions list](#permissions)
3. Install an executable following the
   [Installation instructions](#installation).

### Permissions

- `allow-read=.` allows the script to read everything in the current directory.
  It won't but needs permission to scan for packages and configs.
- `allow-write=<output_files>` allows the script to write into the output files
  (markdown, json). You can also use `allow-write` or `allow-write` with a wider
  range of permission if you trust the script.
- `allow-net=crates.io` allows the script to call the [crates.io](crates.io)
  api. It is needed when using cargo and apis to grant access to this api.

### Configuration

#### Config File

The config file is a json or jsonc file for different settings. Default
`opencredit.jsonc` created with `init`:

```json
{
    "output": "CREDITS.md",
    "exclude": [],
    "allow_api_calls": false
}
```

##### Options:

- `output`: Path and name of the output markdown file.
- `exclude`: Which files with path and name to exclude. Folders are not
  supported yet.
- `json_report`: Optional: Path and name of a json file with all information.
  Not implemented yet.
- `allow_api_calls`: Rather opencredit is allowed to call apis (cargo api) to
  get further information about packages etc.
- `managers`: Array of managers which will be searched for.

### CLI

### Commands

- `init`: Creates a new config file. Use `--conf` to specify a non default name
  and `--managers` for enabled managers in the config
- `stats`: Print out statistics about dependencies of your project. Requires a
  config file. Specify a non default config file name with `--conf` and only
  enable some managers with `--managers`.
- `run`: Lists all dependencies in a markdown format. Requires a config file.
  Use `--conf` to specify a non default config file name. Use `--json` to also
  generate a json overview over all dependencies and `--md` to overwrite the
  output file. `--managers` will overwrite the managers from the config file.

### Args

When running opencredit you can specify:

- `--conf` to give a different path/name of the config file
- `--json` to overwrite the `json_report` path
- `--md` to overwrite the output of the markdown file
- `--managers` to overwrite the managers. You can list multiple managers like:
  npm,deno

## Examples

You can find example of different managers in the examples directory. You need
to run npm/pnpm install in the `npm` folder to create your node modules which
the script uses to identify modules.

## Supported Managers

- [x] Npm/Pnpm (using node_modules folder). called "npm" in config
- [x] Cargo (using cargo.lock and optionally cargo api). called "cargo" in
      config
- [x] Deno (using deno.lock file)
- [ ] Comments in files
- [ ] Special files

## Additional plans

- Warning for certain license types
- Simple CLI tool without config file need
- Implementation in other js build tools
- Add more Stats

## Why Deno

The Project is written in TypeScript using deno.<br> Deno was my first choice
because it does't create a folder for dependencies, supports TypeScript out of
the box, has a decent standard library and is more stable and has a wider
support than bun. Also deno allows the project to be bundled and "compiled".

## Installation

### Windows

1. Download `opencredit_windows_x64.zip`.
2. Unzip the archive
3. put `opencredit.exe` into a directory of your choice
4. add this directory to your system path
   (https://learn.microsoft.com/en-us/previous-versions/office/developer/sharepoint-2010/ee537574(v=office.14))
5. Restart pc or reload path in PowerShell
   (https://stackoverflow.com/questions/17794507/reload-the-path-in-powershell)
6. Use opencredit with the command `opencredit` in your terminal

### Linux

1. Download `opencredit_linux_x64.gz`
2. Unzip the file with:

```sh
$ gzip -d opencredit_linux_x64.gz`
```

3. Add the binaries to the `/opt` folder or add the path to your `$PATH`
   variable

### Compilation

1. Download Source code of you favorite version.
2. Unzip the archive and go into it
3. Run

```sh
$ deno compile <default permissions> src/index.ts
```

It will automatically select the right format/target for your os and cpu.
