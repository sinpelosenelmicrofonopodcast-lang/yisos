import { readFile } from "node:fs/promises";
import path from "node:path";

function getAssetPath(fileName: string) {
  return path.join(process.cwd(), "public", fileName);
}

export async function getAssetDataUrl(fileName: string) {
  const file = await readFile(getAssetPath(fileName));
  const ext = path.extname(fileName).replace(".", "").toLowerCase() || "png";
  return `data:image/${ext};base64,${file.toString("base64")}`;
}
