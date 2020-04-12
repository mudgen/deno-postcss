import { walk, walkSync } from "https://deno.land/std/fs/mod.ts";

for (const fileInfo of walkSync(Deno.args[0])) {
  let name = fileInfo.filename;
  if (name.endsWith(".js") && !name.endsWith("runDeno.js")) {
    console.log(name);
    Deno.run({
      cmd: ["deno", "--allow-read", "--allow-run", name],
    });
  }
}
