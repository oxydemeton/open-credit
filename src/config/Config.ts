export interface Config {
    output: string //File to output all contributors in
    exclude: string[] //Folders to exclude
    json_report: string | undefined //File to store a details in json format
    allow_api_calls: boolean //If deno is allowed to request apis to get additional information about packages
    managers?: Array<string> //Select which managers should be searched for. If not set: all managers are checked
    cache?: false | string //If set, the cache will be used. If false, the cache will be ignored. If not set, the .cache/opencredit folder will be used
}
