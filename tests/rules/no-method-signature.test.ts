/**
 * @file Tests for no-method-signature.
 */

import dedent from "dedent";
import { RuleTester } from "eslint";

import { name, rule } from "../../src/rules/no-method-signature";

import { typescript } from "../helpers/configs";
import {
  describeTsOnly,
  InvalidTestCase,
  processInvalidTestCase,
  processValidTestCase,
  ValidTestCase,
} from "../helpers/util";

// Valid test cases.
const valid: ReadonlyArray<ValidTestCase> = [
  {
    code: dedent`
      interface Foo {
        bar: (a: number, b: string) => number;
      }`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      interface Foo extends Readonly<{
        methodSignature(): void
      }>{}`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      interface Foo extends Bar, Readonly<Baz & {
        methodSignature(): void
      }>{}`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      type Foo2 = {
        bar: (a: number, b: string) => number
      }`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      type Foo = Readonly<{
        methodSignature(): void
      }>`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      type Foo = Bar & Readonly<Baz & {
        methodSignature(): void
      }>`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      type Foo = Bar & Readonly<Baz & {
        nested: Readonly<{
          methodSignature(): void
        }>
      }>`,
    optionsSet: [[]],
  },
  {
    code: dedent`
      interface Foo extends Bar, Readonly<Baz & {
        readonly nested: {
          deepNested: Readonly<{
            methodSignature(): void
          }>
        }
      }>{}`,
    optionsSet: [[]],
  },
];

// Invalid test cases.
const invalid: ReadonlyArray<InvalidTestCase> = [
  {
    code: dedent`
      interface Foo {
        bar(a: number, b: string): number;
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 2,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
      type Foo2 = {
        bar(a: number, b: string): number
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 2,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
      type Foo = Bar & Readonly<Baz> & {
        methodSignature(): void
      }`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 2,
        column: 3,
      },
    ],
  },
  {
    code: dedent`
      type Foo = Bar & Readonly<Baz & {
        nested: {
          methodSignature(): void
        }
      }>`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 3,
        column: 5,
      },
    ],
  },
  {
    code: dedent`
      interface Foo extends Bar, Readonly<Baz & {
        readonly nested: Readonly<{
          deepNested: {
            methodSignature(): void
          }
        }>
      }>{}`,
    optionsSet: [[]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 4,
        column: 7,
      },
    ],
  },
  {
    code: dedent`
      interface Foo extends Bar, Readonly<Baz & {
        readonly nested: {
          deepNested: Readonly<{
            methodSignature(): void
          }>
        }
      }>{}`,
    optionsSet: [[{ ignoreIfReadonly: false }]],
    errors: [
      {
        messageId: "generic",
        type: "TSMethodSignature",
        line: 4,
        column: 7,
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
