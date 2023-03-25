import { Module } from "./Module.ts"

export function filterDuplicates(modules: Module[]): Module[] {
    const uniqueModules: Module[] = []
    for (const module of modules) {
        if (!uniqueModules.find((m) => m.name === module.name)) {
            uniqueModules.push(module)
        }
    }
    return uniqueModules
}
