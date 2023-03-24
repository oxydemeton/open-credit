import { parse } from "https://deno.land/std@0.181.0/jsonc/mod.ts";
import { Config } from "./Config.ts"
import { defaultConfig } from "./default.ts";

export function parseConfig(txt:string): Config {
    const config = defaultConfig;
    const json = parse(txt) as any;
    if (typeof json.output === "string") {
        config.output = json.output;
    }else if(json.output !== undefined) {
        console.error("Config Error: \"output\" is of type " + typeof json.output + " but type string is expected.");
    }
    if (typeof json.exclude === "object") {
        config.exclude = json.exclude;
    }else if(json.exclude !== undefined) {
        console.error("Config Error: \"exclude\" is of type " + typeof json.exclude + " but type object/array is expected.");
    }
    if (typeof json.json_report === "object") {
        config.json_report = json.output;
    }else if(json.json_report !== undefined) {
        console.error("Config Error: \"json_report\" is of type " + typeof json.json_report + " but type object/array is expected.");
    }
    return config;
}