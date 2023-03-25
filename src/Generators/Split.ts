import { Module } from "../Managers/Module.ts"

export function splitByManager(
    modules: Module[],
): { npm: Module[]; cargo: Module[] } {
    const cargoModules: Module[] = []
    const npmModules: Module[] = []
    modules.forEach((mod) => {
        if (mod.manager === "cargo") {
            cargoModules.push(mod)
        } else if (mod.manager === "npm") {
            npmModules.push(mod)
        }
    })
    return {
        cargo: cargoModules,
        npm: npmModules,
    }
}
