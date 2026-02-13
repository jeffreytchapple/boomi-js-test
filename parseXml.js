import fs from "fs/promises";
import { XMLParser } from "fast-xml-parser";

export async function loadXmlFile(path) {
  const xml = await fs.readFile(path, "utf8");

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    trimValues: true
  });

  return parser.parse(xml);
}
