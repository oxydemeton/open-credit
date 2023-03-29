import { walk } from "https://deno.land/std@0.181.0/fs/walk.ts"
import { Module } from "./Module.ts"
import { Config } from "../config/Config.ts"
import * as Path from "https://deno.land/std@0.181.0/path/mod.ts"
import { NpmCache } from "../cache/NpmCache.ts"
import * as Crypto from "https://deno.land/std@0.181.0/crypto/crypto.ts"
import { toHashString } from "https://deno.land/std@0.181.0/crypto/to_hash_string.ts"

export async function crawlNodeModulesOld(
    root: string,
    config: Config,
): Promise<Module[]> {
    if (config.cache) {
        Deno.mkdirSync(Path.join(config.cache, "npm"), { recursive: true })
    }
    const modules: Set<Module> = new Set()
    for await (const entry of walk(root)) {
        if (entry.name !== "package.json" || !entry.isFile) continue

        let json = {} as any
        try {
            json = JSON.parse(await Deno.readTextFile(entry.path)) as any
        }catch(error) {
            console.log("Error while parsing package.json: " + entry.path)
            console.error(error);
            
            continue
        }
        
        const mod: Module = { manager: "npm" }
        const hash_now = toHashString(
            await Crypto.crypto.subtle.digest(
                "MD5",
                new TextEncoder().encode(JSON.stringify(json)),
            ),
            "base64",
        )
        const cache = await readCacheOld(json.name, hash_now, config)
        if (cache) {
            modules.add(cache)
            continue
        }
        if (json.author) mod.author = json.author.toString()
        if (json.name) mod.name = json.name.toString()
        if (json.version) mod.version = json.version.toString()
        if (json.license) mod.license = json.license.toString()
        if (json.description) mod.description = json.description.toString()
        if (json.homepage) mod.homepage = json.homepage.toString()
        
        if(config.cache) writeCacheOld(json.name, hash_now, mod, config)
        modules.add(mod)
    }
    return [...modules]
}

async function readCacheOld(
    name: string,
    hash_now: string,
    config: Config,
): Promise<Module | undefined> {
    if (!config.cache) return undefined
    try {
        const cache = JSON.parse(
            await Deno.readTextFile(
                Path.join(Path.join(config.cache, "npm"), `${name}.json`),
            ),
        ) as NpmCache
        if (cache.package_json_md5 !== hash_now) {
            Deno.remove(
                Path.join(Path.join(config.cache, "npm"), `${name}.json`),
            )
            return undefined
        }
        
        return cache.mod
    } catch (error) {
        return undefined
    }
}

async function writeCacheOld(
    name: string,
    hash_now: string,
    mod: Module,
    config: Config,
): Promise<void> {
    if (!config.cache) return
    const cache: NpmCache = { package_json_md5: hash_now, mod: mod }
    const path = Path.join(Path.join(config.cache, "npm"), `${name}.json`)
    await Deno.mkdir(Path.dirname(path), { recursive: true })
    await Deno.writeTextFile(
        path,
        JSON.stringify(cache),
        { create: true },
    )
}

export async function crawlNpmLock(
    path: string,
    config: Config,
): Promise<Module[]> {
    //Read package-lock.json
    const package_lock = await Deno.readTextFile(path)
    const json = JSON.parse(package_lock) as any
    if (!json.packages || json.packages.length === 0) return []

    const modules: Set<Module> = new Set()
    Object.entries(json.packages).forEach(([key, lock_value]) => {
        const pack_path = Path.join(Path.dirname(path), key)
        const pack_json = JSON.parse(Deno.readTextFileSync(Path.join(pack_path, "package.json")))
        modules.add(parsePackageJson(pack_json))        
    })
    console.log(modules);

    return [...modules]
}

function parsePackageJson(json: any): Module {
    const mod: Module = { manager: "npm" }
    if (json.author) mod.author = json.author.toString()
    if (json.name) mod.name = json.name.toString()
    if (json.version) mod.version = json.version.toString()
    if (json.license) mod.license = json.license.toString()
    if (json.description) mod.description = json.description.toString()
    if (json.homepage) mod.homepage = json.homepage.toString()
    return mod
}