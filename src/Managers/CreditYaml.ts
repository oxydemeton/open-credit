import { Config } from "../config/Config.ts"
import { Module } from "./Module.ts"
import { parse as parseYaml } from "std/yaml/parse.ts"

export async function parseCreditYaml(
    path: string,
    config: Config,
): Promise<Set<Module>> {
    const modules = new Set<Module>()
    const content = parseYaml(await Deno.readTextFile(path)) as any
    const yamlModules: any[] = []
    if (Array.isArray(content)) {
        yamlModules.push(...content)
    } else if (typeof content === "object") {
        yamlModules.push(content)
    }

    yamlModules.forEach((mod) => {
        const module = new Module()
        module.manager = "credit.yaml"
        if (typeof mod === "string") {
            module.name = mod
            modules.add(module)
            return
        }
        if (mod.name) module.name = mod.name
        if (mod.version) module.version = mod.version
        if (mod.author && Array.isArray(mod.author)) {
            const authors: string[] = []
            mod.author.forEach((author) => {
                if (typeof author === "string") {
                    authors.push(author)
                } else if (typeof author === "object") {
                    if (Object.keys(author).length === 1 && author.name) {
                        authors.push(author.name)
                    } else authors.push(JSON.stringify(author))
                }
            })
            module.author = authors
        } else if (mod.author && typeof mod.author === "string") {
            module.author = JSON.stringify(mod.author)
        }
        if (mod.license) {
            if (typeof mod.license === "string") module.license = mod.license
            else if (typeof mod.license === "object") {
                if (mod.license.type) module.license = mod.license.type
                else if (mod.license.name) module.license = mod.license.name
                else module.license = JSON.stringify(mod.license)
            }
        }
        if (mod.description) module.description = mod.description
        if (mod.repo) module.repo = mod.repo
        if (mod.homepage) module.homepage = mod.homepage
        if (mod.documentation) module.documentation = mod.documentation
        modules.add(module)
    })

    return modules
}
