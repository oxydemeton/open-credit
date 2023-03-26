import { defaultConfig } from "../config/default.ts"
import { allManagers, Manager } from "../Managers/Module.ts"

export async function init(
    path = "opencredit.jsonc",
    managers: readonly Manager[] | Manager[] = allManagers,
) {
    console.log(`Creating ${path}...`)
    const config = defaultConfig
    config.managers = [...managers]

    await Deno.writeTextFile(path, JSON.stringify(config, undefined, 4))
}
