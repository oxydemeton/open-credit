import { Config } from "../config/Config.ts"
import * as Path from "std/path/mod.ts"

export async function clearCache(conf: Config) {
    const cache = conf.cache

    if (cache) {
        for (const i in conf.managers) {
            const managerCache = Path.join(cache, conf.managers[i])

            try {
                console.log(managerCache)

                await Deno.remove(managerCache, { recursive: true })
                console.log("Cleared cache for " + conf.managers[i])
            } catch (e) {
                console.log("Could not clear cache for " + conf.managers[i])
            }
        }
    }
}
