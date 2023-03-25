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
        return [
            "run",
            {
                overwrite_json: args.json,
                overwrite_md: args.md,
                overwrite_config: args.conf,
            },
        ]
    }
    return null
}
export interface Args {
    overwrite_md?: string
    overwrite_json?: string
    overwrite_config?: string
}
export type Command = "run" | "init"
