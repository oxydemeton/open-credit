import { Config } from "../config/Config.ts"
import { crawlCargoLock } from "../Managers/Cargo.ts"
import { Module } from "../Managers/Module.ts"
import { crawlNpmLock } from "../Managers/Npm.ts"
import { walk } from "https://deno.land/std@0.181.0/fs/walk.ts"
import { crawlDenoImports } from "../Managers/Deno.ts"
import { crawlPnpmLock } from "../Managers/Pnpm.ts"

export async function collectAll(config: Config): Promise<Set<Module>> {
    let modules: Set<Module> = new Set()
    for await (const entry of walk(".")) {
        switch (entry.name) {
            case "package-lock.json":
                if (config.managers && !config.managers.includes("npm")) break
                if (!config.exclude.includes(entry.path) && entry.isFile) {
                    modules = new Set([
                        ...modules,
                        ...await crawlNpmLock(entry.path, config),
                    ])
                }
                break
            case "pnpm-lock.yaml":
                if (config.managers && !config.managers.includes("pnpm")) break
                if (!config.exclude.includes(entry.path) && entry.isFile) {
                    modules = new Set([
                        ...modules,
                        ...await crawlPnpmLock(entry.path, config),
                    ])
                }
                break
            case "Cargo.lock":
                if (config.managers && !config.managers.includes("cargo")) break
                if (!config.exclude.includes(entry.path) && entry.isFile) {
                    modules = new Set([
                        ...modules,
                        ...await crawlCargoLock(entry.path, config),
                    ])
                }
                break
            case "deno.lock":
                if (config.managers && !config.managers.includes("deno")) break
                if (!config.exclude.includes(entry.path) && entry.isFile) {
                    modules = new Set([
                        ...modules,
                        ...await crawlDenoImports(
                            entry.path,
                            config.allow_api_calls,
                        ),
                    ])
                }
                break
        }
    }
    return modules
}
