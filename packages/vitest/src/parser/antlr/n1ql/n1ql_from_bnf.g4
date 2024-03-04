grammar n1ql;

options { caseInsensitive = true; }

fragment SingleStringCharacter:   '\'\'' | '\\\'' | '\\' ~['] | ~['\r\n\\];
fragment DoubleStringCharacter:   '\\"'  | '\\' ~["] | ~["\\];

DQUOTE: '"';
SQUOTE: '\'';

STR:           SQUOTE SingleStringCharacter* SQUOTE
|              DQUOTE DoubleStringCharacter* DQUOTE;

fragment NumStart: '0' | [1-9];
fragment Digit:    [0-9];

fragment Int:      '0' | NumStart Digit*;
fragment Exponent: 'e'[+-]? Digit+;

INT:           Int;

NUM:           Int '.' Digit+ Exponent? | Int Exponent;
BLOCK_COMMENT: '/*' .*? '*/';

LINE_COMMENT:  '--' ~[\n\r]*;
WHITESPACE:    [ \t\n\r\f\u00a0]+ -> skip;
DOT:           '.';
PLUS:          '+';
MINUS:         '-' | 'minus';
ASTERISK:      '*';
SLASH:         '/';
PERCENT:       '%';
DOUBLE_EQUAL:           '==';
EQUAL:            '=';
NOT_EQUAL:            '!=';
LESSTHAN_OR_MORETHAN: '<>';
LESSTHAN:            '<';
LESSTHAN_OR_EQUAL:            '<=';
MORETHAN:            '>';
MORETHAN_OR_EQUAL:            '>=';
CONCAT:        '||';
LPAREN:        '(';
RPAREN:        ')';
LBRACE:        '{';
RBRACE:        '}';
COMMA:         ',';
COLON:         ':';
LBRACKET:      '[';
RBRACKET:      ']';
RBRACKET_ICASE options { caseInsensitive = false; } : ']i';
SEMICOLON:     ';';
NOT_A_TOKEN:   '!';
BACKTICK:	   '`';

NAMESPACE_ID: 'default';

ADVISE:       'ADVISE';
ALL:          'ALL';
ALTER:        'ALTER';
ANALYZE:      'ANALYZE';
AND:          'AND';
ANY:          'ANY';
ARRAY:        'ARRAY';
AS:           'AS';
ASC:          'ASC';
AT:           'AT';
BEGIN:        'BEGIN';
BETWEEN:      'BETWEEN';
BINARY:       'BINARY';
BOOLEAN:      'BOOLEAN';
BREAK:        'BREAK';
BUCKET:       'BUCKET';
BUILD:        'BUILD';
BY:           'BY';
CALL:         'CALL';
CASE:         'CASE';
CAST:         'CAST';
CLUSTER:      'CLUSTER';
COLLATE:      'COLLATE';
COLLECTION:   'COLLECTION';
COMMIT:       'COMMIT';
COMMITTED:    'COMMITTED';
CONNECT:      'CONNECT';
CONTINUE:     'CONTINUE';
CORRELATED:   'CORRELATED';
COVER:        'COVER';
CREATE:       'CREATE';
CURRENT:      'CURRENT';
DATABASE:     'DATABASE';
DATASET:      'DATASET';
DATASTORE:    'DATASTORE';
DECLARE:      'DECLARE';
DECREMENT:    'DECREMENT';
DELETE_:      'DELETE_';
DERIVED:      'DERIVED';
DESC:         'DESC';
DESCRIBE:     'DESCRIBE';
DISTINCT:     'DISTINCT';
DO:           'DO';
DROP:         'DROP';
EACH:         'EACH';
ELEMENT:      'ELEMENT';
ELSE:         'ELSE';
END:          'END';
EVERY:        'EVERY';
EXCEPT:       'EXCEPT';
EXCLUDE:      'EXCLUDE';
EXECUTE:      'EXECUTE';
EXISTS:       'EXISTS';
EXPLAIN:      'EXPLAIN';
FALSE:        'FALSE';
FETCH:        'FETCH';
FILTER:       'FILTER';
FIRST:        'FIRST';
FLATTEN:      'FLATTEN';
FLUSH:        'FLUSH';
FOLLOWING:    'FOLLOWING';
FOR:          'FOR';
FORCE:        'FORCE';
FROM:         'FROM';
FTS:          'FTS';
FUNCTION:     'FUNCTION';
GOLANG:       'GOLANG';
GRANT:        'GRANT';
GROUP:        'GROUP';
GROUPS:       'GROUPS';
GSI:          'GSI';
HASH:         'HASH';
HAVING:       'HAVING';
IF:           'IF';
IGNORE:       'IGNORE';
ILIKE:        'ILIKE';
IN:           'IN';
INCLUDE:      'INCLUDE';
INCREMENT:    'INCREMENT';
INDEX:        'INDEX';
INFER:        'INFER';
INLINE:       'INLINE';
INNER:        'INNER';
INSERT:       'INSERT';
INTERSECT:    'INTERSECT';
INTO:         'INTO';
IS:           'IS';
ISOLATION:    'ISOLATION';
JAVASCRIPT:   'JAVASCRIPT';
JOIN:         'JOIN';
KEY:          'KEY';
KEYS:         'KEYS';
KEYSPACE:     'KEYSPACE';
KNOWN:        'KNOWN';
LANGUAGE:     'LANGUAGE';
LAST:         'LAST';
LEFT:         'LEFT';
LET_:          'LET_';
LETTING:      'LETTING';
LEVEL:        'LEVEL';
LIKE:         'LIKE';
LIMIT:        'LIMIT';
LSM:          'LSM';
MAP:          'MAP';
MAPPING:      'MAPPING';
MATCHED:      'MATCHED';
MATERIALIZED: 'MATERIALIZED';
MERGE:        'MERGE';
MISSING:      'MISSING';
NAMESPACE:    'NAMESPACE';
NEST:         'NEST';
NL:           'NL';
NO:           'NO';
NOT:          'NOT';
NTH_VALUE:    'NTH_VALUE';
NULL:         'NULL';
NULLS:        'NULLS';
NUMBER:       'NUMBER';
OBJECT:       'OBJECT';
OFFSET:       'OFFSET';
ON:           'ON';
OPTION:       'OPTION';
OPTIONS:      'OPTIONS';
OR:           'OR';
ORDER:        'ORDER';
OTHERS:       'OTHERS';
OUTER:        'OUTER';
OVER:         'OVER';
PARSE:        'PARSE';
PARTITION:    'PARTITION';
PASSWORD:     'PASSWORD';
PATH:         'PATH';
POOL:         'POOL';
PRECEDING:    'PRECEDING';
PREPARE:      'PREPARE';
PRIMARY:      'PRIMARY';
PRIVATE:      'PRIVATE';
PRIVILEGE:    'PRIVILEGE';
PROCEDURE:    'PROCEDURE';
PROBE:        'PROBE';
PUBLIC:       'PUBLIC';
RANGE:        'RANGE';
RAW:          'RAW';
READ:         'READ';
REALM:        'REALM';
REDUCE:       'REDUCE';
RENAME:       'RENAME';
REPLACE:      'REPLACE';
RESPECT:      'RESPECT';
RETURN:       'RETURN';
RETURNING:    'RETURNING';
REVOKE:       'REVOKE';
RIGHT:        'RIGHT';
ROLE:         'ROLE';
ROLLBACK:     'ROLLBACK';
ROW:          'ROW';
ROWS:         'ROWS';
SATISFIES:    'SATISFIES';
SAVEPOINT:    'SAVEPOINT';
SCHEMA:       'SCHEMA';
SCOPE:        'SCOPE';
SELECT:       'SELECT';
SELF:         'SELF';
SET:          'SET';
SHOW:         'SHOW';
SOME:         'SOME';
START:        'START';
STATISTICS:   'STATISTICS';
STRING:       'STRING';
SYSTEM:       'SYSTEM';
THEN:         'THEN';
TIES:         'TIES';
TO:           'TO';
TRAN:         'TRAN';
TRANSACTION:  'TRANSACTION';
TRIGGER:      'TRIGGER';
TRUE:         'TRUE';
TRUNCATE:     'TRUNCATE';
UNBOUNDED:    'UNBOUNDED';
UNDER:        'UNDER';
UNION:        'UNION';
UNIQUE:       'UNIQUE';
UNKNOWN:      'UNKNOWN';
UNNEST:       'UNNEST';
UNSET:        'UNSET';
UPDATE:       'UPDATE';
UPSERT:       'UPSERT';
USE:          'USE';
USER:         'USER';
USING:        'USING';
VALIDATE:     'VALIDATE';
VALUE:        'VALUE';
VALUED:       'VALUED';
VALUES:       'VALUES';
VIA:          'VIA';
VIEW:         'VIEW';
WHEN:         'WHEN';
WHERE:        'WHERE';
WHILE:        'WHILE';
WINDOW:       'WINDOW';
WITH:         'WITH';
WITHIN:       'WITHIN';
WORK:         'WORK';
XOR:          'XOR';

fragment IdentChar:      '``' | ~[`];
fragment IdentFirstChar: [a-z_];
fragment IdentLaterChar: [a-z0-9_];

IDENT_ICASE options { caseInsensitive = false; } :   '`' IdentChar+ '`i';
IDENTIFIER: '`' IdentChar+ '`' | IdentFirstChar IdentLaterChar*;
NAMED_PARAM: '$' IdentFirstChar IdentLaterChar*;
POSITIONAL_PARAM: '$' [1-9] [0-9]*;
NEXT_PARAM: '?';

INFER_OPTIONS_SAMPLE_SIZE_NAME options { caseInsensitive = false; } : 'sample_size';
INFER_OPTIONS_SAMPLE_SIZE_PROP : (DQUOTE INFER_OPTIONS_SAMPLE_SIZE_NAME DQUOTE) | (SQUOTE INFER_OPTIONS_SAMPLE_SIZE_NAME SQUOTE);

///////////
// RULES //
///////////

statement_sequence : statement ( SEMICOLON statement )* SEMICOLON?;

statement : dcl_statement |
              ddl_statement |
              dml_statement |
              dql_statement |
              tcl_statement |
              utility_statement
              ;

ddl_statement : create_statement
                | drop_statement
                | other_statement
                ;

create_statement : create_scope
                   | create_collection
                   | create_primary_index
                   | create_index
                   | create_function
                   ;

drop_statement : drop_scope
                 | drop_collection
                 | drop_primary_index
                 | drop_index
                 | drop_function
                 ;

other_statement : alter_index
                  | build_index
                  | execute_function
                  ;


create_scope : CREATE SCOPE ( namespace_ref COLON )? bucket_ref DOT scope_ref ( IF NOT EXISTS )?;

create_collection : CREATE COLLECTION ( ( namespace_ref COLON )? bucket_ref DOT scope_ref DOT )?
                      collection_ref ( IF NOT EXISTS )?;



drop_scope : DROP SCOPE ( namespace_ref COLON )? bucket_ref DOT scope_ref ( IF EXISTS )?;



drop_collection : DROP COLLECTION ( ( namespace_ref COLON )? bucket_ref DOT scope_ref DOT )?
                    collection_ref ( IF EXISTS )?;


create_primary_index : CREATE PRIMARY INDEX index_name? ( IF NOT EXISTS )?
                         ON keyspace_ref index_using? index_with?;

index_using : USING GSI;

index_with : WITH expr;

create_index : CREATE INDEX index_name ( IF NOT EXISTS )? ON keyspace_ref
                 LPAREN index_key lead_key_attribs? ( ( COMMA index_key key_attribs? )+ )? RPAREN
                 index_partition? where_clause? index_using? index_with?;

index_key : expr | array_expr;

lead_key_attribs : index_order include_missing? | include_missing index_order?;

key_attribs : index_order;

include_missing : INCLUDE MISSING;

index_order : ASC | DESC;

array_expr : full_array_expr | simple_array_expr;

full_array_expr : ( ALL | DISTINCT ) ARRAY expr
                    FOR var ( IN | WITHIN ) expr
                    ( COMMA var ( IN | WITHIN ) expr )* ( WHEN cond )? END;

simple_array_expr : ( ALL | DISTINCT ) expr;

pairs_function : PAIRS LPAREN ( SELF | index_key_object ) RPAREN;

index_key_object : expr;

index_partition : PARTITION BY HASH LPAREN partition_key_expr
                    ( COMMA partition_key_expr )* RPAREN;

partition_key_expr : expr;


alter_index : ALTER INDEX ( index_path DOT index_name | index_name ON keyspace_ref )
                index_using? index_with;

build_index : BUILD INDEX ON keyspace_ref LPAREN index_term ( COMMA index_term )* RPAREN
                index_using?;

index_term : index_name | subquery_expr;


drop_primary_index : DROP PRIMARY INDEX ( IF EXISTS )? ON keyspace_ref
                       index_using?;

drop_index : DROP INDEX ( index_path DOT index_name ( IF EXISTS )? |
                index_name ( IF EXISTS )? ON keyspace_ref ) index_using?;

index_path : keyspace_full | keyspace_prefix | keyspace_partial;

keyspace_full : namespace_ref COLON bucket_ref DOT scope_ref DOT collection_ref;

keyspace_prefix : ( namespace_ref COLON )? bucket_ref;

create_function : create_function_inline | create_function_external;

create_function_inline : CREATE ( OR REPLACE )? FUNCTION function_ref LPAREN params? RPAREN
                           ( IF NOT EXISTS )?
                           ( LBRACE body RBRACE | LANGUAGE INLINE AS body );

create_function_external : CREATE ( OR REPLACE )? FUNCTION function_ref LPAREN params? RPAREN
                             ( IF NOT EXISTS )?
                             LANGUAGE JAVASCRIPT AS obj AT;

function_ref : ( namespace_ref COLON ( bucket_ref DOT scope_ref DOT )? )? identifier_ref;

params : identifier_or_star ( COMMA identifier_or_star )* | ELLIPSIS;

body : expr;

obj : str;

drop_function : DROP FUNCTION function_ref ( IF EXISTS )?;

execute_function : EXECUTE FUNCTION function_ref LPAREN ( expr ( COMMA expr )* )? RPAREN;

dml_statement : delete_statement
                | insert_statement
                | merge_statement
                | update_statement
                | upsert_statement;



delete_statement : DELETE FROM target_keyspace use_keys_clause? where_clause?
            limit_clause? returning_clause?;

insert_statement : INSERT INTO target_keyspace ( insert_values | insert_select )
            returning_clause?;

insert_options : LBRACE ( 'expiration' COLON expr )? RBRACE;

insert_values :
	| (
		(LPAREN PRIMARY? KEY COMMA VALUE COMMA OPTIONS RPAREN )?
		VALUES  LPAREN key_expr COMMA value_expr COMMA insert_options RPAREN
		( COMMA VALUES? LPAREN key_expr COMMA value_expr COMMA insert_options RPAREN )*
	  )
	| (

		( LPAREN PRIMARY? KEY COMMA VALUE RPAREN )?
		VALUES  LPAREN key_expr COMMA value_expr RPAREN
		( COMMA VALUES? LPAREN key_expr COMMA value_expr RPAREN )*
	  )
;

insert_select : LPAREN PRIMARY? KEY key_expr ( COMMA VALUE value_expr )?
                   ( COMMA OPTIONS insert_options )? RPAREN select_statement
                   ;


merge_statement : MERGE INTO ( ansi_merge | lookup_merge ) limit_clause? returning_clause?;

ansi_merge : target_keyspace use_index_clause USING ansi_merge_source
               ansi_merge_predicate ansi_merge_actions;

ansi_merge_source : ( merge_source_keyspace | merge_source_subquery | merge_source_expr )
                      ansi_join_hints?;

ansi_merge_predicate : ON expr;

ansi_merge_actions : merge_update? merge_delete? ansi_merge_insert?;

ansi_merge_insert : WHEN NOT MATCHED THEN INSERT LPAREN KEY? key_expr
                    ( COMMA VALUE? value_expr )? ( COMMA OPTIONS? insert_options )? RPAREN where_clause?;

lookup_merge : target_keyspace USING lookup_merge_source lookup_merge_predicate
                 lookup_merge_actions;

lookup_merge_source : merge_source_keyspace use_clause? |
                        merge_source_subquery |
                        merge_source_expr;

lookup_merge_predicate : ON PRIMARY? KEY expr;

lookup_merge_actions : merge_update? merge_delete? lookup_merge_insert?;

lookup_merge_insert : WHEN NOT MATCHED THEN INSERT expr where_clause?;

merge_source_keyspace : keyspace_ref ( AS? alias )?;

merge_source_subquery : subquery_expr AS? alias;

merge_source_expr : expr ( AS? alias )?;

merge_update : WHEN MATCHED THEN UPDATE set_clause? unset_clause? where_clause?;

merge_delete : WHEN MATCHED THEN DELETE where_clause?;

update_statement : UPDATE target_keyspace use_keys_clause? set_clause? unset_clause?
            where_clause? limit_clause? returning_clause?;


upsert_statement : UPSERT INTO target_keyspace ( insert_values | insert_select )
            returning_clause?;


target_keyspace : keyspace_ref ( AS? alias )?;

returning_clause : RETURNING (result_expr (COMMA result_expr)* |
                    (RAW | ELEMENT | VALUE) expr);

set_clause : SET ( path EQUAL expr update_for? )
               ( COMMA (  path EQUAL expr update_for? ) )*;

unset_clause : UNSET path update_for? (COMMA path update_for?)*;

update_for : (FOR (name_var COLON)? var (IN | WITHIN) path
               (COMMA (name_var COLON)? var (IN | WITHIN) path)* )+
               (WHEN cond)? END;
/* end::update_for[] */

key_expr : expr;
value_expr : expr;

/* Data Query Language */

dql_statement : select_statement |
                  infer_statement |
                  update_statistics;

/***************
 * N1QL SELECT *
 ***************/

select_statement : select_term ( set_op select_term )* order_by_clause? limit_clause? offset_clause?;

select_term : subselect | LPAREN select_statement RPAREN;

subselect : select_from | from_select;

select_from : with_clause? select_clause from_clause? let_clause? where_clause? group_by_clause? window_clause?;

from_select : with_clause? from_clause let_clause? where_clause? group_by_clause? window_clause? select_clause;

set_op : ( UNION | INTERSECT | EXCEPT ) ALL?;



with_clause : WITH alias AS LPAREN ( select_statement | expr ) RPAREN
                 ( COMMA alias AS LPAREN ( select_statement | expr ) RPAREN )*;

alias : identifier_ref;


select_clause : SELECT hint_comment? projection;

projection : ( ALL | DISTINCT )? ( result_expr ( COMMA result_expr )* |
               ( RAW | ELEMENT | VALUE ) expr ( AS? alias )? );

result_expr : ( path DOT )? ASTERISK | expr ( AS? alias )?;

path : identifier_ref ( LBRACKET expr RBRACKET )* ( DOT identifier_ref ( LBRACKET expr RBRACKET )* )*;



from_clause : FROM from_terms;

from_terms : ( from_keyspace | from_subquery | from_generic )
               ( join_clause | nest_clause | unnest_clause )* comma_separated_join*;

from_keyspace : keyspace_ref ( AS? alias )? use_clause?;

keyspace_ref : keyspace_path | keyspace_partial;

keyspace_path : ( namespace_ref COLON )? bucket_ref ( DOT scope_ref DOT collection_ref )?;

keyspace_partial : collection_ref;

namespace_ref : identifier_ref;

bucket_ref : identifier_ref;

scope_ref : identifier_ref;

collection_ref : identifier_ref;

from_subquery : subquery_expr AS? alias;

subquery_expr : LPAREN select_statement RPAREN;

from_generic : expr ( AS alias )?;



join_clause : ansi_join_clause | lookup_join_clause | index_join_clause;



ansi_join_clause : ansi_join_type? JOIN ansi_join_rhs ansi_join_predicate;

ansi_join_type : INNER | ( LEFT | RIGHT ) OUTER?;

ansi_join_rhs : rhs_keyspace | rhs_subquery | rhs_generic;

rhs_keyspace : keyspace_ref ( AS? alias )? ansi_join_hints?;

rhs_subquery : subquery_expr AS? alias;

rhs_generic : expr ( AS? alias )?;

ansi_join_hints : use_hash_hint | use_nl_hint | multiple_hints;

use_hash_hint : USE use_hash_term;

use_hash_term : HASH LPAREN ( BUILD | PROBE ) RPAREN;

use_nl_hint : USE use_nl_term;

use_nl_term : NL;

multiple_hints : USE ( ansi_hint_terms other_hint_terms |
                           other_hint_terms ansi_hint_terms );

ansi_hint_terms : use_hash_term | use_nl_term;

other_hint_terms : use_index_term | use_keys_term;

ansi_join_predicate : ON expr;



lookup_join_clause : lookup_join_type? JOIN lookup_join_rhs lookup_join_predicate;

lookup_join_type : INNER | ( LEFT OUTER? );

lookup_join_rhs : keyspace_ref ( AS? alias )?;

lookup_join_predicate : ON PRIMARY? KEYS expr;



index_join_clause : index_join_type? JOIN index_join_rhs index_join_predicate;

index_join_type : INNER | ( LEFT OUTER? );

index_join_rhs : keyspace_ref ( AS? alias )?;

index_join_predicate : ON PRIMARY? KEY expr FOR alias;



comma_separated_join : COMMA ( rhs_keyspace | rhs_subquery | rhs_generic );



nest_clause : ansi_nest_clause | lookup_nest_clause | index_nest_clause;



ansi_nest_clause : ansi_nest_type? NEST ansi_nest_rhs ansi_nest_predicate;

ansi_nest_type : INNER | ( LEFT OUTER? );

ansi_nest_rhs : keyspace_ref ( AS? alias )?;

ansi_nest_predicate : ON expr;



lookup_nest_clause : lookup_nest_type? NEST lookup_nest_rhs lookup_nest_predicate;

lookup_nest_type : INNER | ( LEFT OUTER? );

lookup_nest_rhs : keyspace_ref ( AS? alias )?;

lookup_nest_predicate : ON KEYS expr;



index_nest_clause : index_nest_type? NEST index_nest_rhs index_nest_predicate;

index_nest_type : INNER | ( LEFT OUTER? );

index_nest_rhs : keyspace_ref ( AS? alias )?;

index_nest_predicate : ON KEY expr FOR alias;



unnest_clause : unnest_type? ( UNNEST | FLATTEN ) expr ( AS? alias )?;

unnest_type : INNER | ( LEFT OUTER? );

use_clause : use_keys_clause | use_index_clause;

use_keys_clause : USE use_keys_term;

use_keys_term : PRIMARY? KEYS expr;

use_index_clause : USE use_index_term;

use_index_term : INDEX LPAREN index_ref ( COMMA index_ref )* RPAREN;

index_ref : index_name? index_type?;

index_name : identifier_ref;

index_type : USING ( GSI | FTS );

let_clause : LET alias EQUAL expr ( COMMA alias EQUAL expr )*;

where_clause : WHERE cond;

cond : expr;

group_by_clause : GROUP BY group_term ( COMMA group_term )*
                    letting_clause? having_clause? | letting_clause;

group_term : expr ( (AS)? alias )?;

letting_clause : LETTING alias EQUAL expr ( COMMA alias EQUAL expr )*;

having_clause : HAVING cond;

window_clause : WINDOW window_declaration ( COMMA window_declaration )*;

window_declaration : window_name AS LPAREN window_definition RPAREN;

window_name : identifier_ref;

window_definition : window_ref? window_partition_clause? window_order_clause?
                      window_frame_clause?;

window_ref : identifier_ref;

window_partition_clause : PARTITION BY expr ( COMMA expr )*;

window_order_clause : ORDER BY ordering_term ( COMMA ordering_term )*;

window_frame_clause : ( ROWS | RANGE | GROUPS ) window_frame_extent
                        window_frame_exclusion?;

window_frame_extent : UNBOUNDED PRECEDING | CURRENT ROW |
                        BETWEEN ( UNBOUNDED PRECEDING | CURRENT ROW | ( PRECEDING | FOLLOWING ) )
                            AND ( UNBOUNDED FOLLOWING | CURRENT ROW | ( PRECEDING | FOLLOWING ) );

window_frame_exclusion : EXCLUDE ( CURRENT ROW | GROUP | TIES | NO OTHERS );

order_by_clause : ORDER BY ordering_term ( COMMA ordering_term )*;

ordering_term : expr ( ASC | DESC )? ( NULLS ( FIRST | LAST ) )?;

limit_clause : LIMIT expr;



offset_clause : OFFSET expr;


hint_comment : block_hint_comment | line_hint_comment;

block_hint_comment : BLOCK_HINT_OPEN hints COMMENT_CLOSE;

line_hint_comment : LINE_HINT_OPEN hints;

hints : simple_hint_sequence | json_hint_object;

simple_hint_sequence : simple_hint+;

simple_hint : ordered_hint_simple
              | gsi_hint_simple
              | fts_hint_simple
              | hash_hint_simple
              | nl_hint_simple;

ordered_hint_simple : ORDERED;

gsi_hint_simple : INDEX LPAREN keyspace_statement RPAREN;

keyspace_statement : KEYSPACE identifier_ref;

fts_hint_simple : INDEX_FTS LPAREN keyspace_statement RPAREN;

nl_hint_simple : USE_NL LPAREN ( keyspace_statement )+ RPAREN;

hash_hint_simple : USE_HASH LPAREN ( keyspace_statement ( SLASH ( BUILD | PROBE ) )? )+ RPAREN;

json_hint_object : LBRACE json_hint (COMMA json_hint )* RBRACE;

json_hint : ordered_hint_json
             | gsi_hint_json
             | fts_hint_json
             | hash_hint_json
             | nl_hint_json;

ordered_hint_json : QUOTED_ORDERED COLON TRUE;

gsi_hint_json : QUOTED_INDEX COLON ( index_array | index_object );

fts_hint_json : QUOTED_INDEX_FTS COLON ( index_array | index_object );

nl_hint_json : QUOTED_USE_NS COLON ( keyspace_array | keyspace_object );

hash_hint_json : QUOTED_USE_HASH  ( hash_array | hash_object );

index_array : LBRACKET index_object ( COMMA index_object )* RBRACKET;

index_object : LBRACE keyspace_property COMMA indexes_property RBRACE;

indexes_property : QUOTED_INDEXES COLON ( NULL
                                     | DQUOTE index DQUOTE
                                     | LBRACKET DQUOTE index DQUOTE ( COMMA DQUOTE index DQUOTE )* RBRACKET );

keyspace_array : LBRACKET keyspace_object ( COMMA keyspace_object )* RBRACKET;

keyspace_object : LBRACE keyspace_property RBRACE;

keyspace_property : ( QUOTED_KEYSPACE | QUOTED_ALIAS ) COLON DQUOTE keyspace_statement DQUOTE;

hash_array : LBRACKET hash_object ( COMMA hash_object )* RBRACKET;

hash_object : LBRACE keyspace_property ( COMMA option_property )? RBRACE;

option_property : QUOTED_OPTION COLON ( QUOTED_BUILD | QUOTED_PROBE | NULL );

/***************
 * Expressions *
 ***************/

expr : (
            (
                path |
                json_value |
                literal |
                identifier_ref |
                nested_expr |
                function_call |
                subquery_expr
            ) (
                comparison_term |
                arithmetic_term |
                concatenation_term |
                logical_term |
                collection_expr
            )*
         ) |
         case_expr;



literal : str | nbr | bool | NULL | MISSING;

str : double_quoted_string | single_quoted_string;

double_quoted_string : DQUOTE double_quoted_string_character* DQUOTE;

single_quoted_string : QUOTE single_quoted_string_character* QUOTE;

double_quoted_string_character : DoubleStringCharacter;

single_quoted_string_character : SingleStringCharacter;

bool : TRUE | FALSE;

identifier_or_star : identifier_ref | ASTERISK;

identifier_ref : IDENTIFIER | escaped_identifier;

escaped_identifier : BACKTICK IDENTIFIER BACKTICK;

arithmetic_term : PLUS expr |
                    ASTERISK expr |
                    SLASH expr |
                    PERCENT expr |
                    MINUS expr;

comparison_term : relational_expr |
                    between_expr |
                    like_expr |
                    is_expr;

relational_expr : DOUBLE_EQUAL expr |
                    EQUAL expr |
                    NOT_EQUAL expr |
                    LESSTHAN_OR_MORETHAN expr |
                    MORETHAN expr |
                    MORETHAN_OR_EQUAL expr |
                    LESSTHAN expr |
                    LESSTHAN_OR_EQUAL expr;

between_expr : NOT? BETWEEN expr AND expr;

like_expr : NOT? LIKE expr;

is_expr : IS NOT? NULL |
            IS NOT? MISSING |
            IS NOT? VALUED;



concatenation_term : DBLPIPE expr;

logical_term : and_expr | or_expr | not_expr;

and_expr : AND cond;

or_expr : OR cond;

not_expr : NOT cond;

case_expr : simple_case_expr | searched_case_expr;

simple_case_expr : CASE expr (WHEN expr THEN expr)+ (ELSE expr)? END;

searched_case_expr : CASE (WHEN cond THEN expr)+ (ELSE expr)? END;

collection_expr : exists_expr | in_expr | within_expr | range_cond;

exists_expr : EXISTS expr;

in_expr : NOT? IN expr;

within_expr : NOT? WITHIN expr;

range_cond : ( ( ANY | SOME ) ( AND EVERY )? | EVERY ) range_expr SATISFIES cond END;

range_expr : ( name_var COLON )? var ( IN | WITHIN ) expr
            ( COMMA ( name_var COLON )? var ( IN | WITHIN ) expr )*;

var : identifier_ref;

name_var : identifier_ref;

array_expr : LBRACKET ( expr ( COMMA expr )* )? RBRACKET;

nested_expr : field_expr | element_expr | slice_expr;

field_expr : DOT ( identifier_ref | ( ( escaped_identifier | LBRACKET expr RBRACKET ) 'i'? ) );

element_expr : LBRACKET expr RBRACKET;

slice_expr : LBRACKET expr COLON expr? RBRACKET;

function_call : (builtin_function |
                  ordinary_function |
                  aggregate_function |
                  window_function) ( DOT path )?;

function_name : identifier_ref;
aggregate_function_name : FUNCS | identifier_ref;

window_function_name : FUNCS | identifier_ref;

ordinary_function : function_name LPAREN ( expr ( COMMA expr )* )? RPAREN;

builtin_function : FUNCS LPAREN ( expr ( COMMA expr )* )? RPAREN;

aggregate_function : aggregate_function_name LPAREN ( aggregate_quantifier? expr |
                       ( path DOT )? ASTERISK ) RPAREN filter_clause? over_clause?;

aggregate_quantifier : ALL | DISTINCT;

filter_clause : FILTER LPAREN WHERE cond RPAREN;

window_function : window_function_name LPAREN window_function_arguments RPAREN
                    window_function_options? over_clause;

window_function_arguments : ( expr ( COMMA expr ( COMMA expr )? )? )?;

window_function_options : nthval_from? nulls_treatment?;

nthval_from : FROM ( FIRST | LAST );

nulls_treatment : ( RESPECT | IGNORE ) NULLS;

over_clause : OVER ( LPAREN window_definition RPAREN | window_ref );

subquery_expr : LPAREN select_statement RPAREN;


/************
 * Comments *
 ************/

comment : block_comment;

block_comment : BLOCK_COMMENT_OPEN (  LF )* COMMENT_CLOSE;

tcl_statement : begin_transaction
                | set_transaction
                | savepoint_statement
                | rollback_transaction
                | commit_transaction;

begin_transaction : ( BEGIN | START ) ( WORK | TRAN | TRANSACTION )
                      ( ISOLATION LEVEL READ COMMITTED )?;

set_transaction : SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

savepoint_statement : SAVEPOINT savepointname;

rollback_transaction : ROLLBACK ( WORK | TRAN | TRANSACTION )?
                       ( TO SAVEPOINT savepointname )?;

commit_transaction : COMMIT ( WORK | TRAN | TRANSACTION )?;

savepointname : identifier_ref;

utility_statement : advise_statement
                    | explain_statement;

advise_statement : ADVISE INDEX? ( select_statement | update_statement | delete_statement | merge_statement );

explain_statement : EXPLAIN statement;

infer_options_field :
	('sample_size' COLON) | 'num_sample_values' | 'similarity_metric' | 'dictionary_threshold';

infer_statement : INFER ( COLLECTION | KEYSPACE )? keyspace_ref ( WITH json_object )?;


/***********************
 * Prepared Statements *
 ***********************/


name : identifier_ref;

parameters : array_expr;

/**************
 * Statistics *
 **************/

update_statistics : update_statistics_expr | update_statistics_index | update_statistics_delete;

update_statistics_expr : ( UPDATE STATISTICS FOR? |
                             ANALYZE ( KEYSPACE | COLLECTION)? )
                             keyspace_ref LPAREN index_key ( COMMA index_key )* RPAREN index_with?;

update_statistics_index : ( UPDATE STATISTICS FOR | ANALYZE )
                              index_clause index_using?  index_with?;

index_clause : INDEX ( index_path DOT index_name | index_name ON keyspace_ref );

update_statistics_indexes : ( UPDATE STATISTICS FOR? |
                                ANALYZE ( KEYSPACE | COLLECTION)? )
                                keyspace_ref indexes_clause index_using? index_with?;

indexes_clause : INDEX ( LPAREN ( index_name ( COMMA index_name )* | subquery_expr ) RPAREN |
                             ALL );

update_statistics_delete : ( UPDATE STATISTICS FOR? |
                               ANALYZE ( KEYSPACE | COLLECTION)? )
                               keyspace_ref delete_clause;

delete_clause : DELETE ( delete_expr | delete_all );

delete_expr : STATISTICS? LPAREN index_key ( COMMA index_key )* RPAREN;

delete_all : ALL | STATISTICS;

/* Data Control Language */

dcl_statement : grant_statement
                | revoke_statement;

/* tag::grant[] */
grant_statement : GRANT role ( COMMA role )* ( ON keyspace_ref ( COMMA keyspace_ref )* )?
          TO user ( COMMA user )*;
/* end::grant[] */

/* tag::revoke[] */
revoke_statement : REVOKE role ( COMMA role )* ( ON keyspace_ref ( COMMA keyspace_ref )* )?
           FROM user ( COMMA user )*;
/* end::revoke[] */

role : identifier_ref;

user : identifier_ref;

json_value : json_object | json_array;

json_array : LBRACKET (expr (COMMA expr)*)? RBRACKET;

json_object : LBRACE (json_field (COMMA json_field)*)? RBRACE;

json_field : str COLON expr;