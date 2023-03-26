import { defaultConfig } from "../config/default.ts"

export async function init(path = "opencredit.jsonc") {
    console.log(`Creating ${path}...`)    
    await Deno.writeTextFile(path, JSON.stringify(defaultConfig, undefined, 4))
}
