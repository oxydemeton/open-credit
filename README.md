# Open Credit

An small open project to search for packages you use and mention them in one
file.<br> It uses Deno as a typescript runtime.

## How to use

1. Create a `opencredit.jsonc`
2. Define your settings if needed
3. Run the script in your projects root. Allow Read and if api calls are enabled
   also networking when running `deno` with the `index.ts`

### Installation

#### Windows

1. Download `opencredit_windows_x64.zip`.
2. Unzip the archive
3. put `opencredit.exe` into a directory of your choice
4. add this directory to your system path
   (https://learn.microsoft.com/en-us/previous-versions/office/developer/sharepoint-2010/ee537574(v=office.14))
5. Restart pc or reload path in PowerShell
   (https://stackoverflow.com/questions/17794507/reload-the-path-in-powershell)
6. Use opencredit with the command `opencredit` in your terminal

#### Linux

1. Download `opencredit_linux_x64.gz`
2. Unzip the file with `gzip -d opencredit_linux_x64.gz`
3. Add the binaries to the `/usr/bin` folder or add the path to your `$PATH`
   variable

### Use Deno (universal)

If you have Deno installed, you can use `deno run` to execute the index.ts from
the `src` directory.

## Configuration

### Config File

The config file is a json or jsonc file for different settings. Default
`opencredit.jsonc` created with `init`:

```json
{
    "output": "CREDITS.md",
    "exclude": [],
    "allow_api_calls": false
}
```

#### Options:

- `output`: Path and name of the output markdown file.
- `exclude`: Which files with path and name to exclude. Folders are not
  supported yet.
- `json_report`: Optional: Path and name of a json file with all information.
  Not implemented yet.
- `allow_api_calls`: Rather opencredit is allowed to call apis (cargo api) to
  get further information about packages etc.
- `managers`: Array of managers which will be searched for.

### Command Line Arguments

When running opencredit you can specify:

- `--conf` to give a different path/name of the config file
- `--json` to overwrite the `json_report` path
- `--md` to overwrite the output of the markdown file

## Examples

You can find example of different managers in the examples directory. You need
to run npm/pnpm install in the `npm` folder to create your node modules which
the script uses to identify modules.

## Supported Managers

- [x] Npm/Pnpm (using node_modules folder). called "npm" in config
- [x] Cargo (using cargo.lock and optionally cargo api). called "cargo" in
      config
- [ ] Deno
- [ ] Comments in files
- [ ] Special files

## Additional plans

- Warning for certain license types
- Simple CLI tool without config
- Implementation in other js build tools
- Output of stats: How many packages. How old they are....

## Why Deno

The Project is written in TypeScript using deno.<br> Deno was my first choice
because it does't create a folder for dependencies, supports TypeScript out of
the box, has a decent standard library and is more stable and has a wider
support than bun. Also deno allows the project to be bundled and "compiled".
