import { Module } from "../Managers/Module.ts"

export interface NpmCacheOld {
    package_json_md5: string
    mod: Module
}

export interface NpmCache {
    integrity: string
    mod: Module
}
