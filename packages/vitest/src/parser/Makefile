ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
all: n1ql_parser

goyacc_parser: antlr/goyacc/goyacc.g4
	antlr -Dlanguage=TypeScript -o antlr/goyacc/generated antlr/goyacc/goyacc.g4
	sed -i .bak '1s;^;// @ts-nocheck\n;' antlr/goyacc/generated/antlr/goyacc/goyaccParser.ts
	sed -i .bak "s/class \(.*\) extends antlr4.ParserRuleContext/export class \1 extends antlr4.ParserRuleContext/g" antlr/goyacc/generated/antlr/goyacc/goyaccParser.ts

n1ql_grammar: goyacc_parser antlr/goyacc/generate.ts
	npx tsx $(ROOT_DIR)/antlr/goyacc/generate.ts > $(ROOT_DIR)/antlr/n1ql/n1ql.g4

n1ql_parser: n1ql_grammar antlr/n1ql/n1ql.g4
	antlr -Dlanguage=TypeScript -o antlr/n1ql/generated antlr/n1ql/n1ql.g4
	sed -i .bak '1s;^;// @ts-nocheck\n;' antlr/n1ql/generated/antlr/n1ql/n1qlParser.ts
	sed -i .bak "s/class \(.*\) extends antlr4.ParserRuleContext/export class \1 extends antlr4.ParserRuleContext/g" antlr/n1ql/generated/antlr/n1ql/n1qlParser.ts


n1ql_parser_bnf:
	antlr -Dlanguage=TypeScript -o antlr/n1ql/generated antlr/n1ql/n1ql.g4
	sed -i .bak "s/class \(.*\) extends antlr4.ParserRuleContext/export class \1 extends antlr4.ParserRuleContext/g" antlr/n1ql/generated/antlr/n1ql/n1qlParser.ts