import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";

test("preview server serves the English root, localized tool and WebP without exposing private files", async t => {
  const child = spawn(process.execPath, [new URL("../scripts/dev.mjs", import.meta.url).pathname], { env: { ...process.env, PORT: "0" }, stdio: ["ignore", "pipe", "pipe"] });
  t.after(async () => { if (child.exitCode === null) { child.kill(); await once(child, "exit"); } });
  const base = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Preview server did not start")), 10000);
    child.stdout.on("data", chunk => { const match = chunk.toString().match(/http:\/\/127\.0\.0\.1:\d+/); if (match) { clearTimeout(timeout); resolve(match[0]); } });
    child.on("error", error => { clearTimeout(timeout); reject(error); });
  });
  for (const path of ["/", "/zh-hans/", "/study", "/zh-hans/study"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.ok((await response.text()).includes("PhraseCut"));
  }
  const image = await fetch(base + "/images/app/mac_en_US_light_learn.webp");
  assert.equal(image.status, 200);
  assert.ok(image.headers.get("content-type").includes("image/webp"));
  for (const path of ["/.env", "/.git/HEAD", "/scripts/build-study-pages.mjs", "/%2e%2e%2fREADME.md"]) assert.equal((await fetch(base + path)).status, 404, path);
});
