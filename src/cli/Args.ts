import * as Flags from "https://deno.land/std@0.181.0/flags/mod.ts"
import { allManagers, Manager } from "../Managers/Module.ts"
import { version } from "./Global.ts"

export function parse(): null | [Command, Args | null] {
    const args = Flags.parse(Deno.args, {
        boolean: ["v", "h"],
        string: ["md", "json", "conf", "managers", "cache"],
    })
    if (args.v) { //Version
        console.log(version)
        return null
    }
    if (args._.includes("init")) {
        if (args.h) {
            console.log("Open-credit " + version)
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
    if (args._.includes("run")) {
        if (args.h) {
            console.log("Open-credit " + version)
            console.log("Run:")
            console.log(
                "Searches for open source credits and bundles them into an output file.",
            )
            console.log("Parameter:")
            console.log("  -h print help")
            console.log(
                "  --conf <file_name> | Overwrite the name of the config file. Default: opencredit.jsonc",
            )
            console.log(
                "  --md <file_name> | Specify Output file name. Default: CREDITS.md",
            )
            console.log(
                "  --json <file_name> | Specify if an json output should be given. If empty there is no output.",
            )
            console.log(
                "  --managers <manager1,manager2,...> | Specify which managers should be used. Default: as in config file.",
            )
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

    if (args._.includes("stats")) {
        if (args.h) {
            console.log("Open-credit " + version)
            console.log("Stats:")
            console.log(
                "Prints statistics about packages/modules/crates used in the project.",
            )
            console.log("Parameter:")
            console.log("  -h print help")
            console.log(
                "  --conf <file_name> | Overwrite the name of the config file. Default: opencredit.jsonc",
            )
            console.log(
                "  --managers <manager1,manager2,...> | Specify which managers should be used. Default: as in config file.",
            )
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
    //Print general Help
    console.log("Open-credit " + version)
    console.log("Commands:")
    console.log("  run:")
    console.log(
        "    Searches for open source credits and bundles them into an output file.",
    )
    console.log("    Parameter:")
    console.log("      -h print help")
    console.log(
        "      --conf <file_name> | Overwrite the name of the config file. Default: opencredit.jsonc",
    )
    console.log(
        "      --md <file_name> | Specify Output file name. Default: CREDITS.md",
    )
    console.log(
        "      --json <file_name> | Specify if an json output should be given. If empty there is no output.",
    )
    console.log(
        "      --managers <manager1,manager2,...> | Specify which managers should be used. Default: as in config file.",
    )

    console.log("")
    console.log("  init:")
    console.log("    Creates a default config file.")
    console.log(
        "    User --conf <file_name> to specify the name of the config file. Default: opencredit.jsonc",
    )
    console.log(
        "    User --managers <manager1,manager2,...> to specify which managers should be used. Default: cargo,npm,deno",
    )

    console.log("")
    console.log("  stats:")
    console.log(
        "    Prints statistics about packages/modules/crates used in the project.",
    )
    console.log(
        "    User --conf <file_name> to specify the name of the config file. Default: opencredit.jsonc",
    )
    console.log(
        "    User --managers <manager1,manager2,...> to specify which managers should be used. Default: as in config file",
    )

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
export type Command = "run" | "init" | "stats"
