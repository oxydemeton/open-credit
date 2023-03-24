export interface Config {
    output: string                          //File to output all contributors in
    exclude: string[]                       //Folders to exclude
    json_report: string | undefined       //File to store a detailes in json format
}

export const defaultConfig: Config = {
    output: "CREDITS.md",
    exclude: [],
    json_report: undefined
}