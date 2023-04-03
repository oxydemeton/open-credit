import * as Flags from "https://deno.land/std@0.181.0/flags/mod.ts"
import { allManagers, Manager } from "../Managers/Module.ts"
import { runtime } from "./Global.ts"
import { Command, Commands, commands } from "./Commands.ts"

export function parse(): null | [Commands, Args | null] {
    const args = Flags.parse(Deno.args, {
        boolean: ["v", "h"],
        string: ["md", "json", "conf", "managers", "cache"],
    })
    if (args.v) { //Version
        console.log("Open-credit " + runtime.versions.opencredit)
        console.log("Deno " + runtime.versions.deno)
        console.log("V8 " + runtime.versions.v8)
        console.log("Typescript " + runtime.versions.typescript)
        console.log("Build:")
        console.log("  OS: " + runtime.build.os)
        console.log("  Arch: " + runtime.build.arch)
        console.log("  Target: " + runtime.build.target)
        return null
    }
    if (args._[0] == "init") {
        if (args.h) {
            console.log("Opencredit: " + runtime.versions.opencredit)
            console.log("Init:")
            console.log(
                "Creates a opencredit.jsonc config with default values.",
            )
            console.log("Parameter:")
            console.log("  -h print help")
            console.log(
                "  --conf <file_name> | Overwrite the name of the config file. Default: opencredit.jsonc",
            )
            console.log(
                "  --managers <manager1,manager2,...> | Specify which managers should be used. Default: cargo,npm,deno",
            )
            return null
        }
        const managers = args.managers?.split(",").filter((m) =>
            allManagers.includes(m.toLocaleLowerCase() as Manager)
        ).map((m) => m.toLowerCase()) as Manager[]
        return ["init", {
            overwrite_config: args.conf,
            overwrite_managers: managers,
        }]
    }
    if (args._[0] == "run") {
        if (args.h) {
            console.log("Opencredit: " + runtime.versions.opencredit)
            commandHelp(commands.get("run")!, "clear-cache")
            return null
        }
        const managers = args.managers?.split(",").filter((m) =>
            allManagers.includes(m.toLocaleLowerCase() as Manager)
        ).map((m) => m.toLowerCase()) as Manager[]
        return [
            "run",
            {
                overwrite_json: args.json,
                overwrite_md: args.md,
                overwrite_config: args.conf,
                overwrite_managers: managers,
                cache: args.cache === "false" ? false : args.cache,
            },
        ]
    }

    if (args._[0] == "stats") {
        if (args.h) {
            console.log("Opencredit: " + runtime.versions.opencredit)
            commandHelp(commands.get("stats")!, "clear-cache")
            return null
        }
        const managers = args.managers?.split(",").filter((m) =>
            allManagers.includes(m.toLocaleLowerCase() as Manager)
        ).map((m) => m.toLowerCase()) as Manager[]
        return ["stats", {
            overwrite_config: args.conf,
            overwrite_managers: managers,
            cache: args.cache === "false" ? false : args.cache,
        }]
    }
    if (args._[0] == "clear-cache") {
        if (args.h) {
            console.log("Opencredit: " + runtime.versions.opencredit)
            commandHelp(commands.get("clear-cache")!, "clear-cache")
            return null
        }
        const managers = args.managers?.split(",").filter((m) =>
            allManagers.includes(m.toLocaleLowerCase() as Manager)
        ).map((m) => m.toLowerCase()) as Manager[]
        return ["clear-cache", {
            overwrite_managers: managers,
        }]
    }
    //Print general Help
    console.log("Opencredit: " + runtime.versions.opencredit)
    console.log("Commands:")
    commands.forEach((cmd, name) => {
        commandHelp(cmd, name, 2)
    })

    if (!args.h) Deno.exit(1)
    return null
}
export interface Args {
    overwrite_md?: string
    overwrite_json?: string
    overwrite_config?: string
    overwrite_managers?: Manager[]
    cache?: false | string
}

function commandHelp(cmd: Command, name: string, indent = 0) {
    console.log(" ".repeat(indent) + `${name}:`)
    console.log(" ".repeat(indent) + `  ${cmd.description}`)
    console.log(" ".repeat(indent) + `  Parameter:`)
    cmd.parameters.forEach((param) => {
        console.log(" ".repeat(indent) + `    ${param}`)
    })
    console.log("")
}
