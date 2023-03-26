import { Config } from "../config/Config.ts"
import { crawlCargoLock } from "../Managers/Cargo.ts"
import { Module } from "../Managers/Module.ts"
import { crawlNodeModules } from "../Managers/Npm.ts"
import * as FS from "https://deno.land/std@0.181.0/fs/mod.ts"
import { crawlDenoImports } from "../Managers/Deno.ts"

export async function collectAll(config: Config): Promise<Module[]> {
    const modules: Module[] = []
    for await (const entry of FS.walk(".")) {
        switch (entry.name) {
            case "node_modules":
                if (config.managers && !config.managers.includes("npm")) break
                if (!config.exclude.includes(entry.path) && entry.isDirectory) {
                    Array.prototype.push.apply(
                        modules,
                        await crawlNodeModules(entry.path),
                    )
                }
                break
            case "Cargo.lock":
                if (config.managers && !config.managers.includes("cargo")) break
                if (!config.exclude.includes(entry.path) && entry.isFile) {
                    Array.prototype.push.apply(
                        modules,
                        await crawlCargoLock(entry.path),
                    )
                }
                break
        }
    }
    if (config.managers?.includes("deno")) {
        Array.prototype.push.apply(
            modules,
            await crawlDenoImports(".", config.allow_api_calls),
        )
    }
    return modules
}
