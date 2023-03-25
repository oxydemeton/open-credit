import { readConfig } from "./config/ReadConfig.ts"
import { generate as mdGenerate } from "./Markdown/Generator.ts"
import { collectAll } from "./cli/Collect.ts"
import { parse as parseArgs } from "./cli/Args.ts"

if (parseArgs() === null) Deno.exit(0)
const config = readConfig()!

//Process folders
const modules = await collectAll(config)

const md = mdGenerate(modules)
Deno.writeTextFileSync(config.output, md)
console.log("Markdown written into: " + config.output)
