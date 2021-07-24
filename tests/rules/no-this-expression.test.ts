/**
 * @file Tests for no-this-expression.
 */

import { RuleTester } from "eslint";

import { name, rule } from "~/rules/no-this-expression";
import { es3, typescript } from "~/tests/helpers/configs";
import type { InvalidTestCase, ValidTestCase } from "~/tests/helpers/util";
import {
  describeTsOnly,
  processInvalidTestCase,
  processValidTestCase,
} from "~/tests/helpers/util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [
  {
    code: `var x = 0;`,
    optionsSet: [[]],
  },
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: `this.x = 0;`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "ThisExpression",
        line: 1,
        column: 1,
      },
    ],
  },
];

describeTsOnly("TypeScript", () => {
  const ruleTester = new RuleTester(typescript);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid),
  });
});

describe("JavaScript (es3)", () => {
  const ruleTester = new RuleTester(es3);
  ruleTester.run(name, rule, {
    valid: processValidTestCase(valid),
    invalid: processInvalidTestCase(invalid),
  });
});
