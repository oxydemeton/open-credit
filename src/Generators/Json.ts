import { filterDuplicates } from "../Managers/Filter.ts"
import { Module } from "../Managers/Module.ts"
import { splitByManager } from "./Split.ts"

export function generateJson(modules: Module[], pretty = false): string {
    const split = splitByManager(modules)
    split.cargo = filterDuplicates(split.cargo)
    split.npm = filterDuplicates(split.npm)
    return JSON.stringify(split, undefined, pretty ? 4 : undefined)
}
