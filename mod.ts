import { ModuleItem, Expression } from 'https://esm.sh/@swc/wasm-web@1.3.50'

export type Node = ModuleItem | Expression
export type NodeType<T> = Node & { type: T }
export type None = undefined | null

const childNodes = (() => ({
	ImportDeclaration(_node) {
		return []
	},
	ExportDeclaration(node) {
		return [ node.declaration ]
	},
	ExportNamedDeclaration(_node) {
		return []
	},
	ExportDefaultDeclaration(node) {
		return [ node.decl ]
	},
	ExportDefaultExpression(node) {
		return [ node.expression ]
	},
	ExportAllDeclaration(_node) {
		return []
	},
	TsImportEqualsDeclaration(_node) {
		return []
	},
	TsExportAssignment(node) {
		return [ node.expression ]
	},
	TsNamespaceExportDeclaration(_node) {
		return []
	},
	BlockStatement(node) {
		return node.stmts
	},
	EmptyStatement(_node) {
		return []
	},
	DebuggerStatement(_node) {
		return []
	},
	WithStatement(node) {
		return [ node.object, node.body ]
	},
	ReturnStatement(node) {
		return noNil([ node.argument ])
	},
	LabeledStatement(node) {
		return [ node.body ]
	},
	BreakStatement(_node) {
		return []
	},
	ContinueStatement(_node) {
		return []
	},
	IfStatement(node) {
		return noNil([ node.test, node.consequent, node.alternate ])
	},
	SwitchStatement(node) {
		return [ node.discriminant, ...node.cases.map(x => noNil([ x.test, ...x.consequent ])) ].flat()
	},
	ThrowStatement(node) {
		return [ node.argument ]
	},
	TryStatement(node) {
		return noNil([ node.block, node.finalizer ])
	},
	WhileStatement(node) {
		return [ node.test, node.body ]
	},
	DoWhileStatement(node) {
		return [ node.test, node.body ]
	},
	ForStatement(node) {
		return noNil([ node.init, node.test, node.update, node.body ])
	},
	ForInStatement(node) {
		return [ node.right, node.body ]
	},
	ForOfStatement(node) {
		return [ node.right, node.body ]
	},
	ClassDeclaration(_node) {
		return []
	},
	FunctionDeclaration(node) {
		return noNil([ node.identifier, node.body ])
	},
	VariableDeclaration(node) {
		return noNil(node.declarations.map(x => x.init))
	},
	TsInterfaceDeclaration(node) {
		return node.extends.map(x => x.expression)
	},
	TsTypeAliasDeclaration(_node) {
		return []
	},
	TsEnumDeclaration(_node) {
		return []
	},
	TsModuleDeclaration(_node) {
		return []
	},
	ExpressionStatement(node) {
		return [ node.expression ]
	},
	ThisExpression(_node) {
		return []
	},
	ArrayExpression(node) {
		return noNil(node.elements).map(x => x.expression)
	},
	ObjectExpression(node) {
		return noNil(node.properties.map(x => {
			if (x.type === 'SpreadElement')
				return x.arguments
			if (x.type === 'KeyValueProperty' || x.type === 'AssignmentProperty')
				return x.value
			if (x.type === 'GetterProperty' || x.type === 'SetterProperty')
				return x.body
		}))
	},
	FunctionExpression(_node) {
		return []
	},
	UnaryExpression(node) {
		return [ node.argument ]
	},
	UpdateExpression(node) {
		return [ node.argument ]
	},
	BinaryExpression(node) {
		return [ node.left, node.right ]
	},
	AssignmentExpression(node) {
		if (node.left.type === 'Identifier' || node.left.type === 'ArrayPattern' || node.left.type === 'RestElement' || node.left.type === 'ObjectPattern' || node.left.type === 'AssignmentPattern')
			return [ node.right ]
		return [ node.left, node.right ]
	},
	MemberExpression(node) {
		return [ node.object ]
	},
	SuperPropExpression(_node) {
		return []
	},
	ConditionalExpression(node) {
		return [ node.test, node.consequent, node.alternate ]
	},
	CallExpression(node) {
		if (node.callee.type === 'Super' || node.callee.type === 'Import')
			return node.arguments.map(x => x.expression)
		return [ node.callee, ...node.arguments.map(x => x.expression) ]
	},
	NewExpression(node) {
		return [ node.callee, ...node.arguments?.map(x => x.expression) ?? [] ]
	},
	SequenceExpression(node) {
		return node.expressions
	},
	Identifier(_node) {
		return []
	},
	StringLiteral(_node) {
		return []
	},
	BooleanLiteral(_node) {
		return []
	},
	NullLiteral(_node) {
		return []
	},
	NumericLiteral(_node) {
		return []
	},
	BigIntLiteral(_node) {
		return []
	},
	RegExpLiteral(_node) {
		return []
	},
	JSXText(_node) {
		return []
	},
	TemplateLiteral(node) {
		return node.expressions
	},
	TaggedTemplateExpression(node) {
		return [ node.tag ]
	},
	ArrowFunctionExpression(node) {
		return [ node.body ]
	},
	ClassExpression(_node) {
		return []
	},
	YieldExpression(node) {
		return noNil([ node.argument ])
	},
	MetaProperty(_node) {
		return []
	},
	AwaitExpression(node) {
		return [ node.argument ]
	},
	ParenthesisExpression(node) {
		return [ node.expression ]
	},
	JSXMemberExpression(node) {
		return [ node.object ]
	},
	JSXNamespacedName(_node) {
		return []
	},
	JSXEmptyExpression(_node) {
		return []
	},
	JSXElement(_node) {
		return []
	},
	JSXFragment(_node) {
		return []
	},
	TsTypeAssertion(node) {
		return [ node.expression ]
	},
	TsConstAssertion(node) {
		return [ node.expression ]
	},
	TsNonNullExpression(node) {
		return [ node.expression ]
	},
	TsAsExpression(node) {
		return [ node.expression ]
	},
	TsInstantiation(node) {
		return [ node.expression ]
	},
	PrivateName(_node) {
		return []
	},
	OptionalChainingExpression(node) {
		return [ node.base ]
	},
	Invalid(_node) {
		return []
	}
} satisfies { [ k in Node[ 'type' ] ]: (node: Node & { type: k }) => Node[] }))() as Record<Node[ 'type' ], (node: Node) => Node[]>

function noNil<T>(input: T[]): NonNullable<T>[] {
	const output: NonNullable<T>[] = []
	for (let i = 0; i < input.length; ++i)
		if (input[ i ] != null)
			output.push(input[ i ]!)
	return output
}

export function traverse(nodes: Node[], modify: (node: Node) => Node | None): void {
	for (let i = 0; i < nodes.length; ++i) {
		const node = nodes[ i ]
		pushUpdate(node, modify(node))
		traverse(childNodes[ node.type ](node), modify)
	}
}

export async function traverseAsync(nodes: Node[], modify: (node: Node) => Promise<Node | None>): Promise<void> {
	for (let i = 0; i < nodes.length; ++i) {
		const node = nodes[ i ]
		pushUpdate(node, await modify(node))
		await traverseAsync(childNodes[node.type](node), modify)
	}
}

function pushUpdate(originalNode: Node, updateNode: Node | None) {
	if (!updateNode)
		return
	updateNode = { ...updateNode }
	for (const key in originalNode)
		// deno-lint-ignore no-explicit-any
		(originalNode as any)[ key ] = undefined
	for (const key in updateNode)
		// deno-lint-ignore no-explicit-any
		(originalNode as any)[ key ] = (updateNode as any)[ key ]
}
