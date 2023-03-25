import { Module } from "./Module.ts"
import * as Toml from "https://deno.land/std@0.180.0/encoding/toml.ts"

export async function crawlCargoLock(
    path: string,
    requestCargoApi = false,
): Promise<Module[]> {
    const modules: Module[] = []

    const cargoLockRaw = await Deno.readTextFile(path)
    const cargoLock = Toml.parse(cargoLockRaw)
    if (typeof cargoLock.package !== "object" && cargoLock.package) return []
    const pack = cargoLock.package as Array<object>
    for (let i = 0; i < pack.length; i++) {
        if (!requestCargoApi) {
            const p = pack[i] as any
            const mod: Module = {}
            if (p.name) mod.name = p.name.toString()
            if (p.version) mod.version = p.version.toString()
            modules.push(mod)
        } else {
            const mod_base = pack[i] as Module
            if (!mod_base.name) continue
            const response = await fetch(
                "https://crates.io/api/v1/crates/" + mod_base.name,
            )
            if (!response.ok) {
                modules.push(pack[i] as Module)
                continue
            }
            const json = await response.json()
            const crate = json.crate
            if (!crate) {
                modules.push(pack[i] as Module)
                continue
            }
            const mod: Module = {}
            if (crate.name) mod.name = crate.name.toString()
            if (crate.description) {
                mod.description = crate.description.toString()
            }
            if (crate.documentation) {
                mod.documentation = crate.documentation.toString()
            }
            if (crate.homepage) mod.homepage = crate.homepage.toString()
            if (crate.license) mod.license = crate.license.toString()
            if (crate.authors) mod.author = crate.authors.toString()
            if (crate.repository) mod.repo = crate.repository.toString()
            modules.push(mod)
        }
    }

    return modules
}
