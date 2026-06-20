// Write a generated file map to disk (CLI only).
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export async function writeFiles(targetDir: string, files: Record<string, string>): Promise<void> {
  for (const [rel, content] of Object.entries(files)) {
    const full = join(targetDir, rel);
    await mkdir(dirname(full), { recursive: true });
    await writeFile(full, content, "utf8");
  }
}
