# Npm/Pnpm example

This folder includes an basic example using node_modules as its base. It's
configured with a custom the custom named file `custom_conf.json`. The config
also only includes npm as manager, to only search for node modules.

## Run

1. run `npm i` or `pnpm i` to create node_modules
2. run `deno run <path to opencredits> run --conf custom_conf.json`
