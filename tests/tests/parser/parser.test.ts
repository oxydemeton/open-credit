import { join } from "std/path/mod.ts";
import { Config } from "../../../src/config/Config.ts"
import { readConfig } from "../../../src/config/ReadConfig.ts"
import { assertStrictEquals } from "std/assert/assert_strict_equals.ts"
import { assertEquals } from "std/assert/assert_equals.ts"

Deno.test("parser conf1", () => {
    const conf = readConfig("./tests/tests/parser/conf1.jsonc")
    const expected: Config = {
        "output": "CREDITS.md",
        "exclude": [join(Deno.cwd(), "./tests/tests/parser/examples"), join(Deno.cwd(), "./tests/tests/parser/tests")],
        "json_report": "opencredit.report.json",
        "allow_api_calls": true,
        "managers": [
            "deno"
        ],
        "cache": "./.cache"
    }
    assertEquals(conf, expected)
})