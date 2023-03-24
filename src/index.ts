import { readConfig } from "./config/ReadConfig.ts";
import * as FS from "https://deno.land/std@0.181.0/fs/mod.ts";
import { crawlNodeModules } from "./Managers/Npm.ts";
import { Module } from "./Managers/Module.ts";

const config = readConfig()!

//Process folders
const modules: Module[] = []
for await (const entry of FS.walk(".")) {
    switch (entry.name) {
        case "node_modules":
            if(!config.exclude.includes(entry.path) && entry.isDirectory) Array.prototype.push.apply(modules, await crawlNodeModules(entry.path))

            break;
    }
}
console.log(modules)


