import path from "path";
import { loadXmlFile } from "../parseXml.js";
import { mapDocument } from "../mapping.js";

test("mapping runs against Order_Test.xml", async () => {
  const xmlPath = path.resolve("./fixtures/Order_Test.xml");
  const doc = await loadXmlFile(xmlPath);
  const result = mapDocument(doc);

  expect(result).toHaveProperty("orderId");
  expect(result).toHaveProperty("billing");
});
