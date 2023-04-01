import { Config } from "../config/Config.ts"
import * as Yaml from "https://deno.land/std@0.182.0/yaml/mod.ts"
import * as Path from "https://deno.land/std@0.181.0/path/mod.ts"
import { Module } from "./Module.ts"
import { NpmCache } from "../cache/NpmCache.ts"
import { parsePackageJson } from "./Npm.ts"

export async function crawlPnpmLock(
    path: string,
    config: Config,
): Promise<Set<Module>> {
    const package_lock = await Deno.readTextFile(path)
    const yml = Yaml.parse(package_lock) as any
    if (!yml.packages || yml.packages.length === 0) return new Set()

    const modules: Set<Module> = new Set()

    for (let i = 0; i < Object.keys(yml.packages).length; i++) {
        const key = Object.keys(yml.packages)[i]
        const name_regex = /[\/]?([^\/]+)\/[0-9]+.[0-9]+.[0-9]+/gi
        const name = name_regex.exec(key)?.at(1)
        const version_regex = /[\/]?[^\/]+\/([0-9]+.[0-9]+.[0-9]+)/gi
        const version = version_regex.exec(key)?.at(1)
        
        if (!name || !version) continue
        const integrity = yml.packages[key].resolution?.integrity
        if(!integrity) continue
        const cache = await readCache(
            key,
            integrity,
            config,
        )
        if (cache !== undefined) {
            modules.add(cache)
            continue
        } else {
            const lock_value = yml.packages[key]
            const pack_path = Path.join(Path.dirname(path), "node_modules", ".pnpm", `${name}@${version}`, "node_modules",  name)
            try {
                const pack_json = JSON.parse(
                    await Deno.readTextFile(
                        Path.join(pack_path, "package.json"),
                    ),
                )
                const mod = parsePackageJson(pack_json)
                modules.add(mod)

                if (lock_value.integrity) {
                    writeCache(key, lock_value.integrity, mod, config)
                }
            } catch (error) {
                console.error(
                    "Error while parsing package.json: Package may not installed: " +
                        Path.join(pack_path, "package.json"),
                )
            }
        }
    }

    return modules
}

async function readCache(
    path: string,
    integrity: string,
    config: Config,
): Promise<Module | undefined> {
    if (!config.cache) return undefined
    const cachePath = Path.join(config.cache, "pnpm", path)
    const cacheModPath = Path.join(cachePath, "mod.json")
    try {
        const mod_json = await Deno.readTextFile(cacheModPath)

        const cache = JSON.parse(mod_json) as NpmCache
        if (cache.integrity !== integrity) {
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
    integrity: string,
    mod: Module,
    config: Config,
) {
    if (!config.cache) return
    const cache: NpmCache = { integrity: integrity, mod: mod }
    const cachePath = Path.join(config.cache, "pnpm", path)
    const cacheModPath = Path.join(cachePath, "mod.json")
    await Deno.mkdir(cachePath, { recursive: true })
    await Deno.writeTextFile(cacheModPath, JSON.stringify(cache), {
        create: true,
    })
}
