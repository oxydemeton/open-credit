import { splitByManager } from "../Generators/Split.ts";
import { Module } from "../Managers/Module.ts";

export function generateStats(modules: Module[]): Stats {
    const stats: Stats = {}
    const split = splitByManager(modules)
    stats.npm_modules = split.npm
    stats.cargo_modules = split.cargo

    modules.forEach((mod) => {
        if (mod.author) {
            if (!stats.authors) stats.authors = new Set()
            stats.authors.add(mod.author)
        }
        if (mod.license) {
            if (!stats.licenses) stats.licenses = new Set()
            stats.licenses.add(mod.license.toLocaleLowerCase())
        }
    })

    return stats
}

export type Stats = {
    npm_modules?: Module[]
    cargo_modules?: Module[]
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