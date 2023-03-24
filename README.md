# Open Credit
An small open project to search for packages you use and mention them in one file.

## How to use
1. Create a `opencredit.jsonc`
2. Define your settings if needed
3. Run the script in your projects root. Allow Read and if api calls are enabled also networking when running `deno` with the `index.ts`


## Examples
You can find example of different managers in the examples directory. You need to run npm/pnpm install in the `npm` folder to create your node modules which the script uses to identify modules.

## Supported Managers
- [x] Npm/Pnpm (using node_modules folder)
- [x] Cargo (using cargo.lock and optionally cargo api)
- [ ] Deno
- [ ] Comments in files
- [ ] Special files

## Additional plans
- Warning for certain license types
- Simple CLI tool without config
- Implementation in other js build tools

## Why Deno
The Project is written in TypeScript using deno.<br>
Deno was my first choice because it does't create a folder for dependencies, supports TypeScript out of the box, has a decent standard library and is more stable and has a wider support than bun. Also deno allows the project to be bundled and "compiled".