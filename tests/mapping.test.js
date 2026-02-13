// tests/initialPayment.test.js
import path from "path";
import { runBoomiScriptFile } from "../src/testUtils/runBoomiScript.js";

const scriptPath = path.resolve("./src/boomi/initialPayment.js");

test("sets InstallmentInitialDeposit when InitialAmount differs from RecurringAmount", async () => {
  const result = await runBoomiScriptFile(scriptPath, {
    InitialAmount: "4832.11",
    RecurringAmount: "100.00"
  });

  expect(result.InstallmentInitialDeposit).toBe("4832.11");
});

test("does not set InstallmentInitialDeposit when amounts are numerically equal", async () => {
  const result = await runBoomiScriptFile(scriptPath, {
    InitialAmount: "1,000.00",
    RecurringAmount: "1000.00"
  });

  expect(result.InstallmentInitialDeposit).toBeUndefined();
});

test("does nothing when either input is missing", async () => {
  const result = await runBoomiScriptFile(scriptPath, {
    InitialAmount: "100.00",
    RecurringAmount: null
  });

  expect(result.InstallmentInitialDeposit).toBeUndefined();
});
