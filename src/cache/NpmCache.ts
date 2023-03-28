import { Module } from "../Managers/Module.ts";

export interface NpmCache {
    package_json_md5: string;
    mod: Module
}