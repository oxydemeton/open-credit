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
- `exclude`: Which files with path and name to exclude.
- `json_report`: Optional: Path and name of a json file with all information.
- `allow_api_calls`: Rather opencredit is allowed to call apis (cargo api) to
  get further information about packages etc.
- `managers`: Array of managers which will be searched for.
- `cache`: String/path to directory to store cache or false to disable cache.

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
- `clear-cache`: Clears all configured(path, managers) cache from opencredit.

### Args

When running opencredit you can specify:

- `--conf` to give a different path/name of the config file
- `--json` to overwrite the `json_report` path
- `--md` to overwrite the output of the markdown file
- `--managers` to overwrite the managers. You can list multiple managers like:
  npm,deno
- `--cache` to overwrite the cache setting. You can use `false` for disabling
  caching and `<path>` to set a different directory.

## Examples

You can find example of different managers in the examples directory. You need
to run npm install in the `npm` folder to create your node modules which the
script uses to identify modules.

## Supported Managers

- [x] Npm (using package.lock file). called "npm" in config
- [x] Pnpm (using pnpm-lock.yaml). called "pnpm" in config and found modules are
      collected as npm modules in outputs.
- [x] Cargo (using cargo.lock and optionally cargo api). called "cargo" in
      config
- [x] Deno (using deno.lock file and optionally
      [deno api](https://apiland.deno.dev/)). called "deno" in config
- [x] [Special files](#Credit.yaml)
- [ ] Yarn
- [ ] Comments in files

## Credit.yaml

A credit.yaml (fixed name) can contain additional information about a package,
authors or other stuff.<br> It can contain one or multiple packages and only one
can be used per directory.<br> Examples can be found in the
[examples directory](./examples/credit-yaml/).<br> It must provide a `name`
field and may have:

- `version`: Version of the package as a string.
- `description`: Description of the package as a string.
- `author`: Name of an author or an array of authors. Objects for each author
  are also supported but will be outputted as json.
- `license`: License of the package as a string. Objects are also supported but
  will be outputted as json.
- `repo`: Repository of the package as a string.
- `homepage`: Homepage of the package as a string.

## Caching

Caching is done separate for each project.

### Configuration

#### Config file

-`"cache": false` disables caching for the project. -`"cache": "<path>"` gives a
directory where the cache will be located. Default: `./.cache/opencredit`

### Console parameter

The console parameter work the same and will overwrite the config file for the
run.<br>Example disabling cache:

```sh
$ opencredit stats --cache=false
```

### Usecase

For now Caching is implemented for npm and cargo and it uses the provided
checksums to revalidate when needed.<br> Performance difference is minimal when
reading or writing cache!<br> BUT when api calls for cargo are enabled traffic
is minimized and performance is improved.<br>

#### Benchmarks

##### [surrealdb](https://github.com/surrealdb/surrealdb)(475 crates)

Comparison on Windows11 with `stats` command and `api calls enabled`:<br>
Without cache:

```
$ Measure-Command {opencredit.exe stats --cache=false}
```

Output (on my machine):

```
Days              : 0
Hours             : 0
Minutes           : 1
Seconds           : 13
Milliseconds      : 288
Ticks             : 732885113
TotalDays         : 0,000848246658564815
TotalHours        : 0,0203579198055556
TotalMinutes      : 1,22147518833333
TotalSeconds      : 73,2885113
TotalMilliseconds : 73288,5113
```

With enabled cache (first time / creating cache):

```
$ Measure-Command {opencredit.exe stats --cache="./.cache"}
```

Output:

```
Days              : 0
Hours             : 0
Minutes           : 1
Seconds           : 13
Milliseconds      : 519
Ticks             : 735193463
TotalDays         : 0,000850918359953704
TotalHours        : 0,0204220406388889
TotalMinutes      : 1,22532243833333
TotalSeconds      : 73,5193463
TotalMilliseconds : 73519,3463
```

With enabled cache (second time / reading cache):

```
$ Measure-Command {opencredit.exe stats --cache="./.cache"}
```

Output:

```
Days              : 0
Hours             : 0
Minutes           : 0
Seconds           : 12
Milliseconds      : 440
Ticks             : 124403273
TotalDays         : 0,000143985269675926
TotalHours        : 0,00345564647222222
TotalMinutes      : 0,207338788333333
TotalSeconds      : 12,4403273
TotalMilliseconds : 12440,3273
```

##### [fresh website](https://fresh.deno.dev/)(37 Deno Modules)

Comparison on Windows11 with `stats` command and `api calls enabled`:<br>
Without cache:

```
$ Measure-Command {opencredit.exe stats --cache=false}
```

Output (on my machine):

```
Days              : 0
Hours             : 0
Minutes           : 0
Seconds           : 6
Milliseconds      : 597
Ticks             : 65979384
TotalDays         : 7,63650277777778E-05
TotalHours        : 0,00183276066666667
TotalMinutes      : 0,10996564
TotalSeconds      : 6,5979384
TotalMilliseconds : 6597,9384
```

With enabled cache (first time / creating cache):

```
$ Measure-Command {opencredit.exe stats --cache="./.cache"}
```

Output:

```
Days              : 0
Hours             : 0
Minutes           : 0
Seconds           : 6
Milliseconds      : 548
Ticks             : 65481982
TotalDays         : 7,57893310185185E-05
TotalHours        : 0,00181894394444444
TotalMinutes      : 0,109136636666667
TotalSeconds      : 6,5481982
TotalMilliseconds : 6548,1982
```

With enabled cache (second time / reading cache):

```
$ Measure-Command {opencredit.exe stats --cache="./.cache"}
```

Output:

```
Days              : 0
Hours             : 0
Minutes           : 0
Seconds           : 0
Milliseconds      : 83
Ticks             : 837215
TotalDays         : 9,68998842592592E-07
TotalHours        : 2,32559722222222E-05
TotalMinutes      : 0,00139535833333333
TotalSeconds      : 0,0837215
TotalMilliseconds : 83,7215
```

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
