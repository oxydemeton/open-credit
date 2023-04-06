import { filterDuplicates } from "../Managers/Filter.ts"
import { Module } from "../Managers/Module.ts"
import { splitByManager } from "./Split.ts"

export function generate(modules: Set<Module>): string {
    let md = "# Mentions\n"
    md += "## Modules\n"

    const writeLine = (txt: string) => {
        md += txt + "\n"
    }
    const split_modules = splitByManager(modules)
    split_modules.cargo = filterDuplicates(split_modules.cargo)
    split_modules.npm = filterDuplicates(split_modules.npm)
    split_modules.deno = filterDuplicates(split_modules.deno)
    split_modules.credit_yaml = filterDuplicates(split_modules.credit_yaml)

    if (split_modules.credit_yaml.length > 0) writeLine("### Mentions is credit yaml files")
    split_modules.credit_yaml.forEach((mod) => {
        writeLine("- " + mod.name)
        if (mod.author){
            if (Array.isArray(mod.author)) writeLine("    - Author: " + mod.author.join(", "))
            else writeLine("    - Author: " + mod.author)
        }
        if (mod.version) writeLine("    - Version: " + mod.version)
        if (mod.license) writeLine("    - License: " + mod.license)
        if (mod.repo) writeLine("    - Repository: " + mod.repo)
        if (mod.description) writeLine("    - Description: " + mod.description)
        if (mod.documentation) {
            writeLine("    - Documentation: " + mod.documentation)
        }
        if (mod.homepage) writeLine("    - Homepage: " + mod.homepage)
    })

    if (split_modules.cargo.length > 0) writeLine("### Cargo Modules")
    split_modules.cargo.forEach((mod) => {
        writeLine("- " + mod.name)
        if (mod.author){
            if (Array.isArray(mod.author)) writeLine("    - Author: " + mod.author.join(", "))
            else writeLine("    - Author: " + mod.author)
        }
        if (mod.version) writeLine("    - Version: " + mod.version)
        if (mod.license) writeLine("    - License: " + mod.license)
        if (mod.repo) writeLine("    - Repository: " + mod.repo)
        if (mod.description) writeLine("    - Description: " + mod.description)
        if (mod.documentation) {
            writeLine("    - Documentation: " + mod.documentation)
        }
        if (mod.homepage) writeLine("    - Homepage: " + mod.homepage)
    })
    if (split_modules.npm.length > 0) writeLine("### NPM Modules")
    split_modules.npm.forEach((mod) => {
        writeLine("- " + mod.name)
        if (mod.author){
            if (Array.isArray(mod.author)) writeLine("    - Author: " + mod.author.join(", "))
            else writeLine("    - Author: " + mod.author)
        }
        if (mod.version) writeLine("    - Version: " + mod.version)
        if (mod.license) writeLine("    - License: " + mod.license)
        if (mod.repo) writeLine("    - Repository: " + mod.repo)
        if (mod.description) writeLine("    - Description: " + mod.description)
        if (mod.documentation) {
            writeLine("    - Documentation: " + mod.documentation)
        }
        if (mod.homepage) writeLine("    - Homepage: " + mod.homepage)
    })
    if (split_modules.deno.length > 0) writeLine("### Deno Modules")
    split_modules.deno.forEach((mod) => {
        writeLine("- " + mod.name)
        if (mod.author){
            if (Array.isArray(mod.author)) writeLine("    - Author: " + mod.author.join(", "))
            else writeLine("    - Author: " + mod.author)
        }
        if (mod.version) writeLine("    - Version: " + mod.version)
        if (mod.license) writeLine("    - License: " + mod.license)
        if (mod.repo) writeLine("    - Repository: " + mod.repo)
        if (mod.description) writeLine("    - Description: " + mod.description)
        if (mod.documentation) {
            writeLine("    - Documentation: " + mod.documentation)
        }
    })
    return md
}
