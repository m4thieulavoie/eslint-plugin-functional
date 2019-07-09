import { TSESTree } from "@typescript-eslint/typescript-estree";

import {
  checkNode,
  createRule,
  RuleContext,
  RuleMetaData,
  RuleResult
} from "../util/rule";

// The name of this rule.
export const name = "no-delete" as const;

// The options this rule can take.
type Options = [];

// The default options for the rule.
const defaultOptions: Options = [];

// The possible error messages.
const errorMessages = {
  generic: "Unexpected delete, objects should be considered immutable."
} as const;

// The meta data for this rule.
const meta: RuleMetaData<keyof typeof errorMessages> = {
  type: "suggestion",
  docs: {
    description: "Disallow delete expressions.",
    category: "Best Practices",
    recommended: "error"
  },
  messages: errorMessages,
  schema: []
};

/**
 * Check if the given UnaryExpression violates this rule.
 */
function checkUnaryExpression(
  node: TSESTree.UnaryExpression,
  context: RuleContext<keyof typeof errorMessages, Options>
): RuleResult<keyof typeof errorMessages, Options> {
  if (node.operator === "delete") {
    return { context, descriptors: [{ node, messageId: "generic" }] };
  }
  return { context, descriptors: [] };
}

// Create the rule.
export const rule = createRule<keyof typeof errorMessages, Options>({
  name,
  meta,
  defaultOptions,
  create(context) {
    const _checkUnaryExpression = checkNode(checkUnaryExpression, context);

    return {
      UnaryExpression: _checkUnaryExpression
    };
  }
});
