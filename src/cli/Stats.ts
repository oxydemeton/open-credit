import { splitByManager } from "../Generators/Split.ts"
import { allManagers, Manager, Module } from "../Managers/Module.ts"

export function generateStats(modules: Module[], managers: readonly Manager[] | Manager[] = allManagers): Stats {
    const stats: Stats = {}
    const split = splitByManager(modules)
    if(managers.includes("npm")) stats.npm_modules = split.npm
    if(managers.includes("cargo")) stats.cargo_modules = split.cargo
    if(managers.includes("deno")) stats.deno_modules = split.deno
    modules.forEach((mod) => {
        if(!mod.manager || managers.includes(mod.manager)) {
            if (mod.author) {
                if (!stats.authors) stats.authors = new Set()
                stats.authors.add(mod.author)
            }
            if (mod.license) {
                if (!stats.licenses) stats.licenses = new Set()
                stats.licenses.add(mod.license.toLocaleLowerCase())
            }
        }
    })

    return stats
}

export type Stats = {
    npm_modules?: Module[]
    cargo_modules?: Module[],
    deno_modules?: Module[],
    authors?: Set<string>
    licenses?: Set<string>
}

export function statsToString(stats: Stats): string {
    let str = ""
    if (stats.npm_modules) {
        str += `NPM Modules: ${stats.npm_modules.length}\n`
    }
    if (stats.cargo_modules) {
        str += `Cargo Modules: ${stats.cargo_modules.length}\n`
    }
    if(stats.deno_modules){
        str += `Deno Modules: ${stats.deno_modules.length}\n`
    }
    if (stats.authors) {
        str += `Authors: ${stats.authors.size}\n`
    }
    if (stats.licenses) {
        str += "Licenses:\n"
        stats.licenses.forEach((license) => {
            str += `  -${license}\n`
        })
    }
    return str
}
