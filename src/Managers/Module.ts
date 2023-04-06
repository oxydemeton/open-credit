export class Module {
    author?: string[] | string
    name?: string
    version?: string
    license?: string
    description?: string
    repo?: string
    homepage?: string
    documentation?: string
    manager?: Manager
}

export type Manager = "cargo" | "npm" | "deno" | "pnpm" | "credit.yaml"
export const allManagers = ["cargo", "npm", "deno", "pnpm", "credit.yaml"] as const
