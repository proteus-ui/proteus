import { COMPOUND_BY_KEY } from "./compounds.js";

const MAP_METHODS = new Set(["map", "flatMap"]);

function importedName(spec) {
  const imported = spec.imported;
  if (imported.type === "Identifier") return imported.name;
  if (imported.type === "Literal" && typeof imported.value === "string") return imported.value;
  return undefined;
}

function jsxName(name) {
  if (name.type === "JSXIdentifier") return name.name;
  if (name.type === "JSXMemberExpression") {
    const object = jsxName(name.object);
    if (object == null) return undefined;
    return `${object}.${name.property.name}`;
  }
  return undefined;
}

function resolveName(raw, aliases) {
  if (raw == null) return undefined;
  const dot = raw.indexOf(".");
  if (dot === -1) return aliases.get(raw) ?? raw;
  const object = raw.slice(0, dot);
  const member = raw.slice(dot + 1);
  return `${aliases.get(object) ?? object}.${member}`;
}

function slotList(spec) {
  return spec.members.join(", ");
}

function slotKey(resolved, spec) {
  const prefix = `${spec.memberRoot}.`;
  if (resolved.startsWith(prefix)) {
    const member = resolved.slice(prefix.length);
    return spec.members.includes(member) ? member : undefined;
  }
  const index = spec.identifiers.indexOf(resolved);
  if (index === -1) return undefined;
  return spec.members[index];
}

function isAllowedSlot(resolved, spec) {
  return slotKey(resolved, spec) != null;
}

function isMapCall(node) {
  if (node.type !== "CallExpression") return false;
  const callee = node.callee;
  return callee.type === "MemberExpression" && callee.property.type === "Identifier" && MAP_METHODS.has(callee.property.name);
}

function callbackBody(fn) {
  if (fn == null) return undefined;
  if (fn.type !== "ArrowFunctionExpression" && fn.type !== "FunctionExpression") return undefined;
  if (fn.body.type !== "BlockStatement") return fn.body;
  const returns = fn.body.body.filter((s) => s.type === "ReturnStatement");
  return returns.length === 1 ? returns[0].argument : undefined;
}

/** @type {import("eslint").Rule.RuleModule} */
export const compoundSlotsRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Restrict compound component children to declared slots",
    },
    schema: [],
    messages: {
      invalidChild: "{{parent}} direct children must be slot elements ({{slots}}).",
      duplicateSlot: "Duplicate {{parent}}.{{slot}}. Each slot may appear at most once.",
    },
  },
  create(context) {
    /** @type {Map<string, string>} */
    const aliases = new Map();

    function reportInvalid(node, parent, spec) {
      context.report({
        node,
        messageId: "invalidChild",
        data: { parent, slots: slotList(spec) },
      });
    }

    function visitExpr(expr, parent, spec, seen) {
      if (expr == null || expr.type === "JSXEmptyExpression") return;
      switch (expr.type) {
        case "Literal":
          if (expr.value == null || typeof expr.value === "boolean") return;
          if (typeof expr.value === "string" && expr.value.trim() === "") return;
          reportInvalid(expr, parent, spec);
          return;
        case "Identifier":
          if (expr.name === "undefined") return;
          return;
        case "LogicalExpression":
          if (expr.operator === "&&") {
            visitExpr(expr.right, parent, spec, seen);
            return;
          }
          visitExpr(expr.left, parent, spec, seen);
          visitExpr(expr.right, parent, spec, seen);
          return;
        case "ConditionalExpression":
          visitExpr(expr.consequent, parent, spec, seen);
          visitExpr(expr.alternate, parent, spec, seen);
          return;
        case "CallExpression":
          if (isMapCall(expr)) {
            visitExpr(callbackBody(expr.arguments[0]), parent, spec, seen);
          }
          return;
        case "ArrayExpression":
          for (const el of expr.elements) visitExpr(el, parent, spec, seen);
          return;
        case "JSXElement":
          visitSlotElement(expr, parent, spec, seen);
          return;
        case "JSXFragment":
          reportInvalid(expr, parent, spec);
          return;
        case "ParenthesizedExpression":
        case "TSAsExpression":
        case "TSSatisfiesExpression":
        case "TSNonNullExpression":
        case "ChainExpression":
          visitExpr(expr.expression, parent, spec, seen);
          return;
        default:
          reportInvalid(expr, parent, spec);
      }
    }

    function visitSlotElement(node, parent, spec, seen) {
      const resolved = resolveName(jsxName(node.openingElement.name), aliases);
      if (resolved == null || !isAllowedSlot(resolved, spec)) {
        reportInvalid(node, parent, spec);
        return;
      }
      if (!spec.unique) return;
      const key = slotKey(resolved, spec);
      if (key == null) return;
      if (seen.has(key)) {
        context.report({
          node,
          messageId: "duplicateSlot",
          data: { parent, slot: key },
        });
        return;
      }
      seen.add(key);
    }

    function visitChild(child, parent, spec, seen) {
      switch (child.type) {
        case "JSXText":
          if (child.value.trim() !== "") reportInvalid(child, parent, spec);
          return;
        case "JSXExpressionContainer":
          visitExpr(child.expression, parent, spec, seen);
          return;
        case "JSXElement":
          visitSlotElement(child, parent, spec, seen);
          return;
        case "JSXFragment":
        case "JSXSpreadChild":
          reportInvalid(child, parent, spec);
          return;
        default:
          reportInvalid(child, parent, spec);
      }
    }

    return {
      ImportDeclaration(node) {
        for (const spec of node.specifiers) {
          if (spec.type !== "ImportSpecifier") continue;
          const imported = importedName(spec);
          if (imported == null) continue;
          aliases.set(spec.local.name, imported);
        }
      },
      JSXElement(node) {
        const parent = resolveName(jsxName(node.openingElement.name), aliases);
        if (parent == null) return;
        const spec = COMPOUND_BY_KEY.get(parent);
        if (spec == null) return;
        const seen = new Set();
        for (const child of node.children) visitChild(child, parent, spec, seen);
      },
    };
  },
};
