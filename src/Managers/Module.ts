export class Module {
    author?: string
    name?: string
    version?: string
    license?: string
    description?: string
    repo?: string
    homepage?: string
    documentation?: string
    manager?: Manager
}

export type Manager = "cargo" | "npm" | "deno" | "pnpm"
export const allManagers = ["cargo", "npm", "deno", "pnpm"] as const
