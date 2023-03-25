import * as FS from "https://deno.land/std@0.181.0/fs/mod.ts"
import { Module } from "./Module.ts"

export async function crawlNodeModules(root: string): Promise<Module[]> {
    const modules: Module[] = []
    for await (const entry of FS.walk(root)) {
        if (entry.name !== "package.json" || !entry.isFile) continue

        const json = JSON.parse(await Deno.readTextFile(entry.path)) as any
        const mod: Module = { manager: "npm" }

        if (json.author) mod.author = json.author.toString()
        if (json.name) mod.name = json.name.toString()
        if (json.version) mod.version = json.version.toString()
        if (json.license) mod.license = json.license.toString()
        if (json.description) mod.description = json.description.toString()
        if (json.homepage) mod.homepage = json.homepage.toString()

        modules.push(mod)
    }
    return modules
}
