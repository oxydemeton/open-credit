import { assert } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { Module } from "../Managers/Module.ts"

export function splitByManager(
    modules: Module[],
): { npm: Module[]; cargo: Module[], deno: Module[] } {
    const cargoModules: Module[] = []
    const npmModules: Module[] = []
    const denoModules: Module[] = []
    modules.forEach((mod) => {
        if (mod.manager === "cargo") {
            cargoModules.push(mod)
        } else if (mod.manager === "npm") {
            npmModules.push(mod)
        }else if (mod.manager === "deno") {
            denoModules.push(mod)
        }else {
            assert(false, "Unknown module manager: " + mod.manager)
        }
    })
    return {
        cargo: cargoModules,
        npm: npmModules,
        deno: denoModules,
    }
}
