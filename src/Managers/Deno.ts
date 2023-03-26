import * as FS from "https://deno.land/std@0.181.0/fs/mod.ts"
import { Module } from "./Module.ts"

export async function crawlDenoImports(
    path: string,
    requestDenoApi = false,
): Promise<Module[]> {
    const modules: Module[] = []

    const lock_file = await Deno.readTextFile(path)
    const remote = Object.entries(JSON.parse(lock_file).remote)
    remote.forEach((entry) => {
        const [url, _hash] = entry
        const regex = new DenoImportRegex(url)
        if (!regex.name || !regex.version) return
        const mod: Module = {
            name: regex.name,
            version: regex.version,
            manager: "deno",
        }

        modules.push(mod)
    })

    return modules
}

class DenoImportRegex {
    static regex =
        /http[s]*:\/\/[^\n]*\/([^\s]*)@([0-9]+.[0-9]+.[0-9]+)[^\s]*/gs
    url?: string
    name?: string
    version?: string
    constructor(txt: string) {
        const match = DenoImportRegex.regex.exec(txt)
        this.url = match?.at(0)
        this.name = match?.at(1)
        this.version = match?.at(2)
    }
}
