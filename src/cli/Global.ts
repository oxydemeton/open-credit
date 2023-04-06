export const runtime = {
    versions: {
        opencredit: "0.4.0-alpha",
        deno: Deno.version.deno,
        v8: Deno.version.v8,
        typescript: Deno.version.typescript,
    },
    build: {
        os: Deno.build.os,
        arch: Deno.build.arch,
        target: Deno.build.target,
    },
}
