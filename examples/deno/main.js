import * as Toml from "https://deno.land/std@0.181.0/toml/mod.ts";
import { readZip  } from "https://deno.land/x/jszip@0.11.0/mod.ts";

export function readToml(path) {
  return Toml.parse(Deno.readTextFileSync(path));
}

export async function unzip(path) {
  const zip = await readZip(path);
  zip.unzip();
}


if (import.meta.main) {
  console.log(readToml(Deno.args[0]));
}
