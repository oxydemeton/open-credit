import { Config } from "../config/Config.ts"
import { parseConfig } from "./parse.ts"

export function readConfig(path = "./opencredit.jsonc"): Config | void {
    try {
        const config = parseConfig(Deno.readTextFileSync(path))
        return config
    } catch (err) {
        throw err
    }
}
