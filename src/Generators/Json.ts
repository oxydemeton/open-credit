import { filterDuplicates } from "../Managers/Filter.ts"
import { Module } from "../Managers/Module.ts"
import { splitByManager } from "./Split.ts"

export function generateJson(modules: Module[], pretty = false): string {
    const split = splitByManager(modules)
    split.cargo = filterDuplicates(split.cargo)
    split.npm = filterDuplicates(split.npm)
    const filtered = {
        cargo: split.cargo.length > 0 ? split.cargo : undefined,
        npm: split.npm.length > 0 ? split.npm : undefined,
    }
    return JSON.stringify(filtered, undefined, pretty ? 4 : undefined)
}
