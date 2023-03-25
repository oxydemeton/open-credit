# Open Credit

An small open project to search for packages you use and mention them in one
file.

## How to use

1. Create a `opencredit.jsonc`
2. Define your settings if needed
3. Run the script in your projects root. Allow Read and if api calls are enabled
   also networking when running `deno` with the `index.ts`

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
