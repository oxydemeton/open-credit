import { parse } from "std/jsonc/parse.ts"
import { Config } from "./Config.ts"
import { defaultConfig } from "./default.ts"
import { isArray } from "std/yaml/_utils.ts"
import { join as joinPaths} from "std/path/mod.ts";

export function parseConfig(txt: string, basePath: string|undefined = undefined): Config {
    const config = defaultConfig
    const json = parse(txt) as any
    if (typeof json.output === "string") {
        config.output = json.output
    } else if (json.output !== undefined) {
        console.error(
            'Config Error: "output" is of type ' + typeof json.output +
                " but type string is expected.",
        )
    }
    if (isArray(json.exclude)) {
        config.exclude = (json.exclude as Array<any>).map((e) => {
            if (basePath === undefined) return e.toString()            
            return joinPaths(basePath, e.toString())
        })

    } else if (json.exclude !== undefined) {
        console.error(
            'Config Error: "exclude" is of type ' + typeof json.exclude +
                " but a array is expected.",
        )
    }
    if (typeof json.json_report === "string") {
        config.json_report = json.json_report
    } else if (json.json_report !== undefined) {
        console.error(
            'Config Error: "json_report" is of type ' +
                typeof json.json_report + " but type string is expected.",
        )
    }
    if (typeof json.allow_api_calls === "boolean") {
        config.allow_api_calls = json.allow_api_calls
    } else if (json.allow_api_calls !== undefined) {
        console.error(
            'Config Error: "allow_api_calls" is of type ' +
                typeof json.allow_api_calls + " but type boolean is expected.",
        )
    }
    if (typeof json.cache === "string") {
        config.cache = json.cache
    } else if (json.cache === false) {
        config.cache = false
    } else if (json.cache !== undefined && json.cache !== true) {
        console.error(
            'Config Error: "cache" is of type ' + typeof json.cache +
                " but type string or bool is expected.",
        )
    }
    if (json.managers) {
        config.managers = json.managers
        if (config.managers && config.managers.length) {
            for (let i = 0; i < config.managers.length; i++) {
                config.managers[i] = config.managers[i].toLowerCase()
            }
        }
    }
    return config
}
