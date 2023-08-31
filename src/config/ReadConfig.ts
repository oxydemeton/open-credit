import { Config } from "../config/Config.ts"
import { parseConfig } from "./parse.ts"
import { parse, join } from "std/path/mod.ts";

export function readConfig(path = "./opencredit.jsonc"): Config | void {
    try {
        const absolutePath = join(Deno.cwd(),path)
        const config = parseConfig(Deno.readTextFileSync(path), parse(absolutePath).dir)
        return config
    } catch (err) {
        throw err
    }
}
