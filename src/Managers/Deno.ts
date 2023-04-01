import { Module } from "./Module.ts"
import { Config } from "../config/Config.ts";
import * as Path from "std/path/mod.ts"

export async function crawlDenoImports(
    path: string,
    config: Config,
): Promise<Set<Module>> {
    const modules = new Map<string, Module>()

    const lock_file = await Deno.readTextFile(path)
    const remote = Object.entries(JSON.parse(lock_file).remote)
    
    for (let i = 0; i < remote.length; i++) {
        const [url, _hash] = remote[i]
        const regex = new DenoImportRegex(url)
        if (!regex.name || !regex.version) continue
        if(modules.has(regex.name)) continue
        const cache = await readCache(regex.name, regex.version, config)
        if (cache) {
            modules.set(cache.name!, cache)
            continue
        }else {
            const mod: Module = {
                name: regex.name,
                version: regex.version,
                manager: "deno",
            }
            if (config.allow_api_calls && url.startsWith("https://deno.land")) {                
                const api_url = new URL("https://apiland.deno.dev/v2/metrics/modules/")
                api_url.pathname += regex.name
                const api_response = await fetch(api_url.href)
                
                const api_json = await api_response.json()
                
                mod.description = api_json.info?.description
                if(api_json.info?.upload_options?.type == "github" && api_json.info?.upload_options?.repository ) {
                    const github_url= new URL("https://github.com/")
                    github_url.pathname += `${api_json.info.upload_options.repository}`
                    mod.repo = github_url.href
                }
            }
            if (config.cache) writeCache(regex.name, regex.version, mod, config)
            modules.set(mod.name!, mod)
        }
    }

    return new Set([...modules.values()])
}

class DenoImportRegex {
    static regex =
        /http[s]*:\/\/[^\n]*\/([^\s]*)@([0-9]+.[0-9]+.[0-9]+)[^\s]*/gs
    url?: string
    name?: string
    version?: string
    constructor(txt: string) {
        const match = DenoImportRegex.regex.exec(txt)
        this.url = match?.at(0)
        this.name = match?.at(1)
        this.version = match?.at(2)
    }
}

async function readCache(
    path: string,
    version: string,
    config: Config,
    ): Promise<Module | undefined> {
    if (!config.cache) return undefined
    const cachePath = Path.join(config.cache, "deno", path)
    const cacheModPath = Path.join(cachePath, "mod.json")
    try {
        const mod_json = await Deno.readTextFile(cacheModPath)
        const cache = JSON.parse(mod_json) as DenoCache
        //TODO: check version
        return cache.mod
    } catch (error) {
        return undefined
    }
}

async function writeCache(
    path: string,
    version: string,
    mod: Module,
    config: Config,
) {
    if (!config.cache) return
    const cache: DenoCache = { version, mod }
    const cachePath = Path.join(config.cache, "deno", path)
    const cacheModPath = Path.join(cachePath, "mod.json")
    await Deno.mkdir(cachePath, { recursive: true })
    await Deno.writeTextFile(cacheModPath, JSON.stringify(cache), {
        create: true,
    })
}


interface DenoCache {
    version: string
    mod: Module
}