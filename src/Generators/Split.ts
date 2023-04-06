import { assert } from "std/testing/asserts.ts"
import { Module } from "../Managers/Module.ts"

export function splitByManager(
    modules: Set<Module>,
): { npm: Module[]; cargo: Module[]; deno: Module[], credit_yaml: Module[] } {
    const cargoModules: Module[] = []
    const npmModules: Module[] = []
    const denoModules: Module[] = []
    const credit_yamlModules: Module[] = []

    modules.forEach((mod) => {
        if (mod.manager === "cargo") {
            cargoModules.push(mod)
        } else if (mod.manager === "npm") {
            npmModules.push(mod)
        } else if (mod.manager === "deno") {
            denoModules.push(mod)
        } else if (mod.manager === "credit.yaml") { 
            credit_yamlModules.push(mod)
        }
        else {
            assert(false, "Unknown module manager: " + mod.manager)
        }
    })
    return {
        cargo: cargoModules,
        npm: npmModules,
        deno: denoModules,
        credit_yaml: credit_yamlModules,
    }
}
