import { readConfig } from "./config/ReadConfig.ts"
import { generate as mdGenerate } from "./Generators/Md.ts"
import { collectAll } from "./cli/Collect.ts"
import { parse as parseArgs } from "./cli/Args.ts"
import { init as initConfigFile } from "./cli/Init.ts"
import { generateJson } from "./Generators/Json.ts"
import { generateStats, statsToString } from "./cli/Stats.ts"

const args = parseArgs()
if (args === null) Deno.exit(0)
if (args[0] === "init") {
    const path = args[1]?.overwrite_config
        ? args[1].overwrite_config
        : "opencredit.jsonc"
    initConfigFile(path)
    console.log("Created config file: " + path)
    Deno.exit(0)
}
const config_path = args[1]?.overwrite_config
    ? args[1]?.overwrite_config
    : "opencredit.jsonc"
const config = readConfig(config_path)!
if (args[1]?.overwrite_json) config.json_report = args[1]?.overwrite_json
if (args[1]?.overwrite_md) config.output = args[1]?.overwrite_md

//Collect Modules
const modules = await collectAll(config)

if (args[0] === "run") {
    //Generate Markdown
    const md = mdGenerate(modules)
    Deno.writeTextFileSync(config.output, md)
    console.log("Markdown written into: " + config.output)

    //Generate JSON
    if (config.json_report) {
        const json = generateJson(modules, true)
        Deno.writeTextFileSync(config.json_report, json)
    }
} else if (args[0] === "stats") {
    console.log("Stats for your project:")
    console.log(statsToString(generateStats(modules)))
}
