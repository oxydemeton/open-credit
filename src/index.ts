import { readConfig } from "./config/ReadConfig.ts";
import * as FS from "https://deno.land/std@0.181.0/fs/mod.ts";
import { crawlNodeModules } from "./Managers/Npm.ts";

const config = readConfig()!

//Process folders
for await (const entry of FS.walk(".")) {
    switch (entry.name) {
        case "node_modules":
            if(!config.exclude.includes(entry.path) && entry.isDirectory) crawlNodeModules(entry.path);
            break;
    }
}
