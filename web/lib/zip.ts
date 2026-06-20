import JSZip from "jszip";

// Bundle a generated file map into a zip (under a top-level folder named for the project).
export async function zipFiles(rootName: string, files: Record<string, string>): Promise<Buffer> {
  const zip = new JSZip();
  const folder = zip.folder(rootName)!;
  for (const [path, content] of Object.entries(files)) folder.file(path, content);
  return zip.generateAsync({ type: "nodebuffer" });
}
