import { Module } from "../Managers/Module.ts"

export interface CargoCache {
    checksum: string
    mod: Module
}
