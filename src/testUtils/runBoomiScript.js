// src/testUtils/runBoomiScript.js
import fs from "fs/promises";
import vm from "vm";

export async function runBoomiScriptFile(scriptPath, globals = {}) {
  const code = await fs.readFile(scriptPath, "utf8");

  // Boomi-like sandbox: inputs and outputs live on the global object
  const sandbox = { ...globals };

  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: scriptPath });

  return sandbox;
}
