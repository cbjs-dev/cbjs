/*
 * This is an automotically generated Antlr4 N1QL parser.
 *
 * Actually, the lexer part is hand-generated, and the parser rules are extracted
 * using an Antlr4 parser that parses the rules from the goyacc n1ql.y file.
 */

grammar n1ql;

fragment SingleStringCharacter:   '\'\'' | '\\\'' | '\\' ~['] | ~['\r\n\\];
fragment DoubleStringCharacter:   '\\"'  | '\\' ~["] | ~["\\];

STR:           '\'' SingleStringCharacter* '\''
|              '"' DoubleStringCharacter* '"';

fragment NumStart: '0' | [1-9];
fragment Digit:    [0-9];

fragment Int:      '0' | NumStart Digit*;
fragment Exponent: [eE][+-]? Digit+;

INT:           Int;

NUM:           Int '.' Digit+ Exponent? | Int Exponent;
BLOCK_COMMENT: '/*' .*? '*/';

LINE_COMMENT:  '--' ~[\n\r]*;
WHITESPACE:    [ \t\n\r\f\u00a0]+ -> skip;
DOT:           '.';
PLUS:          '+';
MINUS:         '-' | [mM][iI][nN][uU][sS];
STAR:          '*';
DIV:           '/';
MOD:           '%';
DEQ:           '==';
EQ:            '=';
NE:            '!=' | '<>';
LT:            '<';
LE:            '<=';
GT:            '>';
GE:            '>=';
CONCAT:        '||';
LPAREN:        '(';
RPAREN:        ')';
LBRACE:        '{';
RBRACE:        '}';
COMMA:         ',';
COLON:         ':';
LBRACKET:      '[';
RBRACKET:      ']';
RBRACKET_ICASE:']i';
SEMI:          ';';
NOT_A_TOKEN:   '!';

NAMESPACE_ID: [dD][eE][fF][aA][uU][lL][tT];

ADVISE:       [aA][dD][vV][iI][sS][eE];
ALL:          [aA][lL][lL];
ALTER:        [aA][lL][tT][eE][rR];
ANALYZE:      [aA][nN][aA][lL][yY][zZ][eE];
AND:          [aA][nN][dD];
ANY:          [aA][nN][yY];
ARRAY:        [aA][rR][rR][aA][yY];
AS:           [aA][sS];
ASC:          [aA][sS][cC];
AT:           [aA][tT];
BEGIN:        [bB][eE][gG][iI][nN];
BETWEEN:      [bB][eE][tT][wW][eE][eE][nN];
BINARY:       [bB][iI][nN][aA][rR][yY];
BOOLEAN:      [bB][oO][oO][lL][eE][aA][nN];
BREAK:        [bB][rR][eE][aA][kK];
BUCKET:       [bB][uU][cC][kK][eE][tT];
BUILD:        [bB][uU][iI][lL][dD];
BY:           [bB][yY];
CALL:         [cC][aA][lL][lL];
CASE:         [cC][aA][sS][eE];
CAST:         [cC][aA][sS][tT];
CLUSTER:      [cC][lL][uU][sS][tT][eE][rR];
COLLATE:      [cC][oO][lL][lL][aA][tT][eE];
COLLECTION:   [cC][oO][lL][lL][eE][cC][tT][iI][oO][nN];
COMMIT:       [cC][oO][mM][mM][iI][tT];
COMMITTED:    [cC][oO][mM][mM][iI][tT][tT][eE][dD];
CONNECT:      [cC][oO][nN][nN][eE][cC][tT];
CONTINUE:     [cC][oO][nN][tT][iI][nN][uU][eE];
CORRELATED:   [cC][oO][rR][rR][eE][lL][aA][tT][eE][dD];
COVER:        [cC][oO][vV][eE][rR];
CREATE:       [cC][rR][eE][aA][tT][eE];
CURRENT:      [cC][uU][rR][rR][eE][nN][tT];
DATABASE:     [dD][aA][tT][aA][bB][aA][sS][eE];
DATASET:      [dD][aA][tT][aA][sS][eE][tT];
DATASTORE:    [dD][aA][tT][aA][sS][tT][oO][rR][eE];
DECLARE:      [dD][eE][cC][lL][aA][rR][eE];
DECREMENT:    [dD][eE][cC][rR][eE][mM][eE][nN][tT];
DELETE_:      [dD][eE][lL][eE][tT][eE];
DERIVED:      [dD][eE][rR][iI][vV][eE][dD];
DESC:         [dD][eE][sS][cC];
DESCRIBE:     [dD][eE][sS][cC][rR][iI][bB][eE];
DISTINCT:     [dD][iI][sS][tT][iI][nN][cC][tT];
DO:           [dD][oO];
DROP:         [dD][rR][oO][pP];
EACH:         [eE][aA][cC][hH];
ELEMENT:      [eE][lL][eE][mM][eE][nN][tT];
ELSE:         [eE][lL][sS][eE];
END:          [eE][nN][dD];
EVERY:        [eE][vV][eE][rR][yY];
EXCEPT:       [eE][xX][cC][eE][pP][tT];
EXCLUDE:      [eE][xX][cC][lL][uU][dD][eE];
EXECUTE:      [eE][xX][eE][cC][uU][tT][eE];
EXISTS:       [eE][xX][iI][sS][tT][sS];
EXPLAIN:      [eE][xX][pP][lL][aA][iI][nN];
FALSE:        [fF][aA][lL][sS][eE];
FETCH:        [fF][eE][tT][cC][hH];
FILTER:       [fF][iI][lL][tT][eE][rR];
FIRST:        [fF][iI][rR][sS][tT];
FLATTEN:      [fF][lL][aA][tT][tT][eE][nN];
FLUSH:        [fF][lL][uU][sS][hH];
FOLLOWING:    [fF][oO][lL][lL][oO][wW][iI][nN][gG];
FOR:          [fF][oO][rR];
FORCE:        [fF][oO][rR][cC][eE];
FROM:         [fF][rR][oO][mM];
FTS:          [fF][tT][sS];
FUNCTION:     [fF][uU][nN][cC][tT][iI][oO][nN];
GOLANG:       [gG][oO][lL][aA][nN][gG];
GRANT:        [gG][rR][aA][nN][tT];
GROUP:        [gG][rR][oO][uU][pP];
GROUPS:       [gG][rR][oO][uU][pP][sS];
GSI:          [gG][sS][iI];
HASH:         [hH][aA][sS][hH];
HAVING:       [hH][aA][vV][iI][nN][gG];
IF:           [iI][fF];
IGNORE:       [iI][gG][nN][oO][rR][eE];
ILIKE:        [iI][lL][iI][kK][eE];
IN:           [iI][nN];
INCLUDE:      [iI][nN][cC][lL][uU][dD][eE];
INCREMENT:    [iI][nN][cC][rR][eE][mM][eE][nN][tT];
INDEX:        [iI][nN][dD][eE][xX];
INFER:        [iI][nN][fF][eE][rR];
INLINE:       [iI][nN][lL][iI][nN][eE];
INNER:        [iI][nN][nN][eE][rR];
INSERT:       [iI][nN][sS][eE][rR][tT];
INTERSECT:    [iI][nN][tT][eE][rR][sS][eE][cC][tT];
INTO:         [iI][nN][tT][oO];
IS:           [iI][sS];
ISOLATION:    [iI][sS][oO][lL][aA][tT][iI][oO][nN];
JAVASCRIPT:   [jJ][aA][vV][aA][sS][cC][rR][iI][pP][tT];
JOIN:         [jJ][oO][iI][nN];
KEY:          [kK][eE][yY];
KEYS:         [kK][eE][yY][sS];
KEYSPACE:     [kK][eE][yY][sS][pP][aA][cC][eE];
KNOWN:        [kK][nN][oO][wW][nN];
LANGUAGE:     [lL][aA][nN][gG][uU][aA][gG][eE];
LAST:         [lL][aA][sS][tT];
LEFT:         [lL][eE][fF][tT];
LET_:          [lL][eE][tT];
LETTING:      [lL][eE][tT][tT][iI][nN][gG];
LEVEL:        [lL][eE][vV][eE][lL];
LIKE:         [lL][iI][kK][eE];
LIMIT:        [lL][iI][mM][iI][tT];
LSM:          [lL][sS][mM];
MAP:          [mM][aA][pP];
MAPPING:      [mM][aA][pP][pP][iI][nN][gG];
MATCHED:      [mM][aA][tT][cC][hH][eE][dD];
MATERIALIZED: [mM][aA][tT][eE][rR][iI][aA][lL][iI][zZ][eE][dD];
MERGE:        [mM][eE][rR][gG][eE];
MISSING:      [mM][iI][sS][sS][iI][nN][gG];
NAMESPACE:    [nN][aA][mM][eE][sS][pP][aA][cC][eE];
NEST:         [nN][eE][sS][tT];
NL:           [nN][lL];
NO:           [nN][oO];
NOT:          [nN][oO][tT];
NTH_VALUE:    [nN][tT][hH][_][vV][aA][lL][uU][eE];
NULL:         [nN][uU][lL][lL];
NULLS:        [nN][uU][lL][lL][sS];
NUMBER:       [nN][uN][mM][bB][eE][rR];
OBJECT:       [oO][bB][jJ][eE][cC][tT];
OFFSET:       [oO][fF][fF][sS][eE][tT];
ON:           [oO][nN];
OPTION:       [oO][pP][tT][iI][oO][nN];
OPTIONS:      [oO][pP][tT][iI][oO][nN][sS];
OR:           [oO][rR];
ORDER:        [oO][rR][dD][eE][rR];
OTHERS:       [oO][tT][hH][eE][rR][sS];
OUTER:        [oO][uU][tT][eE][rR];
OVER:         [oO][vV][eE][rR];
PARSE:        [pP][aA][rR][sS][eE];
PARTITION:    [pP][aA][rR][tT][iI][tT][iI][oO][nN];
PASSWORD:     [pP][aA][sS][sS][wW][oO][rR][dD];
PATH:         [pP][aA][tT][hH];
POOL:         [pP][oO][oO][lL];
PRECEDING:    [pP][rR][eE][cC][eE][dD][iI][nN][gG];
PREPARE:      [pP][rR][eE][pP][aA][rR][eE];
PRIMARY:      [pP][rR][iI][mM][aA][rR][yY];
PRIVATE:      [pP][rR][iI][vV][aA][tT][eE];
PRIVILEGE:    [pP][rR][iI][vV][iI][lL][eE][gG][eE];
PROCEDURE:    [pP][rR][oO][cC][eE][dD][uU][rR][eE];
PROBE:        [pP][rR][oO][bB][eE];
PUBLIC:       [pP][uU][bB][lL][iI][cC];
RANGE:        [rR][aA][nN][gG][eE];
RAW:          [rR][aA][wW];
READ:         [rR][eE][aA][dD];
REALM:        [rR][eE][aA][lL][mM];
REDUCE:       [rR][eE][dD][uU][cC][eE];
RENAME:       [rR][eE][nN][aA][mM][eE];
REPLACE:      [rR][eE][pP][lL][aA][cC][eE];
RESPECT:      [rR][eE][sS][pP][eE][cC][tT];
RETURN:       [rR][eE][tT][uU][rR][nN];
RETURNING:    [rR][eE][tT][uU][rR][nN][iI][nN][gG];
REVOKE:       [rR][eE][vV][oO][kK][eE];
RIGHT:        [rR][iI][gG][hH][tT];
ROLE:         [rR][oO][lL][eE];
ROLLBACK:     [rR][oO][lL][lL][bB][aA][cC][kK];
ROW:          [rR][oO][wW];
ROWS:         [rR][oO][wW][sS];
SATISFIES:    [sS][aA][tT][iI][sS][fF][iI][eE][sS];
SAVEPOINT:    [sS][aA][vV][eE][pP][oO][iI][nN][tT];
SCHEMA:       [sS][cC][hH][eE][mM][aA];
SCOPE:        [sS][cC][oO][pP][eE];
SELECT:       [sS][eE][lL][eE][cC][tT];
SELF:         [sS][eE][lL][fF];
SET:          [sS][eE][tT];
SHOW:         [sS][hH][oO][wW];
SOME:         [sS][oO][mM][eE];
START:        [sS][tT][aA][rR][tT];
STATISTICS:   [sS][tT][aA][tT][iI][sS][tT][iI][cC][sS];
STRING:       [sS][tT][rR][iI][nN][gG];
SYSTEM:       [sS][yY][sS][tT][eE][mM];
THEN:         [tT][hH][eE][nN];
TIES:         [tT][iI][eE][sS];
TO:           [tT][oO];
TRAN:         [tT][rR][aA][nN];
TRANSACTION:  [tT][rR][aA][nN][sS][aA][cC][tT][iI][oO][nN];
TRIGGER:      [tT][rR][iI][gG][gG][eE][rR];
TRUE:         [tT][rR][uU][eE];
TRUNCATE:     [tT][rR][uU][nN][cC][aA][tT][eE];
UNBOUNDED:    [uU][nN][bB][oO][uU][nN][dD][eE][dD];
UNDER:        [uU][nN][dD][eE][rR];
UNION:        [uU][nN][iI][oO][nN];
UNIQUE:       [uU][nN][iI][qQ][uU][eE];
UNKNOWN:      [uU][nN][kK][nN][oO][wW][nN];
UNNEST:       [uU][nN][nN][eE][sS][tT];
UNSET:        [uU][nN][sS][eE][tT];
UPDATE:       [uU][pP][dD][aA][tT][eE];
UPSERT:       [uU][pP][sS][eE][rR][tT];
USE:          [uU][sS][eE];
USER:         [uU][sS][eE][rR];
USING:        [uU][sS][iI][nN][gG];
VALIDATE:     [vV][aA][lL][iI][dD][aA][tT][eE];
VALUE:        [vV][aA][lL][uU][eE];
VALUED:       [vV][aA][lL][uU][eE][dD];
VALUES:       [vV][aA][lL][uU][eE][sS];
VIA:          [vV][iI][aA];
VIEW:         [vV][iI][eE][wW];
WHEN:         [wW][hH][eE][nN];
WHERE:        [wW][hH][eE][rR][eE];
WHILE:        [wW][hH][iI][lL][eE];
WINDOW:       [wW][iI][nN][dD][oO][wW];
WITH:         [wW][iI][tT][hH];
WITHIN:       [wW][iI][tT][hH][iI][nN];
WORK:         [wW][oO][rR][kK];
XOR:          [xX][oO][rR];

fragment IdentChar:      '``' | ~[`];
fragment IdentFirstChar: [a-zA-Z_];
fragment IdentLaterChar: [a-zA-Z0-9_];

IDENT_ICASE:   '`' IdentChar+ '`i';
IDENT:         '`' IdentChar+ '`' | IdentFirstChar IdentLaterChar*;
NAMED_PARAM:  '$' IdentFirstChar IdentLaterChar*;
POSITIONAL_PARAM: '$' [1-9] [0-9]*;
NEXT_PARAM:    '?';
input: stmt_body opt_trailer
	| expr_input
	| hints_input 
;
permitted_identifiers: IDENT
	| DEFAULT
	| USER
	| USERS
	| SEQUENCE
	| VECTOR 
;
opt_trailer: 
	| opt_trailer SEMI 
;
stmt_body: advise
	| explain
	| prepare
	| execute
	| explain_function
	| stmt 
;
stmt: select_stmt
	| dml_stmt
	| ddl_stmt
	| infer
	| update_statistics
	| user_stmt
	| group_stmt
	| role_stmt
	| function_stmt
	| transaction_stmt
	| sequence_stmt 
;
advise: ADVISE opt_index stmt 
;
opt_index: 
	| INDEX 
;
explain: EXPLAIN stmt 
;
explain_function: EXPLAIN FUNCTION func_name 
;
prepare: PREPARE opt_force opt_name stmt 
;
opt_force: 
	| FORCE 
;
opt_name: 
	| permitted_identifiers from_or_as
	| p__invalid_case_insensitive_identifier from_or_as
	| STR from_or_as 
;
p__invalid_case_insensitive_identifier: IDENT_ICASE 
;
from_or_as: FROM
	| AS 
;
execute: EXECUTE expr opt_execute_using 
;
opt_execute_using: 
	| USING construction_expr 
;
infer: INFER keyspace_collection simple_keyspace_ref opt_infer_using opt_with_clause
	| INFER keyspace_path opt_as_alias opt_infer_using opt_with_clause
	| INFER expr opt_infer_using opt_with_clause 
;
keyspace_collection: KEYSPACE
	| COLLECTION 
;
opt_keyspace_collection: 
	| keyspace_collection 
;
opt_infer_using:  
;
select_stmt: fullselect 
;
dml_stmt: insert
	| upsert
	| delete_
	| update
	| merge 
;
ddl_stmt: index_stmt
	| bucket_stmt
	| scope_stmt
	| collection_stmt 
;
user_stmt: create_user
	| alter_user
	| drop_user 
;
group_stmt: create_group
	| alter_group
	| drop_group 
;
role_stmt: grant_role
	| revoke_role 
;
index_stmt: create_index
	| drop_index
	| alter_index
	| build_index 
;
bucket_stmt: create_bucket
	| alter_bucket
	| drop_bucket 
;
scope_stmt: create_scope
	| drop_scope 
;
collection_stmt: create_collection
	| drop_collection
	| flush_collection 
;
function_stmt: create_function
	| drop_function
	| execute_function 
;
transaction_stmt: start_transaction
	| commit_transaction
	| rollback_transaction
	| savepoint
	| set_transaction_isolation 
;
fullselect: select_terms opt_order_by
	| select_terms opt_order_by limit opt_offset
	| select_terms opt_order_by offset opt_limit
	| with select_terms opt_order_by
	| with select_terms opt_order_by limit opt_offset
	| with select_terms opt_order_by offset opt_limit 
;
select_terms: subselect
	| select_terms setop select_term
	| subquery_expr setop select_term 
;
select_term: subselect
	| subquery_expr 
;
subselect: from_select
	| select_from 
;
from_select: from opt_let opt_where opt_group opt_window_clause SELECT opt_optim_hints projection 
;
select_from: SELECT opt_optim_hints projection opt_from opt_let opt_where opt_group opt_window_clause 
;
setop: UNION
	| UNION ALL
	| INTERSECT
	| INTERSECT ALL
	| EXCEPT
	| EXCEPT ALL 
;
opt_optim_hints: 
	| OPTIM_HINTS 
;
hints_input: PLUS optim_hints
	| PLUS object 
;
optim_hints: optim_hint
	| optim_hints optim_hint 
;
optim_hint: permitted_identifiers
	| permitted_identifiers LPAREN opt_hint_args RPAREN
	| INDEX LPAREN opt_hint_args RPAREN 
;
opt_hint_args: 
	| hint_args 
;
hint_args: permitted_identifiers
	| permitted_identifiers DIV BUILD
	| permitted_identifiers DIV PROBE
	| hint_args permitted_identifiers 
;
projection: opt_quantifier projects opt_exclude
	| opt_quantifier raw expr opt_as_alias 
;
opt_quantifier: 
	| ALL
	| DISTINCT 
;
opt_exclude: 
	| EXCLUDE exprs 
;
raw: RAW
	| ELEMENT
	| VALUE 
;
projects: project
	| projects COMMA project 
;
project: STAR
	| expr DOT STAR
	| expr opt_as_alias 
;
opt_as_alias: 
	| as_alias 
;
as_alias: alias
	| AS alias 
;
alias: permitted_identifiers 
;
opt_from: 
	| from 
;
from: FROM from_terms 
;
from_terms: from_term
	| from_terms COMMA from_term
	| from_terms COMMA LATERAL from_term 
;
from_term: simple_from_term
	| from_term opt_join_type JOIN simple_from_term on_keys
	| from_term opt_join_type JOIN LATERAL simple_from_term on_keys
	| from_term opt_join_type JOIN simple_from_term on_key FOR permitted_identifiers
	| from_term opt_join_type JOIN LATERAL simple_from_term on_key FOR permitted_identifiers
	| from_term opt_join_type NEST simple_from_term on_keys
	| from_term opt_join_type NEST LATERAL simple_from_term on_keys
	| from_term opt_join_type NEST simple_from_term on_key FOR permitted_identifiers
	| from_term opt_join_type NEST LATERAL simple_from_term on_key FOR permitted_identifiers
	| from_term opt_join_type unnest expr opt_as_alias
	| from_term opt_join_type JOIN simple_from_term ON expr
	| from_term opt_join_type JOIN LATERAL simple_from_term ON expr
	| from_term opt_join_type NEST simple_from_term ON expr
	| from_term opt_join_type NEST LATERAL simple_from_term ON expr
	| simple_from_term RIGHT opt_outer JOIN simple_from_term ON expr
	| simple_from_term RIGHT opt_outer JOIN LATERAL simple_from_term ON expr 
;
simple_from_term: keyspace_term
	| expr opt_as_alias opt_use 
;
unnest: UNNEST
	| FLATTEN 
;
keyspace_term: keyspace_path opt_as_alias opt_use 
;
keyspace_path: namespace_term keyspace_name
	| namespace_term path_part DOT path_part DOT keyspace_name 
;
namespace_term: namespace_name
	| SYSTEM COLON 
;
namespace_name: NAMESPACE_ID COLON 
;
path_part: permitted_identifiers 
;
keyspace_name: permitted_identifiers
	| p__invalid_case_insensitive_identifier 
;
opt_use: 
	| USE use_options 
;
use_options: use_keys
	| use_index
	| join_hint
	| use_index join_hint
	| join_hint use_index
	| use_keys join_hint
	| join_hint use_keys 
;
use_keys: opt_primary KEYS expr
	| opt_primary KEYS VALIDATE expr 
;
use_index: INDEX LPAREN index_refs RPAREN 
;
join_hint: HASH LPAREN use_hash_option RPAREN
	| NL 
;
opt_primary: 
	| PRIMARY 
;
index_refs: index_ref
	| index_refs COMMA index_ref 
;
index_ref: opt_index_name opt_index_using 
;
use_hash_option: BUILD
	| PROBE 
;
opt_use_del_upd: opt_use 
;
opt_join_type: 
	| INNER
	| LEFT opt_outer 
;
opt_outer: 
	| OUTER 
;
on_keys: ON opt_primary KEYS expr
	| ON opt_primary KEYS VALIDATE expr 
;
on_key: ON opt_primary KEY expr
	| ON opt_primary KEY VALIDATE expr 
;
opt_let: 
	| let_ 
;
let_: LET_ bindings 
;
bindings: binding
	| bindings COMMA binding 
;
binding: alias EQ expr 
;
with: WITH with_list
	| WITH RECURSIVE with_list 
;
with_list: with_term
	| with_list COMMA with_term 
;
with_term: alias AS paren_expr opt_cycle_clause opt_option_clause 
;
opt_option_clause: 
	| OPTIONS object 
;
opt_cycle_clause: 
	| CYCLE exprs RESTRICT 
;
opt_where: 
	| where 
;
where: WHERE expr 
;
opt_group: 
	| group 
;
group: GROUP BY group_terms opt_group_as opt_letting opt_having
	| letting 
;
group_terms: group_term
	| group_terms COMMA group_term 
;
group_term: expr opt_as_alias 
;
opt_letting: 
	| letting 
;
letting: LETTING bindings 
;
opt_having: 
	| having 
;
having: HAVING expr 
;
opt_group_as: 
	| GROUP AS permitted_identifiers 
;
opt_order_by: 
	| order_by 
;
order_by: ORDER BY sort_terms 
;
sort_terms: sort_term
	| sort_terms COMMA sort_term 
;
sort_term: expr opt_dir opt_order_nulls 
;
opt_dir: 
	| dir 
;
dir: param_expr
	| ASC
	| DESC 
;
opt_order_nulls: 
	| NULLS FIRST
	| NULLS LAST
	| NULLS param_expr 
;
first_last: FIRST
	| LAST 
;
opt_limit: 
	| limit 
;
limit: LIMIT expr 
;
opt_offset: 
	| offset 
;
offset: OFFSET expr 
;
insert: INSERT INTO keyspace_ref opt_values_header values_list opt_returning
	| INSERT INTO keyspace_ref LPAREN key_val_options_expr_header RPAREN fullselect opt_returning 
;
simple_keyspace_ref: keyspace_name opt_as_alias
	| path_part DOT path_part opt_as_alias
	| keyspace_path opt_as_alias
	| path_part DOT path_part DOT keyspace_name opt_as_alias 
;
keyspace_ref: simple_keyspace_ref
	| param_expr opt_as_alias 
;
opt_values_header: 
	| LPAREN opt_primary KEY COMMA VALUE RPAREN
	| LPAREN opt_primary KEY COMMA VALUE COMMA OPTIONS RPAREN 
;
key: opt_primary KEY 
;
values_list: values
	| values_list COMMA next_values 
;
values: VALUES key_val_expr
	| VALUES key_val_options_expr 
;
next_values: values
	| key_val_expr
	| key_val_options_expr 
;
key_val_expr: LPAREN expr COMMA expr RPAREN 
;
key_val_options_expr: LPAREN expr COMMA expr COMMA expr RPAREN 
;
opt_returning: 
	| returning 
;
returning: RETURNING returns_ 
;
returns_: projects
	| raw expr 
;
key_expr_header: key expr 
;
value_expr_header: VALUE expr 
;
options_expr_header: OPTIONS expr 
;
key_val_options_expr_header: key_expr_header
	| key_expr_header COMMA value_expr_header
	| key_expr_header COMMA value_expr_header COMMA options_expr_header
	| key_expr_header COMMA options_expr_header 
;
upsert: UPSERT INTO keyspace_ref opt_values_header values_list opt_returning
	| UPSERT INTO keyspace_ref LPAREN key_val_options_expr_header RPAREN fullselect opt_returning 
;
delete_: DELETE_ opt_optim_hints FROM keyspace_ref opt_use_del_upd opt_let opt_where limit opt_offset opt_returning
	| DELETE_ opt_optim_hints FROM keyspace_ref opt_use_del_upd opt_let opt_where offset opt_limit opt_returning
	| DELETE_ opt_optim_hints FROM keyspace_ref opt_use_del_upd opt_let opt_where opt_returning 
;
update: UPDATE opt_optim_hints keyspace_ref opt_use_del_upd opt_let set unset opt_where opt_limit opt_returning
	| UPDATE opt_optim_hints keyspace_ref opt_use_del_upd opt_let set opt_where opt_limit opt_returning
	| UPDATE opt_optim_hints keyspace_ref opt_use_del_upd opt_let unset opt_where opt_limit opt_returning 
;
set: SET set_terms 
;
set_terms: set_term
	| set_terms COMMA set_term 
;
set_term: path EQ expr opt_update_for
	| function_meta_expr DOT path EQ expr 
;
function_meta_expr: function_name LPAREN opt_exprs RPAREN 
;
opt_update_for: 
	| update_for 
;
update_for: update_dimensions opt_when END 
;
update_dimensions: FOR update_dimension
	| update_dimensions FOR update_dimension 
;
update_dimension: update_binding
	| update_dimension COMMA update_binding 
;
update_binding: variable IN expr
	| variable WITHIN expr
	| variable COLON variable IN expr
	| variable COLON variable WITHIN expr 
;
variable: permitted_identifiers 
;
opt_when: 
	| WHEN expr 
;
unset: UNSET unset_terms 
;
unset_terms: unset_term
	| unset_terms COMMA unset_term 
;
unset_term: path opt_update_for 
;
merge: MERGE opt_optim_hints INTO simple_keyspace_ref opt_use_merge USING simple_from_term ON opt_key expr opt_let opt_merge_actions opt_limit opt_returning 
;
opt_use_merge: opt_use 
;
opt_key: 
	| key 
;
opt_merge_actions: 
	| WHEN MATCHED THEN UPDATE merge_update opt_merge_delete_insert
	| WHEN MATCHED THEN DELETE_ merge_delete opt_merge_insert
	| WHEN NOT MATCHED THEN INSERT merge_insert 
;
opt_merge_delete_insert: 
	| WHEN MATCHED THEN DELETE_ merge_delete opt_merge_insert
	| WHEN NOT MATCHED THEN INSERT merge_insert 
;
opt_merge_insert: 
	| WHEN NOT MATCHED THEN INSERT merge_insert 
;
merge_update: set opt_where
	| set unset opt_where
	| unset opt_where 
;
merge_delete: opt_where 
;
merge_insert: expr opt_where
	| key_val_expr opt_where
	| key_val_options_expr opt_where
	| LPAREN key_val_options_expr_header RPAREN opt_where 
;
create_user: CREATE USER user user_opts 
;
alter_user: ALTER USER user user_opts 
;
drop_user: DROP USER user 
;
user_opts: 
	| user_opts user_opt 
;
param_or_str: param_expr
	| STR 
;
user_opt: PASSWORD param_or_str
	| WITH STR
	| GROUPS groups
	| GROUP permitted_identifiers
	| NO GROUPS 
;
groups: permitted_identifiers
	| groups COMMA permitted_identifiers 
;
create_group: CREATE GROUP group_name group_opts 
;
alter_group: ALTER GROUP group_name group_opts 
;
drop_group: DROP GROUP group_name 
;
group_name: permitted_identifiers 
;
group_opts: 
	| group_opts group_opt 
;
group_opt: WITH STR
	| ROLES group_role_list
	| NO ROLES
	| ROLE group_role_list_item 
;
group_role_list: group_role_list_item
	| group_role_list COMMA group_role_list_item 
;
group_role_list_item: role_name
	| role_name ON keyspace_scope 
;
group_or_groups: GROUP
	| GROUPS 
;
user_users: USER
	| USERS 
;
grant_role: GRANT role_list TO user_list
	| GRANT role_list ON keyspace_scope_list TO user_list
	| GRANT role_list TO user_users user_list
	| GRANT role_list ON keyspace_scope_list TO user_users user_list
	| GRANT role_list TO group_or_groups groups
	| GRANT role_list ON keyspace_scope_list TO group_or_groups groups 
;
role_list: role_name
	| role_list COMMA role_name 
;
role_name: permitted_identifiers
	| SELECT
	| INSERT
	| UPDATE
	| DELETE_ 
;
keyspace_scope_list: keyspace_scope
	| keyspace_scope_list COMMA keyspace_scope 
;
keyspace_scope: keyspace_name
	| path_part DOT path_part
	| namespace_name keyspace_name
	| namespace_name path_part DOT path_part DOT keyspace_name
	| path_part DOT path_part DOT keyspace_name
	| namespace_name path_part DOT path_part 
;
user_list: user
	| user_list COMMA user 
;
user: permitted_identifiers
	| permitted_identifiers COLON permitted_identifiers 
;
revoke_role: REVOKE role_list FROM user_list
	| REVOKE role_list ON keyspace_scope_list FROM user_list
	| REVOKE role_list FROM user_users user_list
	| REVOKE role_list ON keyspace_scope_list FROM user_users user_list
	| REVOKE role_list FROM group_or_groups groups
	| REVOKE role_list ON keyspace_scope_list FROM group_or_groups groups 
;
opt_def_with_clause: opt_with_clause 
;
create_bucket: CREATE BUCKET permitted_identifiers opt_if_not_exists opt_def_with_clause
	| CREATE BUCKET IF NOT EXISTS permitted_identifiers opt_def_with_clause
	| CREATE DATABASE permitted_identifiers opt_if_not_exists opt_def_with_clause
	| CREATE DATABASE IF NOT EXISTS permitted_identifiers opt_def_with_clause 
;
alter_bucket: ALTER BUCKET permitted_identifiers with_clause
	| ALTER DATABASE permitted_identifiers with_clause 
;
drop_bucket: DROP BUCKET permitted_identifiers opt_if_exists
	| DROP BUCKET IF EXISTS permitted_identifiers
	| DROP DATABASE permitted_identifiers opt_if_exists
	| DROP DATABASE IF EXISTS permitted_identifiers 
;
create_scope: CREATE SCOPE named_scope_ref opt_if_not_exists
	| CREATE SCOPE IF NOT EXISTS named_scope_ref 
;
drop_scope: DROP SCOPE named_scope_ref opt_if_exists
	| DROP SCOPE IF EXISTS named_scope_ref 
;
create_collection: CREATE COLLECTION named_keyspace_ref opt_if_not_exists opt_with_clause
	| CREATE COLLECTION IF NOT EXISTS named_keyspace_ref opt_with_clause 
;
drop_collection: DROP COLLECTION named_keyspace_ref opt_if_exists
	| DROP COLLECTION IF EXISTS named_keyspace_ref 
;
flush_collection: flush_or_truncate COLLECTION named_keyspace_ref 
;
flush_or_truncate: FLUSH
	| TRUNCATE 
;
create_index: CREATE PRIMARY INDEX opt_if_not_exists ON named_keyspace_ref opt_index_partition opt_index_using opt_with_clause
	| CREATE PRIMARY INDEX index_name opt_if_not_exists ON named_keyspace_ref opt_index_partition opt_index_using opt_with_clause
	| CREATE PRIMARY INDEX IF NOT EXISTS index_name ON named_keyspace_ref opt_index_partition opt_index_using opt_with_clause
	| CREATE opt_vector INDEX index_name opt_if_not_exists ON named_keyspace_ref LPAREN index_terms RPAREN opt_index_partition opt_index_where opt_index_using opt_with_clause
	| CREATE opt_vector INDEX IF NOT EXISTS index_name ON named_keyspace_ref LPAREN index_terms RPAREN opt_index_partition opt_index_where opt_index_using opt_with_clause 
;
opt_vector: 
	| VECTOR 
;
index_name: permitted_identifiers 
;
opt_index_name: 
	| index_name 
;
opt_if_not_exists: 
	| IF NOT EXISTS 
;
named_keyspace_ref: simple_named_keyspace_ref
	| namespace_name path_part
	| path_part DOT path_part DOT keyspace_name
	| path_part DOT keyspace_name 
;
simple_named_keyspace_ref: keyspace_name
	| namespace_name path_part DOT path_part DOT keyspace_name 
;
named_scope_ref: namespace_name path_part DOT path_part
	| path_part DOT path_part
	| path_part 
;
opt_index_partition: 
	| PARTITION BY HASH LPAREN exprs RPAREN 
;
opt_index_using: 
	| index_using 
;
index_using: USING VIEW
	| USING GSI
	| USING FTS 
;
index_terms: index_term
	| index_terms COMMA index_term 
;
index_term: index_term_expr opt_ikattr 
;
index_term_expr: expr
	| all_expr 
;
all_expr: all expr
	| all DISTINCT expr
	| DISTINCT expr 
;
all: ALL
	| EACH 
;
flatten_keys_expr: expr opt_ikattr 
;
flatten_keys_exprs: flatten_keys_expr
	| flatten_keys_exprs COMMA flatten_keys_expr 
;
opt_flatten_keys_exprs: 
	| flatten_keys_exprs 
;
opt_index_where: 
	| WHERE expr 
;
opt_ikattr: 
	| ikattr
	| ikattr ikattr 
;
ikattr: ASC
	| DESC
	| INCLUDE MISSING 
;
drop_index: DROP PRIMARY INDEX opt_if_exists ON named_keyspace_ref opt_index_using
	| DROP PRIMARY INDEX index_name opt_if_exists ON named_keyspace_ref opt_index_using
	| DROP PRIMARY INDEX IF EXISTS index_name ON named_keyspace_ref opt_index_using
	| DROP opt_vector INDEX simple_named_keyspace_ref DOT index_name opt_if_exists opt_index_using
	| DROP opt_vector INDEX IF EXISTS simple_named_keyspace_ref DOT index_name opt_index_using
	| DROP opt_vector INDEX index_name opt_if_exists ON named_keyspace_ref opt_index_using
	| DROP opt_vector INDEX IF EXISTS index_name ON named_keyspace_ref opt_index_using 
;
opt_if_exists: 
	| IF EXISTS 
;
alter_index: ALTER INDEX simple_named_keyspace_ref DOT index_name opt_index_using with_clause
	| ALTER INDEX index_name ON named_keyspace_ref opt_index_using with_clause 
;
build_index: BUILD INDEX ON named_keyspace_ref LPAREN exprs RPAREN opt_index_using 
;
create_function: CREATE opt_replace FUNCTION opt_if_not_exists func_name LPAREN opt_parm_list RPAREN opt_if_not_exists func_body 
;
opt_replace: 
	| OR REPLACE 
;
func_name: short_func_name
	| long_func_name 
;
short_func_name: keyspace_name
	| path_part DOT path_part
	| path_part DOT path_part DOT path_part 
;
long_func_name: namespace_term keyspace_name
	| namespace_term path_part DOT path_part DOT keyspace_name 
;
opt_parm_list: 
	| DOT DOT DOT
	| parameter_terms 
;
parameter_terms: permitted_identifiers
	| parameter_terms COMMA permitted_identifiers 
;
func_body: LBRACE expr RBRACE
	| LANGUAGE INLINE AS expr
	| LANGUAGE JAVASCRIPT AS STR
	| LANGUAGE JAVASCRIPT AS STR AT STR
	| LANGUAGE GOLANG AS STR AT STR 
;
drop_function: DROP FUNCTION func_name opt_if_exists
	| DROP FUNCTION IF EXISTS func_name 
;
execute_function: EXECUTE FUNCTION func_name LPAREN opt_exprs RPAREN 
;
update_statistics: UPDATE STATISTICS opt_for named_keyspace_ref LPAREN update_stat_terms RPAREN opt_with_clause
	| UPDATE STATISTICS opt_for named_keyspace_ref DELETE_ LPAREN update_stat_terms RPAREN
	| UPDATE STATISTICS opt_for named_keyspace_ref DELETE_ ALL
	| UPDATE STATISTICS opt_for named_keyspace_ref INDEX LPAREN exprs RPAREN opt_index_using opt_with_clause
	| UPDATE STATISTICS opt_for named_keyspace_ref INDEX ALL opt_index_using opt_with_clause
	| UPDATE STATISTICS FOR INDEX simple_named_keyspace_ref DOT index_name opt_index_using opt_with_clause
	| UPDATE STATISTICS FOR INDEX index_name ON named_keyspace_ref opt_index_using opt_with_clause
	| ANALYZE opt_keyspace_collection named_keyspace_ref LPAREN update_stat_terms RPAREN opt_with_clause
	| ANALYZE opt_keyspace_collection named_keyspace_ref DELETE_ STATISTICS LPAREN update_stat_terms RPAREN
	| ANALYZE opt_keyspace_collection named_keyspace_ref DELETE_ STATISTICS
	| ANALYZE opt_keyspace_collection named_keyspace_ref INDEX LPAREN exprs RPAREN opt_index_using opt_with_clause
	| ANALYZE opt_keyspace_collection named_keyspace_ref INDEX ALL opt_index_using opt_with_clause
	| ANALYZE INDEX simple_named_keyspace_ref DOT index_name opt_index_using opt_with_clause
	| ANALYZE INDEX index_name ON named_keyspace_ref opt_index_using opt_with_clause 
;
opt_for: 
	| FOR 
;
update_stat_terms: update_stat_term
	| update_stat_terms COMMA update_stat_term 
;
update_stat_term: index_term_expr 
;
path: permitted_identifiers
	| path DOT permitted_identifiers
	| path DOT ident_icase
	| path DOT LBRACKET expr RBRACKET
	| path DOT LBRACKET expr RBRACKET_ICASE
	| path LBRACKET expr RBRACKET 
;
ident: permitted_identifiers 
;
ident_icase: IDENT_ICASE 
;
expr: c_expr
	| expr DOT ident LPAREN opt_exprs RPAREN
	| expr DOT ident
	| expr DOT ident_icase
	| expr DOT LBRACKET expr RBRACKET
	| expr DOT LBRACKET expr RBRACKET_ICASE
	| expr LBRACKET RANDOM_ELEMENT RBRACKET
	| expr LBRACKET expr RBRACKET
	| expr LBRACKET expr COLON RBRACKET
	| expr LBRACKET expr COLON expr RBRACKET
	| expr LBRACKET COLON expr RBRACKET
	| expr LBRACKET COLON RBRACKET
	| expr LBRACKET RBRACKET
	| expr LBRACKET STAR RBRACKET
	| expr PLUS expr
	| expr MINUS expr
	| expr STAR expr
	| expr DIV expr
	| expr MOD expr
	| expr POW expr
	| expr CONCAT expr
	| expr AND expr
	| expr OR expr
	| NOT expr
	| expr EQ expr
	| expr DEQ expr
	| expr NE expr
	| expr LT expr
	| expr GT expr
	| expr LE expr
	| expr GE expr
	| expr BETWEEN b_expr AND b_expr
	| expr NOT BETWEEN b_expr AND b_expr
	| expr LIKE expr ESCAPE expr
	| expr LIKE expr
	| expr NOT LIKE expr ESCAPE expr
	| expr NOT LIKE expr
	| expr IN expr
	| expr NOT IN expr
	| expr WITHIN expr
	| expr NOT WITHIN expr
	| expr IS NULL
	| expr IS NOT NULL
	| expr IS MISSING
	| expr IS NOT MISSING
	| expr IS valued
	| expr IS NOT UNKNOWN
	| expr IS NOT valued
	| expr IS UNKNOWN
	| expr IS DISTINCT FROM expr
	| expr IS NOT DISTINCT FROM expr
	| EXISTS expr 
;
valued: VALUED
	| KNOWN 
;
c_expr: literal
	| sequence_expr
	| construction_expr
	| permitted_identifiers
	| IDENT_ICASE
	| SELF
	| param_expr
	| function_expr
	| MINUS expr
	| case_expr
	| collection_expr
	| paren_expr
	| T__COVER LPAREN expr RPAREN
	| T__INDEX_KEY LPAREN expr RPAREN
	| T__INDEX_CONDITION LPAREN expr RPAREN
	| CURRENT USER 
;
b_expr: c_expr
	| b_expr DOT permitted_identifiers LPAREN opt_exprs RPAREN
	| b_expr DOT permitted_identifiers
	| b_expr DOT ident_icase
	| b_expr DOT LBRACKET expr RBRACKET
	| b_expr DOT LBRACKET expr RBRACKET_ICASE
	| b_expr LBRACKET expr RBRACKET
	| b_expr LBRACKET expr COLON RBRACKET
	| b_expr LBRACKET COLON expr RBRACKET
	| b_expr LBRACKET expr COLON expr RBRACKET
	| b_expr LBRACKET COLON RBRACKET
	| b_expr LBRACKET STAR RBRACKET
	| b_expr PLUS b_expr
	| b_expr MINUS b_expr
	| b_expr STAR b_expr
	| b_expr DIV b_expr
	| b_expr MOD b_expr
	| b_expr POW b_expr
	| b_expr CONCAT b_expr 
;
literal: NULL
	| MISSING
	| FALSE
	| TRUE
	| NUM
	| INT
	| STR 
;
construction_expr: object
	| array 
;
object: LBRACE opt_members RBRACE 
;
opt_members: 
	| members 
;
members: member
	| members COMMA member 
;
member: expr COLON expr
	| expr opt_as_alias 
;
array: LBRACKET opt_exprs RBRACKET 
;
opt_exprs: 
	| exprs 
;
exprs: expr
	| exprs COMMA expr 
;
param_expr: NAMED_PARAM
	| POSITIONAL_PARAM
	| NEXT_PARAM 
;
case_expr: CASE simple_or_searched_case END 
;
simple_or_searched_case: simple_case
	| searched_case 
;
simple_case: expr when_thens opt_else 
;
when_thens: WHEN expr THEN expr
	| when_thens WHEN expr THEN expr 
;
searched_case: when_thens opt_else 
;
opt_else: 
	| ELSE expr 
;
function_expr: FLATTEN_KEYS LPAREN opt_flatten_keys_exprs RPAREN
	| NTH_VALUE LPAREN exprs RPAREN opt_from_first_last opt_nulls_treatment window_function_details
	| function_name LPAREN opt_exprs RPAREN opt_filter opt_nulls_treatment opt_window_function
	| function_name LPAREN agg_quantifier expr RPAREN opt_filter opt_window_function
	| function_name LPAREN STAR RPAREN opt_filter opt_window_function
	| long_func_name LPAREN opt_exprs RPAREN 
;
function_name: ident
	| REPLACE 
;
collection_expr: collection_cond
	| collection_xform 
;
collection_cond: ANY coll_bindings satisfies END
	| SOME coll_bindings satisfies END
	| EVERY coll_bindings satisfies END
	| ANY AND EVERY coll_bindings satisfies END
	| SOME AND EVERY coll_bindings satisfies END 
;
coll_bindings: coll_binding
	| coll_bindings COMMA coll_binding 
;
coll_binding: variable IN expr
	| variable WITHIN expr
	| variable COLON variable IN expr
	| variable COLON variable WITHIN expr 
;
satisfies: SATISFIES expr 
;
collection_xform: ARRAY expr FOR coll_bindings opt_when END
	| FIRST expr FOR coll_bindings opt_when END
	| OBJECT expr COLON expr FOR coll_bindings opt_when END 
;
paren_expr: LPAREN expr RPAREN
	| LPAREN all_expr RPAREN
	| subquery_expr 
;
subquery_expr: T__CORRELATED LPAREN fullselect RPAREN
	| LPAREN fullselect RPAREN 
;
expr_input: expr
	| all_expr 
;
opt_window_clause: 
	| WINDOW window_list 
;
window_list: window_term
	| window_list COMMA window_term 
;
window_term: permitted_identifiers AS window_specification 
;
window_specification: LPAREN opt_window_name opt_window_partition opt_order_by opt_window_frame RPAREN 
;
opt_window_name: 
	| permitted_identifiers 
;
opt_window_partition: 
	| PARTITION BY exprs 
;
opt_window_frame: 
	| window_frame_modifier window_frame_extents opt_window_frame_exclusion 
;
window_frame_modifier: ROWS
	| RANGE
	| GROUPS 
;
opt_window_frame_exclusion: 
	| EXCLUDE NO OTHERS
	| EXCLUDE CURRENT ROW
	| EXCLUDE TIES
	| EXCLUDE GROUP 
;
window_frame_extents: window_frame_extent
	| BETWEEN window_frame_extent AND window_frame_extent 
;
window_frame_extent: UNBOUNDED PRECEDING
	| UNBOUNDED FOLLOWING
	| CURRENT ROW
	| expr window_frame_valexpr_modifier 
;
window_frame_valexpr_modifier: PRECEDING
	| FOLLOWING 
;
opt_nulls_treatment: 
	| nulls_treatment 
;
nulls_treatment: RESPECT NULLS
	| IGNORE NULLS 
;
opt_from_first_last: 
	| FROM first_last 
;
agg_quantifier: ALL
	| DISTINCT 
;
opt_filter: 
	| FILTER LPAREN where RPAREN 
;
opt_window_function: 
	| window_function_details 
;
window_function_details: OVER permitted_identifiers
	| OVER window_specification 
;
start_transaction: start_or_begin transaction opt_isolation_level 
;
commit_transaction: COMMIT opt_transaction 
;
rollback_transaction: ROLLBACK opt_transaction opt_savepoint 
;
start_or_begin: START
	| BEGIN 
;
opt_transaction: 
	| transaction 
;
transaction: TRAN
	| TRANSACTION
	| WORK 
;
opt_savepoint: 
	| TO SAVEPOINT savepoint_name 
;
savepoint_name: permitted_identifiers 
;
opt_isolation_level: 
	| isolation_level 
;
isolation_level: ISOLATION LEVEL isolation_val 
;
isolation_val: READ COMMITTED 
;
set_transaction_isolation: SET TRANSACTION isolation_level 
;
savepoint: SAVEPOINT savepoint_name 
;
opt_with_clause: 
	| with_clause 
;
with_clause: WITH expr 
;
opt_namespace_name: 
	| namespace_name 
;
sequence_object_name: permitted_identifiers
	| p__invalid_case_insensitive_identifier 
;
sequence_full_name: opt_namespace_name sequence_object_name
	| opt_namespace_name path_part DOT path_part DOT sequence_object_name
	| opt_namespace_name path_part DOT sequence_object_name 
;
sequence_stmt: create_sequence
	| drop_sequence
	| alter_sequence 
;
create_sequence: CREATE SEQUENCE sequence_name_options opt_seq_create_options 
;
sequence_name_options: sequence_name_option
	| sequence_name_options sequence_name_option 
;
sequence_name_option: IF NOT EXISTS
	| sequence_full_name 
;
opt_seq_create_options: 
	| opt_seq_create_options seq_create_option 
;
seq_create_option: sequence_with
	| start_with
	| increment_by
	| maxvalue
	| minvalue
	| cycle
	| cache 
;
drop_sequence: DROP SEQUENCE sequence_full_name opt_if_exists
	| DROP SEQUENCE IF EXISTS sequence_full_name 
;
alter_sequence: ALTER SEQUENCE sequence_full_name with_clause
	| ALTER SEQUENCE sequence_full_name seq_alter_options 
;
seq_alter_options: seq_alter_option
	| seq_alter_options seq_alter_option 
;
seq_alter_option: restart_with
	| increment_by
	| maxvalue
	| minvalue
	| cycle
	| cache 
;
sequence_with: WITH expr 
;
start_with: START WITH expr 
;
restart_with: RESTART
	| RESTART WITH expr 
;
increment_by: INCREMENT BY expr 
;
maxvalue: NO MAXVALUE
	| MAXVALUE expr 
;
minvalue: NO MINVALUE
	| MINVALUE expr 
;
cycle: NO CYCLE
	| CYCLE 
;
cache: NO CACHE
	| CACHE expr 
;
sequence_next: NEXTVAL FOR NAMESPACE_ID COLON permitted_identifiers
	| NEXT VALUE FOR NAMESPACE_ID COLON permitted_identifiers
	| NEXTVAL FOR permitted_identifiers
	| NEXT VALUE FOR permitted_identifiers 
;
sequence_prev: PREVVAL FOR NAMESPACE_ID COLON permitted_identifiers
	| PREV VALUE FOR NAMESPACE_ID COLON permitted_identifiers
	| PREVVAL FOR permitted_identifiers
	| PREV VALUE FOR permitted_identifiers 
;
sequence_expr: sequence_next
	| sequence_prev 
;
