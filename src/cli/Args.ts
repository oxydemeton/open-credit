import * as Flags from "https://deno.land/std@0.181.0/flags/mod.ts"
import { version } from "./Global.ts"

export function parse(): null | [Command, Args | null] {
    const args = Flags.parse(Deno.args, {
        boolean: ["v", "h"],
        string: ["md", "json", "conf"],
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
            console.log("User --config to specify another config name")

            return null
        }
        return ["init", { overwrite_config: args.conf }]
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
            return null
        }
        return [
            "run",
            {
                overwrite_json: args.json,
                overwrite_md: args.md,
                overwrite_config: args.conf,
            },
        ]
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
    console.log("")
    console.log("  init:")
    console.log("    Creates a default config file.")
    console.log(
        "    User --conf <file_name> to specify the name of the config file. Default: opencredit.jsonc",
    )

    if (!args.h) Deno.exit(1)
    return null
}
export interface Args {
    overwrite_md?: string
    overwrite_json?: string
    overwrite_config?: string
}
export type Command = "run" | "init"
