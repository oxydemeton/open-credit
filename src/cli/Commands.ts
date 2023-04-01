export interface Command {
    description: string
    parameters: string[]
}
export type Commands = "run" | "init" | "stats" | "clear-cache"
export const commands: Map<Commands, Command> = new Map([
    ["run", {
        description:
            "Collect informations about used packages/modules/crates and write them to a markdown file.",
        parameters: [
            "-h | Print help",
            "--conf <file_name> | Overwrite the name of the config file. Default: opencredit.jsonc",
            "--md <file_name> | Specify Output file name. Default: CREDITS.md",
            "--json <file_name> | Specify if an json output should be given. If empty there is no output.",
            "--managers <manager1,manager2,...> | Specify which managers should be used. Default: as in config file.",
            "--cache <cache_path> | Specify the path to the cache. Default: as in config file.",
        ],
    }],
    ["init", {
        description: "Creates a default config file.",
        parameters: [
            "-h | Print help",
            "--conf <file_name> | Overwrite the name of the config file. Default: opencredit.jsonc",
            "--managers <manager1,manager2,...> | Specify which managers should be used. Default: cargo,npm,deno",
            "--cache <cache_path> | Specify the path to the cache. Default: as in config file",
        ],
    }],
    ["stats", {
        description:
            "Prints statistics about packages/modules/crates used in the project.",
        parameters: [
            "-h | Print help",
            "--conf <file_name> | Overwrite the name of the config file. Default: opencredit.jsonc",
            "--managers <manager1,manager2,...> | Specify which managers should be used. Default: as in config file",
            "--cache <cache_path> | Specify the path to the cache. Default: as in config file",
        ],
    }],
    ["clear-cache", {
        description: "Clears the cache for the given managers.",
        parameters: [
            "-h | Print help",
            "--conf <file_name> | Overwrite the name of the config file. Default: opencredit.jsonc",
            "--managers <manager1,manager2,...> | Specify which managers should be used. Default: as in config file",
            "--cache <cache_path> | Specify the path to the cache. Default: as in config file",
        ],
    }],
])
