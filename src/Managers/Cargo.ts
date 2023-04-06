import { CargoCache } from "../cache/CargoCache.ts"
import { Config } from "../config/Config.ts"
import { Module } from "./Module.ts"
import { parse } from "std/encoding/toml.ts"
import * as Path from "std/path/mod.ts"

export async function crawlCargoLock(
    path: string,
    config: Config,
): Promise<Module[]> {
    const modules: Module[] = []

    const cargoLockRaw = await Deno.readTextFile(path)
    const cargoLock = parse(cargoLockRaw)
    if (typeof cargoLock.package !== "object" && cargoLock.package) return []
    const pack = cargoLock.package as Array<object>
    for (let i = 0; i < pack.length; i++) {
        const p = pack[i] as any
        const checksum = p.checksum
        if (checksum) {
            const cache = await readCache(p.name, checksum, config)
            if (cache !== undefined) {
                modules.push(cache)
                continue
            }
        } else continue
        if (!config.allow_api_calls) {
            const mod: Module = { manager: "cargo" }
            if (p.name) mod.name = p.name.toString()
            if (p.version) mod.version = p.version.toString()
            writeCache(p.name, checksum, mod, config)
            modules.push(mod)
        } else {
            const mod = await crateRequest(p as Module)
            if (mod !== null) {
                writeCache(p.name, checksum, mod, config)
                modules.push(mod)
            }
        }
    }

    return modules
}

async function crateRequest(
    mod_base: Module,
): Promise<Module | null> {
    mod_base.manager = "cargo"
    if (!mod_base.name) return null

    const response = await fetch(
        "https://crates.io/api/v1/crates/" + mod_base.name,
    )
    if (!response.ok) {
        const mod = mod_base
        mod_base.manager = "cargo"
        return mod
    }
    const json = await response.json()
    const crate = json.crate
    if (!crate) {
        const mod = mod_base
        mod.manager = "cargo"
        return mod
    }
    const mod: Module = { manager: "cargo" }
    if (crate.name) mod.name = crate.name.toString()
    if (crate.description) {
        mod.description = crate.description.toString()
    }
    if (crate.documentation) {
        mod.documentation = crate.documentation.toString()
    }
    if (crate.homepage) mod.homepage = crate.homepage.toString()
    if (crate.license) mod.license = crate.license.toString()
    if (crate.authors) {
        if (Array.isArray(crate.authors)) mod.author = crate.authors
        else mod.author = crate.authors.toString()
    }
    if (crate.repository) mod.repo = crate.repository.toString()
    return mod
}

async function readCache(
    path: string,
    checksum: string,
    config: Config,
): Promise<Module | undefined> {
    if (!config.cache) return undefined
    const cachePath = Path.join(config.cache, "cargo", path)
    const cacheModPath = Path.join(cachePath, "mod.json")
    try {
        const mod_json = await Deno.readTextFile(cacheModPath)
        const cache = JSON.parse(mod_json) as CargoCache
        if (cache.checksum !== checksum) {
            Deno.remove(cacheModPath)
            return undefined
        }

        return cache.mod
    } catch (error) {
        return undefined
    }
}

async function writeCache(
    path: string,
    checksum: string,
    mod: Module,
    config: Config,
) {
    if (!config.cache) return
    if (!checksum) return
    const cache: CargoCache = { checksum: checksum, mod: mod }
    const cachePath = Path.join(config.cache, "cargo", path)
    const cacheModPath = Path.join(cachePath, "mod.json")
    await Deno.mkdir(cachePath, { recursive: true })
    await Deno.writeTextFile(cacheModPath, JSON.stringify(cache), {
        create: true,
    })
}
