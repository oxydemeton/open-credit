import { Config } from "../config/Config.ts"
import * as Yaml from "std/yaml/mod.ts"
import * as Path from "std/path/mod.ts"
import { Module } from "./Module.ts"
import { parsePackageJson, readCache, writeCache } from "./Npm.ts"

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
        if (!integrity) continue
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
            const pack_path = Path.join(
                Path.dirname(path),
                "node_modules",
                ".pnpm",
                `${name}@${version}`,
                "node_modules",
                name,
            )
            try {
                const pack_json = JSON.parse(
                    await Deno.readTextFile(
                        Path.join(pack_path, "package.json"),
                    ),
                )
                const mod = parsePackageJson(pack_json)
                modules.add(mod)
                writeCache(key, integrity, mod, config)
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
