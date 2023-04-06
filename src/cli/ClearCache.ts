import { Config } from "../config/Config.ts"
import * as Path from "std/path/mod.ts"

export async function clearCache(conf: Config) {
    const cache = conf.cache

    if (cache) {
        try {
            Deno.removeSync(cache, { recursive: true })
        } catch (error) {
            console.error("Unable to clear cache")
        }
    }
}
