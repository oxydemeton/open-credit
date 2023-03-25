import { Module } from "../Managers/Module.ts"

export function generate(modules: Module[]): string {
    let md = "# Mentions\n"
    md += "## Modules\n"

    const writeLine = (txt: string) => {
        md += txt + "\n"
    }

    modules.forEach((mod) => {
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
    return md
}
