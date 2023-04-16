# Traverse AST
A simple module to travese an AST. Its specifcally designed to travel one made from `https://esm.sh/@swc/wasm-web@1.3.50`. Each Node (Statement or Expression) on the tree is called on a passed in function for you to potentionally modify and mutate.

## Usage
There is also a traverseAsync if the function being passed in will be returning a promise.
```ts
import initSwc, { parse, print } from 'https://esm.sh/@swc/wasm-web@1.3.50'
import { traverse, NodeType } from 'https://deno.land/x/traverse_ast@v0.0.1/mod.ts'

await initSwc()
const ast = await parse(await Deno.readTextFile('./input.js'))

/*
    Converting all:
        x('div', null, [])
    to:
        ({
            type: 'div',
            attributes: null,
            children: []
        })
*/
traverse(ast.body, node => {
    // Guard against all nodes that aren't a function call for a specific function called "x"
    // Best to return undefined/null if no modification was made to the provided node.
    if (node.type !== 'CallExpression' || node.callee.type !== 'Identifier' || node.callee.value !== 'x')
        return
    // Creating a new node to replace the existing.
    return {
        type: 'ParenthesisExpression',
        span,
        expression: {
            type: 'ObjectExpression',
            span,
            properties: [
                {
                    type: 'KeyValueProperty',
                    key: {
                        type: 'Identifier',
                        span,
                        value: 'type',
                        optional: false
                    },
                    value: node.arguments[ 0 ].expression
                },
                {
                    type: 'KeyValueProperty',
                    key: {
                        type: 'Identifier',
                        span,
                        value: 'attributes',
                        optional: false
                    },
                    value: node.arguments[ 1 ].expression
                },
                {
                    type: 'KeyValueProperty',
                    key: {
                        type: 'Identifier',
                        span,
                        value: 'children',
                        optional: false
                    },
                    value: node.arguments[ 2 ].expression
                }
            ]
        }
    // Can use NodeType to make sure you're compliant with SWC's structure.
    } satisfies NodeType<'ParenthesisExpression'>
})

await Deno.writeTextFile('./output.js', (await print(ast)).code)
