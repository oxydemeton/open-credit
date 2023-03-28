import { walk } from "https://deno.land/std@0.181.0/fs/walk.ts"
import { Module } from "./Module.ts"
import { Config } from "../config/Config.ts"
import * as Path from "https://deno.land/std@0.181.0/path/mod.ts"
import { NpmCache } from "../cache/NpmCache.ts"
import * as Crypto from "https://deno.land/std@0.181.0/crypto/crypto.ts"
import { toHashString } from "https://deno.land/std@0.181.0/crypto/to_hash_string.ts"

export async function crawlNodeModules(
    root: string,
    config: Config,
): Promise<Module[]> {
    if (config.cache) {
        Deno.mkdirSync(Path.join(config.cache, "npm"), { recursive: true })
    }
    const modules: Set<Module> = new Set()
    for await (const entry of walk(root)) {
        if (entry.name !== "package.json" || !entry.isFile) continue

        const json = JSON.parse(await Deno.readTextFile(entry.path)) as any
        const mod: Module = { manager: "npm" }
        const hash_now = toHashString(
            await Crypto.crypto.subtle.digest(
                "SHA-256",
                new TextEncoder().encode(JSON.stringify(json)),
            ),
            "hex",
        )
        const cache = await readCache(json.name, hash_now, config)
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
        writeCache(json.name, hash_now, mod, config)
        modules.add(mod)
    }
    return [...modules]
}

async function readCache(
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

async function writeCache(
    name: string,
    hash_now: string,
    mod: Module,
    config: Config,
): Promise<void> {
    if (!config.cache) return
    const cache: NpmCache = { package_json_md5: hash_now, mod: mod }
    await Deno.writeTextFile(
        Path.join(Path.join(config.cache, "npm"), `${name}.json`),
        JSON.stringify(cache),
        { create: true },
    )
}
