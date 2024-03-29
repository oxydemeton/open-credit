import { Config } from "../config/Config.ts"
import { crawlCargoLock } from "../Managers/Cargo.ts"
import { Module } from "../Managers/Module.ts"
import { crawlNpmLock } from "../Managers/Npm.ts"
import { walk } from "std/fs/walk.ts"
import { crawlDenoImports } from "../Managers/Deno.ts"
import { crawlPnpmLock } from "../Managers/Pnpm.ts"
import { parseCreditYaml } from "../Managers/CreditYaml.ts"
import { parse as parsePath, join as joinPath } from "std/path/mod.ts";

export async function collectAll(config: Config): Promise<Set<Module>> {
    let modules: Set<Module> = new Set()
    for await (const entry of walk(".")) {
        //Exclude directories
        const absoluteDir = joinPath(Deno.cwd(), entry.path)
        let skip = false
        for (const exclude of config.exclude) {
            if (absoluteDir.startsWith(exclude)){
                skip = true                
                break
            }
        }
        if (skip) continue

        //Check for lock files
        switch (entry.name) {
            case "package-lock.json":
                if (config.managers && !config.managers.includes("npm")) break
                if (entry.isFile) {
                    modules = new Set([
                        ...modules,
                        ...await crawlNpmLock(entry.path, config),
                    ])
                }
                break
            case "pnpm-lock.yaml":
                if (config.managers && !config.managers.includes("pnpm")) break
                if (entry.isFile) {
                    modules = new Set([
                        ...modules,
                        ...await crawlPnpmLock(entry.path, config),
                    ])
                }
                break
            case "Cargo.lock":
                if (config.managers && !config.managers.includes("cargo")) break
                if (entry.isFile) {
                    modules = new Set([
                        ...modules,
                        ...await crawlCargoLock(entry.path, config),
                    ])
                }
                break
            case "deno.lock":
                if (config.managers && !config.managers.includes("deno")) break
                if (entry.isFile) {
                    modules = new Set([
                        ...modules,
                        ...await crawlDenoImports(
                            entry.path,
                            config,
                        ),
                    ])
                }
                break
            case "credit.yaml":
                if (
                    config.managers && !config.managers.includes("credit.yaml")
                ) break
                if (entry.isFile) {
                    modules = new Set([
                        ...modules,
                        ...await parseCreditYaml(entry.path, config),
                    ])
                }
        }
    }
    return modules
}
