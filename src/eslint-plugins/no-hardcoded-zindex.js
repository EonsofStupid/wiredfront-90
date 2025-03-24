
/**
 * ESLint rule to prevent hardcoded z-index values
 * 
 * This rule enforces the use of the centralized z-index system
 * by flagging any hardcoded numeric z-index values in styles.
 * 
 * Add this to your .eslintrc.js:
 * {
 *   plugins: ['custom'],
 *   rules: {
 *     'custom/no-hardcoded-zindex': 'error'
 *   }
 * }
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded z-index values',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    return {
      Property(node) {
        if (
          node.key.name === 'zIndex' || 
          (node.key.type === 'Literal' && node.key.value === 'z-index') ||
          (node.key.type === 'Identifier' && node.key.name === 'zIndex')
        ) {
          if (node.value.type === 'Literal' && typeof node.value.value === 'number') {
            context.report({
              node,
              message: 'Hardcoded z-index values are not allowed. Import from src/styles/theme/zIndex.ts instead.',
            });
          }
        }
      },
      
      // Check for inline style attributes
      JSXAttribute(node) {
        if (node.name.name === 'style') {
          if (node.value && node.value.type === 'JSXExpressionContainer') {
            const expression = node.value.expression;
            if (expression.type === 'ObjectExpression') {
              expression.properties.forEach((prop) => {
                if (
                  (prop.key.name === 'zIndex' || prop.key.value === 'zIndex') &&
                  prop.value.type === 'Literal' &&
                  typeof prop.value.value === 'number'
                ) {
                  context.report({
                    node: prop,
                    message: 'Hardcoded z-index values are not allowed in inline styles. Use var(--z-*) CSS variables instead.',
                  });
                }
              });
            }
          }
        }
      },
    };
  },
};
