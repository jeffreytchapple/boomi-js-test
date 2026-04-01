# boomi-js-test

Small Node.js sandbox for testing Boomi-style JavaScript outside of Boomi.

![Node.js](https://img.shields.io/badge/node-%3E%3D18-3C873A?logo=node.js&logoColor=white)
![Jest](https://img.shields.io/badge/tested_with-Jest-C21325?logo=jest&logoColor=white)
![ESM](https://img.shields.io/badge/modules-ESM-1f6feb)
![Status](https://img.shields.io/badge/purpose-Boomi%20script%20testing-0a7ea4)

This repository makes it easier to validate mapping logic and script behavior locally with Jest instead of testing only inside the Boomi platform.

It currently includes:

- A Boomi-style script example for `InitialAmount` / `RecurringAmount` handling
- A lightweight test harness that runs scripts inside a VM sandbox
- XML parsing and document mapping helpers
- A sample XML fixture for local experimentation

## At a glance

- Runtime: Node.js with native ESM
- Test framework: Jest
- Main use case: local testing of Boomi-style scripts that read and write globals
- Extras: XML fixture parsing and object mapping helpers

## Why this repo exists

Boomi scripts often rely on global variables and runtime behavior that are awkward to test directly. This project provides a simple local workflow for:

- Running Boomi-like scripts with mocked globals
- Writing repeatable Jest tests around script behavior
- Parsing XML fixtures into JavaScript objects
- Building and testing mapping functions independently

## Quick start for a new developer

If you're opening this repo for the first time, this is the fastest way to get oriented:

1. Install dependencies with `npm install`.
2. Run the current test suite with `npm test`.
3. Open `src/boomi/initialPayment.js` to see the Boomi-style script being tested.
4. Open `src/testUtils/runBoomiScript.js` to see how the local sandbox works.
5. Open `tests/mapping.test.js` to see the current test pattern end to end.
6. If you're working with XML-based mappings, inspect `fixtures/Order_Test.xml`, `parseXml.js`, and `mapping.js`.

After that, you should have enough context to either:

- add a new Boomi-style script test, or
- add tests around XML parsing and mapping behavior

## Quick commands

```bash
npm install
npm test
```

## Project structure

```text
.
├── fixtures/
│   └── Order_Test.xml
├── src/
│   ├── boomi/
│   │   └── initialPayment.js
│   └── testUtils/
│       └── runBoomiScript.js
├── tests/
│   └── mapping.test.js
├── mapping.js
├── parseXml.js
├── jest.config.js
└── package.json
```

## Requirements

- Node.js 18+ recommended
- npm

## Install

```bash
npm install
```

## Run tests

```bash
npm test
```

The test suite uses Jest and executes in-band with Node's VM module support enabled for ESM.

## Recommended workflow

For most changes in this repo, a good development loop looks like this:

1. Update or add a script under `src/boomi/`.
2. Add or update a Jest test under `tests/`.
3. Run `npm test`.
4. If the change depends on real payload shape, add or reuse a file in `fixtures/`.
5. Keep the script logic small and push test setup into the harness or fixtures when possible.

## Typical use cases

- Validate a Boomi script's branching logic before deployment
- Reproduce a bug with controlled inputs in a local test
- Build confidence around string, numeric, or null-handling edge cases
- Parse a sample XML payload and transform it into a normalized object shape

## What each file does

### `src/boomi/initialPayment.js`

A Boomi-style script that compares `InitialAmount` and `RecurringAmount` and sets `InstallmentInitialDeposit` only when the values differ.

### `src/testUtils/runBoomiScript.js`

Loads a script file, creates a VM sandbox, injects mock global variables, and executes the script in a Boomi-like way.

### `tests/mapping.test.js`

Contains Jest tests that verify the behavior of the Boomi-style `initialPayment.js` script by supplying mocked globals and asserting on the sandbox output.

### `parseXml.js`

Provides `loadXmlFile(path)`, a small helper that reads and parses XML using `fast-xml-parser`.

### `mapping.js`

Provides `mapDocument(doc)`, which maps an `Order` payload into a smaller normalized JavaScript object with billing details and an `isActive` flag.

### `fixtures/Order_Test.xml`

A sample order XML payload that can be used for local parsing and mapping experiments.

## Example: testing a Boomi-style script

The test utility lets you simulate Boomi globals locally:

```js
import path from "path";
import { runBoomiScriptFile } from "./src/testUtils/runBoomiScript.js";

const scriptPath = path.resolve("./src/boomi/initialPayment.js");

const result = await runBoomiScriptFile(scriptPath, {
  InitialAmount: "4832.11",
  RecurringAmount: "100.00"
});

console.log(result.InstallmentInitialDeposit);
// "4832.11"
```

## How the Boomi testing pattern works

This repository is built around a simple idea: treat a Boomi script like a plain JavaScript file that reads and writes global variables.

The local test flow works like this:

1. A script file such as `src/boomi/initialPayment.js` expects values like `InitialAmount` and `RecurringAmount` to already exist.
2. The test harness in `src/testUtils/runBoomiScript.js` reads that file and runs it inside a Node VM context.
3. The VM sandbox is seeded with mock globals supplied by the test.
4. The script mutates the sandbox by writing output variables such as `InstallmentInitialDeposit`.
5. The test asserts on the final sandbox state.

That gives you a local approximation of Boomi's "globals in, globals out" scripting model without needing to deploy or run inside the Boomi platform.

## How to add another Boomi-style test

Use this pattern when you want to validate another script locally:

1. Add the script under `src/boomi/`.
2. Create a test file under `tests/`.
3. Use `runBoomiScriptFile()` to execute the script with mocked global inputs.
4. Assert on the output variables added or changed by the script.

Example:

```js
import path from "path";
import { runBoomiScriptFile } from "../src/testUtils/runBoomiScript.js";

const scriptPath = path.resolve("./src/boomi/myScript.js");

test("sets the expected output", async () => {
  const result = await runBoomiScriptFile(scriptPath, {
    SomeInput: "value"
  });

  expect(result.SomeOutput).toBe("expected");
});
```

## Practical testing tips

- Mock only the globals a script actually depends on.
- Assert on the final output variables, not the internal implementation details.
- Use realistic string inputs, especially when Boomi would pass values as text.
- Add fixture files when payload shape matters more than a single field.
- Keep one test focused on the happy path and add separate tests for missing or malformed inputs.

## Example: parsing and mapping XML

```js
import { loadXmlFile } from "./parseXml.js";
import { mapDocument } from "./mapping.js";

const parsed = await loadXmlFile("./fixtures/Order_Test.xml");
const mapped = mapDocument(parsed);

console.log(mapped);
```

## Notes

- The test file is named `tests/mapping.test.js`, but it currently tests `src/boomi/initialPayment.js`.
- The repository is configured as ESM (`"type": "module"` in `package.json`).
- `node_modules/` is already present locally, but a fresh clone should start with `npm install`.
- The VM-based test harness is intentionally lightweight, so it is best suited to script logic that can be modeled with input and output globals.

## Possible next improvements

- Rename the current test file to better reflect what it covers
- Add tests for `parseXml.js` and `mapping.js`
- Add more Boomi script examples and fixtures
- Add npm scripts for focused test runs or watch mode
