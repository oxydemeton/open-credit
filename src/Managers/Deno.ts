import * as FS from "https://deno.land/std@0.181.0/fs/mod.ts"
import { Module } from "./Module.ts"

export async function crawlDenoImports(
    root: string,
    requestDenoApi = false,
): Promise<Module[]> {
    const modules: Module[] = []

    for await (const entry of FS.walk(root)) {
        if (!entry.isFile) continue
        if (entry.name.endsWith(".ts") || entry.name.endsWith(".js")) {
            const reg_res = new DenoImportRegex(
                await Deno.readTextFile(entry.path),
            )
            if (reg_res.imports.length <= 0) continue
            reg_res.imports.forEach((imp) => {
                const mod = {
                    name: imp.name,
                    version: imp.version,
                    manager: "deno",
                } as Module
                modules.push(mod)
            })
        }
    }
    return modules
}

class DenoImportRegex {
    static regex =
        /import[^\n]*from[ ]*"(http[s]*:\/\/[^\n]*\/([^\s]*)@([0-9]+.[0-9]+.[0-9]+)[^\s]*)/gs
    imports: DenoImportResult[] = []
    constructor(txt: string) {
        let match
        while ((match = DenoImportRegex.regex.exec(txt)) !== null) {
            this.imports.push({
                import_statement: match[0],
                url: match[1],
                name: match[2],
                version: match[3],
            })
        }
    }
}

type DenoImportResult = {
    import_statement: string
    url: string
    name: string
    version: string
}
