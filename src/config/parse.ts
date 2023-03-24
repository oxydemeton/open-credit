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
    if (typeof json.json_report === "string") {
        config.json_report = json.json_report;
    }else if(json.json_report !== undefined) {
        console.error("Config Error: \"json_report\" is of type " + typeof json.json_report + " but type string is expected.");
    }
    if (typeof json.allow_api_calls === "boolean") {
        config.allow_api_calls = json.allow_api_calls;
    }else if(json.allow_api_calls !== undefined) {
        console.error("Config Error: \"allow_api_calls\" is of type " + typeof json.allow_api_calls + " but type boolean is expected.");
    }
    if (json.managers) {
        config.managers = json.managers
    }
    return config;
}