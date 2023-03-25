import { filterDuplicates } from "../Managers/Filter.ts"
import { Module } from "../Managers/Module.ts"

export function generate(modules: Module[]): string {
    let md = "# Mentions\n"
    md += "## Modules\n"

    const writeLine = (txt: string) => {
        md += txt + "\n"
    }
    const split_modules = separateModules(modules)
    split_modules.cargo = filterDuplicates(split_modules.cargo)
    split_modules.npm = filterDuplicates(split_modules.npm)

    if(split_modules.npm.length > 0) writeLine("### Cargo Modules")
    split_modules.cargo.forEach((mod) => {
        writeLine("- " + mod.name)
        if (mod.author) writeLine("    - Author: " + mod.author)
        if (mod.version) writeLine("    - Version: " + mod.version)
        if (mod.license) writeLine("    - License: " + mod.license)
        if (mod.repo) writeLine("    - Repository: " + mod.repo)
        if (mod.description) writeLine("    - Description: " + mod.description)
        if (mod.documentation) {
            writeLine("    - Documentation: " + mod.documentation)
        }
        if (mod.homepage) writeLine("    - Homepage: " + mod.homepage)
    })
    if(split_modules.npm.length > 0) writeLine("### NPM Modules")
    split_modules.npm.forEach((mod) => {
        writeLine("- " + mod.name)
        if (mod.author) writeLine("    - Author: " + mod.author)
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

function separateModules(
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
