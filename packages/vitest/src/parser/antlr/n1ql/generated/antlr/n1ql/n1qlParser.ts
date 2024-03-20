// @ts-nocheck
// Generated from antlr/n1ql/n1ql.g4 by ANTLR 4.13.1
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
import n1qlListener from "./n1qlListener.js";
// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class n1qlParser extends Parser {
	public static readonly STR = 1;
	public static readonly INT = 2;
	public static readonly NUM = 3;
	public static readonly BLOCK_COMMENT = 4;
	public static readonly LINE_COMMENT = 5;
	public static readonly WHITESPACE = 6;
	public static readonly DOT = 7;
	public static readonly PLUS = 8;
	public static readonly MINUS = 9;
	public static readonly STAR = 10;
	public static readonly DIV = 11;
	public static readonly MOD = 12;
	public static readonly DEQ = 13;
	public static readonly EQ = 14;
	public static readonly NE = 15;
	public static readonly LT = 16;
	public static readonly LE = 17;
	public static readonly GT = 18;
	public static readonly GE = 19;
	public static readonly CONCAT = 20;
	public static readonly LPAREN = 21;
	public static readonly RPAREN = 22;
	public static readonly LBRACE = 23;
	public static readonly RBRACE = 24;
	public static readonly COMMA = 25;
	public static readonly COLON = 26;
	public static readonly LBRACKET = 27;
	public static readonly RBRACKET = 28;
	public static readonly RBRACKET_ICASE = 29;
	public static readonly SEMI = 30;
	public static readonly NOT_A_TOKEN = 31;
	public static readonly NAMESPACE_ID = 32;
	public static readonly ADVISE = 33;
	public static readonly ALL = 34;
	public static readonly ALTER = 35;
	public static readonly ANALYZE = 36;
	public static readonly AND = 37;
	public static readonly ANY = 38;
	public static readonly ARRAY = 39;
	public static readonly AS = 40;
	public static readonly ASC = 41;
	public static readonly AT = 42;
	public static readonly BEGIN = 43;
	public static readonly BETWEEN = 44;
	public static readonly BINARY = 45;
	public static readonly BOOLEAN = 46;
	public static readonly BREAK = 47;
	public static readonly BUCKET = 48;
	public static readonly BUILD = 49;
	public static readonly BY = 50;
	public static readonly CALL = 51;
	public static readonly CASE = 52;
	public static readonly CAST = 53;
	public static readonly CLUSTER = 54;
	public static readonly COLLATE = 55;
	public static readonly COLLECTION = 56;
	public static readonly COMMIT = 57;
	public static readonly COMMITTED = 58;
	public static readonly CONNECT = 59;
	public static readonly CONTINUE = 60;
	public static readonly CORRELATED = 61;
	public static readonly COVER = 62;
	public static readonly CREATE = 63;
	public static readonly CURRENT = 64;
	public static readonly DATABASE = 65;
	public static readonly DATASET = 66;
	public static readonly DATASTORE = 67;
	public static readonly DECLARE = 68;
	public static readonly DECREMENT = 69;
	public static readonly DELETE_ = 70;
	public static readonly DERIVED = 71;
	public static readonly DESC = 72;
	public static readonly DESCRIBE = 73;
	public static readonly DISTINCT = 74;
	public static readonly DO = 75;
	public static readonly DROP = 76;
	public static readonly EACH = 77;
	public static readonly ELEMENT = 78;
	public static readonly ELSE = 79;
	public static readonly END = 80;
	public static readonly EVERY = 81;
	public static readonly EXCEPT = 82;
	public static readonly EXCLUDE = 83;
	public static readonly EXECUTE = 84;
	public static readonly EXISTS = 85;
	public static readonly EXPLAIN = 86;
	public static readonly FALSE = 87;
	public static readonly FETCH = 88;
	public static readonly FILTER = 89;
	public static readonly FIRST = 90;
	public static readonly FLATTEN = 91;
	public static readonly FLUSH = 92;
	public static readonly FOLLOWING = 93;
	public static readonly FOR = 94;
	public static readonly FORCE = 95;
	public static readonly FROM = 96;
	public static readonly FTS = 97;
	public static readonly FUNCTION = 98;
	public static readonly GOLANG = 99;
	public static readonly GRANT = 100;
	public static readonly GROUP = 101;
	public static readonly GROUPS = 102;
	public static readonly GSI = 103;
	public static readonly HASH = 104;
	public static readonly HAVING = 105;
	public static readonly IF = 106;
	public static readonly IGNORE = 107;
	public static readonly ILIKE = 108;
	public static readonly IN = 109;
	public static readonly INCLUDE = 110;
	public static readonly INCREMENT = 111;
	public static readonly INDEX = 112;
	public static readonly INFER = 113;
	public static readonly INLINE = 114;
	public static readonly INNER = 115;
	public static readonly INSERT = 116;
	public static readonly INTERSECT = 117;
	public static readonly INTO = 118;
	public static readonly IS = 119;
	public static readonly ISOLATION = 120;
	public static readonly JAVASCRIPT = 121;
	public static readonly JOIN = 122;
	public static readonly KEY = 123;
	public static readonly KEYS = 124;
	public static readonly KEYSPACE = 125;
	public static readonly KNOWN = 126;
	public static readonly LANGUAGE = 127;
	public static readonly LAST = 128;
	public static readonly LEFT = 129;
	public static readonly LET_ = 130;
	public static readonly LETTING = 131;
	public static readonly LEVEL = 132;
	public static readonly LIKE = 133;
	public static readonly LIMIT = 134;
	public static readonly LSM = 135;
	public static readonly MAP = 136;
	public static readonly MAPPING = 137;
	public static readonly MATCHED = 138;
	public static readonly MATERIALIZED = 139;
	public static readonly MERGE = 140;
	public static readonly MISSING = 141;
	public static readonly NAMESPACE = 142;
	public static readonly NEST = 143;
	public static readonly NL = 144;
	public static readonly NO = 145;
	public static readonly NOT = 146;
	public static readonly NTH_VALUE = 147;
	public static readonly NULL = 148;
	public static readonly NULLS = 149;
	public static readonly NUMBER = 150;
	public static readonly OBJECT = 151;
	public static readonly OFFSET = 152;
	public static readonly ON = 153;
	public static readonly OPTION = 154;
	public static readonly OPTIONS = 155;
	public static readonly OR = 156;
	public static readonly ORDER = 157;
	public static readonly OTHERS = 158;
	public static readonly OUTER = 159;
	public static readonly OVER = 160;
	public static readonly PARSE = 161;
	public static readonly PARTITION = 162;
	public static readonly PASSWORD = 163;
	public static readonly PATH = 164;
	public static readonly POOL = 165;
	public static readonly PRECEDING = 166;
	public static readonly PREPARE = 167;
	public static readonly PRIMARY = 168;
	public static readonly PRIVATE = 169;
	public static readonly PRIVILEGE = 170;
	public static readonly PROCEDURE = 171;
	public static readonly PROBE = 172;
	public static readonly PUBLIC = 173;
	public static readonly RANGE = 174;
	public static readonly RAW = 175;
	public static readonly READ = 176;
	public static readonly REALM = 177;
	public static readonly REDUCE = 178;
	public static readonly RENAME = 179;
	public static readonly REPLACE = 180;
	public static readonly RESPECT = 181;
	public static readonly RETURN = 182;
	public static readonly RETURNING = 183;
	public static readonly REVOKE = 184;
	public static readonly RIGHT = 185;
	public static readonly ROLE = 186;
	public static readonly ROLLBACK = 187;
	public static readonly ROW = 188;
	public static readonly ROWS = 189;
	public static readonly SATISFIES = 190;
	public static readonly SAVEPOINT = 191;
	public static readonly SCHEMA = 192;
	public static readonly SCOPE = 193;
	public static readonly SELECT = 194;
	public static readonly SELF = 195;
	public static readonly SET = 196;
	public static readonly SHOW = 197;
	public static readonly SOME = 198;
	public static readonly START = 199;
	public static readonly STATISTICS = 200;
	public static readonly STRING = 201;
	public static readonly SYSTEM = 202;
	public static readonly THEN = 203;
	public static readonly TIES = 204;
	public static readonly TO = 205;
	public static readonly TRAN = 206;
	public static readonly TRANSACTION = 207;
	public static readonly TRIGGER = 208;
	public static readonly TRUE = 209;
	public static readonly TRUNCATE = 210;
	public static readonly UNBOUNDED = 211;
	public static readonly UNDER = 212;
	public static readonly UNION = 213;
	public static readonly UNIQUE = 214;
	public static readonly UNKNOWN = 215;
	public static readonly UNNEST = 216;
	public static readonly UNSET = 217;
	public static readonly UPDATE = 218;
	public static readonly UPSERT = 219;
	public static readonly USE = 220;
	public static readonly USER = 221;
	public static readonly USING = 222;
	public static readonly VALIDATE = 223;
	public static readonly VALUE = 224;
	public static readonly VALUED = 225;
	public static readonly VALUES = 226;
	public static readonly VIA = 227;
	public static readonly VIEW = 228;
	public static readonly WHEN = 229;
	public static readonly WHERE = 230;
	public static readonly WHILE = 231;
	public static readonly WINDOW = 232;
	public static readonly WITH = 233;
	public static readonly WITHIN = 234;
	public static readonly WORK = 235;
	public static readonly XOR = 236;
	public static readonly IDENT_ICASE = 237;
	public static readonly IDENT = 238;
	public static readonly NAMED_PARAM = 239;
	public static readonly POSITIONAL_PARAM = 240;
	public static readonly NEXT_PARAM = 241;
	public static readonly DEFAULT = 242;
	public static readonly USERS = 243;
	public static readonly SEQUENCE = 244;
	public static readonly VECTOR = 245;
	public static readonly OPTIM_HINTS = 246;
	public static readonly LATERAL = 247;
	public static readonly RECURSIVE = 248;
	public static readonly CYCLE = 249;
	public static readonly RESTRICT = 250;
	public static readonly ROLES = 251;
	public static readonly POW = 252;
	public static readonly ESCAPE = 253;
	public static readonly RANDOM_ELEMENT = 254;
	public static readonly T__COVER = 255;
	public static readonly T__INDEX_KEY = 256;
	public static readonly T__INDEX_CONDITION = 257;
	public static readonly FLATTEN_KEYS = 258;
	public static readonly T__CORRELATED = 259;
	public static readonly RESTART = 260;
	public static readonly MAXVALUE = 261;
	public static readonly MINVALUE = 262;
	public static readonly CACHE = 263;
	public static readonly NEXTVAL = 264;
	public static readonly NEXT = 265;
	public static readonly PREVVAL = 266;
	public static readonly PREV = 267;
	public static readonly EOF = Token.EOF;
	public static readonly RULE_input = 0;
	public static readonly RULE_permitted_identifiers = 1;
	public static readonly RULE_opt_trailer = 2;
	public static readonly RULE_stmt_body = 3;
	public static readonly RULE_stmt = 4;
	public static readonly RULE_advise = 5;
	public static readonly RULE_opt_index = 6;
	public static readonly RULE_explain = 7;
	public static readonly RULE_explain_function = 8;
	public static readonly RULE_prepare = 9;
	public static readonly RULE_opt_force = 10;
	public static readonly RULE_opt_name = 11;
	public static readonly RULE_p__invalid_case_insensitive_identifier = 12;
	public static readonly RULE_from_or_as = 13;
	public static readonly RULE_execute = 14;
	public static readonly RULE_opt_execute_using = 15;
	public static readonly RULE_infer = 16;
	public static readonly RULE_keyspace_collection = 17;
	public static readonly RULE_opt_keyspace_collection = 18;
	public static readonly RULE_opt_infer_using = 19;
	public static readonly RULE_select_stmt = 20;
	public static readonly RULE_dml_stmt = 21;
	public static readonly RULE_ddl_stmt = 22;
	public static readonly RULE_user_stmt = 23;
	public static readonly RULE_group_stmt = 24;
	public static readonly RULE_role_stmt = 25;
	public static readonly RULE_index_stmt = 26;
	public static readonly RULE_bucket_stmt = 27;
	public static readonly RULE_scope_stmt = 28;
	public static readonly RULE_collection_stmt = 29;
	public static readonly RULE_function_stmt = 30;
	public static readonly RULE_transaction_stmt = 31;
	public static readonly RULE_fullselect = 32;
	public static readonly RULE_select_terms = 33;
	public static readonly RULE_select_term = 34;
	public static readonly RULE_subselect = 35;
	public static readonly RULE_from_select = 36;
	public static readonly RULE_select_from = 37;
	public static readonly RULE_setop = 38;
	public static readonly RULE_opt_optim_hints = 39;
	public static readonly RULE_hints_input = 40;
	public static readonly RULE_optim_hints = 41;
	public static readonly RULE_optim_hint = 42;
	public static readonly RULE_opt_hint_args = 43;
	public static readonly RULE_hint_args = 44;
	public static readonly RULE_projection = 45;
	public static readonly RULE_opt_quantifier = 46;
	public static readonly RULE_opt_exclude = 47;
	public static readonly RULE_raw = 48;
	public static readonly RULE_projects = 49;
	public static readonly RULE_project = 50;
	public static readonly RULE_opt_as_alias = 51;
	public static readonly RULE_as_alias = 52;
	public static readonly RULE_alias = 53;
	public static readonly RULE_opt_from = 54;
	public static readonly RULE_from = 55;
	public static readonly RULE_from_terms = 56;
	public static readonly RULE_from_term = 57;
	public static readonly RULE_simple_from_term = 58;
	public static readonly RULE_unnest = 59;
	public static readonly RULE_keyspace_term = 60;
	public static readonly RULE_keyspace_path = 61;
	public static readonly RULE_namespace_term = 62;
	public static readonly RULE_namespace_name = 63;
	public static readonly RULE_path_part = 64;
	public static readonly RULE_keyspace_name = 65;
	public static readonly RULE_opt_use = 66;
	public static readonly RULE_use_options = 67;
	public static readonly RULE_use_keys = 68;
	public static readonly RULE_use_index = 69;
	public static readonly RULE_join_hint = 70;
	public static readonly RULE_opt_primary = 71;
	public static readonly RULE_index_refs = 72;
	public static readonly RULE_index_ref = 73;
	public static readonly RULE_use_hash_option = 74;
	public static readonly RULE_opt_use_del_upd = 75;
	public static readonly RULE_opt_join_type = 76;
	public static readonly RULE_opt_outer = 77;
	public static readonly RULE_on_keys = 78;
	public static readonly RULE_on_key = 79;
	public static readonly RULE_opt_let = 80;
	public static readonly RULE_let_ = 81;
	public static readonly RULE_bindings = 82;
	public static readonly RULE_binding = 83;
	public static readonly RULE_with = 84;
	public static readonly RULE_with_list = 85;
	public static readonly RULE_with_term = 86;
	public static readonly RULE_opt_option_clause = 87;
	public static readonly RULE_opt_cycle_clause = 88;
	public static readonly RULE_opt_where = 89;
	public static readonly RULE_where = 90;
	public static readonly RULE_opt_group = 91;
	public static readonly RULE_group = 92;
	public static readonly RULE_group_terms = 93;
	public static readonly RULE_group_term = 94;
	public static readonly RULE_opt_letting = 95;
	public static readonly RULE_letting = 96;
	public static readonly RULE_opt_having = 97;
	public static readonly RULE_having = 98;
	public static readonly RULE_opt_group_as = 99;
	public static readonly RULE_opt_order_by = 100;
	public static readonly RULE_order_by = 101;
	public static readonly RULE_sort_terms = 102;
	public static readonly RULE_sort_term = 103;
	public static readonly RULE_opt_dir = 104;
	public static readonly RULE_dir = 105;
	public static readonly RULE_opt_order_nulls = 106;
	public static readonly RULE_first_last = 107;
	public static readonly RULE_opt_limit = 108;
	public static readonly RULE_limit = 109;
	public static readonly RULE_opt_offset = 110;
	public static readonly RULE_offset = 111;
	public static readonly RULE_insert = 112;
	public static readonly RULE_simple_keyspace_ref = 113;
	public static readonly RULE_keyspace_ref = 114;
	public static readonly RULE_opt_values_header = 115;
	public static readonly RULE_key = 116;
	public static readonly RULE_values_list = 117;
	public static readonly RULE_values = 118;
	public static readonly RULE_next_values = 119;
	public static readonly RULE_key_val_expr = 120;
	public static readonly RULE_key_val_options_expr = 121;
	public static readonly RULE_opt_returning = 122;
	public static readonly RULE_returning = 123;
	public static readonly RULE_returns_ = 124;
	public static readonly RULE_key_expr_header = 125;
	public static readonly RULE_value_expr_header = 126;
	public static readonly RULE_options_expr_header = 127;
	public static readonly RULE_key_val_options_expr_header = 128;
	public static readonly RULE_upsert = 129;
	public static readonly RULE_delete_ = 130;
	public static readonly RULE_update = 131;
	public static readonly RULE_set = 132;
	public static readonly RULE_set_terms = 133;
	public static readonly RULE_set_term = 134;
	public static readonly RULE_function_meta_expr = 135;
	public static readonly RULE_opt_update_for = 136;
	public static readonly RULE_update_for = 137;
	public static readonly RULE_update_dimensions = 138;
	public static readonly RULE_update_dimension = 139;
	public static readonly RULE_update_binding = 140;
	public static readonly RULE_variable = 141;
	public static readonly RULE_opt_when = 142;
	public static readonly RULE_unset = 143;
	public static readonly RULE_unset_terms = 144;
	public static readonly RULE_unset_term = 145;
	public static readonly RULE_merge = 146;
	public static readonly RULE_opt_use_merge = 147;
	public static readonly RULE_opt_key = 148;
	public static readonly RULE_opt_merge_actions = 149;
	public static readonly RULE_opt_merge_delete_insert = 150;
	public static readonly RULE_opt_merge_insert = 151;
	public static readonly RULE_merge_update = 152;
	public static readonly RULE_merge_delete = 153;
	public static readonly RULE_merge_insert = 154;
	public static readonly RULE_create_user = 155;
	public static readonly RULE_alter_user = 156;
	public static readonly RULE_drop_user = 157;
	public static readonly RULE_user_opts = 158;
	public static readonly RULE_param_or_str = 159;
	public static readonly RULE_user_opt = 160;
	public static readonly RULE_groups = 161;
	public static readonly RULE_create_group = 162;
	public static readonly RULE_alter_group = 163;
	public static readonly RULE_drop_group = 164;
	public static readonly RULE_group_name = 165;
	public static readonly RULE_group_opts = 166;
	public static readonly RULE_group_opt = 167;
	public static readonly RULE_group_role_list = 168;
	public static readonly RULE_group_role_list_item = 169;
	public static readonly RULE_group_or_groups = 170;
	public static readonly RULE_user_users = 171;
	public static readonly RULE_grant_role = 172;
	public static readonly RULE_role_list = 173;
	public static readonly RULE_role_name = 174;
	public static readonly RULE_keyspace_scope_list = 175;
	public static readonly RULE_keyspace_scope = 176;
	public static readonly RULE_user_list = 177;
	public static readonly RULE_user = 178;
	public static readonly RULE_revoke_role = 179;
	public static readonly RULE_opt_def_with_clause = 180;
	public static readonly RULE_create_bucket = 181;
	public static readonly RULE_alter_bucket = 182;
	public static readonly RULE_drop_bucket = 183;
	public static readonly RULE_create_scope = 184;
	public static readonly RULE_drop_scope = 185;
	public static readonly RULE_create_collection = 186;
	public static readonly RULE_drop_collection = 187;
	public static readonly RULE_flush_collection = 188;
	public static readonly RULE_flush_or_truncate = 189;
	public static readonly RULE_create_index = 190;
	public static readonly RULE_opt_vector = 191;
	public static readonly RULE_index_name = 192;
	public static readonly RULE_opt_index_name = 193;
	public static readonly RULE_opt_if_not_exists = 194;
	public static readonly RULE_named_keyspace_ref = 195;
	public static readonly RULE_simple_named_keyspace_ref = 196;
	public static readonly RULE_named_scope_ref = 197;
	public static readonly RULE_opt_index_partition = 198;
	public static readonly RULE_opt_index_using = 199;
	public static readonly RULE_index_using = 200;
	public static readonly RULE_index_terms = 201;
	public static readonly RULE_index_term = 202;
	public static readonly RULE_index_term_expr = 203;
	public static readonly RULE_all_expr = 204;
	public static readonly RULE_all = 205;
	public static readonly RULE_flatten_keys_expr = 206;
	public static readonly RULE_flatten_keys_exprs = 207;
	public static readonly RULE_opt_flatten_keys_exprs = 208;
	public static readonly RULE_opt_index_where = 209;
	public static readonly RULE_opt_ikattr = 210;
	public static readonly RULE_ikattr = 211;
	public static readonly RULE_drop_index = 212;
	public static readonly RULE_opt_if_exists = 213;
	public static readonly RULE_alter_index = 214;
	public static readonly RULE_build_index = 215;
	public static readonly RULE_create_function = 216;
	public static readonly RULE_opt_replace = 217;
	public static readonly RULE_func_name = 218;
	public static readonly RULE_short_func_name = 219;
	public static readonly RULE_long_func_name = 220;
	public static readonly RULE_opt_parm_list = 221;
	public static readonly RULE_parameter_terms = 222;
	public static readonly RULE_func_body = 223;
	public static readonly RULE_drop_function = 224;
	public static readonly RULE_execute_function = 225;
	public static readonly RULE_update_statistics = 226;
	public static readonly RULE_opt_for = 227;
	public static readonly RULE_update_stat_terms = 228;
	public static readonly RULE_update_stat_term = 229;
	public static readonly RULE_path = 230;
	public static readonly RULE_ident = 231;
	public static readonly RULE_ident_icase = 232;
	public static readonly RULE_expr = 233;
	public static readonly RULE_valued = 234;
	public static readonly RULE_c_expr = 235;
	public static readonly RULE_b_expr = 236;
	public static readonly RULE_literal = 237;
	public static readonly RULE_construction_expr = 238;
	public static readonly RULE_object = 239;
	public static readonly RULE_opt_members = 240;
	public static readonly RULE_members = 241;
	public static readonly RULE_member = 242;
	public static readonly RULE_array = 243;
	public static readonly RULE_opt_exprs = 244;
	public static readonly RULE_exprs = 245;
	public static readonly RULE_param_expr = 246;
	public static readonly RULE_case_expr = 247;
	public static readonly RULE_simple_or_searched_case = 248;
	public static readonly RULE_simple_case = 249;
	public static readonly RULE_when_thens = 250;
	public static readonly RULE_searched_case = 251;
	public static readonly RULE_opt_else = 252;
	public static readonly RULE_function_expr = 253;
	public static readonly RULE_function_name = 254;
	public static readonly RULE_collection_expr = 255;
	public static readonly RULE_collection_cond = 256;
	public static readonly RULE_coll_bindings = 257;
	public static readonly RULE_coll_binding = 258;
	public static readonly RULE_satisfies = 259;
	public static readonly RULE_collection_xform = 260;
	public static readonly RULE_paren_expr = 261;
	public static readonly RULE_subquery_expr = 262;
	public static readonly RULE_expr_input = 263;
	public static readonly RULE_opt_window_clause = 264;
	public static readonly RULE_window_list = 265;
	public static readonly RULE_window_term = 266;
	public static readonly RULE_window_specification = 267;
	public static readonly RULE_opt_window_name = 268;
	public static readonly RULE_opt_window_partition = 269;
	public static readonly RULE_opt_window_frame = 270;
	public static readonly RULE_window_frame_modifier = 271;
	public static readonly RULE_opt_window_frame_exclusion = 272;
	public static readonly RULE_window_frame_extents = 273;
	public static readonly RULE_window_frame_extent = 274;
	public static readonly RULE_window_frame_valexpr_modifier = 275;
	public static readonly RULE_opt_nulls_treatment = 276;
	public static readonly RULE_nulls_treatment = 277;
	public static readonly RULE_opt_from_first_last = 278;
	public static readonly RULE_agg_quantifier = 279;
	public static readonly RULE_opt_filter = 280;
	public static readonly RULE_opt_window_function = 281;
	public static readonly RULE_window_function_details = 282;
	public static readonly RULE_start_transaction = 283;
	public static readonly RULE_commit_transaction = 284;
	public static readonly RULE_rollback_transaction = 285;
	public static readonly RULE_start_or_begin = 286;
	public static readonly RULE_opt_transaction = 287;
	public static readonly RULE_transaction = 288;
	public static readonly RULE_opt_savepoint = 289;
	public static readonly RULE_savepoint_name = 290;
	public static readonly RULE_opt_isolation_level = 291;
	public static readonly RULE_isolation_level = 292;
	public static readonly RULE_isolation_val = 293;
	public static readonly RULE_set_transaction_isolation = 294;
	public static readonly RULE_savepoint = 295;
	public static readonly RULE_opt_with_clause = 296;
	public static readonly RULE_with_clause = 297;
	public static readonly RULE_opt_namespace_name = 298;
	public static readonly RULE_sequence_object_name = 299;
	public static readonly RULE_sequence_full_name = 300;
	public static readonly RULE_sequence_stmt = 301;
	public static readonly RULE_create_sequence = 302;
	public static readonly RULE_sequence_name_options = 303;
	public static readonly RULE_sequence_name_option = 304;
	public static readonly RULE_opt_seq_create_options = 305;
	public static readonly RULE_seq_create_option = 306;
	public static readonly RULE_drop_sequence = 307;
	public static readonly RULE_alter_sequence = 308;
	public static readonly RULE_seq_alter_options = 309;
	public static readonly RULE_seq_alter_option = 310;
	public static readonly RULE_sequence_with = 311;
	public static readonly RULE_start_with = 312;
	public static readonly RULE_restart_with = 313;
	public static readonly RULE_increment_by = 314;
	public static readonly RULE_maxvalue = 315;
	public static readonly RULE_minvalue = 316;
	public static readonly RULE_cycle = 317;
	public static readonly RULE_cache = 318;
	public static readonly RULE_sequence_next = 319;
	public static readonly RULE_sequence_prev = 320;
	public static readonly RULE_sequence_expr = 321;
	public static readonly literalNames: (string | null)[] = [ null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, "'.'", 
                                                            "'+'", null, 
                                                            "'*'", "'/'", 
                                                            "'%'", "'=='", 
                                                            "'='", null, 
                                                            "'<'", "'<='", 
                                                            "'>'", "'>='", 
                                                            "'||'", "'('", 
                                                            "')'", "'{'", 
                                                            "'}'", "','", 
                                                            "':'", "'['", 
                                                            "']'", "']i'", 
                                                            "';'", "'!'", 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, null, 
                                                            null, "'?'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, "STR", 
                                                             "INT", "NUM", 
                                                             "BLOCK_COMMENT", 
                                                             "LINE_COMMENT", 
                                                             "WHITESPACE", 
                                                             "DOT", "PLUS", 
                                                             "MINUS", "STAR", 
                                                             "DIV", "MOD", 
                                                             "DEQ", "EQ", 
                                                             "NE", "LT", 
                                                             "LE", "GT", 
                                                             "GE", "CONCAT", 
                                                             "LPAREN", "RPAREN", 
                                                             "LBRACE", "RBRACE", 
                                                             "COMMA", "COLON", 
                                                             "LBRACKET", 
                                                             "RBRACKET", 
                                                             "RBRACKET_ICASE", 
                                                             "SEMI", "NOT_A_TOKEN", 
                                                             "NAMESPACE_ID", 
                                                             "ADVISE", "ALL", 
                                                             "ALTER", "ANALYZE", 
                                                             "AND", "ANY", 
                                                             "ARRAY", "AS", 
                                                             "ASC", "AT", 
                                                             "BEGIN", "BETWEEN", 
                                                             "BINARY", "BOOLEAN", 
                                                             "BREAK", "BUCKET", 
                                                             "BUILD", "BY", 
                                                             "CALL", "CASE", 
                                                             "CAST", "CLUSTER", 
                                                             "COLLATE", 
                                                             "COLLECTION", 
                                                             "COMMIT", "COMMITTED", 
                                                             "CONNECT", 
                                                             "CONTINUE", 
                                                             "CORRELATED", 
                                                             "COVER", "CREATE", 
                                                             "CURRENT", 
                                                             "DATABASE", 
                                                             "DATASET", 
                                                             "DATASTORE", 
                                                             "DECLARE", 
                                                             "DECREMENT", 
                                                             "DELETE_", 
                                                             "DERIVED", 
                                                             "DESC", "DESCRIBE", 
                                                             "DISTINCT", 
                                                             "DO", "DROP", 
                                                             "EACH", "ELEMENT", 
                                                             "ELSE", "END", 
                                                             "EVERY", "EXCEPT", 
                                                             "EXCLUDE", 
                                                             "EXECUTE", 
                                                             "EXISTS", "EXPLAIN", 
                                                             "FALSE", "FETCH", 
                                                             "FILTER", "FIRST", 
                                                             "FLATTEN", 
                                                             "FLUSH", "FOLLOWING", 
                                                             "FOR", "FORCE", 
                                                             "FROM", "FTS", 
                                                             "FUNCTION", 
                                                             "GOLANG", "GRANT", 
                                                             "GROUP", "GROUPS", 
                                                             "GSI", "HASH", 
                                                             "HAVING", "IF", 
                                                             "IGNORE", "ILIKE", 
                                                             "IN", "INCLUDE", 
                                                             "INCREMENT", 
                                                             "INDEX", "INFER", 
                                                             "INLINE", "INNER", 
                                                             "INSERT", "INTERSECT", 
                                                             "INTO", "IS", 
                                                             "ISOLATION", 
                                                             "JAVASCRIPT", 
                                                             "JOIN", "KEY", 
                                                             "KEYS", "KEYSPACE", 
                                                             "KNOWN", "LANGUAGE", 
                                                             "LAST", "LEFT", 
                                                             "LET_", "LETTING", 
                                                             "LEVEL", "LIKE", 
                                                             "LIMIT", "LSM", 
                                                             "MAP", "MAPPING", 
                                                             "MATCHED", 
                                                             "MATERIALIZED", 
                                                             "MERGE", "MISSING", 
                                                             "NAMESPACE", 
                                                             "NEST", "NL", 
                                                             "NO", "NOT", 
                                                             "NTH_VALUE", 
                                                             "NULL", "NULLS", 
                                                             "NUMBER", "OBJECT", 
                                                             "OFFSET", "ON", 
                                                             "OPTION", "OPTIONS", 
                                                             "OR", "ORDER", 
                                                             "OTHERS", "OUTER", 
                                                             "OVER", "PARSE", 
                                                             "PARTITION", 
                                                             "PASSWORD", 
                                                             "PATH", "POOL", 
                                                             "PRECEDING", 
                                                             "PREPARE", 
                                                             "PRIMARY", 
                                                             "PRIVATE", 
                                                             "PRIVILEGE", 
                                                             "PROCEDURE", 
                                                             "PROBE", "PUBLIC", 
                                                             "RANGE", "RAW", 
                                                             "READ", "REALM", 
                                                             "REDUCE", "RENAME", 
                                                             "REPLACE", 
                                                             "RESPECT", 
                                                             "RETURN", "RETURNING", 
                                                             "REVOKE", "RIGHT", 
                                                             "ROLE", "ROLLBACK", 
                                                             "ROW", "ROWS", 
                                                             "SATISFIES", 
                                                             "SAVEPOINT", 
                                                             "SCHEMA", "SCOPE", 
                                                             "SELECT", "SELF", 
                                                             "SET", "SHOW", 
                                                             "SOME", "START", 
                                                             "STATISTICS", 
                                                             "STRING", "SYSTEM", 
                                                             "THEN", "TIES", 
                                                             "TO", "TRAN", 
                                                             "TRANSACTION", 
                                                             "TRIGGER", 
                                                             "TRUE", "TRUNCATE", 
                                                             "UNBOUNDED", 
                                                             "UNDER", "UNION", 
                                                             "UNIQUE", "UNKNOWN", 
                                                             "UNNEST", "UNSET", 
                                                             "UPDATE", "UPSERT", 
                                                             "USE", "USER", 
                                                             "USING", "VALIDATE", 
                                                             "VALUE", "VALUED", 
                                                             "VALUES", "VIA", 
                                                             "VIEW", "WHEN", 
                                                             "WHERE", "WHILE", 
                                                             "WINDOW", "WITH", 
                                                             "WITHIN", "WORK", 
                                                             "XOR", "IDENT_ICASE", 
                                                             "IDENT", "NAMED_PARAM", 
                                                             "POSITIONAL_PARAM", 
                                                             "NEXT_PARAM", 
                                                             "DEFAULT", 
                                                             "USERS", "SEQUENCE", 
                                                             "VECTOR", "OPTIM_HINTS", 
                                                             "LATERAL", 
                                                             "RECURSIVE", 
                                                             "CYCLE", "RESTRICT", 
                                                             "ROLES", "POW", 
                                                             "ESCAPE", "RANDOM_ELEMENT", 
                                                             null, null, 
                                                             null, "FLATTEN_KEYS", 
                                                             null, "RESTART", 
                                                             "MAXVALUE", 
                                                             "MINVALUE", 
                                                             "CACHE", "NEXTVAL", 
                                                             "NEXT", "PREVVAL", 
                                                             "PREV" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"input", "permitted_identifiers", "opt_trailer", "stmt_body", "stmt", 
		"advise", "opt_index", "explain", "explain_function", "prepare", "opt_force", 
		"opt_name", "p__invalid_case_insensitive_identifier", "from_or_as", "execute", 
		"opt_execute_using", "infer", "keyspace_collection", "opt_keyspace_collection", 
		"opt_infer_using", "select_stmt", "dml_stmt", "ddl_stmt", "user_stmt", 
		"group_stmt", "role_stmt", "index_stmt", "bucket_stmt", "scope_stmt", 
		"collection_stmt", "function_stmt", "transaction_stmt", "fullselect", 
		"select_terms", "select_term", "subselect", "from_select", "select_from", 
		"setop", "opt_optim_hints", "hints_input", "optim_hints", "optim_hint", 
		"opt_hint_args", "hint_args", "projection", "opt_quantifier", "opt_exclude", 
		"raw", "projects", "project", "opt_as_alias", "as_alias", "alias", "opt_from", 
		"from", "from_terms", "from_term", "simple_from_term", "unnest", "keyspace_term", 
		"keyspace_path", "namespace_term", "namespace_name", "path_part", "keyspace_name", 
		"opt_use", "use_options", "use_keys", "use_index", "join_hint", "opt_primary", 
		"index_refs", "index_ref", "use_hash_option", "opt_use_del_upd", "opt_join_type", 
		"opt_outer", "on_keys", "on_key", "opt_let", "let_", "bindings", "binding", 
		"with", "with_list", "with_term", "opt_option_clause", "opt_cycle_clause", 
		"opt_where", "where", "opt_group", "group", "group_terms", "group_term", 
		"opt_letting", "letting", "opt_having", "having", "opt_group_as", "opt_order_by", 
		"order_by", "sort_terms", "sort_term", "opt_dir", "dir", "opt_order_nulls", 
		"first_last", "opt_limit", "limit", "opt_offset", "offset", "insert", 
		"simple_keyspace_ref", "keyspace_ref", "opt_values_header", "key", "values_list", 
		"values", "next_values", "key_val_expr", "key_val_options_expr", "opt_returning", 
		"returning", "returns_", "key_expr_header", "value_expr_header", "options_expr_header", 
		"key_val_options_expr_header", "upsert", "delete_", "update", "set", "set_terms", 
		"set_term", "function_meta_expr", "opt_update_for", "update_for", "update_dimensions", 
		"update_dimension", "update_binding", "variable", "opt_when", "unset", 
		"unset_terms", "unset_term", "merge", "opt_use_merge", "opt_key", "opt_merge_actions", 
		"opt_merge_delete_insert", "opt_merge_insert", "merge_update", "merge_delete", 
		"merge_insert", "create_user", "alter_user", "drop_user", "user_opts", 
		"param_or_str", "user_opt", "groups", "create_group", "alter_group", "drop_group", 
		"group_name", "group_opts", "group_opt", "group_role_list", "group_role_list_item", 
		"group_or_groups", "user_users", "grant_role", "role_list", "role_name", 
		"keyspace_scope_list", "keyspace_scope", "user_list", "user", "revoke_role", 
		"opt_def_with_clause", "create_bucket", "alter_bucket", "drop_bucket", 
		"create_scope", "drop_scope", "create_collection", "drop_collection", 
		"flush_collection", "flush_or_truncate", "create_index", "opt_vector", 
		"index_name", "opt_index_name", "opt_if_not_exists", "named_keyspace_ref", 
		"simple_named_keyspace_ref", "named_scope_ref", "opt_index_partition", 
		"opt_index_using", "index_using", "index_terms", "index_term", "index_term_expr", 
		"all_expr", "all", "flatten_keys_expr", "flatten_keys_exprs", "opt_flatten_keys_exprs", 
		"opt_index_where", "opt_ikattr", "ikattr", "drop_index", "opt_if_exists", 
		"alter_index", "build_index", "create_function", "opt_replace", "func_name", 
		"short_func_name", "long_func_name", "opt_parm_list", "parameter_terms", 
		"func_body", "drop_function", "execute_function", "update_statistics", 
		"opt_for", "update_stat_terms", "update_stat_term", "path", "ident", "ident_icase", 
		"expr", "valued", "c_expr", "b_expr", "literal", "construction_expr", 
		"object", "opt_members", "members", "member", "array", "opt_exprs", "exprs", 
		"param_expr", "case_expr", "simple_or_searched_case", "simple_case", "when_thens", 
		"searched_case", "opt_else", "function_expr", "function_name", "collection_expr", 
		"collection_cond", "coll_bindings", "coll_binding", "satisfies", "collection_xform", 
		"paren_expr", "subquery_expr", "expr_input", "opt_window_clause", "window_list", 
		"window_term", "window_specification", "opt_window_name", "opt_window_partition", 
		"opt_window_frame", "window_frame_modifier", "opt_window_frame_exclusion", 
		"window_frame_extents", "window_frame_extent", "window_frame_valexpr_modifier", 
		"opt_nulls_treatment", "nulls_treatment", "opt_from_first_last", "agg_quantifier", 
		"opt_filter", "opt_window_function", "window_function_details", "start_transaction", 
		"commit_transaction", "rollback_transaction", "start_or_begin", "opt_transaction", 
		"transaction", "opt_savepoint", "savepoint_name", "opt_isolation_level", 
		"isolation_level", "isolation_val", "set_transaction_isolation", "savepoint", 
		"opt_with_clause", "with_clause", "opt_namespace_name", "sequence_object_name", 
		"sequence_full_name", "sequence_stmt", "create_sequence", "sequence_name_options", 
		"sequence_name_option", "opt_seq_create_options", "seq_create_option", 
		"drop_sequence", "alter_sequence", "seq_alter_options", "seq_alter_option", 
		"sequence_with", "start_with", "restart_with", "increment_by", "maxvalue", 
		"minvalue", "cycle", "cache", "sequence_next", "sequence_prev", "sequence_expr",
	];
	public get grammarFileName(): string { return "n1ql.g4"; }
	public get literalNames(): (string | null)[] { return n1qlParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return n1qlParser.symbolicNames; }
	public get ruleNames(): string[] { return n1qlParser.ruleNames; }
	public get serializedATN(): number[] { return n1qlParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, n1qlParser._ATN, n1qlParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public input(): InputContext {
		let localctx: InputContext = new InputContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, n1qlParser.RULE_input);
		try {
			this.state = 649;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 0, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 644;
				this.stmt_body();
				this.state = 645;
				this.opt_trailer(0);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 647;
				this.expr_input();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 648;
				this.hints_input();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public permitted_identifiers(): Permitted_identifiersContext {
		let localctx: Permitted_identifiersContext = new Permitted_identifiersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, n1qlParser.RULE_permitted_identifiers);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 651;
			_la = this._input.LA(1);
			if(!(((((_la - 221)) & ~0x1F) === 0 && ((1 << (_la - 221)) & 31588353) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public opt_trailer(): Opt_trailerContext;
	public opt_trailer(_p: number): Opt_trailerContext;
	// @RuleVersion(0)
	public opt_trailer(_p?: number): Opt_trailerContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Opt_trailerContext = new Opt_trailerContext(this, this._ctx, _parentState);
		let _prevctx: Opt_trailerContext = localctx;
		let _startState: number = 4;
		this.enterRecursionRule(localctx, 4, n1qlParser.RULE_opt_trailer, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 658;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 1, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Opt_trailerContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_opt_trailer);
					this.state = 654;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 655;
					this.match(n1qlParser.SEMI);
					}
					}
				}
				this.state = 660;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 1, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public stmt_body(): Stmt_bodyContext {
		let localctx: Stmt_bodyContext = new Stmt_bodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, n1qlParser.RULE_stmt_body);
		try {
			this.state = 667;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 2, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 661;
				this.advise();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 662;
				this.explain();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 663;
				this.prepare();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 664;
				this.execute();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 665;
				this.explain_function();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 666;
				this.stmt();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public stmt(): StmtContext {
		let localctx: StmtContext = new StmtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 8, n1qlParser.RULE_stmt);
		try {
			this.state = 680;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 3, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 669;
				this.select_stmt();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 670;
				this.dml_stmt();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 671;
				this.ddl_stmt();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 672;
				this.infer();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 673;
				this.update_statistics();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 674;
				this.user_stmt();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 675;
				this.group_stmt();
				}
				break;
			case 8:
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 676;
				this.role_stmt();
				}
				break;
			case 9:
				this.enterOuterAlt(localctx, 9);
				{
				this.state = 677;
				this.function_stmt();
				}
				break;
			case 10:
				this.enterOuterAlt(localctx, 10);
				{
				this.state = 678;
				this.transaction_stmt();
				}
				break;
			case 11:
				this.enterOuterAlt(localctx, 11);
				{
				this.state = 679;
				this.sequence_stmt();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public advise(): AdviseContext {
		let localctx: AdviseContext = new AdviseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 10, n1qlParser.RULE_advise);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 682;
			this.match(n1qlParser.ADVISE);
			this.state = 683;
			this.opt_index();
			this.state = 684;
			this.stmt();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_index(): Opt_indexContext {
		let localctx: Opt_indexContext = new Opt_indexContext(this, this._ctx, this.state);
		this.enterRule(localctx, 12, n1qlParser.RULE_opt_index);
		try {
			this.state = 688;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 21:
			case 35:
			case 36:
			case 43:
			case 49:
			case 57:
			case 63:
			case 70:
			case 76:
			case 84:
			case 92:
			case 96:
			case 100:
			case 113:
			case 116:
			case 140:
			case 184:
			case 187:
			case 191:
			case 194:
			case 196:
			case 199:
			case 210:
			case 218:
			case 219:
			case 233:
			case 259:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 112:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 687;
				this.match(n1qlParser.INDEX);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public explain(): ExplainContext {
		let localctx: ExplainContext = new ExplainContext(this, this._ctx, this.state);
		this.enterRule(localctx, 14, n1qlParser.RULE_explain);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 690;
			this.match(n1qlParser.EXPLAIN);
			this.state = 691;
			this.stmt();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public explain_function(): Explain_functionContext {
		let localctx: Explain_functionContext = new Explain_functionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 16, n1qlParser.RULE_explain_function);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 693;
			this.match(n1qlParser.EXPLAIN);
			this.state = 694;
			this.match(n1qlParser.FUNCTION);
			this.state = 695;
			this.func_name();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public prepare(): PrepareContext {
		let localctx: PrepareContext = new PrepareContext(this, this._ctx, this.state);
		this.enterRule(localctx, 18, n1qlParser.RULE_prepare);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 697;
			this.match(n1qlParser.PREPARE);
			this.state = 698;
			this.opt_force();
			this.state = 699;
			this.opt_name();
			this.state = 700;
			this.stmt();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_force(): Opt_forceContext {
		let localctx: Opt_forceContext = new Opt_forceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 20, n1qlParser.RULE_opt_force);
		try {
			this.state = 704;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 21:
			case 35:
			case 36:
			case 43:
			case 49:
			case 57:
			case 63:
			case 70:
			case 76:
			case 84:
			case 92:
			case 96:
			case 100:
			case 113:
			case 116:
			case 140:
			case 184:
			case 187:
			case 191:
			case 194:
			case 196:
			case 199:
			case 210:
			case 218:
			case 219:
			case 221:
			case 233:
			case 237:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
			case 259:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 95:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 703;
				this.match(n1qlParser.FORCE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_name(): Opt_nameContext {
		let localctx: Opt_nameContext = new Opt_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 22, n1qlParser.RULE_opt_name);
		try {
			this.state = 715;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 21:
			case 35:
			case 36:
			case 43:
			case 49:
			case 57:
			case 63:
			case 70:
			case 76:
			case 84:
			case 92:
			case 96:
			case 100:
			case 113:
			case 116:
			case 140:
			case 184:
			case 187:
			case 191:
			case 194:
			case 196:
			case 199:
			case 210:
			case 218:
			case 219:
			case 233:
			case 259:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 221:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 707;
				this.permitted_identifiers();
				this.state = 708;
				this.from_or_as();
				}
				break;
			case 237:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 710;
				this.p__invalid_case_insensitive_identifier();
				this.state = 711;
				this.from_or_as();
				}
				break;
			case 1:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 713;
				this.match(n1qlParser.STR);
				this.state = 714;
				this.from_or_as();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public p__invalid_case_insensitive_identifier(): P__invalid_case_insensitive_identifierContext {
		let localctx: P__invalid_case_insensitive_identifierContext = new P__invalid_case_insensitive_identifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 24, n1qlParser.RULE_p__invalid_case_insensitive_identifier);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 717;
			this.match(n1qlParser.IDENT_ICASE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public from_or_as(): From_or_asContext {
		let localctx: From_or_asContext = new From_or_asContext(this, this._ctx, this.state);
		this.enterRule(localctx, 26, n1qlParser.RULE_from_or_as);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 719;
			_la = this._input.LA(1);
			if(!(_la===40 || _la===96)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public execute(): ExecuteContext {
		let localctx: ExecuteContext = new ExecuteContext(this, this._ctx, this.state);
		this.enterRule(localctx, 28, n1qlParser.RULE_execute);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 721;
			this.match(n1qlParser.EXECUTE);
			this.state = 722;
			this.expr(0);
			this.state = 723;
			this.opt_execute_using();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_execute_using(): Opt_execute_usingContext {
		let localctx: Opt_execute_usingContext = new Opt_execute_usingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 30, n1qlParser.RULE_opt_execute_using);
		try {
			this.state = 728;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 7, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 726;
				this.match(n1qlParser.USING);
				this.state = 727;
				this.construction_expr();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public infer(): InferContext {
		let localctx: InferContext = new InferContext(this, this._ctx, this.state);
		this.enterRule(localctx, 32, n1qlParser.RULE_infer);
		try {
			this.state = 747;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 8, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 730;
				this.match(n1qlParser.INFER);
				this.state = 731;
				this.keyspace_collection();
				this.state = 732;
				this.simple_keyspace_ref();
				this.state = 733;
				this.opt_infer_using();
				this.state = 734;
				this.opt_with_clause();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 736;
				this.match(n1qlParser.INFER);
				this.state = 737;
				this.keyspace_path();
				this.state = 738;
				this.opt_as_alias();
				this.state = 739;
				this.opt_infer_using();
				this.state = 740;
				this.opt_with_clause();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 742;
				this.match(n1qlParser.INFER);
				this.state = 743;
				this.expr(0);
				this.state = 744;
				this.opt_infer_using();
				this.state = 745;
				this.opt_with_clause();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public keyspace_collection(): Keyspace_collectionContext {
		let localctx: Keyspace_collectionContext = new Keyspace_collectionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 34, n1qlParser.RULE_keyspace_collection);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 749;
			_la = this._input.LA(1);
			if(!(_la===56 || _la===125)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_keyspace_collection(): Opt_keyspace_collectionContext {
		let localctx: Opt_keyspace_collectionContext = new Opt_keyspace_collectionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 36, n1qlParser.RULE_opt_keyspace_collection);
		try {
			this.state = 753;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 32:
			case 221:
			case 237:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 56:
			case 125:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 752;
				this.keyspace_collection();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_infer_using(): Opt_infer_usingContext {
		let localctx: Opt_infer_usingContext = new Opt_infer_usingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 38, n1qlParser.RULE_opt_infer_using);
		try {
			this.enterOuterAlt(localctx, 1);
			// tslint:disable-next-line:no-empty
			{
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public select_stmt(): Select_stmtContext {
		let localctx: Select_stmtContext = new Select_stmtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 40, n1qlParser.RULE_select_stmt);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 757;
			this.fullselect();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dml_stmt(): Dml_stmtContext {
		let localctx: Dml_stmtContext = new Dml_stmtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 42, n1qlParser.RULE_dml_stmt);
		try {
			this.state = 764;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 116:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 759;
				this.insert();
				}
				break;
			case 219:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 760;
				this.upsert();
				}
				break;
			case 70:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 761;
				this.delete_();
				}
				break;
			case 218:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 762;
				this.update();
				}
				break;
			case 140:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 763;
				this.merge();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public ddl_stmt(): Ddl_stmtContext {
		let localctx: Ddl_stmtContext = new Ddl_stmtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 44, n1qlParser.RULE_ddl_stmt);
		try {
			this.state = 770;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 11, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 766;
				this.index_stmt();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 767;
				this.bucket_stmt();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 768;
				this.scope_stmt();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 769;
				this.collection_stmt();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public user_stmt(): User_stmtContext {
		let localctx: User_stmtContext = new User_stmtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 46, n1qlParser.RULE_user_stmt);
		try {
			this.state = 775;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 63:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 772;
				this.create_user();
				}
				break;
			case 35:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 773;
				this.alter_user();
				}
				break;
			case 76:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 774;
				this.drop_user();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public group_stmt(): Group_stmtContext {
		let localctx: Group_stmtContext = new Group_stmtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 48, n1qlParser.RULE_group_stmt);
		try {
			this.state = 780;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 63:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 777;
				this.create_group();
				}
				break;
			case 35:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 778;
				this.alter_group();
				}
				break;
			case 76:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 779;
				this.drop_group();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public role_stmt(): Role_stmtContext {
		let localctx: Role_stmtContext = new Role_stmtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 50, n1qlParser.RULE_role_stmt);
		try {
			this.state = 784;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 100:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 782;
				this.grant_role();
				}
				break;
			case 184:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 783;
				this.revoke_role();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public index_stmt(): Index_stmtContext {
		let localctx: Index_stmtContext = new Index_stmtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 52, n1qlParser.RULE_index_stmt);
		try {
			this.state = 790;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 63:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 786;
				this.create_index();
				}
				break;
			case 76:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 787;
				this.drop_index();
				}
				break;
			case 35:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 788;
				this.alter_index();
				}
				break;
			case 49:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 789;
				this.build_index();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public bucket_stmt(): Bucket_stmtContext {
		let localctx: Bucket_stmtContext = new Bucket_stmtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 54, n1qlParser.RULE_bucket_stmt);
		try {
			this.state = 795;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 63:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 792;
				this.create_bucket();
				}
				break;
			case 35:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 793;
				this.alter_bucket();
				}
				break;
			case 76:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 794;
				this.drop_bucket();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public scope_stmt(): Scope_stmtContext {
		let localctx: Scope_stmtContext = new Scope_stmtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 56, n1qlParser.RULE_scope_stmt);
		try {
			this.state = 799;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 63:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 797;
				this.create_scope();
				}
				break;
			case 76:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 798;
				this.drop_scope();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public collection_stmt(): Collection_stmtContext {
		let localctx: Collection_stmtContext = new Collection_stmtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 58, n1qlParser.RULE_collection_stmt);
		try {
			this.state = 804;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 63:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 801;
				this.create_collection();
				}
				break;
			case 76:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 802;
				this.drop_collection();
				}
				break;
			case 92:
			case 210:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 803;
				this.flush_collection();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public function_stmt(): Function_stmtContext {
		let localctx: Function_stmtContext = new Function_stmtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 60, n1qlParser.RULE_function_stmt);
		try {
			this.state = 809;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 63:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 806;
				this.create_function();
				}
				break;
			case 76:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 807;
				this.drop_function();
				}
				break;
			case 84:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 808;
				this.execute_function();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public transaction_stmt(): Transaction_stmtContext {
		let localctx: Transaction_stmtContext = new Transaction_stmtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 62, n1qlParser.RULE_transaction_stmt);
		try {
			this.state = 816;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 43:
			case 199:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 811;
				this.start_transaction();
				}
				break;
			case 57:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 812;
				this.commit_transaction();
				}
				break;
			case 187:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 813;
				this.rollback_transaction();
				}
				break;
			case 191:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 814;
				this.savepoint();
				}
				break;
			case 196:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 815;
				this.set_transaction_isolation();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fullselect(): FullselectContext {
		let localctx: FullselectContext = new FullselectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 64, n1qlParser.RULE_fullselect);
		try {
			this.state = 847;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 21, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 818;
				this.select_terms(0);
				this.state = 819;
				this.opt_order_by();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 821;
				this.select_terms(0);
				this.state = 822;
				this.opt_order_by();
				this.state = 823;
				this.limit();
				this.state = 824;
				this.opt_offset();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 826;
				this.select_terms(0);
				this.state = 827;
				this.opt_order_by();
				this.state = 828;
				this.offset();
				this.state = 829;
				this.opt_limit();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 831;
				this.with_();
				this.state = 832;
				this.select_terms(0);
				this.state = 833;
				this.opt_order_by();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 835;
				this.with_();
				this.state = 836;
				this.select_terms(0);
				this.state = 837;
				this.opt_order_by();
				this.state = 838;
				this.limit();
				this.state = 839;
				this.opt_offset();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 841;
				this.with_();
				this.state = 842;
				this.select_terms(0);
				this.state = 843;
				this.opt_order_by();
				this.state = 844;
				this.offset();
				this.state = 845;
				this.opt_limit();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public select_terms(): Select_termsContext;
	public select_terms(_p: number): Select_termsContext;
	// @RuleVersion(0)
	public select_terms(_p?: number): Select_termsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Select_termsContext = new Select_termsContext(this, this._ctx, _parentState);
		let _prevctx: Select_termsContext = localctx;
		let _startState: number = 66;
		this.enterRecursionRule(localctx, 66, n1qlParser.RULE_select_terms, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 855;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 96:
			case 194:
				{
				this.state = 850;
				this.subselect();
				}
				break;
			case 21:
			case 259:
				{
				this.state = 851;
				this.subquery_expr();
				this.state = 852;
				this.setop();
				this.state = 853;
				this.select_term();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 863;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 23, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Select_termsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_select_terms);
					this.state = 857;
					if (!(this.precpred(this._ctx, 2))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
					}
					this.state = 858;
					this.setop();
					this.state = 859;
					this.select_term();
					}
					}
				}
				this.state = 865;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 23, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public select_term(): Select_termContext {
		let localctx: Select_termContext = new Select_termContext(this, this._ctx, this.state);
		this.enterRule(localctx, 68, n1qlParser.RULE_select_term);
		try {
			this.state = 868;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 96:
			case 194:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 866;
				this.subselect();
				}
				break;
			case 21:
			case 259:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 867;
				this.subquery_expr();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public subselect(): SubselectContext {
		let localctx: SubselectContext = new SubselectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 70, n1qlParser.RULE_subselect);
		try {
			this.state = 872;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 96:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 870;
				this.from_select();
				}
				break;
			case 194:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 871;
				this.select_from();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public from_select(): From_selectContext {
		let localctx: From_selectContext = new From_selectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 72, n1qlParser.RULE_from_select);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 874;
			this.from_();
			this.state = 875;
			this.opt_let();
			this.state = 876;
			this.opt_where();
			this.state = 877;
			this.opt_group();
			this.state = 878;
			this.opt_window_clause();
			this.state = 879;
			this.match(n1qlParser.SELECT);
			this.state = 880;
			this.opt_optim_hints();
			this.state = 881;
			this.projection();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public select_from(): Select_fromContext {
		let localctx: Select_fromContext = new Select_fromContext(this, this._ctx, this.state);
		this.enterRule(localctx, 74, n1qlParser.RULE_select_from);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 883;
			this.match(n1qlParser.SELECT);
			this.state = 884;
			this.opt_optim_hints();
			this.state = 885;
			this.projection();
			this.state = 886;
			this.opt_from();
			this.state = 887;
			this.opt_let();
			this.state = 888;
			this.opt_where();
			this.state = 889;
			this.opt_group();
			this.state = 890;
			this.opt_window_clause();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public setop(): SetopContext {
		let localctx: SetopContext = new SetopContext(this, this._ctx, this.state);
		this.enterRule(localctx, 76, n1qlParser.RULE_setop);
		try {
			this.state = 901;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 26, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 892;
				this.match(n1qlParser.UNION);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 893;
				this.match(n1qlParser.UNION);
				this.state = 894;
				this.match(n1qlParser.ALL);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 895;
				this.match(n1qlParser.INTERSECT);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 896;
				this.match(n1qlParser.INTERSECT);
				this.state = 897;
				this.match(n1qlParser.ALL);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 898;
				this.match(n1qlParser.EXCEPT);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 899;
				this.match(n1qlParser.EXCEPT);
				this.state = 900;
				this.match(n1qlParser.ALL);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_optim_hints(): Opt_optim_hintsContext {
		let localctx: Opt_optim_hintsContext = new Opt_optim_hintsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 78, n1qlParser.RULE_opt_optim_hints);
		try {
			this.state = 905;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 2:
			case 3:
			case 9:
			case 10:
			case 21:
			case 23:
			case 27:
			case 32:
			case 34:
			case 38:
			case 39:
			case 52:
			case 64:
			case 74:
			case 78:
			case 81:
			case 85:
			case 87:
			case 90:
			case 96:
			case 118:
			case 141:
			case 146:
			case 147:
			case 148:
			case 151:
			case 175:
			case 180:
			case 195:
			case 198:
			case 202:
			case 209:
			case 221:
			case 224:
			case 237:
			case 238:
			case 239:
			case 240:
			case 241:
			case 242:
			case 243:
			case 244:
			case 245:
			case 255:
			case 256:
			case 257:
			case 258:
			case 259:
			case 264:
			case 265:
			case 266:
			case 267:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 246:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 904;
				this.match(n1qlParser.OPTIM_HINTS);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public hints_input(): Hints_inputContext {
		let localctx: Hints_inputContext = new Hints_inputContext(this, this._ctx, this.state);
		this.enterRule(localctx, 80, n1qlParser.RULE_hints_input);
		try {
			this.state = 911;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 28, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 907;
				this.match(n1qlParser.PLUS);
				this.state = 908;
				this.optim_hints(0);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 909;
				this.match(n1qlParser.PLUS);
				this.state = 910;
				this.object();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public optim_hints(): Optim_hintsContext;
	public optim_hints(_p: number): Optim_hintsContext;
	// @RuleVersion(0)
	public optim_hints(_p?: number): Optim_hintsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Optim_hintsContext = new Optim_hintsContext(this, this._ctx, _parentState);
		let _prevctx: Optim_hintsContext = localctx;
		let _startState: number = 82;
		this.enterRecursionRule(localctx, 82, n1qlParser.RULE_optim_hints, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 914;
			this.optim_hint();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 920;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 29, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Optim_hintsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_optim_hints);
					this.state = 916;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 917;
					this.optim_hint();
					}
					}
				}
				this.state = 922;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 29, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public optim_hint(): Optim_hintContext {
		let localctx: Optim_hintContext = new Optim_hintContext(this, this._ctx, this.state);
		this.enterRule(localctx, 84, n1qlParser.RULE_optim_hint);
		try {
			this.state = 934;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 30, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 923;
				this.permitted_identifiers();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 924;
				this.permitted_identifiers();
				this.state = 925;
				this.match(n1qlParser.LPAREN);
				this.state = 926;
				this.opt_hint_args();
				this.state = 927;
				this.match(n1qlParser.RPAREN);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 929;
				this.match(n1qlParser.INDEX);
				this.state = 930;
				this.match(n1qlParser.LPAREN);
				this.state = 931;
				this.opt_hint_args();
				this.state = 932;
				this.match(n1qlParser.RPAREN);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_hint_args(): Opt_hint_argsContext {
		let localctx: Opt_hint_argsContext = new Opt_hint_argsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 86, n1qlParser.RULE_opt_hint_args);
		try {
			this.state = 938;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 22:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 221:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 937;
				this.hint_args(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public hint_args(): Hint_argsContext;
	public hint_args(_p: number): Hint_argsContext;
	// @RuleVersion(0)
	public hint_args(_p?: number): Hint_argsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Hint_argsContext = new Hint_argsContext(this, this._ctx, _parentState);
		let _prevctx: Hint_argsContext = localctx;
		let _startState: number = 88;
		this.enterRecursionRule(localctx, 88, n1qlParser.RULE_hint_args, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 950;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 32, this._ctx) ) {
			case 1:
				{
				this.state = 941;
				this.permitted_identifiers();
				}
				break;
			case 2:
				{
				this.state = 942;
				this.permitted_identifiers();
				this.state = 943;
				this.match(n1qlParser.DIV);
				this.state = 944;
				this.match(n1qlParser.BUILD);
				}
				break;
			case 3:
				{
				this.state = 946;
				this.permitted_identifiers();
				this.state = 947;
				this.match(n1qlParser.DIV);
				this.state = 948;
				this.match(n1qlParser.PROBE);
				}
				break;
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 956;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 33, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Hint_argsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_hint_args);
					this.state = 952;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 953;
					this.permitted_identifiers();
					}
					}
				}
				this.state = 958;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 33, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public projection(): ProjectionContext {
		let localctx: ProjectionContext = new ProjectionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 90, n1qlParser.RULE_projection);
		try {
			this.state = 968;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 34, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 959;
				this.opt_quantifier();
				this.state = 960;
				this.projects(0);
				this.state = 961;
				this.opt_exclude();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 963;
				this.opt_quantifier();
				this.state = 964;
				this.raw();
				this.state = 965;
				this.expr(0);
				this.state = 966;
				this.opt_as_alias();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_quantifier(): Opt_quantifierContext {
		let localctx: Opt_quantifierContext = new Opt_quantifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 92, n1qlParser.RULE_opt_quantifier);
		try {
			this.state = 973;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 2:
			case 3:
			case 9:
			case 10:
			case 21:
			case 23:
			case 27:
			case 32:
			case 38:
			case 39:
			case 52:
			case 64:
			case 78:
			case 81:
			case 85:
			case 87:
			case 90:
			case 141:
			case 146:
			case 147:
			case 148:
			case 151:
			case 175:
			case 180:
			case 195:
			case 198:
			case 202:
			case 209:
			case 221:
			case 224:
			case 237:
			case 238:
			case 239:
			case 240:
			case 241:
			case 242:
			case 243:
			case 244:
			case 245:
			case 255:
			case 256:
			case 257:
			case 258:
			case 259:
			case 264:
			case 265:
			case 266:
			case 267:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 34:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 971;
				this.match(n1qlParser.ALL);
				}
				break;
			case 74:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 972;
				this.match(n1qlParser.DISTINCT);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_exclude(): Opt_excludeContext {
		let localctx: Opt_excludeContext = new Opt_excludeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 94, n1qlParser.RULE_opt_exclude);
		try {
			this.state = 978;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 36, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 976;
				this.match(n1qlParser.EXCLUDE);
				this.state = 977;
				this.exprs(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public raw(): RawContext {
		let localctx: RawContext = new RawContext(this, this._ctx, this.state);
		this.enterRule(localctx, 96, n1qlParser.RULE_raw);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 980;
			_la = this._input.LA(1);
			if(!(_la===78 || _la===175 || _la===224)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public projects(): ProjectsContext;
	public projects(_p: number): ProjectsContext;
	// @RuleVersion(0)
	public projects(_p?: number): ProjectsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: ProjectsContext = new ProjectsContext(this, this._ctx, _parentState);
		let _prevctx: ProjectsContext = localctx;
		let _startState: number = 98;
		this.enterRecursionRule(localctx, 98, n1qlParser.RULE_projects, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 983;
			this.project();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 990;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 37, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new ProjectsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_projects);
					this.state = 985;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 986;
					this.match(n1qlParser.COMMA);
					this.state = 987;
					this.project();
					}
					}
				}
				this.state = 992;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 37, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public project(): ProjectContext {
		let localctx: ProjectContext = new ProjectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 100, n1qlParser.RULE_project);
		try {
			this.state = 1001;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 38, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 993;
				this.match(n1qlParser.STAR);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 994;
				this.expr(0);
				this.state = 995;
				this.match(n1qlParser.DOT);
				this.state = 996;
				this.match(n1qlParser.STAR);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 998;
				this.expr(0);
				this.state = 999;
				this.opt_as_alias();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_as_alias(): Opt_as_aliasContext {
		let localctx: Opt_as_aliasContext = new Opt_as_aliasContext(this, this._ctx, this.state);
		this.enterRule(localctx, 102, n1qlParser.RULE_opt_as_alias);
		try {
			this.state = 1005;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 39, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1004;
				this.as_alias();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public as_alias(): As_aliasContext {
		let localctx: As_aliasContext = new As_aliasContext(this, this._ctx, this.state);
		this.enterRule(localctx, 104, n1qlParser.RULE_as_alias);
		try {
			this.state = 1010;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 221:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1007;
				this.alias();
				}
				break;
			case 40:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1008;
				this.match(n1qlParser.AS);
				this.state = 1009;
				this.alias();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public alias(): AliasContext {
		let localctx: AliasContext = new AliasContext(this, this._ctx, this.state);
		this.enterRule(localctx, 106, n1qlParser.RULE_alias);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1012;
			this.permitted_identifiers();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_from(): Opt_fromContext {
		let localctx: Opt_fromContext = new Opt_fromContext(this, this._ctx, this.state);
		this.enterRule(localctx, 108, n1qlParser.RULE_opt_from);
		try {
			this.state = 1016;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 41, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1015;
				this.from_();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public from_(): FromContext {
		let localctx: FromContext = new FromContext(this, this._ctx, this.state);
		this.enterRule(localctx, 110, n1qlParser.RULE_from);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1018;
			this.match(n1qlParser.FROM);
			this.state = 1019;
			this.from_terms(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public from_terms(): From_termsContext;
	public from_terms(_p: number): From_termsContext;
	// @RuleVersion(0)
	public from_terms(_p?: number): From_termsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: From_termsContext = new From_termsContext(this, this._ctx, _parentState);
		let _prevctx: From_termsContext = localctx;
		let _startState: number = 112;
		this.enterRecursionRule(localctx, 112, n1qlParser.RULE_from_terms, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 1022;
			this.from_term(0);
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1033;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 43, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 1031;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 42, this._ctx) ) {
					case 1:
						{
						localctx = new From_termsContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_terms);
						this.state = 1024;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 1025;
						this.match(n1qlParser.COMMA);
						this.state = 1026;
						this.from_term(0);
						}
						break;
					case 2:
						{
						localctx = new From_termsContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_terms);
						this.state = 1027;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 1028;
						this.match(n1qlParser.COMMA);
						this.state = 1029;
						this.match(n1qlParser.LATERAL);
						this.state = 1030;
						this.from_term(0);
						}
						break;
					}
					}
				}
				this.state = 1035;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 43, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}

	public from_term(): From_termContext;
	public from_term(_p: number): From_termContext;
	// @RuleVersion(0)
	public from_term(_p?: number): From_termContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: From_termContext = new From_termContext(this, this._ctx, _parentState);
		let _prevctx: From_termContext = localctx;
		let _startState: number = 114;
		this.enterRecursionRule(localctx, 114, n1qlParser.RULE_from_term, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1055;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 44, this._ctx) ) {
			case 1:
				{
				this.state = 1037;
				this.simple_from_term();
				}
				break;
			case 2:
				{
				this.state = 1038;
				this.simple_from_term();
				this.state = 1039;
				this.match(n1qlParser.RIGHT);
				this.state = 1040;
				this.opt_outer();
				this.state = 1041;
				this.match(n1qlParser.JOIN);
				this.state = 1042;
				this.simple_from_term();
				this.state = 1043;
				this.match(n1qlParser.ON);
				this.state = 1044;
				this.expr(0);
				}
				break;
			case 3:
				{
				this.state = 1046;
				this.simple_from_term();
				this.state = 1047;
				this.match(n1qlParser.RIGHT);
				this.state = 1048;
				this.opt_outer();
				this.state = 1049;
				this.match(n1qlParser.JOIN);
				this.state = 1050;
				this.match(n1qlParser.LATERAL);
				this.state = 1051;
				this.simple_from_term();
				this.state = 1052;
				this.match(n1qlParser.ON);
				this.state = 1053;
				this.expr(0);
				}
				break;
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1155;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 46, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 1153;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 45, this._ctx) ) {
					case 1:
						{
						localctx = new From_termContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_term);
						this.state = 1057;
						if (!(this.precpred(this._ctx, 15))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 15)");
						}
						this.state = 1058;
						this.opt_join_type();
						this.state = 1059;
						this.match(n1qlParser.JOIN);
						this.state = 1060;
						this.simple_from_term();
						this.state = 1061;
						this.on_keys();
						}
						break;
					case 2:
						{
						localctx = new From_termContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_term);
						this.state = 1063;
						if (!(this.precpred(this._ctx, 14))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
						}
						this.state = 1064;
						this.opt_join_type();
						this.state = 1065;
						this.match(n1qlParser.JOIN);
						this.state = 1066;
						this.match(n1qlParser.LATERAL);
						this.state = 1067;
						this.simple_from_term();
						this.state = 1068;
						this.on_keys();
						}
						break;
					case 3:
						{
						localctx = new From_termContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_term);
						this.state = 1070;
						if (!(this.precpred(this._ctx, 13))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 13)");
						}
						this.state = 1071;
						this.opt_join_type();
						this.state = 1072;
						this.match(n1qlParser.JOIN);
						this.state = 1073;
						this.simple_from_term();
						this.state = 1074;
						this.on_key();
						this.state = 1075;
						this.match(n1qlParser.FOR);
						this.state = 1076;
						this.permitted_identifiers();
						}
						break;
					case 4:
						{
						localctx = new From_termContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_term);
						this.state = 1078;
						if (!(this.precpred(this._ctx, 12))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
						}
						this.state = 1079;
						this.opt_join_type();
						this.state = 1080;
						this.match(n1qlParser.JOIN);
						this.state = 1081;
						this.match(n1qlParser.LATERAL);
						this.state = 1082;
						this.simple_from_term();
						this.state = 1083;
						this.on_key();
						this.state = 1084;
						this.match(n1qlParser.FOR);
						this.state = 1085;
						this.permitted_identifiers();
						}
						break;
					case 5:
						{
						localctx = new From_termContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_term);
						this.state = 1087;
						if (!(this.precpred(this._ctx, 11))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 11)");
						}
						this.state = 1088;
						this.opt_join_type();
						this.state = 1089;
						this.match(n1qlParser.NEST);
						this.state = 1090;
						this.simple_from_term();
						this.state = 1091;
						this.on_keys();
						}
						break;
					case 6:
						{
						localctx = new From_termContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_term);
						this.state = 1093;
						if (!(this.precpred(this._ctx, 10))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 10)");
						}
						this.state = 1094;
						this.opt_join_type();
						this.state = 1095;
						this.match(n1qlParser.NEST);
						this.state = 1096;
						this.match(n1qlParser.LATERAL);
						this.state = 1097;
						this.simple_from_term();
						this.state = 1098;
						this.on_keys();
						}
						break;
					case 7:
						{
						localctx = new From_termContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_term);
						this.state = 1100;
						if (!(this.precpred(this._ctx, 9))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
						}
						this.state = 1101;
						this.opt_join_type();
						this.state = 1102;
						this.match(n1qlParser.NEST);
						this.state = 1103;
						this.simple_from_term();
						this.state = 1104;
						this.on_key();
						this.state = 1105;
						this.match(n1qlParser.FOR);
						this.state = 1106;
						this.permitted_identifiers();
						}
						break;
					case 8:
						{
						localctx = new From_termContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_term);
						this.state = 1108;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 1109;
						this.opt_join_type();
						this.state = 1110;
						this.match(n1qlParser.NEST);
						this.state = 1111;
						this.match(n1qlParser.LATERAL);
						this.state = 1112;
						this.simple_from_term();
						this.state = 1113;
						this.on_key();
						this.state = 1114;
						this.match(n1qlParser.FOR);
						this.state = 1115;
						this.permitted_identifiers();
						}
						break;
					case 9:
						{
						localctx = new From_termContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_term);
						this.state = 1117;
						if (!(this.precpred(this._ctx, 7))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
						}
						this.state = 1118;
						this.opt_join_type();
						this.state = 1119;
						this.unnest();
						this.state = 1120;
						this.expr(0);
						this.state = 1121;
						this.opt_as_alias();
						}
						break;
					case 10:
						{
						localctx = new From_termContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_term);
						this.state = 1123;
						if (!(this.precpred(this._ctx, 6))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 6)");
						}
						this.state = 1124;
						this.opt_join_type();
						this.state = 1125;
						this.match(n1qlParser.JOIN);
						this.state = 1126;
						this.simple_from_term();
						this.state = 1127;
						this.match(n1qlParser.ON);
						this.state = 1128;
						this.expr(0);
						}
						break;
					case 11:
						{
						localctx = new From_termContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_term);
						this.state = 1130;
						if (!(this.precpred(this._ctx, 5))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
						}
						this.state = 1131;
						this.opt_join_type();
						this.state = 1132;
						this.match(n1qlParser.JOIN);
						this.state = 1133;
						this.match(n1qlParser.LATERAL);
						this.state = 1134;
						this.simple_from_term();
						this.state = 1135;
						this.match(n1qlParser.ON);
						this.state = 1136;
						this.expr(0);
						}
						break;
					case 12:
						{
						localctx = new From_termContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_term);
						this.state = 1138;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 1139;
						this.opt_join_type();
						this.state = 1140;
						this.match(n1qlParser.NEST);
						this.state = 1141;
						this.simple_from_term();
						this.state = 1142;
						this.match(n1qlParser.ON);
						this.state = 1143;
						this.expr(0);
						}
						break;
					case 13:
						{
						localctx = new From_termContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_from_term);
						this.state = 1145;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 1146;
						this.opt_join_type();
						this.state = 1147;
						this.match(n1qlParser.NEST);
						this.state = 1148;
						this.match(n1qlParser.LATERAL);
						this.state = 1149;
						this.simple_from_term();
						this.state = 1150;
						this.match(n1qlParser.ON);
						this.state = 1151;
						this.expr(0);
						}
						break;
					}
					}
				}
				this.state = 1157;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 46, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public simple_from_term(): Simple_from_termContext {
		let localctx: Simple_from_termContext = new Simple_from_termContext(this, this._ctx, this.state);
		this.enterRule(localctx, 116, n1qlParser.RULE_simple_from_term);
		try {
			this.state = 1163;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 47, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1158;
				this.keyspace_term();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1159;
				this.expr(0);
				this.state = 1160;
				this.opt_as_alias();
				this.state = 1161;
				this.opt_use();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public unnest(): UnnestContext {
		let localctx: UnnestContext = new UnnestContext(this, this._ctx, this.state);
		this.enterRule(localctx, 118, n1qlParser.RULE_unnest);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1165;
			_la = this._input.LA(1);
			if(!(_la===91 || _la===216)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public keyspace_term(): Keyspace_termContext {
		let localctx: Keyspace_termContext = new Keyspace_termContext(this, this._ctx, this.state);
		this.enterRule(localctx, 120, n1qlParser.RULE_keyspace_term);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1167;
			this.keyspace_path();
			this.state = 1168;
			this.opt_as_alias();
			this.state = 1169;
			this.opt_use();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public keyspace_path(): Keyspace_pathContext {
		let localctx: Keyspace_pathContext = new Keyspace_pathContext(this, this._ctx, this.state);
		this.enterRule(localctx, 122, n1qlParser.RULE_keyspace_path);
		try {
			this.state = 1181;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 48, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1171;
				this.namespace_term();
				this.state = 1172;
				this.keyspace_name();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1174;
				this.namespace_term();
				this.state = 1175;
				this.path_part();
				this.state = 1176;
				this.match(n1qlParser.DOT);
				this.state = 1177;
				this.path_part();
				this.state = 1178;
				this.match(n1qlParser.DOT);
				this.state = 1179;
				this.keyspace_name();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public namespace_term(): Namespace_termContext {
		let localctx: Namespace_termContext = new Namespace_termContext(this, this._ctx, this.state);
		this.enterRule(localctx, 124, n1qlParser.RULE_namespace_term);
		try {
			this.state = 1186;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 32:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1183;
				this.namespace_name();
				}
				break;
			case 202:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1184;
				this.match(n1qlParser.SYSTEM);
				this.state = 1185;
				this.match(n1qlParser.COLON);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public namespace_name(): Namespace_nameContext {
		let localctx: Namespace_nameContext = new Namespace_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 126, n1qlParser.RULE_namespace_name);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1188;
			this.match(n1qlParser.NAMESPACE_ID);
			this.state = 1189;
			this.match(n1qlParser.COLON);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public path_part(): Path_partContext {
		let localctx: Path_partContext = new Path_partContext(this, this._ctx, this.state);
		this.enterRule(localctx, 128, n1qlParser.RULE_path_part);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1191;
			this.permitted_identifiers();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public keyspace_name(): Keyspace_nameContext {
		let localctx: Keyspace_nameContext = new Keyspace_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 130, n1qlParser.RULE_keyspace_name);
		try {
			this.state = 1195;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 221:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1193;
				this.permitted_identifiers();
				}
				break;
			case 237:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1194;
				this.p__invalid_case_insensitive_identifier();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_use(): Opt_useContext {
		let localctx: Opt_useContext = new Opt_useContext(this, this._ctx, this.state);
		this.enterRule(localctx, 132, n1qlParser.RULE_opt_use);
		try {
			this.state = 1200;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 51, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1198;
				this.match(n1qlParser.USE);
				this.state = 1199;
				this.use_options();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public use_options(): Use_optionsContext {
		let localctx: Use_optionsContext = new Use_optionsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 134, n1qlParser.RULE_use_options);
		try {
			this.state = 1217;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 52, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1202;
				this.use_keys();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1203;
				this.use_index();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1204;
				this.join_hint();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1205;
				this.use_index();
				this.state = 1206;
				this.join_hint();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1208;
				this.join_hint();
				this.state = 1209;
				this.use_index();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1211;
				this.use_keys();
				this.state = 1212;
				this.join_hint();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 1214;
				this.join_hint();
				this.state = 1215;
				this.use_keys();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public use_keys(): Use_keysContext {
		let localctx: Use_keysContext = new Use_keysContext(this, this._ctx, this.state);
		this.enterRule(localctx, 136, n1qlParser.RULE_use_keys);
		try {
			this.state = 1228;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 53, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1219;
				this.opt_primary();
				this.state = 1220;
				this.match(n1qlParser.KEYS);
				this.state = 1221;
				this.expr(0);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1223;
				this.opt_primary();
				this.state = 1224;
				this.match(n1qlParser.KEYS);
				this.state = 1225;
				this.match(n1qlParser.VALIDATE);
				this.state = 1226;
				this.expr(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public use_index(): Use_indexContext {
		let localctx: Use_indexContext = new Use_indexContext(this, this._ctx, this.state);
		this.enterRule(localctx, 138, n1qlParser.RULE_use_index);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1230;
			this.match(n1qlParser.INDEX);
			this.state = 1231;
			this.match(n1qlParser.LPAREN);
			this.state = 1232;
			this.index_refs(0);
			this.state = 1233;
			this.match(n1qlParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public join_hint(): Join_hintContext {
		let localctx: Join_hintContext = new Join_hintContext(this, this._ctx, this.state);
		this.enterRule(localctx, 140, n1qlParser.RULE_join_hint);
		try {
			this.state = 1241;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 104:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1235;
				this.match(n1qlParser.HASH);
				this.state = 1236;
				this.match(n1qlParser.LPAREN);
				this.state = 1237;
				this.use_hash_option();
				this.state = 1238;
				this.match(n1qlParser.RPAREN);
				}
				break;
			case 144:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1240;
				this.match(n1qlParser.NL);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_primary(): Opt_primaryContext {
		let localctx: Opt_primaryContext = new Opt_primaryContext(this, this._ctx, this.state);
		this.enterRule(localctx, 142, n1qlParser.RULE_opt_primary);
		try {
			this.state = 1245;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 123:
			case 124:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 168:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1244;
				this.match(n1qlParser.PRIMARY);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public index_refs(): Index_refsContext;
	public index_refs(_p: number): Index_refsContext;
	// @RuleVersion(0)
	public index_refs(_p?: number): Index_refsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Index_refsContext = new Index_refsContext(this, this._ctx, _parentState);
		let _prevctx: Index_refsContext = localctx;
		let _startState: number = 144;
		this.enterRecursionRule(localctx, 144, n1qlParser.RULE_index_refs, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 1248;
			this.index_ref();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1255;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 56, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Index_refsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_index_refs);
					this.state = 1250;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1251;
					this.match(n1qlParser.COMMA);
					this.state = 1252;
					this.index_ref();
					}
					}
				}
				this.state = 1257;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 56, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public index_ref(): Index_refContext {
		let localctx: Index_refContext = new Index_refContext(this, this._ctx, this.state);
		this.enterRule(localctx, 146, n1qlParser.RULE_index_ref);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1258;
			this.opt_index_name();
			this.state = 1259;
			this.opt_index_using();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public use_hash_option(): Use_hash_optionContext {
		let localctx: Use_hash_optionContext = new Use_hash_optionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 148, n1qlParser.RULE_use_hash_option);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1261;
			_la = this._input.LA(1);
			if(!(_la===49 || _la===172)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_use_del_upd(): Opt_use_del_updContext {
		let localctx: Opt_use_del_updContext = new Opt_use_del_updContext(this, this._ctx, this.state);
		this.enterRule(localctx, 150, n1qlParser.RULE_opt_use_del_upd);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1263;
			this.opt_use();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_join_type(): Opt_join_typeContext {
		let localctx: Opt_join_typeContext = new Opt_join_typeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 152, n1qlParser.RULE_opt_join_type);
		try {
			this.state = 1269;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 91:
			case 122:
			case 143:
			case 216:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 115:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1266;
				this.match(n1qlParser.INNER);
				}
				break;
			case 129:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1267;
				this.match(n1qlParser.LEFT);
				this.state = 1268;
				this.opt_outer();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_outer(): Opt_outerContext {
		let localctx: Opt_outerContext = new Opt_outerContext(this, this._ctx, this.state);
		this.enterRule(localctx, 154, n1qlParser.RULE_opt_outer);
		try {
			this.state = 1273;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 91:
			case 122:
			case 143:
			case 216:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 159:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1272;
				this.match(n1qlParser.OUTER);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public on_keys(): On_keysContext {
		let localctx: On_keysContext = new On_keysContext(this, this._ctx, this.state);
		this.enterRule(localctx, 156, n1qlParser.RULE_on_keys);
		try {
			this.state = 1286;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 59, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1275;
				this.match(n1qlParser.ON);
				this.state = 1276;
				this.opt_primary();
				this.state = 1277;
				this.match(n1qlParser.KEYS);
				this.state = 1278;
				this.expr(0);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1280;
				this.match(n1qlParser.ON);
				this.state = 1281;
				this.opt_primary();
				this.state = 1282;
				this.match(n1qlParser.KEYS);
				this.state = 1283;
				this.match(n1qlParser.VALIDATE);
				this.state = 1284;
				this.expr(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public on_key(): On_keyContext {
		let localctx: On_keyContext = new On_keyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 158, n1qlParser.RULE_on_key);
		try {
			this.state = 1299;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 60, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1288;
				this.match(n1qlParser.ON);
				this.state = 1289;
				this.opt_primary();
				this.state = 1290;
				this.match(n1qlParser.KEY);
				this.state = 1291;
				this.expr(0);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1293;
				this.match(n1qlParser.ON);
				this.state = 1294;
				this.opt_primary();
				this.state = 1295;
				this.match(n1qlParser.KEY);
				this.state = 1296;
				this.match(n1qlParser.VALIDATE);
				this.state = 1297;
				this.expr(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_let(): Opt_letContext {
		let localctx: Opt_letContext = new Opt_letContext(this, this._ctx, this.state);
		this.enterRule(localctx, 160, n1qlParser.RULE_opt_let);
		try {
			this.state = 1303;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 61, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1302;
				this.let_();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public let_(): Let_Context {
		let localctx: Let_Context = new Let_Context(this, this._ctx, this.state);
		this.enterRule(localctx, 162, n1qlParser.RULE_let_);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1305;
			this.match(n1qlParser.LET_);
			this.state = 1306;
			this.bindings(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public bindings(): BindingsContext;
	public bindings(_p: number): BindingsContext;
	// @RuleVersion(0)
	public bindings(_p?: number): BindingsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: BindingsContext = new BindingsContext(this, this._ctx, _parentState);
		let _prevctx: BindingsContext = localctx;
		let _startState: number = 164;
		this.enterRecursionRule(localctx, 164, n1qlParser.RULE_bindings, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 1309;
			this.binding();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1316;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 62, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new BindingsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_bindings);
					this.state = 1311;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1312;
					this.match(n1qlParser.COMMA);
					this.state = 1313;
					this.binding();
					}
					}
				}
				this.state = 1318;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 62, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public binding(): BindingContext {
		let localctx: BindingContext = new BindingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 166, n1qlParser.RULE_binding);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1319;
			this.alias();
			this.state = 1320;
			this.match(n1qlParser.EQ);
			this.state = 1321;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public with_(): WithContext {
		let localctx: WithContext = new WithContext(this, this._ctx, this.state);
		this.enterRule(localctx, 168, n1qlParser.RULE_with);
		try {
			this.state = 1328;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 63, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1323;
				this.match(n1qlParser.WITH);
				this.state = 1324;
				this.with_list(0);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1325;
				this.match(n1qlParser.WITH);
				this.state = 1326;
				this.match(n1qlParser.RECURSIVE);
				this.state = 1327;
				this.with_list(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public with_list(): With_listContext;
	public with_list(_p: number): With_listContext;
	// @RuleVersion(0)
	public with_list(_p?: number): With_listContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: With_listContext = new With_listContext(this, this._ctx, _parentState);
		let _prevctx: With_listContext = localctx;
		let _startState: number = 170;
		this.enterRecursionRule(localctx, 170, n1qlParser.RULE_with_list, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 1331;
			this.with_term();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1338;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 64, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new With_listContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_with_list);
					this.state = 1333;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1334;
					this.match(n1qlParser.COMMA);
					this.state = 1335;
					this.with_term();
					}
					}
				}
				this.state = 1340;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 64, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public with_term(): With_termContext {
		let localctx: With_termContext = new With_termContext(this, this._ctx, this.state);
		this.enterRule(localctx, 172, n1qlParser.RULE_with_term);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1341;
			this.alias();
			this.state = 1342;
			this.match(n1qlParser.AS);
			this.state = 1343;
			this.paren_expr();
			this.state = 1344;
			this.opt_cycle_clause();
			this.state = 1345;
			this.opt_option_clause();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_option_clause(): Opt_option_clauseContext {
		let localctx: Opt_option_clauseContext = new Opt_option_clauseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 174, n1qlParser.RULE_opt_option_clause);
		try {
			this.state = 1350;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 65, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1348;
				this.match(n1qlParser.OPTIONS);
				this.state = 1349;
				this.object();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_cycle_clause(): Opt_cycle_clauseContext {
		let localctx: Opt_cycle_clauseContext = new Opt_cycle_clauseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 176, n1qlParser.RULE_opt_cycle_clause);
		try {
			this.state = 1357;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 66, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1353;
				this.match(n1qlParser.CYCLE);
				this.state = 1354;
				this.exprs(0);
				this.state = 1355;
				this.match(n1qlParser.RESTRICT);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_where(): Opt_whereContext {
		let localctx: Opt_whereContext = new Opt_whereContext(this, this._ctx, this.state);
		this.enterRule(localctx, 178, n1qlParser.RULE_opt_where);
		try {
			this.state = 1361;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 67, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1360;
				this.where();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public where(): WhereContext {
		let localctx: WhereContext = new WhereContext(this, this._ctx, this.state);
		this.enterRule(localctx, 180, n1qlParser.RULE_where);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1363;
			this.match(n1qlParser.WHERE);
			this.state = 1364;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_group(): Opt_groupContext {
		let localctx: Opt_groupContext = new Opt_groupContext(this, this._ctx, this.state);
		this.enterRule(localctx, 182, n1qlParser.RULE_opt_group);
		try {
			this.state = 1368;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 68, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1367;
				this.group();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public group(): GroupContext {
		let localctx: GroupContext = new GroupContext(this, this._ctx, this.state);
		this.enterRule(localctx, 184, n1qlParser.RULE_group);
		try {
			this.state = 1378;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 101:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1370;
				this.match(n1qlParser.GROUP);
				this.state = 1371;
				this.match(n1qlParser.BY);
				this.state = 1372;
				this.group_terms(0);
				this.state = 1373;
				this.opt_group_as();
				this.state = 1374;
				this.opt_letting();
				this.state = 1375;
				this.opt_having();
				}
				break;
			case 131:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1377;
				this.letting();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public group_terms(): Group_termsContext;
	public group_terms(_p: number): Group_termsContext;
	// @RuleVersion(0)
	public group_terms(_p?: number): Group_termsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Group_termsContext = new Group_termsContext(this, this._ctx, _parentState);
		let _prevctx: Group_termsContext = localctx;
		let _startState: number = 186;
		this.enterRecursionRule(localctx, 186, n1qlParser.RULE_group_terms, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 1381;
			this.group_term();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1388;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 70, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Group_termsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_group_terms);
					this.state = 1383;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1384;
					this.match(n1qlParser.COMMA);
					this.state = 1385;
					this.group_term();
					}
					}
				}
				this.state = 1390;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 70, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public group_term(): Group_termContext {
		let localctx: Group_termContext = new Group_termContext(this, this._ctx, this.state);
		this.enterRule(localctx, 188, n1qlParser.RULE_group_term);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1391;
			this.expr(0);
			this.state = 1392;
			this.opt_as_alias();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_letting(): Opt_lettingContext {
		let localctx: Opt_lettingContext = new Opt_lettingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 190, n1qlParser.RULE_opt_letting);
		try {
			this.state = 1396;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 71, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1395;
				this.letting();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public letting(): LettingContext {
		let localctx: LettingContext = new LettingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 192, n1qlParser.RULE_letting);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1398;
			this.match(n1qlParser.LETTING);
			this.state = 1399;
			this.bindings(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_having(): Opt_havingContext {
		let localctx: Opt_havingContext = new Opt_havingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 194, n1qlParser.RULE_opt_having);
		try {
			this.state = 1403;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 72, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1402;
				this.having();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public having(): HavingContext {
		let localctx: HavingContext = new HavingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 196, n1qlParser.RULE_having);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1405;
			this.match(n1qlParser.HAVING);
			this.state = 1406;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_group_as(): Opt_group_asContext {
		let localctx: Opt_group_asContext = new Opt_group_asContext(this, this._ctx, this.state);
		this.enterRule(localctx, 198, n1qlParser.RULE_opt_group_as);
		try {
			this.state = 1412;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 73, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1409;
				this.match(n1qlParser.GROUP);
				this.state = 1410;
				this.match(n1qlParser.AS);
				this.state = 1411;
				this.permitted_identifiers();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_order_by(): Opt_order_byContext {
		let localctx: Opt_order_byContext = new Opt_order_byContext(this, this._ctx, this.state);
		this.enterRule(localctx, 200, n1qlParser.RULE_opt_order_by);
		try {
			this.state = 1416;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 74, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1415;
				this.order_by();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public order_by(): Order_byContext {
		let localctx: Order_byContext = new Order_byContext(this, this._ctx, this.state);
		this.enterRule(localctx, 202, n1qlParser.RULE_order_by);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1418;
			this.match(n1qlParser.ORDER);
			this.state = 1419;
			this.match(n1qlParser.BY);
			this.state = 1420;
			this.sort_terms(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public sort_terms(): Sort_termsContext;
	public sort_terms(_p: number): Sort_termsContext;
	// @RuleVersion(0)
	public sort_terms(_p?: number): Sort_termsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Sort_termsContext = new Sort_termsContext(this, this._ctx, _parentState);
		let _prevctx: Sort_termsContext = localctx;
		let _startState: number = 204;
		this.enterRecursionRule(localctx, 204, n1qlParser.RULE_sort_terms, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 1423;
			this.sort_term();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1430;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 75, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Sort_termsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_sort_terms);
					this.state = 1425;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1426;
					this.match(n1qlParser.COMMA);
					this.state = 1427;
					this.sort_term();
					}
					}
				}
				this.state = 1432;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 75, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sort_term(): Sort_termContext {
		let localctx: Sort_termContext = new Sort_termContext(this, this._ctx, this.state);
		this.enterRule(localctx, 206, n1qlParser.RULE_sort_term);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1433;
			this.expr(0);
			this.state = 1434;
			this.opt_dir();
			this.state = 1435;
			this.opt_order_nulls();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_dir(): Opt_dirContext {
		let localctx: Opt_dirContext = new Opt_dirContext(this, this._ctx, this.state);
		this.enterRule(localctx, 208, n1qlParser.RULE_opt_dir);
		try {
			this.state = 1439;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 76, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1438;
				this.dir();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dir(): DirContext {
		let localctx: DirContext = new DirContext(this, this._ctx, this.state);
		this.enterRule(localctx, 210, n1qlParser.RULE_dir);
		try {
			this.state = 1444;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 239:
			case 240:
			case 241:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1441;
				this.param_expr();
				}
				break;
			case 41:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1442;
				this.match(n1qlParser.ASC);
				}
				break;
			case 72:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1443;
				this.match(n1qlParser.DESC);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_order_nulls(): Opt_order_nullsContext {
		let localctx: Opt_order_nullsContext = new Opt_order_nullsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 212, n1qlParser.RULE_opt_order_nulls);
		try {
			this.state = 1453;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 78, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1447;
				this.match(n1qlParser.NULLS);
				this.state = 1448;
				this.match(n1qlParser.FIRST);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1449;
				this.match(n1qlParser.NULLS);
				this.state = 1450;
				this.match(n1qlParser.LAST);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1451;
				this.match(n1qlParser.NULLS);
				this.state = 1452;
				this.param_expr();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public first_last(): First_lastContext {
		let localctx: First_lastContext = new First_lastContext(this, this._ctx, this.state);
		this.enterRule(localctx, 214, n1qlParser.RULE_first_last);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1455;
			_la = this._input.LA(1);
			if(!(_la===90 || _la===128)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_limit(): Opt_limitContext {
		let localctx: Opt_limitContext = new Opt_limitContext(this, this._ctx, this.state);
		this.enterRule(localctx, 216, n1qlParser.RULE_opt_limit);
		try {
			this.state = 1459;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 79, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1458;
				this.limit();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public limit(): LimitContext {
		let localctx: LimitContext = new LimitContext(this, this._ctx, this.state);
		this.enterRule(localctx, 218, n1qlParser.RULE_limit);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1461;
			this.match(n1qlParser.LIMIT);
			this.state = 1462;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_offset(): Opt_offsetContext {
		let localctx: Opt_offsetContext = new Opt_offsetContext(this, this._ctx, this.state);
		this.enterRule(localctx, 220, n1qlParser.RULE_opt_offset);
		try {
			this.state = 1466;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 80, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1465;
				this.offset();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public offset(): OffsetContext {
		let localctx: OffsetContext = new OffsetContext(this, this._ctx, this.state);
		this.enterRule(localctx, 222, n1qlParser.RULE_offset);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1468;
			this.match(n1qlParser.OFFSET);
			this.state = 1469;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public insert(): InsertContext {
		let localctx: InsertContext = new InsertContext(this, this._ctx, this.state);
		this.enterRule(localctx, 224, n1qlParser.RULE_insert);
		try {
			this.state = 1487;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 81, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1471;
				this.match(n1qlParser.INSERT);
				this.state = 1472;
				this.match(n1qlParser.INTO);
				this.state = 1473;
				this.keyspace_ref();
				this.state = 1474;
				this.opt_values_header();
				this.state = 1475;
				this.values_list(0);
				this.state = 1476;
				this.opt_returning();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1478;
				this.match(n1qlParser.INSERT);
				this.state = 1479;
				this.match(n1qlParser.INTO);
				this.state = 1480;
				this.keyspace_ref();
				this.state = 1481;
				this.match(n1qlParser.LPAREN);
				this.state = 1482;
				this.key_val_options_expr_header();
				this.state = 1483;
				this.match(n1qlParser.RPAREN);
				this.state = 1484;
				this.fullselect();
				this.state = 1485;
				this.opt_returning();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public simple_keyspace_ref(): Simple_keyspace_refContext {
		let localctx: Simple_keyspace_refContext = new Simple_keyspace_refContext(this, this._ctx, this.state);
		this.enterRule(localctx, 226, n1qlParser.RULE_simple_keyspace_ref);
		try {
			this.state = 1507;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 82, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1489;
				this.keyspace_name();
				this.state = 1490;
				this.opt_as_alias();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1492;
				this.path_part();
				this.state = 1493;
				this.match(n1qlParser.DOT);
				this.state = 1494;
				this.path_part();
				this.state = 1495;
				this.opt_as_alias();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1497;
				this.keyspace_path();
				this.state = 1498;
				this.opt_as_alias();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1500;
				this.path_part();
				this.state = 1501;
				this.match(n1qlParser.DOT);
				this.state = 1502;
				this.path_part();
				this.state = 1503;
				this.match(n1qlParser.DOT);
				this.state = 1504;
				this.keyspace_name();
				this.state = 1505;
				this.opt_as_alias();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public keyspace_ref(): Keyspace_refContext {
		let localctx: Keyspace_refContext = new Keyspace_refContext(this, this._ctx, this.state);
		this.enterRule(localctx, 228, n1qlParser.RULE_keyspace_ref);
		try {
			this.state = 1513;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 32:
			case 202:
			case 221:
			case 237:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1509;
				this.simple_keyspace_ref();
				}
				break;
			case 239:
			case 240:
			case 241:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1510;
				this.param_expr();
				this.state = 1511;
				this.opt_as_alias();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_values_header(): Opt_values_headerContext {
		let localctx: Opt_values_headerContext = new Opt_values_headerContext(this, this._ctx, this.state);
		this.enterRule(localctx, 230, n1qlParser.RULE_opt_values_header);
		try {
			this.state = 1532;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 84, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1516;
				this.match(n1qlParser.LPAREN);
				this.state = 1517;
				this.opt_primary();
				this.state = 1518;
				this.match(n1qlParser.KEY);
				this.state = 1519;
				this.match(n1qlParser.COMMA);
				this.state = 1520;
				this.match(n1qlParser.VALUE);
				this.state = 1521;
				this.match(n1qlParser.RPAREN);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1523;
				this.match(n1qlParser.LPAREN);
				this.state = 1524;
				this.opt_primary();
				this.state = 1525;
				this.match(n1qlParser.KEY);
				this.state = 1526;
				this.match(n1qlParser.COMMA);
				this.state = 1527;
				this.match(n1qlParser.VALUE);
				this.state = 1528;
				this.match(n1qlParser.COMMA);
				this.state = 1529;
				this.match(n1qlParser.OPTIONS);
				this.state = 1530;
				this.match(n1qlParser.RPAREN);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public key(): KeyContext {
		let localctx: KeyContext = new KeyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 232, n1qlParser.RULE_key);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1534;
			this.opt_primary();
			this.state = 1535;
			this.match(n1qlParser.KEY);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public values_list(): Values_listContext;
	public values_list(_p: number): Values_listContext;
	// @RuleVersion(0)
	public values_list(_p?: number): Values_listContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Values_listContext = new Values_listContext(this, this._ctx, _parentState);
		let _prevctx: Values_listContext = localctx;
		let _startState: number = 234;
		this.enterRecursionRule(localctx, 234, n1qlParser.RULE_values_list, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 1538;
			this.values();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1545;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 85, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Values_listContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_values_list);
					this.state = 1540;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1541;
					this.match(n1qlParser.COMMA);
					this.state = 1542;
					this.next_values();
					}
					}
				}
				this.state = 1547;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 85, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public values(): ValuesContext {
		let localctx: ValuesContext = new ValuesContext(this, this._ctx, this.state);
		this.enterRule(localctx, 236, n1qlParser.RULE_values);
		try {
			this.state = 1552;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 86, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1548;
				this.match(n1qlParser.VALUES);
				this.state = 1549;
				this.key_val_expr();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1550;
				this.match(n1qlParser.VALUES);
				this.state = 1551;
				this.key_val_options_expr();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public next_values(): Next_valuesContext {
		let localctx: Next_valuesContext = new Next_valuesContext(this, this._ctx, this.state);
		this.enterRule(localctx, 238, n1qlParser.RULE_next_values);
		try {
			this.state = 1557;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 87, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1554;
				this.values();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1555;
				this.key_val_expr();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1556;
				this.key_val_options_expr();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public key_val_expr(): Key_val_exprContext {
		let localctx: Key_val_exprContext = new Key_val_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 240, n1qlParser.RULE_key_val_expr);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1559;
			this.match(n1qlParser.LPAREN);
			this.state = 1560;
			this.expr(0);
			this.state = 1561;
			this.match(n1qlParser.COMMA);
			this.state = 1562;
			this.expr(0);
			this.state = 1563;
			this.match(n1qlParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public key_val_options_expr(): Key_val_options_exprContext {
		let localctx: Key_val_options_exprContext = new Key_val_options_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 242, n1qlParser.RULE_key_val_options_expr);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1565;
			this.match(n1qlParser.LPAREN);
			this.state = 1566;
			this.expr(0);
			this.state = 1567;
			this.match(n1qlParser.COMMA);
			this.state = 1568;
			this.expr(0);
			this.state = 1569;
			this.match(n1qlParser.COMMA);
			this.state = 1570;
			this.expr(0);
			this.state = 1571;
			this.match(n1qlParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_returning(): Opt_returningContext {
		let localctx: Opt_returningContext = new Opt_returningContext(this, this._ctx, this.state);
		this.enterRule(localctx, 244, n1qlParser.RULE_opt_returning);
		try {
			this.state = 1575;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 88, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1574;
				this.returning();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public returning(): ReturningContext {
		let localctx: ReturningContext = new ReturningContext(this, this._ctx, this.state);
		this.enterRule(localctx, 246, n1qlParser.RULE_returning);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1577;
			this.match(n1qlParser.RETURNING);
			this.state = 1578;
			this.returns_();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public returns_(): Returns_Context {
		let localctx: Returns_Context = new Returns_Context(this, this._ctx, this.state);
		this.enterRule(localctx, 248, n1qlParser.RULE_returns_);
		try {
			this.state = 1584;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 2:
			case 3:
			case 9:
			case 10:
			case 21:
			case 23:
			case 27:
			case 32:
			case 38:
			case 39:
			case 52:
			case 64:
			case 81:
			case 85:
			case 87:
			case 90:
			case 141:
			case 146:
			case 147:
			case 148:
			case 151:
			case 180:
			case 195:
			case 198:
			case 202:
			case 209:
			case 221:
			case 237:
			case 238:
			case 239:
			case 240:
			case 241:
			case 242:
			case 243:
			case 244:
			case 245:
			case 255:
			case 256:
			case 257:
			case 258:
			case 259:
			case 264:
			case 265:
			case 266:
			case 267:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1580;
				this.projects(0);
				}
				break;
			case 78:
			case 175:
			case 224:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1581;
				this.raw();
				this.state = 1582;
				this.expr(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public key_expr_header(): Key_expr_headerContext {
		let localctx: Key_expr_headerContext = new Key_expr_headerContext(this, this._ctx, this.state);
		this.enterRule(localctx, 250, n1qlParser.RULE_key_expr_header);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1586;
			this.key();
			this.state = 1587;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public value_expr_header(): Value_expr_headerContext {
		let localctx: Value_expr_headerContext = new Value_expr_headerContext(this, this._ctx, this.state);
		this.enterRule(localctx, 252, n1qlParser.RULE_value_expr_header);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1589;
			this.match(n1qlParser.VALUE);
			this.state = 1590;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public options_expr_header(): Options_expr_headerContext {
		let localctx: Options_expr_headerContext = new Options_expr_headerContext(this, this._ctx, this.state);
		this.enterRule(localctx, 254, n1qlParser.RULE_options_expr_header);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1592;
			this.match(n1qlParser.OPTIONS);
			this.state = 1593;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public key_val_options_expr_header(): Key_val_options_expr_headerContext {
		let localctx: Key_val_options_expr_headerContext = new Key_val_options_expr_headerContext(this, this._ctx, this.state);
		this.enterRule(localctx, 256, n1qlParser.RULE_key_val_options_expr_header);
		try {
			this.state = 1610;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 90, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1595;
				this.key_expr_header();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1596;
				this.key_expr_header();
				this.state = 1597;
				this.match(n1qlParser.COMMA);
				this.state = 1598;
				this.value_expr_header();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1600;
				this.key_expr_header();
				this.state = 1601;
				this.match(n1qlParser.COMMA);
				this.state = 1602;
				this.value_expr_header();
				this.state = 1603;
				this.match(n1qlParser.COMMA);
				this.state = 1604;
				this.options_expr_header();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1606;
				this.key_expr_header();
				this.state = 1607;
				this.match(n1qlParser.COMMA);
				this.state = 1608;
				this.options_expr_header();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public upsert(): UpsertContext {
		let localctx: UpsertContext = new UpsertContext(this, this._ctx, this.state);
		this.enterRule(localctx, 258, n1qlParser.RULE_upsert);
		try {
			this.state = 1628;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 91, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1612;
				this.match(n1qlParser.UPSERT);
				this.state = 1613;
				this.match(n1qlParser.INTO);
				this.state = 1614;
				this.keyspace_ref();
				this.state = 1615;
				this.opt_values_header();
				this.state = 1616;
				this.values_list(0);
				this.state = 1617;
				this.opt_returning();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1619;
				this.match(n1qlParser.UPSERT);
				this.state = 1620;
				this.match(n1qlParser.INTO);
				this.state = 1621;
				this.keyspace_ref();
				this.state = 1622;
				this.match(n1qlParser.LPAREN);
				this.state = 1623;
				this.key_val_options_expr_header();
				this.state = 1624;
				this.match(n1qlParser.RPAREN);
				this.state = 1625;
				this.fullselect();
				this.state = 1626;
				this.opt_returning();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public delete_(): Delete_Context {
		let localctx: Delete_Context = new Delete_Context(this, this._ctx, this.state);
		this.enterRule(localctx, 260, n1qlParser.RULE_delete_);
		try {
			this.state = 1661;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 92, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1630;
				this.match(n1qlParser.DELETE_);
				this.state = 1631;
				this.opt_optim_hints();
				this.state = 1632;
				this.match(n1qlParser.FROM);
				this.state = 1633;
				this.keyspace_ref();
				this.state = 1634;
				this.opt_use_del_upd();
				this.state = 1635;
				this.opt_let();
				this.state = 1636;
				this.opt_where();
				this.state = 1637;
				this.limit();
				this.state = 1638;
				this.opt_offset();
				this.state = 1639;
				this.opt_returning();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1641;
				this.match(n1qlParser.DELETE_);
				this.state = 1642;
				this.opt_optim_hints();
				this.state = 1643;
				this.match(n1qlParser.FROM);
				this.state = 1644;
				this.keyspace_ref();
				this.state = 1645;
				this.opt_use_del_upd();
				this.state = 1646;
				this.opt_let();
				this.state = 1647;
				this.opt_where();
				this.state = 1648;
				this.offset();
				this.state = 1649;
				this.opt_limit();
				this.state = 1650;
				this.opt_returning();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1652;
				this.match(n1qlParser.DELETE_);
				this.state = 1653;
				this.opt_optim_hints();
				this.state = 1654;
				this.match(n1qlParser.FROM);
				this.state = 1655;
				this.keyspace_ref();
				this.state = 1656;
				this.opt_use_del_upd();
				this.state = 1657;
				this.opt_let();
				this.state = 1658;
				this.opt_where();
				this.state = 1659;
				this.opt_returning();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public update(): UpdateContext {
		let localctx: UpdateContext = new UpdateContext(this, this._ctx, this.state);
		this.enterRule(localctx, 262, n1qlParser.RULE_update);
		try {
			this.state = 1694;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 93, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1663;
				this.match(n1qlParser.UPDATE);
				this.state = 1664;
				this.opt_optim_hints();
				this.state = 1665;
				this.keyspace_ref();
				this.state = 1666;
				this.opt_use_del_upd();
				this.state = 1667;
				this.opt_let();
				this.state = 1668;
				this.set_();
				this.state = 1669;
				this.unset();
				this.state = 1670;
				this.opt_where();
				this.state = 1671;
				this.opt_limit();
				this.state = 1672;
				this.opt_returning();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1674;
				this.match(n1qlParser.UPDATE);
				this.state = 1675;
				this.opt_optim_hints();
				this.state = 1676;
				this.keyspace_ref();
				this.state = 1677;
				this.opt_use_del_upd();
				this.state = 1678;
				this.opt_let();
				this.state = 1679;
				this.set_();
				this.state = 1680;
				this.opt_where();
				this.state = 1681;
				this.opt_limit();
				this.state = 1682;
				this.opt_returning();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1684;
				this.match(n1qlParser.UPDATE);
				this.state = 1685;
				this.opt_optim_hints();
				this.state = 1686;
				this.keyspace_ref();
				this.state = 1687;
				this.opt_use_del_upd();
				this.state = 1688;
				this.opt_let();
				this.state = 1689;
				this.unset();
				this.state = 1690;
				this.opt_where();
				this.state = 1691;
				this.opt_limit();
				this.state = 1692;
				this.opt_returning();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public set_(): SetContext {
		let localctx: SetContext = new SetContext(this, this._ctx, this.state);
		this.enterRule(localctx, 264, n1qlParser.RULE_set);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1696;
			this.match(n1qlParser.SET);
			this.state = 1697;
			this.set_terms(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public set_terms(): Set_termsContext;
	public set_terms(_p: number): Set_termsContext;
	// @RuleVersion(0)
	public set_terms(_p?: number): Set_termsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Set_termsContext = new Set_termsContext(this, this._ctx, _parentState);
		let _prevctx: Set_termsContext = localctx;
		let _startState: number = 266;
		this.enterRecursionRule(localctx, 266, n1qlParser.RULE_set_terms, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 1700;
			this.set_term();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1707;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 94, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Set_termsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_set_terms);
					this.state = 1702;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1703;
					this.match(n1qlParser.COMMA);
					this.state = 1704;
					this.set_term();
					}
					}
				}
				this.state = 1709;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 94, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public set_term(): Set_termContext {
		let localctx: Set_termContext = new Set_termContext(this, this._ctx, this.state);
		this.enterRule(localctx, 268, n1qlParser.RULE_set_term);
		try {
			this.state = 1721;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 95, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1710;
				this.path(0);
				this.state = 1711;
				this.match(n1qlParser.EQ);
				this.state = 1712;
				this.expr(0);
				this.state = 1713;
				this.opt_update_for();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1715;
				this.function_meta_expr();
				this.state = 1716;
				this.match(n1qlParser.DOT);
				this.state = 1717;
				this.path(0);
				this.state = 1718;
				this.match(n1qlParser.EQ);
				this.state = 1719;
				this.expr(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public function_meta_expr(): Function_meta_exprContext {
		let localctx: Function_meta_exprContext = new Function_meta_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 270, n1qlParser.RULE_function_meta_expr);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1723;
			this.function_name();
			this.state = 1724;
			this.match(n1qlParser.LPAREN);
			this.state = 1725;
			this.opt_exprs();
			this.state = 1726;
			this.match(n1qlParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_update_for(): Opt_update_forContext {
		let localctx: Opt_update_forContext = new Opt_update_forContext(this, this._ctx, this.state);
		this.enterRule(localctx, 272, n1qlParser.RULE_opt_update_for);
		try {
			this.state = 1730;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 96, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1729;
				this.update_for();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public update_for(): Update_forContext {
		let localctx: Update_forContext = new Update_forContext(this, this._ctx, this.state);
		this.enterRule(localctx, 274, n1qlParser.RULE_update_for);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1732;
			this.update_dimensions(0);
			this.state = 1733;
			this.opt_when();
			this.state = 1734;
			this.match(n1qlParser.END);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public update_dimensions(): Update_dimensionsContext;
	public update_dimensions(_p: number): Update_dimensionsContext;
	// @RuleVersion(0)
	public update_dimensions(_p?: number): Update_dimensionsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Update_dimensionsContext = new Update_dimensionsContext(this, this._ctx, _parentState);
		let _prevctx: Update_dimensionsContext = localctx;
		let _startState: number = 276;
		this.enterRecursionRule(localctx, 276, n1qlParser.RULE_update_dimensions, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 1737;
			this.match(n1qlParser.FOR);
			this.state = 1738;
			this.update_dimension(0);
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1745;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 97, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Update_dimensionsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_update_dimensions);
					this.state = 1740;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1741;
					this.match(n1qlParser.FOR);
					this.state = 1742;
					this.update_dimension(0);
					}
					}
				}
				this.state = 1747;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 97, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}

	public update_dimension(): Update_dimensionContext;
	public update_dimension(_p: number): Update_dimensionContext;
	// @RuleVersion(0)
	public update_dimension(_p?: number): Update_dimensionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Update_dimensionContext = new Update_dimensionContext(this, this._ctx, _parentState);
		let _prevctx: Update_dimensionContext = localctx;
		let _startState: number = 278;
		this.enterRecursionRule(localctx, 278, n1qlParser.RULE_update_dimension, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 1749;
			this.update_binding();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1756;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 98, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Update_dimensionContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_update_dimension);
					this.state = 1751;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1752;
					this.match(n1qlParser.COMMA);
					this.state = 1753;
					this.update_binding();
					}
					}
				}
				this.state = 1758;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 98, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public update_binding(): Update_bindingContext {
		let localctx: Update_bindingContext = new Update_bindingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 280, n1qlParser.RULE_update_binding);
		try {
			this.state = 1779;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 99, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1759;
				this.variable();
				this.state = 1760;
				this.match(n1qlParser.IN);
				this.state = 1761;
				this.expr(0);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1763;
				this.variable();
				this.state = 1764;
				this.match(n1qlParser.WITHIN);
				this.state = 1765;
				this.expr(0);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1767;
				this.variable();
				this.state = 1768;
				this.match(n1qlParser.COLON);
				this.state = 1769;
				this.variable();
				this.state = 1770;
				this.match(n1qlParser.IN);
				this.state = 1771;
				this.expr(0);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1773;
				this.variable();
				this.state = 1774;
				this.match(n1qlParser.COLON);
				this.state = 1775;
				this.variable();
				this.state = 1776;
				this.match(n1qlParser.WITHIN);
				this.state = 1777;
				this.expr(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public variable(): VariableContext {
		let localctx: VariableContext = new VariableContext(this, this._ctx, this.state);
		this.enterRule(localctx, 282, n1qlParser.RULE_variable);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1781;
			this.permitted_identifiers();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_when(): Opt_whenContext {
		let localctx: Opt_whenContext = new Opt_whenContext(this, this._ctx, this.state);
		this.enterRule(localctx, 284, n1qlParser.RULE_opt_when);
		try {
			this.state = 1786;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 80:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 229:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1784;
				this.match(n1qlParser.WHEN);
				this.state = 1785;
				this.expr(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public unset(): UnsetContext {
		let localctx: UnsetContext = new UnsetContext(this, this._ctx, this.state);
		this.enterRule(localctx, 286, n1qlParser.RULE_unset);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1788;
			this.match(n1qlParser.UNSET);
			this.state = 1789;
			this.unset_terms(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public unset_terms(): Unset_termsContext;
	public unset_terms(_p: number): Unset_termsContext;
	// @RuleVersion(0)
	public unset_terms(_p?: number): Unset_termsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Unset_termsContext = new Unset_termsContext(this, this._ctx, _parentState);
		let _prevctx: Unset_termsContext = localctx;
		let _startState: number = 288;
		this.enterRecursionRule(localctx, 288, n1qlParser.RULE_unset_terms, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 1792;
			this.unset_term();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1799;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 101, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Unset_termsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_unset_terms);
					this.state = 1794;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1795;
					this.match(n1qlParser.COMMA);
					this.state = 1796;
					this.unset_term();
					}
					}
				}
				this.state = 1801;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 101, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public unset_term(): Unset_termContext {
		let localctx: Unset_termContext = new Unset_termContext(this, this._ctx, this.state);
		this.enterRule(localctx, 290, n1qlParser.RULE_unset_term);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1802;
			this.path(0);
			this.state = 1803;
			this.opt_update_for();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public merge(): MergeContext {
		let localctx: MergeContext = new MergeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 292, n1qlParser.RULE_merge);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1805;
			this.match(n1qlParser.MERGE);
			this.state = 1806;
			this.opt_optim_hints();
			this.state = 1807;
			this.match(n1qlParser.INTO);
			this.state = 1808;
			this.simple_keyspace_ref();
			this.state = 1809;
			this.opt_use_merge();
			this.state = 1810;
			this.match(n1qlParser.USING);
			this.state = 1811;
			this.simple_from_term();
			this.state = 1812;
			this.match(n1qlParser.ON);
			this.state = 1813;
			this.opt_key();
			this.state = 1814;
			this.expr(0);
			this.state = 1815;
			this.opt_let();
			this.state = 1816;
			this.opt_merge_actions();
			this.state = 1817;
			this.opt_limit();
			this.state = 1818;
			this.opt_returning();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_use_merge(): Opt_use_mergeContext {
		let localctx: Opt_use_mergeContext = new Opt_use_mergeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 294, n1qlParser.RULE_opt_use_merge);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1820;
			this.opt_use();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_key(): Opt_keyContext {
		let localctx: Opt_keyContext = new Opt_keyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 296, n1qlParser.RULE_opt_key);
		try {
			this.state = 1824;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 2:
			case 3:
			case 9:
			case 21:
			case 23:
			case 27:
			case 32:
			case 38:
			case 39:
			case 52:
			case 64:
			case 81:
			case 85:
			case 87:
			case 90:
			case 141:
			case 146:
			case 147:
			case 148:
			case 151:
			case 180:
			case 195:
			case 198:
			case 202:
			case 209:
			case 221:
			case 237:
			case 238:
			case 239:
			case 240:
			case 241:
			case 242:
			case 243:
			case 244:
			case 245:
			case 255:
			case 256:
			case 257:
			case 258:
			case 259:
			case 264:
			case 265:
			case 266:
			case 267:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 123:
			case 168:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1823;
				this.key();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_merge_actions(): Opt_merge_actionsContext {
		let localctx: Opt_merge_actionsContext = new Opt_merge_actionsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 298, n1qlParser.RULE_opt_merge_actions);
		try {
			this.state = 1847;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 103, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1827;
				this.match(n1qlParser.WHEN);
				this.state = 1828;
				this.match(n1qlParser.MATCHED);
				this.state = 1829;
				this.match(n1qlParser.THEN);
				this.state = 1830;
				this.match(n1qlParser.UPDATE);
				this.state = 1831;
				this.merge_update();
				this.state = 1832;
				this.opt_merge_delete_insert();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1834;
				this.match(n1qlParser.WHEN);
				this.state = 1835;
				this.match(n1qlParser.MATCHED);
				this.state = 1836;
				this.match(n1qlParser.THEN);
				this.state = 1837;
				this.match(n1qlParser.DELETE_);
				this.state = 1838;
				this.merge_delete();
				this.state = 1839;
				this.opt_merge_insert();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1841;
				this.match(n1qlParser.WHEN);
				this.state = 1842;
				this.match(n1qlParser.NOT);
				this.state = 1843;
				this.match(n1qlParser.MATCHED);
				this.state = 1844;
				this.match(n1qlParser.THEN);
				this.state = 1845;
				this.match(n1qlParser.INSERT);
				this.state = 1846;
				this.merge_insert();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_merge_delete_insert(): Opt_merge_delete_insertContext {
		let localctx: Opt_merge_delete_insertContext = new Opt_merge_delete_insertContext(this, this._ctx, this.state);
		this.enterRule(localctx, 300, n1qlParser.RULE_opt_merge_delete_insert);
		try {
			this.state = 1863;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 104, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1850;
				this.match(n1qlParser.WHEN);
				this.state = 1851;
				this.match(n1qlParser.MATCHED);
				this.state = 1852;
				this.match(n1qlParser.THEN);
				this.state = 1853;
				this.match(n1qlParser.DELETE_);
				this.state = 1854;
				this.merge_delete();
				this.state = 1855;
				this.opt_merge_insert();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1857;
				this.match(n1qlParser.WHEN);
				this.state = 1858;
				this.match(n1qlParser.NOT);
				this.state = 1859;
				this.match(n1qlParser.MATCHED);
				this.state = 1860;
				this.match(n1qlParser.THEN);
				this.state = 1861;
				this.match(n1qlParser.INSERT);
				this.state = 1862;
				this.merge_insert();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_merge_insert(): Opt_merge_insertContext {
		let localctx: Opt_merge_insertContext = new Opt_merge_insertContext(this, this._ctx, this.state);
		this.enterRule(localctx, 302, n1qlParser.RULE_opt_merge_insert);
		try {
			this.state = 1872;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 105, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1866;
				this.match(n1qlParser.WHEN);
				this.state = 1867;
				this.match(n1qlParser.NOT);
				this.state = 1868;
				this.match(n1qlParser.MATCHED);
				this.state = 1869;
				this.match(n1qlParser.THEN);
				this.state = 1870;
				this.match(n1qlParser.INSERT);
				this.state = 1871;
				this.merge_insert();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public merge_update(): Merge_updateContext {
		let localctx: Merge_updateContext = new Merge_updateContext(this, this._ctx, this.state);
		this.enterRule(localctx, 304, n1qlParser.RULE_merge_update);
		try {
			this.state = 1884;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 106, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1874;
				this.set_();
				this.state = 1875;
				this.opt_where();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1877;
				this.set_();
				this.state = 1878;
				this.unset();
				this.state = 1879;
				this.opt_where();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1881;
				this.unset();
				this.state = 1882;
				this.opt_where();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public merge_delete(): Merge_deleteContext {
		let localctx: Merge_deleteContext = new Merge_deleteContext(this, this._ctx, this.state);
		this.enterRule(localctx, 306, n1qlParser.RULE_merge_delete);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1886;
			this.opt_where();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public merge_insert(): Merge_insertContext {
		let localctx: Merge_insertContext = new Merge_insertContext(this, this._ctx, this.state);
		this.enterRule(localctx, 308, n1qlParser.RULE_merge_insert);
		try {
			this.state = 1902;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 107, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1888;
				this.expr(0);
				this.state = 1889;
				this.opt_where();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1891;
				this.key_val_expr();
				this.state = 1892;
				this.opt_where();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1894;
				this.key_val_options_expr();
				this.state = 1895;
				this.opt_where();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1897;
				this.match(n1qlParser.LPAREN);
				this.state = 1898;
				this.key_val_options_expr_header();
				this.state = 1899;
				this.match(n1qlParser.RPAREN);
				this.state = 1900;
				this.opt_where();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public create_user(): Create_userContext {
		let localctx: Create_userContext = new Create_userContext(this, this._ctx, this.state);
		this.enterRule(localctx, 310, n1qlParser.RULE_create_user);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1904;
			this.match(n1qlParser.CREATE);
			this.state = 1905;
			this.match(n1qlParser.USER);
			this.state = 1906;
			this.user();
			this.state = 1907;
			this.user_opts(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public alter_user(): Alter_userContext {
		let localctx: Alter_userContext = new Alter_userContext(this, this._ctx, this.state);
		this.enterRule(localctx, 312, n1qlParser.RULE_alter_user);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1909;
			this.match(n1qlParser.ALTER);
			this.state = 1910;
			this.match(n1qlParser.USER);
			this.state = 1911;
			this.user();
			this.state = 1912;
			this.user_opts(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public drop_user(): Drop_userContext {
		let localctx: Drop_userContext = new Drop_userContext(this, this._ctx, this.state);
		this.enterRule(localctx, 314, n1qlParser.RULE_drop_user);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1914;
			this.match(n1qlParser.DROP);
			this.state = 1915;
			this.match(n1qlParser.USER);
			this.state = 1916;
			this.user();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public user_opts(): User_optsContext;
	public user_opts(_p: number): User_optsContext;
	// @RuleVersion(0)
	public user_opts(_p?: number): User_optsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: User_optsContext = new User_optsContext(this, this._ctx, _parentState);
		let _prevctx: User_optsContext = localctx;
		let _startState: number = 316;
		this.enterRecursionRule(localctx, 316, n1qlParser.RULE_user_opts, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1923;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 108, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new User_optsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_user_opts);
					this.state = 1919;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1920;
					this.user_opt();
					}
					}
				}
				this.state = 1925;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 108, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public param_or_str(): Param_or_strContext {
		let localctx: Param_or_strContext = new Param_or_strContext(this, this._ctx, this.state);
		this.enterRule(localctx, 318, n1qlParser.RULE_param_or_str);
		try {
			this.state = 1928;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 239:
			case 240:
			case 241:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1926;
				this.param_expr();
				}
				break;
			case 1:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1927;
				this.match(n1qlParser.STR);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public user_opt(): User_optContext {
		let localctx: User_optContext = new User_optContext(this, this._ctx, this.state);
		this.enterRule(localctx, 320, n1qlParser.RULE_user_opt);
		try {
			this.state = 1940;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 163:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1930;
				this.match(n1qlParser.PASSWORD);
				this.state = 1931;
				this.param_or_str();
				}
				break;
			case 233:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1932;
				this.match(n1qlParser.WITH);
				this.state = 1933;
				this.match(n1qlParser.STR);
				}
				break;
			case 102:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1934;
				this.match(n1qlParser.GROUPS);
				this.state = 1935;
				this.groups(0);
				}
				break;
			case 101:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1936;
				this.match(n1qlParser.GROUP);
				this.state = 1937;
				this.permitted_identifiers();
				}
				break;
			case 145:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1938;
				this.match(n1qlParser.NO);
				this.state = 1939;
				this.match(n1qlParser.GROUPS);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public groups(): GroupsContext;
	public groups(_p: number): GroupsContext;
	// @RuleVersion(0)
	public groups(_p?: number): GroupsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: GroupsContext = new GroupsContext(this, this._ctx, _parentState);
		let _prevctx: GroupsContext = localctx;
		let _startState: number = 322;
		this.enterRecursionRule(localctx, 322, n1qlParser.RULE_groups, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 1943;
			this.permitted_identifiers();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1950;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 111, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new GroupsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_groups);
					this.state = 1945;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1946;
					this.match(n1qlParser.COMMA);
					this.state = 1947;
					this.permitted_identifiers();
					}
					}
				}
				this.state = 1952;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 111, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public create_group(): Create_groupContext {
		let localctx: Create_groupContext = new Create_groupContext(this, this._ctx, this.state);
		this.enterRule(localctx, 324, n1qlParser.RULE_create_group);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1953;
			this.match(n1qlParser.CREATE);
			this.state = 1954;
			this.match(n1qlParser.GROUP);
			this.state = 1955;
			this.group_name();
			this.state = 1956;
			this.group_opts(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public alter_group(): Alter_groupContext {
		let localctx: Alter_groupContext = new Alter_groupContext(this, this._ctx, this.state);
		this.enterRule(localctx, 326, n1qlParser.RULE_alter_group);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1958;
			this.match(n1qlParser.ALTER);
			this.state = 1959;
			this.match(n1qlParser.GROUP);
			this.state = 1960;
			this.group_name();
			this.state = 1961;
			this.group_opts(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public drop_group(): Drop_groupContext {
		let localctx: Drop_groupContext = new Drop_groupContext(this, this._ctx, this.state);
		this.enterRule(localctx, 328, n1qlParser.RULE_drop_group);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1963;
			this.match(n1qlParser.DROP);
			this.state = 1964;
			this.match(n1qlParser.GROUP);
			this.state = 1965;
			this.group_name();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public group_name(): Group_nameContext {
		let localctx: Group_nameContext = new Group_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 330, n1qlParser.RULE_group_name);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1967;
			this.permitted_identifiers();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public group_opts(): Group_optsContext;
	public group_opts(_p: number): Group_optsContext;
	// @RuleVersion(0)
	public group_opts(_p?: number): Group_optsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Group_optsContext = new Group_optsContext(this, this._ctx, _parentState);
		let _prevctx: Group_optsContext = localctx;
		let _startState: number = 332;
		this.enterRecursionRule(localctx, 332, n1qlParser.RULE_group_opts, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1974;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 112, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Group_optsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_group_opts);
					this.state = 1970;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1971;
					this.group_opt();
					}
					}
				}
				this.state = 1976;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 112, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public group_opt(): Group_optContext {
		let localctx: Group_optContext = new Group_optContext(this, this._ctx, this.state);
		this.enterRule(localctx, 334, n1qlParser.RULE_group_opt);
		try {
			this.state = 1985;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 233:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1977;
				this.match(n1qlParser.WITH);
				this.state = 1978;
				this.match(n1qlParser.STR);
				}
				break;
			case 251:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1979;
				this.match(n1qlParser.ROLES);
				this.state = 1980;
				this.group_role_list(0);
				}
				break;
			case 145:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1981;
				this.match(n1qlParser.NO);
				this.state = 1982;
				this.match(n1qlParser.ROLES);
				}
				break;
			case 186:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1983;
				this.match(n1qlParser.ROLE);
				this.state = 1984;
				this.group_role_list_item();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public group_role_list(): Group_role_listContext;
	public group_role_list(_p: number): Group_role_listContext;
	// @RuleVersion(0)
	public group_role_list(_p?: number): Group_role_listContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Group_role_listContext = new Group_role_listContext(this, this._ctx, _parentState);
		let _prevctx: Group_role_listContext = localctx;
		let _startState: number = 336;
		this.enterRecursionRule(localctx, 336, n1qlParser.RULE_group_role_list, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 1988;
			this.group_role_list_item();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1995;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 114, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Group_role_listContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_group_role_list);
					this.state = 1990;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 1991;
					this.match(n1qlParser.COMMA);
					this.state = 1992;
					this.group_role_list_item();
					}
					}
				}
				this.state = 1997;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 114, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public group_role_list_item(): Group_role_list_itemContext {
		let localctx: Group_role_list_itemContext = new Group_role_list_itemContext(this, this._ctx, this.state);
		this.enterRule(localctx, 338, n1qlParser.RULE_group_role_list_item);
		try {
			this.state = 2003;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 115, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1998;
				this.role_name();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1999;
				this.role_name();
				this.state = 2000;
				this.match(n1qlParser.ON);
				this.state = 2001;
				this.keyspace_scope();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public group_or_groups(): Group_or_groupsContext {
		let localctx: Group_or_groupsContext = new Group_or_groupsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 340, n1qlParser.RULE_group_or_groups);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2005;
			_la = this._input.LA(1);
			if(!(_la===101 || _la===102)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public user_users(): User_usersContext {
		let localctx: User_usersContext = new User_usersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 342, n1qlParser.RULE_user_users);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2007;
			_la = this._input.LA(1);
			if(!(_la===221 || _la===243)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public grant_role(): Grant_roleContext {
		let localctx: Grant_roleContext = new Grant_roleContext(this, this._ctx, this.state);
		this.enterRule(localctx, 344, n1qlParser.RULE_grant_role);
		try {
			this.state = 2049;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 116, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2009;
				this.match(n1qlParser.GRANT);
				this.state = 2010;
				this.role_list(0);
				this.state = 2011;
				this.match(n1qlParser.TO);
				this.state = 2012;
				this.user_list(0);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2014;
				this.match(n1qlParser.GRANT);
				this.state = 2015;
				this.role_list(0);
				this.state = 2016;
				this.match(n1qlParser.ON);
				this.state = 2017;
				this.keyspace_scope_list(0);
				this.state = 2018;
				this.match(n1qlParser.TO);
				this.state = 2019;
				this.user_list(0);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2021;
				this.match(n1qlParser.GRANT);
				this.state = 2022;
				this.role_list(0);
				this.state = 2023;
				this.match(n1qlParser.TO);
				this.state = 2024;
				this.user_users();
				this.state = 2025;
				this.user_list(0);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2027;
				this.match(n1qlParser.GRANT);
				this.state = 2028;
				this.role_list(0);
				this.state = 2029;
				this.match(n1qlParser.ON);
				this.state = 2030;
				this.keyspace_scope_list(0);
				this.state = 2031;
				this.match(n1qlParser.TO);
				this.state = 2032;
				this.user_users();
				this.state = 2033;
				this.user_list(0);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 2035;
				this.match(n1qlParser.GRANT);
				this.state = 2036;
				this.role_list(0);
				this.state = 2037;
				this.match(n1qlParser.TO);
				this.state = 2038;
				this.group_or_groups();
				this.state = 2039;
				this.groups(0);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 2041;
				this.match(n1qlParser.GRANT);
				this.state = 2042;
				this.role_list(0);
				this.state = 2043;
				this.match(n1qlParser.ON);
				this.state = 2044;
				this.keyspace_scope_list(0);
				this.state = 2045;
				this.match(n1qlParser.TO);
				this.state = 2046;
				this.group_or_groups();
				this.state = 2047;
				this.groups(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public role_list(): Role_listContext;
	public role_list(_p: number): Role_listContext;
	// @RuleVersion(0)
	public role_list(_p?: number): Role_listContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Role_listContext = new Role_listContext(this, this._ctx, _parentState);
		let _prevctx: Role_listContext = localctx;
		let _startState: number = 346;
		this.enterRecursionRule(localctx, 346, n1qlParser.RULE_role_list, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 2052;
			this.role_name();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 2059;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 117, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Role_listContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_role_list);
					this.state = 2054;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 2055;
					this.match(n1qlParser.COMMA);
					this.state = 2056;
					this.role_name();
					}
					}
				}
				this.state = 2061;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 117, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public role_name(): Role_nameContext {
		let localctx: Role_nameContext = new Role_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 348, n1qlParser.RULE_role_name);
		try {
			this.state = 2067;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 221:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2062;
				this.permitted_identifiers();
				}
				break;
			case 194:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2063;
				this.match(n1qlParser.SELECT);
				}
				break;
			case 116:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2064;
				this.match(n1qlParser.INSERT);
				}
				break;
			case 218:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2065;
				this.match(n1qlParser.UPDATE);
				}
				break;
			case 70:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 2066;
				this.match(n1qlParser.DELETE_);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public keyspace_scope_list(): Keyspace_scope_listContext;
	public keyspace_scope_list(_p: number): Keyspace_scope_listContext;
	// @RuleVersion(0)
	public keyspace_scope_list(_p?: number): Keyspace_scope_listContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Keyspace_scope_listContext = new Keyspace_scope_listContext(this, this._ctx, _parentState);
		let _prevctx: Keyspace_scope_listContext = localctx;
		let _startState: number = 350;
		this.enterRecursionRule(localctx, 350, n1qlParser.RULE_keyspace_scope_list, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 2070;
			this.keyspace_scope();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 2077;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 119, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Keyspace_scope_listContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_keyspace_scope_list);
					this.state = 2072;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 2073;
					this.match(n1qlParser.COMMA);
					this.state = 2074;
					this.keyspace_scope();
					}
					}
				}
				this.state = 2079;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 119, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public keyspace_scope(): Keyspace_scopeContext {
		let localctx: Keyspace_scopeContext = new Keyspace_scopeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 352, n1qlParser.RULE_keyspace_scope);
		try {
			this.state = 2106;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 120, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2080;
				this.keyspace_name();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2081;
				this.path_part();
				this.state = 2082;
				this.match(n1qlParser.DOT);
				this.state = 2083;
				this.path_part();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2085;
				this.namespace_name();
				this.state = 2086;
				this.keyspace_name();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2088;
				this.namespace_name();
				this.state = 2089;
				this.path_part();
				this.state = 2090;
				this.match(n1qlParser.DOT);
				this.state = 2091;
				this.path_part();
				this.state = 2092;
				this.match(n1qlParser.DOT);
				this.state = 2093;
				this.keyspace_name();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 2095;
				this.path_part();
				this.state = 2096;
				this.match(n1qlParser.DOT);
				this.state = 2097;
				this.path_part();
				this.state = 2098;
				this.match(n1qlParser.DOT);
				this.state = 2099;
				this.keyspace_name();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 2101;
				this.namespace_name();
				this.state = 2102;
				this.path_part();
				this.state = 2103;
				this.match(n1qlParser.DOT);
				this.state = 2104;
				this.path_part();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public user_list(): User_listContext;
	public user_list(_p: number): User_listContext;
	// @RuleVersion(0)
	public user_list(_p?: number): User_listContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: User_listContext = new User_listContext(this, this._ctx, _parentState);
		let _prevctx: User_listContext = localctx;
		let _startState: number = 354;
		this.enterRecursionRule(localctx, 354, n1qlParser.RULE_user_list, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 2109;
			this.user();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 2116;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 121, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new User_listContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_user_list);
					this.state = 2111;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 2112;
					this.match(n1qlParser.COMMA);
					this.state = 2113;
					this.user();
					}
					}
				}
				this.state = 2118;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 121, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public user(): UserContext {
		let localctx: UserContext = new UserContext(this, this._ctx, this.state);
		this.enterRule(localctx, 356, n1qlParser.RULE_user);
		try {
			this.state = 2124;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 122, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2119;
				this.permitted_identifiers();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2120;
				this.permitted_identifiers();
				this.state = 2121;
				this.match(n1qlParser.COLON);
				this.state = 2122;
				this.permitted_identifiers();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public revoke_role(): Revoke_roleContext {
		let localctx: Revoke_roleContext = new Revoke_roleContext(this, this._ctx, this.state);
		this.enterRule(localctx, 358, n1qlParser.RULE_revoke_role);
		try {
			this.state = 2166;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 123, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2126;
				this.match(n1qlParser.REVOKE);
				this.state = 2127;
				this.role_list(0);
				this.state = 2128;
				this.match(n1qlParser.FROM);
				this.state = 2129;
				this.user_list(0);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2131;
				this.match(n1qlParser.REVOKE);
				this.state = 2132;
				this.role_list(0);
				this.state = 2133;
				this.match(n1qlParser.ON);
				this.state = 2134;
				this.keyspace_scope_list(0);
				this.state = 2135;
				this.match(n1qlParser.FROM);
				this.state = 2136;
				this.user_list(0);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2138;
				this.match(n1qlParser.REVOKE);
				this.state = 2139;
				this.role_list(0);
				this.state = 2140;
				this.match(n1qlParser.FROM);
				this.state = 2141;
				this.user_users();
				this.state = 2142;
				this.user_list(0);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2144;
				this.match(n1qlParser.REVOKE);
				this.state = 2145;
				this.role_list(0);
				this.state = 2146;
				this.match(n1qlParser.ON);
				this.state = 2147;
				this.keyspace_scope_list(0);
				this.state = 2148;
				this.match(n1qlParser.FROM);
				this.state = 2149;
				this.user_users();
				this.state = 2150;
				this.user_list(0);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 2152;
				this.match(n1qlParser.REVOKE);
				this.state = 2153;
				this.role_list(0);
				this.state = 2154;
				this.match(n1qlParser.FROM);
				this.state = 2155;
				this.group_or_groups();
				this.state = 2156;
				this.groups(0);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 2158;
				this.match(n1qlParser.REVOKE);
				this.state = 2159;
				this.role_list(0);
				this.state = 2160;
				this.match(n1qlParser.ON);
				this.state = 2161;
				this.keyspace_scope_list(0);
				this.state = 2162;
				this.match(n1qlParser.FROM);
				this.state = 2163;
				this.group_or_groups();
				this.state = 2164;
				this.groups(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_def_with_clause(): Opt_def_with_clauseContext {
		let localctx: Opt_def_with_clauseContext = new Opt_def_with_clauseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 360, n1qlParser.RULE_opt_def_with_clause);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2168;
			this.opt_with_clause();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public create_bucket(): Create_bucketContext {
		let localctx: Create_bucketContext = new Create_bucketContext(this, this._ctx, this.state);
		this.enterRule(localctx, 362, n1qlParser.RULE_create_bucket);
		try {
			this.state = 2198;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 124, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2170;
				this.match(n1qlParser.CREATE);
				this.state = 2171;
				this.match(n1qlParser.BUCKET);
				this.state = 2172;
				this.permitted_identifiers();
				this.state = 2173;
				this.opt_if_not_exists();
				this.state = 2174;
				this.opt_def_with_clause();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2176;
				this.match(n1qlParser.CREATE);
				this.state = 2177;
				this.match(n1qlParser.BUCKET);
				this.state = 2178;
				this.match(n1qlParser.IF);
				this.state = 2179;
				this.match(n1qlParser.NOT);
				this.state = 2180;
				this.match(n1qlParser.EXISTS);
				this.state = 2181;
				this.permitted_identifiers();
				this.state = 2182;
				this.opt_def_with_clause();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2184;
				this.match(n1qlParser.CREATE);
				this.state = 2185;
				this.match(n1qlParser.DATABASE);
				this.state = 2186;
				this.permitted_identifiers();
				this.state = 2187;
				this.opt_if_not_exists();
				this.state = 2188;
				this.opt_def_with_clause();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2190;
				this.match(n1qlParser.CREATE);
				this.state = 2191;
				this.match(n1qlParser.DATABASE);
				this.state = 2192;
				this.match(n1qlParser.IF);
				this.state = 2193;
				this.match(n1qlParser.NOT);
				this.state = 2194;
				this.match(n1qlParser.EXISTS);
				this.state = 2195;
				this.permitted_identifiers();
				this.state = 2196;
				this.opt_def_with_clause();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public alter_bucket(): Alter_bucketContext {
		let localctx: Alter_bucketContext = new Alter_bucketContext(this, this._ctx, this.state);
		this.enterRule(localctx, 364, n1qlParser.RULE_alter_bucket);
		try {
			this.state = 2210;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 125, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2200;
				this.match(n1qlParser.ALTER);
				this.state = 2201;
				this.match(n1qlParser.BUCKET);
				this.state = 2202;
				this.permitted_identifiers();
				this.state = 2203;
				this.with_clause();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2205;
				this.match(n1qlParser.ALTER);
				this.state = 2206;
				this.match(n1qlParser.DATABASE);
				this.state = 2207;
				this.permitted_identifiers();
				this.state = 2208;
				this.with_clause();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public drop_bucket(): Drop_bucketContext {
		let localctx: Drop_bucketContext = new Drop_bucketContext(this, this._ctx, this.state);
		this.enterRule(localctx, 366, n1qlParser.RULE_drop_bucket);
		try {
			this.state = 2232;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 126, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2212;
				this.match(n1qlParser.DROP);
				this.state = 2213;
				this.match(n1qlParser.BUCKET);
				this.state = 2214;
				this.permitted_identifiers();
				this.state = 2215;
				this.opt_if_exists();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2217;
				this.match(n1qlParser.DROP);
				this.state = 2218;
				this.match(n1qlParser.BUCKET);
				this.state = 2219;
				this.match(n1qlParser.IF);
				this.state = 2220;
				this.match(n1qlParser.EXISTS);
				this.state = 2221;
				this.permitted_identifiers();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2222;
				this.match(n1qlParser.DROP);
				this.state = 2223;
				this.match(n1qlParser.DATABASE);
				this.state = 2224;
				this.permitted_identifiers();
				this.state = 2225;
				this.opt_if_exists();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2227;
				this.match(n1qlParser.DROP);
				this.state = 2228;
				this.match(n1qlParser.DATABASE);
				this.state = 2229;
				this.match(n1qlParser.IF);
				this.state = 2230;
				this.match(n1qlParser.EXISTS);
				this.state = 2231;
				this.permitted_identifiers();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public create_scope(): Create_scopeContext {
		let localctx: Create_scopeContext = new Create_scopeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 368, n1qlParser.RULE_create_scope);
		try {
			this.state = 2245;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 127, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2234;
				this.match(n1qlParser.CREATE);
				this.state = 2235;
				this.match(n1qlParser.SCOPE);
				this.state = 2236;
				this.named_scope_ref();
				this.state = 2237;
				this.opt_if_not_exists();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2239;
				this.match(n1qlParser.CREATE);
				this.state = 2240;
				this.match(n1qlParser.SCOPE);
				this.state = 2241;
				this.match(n1qlParser.IF);
				this.state = 2242;
				this.match(n1qlParser.NOT);
				this.state = 2243;
				this.match(n1qlParser.EXISTS);
				this.state = 2244;
				this.named_scope_ref();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public drop_scope(): Drop_scopeContext {
		let localctx: Drop_scopeContext = new Drop_scopeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 370, n1qlParser.RULE_drop_scope);
		try {
			this.state = 2257;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 128, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2247;
				this.match(n1qlParser.DROP);
				this.state = 2248;
				this.match(n1qlParser.SCOPE);
				this.state = 2249;
				this.named_scope_ref();
				this.state = 2250;
				this.opt_if_exists();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2252;
				this.match(n1qlParser.DROP);
				this.state = 2253;
				this.match(n1qlParser.SCOPE);
				this.state = 2254;
				this.match(n1qlParser.IF);
				this.state = 2255;
				this.match(n1qlParser.EXISTS);
				this.state = 2256;
				this.named_scope_ref();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public create_collection(): Create_collectionContext {
		let localctx: Create_collectionContext = new Create_collectionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 372, n1qlParser.RULE_create_collection);
		try {
			this.state = 2273;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 129, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2259;
				this.match(n1qlParser.CREATE);
				this.state = 2260;
				this.match(n1qlParser.COLLECTION);
				this.state = 2261;
				this.named_keyspace_ref();
				this.state = 2262;
				this.opt_if_not_exists();
				this.state = 2263;
				this.opt_with_clause();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2265;
				this.match(n1qlParser.CREATE);
				this.state = 2266;
				this.match(n1qlParser.COLLECTION);
				this.state = 2267;
				this.match(n1qlParser.IF);
				this.state = 2268;
				this.match(n1qlParser.NOT);
				this.state = 2269;
				this.match(n1qlParser.EXISTS);
				this.state = 2270;
				this.named_keyspace_ref();
				this.state = 2271;
				this.opt_with_clause();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public drop_collection(): Drop_collectionContext {
		let localctx: Drop_collectionContext = new Drop_collectionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 374, n1qlParser.RULE_drop_collection);
		try {
			this.state = 2285;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 130, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2275;
				this.match(n1qlParser.DROP);
				this.state = 2276;
				this.match(n1qlParser.COLLECTION);
				this.state = 2277;
				this.named_keyspace_ref();
				this.state = 2278;
				this.opt_if_exists();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2280;
				this.match(n1qlParser.DROP);
				this.state = 2281;
				this.match(n1qlParser.COLLECTION);
				this.state = 2282;
				this.match(n1qlParser.IF);
				this.state = 2283;
				this.match(n1qlParser.EXISTS);
				this.state = 2284;
				this.named_keyspace_ref();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public flush_collection(): Flush_collectionContext {
		let localctx: Flush_collectionContext = new Flush_collectionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 376, n1qlParser.RULE_flush_collection);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2287;
			this.flush_or_truncate();
			this.state = 2288;
			this.match(n1qlParser.COLLECTION);
			this.state = 2289;
			this.named_keyspace_ref();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public flush_or_truncate(): Flush_or_truncateContext {
		let localctx: Flush_or_truncateContext = new Flush_or_truncateContext(this, this._ctx, this.state);
		this.enterRule(localctx, 378, n1qlParser.RULE_flush_or_truncate);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2291;
			_la = this._input.LA(1);
			if(!(_la===92 || _la===210)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public create_index(): Create_indexContext {
		let localctx: Create_indexContext = new Create_indexContext(this, this._ctx, this.state);
		this.enterRule(localctx, 380, n1qlParser.RULE_create_index);
		try {
			this.state = 2359;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 131, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2293;
				this.match(n1qlParser.CREATE);
				this.state = 2294;
				this.match(n1qlParser.PRIMARY);
				this.state = 2295;
				this.match(n1qlParser.INDEX);
				this.state = 2296;
				this.opt_if_not_exists();
				this.state = 2297;
				this.match(n1qlParser.ON);
				this.state = 2298;
				this.named_keyspace_ref();
				this.state = 2299;
				this.opt_index_partition();
				this.state = 2300;
				this.opt_index_using();
				this.state = 2301;
				this.opt_with_clause();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2303;
				this.match(n1qlParser.CREATE);
				this.state = 2304;
				this.match(n1qlParser.PRIMARY);
				this.state = 2305;
				this.match(n1qlParser.INDEX);
				this.state = 2306;
				this.index_name();
				this.state = 2307;
				this.opt_if_not_exists();
				this.state = 2308;
				this.match(n1qlParser.ON);
				this.state = 2309;
				this.named_keyspace_ref();
				this.state = 2310;
				this.opt_index_partition();
				this.state = 2311;
				this.opt_index_using();
				this.state = 2312;
				this.opt_with_clause();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2314;
				this.match(n1qlParser.CREATE);
				this.state = 2315;
				this.match(n1qlParser.PRIMARY);
				this.state = 2316;
				this.match(n1qlParser.INDEX);
				this.state = 2317;
				this.match(n1qlParser.IF);
				this.state = 2318;
				this.match(n1qlParser.NOT);
				this.state = 2319;
				this.match(n1qlParser.EXISTS);
				this.state = 2320;
				this.index_name();
				this.state = 2321;
				this.match(n1qlParser.ON);
				this.state = 2322;
				this.named_keyspace_ref();
				this.state = 2323;
				this.opt_index_partition();
				this.state = 2324;
				this.opt_index_using();
				this.state = 2325;
				this.opt_with_clause();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2327;
				this.match(n1qlParser.CREATE);
				this.state = 2328;
				this.opt_vector();
				this.state = 2329;
				this.match(n1qlParser.INDEX);
				this.state = 2330;
				this.index_name();
				this.state = 2331;
				this.opt_if_not_exists();
				this.state = 2332;
				this.match(n1qlParser.ON);
				this.state = 2333;
				this.named_keyspace_ref();
				this.state = 2334;
				this.match(n1qlParser.LPAREN);
				this.state = 2335;
				this.index_terms(0);
				this.state = 2336;
				this.match(n1qlParser.RPAREN);
				this.state = 2337;
				this.opt_index_partition();
				this.state = 2338;
				this.opt_index_where();
				this.state = 2339;
				this.opt_index_using();
				this.state = 2340;
				this.opt_with_clause();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 2342;
				this.match(n1qlParser.CREATE);
				this.state = 2343;
				this.opt_vector();
				this.state = 2344;
				this.match(n1qlParser.INDEX);
				this.state = 2345;
				this.match(n1qlParser.IF);
				this.state = 2346;
				this.match(n1qlParser.NOT);
				this.state = 2347;
				this.match(n1qlParser.EXISTS);
				this.state = 2348;
				this.index_name();
				this.state = 2349;
				this.match(n1qlParser.ON);
				this.state = 2350;
				this.named_keyspace_ref();
				this.state = 2351;
				this.match(n1qlParser.LPAREN);
				this.state = 2352;
				this.index_terms(0);
				this.state = 2353;
				this.match(n1qlParser.RPAREN);
				this.state = 2354;
				this.opt_index_partition();
				this.state = 2355;
				this.opt_index_where();
				this.state = 2356;
				this.opt_index_using();
				this.state = 2357;
				this.opt_with_clause();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_vector(): Opt_vectorContext {
		let localctx: Opt_vectorContext = new Opt_vectorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 382, n1qlParser.RULE_opt_vector);
		try {
			this.state = 2363;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 112:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 245:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2362;
				this.match(n1qlParser.VECTOR);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public index_name(): Index_nameContext {
		let localctx: Index_nameContext = new Index_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 384, n1qlParser.RULE_index_name);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2365;
			this.permitted_identifiers();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_index_name(): Opt_index_nameContext {
		let localctx: Opt_index_nameContext = new Opt_index_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 386, n1qlParser.RULE_opt_index_name);
		try {
			this.state = 2369;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 133, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2368;
				this.index_name();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_if_not_exists(): Opt_if_not_existsContext {
		let localctx: Opt_if_not_existsContext = new Opt_if_not_existsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 388, n1qlParser.RULE_opt_if_not_exists);
		try {
			this.state = 2375;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 134, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2372;
				this.match(n1qlParser.IF);
				this.state = 2373;
				this.match(n1qlParser.NOT);
				this.state = 2374;
				this.match(n1qlParser.EXISTS);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public named_keyspace_ref(): Named_keyspace_refContext {
		let localctx: Named_keyspace_refContext = new Named_keyspace_refContext(this, this._ctx, this.state);
		this.enterRule(localctx, 390, n1qlParser.RULE_named_keyspace_ref);
		try {
			this.state = 2391;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 135, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2377;
				this.simple_named_keyspace_ref();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2378;
				this.namespace_name();
				this.state = 2379;
				this.path_part();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2381;
				this.path_part();
				this.state = 2382;
				this.match(n1qlParser.DOT);
				this.state = 2383;
				this.path_part();
				this.state = 2384;
				this.match(n1qlParser.DOT);
				this.state = 2385;
				this.keyspace_name();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2387;
				this.path_part();
				this.state = 2388;
				this.match(n1qlParser.DOT);
				this.state = 2389;
				this.keyspace_name();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public simple_named_keyspace_ref(): Simple_named_keyspace_refContext {
		let localctx: Simple_named_keyspace_refContext = new Simple_named_keyspace_refContext(this, this._ctx, this.state);
		this.enterRule(localctx, 392, n1qlParser.RULE_simple_named_keyspace_ref);
		try {
			this.state = 2401;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 221:
			case 237:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2393;
				this.keyspace_name();
				}
				break;
			case 32:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2394;
				this.namespace_name();
				this.state = 2395;
				this.path_part();
				this.state = 2396;
				this.match(n1qlParser.DOT);
				this.state = 2397;
				this.path_part();
				this.state = 2398;
				this.match(n1qlParser.DOT);
				this.state = 2399;
				this.keyspace_name();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public named_scope_ref(): Named_scope_refContext {
		let localctx: Named_scope_refContext = new Named_scope_refContext(this, this._ctx, this.state);
		this.enterRule(localctx, 394, n1qlParser.RULE_named_scope_ref);
		try {
			this.state = 2413;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 137, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2403;
				this.namespace_name();
				this.state = 2404;
				this.path_part();
				this.state = 2405;
				this.match(n1qlParser.DOT);
				this.state = 2406;
				this.path_part();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2408;
				this.path_part();
				this.state = 2409;
				this.match(n1qlParser.DOT);
				this.state = 2410;
				this.path_part();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2412;
				this.path_part();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_index_partition(): Opt_index_partitionContext {
		let localctx: Opt_index_partitionContext = new Opt_index_partitionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 396, n1qlParser.RULE_opt_index_partition);
		try {
			this.state = 2423;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 138, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2416;
				this.match(n1qlParser.PARTITION);
				this.state = 2417;
				this.match(n1qlParser.BY);
				this.state = 2418;
				this.match(n1qlParser.HASH);
				this.state = 2419;
				this.match(n1qlParser.LPAREN);
				this.state = 2420;
				this.exprs(0);
				this.state = 2421;
				this.match(n1qlParser.RPAREN);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_index_using(): Opt_index_usingContext {
		let localctx: Opt_index_usingContext = new Opt_index_usingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 398, n1qlParser.RULE_opt_index_using);
		try {
			this.state = 2427;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 139, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2426;
				this.index_using();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public index_using(): Index_usingContext {
		let localctx: Index_usingContext = new Index_usingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 400, n1qlParser.RULE_index_using);
		try {
			this.state = 2435;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 140, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2429;
				this.match(n1qlParser.USING);
				this.state = 2430;
				this.match(n1qlParser.VIEW);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2431;
				this.match(n1qlParser.USING);
				this.state = 2432;
				this.match(n1qlParser.GSI);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2433;
				this.match(n1qlParser.USING);
				this.state = 2434;
				this.match(n1qlParser.FTS);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public index_terms(): Index_termsContext;
	public index_terms(_p: number): Index_termsContext;
	// @RuleVersion(0)
	public index_terms(_p?: number): Index_termsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Index_termsContext = new Index_termsContext(this, this._ctx, _parentState);
		let _prevctx: Index_termsContext = localctx;
		let _startState: number = 402;
		this.enterRecursionRule(localctx, 402, n1qlParser.RULE_index_terms, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 2438;
			this.index_term();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 2445;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 141, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Index_termsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_index_terms);
					this.state = 2440;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 2441;
					this.match(n1qlParser.COMMA);
					this.state = 2442;
					this.index_term();
					}
					}
				}
				this.state = 2447;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 141, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public index_term(): Index_termContext {
		let localctx: Index_termContext = new Index_termContext(this, this._ctx, this.state);
		this.enterRule(localctx, 404, n1qlParser.RULE_index_term);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2448;
			this.index_term_expr();
			this.state = 2449;
			this.opt_ikattr();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public index_term_expr(): Index_term_exprContext {
		let localctx: Index_term_exprContext = new Index_term_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 406, n1qlParser.RULE_index_term_expr);
		try {
			this.state = 2453;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 2:
			case 3:
			case 9:
			case 21:
			case 23:
			case 27:
			case 32:
			case 38:
			case 39:
			case 52:
			case 64:
			case 81:
			case 85:
			case 87:
			case 90:
			case 141:
			case 146:
			case 147:
			case 148:
			case 151:
			case 180:
			case 195:
			case 198:
			case 202:
			case 209:
			case 221:
			case 237:
			case 238:
			case 239:
			case 240:
			case 241:
			case 242:
			case 243:
			case 244:
			case 245:
			case 255:
			case 256:
			case 257:
			case 258:
			case 259:
			case 264:
			case 265:
			case 266:
			case 267:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2451;
				this.expr(0);
				}
				break;
			case 34:
			case 74:
			case 77:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2452;
				this.all_expr();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public all_expr(): All_exprContext {
		let localctx: All_exprContext = new All_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 408, n1qlParser.RULE_all_expr);
		try {
			this.state = 2464;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 143, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2455;
				this.all();
				this.state = 2456;
				this.expr(0);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2458;
				this.all();
				this.state = 2459;
				this.match(n1qlParser.DISTINCT);
				this.state = 2460;
				this.expr(0);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2462;
				this.match(n1qlParser.DISTINCT);
				this.state = 2463;
				this.expr(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public all(): AllContext {
		let localctx: AllContext = new AllContext(this, this._ctx, this.state);
		this.enterRule(localctx, 410, n1qlParser.RULE_all);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2466;
			_la = this._input.LA(1);
			if(!(_la===34 || _la===77)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public flatten_keys_expr(): Flatten_keys_exprContext {
		let localctx: Flatten_keys_exprContext = new Flatten_keys_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 412, n1qlParser.RULE_flatten_keys_expr);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2468;
			this.expr(0);
			this.state = 2469;
			this.opt_ikattr();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public flatten_keys_exprs(): Flatten_keys_exprsContext;
	public flatten_keys_exprs(_p: number): Flatten_keys_exprsContext;
	// @RuleVersion(0)
	public flatten_keys_exprs(_p?: number): Flatten_keys_exprsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Flatten_keys_exprsContext = new Flatten_keys_exprsContext(this, this._ctx, _parentState);
		let _prevctx: Flatten_keys_exprsContext = localctx;
		let _startState: number = 414;
		this.enterRecursionRule(localctx, 414, n1qlParser.RULE_flatten_keys_exprs, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 2472;
			this.flatten_keys_expr();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 2479;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 144, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Flatten_keys_exprsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_flatten_keys_exprs);
					this.state = 2474;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 2475;
					this.match(n1qlParser.COMMA);
					this.state = 2476;
					this.flatten_keys_expr();
					}
					}
				}
				this.state = 2481;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 144, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_flatten_keys_exprs(): Opt_flatten_keys_exprsContext {
		let localctx: Opt_flatten_keys_exprsContext = new Opt_flatten_keys_exprsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 416, n1qlParser.RULE_opt_flatten_keys_exprs);
		try {
			this.state = 2484;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 22:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 1:
			case 2:
			case 3:
			case 9:
			case 21:
			case 23:
			case 27:
			case 32:
			case 38:
			case 39:
			case 52:
			case 64:
			case 81:
			case 85:
			case 87:
			case 90:
			case 141:
			case 146:
			case 147:
			case 148:
			case 151:
			case 180:
			case 195:
			case 198:
			case 202:
			case 209:
			case 221:
			case 237:
			case 238:
			case 239:
			case 240:
			case 241:
			case 242:
			case 243:
			case 244:
			case 245:
			case 255:
			case 256:
			case 257:
			case 258:
			case 259:
			case 264:
			case 265:
			case 266:
			case 267:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2483;
				this.flatten_keys_exprs(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_index_where(): Opt_index_whereContext {
		let localctx: Opt_index_whereContext = new Opt_index_whereContext(this, this._ctx, this.state);
		this.enterRule(localctx, 418, n1qlParser.RULE_opt_index_where);
		try {
			this.state = 2489;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 146, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2487;
				this.match(n1qlParser.WHERE);
				this.state = 2488;
				this.expr(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_ikattr(): Opt_ikattrContext {
		let localctx: Opt_ikattrContext = new Opt_ikattrContext(this, this._ctx, this.state);
		this.enterRule(localctx, 420, n1qlParser.RULE_opt_ikattr);
		try {
			this.state = 2496;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 147, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2492;
				this.ikattr();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2493;
				this.ikattr();
				this.state = 2494;
				this.ikattr();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public ikattr(): IkattrContext {
		let localctx: IkattrContext = new IkattrContext(this, this._ctx, this.state);
		this.enterRule(localctx, 422, n1qlParser.RULE_ikattr);
		try {
			this.state = 2502;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 41:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2498;
				this.match(n1qlParser.ASC);
				}
				break;
			case 72:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2499;
				this.match(n1qlParser.DESC);
				}
				break;
			case 110:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2500;
				this.match(n1qlParser.INCLUDE);
				this.state = 2501;
				this.match(n1qlParser.MISSING);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public drop_index(): Drop_indexContext {
		let localctx: Drop_indexContext = new Drop_indexContext(this, this._ctx, this.state);
		this.enterRule(localctx, 424, n1qlParser.RULE_drop_index);
		try {
			this.state = 2569;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 149, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2504;
				this.match(n1qlParser.DROP);
				this.state = 2505;
				this.match(n1qlParser.PRIMARY);
				this.state = 2506;
				this.match(n1qlParser.INDEX);
				this.state = 2507;
				this.opt_if_exists();
				this.state = 2508;
				this.match(n1qlParser.ON);
				this.state = 2509;
				this.named_keyspace_ref();
				this.state = 2510;
				this.opt_index_using();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2512;
				this.match(n1qlParser.DROP);
				this.state = 2513;
				this.match(n1qlParser.PRIMARY);
				this.state = 2514;
				this.match(n1qlParser.INDEX);
				this.state = 2515;
				this.index_name();
				this.state = 2516;
				this.opt_if_exists();
				this.state = 2517;
				this.match(n1qlParser.ON);
				this.state = 2518;
				this.named_keyspace_ref();
				this.state = 2519;
				this.opt_index_using();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2521;
				this.match(n1qlParser.DROP);
				this.state = 2522;
				this.match(n1qlParser.PRIMARY);
				this.state = 2523;
				this.match(n1qlParser.INDEX);
				this.state = 2524;
				this.match(n1qlParser.IF);
				this.state = 2525;
				this.match(n1qlParser.EXISTS);
				this.state = 2526;
				this.index_name();
				this.state = 2527;
				this.match(n1qlParser.ON);
				this.state = 2528;
				this.named_keyspace_ref();
				this.state = 2529;
				this.opt_index_using();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2531;
				this.match(n1qlParser.DROP);
				this.state = 2532;
				this.opt_vector();
				this.state = 2533;
				this.match(n1qlParser.INDEX);
				this.state = 2534;
				this.simple_named_keyspace_ref();
				this.state = 2535;
				this.match(n1qlParser.DOT);
				this.state = 2536;
				this.index_name();
				this.state = 2537;
				this.opt_if_exists();
				this.state = 2538;
				this.opt_index_using();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 2540;
				this.match(n1qlParser.DROP);
				this.state = 2541;
				this.opt_vector();
				this.state = 2542;
				this.match(n1qlParser.INDEX);
				this.state = 2543;
				this.match(n1qlParser.IF);
				this.state = 2544;
				this.match(n1qlParser.EXISTS);
				this.state = 2545;
				this.simple_named_keyspace_ref();
				this.state = 2546;
				this.match(n1qlParser.DOT);
				this.state = 2547;
				this.index_name();
				this.state = 2548;
				this.opt_index_using();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 2550;
				this.match(n1qlParser.DROP);
				this.state = 2551;
				this.opt_vector();
				this.state = 2552;
				this.match(n1qlParser.INDEX);
				this.state = 2553;
				this.index_name();
				this.state = 2554;
				this.opt_if_exists();
				this.state = 2555;
				this.match(n1qlParser.ON);
				this.state = 2556;
				this.named_keyspace_ref();
				this.state = 2557;
				this.opt_index_using();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 2559;
				this.match(n1qlParser.DROP);
				this.state = 2560;
				this.opt_vector();
				this.state = 2561;
				this.match(n1qlParser.INDEX);
				this.state = 2562;
				this.match(n1qlParser.IF);
				this.state = 2563;
				this.match(n1qlParser.EXISTS);
				this.state = 2564;
				this.index_name();
				this.state = 2565;
				this.match(n1qlParser.ON);
				this.state = 2566;
				this.named_keyspace_ref();
				this.state = 2567;
				this.opt_index_using();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_if_exists(): Opt_if_existsContext {
		let localctx: Opt_if_existsContext = new Opt_if_existsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 426, n1qlParser.RULE_opt_if_exists);
		try {
			this.state = 2574;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 150, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2572;
				this.match(n1qlParser.IF);
				this.state = 2573;
				this.match(n1qlParser.EXISTS);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public alter_index(): Alter_indexContext {
		let localctx: Alter_indexContext = new Alter_indexContext(this, this._ctx, this.state);
		this.enterRule(localctx, 428, n1qlParser.RULE_alter_index);
		try {
			this.state = 2592;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 151, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2576;
				this.match(n1qlParser.ALTER);
				this.state = 2577;
				this.match(n1qlParser.INDEX);
				this.state = 2578;
				this.simple_named_keyspace_ref();
				this.state = 2579;
				this.match(n1qlParser.DOT);
				this.state = 2580;
				this.index_name();
				this.state = 2581;
				this.opt_index_using();
				this.state = 2582;
				this.with_clause();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2584;
				this.match(n1qlParser.ALTER);
				this.state = 2585;
				this.match(n1qlParser.INDEX);
				this.state = 2586;
				this.index_name();
				this.state = 2587;
				this.match(n1qlParser.ON);
				this.state = 2588;
				this.named_keyspace_ref();
				this.state = 2589;
				this.opt_index_using();
				this.state = 2590;
				this.with_clause();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public build_index(): Build_indexContext {
		let localctx: Build_indexContext = new Build_indexContext(this, this._ctx, this.state);
		this.enterRule(localctx, 430, n1qlParser.RULE_build_index);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2594;
			this.match(n1qlParser.BUILD);
			this.state = 2595;
			this.match(n1qlParser.INDEX);
			this.state = 2596;
			this.match(n1qlParser.ON);
			this.state = 2597;
			this.named_keyspace_ref();
			this.state = 2598;
			this.match(n1qlParser.LPAREN);
			this.state = 2599;
			this.exprs(0);
			this.state = 2600;
			this.match(n1qlParser.RPAREN);
			this.state = 2601;
			this.opt_index_using();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public create_function(): Create_functionContext {
		let localctx: Create_functionContext = new Create_functionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 432, n1qlParser.RULE_create_function);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2603;
			this.match(n1qlParser.CREATE);
			this.state = 2604;
			this.opt_replace();
			this.state = 2605;
			this.match(n1qlParser.FUNCTION);
			this.state = 2606;
			this.opt_if_not_exists();
			this.state = 2607;
			this.func_name();
			this.state = 2608;
			this.match(n1qlParser.LPAREN);
			this.state = 2609;
			this.opt_parm_list();
			this.state = 2610;
			this.match(n1qlParser.RPAREN);
			this.state = 2611;
			this.opt_if_not_exists();
			this.state = 2612;
			this.func_body();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_replace(): Opt_replaceContext {
		let localctx: Opt_replaceContext = new Opt_replaceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 434, n1qlParser.RULE_opt_replace);
		try {
			this.state = 2617;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 98:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 156:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2615;
				this.match(n1qlParser.OR);
				this.state = 2616;
				this.match(n1qlParser.REPLACE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public func_name(): Func_nameContext {
		let localctx: Func_nameContext = new Func_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 436, n1qlParser.RULE_func_name);
		try {
			this.state = 2621;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 221:
			case 237:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2619;
				this.short_func_name();
				}
				break;
			case 32:
			case 202:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2620;
				this.long_func_name();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public short_func_name(): Short_func_nameContext {
		let localctx: Short_func_nameContext = new Short_func_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 438, n1qlParser.RULE_short_func_name);
		try {
			this.state = 2634;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 154, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2623;
				this.keyspace_name();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2624;
				this.path_part();
				this.state = 2625;
				this.match(n1qlParser.DOT);
				this.state = 2626;
				this.path_part();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2628;
				this.path_part();
				this.state = 2629;
				this.match(n1qlParser.DOT);
				this.state = 2630;
				this.path_part();
				this.state = 2631;
				this.match(n1qlParser.DOT);
				this.state = 2632;
				this.path_part();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public long_func_name(): Long_func_nameContext {
		let localctx: Long_func_nameContext = new Long_func_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 440, n1qlParser.RULE_long_func_name);
		try {
			this.state = 2646;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 155, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2636;
				this.namespace_term();
				this.state = 2637;
				this.keyspace_name();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2639;
				this.namespace_term();
				this.state = 2640;
				this.path_part();
				this.state = 2641;
				this.match(n1qlParser.DOT);
				this.state = 2642;
				this.path_part();
				this.state = 2643;
				this.match(n1qlParser.DOT);
				this.state = 2644;
				this.keyspace_name();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_parm_list(): Opt_parm_listContext {
		let localctx: Opt_parm_listContext = new Opt_parm_listContext(this, this._ctx, this.state);
		this.enterRule(localctx, 442, n1qlParser.RULE_opt_parm_list);
		try {
			this.state = 2653;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 22:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2649;
				this.match(n1qlParser.DOT);
				this.state = 2650;
				this.match(n1qlParser.DOT);
				this.state = 2651;
				this.match(n1qlParser.DOT);
				}
				break;
			case 221:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2652;
				this.parameter_terms(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public parameter_terms(): Parameter_termsContext;
	public parameter_terms(_p: number): Parameter_termsContext;
	// @RuleVersion(0)
	public parameter_terms(_p?: number): Parameter_termsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Parameter_termsContext = new Parameter_termsContext(this, this._ctx, _parentState);
		let _prevctx: Parameter_termsContext = localctx;
		let _startState: number = 444;
		this.enterRecursionRule(localctx, 444, n1qlParser.RULE_parameter_terms, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 2656;
			this.permitted_identifiers();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 2663;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 157, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Parameter_termsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_parameter_terms);
					this.state = 2658;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 2659;
					this.match(n1qlParser.COMMA);
					this.state = 2660;
					this.permitted_identifiers();
					}
					}
				}
				this.state = 2665;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 157, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public func_body(): Func_bodyContext {
		let localctx: Func_bodyContext = new Func_bodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 446, n1qlParser.RULE_func_body);
		try {
			this.state = 2690;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 158, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2666;
				this.match(n1qlParser.LBRACE);
				this.state = 2667;
				this.expr(0);
				this.state = 2668;
				this.match(n1qlParser.RBRACE);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2670;
				this.match(n1qlParser.LANGUAGE);
				this.state = 2671;
				this.match(n1qlParser.INLINE);
				this.state = 2672;
				this.match(n1qlParser.AS);
				this.state = 2673;
				this.expr(0);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2674;
				this.match(n1qlParser.LANGUAGE);
				this.state = 2675;
				this.match(n1qlParser.JAVASCRIPT);
				this.state = 2676;
				this.match(n1qlParser.AS);
				this.state = 2677;
				this.match(n1qlParser.STR);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2678;
				this.match(n1qlParser.LANGUAGE);
				this.state = 2679;
				this.match(n1qlParser.JAVASCRIPT);
				this.state = 2680;
				this.match(n1qlParser.AS);
				this.state = 2681;
				this.match(n1qlParser.STR);
				this.state = 2682;
				this.match(n1qlParser.AT);
				this.state = 2683;
				this.match(n1qlParser.STR);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 2684;
				this.match(n1qlParser.LANGUAGE);
				this.state = 2685;
				this.match(n1qlParser.GOLANG);
				this.state = 2686;
				this.match(n1qlParser.AS);
				this.state = 2687;
				this.match(n1qlParser.STR);
				this.state = 2688;
				this.match(n1qlParser.AT);
				this.state = 2689;
				this.match(n1qlParser.STR);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public drop_function(): Drop_functionContext {
		let localctx: Drop_functionContext = new Drop_functionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 448, n1qlParser.RULE_drop_function);
		try {
			this.state = 2702;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 159, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2692;
				this.match(n1qlParser.DROP);
				this.state = 2693;
				this.match(n1qlParser.FUNCTION);
				this.state = 2694;
				this.func_name();
				this.state = 2695;
				this.opt_if_exists();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2697;
				this.match(n1qlParser.DROP);
				this.state = 2698;
				this.match(n1qlParser.FUNCTION);
				this.state = 2699;
				this.match(n1qlParser.IF);
				this.state = 2700;
				this.match(n1qlParser.EXISTS);
				this.state = 2701;
				this.func_name();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public execute_function(): Execute_functionContext {
		let localctx: Execute_functionContext = new Execute_functionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 450, n1qlParser.RULE_execute_function);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2704;
			this.match(n1qlParser.EXECUTE);
			this.state = 2705;
			this.match(n1qlParser.FUNCTION);
			this.state = 2706;
			this.func_name();
			this.state = 2707;
			this.match(n1qlParser.LPAREN);
			this.state = 2708;
			this.opt_exprs();
			this.state = 2709;
			this.match(n1qlParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public update_statistics(): Update_statisticsContext {
		let localctx: Update_statisticsContext = new Update_statisticsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 452, n1qlParser.RULE_update_statistics);
		try {
			this.state = 2833;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 160, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2711;
				this.match(n1qlParser.UPDATE);
				this.state = 2712;
				this.match(n1qlParser.STATISTICS);
				this.state = 2713;
				this.opt_for();
				this.state = 2714;
				this.named_keyspace_ref();
				this.state = 2715;
				this.match(n1qlParser.LPAREN);
				this.state = 2716;
				this.update_stat_terms(0);
				this.state = 2717;
				this.match(n1qlParser.RPAREN);
				this.state = 2718;
				this.opt_with_clause();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2720;
				this.match(n1qlParser.UPDATE);
				this.state = 2721;
				this.match(n1qlParser.STATISTICS);
				this.state = 2722;
				this.opt_for();
				this.state = 2723;
				this.named_keyspace_ref();
				this.state = 2724;
				this.match(n1qlParser.DELETE_);
				this.state = 2725;
				this.match(n1qlParser.LPAREN);
				this.state = 2726;
				this.update_stat_terms(0);
				this.state = 2727;
				this.match(n1qlParser.RPAREN);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2729;
				this.match(n1qlParser.UPDATE);
				this.state = 2730;
				this.match(n1qlParser.STATISTICS);
				this.state = 2731;
				this.opt_for();
				this.state = 2732;
				this.named_keyspace_ref();
				this.state = 2733;
				this.match(n1qlParser.DELETE_);
				this.state = 2734;
				this.match(n1qlParser.ALL);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2736;
				this.match(n1qlParser.UPDATE);
				this.state = 2737;
				this.match(n1qlParser.STATISTICS);
				this.state = 2738;
				this.opt_for();
				this.state = 2739;
				this.named_keyspace_ref();
				this.state = 2740;
				this.match(n1qlParser.INDEX);
				this.state = 2741;
				this.match(n1qlParser.LPAREN);
				this.state = 2742;
				this.exprs(0);
				this.state = 2743;
				this.match(n1qlParser.RPAREN);
				this.state = 2744;
				this.opt_index_using();
				this.state = 2745;
				this.opt_with_clause();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 2747;
				this.match(n1qlParser.UPDATE);
				this.state = 2748;
				this.match(n1qlParser.STATISTICS);
				this.state = 2749;
				this.opt_for();
				this.state = 2750;
				this.named_keyspace_ref();
				this.state = 2751;
				this.match(n1qlParser.INDEX);
				this.state = 2752;
				this.match(n1qlParser.ALL);
				this.state = 2753;
				this.opt_index_using();
				this.state = 2754;
				this.opt_with_clause();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 2756;
				this.match(n1qlParser.UPDATE);
				this.state = 2757;
				this.match(n1qlParser.STATISTICS);
				this.state = 2758;
				this.match(n1qlParser.FOR);
				this.state = 2759;
				this.match(n1qlParser.INDEX);
				this.state = 2760;
				this.simple_named_keyspace_ref();
				this.state = 2761;
				this.match(n1qlParser.DOT);
				this.state = 2762;
				this.index_name();
				this.state = 2763;
				this.opt_index_using();
				this.state = 2764;
				this.opt_with_clause();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 2766;
				this.match(n1qlParser.UPDATE);
				this.state = 2767;
				this.match(n1qlParser.STATISTICS);
				this.state = 2768;
				this.match(n1qlParser.FOR);
				this.state = 2769;
				this.match(n1qlParser.INDEX);
				this.state = 2770;
				this.index_name();
				this.state = 2771;
				this.match(n1qlParser.ON);
				this.state = 2772;
				this.named_keyspace_ref();
				this.state = 2773;
				this.opt_index_using();
				this.state = 2774;
				this.opt_with_clause();
				}
				break;
			case 8:
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 2776;
				this.match(n1qlParser.ANALYZE);
				this.state = 2777;
				this.opt_keyspace_collection();
				this.state = 2778;
				this.named_keyspace_ref();
				this.state = 2779;
				this.match(n1qlParser.LPAREN);
				this.state = 2780;
				this.update_stat_terms(0);
				this.state = 2781;
				this.match(n1qlParser.RPAREN);
				this.state = 2782;
				this.opt_with_clause();
				}
				break;
			case 9:
				this.enterOuterAlt(localctx, 9);
				{
				this.state = 2784;
				this.match(n1qlParser.ANALYZE);
				this.state = 2785;
				this.opt_keyspace_collection();
				this.state = 2786;
				this.named_keyspace_ref();
				this.state = 2787;
				this.match(n1qlParser.DELETE_);
				this.state = 2788;
				this.match(n1qlParser.STATISTICS);
				this.state = 2789;
				this.match(n1qlParser.LPAREN);
				this.state = 2790;
				this.update_stat_terms(0);
				this.state = 2791;
				this.match(n1qlParser.RPAREN);
				}
				break;
			case 10:
				this.enterOuterAlt(localctx, 10);
				{
				this.state = 2793;
				this.match(n1qlParser.ANALYZE);
				this.state = 2794;
				this.opt_keyspace_collection();
				this.state = 2795;
				this.named_keyspace_ref();
				this.state = 2796;
				this.match(n1qlParser.DELETE_);
				this.state = 2797;
				this.match(n1qlParser.STATISTICS);
				}
				break;
			case 11:
				this.enterOuterAlt(localctx, 11);
				{
				this.state = 2799;
				this.match(n1qlParser.ANALYZE);
				this.state = 2800;
				this.opt_keyspace_collection();
				this.state = 2801;
				this.named_keyspace_ref();
				this.state = 2802;
				this.match(n1qlParser.INDEX);
				this.state = 2803;
				this.match(n1qlParser.LPAREN);
				this.state = 2804;
				this.exprs(0);
				this.state = 2805;
				this.match(n1qlParser.RPAREN);
				this.state = 2806;
				this.opt_index_using();
				this.state = 2807;
				this.opt_with_clause();
				}
				break;
			case 12:
				this.enterOuterAlt(localctx, 12);
				{
				this.state = 2809;
				this.match(n1qlParser.ANALYZE);
				this.state = 2810;
				this.opt_keyspace_collection();
				this.state = 2811;
				this.named_keyspace_ref();
				this.state = 2812;
				this.match(n1qlParser.INDEX);
				this.state = 2813;
				this.match(n1qlParser.ALL);
				this.state = 2814;
				this.opt_index_using();
				this.state = 2815;
				this.opt_with_clause();
				}
				break;
			case 13:
				this.enterOuterAlt(localctx, 13);
				{
				this.state = 2817;
				this.match(n1qlParser.ANALYZE);
				this.state = 2818;
				this.match(n1qlParser.INDEX);
				this.state = 2819;
				this.simple_named_keyspace_ref();
				this.state = 2820;
				this.match(n1qlParser.DOT);
				this.state = 2821;
				this.index_name();
				this.state = 2822;
				this.opt_index_using();
				this.state = 2823;
				this.opt_with_clause();
				}
				break;
			case 14:
				this.enterOuterAlt(localctx, 14);
				{
				this.state = 2825;
				this.match(n1qlParser.ANALYZE);
				this.state = 2826;
				this.match(n1qlParser.INDEX);
				this.state = 2827;
				this.index_name();
				this.state = 2828;
				this.match(n1qlParser.ON);
				this.state = 2829;
				this.named_keyspace_ref();
				this.state = 2830;
				this.opt_index_using();
				this.state = 2831;
				this.opt_with_clause();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_for(): Opt_forContext {
		let localctx: Opt_forContext = new Opt_forContext(this, this._ctx, this.state);
		this.enterRule(localctx, 454, n1qlParser.RULE_opt_for);
		try {
			this.state = 2837;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 32:
			case 221:
			case 237:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 94:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2836;
				this.match(n1qlParser.FOR);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public update_stat_terms(): Update_stat_termsContext;
	public update_stat_terms(_p: number): Update_stat_termsContext;
	// @RuleVersion(0)
	public update_stat_terms(_p?: number): Update_stat_termsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Update_stat_termsContext = new Update_stat_termsContext(this, this._ctx, _parentState);
		let _prevctx: Update_stat_termsContext = localctx;
		let _startState: number = 456;
		this.enterRecursionRule(localctx, 456, n1qlParser.RULE_update_stat_terms, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 2840;
			this.update_stat_term();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 2847;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 162, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Update_stat_termsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_update_stat_terms);
					this.state = 2842;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 2843;
					this.match(n1qlParser.COMMA);
					this.state = 2844;
					this.update_stat_term();
					}
					}
				}
				this.state = 2849;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 162, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public update_stat_term(): Update_stat_termContext {
		let localctx: Update_stat_termContext = new Update_stat_termContext(this, this._ctx, this.state);
		this.enterRule(localctx, 458, n1qlParser.RULE_update_stat_term);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2850;
			this.index_term_expr();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public path(): PathContext;
	public path(_p: number): PathContext;
	// @RuleVersion(0)
	public path(_p?: number): PathContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: PathContext = new PathContext(this, this._ctx, _parentState);
		let _prevctx: PathContext = localctx;
		let _startState: number = 460;
		this.enterRecursionRule(localctx, 460, n1qlParser.RULE_path, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 2853;
			this.permitted_identifiers();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 2880;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 164, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 2878;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 163, this._ctx) ) {
					case 1:
						{
						localctx = new PathContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_path);
						this.state = 2855;
						if (!(this.precpred(this._ctx, 5))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
						}
						this.state = 2856;
						this.match(n1qlParser.DOT);
						this.state = 2857;
						this.permitted_identifiers();
						}
						break;
					case 2:
						{
						localctx = new PathContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_path);
						this.state = 2858;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 2859;
						this.match(n1qlParser.DOT);
						this.state = 2860;
						this.ident_icase();
						}
						break;
					case 3:
						{
						localctx = new PathContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_path);
						this.state = 2861;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 2862;
						this.match(n1qlParser.DOT);
						this.state = 2863;
						this.match(n1qlParser.LBRACKET);
						this.state = 2864;
						this.expr(0);
						this.state = 2865;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 4:
						{
						localctx = new PathContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_path);
						this.state = 2867;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 2868;
						this.match(n1qlParser.DOT);
						this.state = 2869;
						this.match(n1qlParser.LBRACKET);
						this.state = 2870;
						this.expr(0);
						this.state = 2871;
						this.match(n1qlParser.RBRACKET_ICASE);
						}
						break;
					case 5:
						{
						localctx = new PathContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_path);
						this.state = 2873;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 2874;
						this.match(n1qlParser.LBRACKET);
						this.state = 2875;
						this.expr(0);
						this.state = 2876;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					}
					}
				}
				this.state = 2882;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 164, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public ident(): IdentContext {
		let localctx: IdentContext = new IdentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 462, n1qlParser.RULE_ident);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2883;
			this.permitted_identifiers();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public ident_icase(): Ident_icaseContext {
		let localctx: Ident_icaseContext = new Ident_icaseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 464, n1qlParser.RULE_ident_icase);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2885;
			this.match(n1qlParser.IDENT_ICASE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public expr(): ExprContext;
	public expr(_p: number): ExprContext;
	// @RuleVersion(0)
	public expr(_p?: number): ExprContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: ExprContext = new ExprContext(this, this._ctx, _parentState);
		let _prevctx: ExprContext = localctx;
		let _startState: number = 466;
		this.enterRecursionRule(localctx, 466, n1qlParser.RULE_expr, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2893;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 2:
			case 3:
			case 9:
			case 21:
			case 23:
			case 27:
			case 32:
			case 38:
			case 39:
			case 52:
			case 64:
			case 81:
			case 87:
			case 90:
			case 141:
			case 147:
			case 148:
			case 151:
			case 180:
			case 195:
			case 198:
			case 202:
			case 209:
			case 221:
			case 237:
			case 238:
			case 239:
			case 240:
			case 241:
			case 242:
			case 243:
			case 244:
			case 245:
			case 255:
			case 256:
			case 257:
			case 258:
			case 259:
			case 264:
			case 265:
			case 266:
			case 267:
				{
				this.state = 2888;
				this.c_expr();
				}
				break;
			case 146:
				{
				this.state = 2889;
				this.match(n1qlParser.NOT);
				this.state = 2890;
				this.expr(29);
				}
				break;
			case 85:
				{
				this.state = 2891;
				this.match(n1qlParser.EXISTS);
				this.state = 2892;
				this.expr(1);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 3095;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 167, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 3093;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 166, this._ctx) ) {
					case 1:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2895;
						if (!(this.precpred(this._ctx, 38))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 38)");
						}
						this.state = 2896;
						this.match(n1qlParser.PLUS);
						this.state = 2897;
						this.expr(39);
						}
						break;
					case 2:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2898;
						if (!(this.precpred(this._ctx, 37))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 37)");
						}
						this.state = 2899;
						this.match(n1qlParser.MINUS);
						this.state = 2900;
						this.expr(38);
						}
						break;
					case 3:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2901;
						if (!(this.precpred(this._ctx, 36))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 36)");
						}
						this.state = 2902;
						this.match(n1qlParser.STAR);
						this.state = 2903;
						this.expr(37);
						}
						break;
					case 4:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2904;
						if (!(this.precpred(this._ctx, 35))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 35)");
						}
						this.state = 2905;
						this.match(n1qlParser.DIV);
						this.state = 2906;
						this.expr(36);
						}
						break;
					case 5:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2907;
						if (!(this.precpred(this._ctx, 34))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 34)");
						}
						this.state = 2908;
						this.match(n1qlParser.MOD);
						this.state = 2909;
						this.expr(35);
						}
						break;
					case 6:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2910;
						if (!(this.precpred(this._ctx, 33))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 33)");
						}
						this.state = 2911;
						this.match(n1qlParser.POW);
						this.state = 2912;
						this.expr(34);
						}
						break;
					case 7:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2913;
						if (!(this.precpred(this._ctx, 32))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 32)");
						}
						this.state = 2914;
						this.match(n1qlParser.CONCAT);
						this.state = 2915;
						this.expr(33);
						}
						break;
					case 8:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2916;
						if (!(this.precpred(this._ctx, 31))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 31)");
						}
						this.state = 2917;
						this.match(n1qlParser.AND);
						this.state = 2918;
						this.expr(32);
						}
						break;
					case 9:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2919;
						if (!(this.precpred(this._ctx, 30))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 30)");
						}
						this.state = 2920;
						this.match(n1qlParser.OR);
						this.state = 2921;
						this.expr(31);
						}
						break;
					case 10:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2922;
						if (!(this.precpred(this._ctx, 28))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 28)");
						}
						this.state = 2923;
						this.match(n1qlParser.EQ);
						this.state = 2924;
						this.expr(29);
						}
						break;
					case 11:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2925;
						if (!(this.precpred(this._ctx, 27))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 27)");
						}
						this.state = 2926;
						this.match(n1qlParser.DEQ);
						this.state = 2927;
						this.expr(28);
						}
						break;
					case 12:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2928;
						if (!(this.precpred(this._ctx, 26))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 26)");
						}
						this.state = 2929;
						this.match(n1qlParser.NE);
						this.state = 2930;
						this.expr(27);
						}
						break;
					case 13:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2931;
						if (!(this.precpred(this._ctx, 25))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 25)");
						}
						this.state = 2932;
						this.match(n1qlParser.LT);
						this.state = 2933;
						this.expr(26);
						}
						break;
					case 14:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2934;
						if (!(this.precpred(this._ctx, 24))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 24)");
						}
						this.state = 2935;
						this.match(n1qlParser.GT);
						this.state = 2936;
						this.expr(25);
						}
						break;
					case 15:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2937;
						if (!(this.precpred(this._ctx, 23))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 23)");
						}
						this.state = 2938;
						this.match(n1qlParser.LE);
						this.state = 2939;
						this.expr(24);
						}
						break;
					case 16:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2940;
						if (!(this.precpred(this._ctx, 22))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 22)");
						}
						this.state = 2941;
						this.match(n1qlParser.GE);
						this.state = 2942;
						this.expr(23);
						}
						break;
					case 17:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2943;
						if (!(this.precpred(this._ctx, 19))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 19)");
						}
						this.state = 2944;
						this.match(n1qlParser.LIKE);
						this.state = 2945;
						this.expr(0);
						this.state = 2946;
						this.match(n1qlParser.ESCAPE);
						this.state = 2947;
						this.expr(20);
						}
						break;
					case 18:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2949;
						if (!(this.precpred(this._ctx, 18))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 18)");
						}
						this.state = 2950;
						this.match(n1qlParser.LIKE);
						this.state = 2951;
						this.expr(19);
						}
						break;
					case 19:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2952;
						if (!(this.precpred(this._ctx, 17))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 17)");
						}
						this.state = 2953;
						this.match(n1qlParser.NOT);
						this.state = 2954;
						this.match(n1qlParser.LIKE);
						this.state = 2955;
						this.expr(0);
						this.state = 2956;
						this.match(n1qlParser.ESCAPE);
						this.state = 2957;
						this.expr(18);
						}
						break;
					case 20:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2959;
						if (!(this.precpred(this._ctx, 16))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 16)");
						}
						this.state = 2960;
						this.match(n1qlParser.NOT);
						this.state = 2961;
						this.match(n1qlParser.LIKE);
						this.state = 2962;
						this.expr(17);
						}
						break;
					case 21:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2963;
						if (!(this.precpred(this._ctx, 15))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 15)");
						}
						this.state = 2964;
						this.match(n1qlParser.IN);
						this.state = 2965;
						this.expr(16);
						}
						break;
					case 22:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2966;
						if (!(this.precpred(this._ctx, 14))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
						}
						this.state = 2967;
						this.match(n1qlParser.NOT);
						this.state = 2968;
						this.match(n1qlParser.IN);
						this.state = 2969;
						this.expr(15);
						}
						break;
					case 23:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2970;
						if (!(this.precpred(this._ctx, 13))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 13)");
						}
						this.state = 2971;
						this.match(n1qlParser.WITHIN);
						this.state = 2972;
						this.expr(14);
						}
						break;
					case 24:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2973;
						if (!(this.precpred(this._ctx, 12))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
						}
						this.state = 2974;
						this.match(n1qlParser.NOT);
						this.state = 2975;
						this.match(n1qlParser.WITHIN);
						this.state = 2976;
						this.expr(13);
						}
						break;
					case 25:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2977;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 2978;
						this.match(n1qlParser.IS);
						this.state = 2979;
						this.match(n1qlParser.DISTINCT);
						this.state = 2980;
						this.match(n1qlParser.FROM);
						this.state = 2981;
						this.expr(4);
						}
						break;
					case 26:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2982;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 2983;
						this.match(n1qlParser.IS);
						this.state = 2984;
						this.match(n1qlParser.NOT);
						this.state = 2985;
						this.match(n1qlParser.DISTINCT);
						this.state = 2986;
						this.match(n1qlParser.FROM);
						this.state = 2987;
						this.expr(3);
						}
						break;
					case 27:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2988;
						if (!(this.precpred(this._ctx, 51))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 51)");
						}
						this.state = 2989;
						this.match(n1qlParser.DOT);
						this.state = 2990;
						this.ident();
						this.state = 2991;
						this.match(n1qlParser.LPAREN);
						this.state = 2992;
						this.opt_exprs();
						this.state = 2993;
						this.match(n1qlParser.RPAREN);
						}
						break;
					case 28:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2995;
						if (!(this.precpred(this._ctx, 50))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 50)");
						}
						this.state = 2996;
						this.match(n1qlParser.DOT);
						this.state = 2997;
						this.ident();
						}
						break;
					case 29:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 2998;
						if (!(this.precpred(this._ctx, 49))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 49)");
						}
						this.state = 2999;
						this.match(n1qlParser.DOT);
						this.state = 3000;
						this.ident_icase();
						}
						break;
					case 30:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3001;
						if (!(this.precpred(this._ctx, 48))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 48)");
						}
						this.state = 3002;
						this.match(n1qlParser.DOT);
						this.state = 3003;
						this.match(n1qlParser.LBRACKET);
						this.state = 3004;
						this.expr(0);
						this.state = 3005;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 31:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3007;
						if (!(this.precpred(this._ctx, 47))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 47)");
						}
						this.state = 3008;
						this.match(n1qlParser.DOT);
						this.state = 3009;
						this.match(n1qlParser.LBRACKET);
						this.state = 3010;
						this.expr(0);
						this.state = 3011;
						this.match(n1qlParser.RBRACKET_ICASE);
						}
						break;
					case 32:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3013;
						if (!(this.precpred(this._ctx, 46))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 46)");
						}
						this.state = 3014;
						this.match(n1qlParser.LBRACKET);
						this.state = 3015;
						this.match(n1qlParser.RANDOM_ELEMENT);
						this.state = 3016;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 33:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3017;
						if (!(this.precpred(this._ctx, 45))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 45)");
						}
						this.state = 3018;
						this.match(n1qlParser.LBRACKET);
						this.state = 3019;
						this.expr(0);
						this.state = 3020;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 34:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3022;
						if (!(this.precpred(this._ctx, 44))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 44)");
						}
						this.state = 3023;
						this.match(n1qlParser.LBRACKET);
						this.state = 3024;
						this.expr(0);
						this.state = 3025;
						this.match(n1qlParser.COLON);
						this.state = 3026;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 35:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3028;
						if (!(this.precpred(this._ctx, 43))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 43)");
						}
						this.state = 3029;
						this.match(n1qlParser.LBRACKET);
						this.state = 3030;
						this.expr(0);
						this.state = 3031;
						this.match(n1qlParser.COLON);
						this.state = 3032;
						this.expr(0);
						this.state = 3033;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 36:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3035;
						if (!(this.precpred(this._ctx, 42))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 42)");
						}
						this.state = 3036;
						this.match(n1qlParser.LBRACKET);
						this.state = 3037;
						this.match(n1qlParser.COLON);
						this.state = 3038;
						this.expr(0);
						this.state = 3039;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 37:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3041;
						if (!(this.precpred(this._ctx, 41))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 41)");
						}
						this.state = 3042;
						this.match(n1qlParser.LBRACKET);
						this.state = 3043;
						this.match(n1qlParser.COLON);
						this.state = 3044;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 38:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3045;
						if (!(this.precpred(this._ctx, 40))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 40)");
						}
						this.state = 3046;
						this.match(n1qlParser.LBRACKET);
						this.state = 3047;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 39:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3048;
						if (!(this.precpred(this._ctx, 39))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 39)");
						}
						this.state = 3049;
						this.match(n1qlParser.LBRACKET);
						this.state = 3050;
						this.match(n1qlParser.STAR);
						this.state = 3051;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 40:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3052;
						if (!(this.precpred(this._ctx, 21))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 21)");
						}
						this.state = 3053;
						this.match(n1qlParser.BETWEEN);
						this.state = 3054;
						this.b_expr(0);
						this.state = 3055;
						this.match(n1qlParser.AND);
						this.state = 3056;
						this.b_expr(0);
						}
						break;
					case 41:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3058;
						if (!(this.precpred(this._ctx, 20))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 20)");
						}
						this.state = 3059;
						this.match(n1qlParser.NOT);
						this.state = 3060;
						this.match(n1qlParser.BETWEEN);
						this.state = 3061;
						this.b_expr(0);
						this.state = 3062;
						this.match(n1qlParser.AND);
						this.state = 3063;
						this.b_expr(0);
						}
						break;
					case 42:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3065;
						if (!(this.precpred(this._ctx, 11))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 11)");
						}
						this.state = 3066;
						this.match(n1qlParser.IS);
						this.state = 3067;
						this.match(n1qlParser.NULL);
						}
						break;
					case 43:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3068;
						if (!(this.precpred(this._ctx, 10))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 10)");
						}
						this.state = 3069;
						this.match(n1qlParser.IS);
						this.state = 3070;
						this.match(n1qlParser.NOT);
						this.state = 3071;
						this.match(n1qlParser.NULL);
						}
						break;
					case 44:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3072;
						if (!(this.precpred(this._ctx, 9))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
						}
						this.state = 3073;
						this.match(n1qlParser.IS);
						this.state = 3074;
						this.match(n1qlParser.MISSING);
						}
						break;
					case 45:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3075;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 3076;
						this.match(n1qlParser.IS);
						this.state = 3077;
						this.match(n1qlParser.NOT);
						this.state = 3078;
						this.match(n1qlParser.MISSING);
						}
						break;
					case 46:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3079;
						if (!(this.precpred(this._ctx, 7))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
						}
						this.state = 3080;
						this.match(n1qlParser.IS);
						this.state = 3081;
						this.valued();
						}
						break;
					case 47:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3082;
						if (!(this.precpred(this._ctx, 6))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 6)");
						}
						this.state = 3083;
						this.match(n1qlParser.IS);
						this.state = 3084;
						this.match(n1qlParser.NOT);
						this.state = 3085;
						this.match(n1qlParser.UNKNOWN);
						}
						break;
					case 48:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3086;
						if (!(this.precpred(this._ctx, 5))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
						}
						this.state = 3087;
						this.match(n1qlParser.IS);
						this.state = 3088;
						this.match(n1qlParser.NOT);
						this.state = 3089;
						this.valued();
						}
						break;
					case 49:
						{
						localctx = new ExprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_expr);
						this.state = 3090;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 3091;
						this.match(n1qlParser.IS);
						this.state = 3092;
						this.match(n1qlParser.UNKNOWN);
						}
						break;
					}
					}
				}
				this.state = 3097;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 167, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public valued(): ValuedContext {
		let localctx: ValuedContext = new ValuedContext(this, this._ctx, this.state);
		this.enterRule(localctx, 468, n1qlParser.RULE_valued);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3098;
			_la = this._input.LA(1);
			if(!(_la===126 || _la===225)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public c_expr(): C_exprContext {
		let localctx: C_exprContext = new C_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 470, n1qlParser.RULE_c_expr);
		try {
			this.state = 3130;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 168, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3100;
				this.literal();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3101;
				this.sequence_expr();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3102;
				this.construction_expr();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 3103;
				this.permitted_identifiers();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 3104;
				this.match(n1qlParser.IDENT_ICASE);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 3105;
				this.match(n1qlParser.SELF);
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 3106;
				this.param_expr();
				}
				break;
			case 8:
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 3107;
				this.function_expr();
				}
				break;
			case 9:
				this.enterOuterAlt(localctx, 9);
				{
				this.state = 3108;
				this.match(n1qlParser.MINUS);
				this.state = 3109;
				this.expr(0);
				}
				break;
			case 10:
				this.enterOuterAlt(localctx, 10);
				{
				this.state = 3110;
				this.case_expr();
				}
				break;
			case 11:
				this.enterOuterAlt(localctx, 11);
				{
				this.state = 3111;
				this.collection_expr();
				}
				break;
			case 12:
				this.enterOuterAlt(localctx, 12);
				{
				this.state = 3112;
				this.paren_expr();
				}
				break;
			case 13:
				this.enterOuterAlt(localctx, 13);
				{
				this.state = 3113;
				this.match(n1qlParser.T__COVER);
				this.state = 3114;
				this.match(n1qlParser.LPAREN);
				this.state = 3115;
				this.expr(0);
				this.state = 3116;
				this.match(n1qlParser.RPAREN);
				}
				break;
			case 14:
				this.enterOuterAlt(localctx, 14);
				{
				this.state = 3118;
				this.match(n1qlParser.T__INDEX_KEY);
				this.state = 3119;
				this.match(n1qlParser.LPAREN);
				this.state = 3120;
				this.expr(0);
				this.state = 3121;
				this.match(n1qlParser.RPAREN);
				}
				break;
			case 15:
				this.enterOuterAlt(localctx, 15);
				{
				this.state = 3123;
				this.match(n1qlParser.T__INDEX_CONDITION);
				this.state = 3124;
				this.match(n1qlParser.LPAREN);
				this.state = 3125;
				this.expr(0);
				this.state = 3126;
				this.match(n1qlParser.RPAREN);
				}
				break;
			case 16:
				this.enterOuterAlt(localctx, 16);
				{
				this.state = 3128;
				this.match(n1qlParser.CURRENT);
				this.state = 3129;
				this.match(n1qlParser.USER);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public b_expr(): B_exprContext;
	public b_expr(_p: number): B_exprContext;
	// @RuleVersion(0)
	public b_expr(_p?: number): B_exprContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: B_exprContext = new B_exprContext(this, this._ctx, _parentState);
		let _prevctx: B_exprContext = localctx;
		let _startState: number = 472;
		this.enterRecursionRule(localctx, 472, n1qlParser.RULE_b_expr, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 3133;
			this.c_expr();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 3215;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 170, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 3213;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 169, this._ctx) ) {
					case 1:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3135;
						if (!(this.precpred(this._ctx, 7))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
						}
						this.state = 3136;
						this.match(n1qlParser.PLUS);
						this.state = 3137;
						this.b_expr(8);
						}
						break;
					case 2:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3138;
						if (!(this.precpred(this._ctx, 6))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 6)");
						}
						this.state = 3139;
						this.match(n1qlParser.MINUS);
						this.state = 3140;
						this.b_expr(7);
						}
						break;
					case 3:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3141;
						if (!(this.precpred(this._ctx, 5))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 5)");
						}
						this.state = 3142;
						this.match(n1qlParser.STAR);
						this.state = 3143;
						this.b_expr(6);
						}
						break;
					case 4:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3144;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 3145;
						this.match(n1qlParser.DIV);
						this.state = 3146;
						this.b_expr(5);
						}
						break;
					case 5:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3147;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 3148;
						this.match(n1qlParser.MOD);
						this.state = 3149;
						this.b_expr(4);
						}
						break;
					case 6:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3150;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 3151;
						this.match(n1qlParser.POW);
						this.state = 3152;
						this.b_expr(3);
						}
						break;
					case 7:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3153;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 3154;
						this.match(n1qlParser.CONCAT);
						this.state = 3155;
						this.b_expr(2);
						}
						break;
					case 8:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3156;
						if (!(this.precpred(this._ctx, 18))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 18)");
						}
						this.state = 3157;
						this.match(n1qlParser.DOT);
						this.state = 3158;
						this.permitted_identifiers();
						this.state = 3159;
						this.match(n1qlParser.LPAREN);
						this.state = 3160;
						this.opt_exprs();
						this.state = 3161;
						this.match(n1qlParser.RPAREN);
						}
						break;
					case 9:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3163;
						if (!(this.precpred(this._ctx, 17))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 17)");
						}
						this.state = 3164;
						this.match(n1qlParser.DOT);
						this.state = 3165;
						this.permitted_identifiers();
						}
						break;
					case 10:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3166;
						if (!(this.precpred(this._ctx, 16))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 16)");
						}
						this.state = 3167;
						this.match(n1qlParser.DOT);
						this.state = 3168;
						this.ident_icase();
						}
						break;
					case 11:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3169;
						if (!(this.precpred(this._ctx, 15))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 15)");
						}
						this.state = 3170;
						this.match(n1qlParser.DOT);
						this.state = 3171;
						this.match(n1qlParser.LBRACKET);
						this.state = 3172;
						this.expr(0);
						this.state = 3173;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 12:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3175;
						if (!(this.precpred(this._ctx, 14))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
						}
						this.state = 3176;
						this.match(n1qlParser.DOT);
						this.state = 3177;
						this.match(n1qlParser.LBRACKET);
						this.state = 3178;
						this.expr(0);
						this.state = 3179;
						this.match(n1qlParser.RBRACKET_ICASE);
						}
						break;
					case 13:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3181;
						if (!(this.precpred(this._ctx, 13))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 13)");
						}
						this.state = 3182;
						this.match(n1qlParser.LBRACKET);
						this.state = 3183;
						this.expr(0);
						this.state = 3184;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 14:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3186;
						if (!(this.precpred(this._ctx, 12))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
						}
						this.state = 3187;
						this.match(n1qlParser.LBRACKET);
						this.state = 3188;
						this.expr(0);
						this.state = 3189;
						this.match(n1qlParser.COLON);
						this.state = 3190;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 15:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3192;
						if (!(this.precpred(this._ctx, 11))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 11)");
						}
						this.state = 3193;
						this.match(n1qlParser.LBRACKET);
						this.state = 3194;
						this.match(n1qlParser.COLON);
						this.state = 3195;
						this.expr(0);
						this.state = 3196;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 16:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3198;
						if (!(this.precpred(this._ctx, 10))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 10)");
						}
						this.state = 3199;
						this.match(n1qlParser.LBRACKET);
						this.state = 3200;
						this.expr(0);
						this.state = 3201;
						this.match(n1qlParser.COLON);
						this.state = 3202;
						this.expr(0);
						this.state = 3203;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 17:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3205;
						if (!(this.precpred(this._ctx, 9))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
						}
						this.state = 3206;
						this.match(n1qlParser.LBRACKET);
						this.state = 3207;
						this.match(n1qlParser.COLON);
						this.state = 3208;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					case 18:
						{
						localctx = new B_exprContext(this, _parentctx, _parentState);
						this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_b_expr);
						this.state = 3209;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 3210;
						this.match(n1qlParser.LBRACKET);
						this.state = 3211;
						this.match(n1qlParser.STAR);
						this.state = 3212;
						this.match(n1qlParser.RBRACKET);
						}
						break;
					}
					}
				}
				this.state = 3217;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 170, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public literal(): LiteralContext {
		let localctx: LiteralContext = new LiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 474, n1qlParser.RULE_literal);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3218;
			_la = this._input.LA(1);
			if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 14) !== 0) || _la===87 || _la===141 || _la===148 || _la===209)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public construction_expr(): Construction_exprContext {
		let localctx: Construction_exprContext = new Construction_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 476, n1qlParser.RULE_construction_expr);
		try {
			this.state = 3222;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 23:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3220;
				this.object();
				}
				break;
			case 27:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3221;
				this.array();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public object(): ObjectContext {
		let localctx: ObjectContext = new ObjectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 478, n1qlParser.RULE_object);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3224;
			this.match(n1qlParser.LBRACE);
			this.state = 3225;
			this.opt_members();
			this.state = 3226;
			this.match(n1qlParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_members(): Opt_membersContext {
		let localctx: Opt_membersContext = new Opt_membersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 480, n1qlParser.RULE_opt_members);
		try {
			this.state = 3230;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 24:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 1:
			case 2:
			case 3:
			case 9:
			case 21:
			case 23:
			case 27:
			case 32:
			case 38:
			case 39:
			case 52:
			case 64:
			case 81:
			case 85:
			case 87:
			case 90:
			case 141:
			case 146:
			case 147:
			case 148:
			case 151:
			case 180:
			case 195:
			case 198:
			case 202:
			case 209:
			case 221:
			case 237:
			case 238:
			case 239:
			case 240:
			case 241:
			case 242:
			case 243:
			case 244:
			case 245:
			case 255:
			case 256:
			case 257:
			case 258:
			case 259:
			case 264:
			case 265:
			case 266:
			case 267:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3229;
				this.members(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public members(): MembersContext;
	public members(_p: number): MembersContext;
	// @RuleVersion(0)
	public members(_p?: number): MembersContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: MembersContext = new MembersContext(this, this._ctx, _parentState);
		let _prevctx: MembersContext = localctx;
		let _startState: number = 482;
		this.enterRecursionRule(localctx, 482, n1qlParser.RULE_members, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 3233;
			this.member();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 3240;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 173, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new MembersContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_members);
					this.state = 3235;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 3236;
					this.match(n1qlParser.COMMA);
					this.state = 3237;
					this.member();
					}
					}
				}
				this.state = 3242;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 173, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public member(): MemberContext {
		let localctx: MemberContext = new MemberContext(this, this._ctx, this.state);
		this.enterRule(localctx, 484, n1qlParser.RULE_member);
		try {
			this.state = 3250;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 174, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3243;
				this.expr(0);
				this.state = 3244;
				this.match(n1qlParser.COLON);
				this.state = 3245;
				this.expr(0);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3247;
				this.expr(0);
				this.state = 3248;
				this.opt_as_alias();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public array(): ArrayContext {
		let localctx: ArrayContext = new ArrayContext(this, this._ctx, this.state);
		this.enterRule(localctx, 486, n1qlParser.RULE_array);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3252;
			this.match(n1qlParser.LBRACKET);
			this.state = 3253;
			this.opt_exprs();
			this.state = 3254;
			this.match(n1qlParser.RBRACKET);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_exprs(): Opt_exprsContext {
		let localctx: Opt_exprsContext = new Opt_exprsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 488, n1qlParser.RULE_opt_exprs);
		try {
			this.state = 3258;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 22:
			case 28:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 1:
			case 2:
			case 3:
			case 9:
			case 21:
			case 23:
			case 27:
			case 32:
			case 38:
			case 39:
			case 52:
			case 64:
			case 81:
			case 85:
			case 87:
			case 90:
			case 141:
			case 146:
			case 147:
			case 148:
			case 151:
			case 180:
			case 195:
			case 198:
			case 202:
			case 209:
			case 221:
			case 237:
			case 238:
			case 239:
			case 240:
			case 241:
			case 242:
			case 243:
			case 244:
			case 245:
			case 255:
			case 256:
			case 257:
			case 258:
			case 259:
			case 264:
			case 265:
			case 266:
			case 267:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3257;
				this.exprs(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public exprs(): ExprsContext;
	public exprs(_p: number): ExprsContext;
	// @RuleVersion(0)
	public exprs(_p?: number): ExprsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: ExprsContext = new ExprsContext(this, this._ctx, _parentState);
		let _prevctx: ExprsContext = localctx;
		let _startState: number = 490;
		this.enterRecursionRule(localctx, 490, n1qlParser.RULE_exprs, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 3261;
			this.expr(0);
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 3268;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 176, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new ExprsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_exprs);
					this.state = 3263;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 3264;
					this.match(n1qlParser.COMMA);
					this.state = 3265;
					this.expr(0);
					}
					}
				}
				this.state = 3270;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 176, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public param_expr(): Param_exprContext {
		let localctx: Param_exprContext = new Param_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 492, n1qlParser.RULE_param_expr);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3271;
			_la = this._input.LA(1);
			if(!(((((_la - 239)) & ~0x1F) === 0 && ((1 << (_la - 239)) & 7) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public case_expr(): Case_exprContext {
		let localctx: Case_exprContext = new Case_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 494, n1qlParser.RULE_case_expr);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3273;
			this.match(n1qlParser.CASE);
			this.state = 3274;
			this.simple_or_searched_case();
			this.state = 3275;
			this.match(n1qlParser.END);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public simple_or_searched_case(): Simple_or_searched_caseContext {
		let localctx: Simple_or_searched_caseContext = new Simple_or_searched_caseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 496, n1qlParser.RULE_simple_or_searched_case);
		try {
			this.state = 3279;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 2:
			case 3:
			case 9:
			case 21:
			case 23:
			case 27:
			case 32:
			case 38:
			case 39:
			case 52:
			case 64:
			case 81:
			case 85:
			case 87:
			case 90:
			case 141:
			case 146:
			case 147:
			case 148:
			case 151:
			case 180:
			case 195:
			case 198:
			case 202:
			case 209:
			case 221:
			case 237:
			case 238:
			case 239:
			case 240:
			case 241:
			case 242:
			case 243:
			case 244:
			case 245:
			case 255:
			case 256:
			case 257:
			case 258:
			case 259:
			case 264:
			case 265:
			case 266:
			case 267:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3277;
				this.simple_case();
				}
				break;
			case 229:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3278;
				this.searched_case();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public simple_case(): Simple_caseContext {
		let localctx: Simple_caseContext = new Simple_caseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 498, n1qlParser.RULE_simple_case);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3281;
			this.expr(0);
			this.state = 3282;
			this.when_thens(0);
			this.state = 3283;
			this.opt_else();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public when_thens(): When_thensContext;
	public when_thens(_p: number): When_thensContext;
	// @RuleVersion(0)
	public when_thens(_p?: number): When_thensContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: When_thensContext = new When_thensContext(this, this._ctx, _parentState);
		let _prevctx: When_thensContext = localctx;
		let _startState: number = 500;
		this.enterRecursionRule(localctx, 500, n1qlParser.RULE_when_thens, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 3286;
			this.match(n1qlParser.WHEN);
			this.state = 3287;
			this.expr(0);
			this.state = 3288;
			this.match(n1qlParser.THEN);
			this.state = 3289;
			this.expr(0);
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 3299;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 178, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new When_thensContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_when_thens);
					this.state = 3291;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 3292;
					this.match(n1qlParser.WHEN);
					this.state = 3293;
					this.expr(0);
					this.state = 3294;
					this.match(n1qlParser.THEN);
					this.state = 3295;
					this.expr(0);
					}
					}
				}
				this.state = 3301;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 178, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public searched_case(): Searched_caseContext {
		let localctx: Searched_caseContext = new Searched_caseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 502, n1qlParser.RULE_searched_case);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3302;
			this.when_thens(0);
			this.state = 3303;
			this.opt_else();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_else(): Opt_elseContext {
		let localctx: Opt_elseContext = new Opt_elseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 504, n1qlParser.RULE_opt_else);
		try {
			this.state = 3308;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 80:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 79:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3306;
				this.match(n1qlParser.ELSE);
				this.state = 3307;
				this.expr(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public function_expr(): Function_exprContext {
		let localctx: Function_exprContext = new Function_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 506, n1qlParser.RULE_function_expr);
		try {
			this.state = 3351;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 180, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3310;
				this.match(n1qlParser.FLATTEN_KEYS);
				this.state = 3311;
				this.match(n1qlParser.LPAREN);
				this.state = 3312;
				this.opt_flatten_keys_exprs();
				this.state = 3313;
				this.match(n1qlParser.RPAREN);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3315;
				this.match(n1qlParser.NTH_VALUE);
				this.state = 3316;
				this.match(n1qlParser.LPAREN);
				this.state = 3317;
				this.exprs(0);
				this.state = 3318;
				this.match(n1qlParser.RPAREN);
				this.state = 3319;
				this.opt_from_first_last();
				this.state = 3320;
				this.opt_nulls_treatment();
				this.state = 3321;
				this.window_function_details();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3323;
				this.function_name();
				this.state = 3324;
				this.match(n1qlParser.LPAREN);
				this.state = 3325;
				this.opt_exprs();
				this.state = 3326;
				this.match(n1qlParser.RPAREN);
				this.state = 3327;
				this.opt_filter();
				this.state = 3328;
				this.opt_nulls_treatment();
				this.state = 3329;
				this.opt_window_function();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 3331;
				this.function_name();
				this.state = 3332;
				this.match(n1qlParser.LPAREN);
				this.state = 3333;
				this.agg_quantifier();
				this.state = 3334;
				this.expr(0);
				this.state = 3335;
				this.match(n1qlParser.RPAREN);
				this.state = 3336;
				this.opt_filter();
				this.state = 3337;
				this.opt_window_function();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 3339;
				this.function_name();
				this.state = 3340;
				this.match(n1qlParser.LPAREN);
				this.state = 3341;
				this.match(n1qlParser.STAR);
				this.state = 3342;
				this.match(n1qlParser.RPAREN);
				this.state = 3343;
				this.opt_filter();
				this.state = 3344;
				this.opt_window_function();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 3346;
				this.long_func_name();
				this.state = 3347;
				this.match(n1qlParser.LPAREN);
				this.state = 3348;
				this.opt_exprs();
				this.state = 3349;
				this.match(n1qlParser.RPAREN);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public function_name(): Function_nameContext {
		let localctx: Function_nameContext = new Function_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 508, n1qlParser.RULE_function_name);
		try {
			this.state = 3355;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 221:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3353;
				this.ident();
				}
				break;
			case 180:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3354;
				this.match(n1qlParser.REPLACE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public collection_expr(): Collection_exprContext {
		let localctx: Collection_exprContext = new Collection_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 510, n1qlParser.RULE_collection_expr);
		try {
			this.state = 3359;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 38:
			case 81:
			case 198:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3357;
				this.collection_cond();
				}
				break;
			case 39:
			case 90:
			case 151:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3358;
				this.collection_xform();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public collection_cond(): Collection_condContext {
		let localctx: Collection_condContext = new Collection_condContext(this, this._ctx, this.state);
		this.enterRule(localctx, 512, n1qlParser.RULE_collection_cond);
		try {
			this.state = 3390;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 183, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3361;
				this.match(n1qlParser.ANY);
				this.state = 3362;
				this.coll_bindings(0);
				this.state = 3363;
				this.satisfies();
				this.state = 3364;
				this.match(n1qlParser.END);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3366;
				this.match(n1qlParser.SOME);
				this.state = 3367;
				this.coll_bindings(0);
				this.state = 3368;
				this.satisfies();
				this.state = 3369;
				this.match(n1qlParser.END);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3371;
				this.match(n1qlParser.EVERY);
				this.state = 3372;
				this.coll_bindings(0);
				this.state = 3373;
				this.satisfies();
				this.state = 3374;
				this.match(n1qlParser.END);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 3376;
				this.match(n1qlParser.ANY);
				this.state = 3377;
				this.match(n1qlParser.AND);
				this.state = 3378;
				this.match(n1qlParser.EVERY);
				this.state = 3379;
				this.coll_bindings(0);
				this.state = 3380;
				this.satisfies();
				this.state = 3381;
				this.match(n1qlParser.END);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 3383;
				this.match(n1qlParser.SOME);
				this.state = 3384;
				this.match(n1qlParser.AND);
				this.state = 3385;
				this.match(n1qlParser.EVERY);
				this.state = 3386;
				this.coll_bindings(0);
				this.state = 3387;
				this.satisfies();
				this.state = 3388;
				this.match(n1qlParser.END);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public coll_bindings(): Coll_bindingsContext;
	public coll_bindings(_p: number): Coll_bindingsContext;
	// @RuleVersion(0)
	public coll_bindings(_p?: number): Coll_bindingsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Coll_bindingsContext = new Coll_bindingsContext(this, this._ctx, _parentState);
		let _prevctx: Coll_bindingsContext = localctx;
		let _startState: number = 514;
		this.enterRecursionRule(localctx, 514, n1qlParser.RULE_coll_bindings, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 3393;
			this.coll_binding();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 3400;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 184, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Coll_bindingsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_coll_bindings);
					this.state = 3395;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 3396;
					this.match(n1qlParser.COMMA);
					this.state = 3397;
					this.coll_binding();
					}
					}
				}
				this.state = 3402;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 184, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public coll_binding(): Coll_bindingContext {
		let localctx: Coll_bindingContext = new Coll_bindingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 516, n1qlParser.RULE_coll_binding);
		try {
			this.state = 3423;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 185, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3403;
				this.variable();
				this.state = 3404;
				this.match(n1qlParser.IN);
				this.state = 3405;
				this.expr(0);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3407;
				this.variable();
				this.state = 3408;
				this.match(n1qlParser.WITHIN);
				this.state = 3409;
				this.expr(0);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3411;
				this.variable();
				this.state = 3412;
				this.match(n1qlParser.COLON);
				this.state = 3413;
				this.variable();
				this.state = 3414;
				this.match(n1qlParser.IN);
				this.state = 3415;
				this.expr(0);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 3417;
				this.variable();
				this.state = 3418;
				this.match(n1qlParser.COLON);
				this.state = 3419;
				this.variable();
				this.state = 3420;
				this.match(n1qlParser.WITHIN);
				this.state = 3421;
				this.expr(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public satisfies(): SatisfiesContext {
		let localctx: SatisfiesContext = new SatisfiesContext(this, this._ctx, this.state);
		this.enterRule(localctx, 518, n1qlParser.RULE_satisfies);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3425;
			this.match(n1qlParser.SATISFIES);
			this.state = 3426;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public collection_xform(): Collection_xformContext {
		let localctx: Collection_xformContext = new Collection_xformContext(this, this._ctx, this.state);
		this.enterRule(localctx, 520, n1qlParser.RULE_collection_xform);
		try {
			this.state = 3451;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 39:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3428;
				this.match(n1qlParser.ARRAY);
				this.state = 3429;
				this.expr(0);
				this.state = 3430;
				this.match(n1qlParser.FOR);
				this.state = 3431;
				this.coll_bindings(0);
				this.state = 3432;
				this.opt_when();
				this.state = 3433;
				this.match(n1qlParser.END);
				}
				break;
			case 90:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3435;
				this.match(n1qlParser.FIRST);
				this.state = 3436;
				this.expr(0);
				this.state = 3437;
				this.match(n1qlParser.FOR);
				this.state = 3438;
				this.coll_bindings(0);
				this.state = 3439;
				this.opt_when();
				this.state = 3440;
				this.match(n1qlParser.END);
				}
				break;
			case 151:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3442;
				this.match(n1qlParser.OBJECT);
				this.state = 3443;
				this.expr(0);
				this.state = 3444;
				this.match(n1qlParser.COLON);
				this.state = 3445;
				this.expr(0);
				this.state = 3446;
				this.match(n1qlParser.FOR);
				this.state = 3447;
				this.coll_bindings(0);
				this.state = 3448;
				this.opt_when();
				this.state = 3449;
				this.match(n1qlParser.END);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public paren_expr(): Paren_exprContext {
		let localctx: Paren_exprContext = new Paren_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 522, n1qlParser.RULE_paren_expr);
		try {
			this.state = 3462;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 187, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3453;
				this.match(n1qlParser.LPAREN);
				this.state = 3454;
				this.expr(0);
				this.state = 3455;
				this.match(n1qlParser.RPAREN);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3457;
				this.match(n1qlParser.LPAREN);
				this.state = 3458;
				this.all_expr();
				this.state = 3459;
				this.match(n1qlParser.RPAREN);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3461;
				this.subquery_expr();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public subquery_expr(): Subquery_exprContext {
		let localctx: Subquery_exprContext = new Subquery_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 524, n1qlParser.RULE_subquery_expr);
		try {
			this.state = 3473;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 259:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3464;
				this.match(n1qlParser.T__CORRELATED);
				this.state = 3465;
				this.match(n1qlParser.LPAREN);
				this.state = 3466;
				this.fullselect();
				this.state = 3467;
				this.match(n1qlParser.RPAREN);
				}
				break;
			case 21:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3469;
				this.match(n1qlParser.LPAREN);
				this.state = 3470;
				this.fullselect();
				this.state = 3471;
				this.match(n1qlParser.RPAREN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public expr_input(): Expr_inputContext {
		let localctx: Expr_inputContext = new Expr_inputContext(this, this._ctx, this.state);
		this.enterRule(localctx, 526, n1qlParser.RULE_expr_input);
		try {
			this.state = 3477;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 2:
			case 3:
			case 9:
			case 21:
			case 23:
			case 27:
			case 32:
			case 38:
			case 39:
			case 52:
			case 64:
			case 81:
			case 85:
			case 87:
			case 90:
			case 141:
			case 146:
			case 147:
			case 148:
			case 151:
			case 180:
			case 195:
			case 198:
			case 202:
			case 209:
			case 221:
			case 237:
			case 238:
			case 239:
			case 240:
			case 241:
			case 242:
			case 243:
			case 244:
			case 245:
			case 255:
			case 256:
			case 257:
			case 258:
			case 259:
			case 264:
			case 265:
			case 266:
			case 267:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3475;
				this.expr(0);
				}
				break;
			case 34:
			case 74:
			case 77:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3476;
				this.all_expr();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_window_clause(): Opt_window_clauseContext {
		let localctx: Opt_window_clauseContext = new Opt_window_clauseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 528, n1qlParser.RULE_opt_window_clause);
		try {
			this.state = 3482;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 190, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3480;
				this.match(n1qlParser.WINDOW);
				this.state = 3481;
				this.window_list(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public window_list(): Window_listContext;
	public window_list(_p: number): Window_listContext;
	// @RuleVersion(0)
	public window_list(_p?: number): Window_listContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Window_listContext = new Window_listContext(this, this._ctx, _parentState);
		let _prevctx: Window_listContext = localctx;
		let _startState: number = 530;
		this.enterRecursionRule(localctx, 530, n1qlParser.RULE_window_list, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 3485;
			this.window_term();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 3492;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 191, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Window_listContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_window_list);
					this.state = 3487;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 3488;
					this.match(n1qlParser.COMMA);
					this.state = 3489;
					this.window_term();
					}
					}
				}
				this.state = 3494;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 191, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public window_term(): Window_termContext {
		let localctx: Window_termContext = new Window_termContext(this, this._ctx, this.state);
		this.enterRule(localctx, 532, n1qlParser.RULE_window_term);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3495;
			this.permitted_identifiers();
			this.state = 3496;
			this.match(n1qlParser.AS);
			this.state = 3497;
			this.window_specification();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public window_specification(): Window_specificationContext {
		let localctx: Window_specificationContext = new Window_specificationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 534, n1qlParser.RULE_window_specification);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3499;
			this.match(n1qlParser.LPAREN);
			this.state = 3500;
			this.opt_window_name();
			this.state = 3501;
			this.opt_window_partition();
			this.state = 3502;
			this.opt_order_by();
			this.state = 3503;
			this.opt_window_frame();
			this.state = 3504;
			this.match(n1qlParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_window_name(): Opt_window_nameContext {
		let localctx: Opt_window_nameContext = new Opt_window_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 536, n1qlParser.RULE_opt_window_name);
		try {
			this.state = 3508;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 22:
			case 102:
			case 157:
			case 162:
			case 174:
			case 189:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 221:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3507;
				this.permitted_identifiers();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_window_partition(): Opt_window_partitionContext {
		let localctx: Opt_window_partitionContext = new Opt_window_partitionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 538, n1qlParser.RULE_opt_window_partition);
		try {
			this.state = 3514;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 22:
			case 102:
			case 157:
			case 174:
			case 189:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 162:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3511;
				this.match(n1qlParser.PARTITION);
				this.state = 3512;
				this.match(n1qlParser.BY);
				this.state = 3513;
				this.exprs(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_window_frame(): Opt_window_frameContext {
		let localctx: Opt_window_frameContext = new Opt_window_frameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 540, n1qlParser.RULE_opt_window_frame);
		try {
			this.state = 3521;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 22:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 102:
			case 174:
			case 189:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3517;
				this.window_frame_modifier();
				this.state = 3518;
				this.window_frame_extents();
				this.state = 3519;
				this.opt_window_frame_exclusion();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public window_frame_modifier(): Window_frame_modifierContext {
		let localctx: Window_frame_modifierContext = new Window_frame_modifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 542, n1qlParser.RULE_window_frame_modifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3523;
			_la = this._input.LA(1);
			if(!(_la===102 || _la===174 || _la===189)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_window_frame_exclusion(): Opt_window_frame_exclusionContext {
		let localctx: Opt_window_frame_exclusionContext = new Opt_window_frame_exclusionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 544, n1qlParser.RULE_opt_window_frame_exclusion);
		try {
			this.state = 3536;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 195, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3526;
				this.match(n1qlParser.EXCLUDE);
				this.state = 3527;
				this.match(n1qlParser.NO);
				this.state = 3528;
				this.match(n1qlParser.OTHERS);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3529;
				this.match(n1qlParser.EXCLUDE);
				this.state = 3530;
				this.match(n1qlParser.CURRENT);
				this.state = 3531;
				this.match(n1qlParser.ROW);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 3532;
				this.match(n1qlParser.EXCLUDE);
				this.state = 3533;
				this.match(n1qlParser.TIES);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 3534;
				this.match(n1qlParser.EXCLUDE);
				this.state = 3535;
				this.match(n1qlParser.GROUP);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public window_frame_extents(): Window_frame_extentsContext {
		let localctx: Window_frame_extentsContext = new Window_frame_extentsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 546, n1qlParser.RULE_window_frame_extents);
		try {
			this.state = 3544;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 2:
			case 3:
			case 9:
			case 21:
			case 23:
			case 27:
			case 32:
			case 38:
			case 39:
			case 52:
			case 64:
			case 81:
			case 85:
			case 87:
			case 90:
			case 141:
			case 146:
			case 147:
			case 148:
			case 151:
			case 180:
			case 195:
			case 198:
			case 202:
			case 209:
			case 211:
			case 221:
			case 237:
			case 238:
			case 239:
			case 240:
			case 241:
			case 242:
			case 243:
			case 244:
			case 245:
			case 255:
			case 256:
			case 257:
			case 258:
			case 259:
			case 264:
			case 265:
			case 266:
			case 267:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3538;
				this.window_frame_extent();
				}
				break;
			case 44:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3539;
				this.match(n1qlParser.BETWEEN);
				this.state = 3540;
				this.window_frame_extent();
				this.state = 3541;
				this.match(n1qlParser.AND);
				this.state = 3542;
				this.window_frame_extent();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public window_frame_extent(): Window_frame_extentContext {
		let localctx: Window_frame_extentContext = new Window_frame_extentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 548, n1qlParser.RULE_window_frame_extent);
		try {
			this.state = 3555;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 197, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3546;
				this.match(n1qlParser.UNBOUNDED);
				this.state = 3547;
				this.match(n1qlParser.PRECEDING);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3548;
				this.match(n1qlParser.UNBOUNDED);
				this.state = 3549;
				this.match(n1qlParser.FOLLOWING);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3550;
				this.match(n1qlParser.CURRENT);
				this.state = 3551;
				this.match(n1qlParser.ROW);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 3552;
				this.expr(0);
				this.state = 3553;
				this.window_frame_valexpr_modifier();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public window_frame_valexpr_modifier(): Window_frame_valexpr_modifierContext {
		let localctx: Window_frame_valexpr_modifierContext = new Window_frame_valexpr_modifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 550, n1qlParser.RULE_window_frame_valexpr_modifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3557;
			_la = this._input.LA(1);
			if(!(_la===93 || _la===166)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_nulls_treatment(): Opt_nulls_treatmentContext {
		let localctx: Opt_nulls_treatmentContext = new Opt_nulls_treatmentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 552, n1qlParser.RULE_opt_nulls_treatment);
		try {
			this.state = 3561;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 198, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3560;
				this.nulls_treatment();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public nulls_treatment(): Nulls_treatmentContext {
		let localctx: Nulls_treatmentContext = new Nulls_treatmentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 554, n1qlParser.RULE_nulls_treatment);
		try {
			this.state = 3567;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 181:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3563;
				this.match(n1qlParser.RESPECT);
				this.state = 3564;
				this.match(n1qlParser.NULLS);
				}
				break;
			case 107:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3565;
				this.match(n1qlParser.IGNORE);
				this.state = 3566;
				this.match(n1qlParser.NULLS);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_from_first_last(): Opt_from_first_lastContext {
		let localctx: Opt_from_first_lastContext = new Opt_from_first_lastContext(this, this._ctx, this.state);
		this.enterRule(localctx, 556, n1qlParser.RULE_opt_from_first_last);
		try {
			this.state = 3572;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 107:
			case 160:
			case 181:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 96:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3570;
				this.match(n1qlParser.FROM);
				this.state = 3571;
				this.first_last();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public agg_quantifier(): Agg_quantifierContext {
		let localctx: Agg_quantifierContext = new Agg_quantifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 558, n1qlParser.RULE_agg_quantifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3574;
			_la = this._input.LA(1);
			if(!(_la===34 || _la===74)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_filter(): Opt_filterContext {
		let localctx: Opt_filterContext = new Opt_filterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 560, n1qlParser.RULE_opt_filter);
		try {
			this.state = 3582;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 201, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3577;
				this.match(n1qlParser.FILTER);
				this.state = 3578;
				this.match(n1qlParser.LPAREN);
				this.state = 3579;
				this.where();
				this.state = 3580;
				this.match(n1qlParser.RPAREN);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_window_function(): Opt_window_functionContext {
		let localctx: Opt_window_functionContext = new Opt_window_functionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 562, n1qlParser.RULE_opt_window_function);
		try {
			this.state = 3586;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 202, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3585;
				this.window_function_details();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public window_function_details(): Window_function_detailsContext {
		let localctx: Window_function_detailsContext = new Window_function_detailsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 564, n1qlParser.RULE_window_function_details);
		try {
			this.state = 3592;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 203, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3588;
				this.match(n1qlParser.OVER);
				this.state = 3589;
				this.permitted_identifiers();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3590;
				this.match(n1qlParser.OVER);
				this.state = 3591;
				this.window_specification();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public start_transaction(): Start_transactionContext {
		let localctx: Start_transactionContext = new Start_transactionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 566, n1qlParser.RULE_start_transaction);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3594;
			this.start_or_begin();
			this.state = 3595;
			this.transaction();
			this.state = 3596;
			this.opt_isolation_level();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public commit_transaction(): Commit_transactionContext {
		let localctx: Commit_transactionContext = new Commit_transactionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 568, n1qlParser.RULE_commit_transaction);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3598;
			this.match(n1qlParser.COMMIT);
			this.state = 3599;
			this.opt_transaction();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public rollback_transaction(): Rollback_transactionContext {
		let localctx: Rollback_transactionContext = new Rollback_transactionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 570, n1qlParser.RULE_rollback_transaction);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3601;
			this.match(n1qlParser.ROLLBACK);
			this.state = 3602;
			this.opt_transaction();
			this.state = 3603;
			this.opt_savepoint();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public start_or_begin(): Start_or_beginContext {
		let localctx: Start_or_beginContext = new Start_or_beginContext(this, this._ctx, this.state);
		this.enterRule(localctx, 572, n1qlParser.RULE_start_or_begin);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3605;
			_la = this._input.LA(1);
			if(!(_la===43 || _la===199)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_transaction(): Opt_transactionContext {
		let localctx: Opt_transactionContext = new Opt_transactionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 574, n1qlParser.RULE_opt_transaction);
		try {
			this.state = 3609;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 204, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3608;
				this.transaction();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public transaction(): TransactionContext {
		let localctx: TransactionContext = new TransactionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 576, n1qlParser.RULE_transaction);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3611;
			_la = this._input.LA(1);
			if(!(((((_la - 206)) & ~0x1F) === 0 && ((1 << (_la - 206)) & 536870915) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_savepoint(): Opt_savepointContext {
		let localctx: Opt_savepointContext = new Opt_savepointContext(this, this._ctx, this.state);
		this.enterRule(localctx, 578, n1qlParser.RULE_opt_savepoint);
		try {
			this.state = 3617;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 205, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3614;
				this.match(n1qlParser.TO);
				this.state = 3615;
				this.match(n1qlParser.SAVEPOINT);
				this.state = 3616;
				this.savepoint_name();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public savepoint_name(): Savepoint_nameContext {
		let localctx: Savepoint_nameContext = new Savepoint_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 580, n1qlParser.RULE_savepoint_name);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3619;
			this.permitted_identifiers();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_isolation_level(): Opt_isolation_levelContext {
		let localctx: Opt_isolation_levelContext = new Opt_isolation_levelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 582, n1qlParser.RULE_opt_isolation_level);
		try {
			this.state = 3623;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 206, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3622;
				this.isolation_level();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public isolation_level(): Isolation_levelContext {
		let localctx: Isolation_levelContext = new Isolation_levelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 584, n1qlParser.RULE_isolation_level);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3625;
			this.match(n1qlParser.ISOLATION);
			this.state = 3626;
			this.match(n1qlParser.LEVEL);
			this.state = 3627;
			this.isolation_val();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public isolation_val(): Isolation_valContext {
		let localctx: Isolation_valContext = new Isolation_valContext(this, this._ctx, this.state);
		this.enterRule(localctx, 586, n1qlParser.RULE_isolation_val);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3629;
			this.match(n1qlParser.READ);
			this.state = 3630;
			this.match(n1qlParser.COMMITTED);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public set_transaction_isolation(): Set_transaction_isolationContext {
		let localctx: Set_transaction_isolationContext = new Set_transaction_isolationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 588, n1qlParser.RULE_set_transaction_isolation);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3632;
			this.match(n1qlParser.SET);
			this.state = 3633;
			this.match(n1qlParser.TRANSACTION);
			this.state = 3634;
			this.isolation_level();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public savepoint(): SavepointContext {
		let localctx: SavepointContext = new SavepointContext(this, this._ctx, this.state);
		this.enterRule(localctx, 590, n1qlParser.RULE_savepoint);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3636;
			this.match(n1qlParser.SAVEPOINT);
			this.state = 3637;
			this.savepoint_name();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_with_clause(): Opt_with_clauseContext {
		let localctx: Opt_with_clauseContext = new Opt_with_clauseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 592, n1qlParser.RULE_opt_with_clause);
		try {
			this.state = 3641;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 207, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3640;
				this.with_clause();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public with_clause(): With_clauseContext {
		let localctx: With_clauseContext = new With_clauseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 594, n1qlParser.RULE_with_clause);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3643;
			this.match(n1qlParser.WITH);
			this.state = 3644;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public opt_namespace_name(): Opt_namespace_nameContext {
		let localctx: Opt_namespace_nameContext = new Opt_namespace_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 596, n1qlParser.RULE_opt_namespace_name);
		try {
			this.state = 3648;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 221:
			case 237:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case 32:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3647;
				this.namespace_name();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sequence_object_name(): Sequence_object_nameContext {
		let localctx: Sequence_object_nameContext = new Sequence_object_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 598, n1qlParser.RULE_sequence_object_name);
		try {
			this.state = 3652;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 221:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3650;
				this.permitted_identifiers();
				}
				break;
			case 237:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3651;
				this.p__invalid_case_insensitive_identifier();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sequence_full_name(): Sequence_full_nameContext {
		let localctx: Sequence_full_nameContext = new Sequence_full_nameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 600, n1qlParser.RULE_sequence_full_name);
		try {
			this.state = 3669;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 210, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3654;
				this.opt_namespace_name();
				this.state = 3655;
				this.sequence_object_name();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3657;
				this.opt_namespace_name();
				this.state = 3658;
				this.path_part();
				this.state = 3659;
				this.match(n1qlParser.DOT);
				this.state = 3660;
				this.path_part();
				this.state = 3661;
				this.match(n1qlParser.DOT);
				this.state = 3662;
				this.sequence_object_name();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3664;
				this.opt_namespace_name();
				this.state = 3665;
				this.path_part();
				this.state = 3666;
				this.match(n1qlParser.DOT);
				this.state = 3667;
				this.sequence_object_name();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sequence_stmt(): Sequence_stmtContext {
		let localctx: Sequence_stmtContext = new Sequence_stmtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 602, n1qlParser.RULE_sequence_stmt);
		try {
			this.state = 3674;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 63:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3671;
				this.create_sequence();
				}
				break;
			case 76:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3672;
				this.drop_sequence();
				}
				break;
			case 35:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3673;
				this.alter_sequence();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public create_sequence(): Create_sequenceContext {
		let localctx: Create_sequenceContext = new Create_sequenceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 604, n1qlParser.RULE_create_sequence);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3676;
			this.match(n1qlParser.CREATE);
			this.state = 3677;
			this.match(n1qlParser.SEQUENCE);
			this.state = 3678;
			this.sequence_name_options(0);
			this.state = 3679;
			this.opt_seq_create_options(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public sequence_name_options(): Sequence_name_optionsContext;
	public sequence_name_options(_p: number): Sequence_name_optionsContext;
	// @RuleVersion(0)
	public sequence_name_options(_p?: number): Sequence_name_optionsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Sequence_name_optionsContext = new Sequence_name_optionsContext(this, this._ctx, _parentState);
		let _prevctx: Sequence_name_optionsContext = localctx;
		let _startState: number = 606;
		this.enterRecursionRule(localctx, 606, n1qlParser.RULE_sequence_name_options, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 3682;
			this.sequence_name_option();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 3688;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 212, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Sequence_name_optionsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_sequence_name_options);
					this.state = 3684;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 3685;
					this.sequence_name_option();
					}
					}
				}
				this.state = 3690;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 212, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sequence_name_option(): Sequence_name_optionContext {
		let localctx: Sequence_name_optionContext = new Sequence_name_optionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 608, n1qlParser.RULE_sequence_name_option);
		try {
			this.state = 3695;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 106:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3691;
				this.match(n1qlParser.IF);
				this.state = 3692;
				this.match(n1qlParser.NOT);
				this.state = 3693;
				this.match(n1qlParser.EXISTS);
				}
				break;
			case 32:
			case 221:
			case 237:
			case 238:
			case 242:
			case 243:
			case 244:
			case 245:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3694;
				this.sequence_full_name();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public opt_seq_create_options(): Opt_seq_create_optionsContext;
	public opt_seq_create_options(_p: number): Opt_seq_create_optionsContext;
	// @RuleVersion(0)
	public opt_seq_create_options(_p?: number): Opt_seq_create_optionsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Opt_seq_create_optionsContext = new Opt_seq_create_optionsContext(this, this._ctx, _parentState);
		let _prevctx: Opt_seq_create_optionsContext = localctx;
		let _startState: number = 610;
		this.enterRecursionRule(localctx, 610, n1qlParser.RULE_opt_seq_create_options, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 3702;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 214, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Opt_seq_create_optionsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_opt_seq_create_options);
					this.state = 3698;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 3699;
					this.seq_create_option();
					}
					}
				}
				this.state = 3704;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 214, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public seq_create_option(): Seq_create_optionContext {
		let localctx: Seq_create_optionContext = new Seq_create_optionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 612, n1qlParser.RULE_seq_create_option);
		try {
			this.state = 3712;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 215, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3705;
				this.sequence_with();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3706;
				this.start_with();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3707;
				this.increment_by();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 3708;
				this.maxvalue();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 3709;
				this.minvalue();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 3710;
				this.cycle();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 3711;
				this.cache();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public drop_sequence(): Drop_sequenceContext {
		let localctx: Drop_sequenceContext = new Drop_sequenceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 614, n1qlParser.RULE_drop_sequence);
		try {
			this.state = 3724;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 216, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3714;
				this.match(n1qlParser.DROP);
				this.state = 3715;
				this.match(n1qlParser.SEQUENCE);
				this.state = 3716;
				this.sequence_full_name();
				this.state = 3717;
				this.opt_if_exists();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3719;
				this.match(n1qlParser.DROP);
				this.state = 3720;
				this.match(n1qlParser.SEQUENCE);
				this.state = 3721;
				this.match(n1qlParser.IF);
				this.state = 3722;
				this.match(n1qlParser.EXISTS);
				this.state = 3723;
				this.sequence_full_name();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public alter_sequence(): Alter_sequenceContext {
		let localctx: Alter_sequenceContext = new Alter_sequenceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 616, n1qlParser.RULE_alter_sequence);
		try {
			this.state = 3736;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 217, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3726;
				this.match(n1qlParser.ALTER);
				this.state = 3727;
				this.match(n1qlParser.SEQUENCE);
				this.state = 3728;
				this.sequence_full_name();
				this.state = 3729;
				this.with_clause();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3731;
				this.match(n1qlParser.ALTER);
				this.state = 3732;
				this.match(n1qlParser.SEQUENCE);
				this.state = 3733;
				this.sequence_full_name();
				this.state = 3734;
				this.seq_alter_options(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public seq_alter_options(): Seq_alter_optionsContext;
	public seq_alter_options(_p: number): Seq_alter_optionsContext;
	// @RuleVersion(0)
	public seq_alter_options(_p?: number): Seq_alter_optionsContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: Seq_alter_optionsContext = new Seq_alter_optionsContext(this, this._ctx, _parentState);
		let _prevctx: Seq_alter_optionsContext = localctx;
		let _startState: number = 618;
		this.enterRecursionRule(localctx, 618, n1qlParser.RULE_seq_alter_options, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			{
			this.state = 3739;
			this.seq_alter_option();
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 3745;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 218, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					{
					localctx = new Seq_alter_optionsContext(this, _parentctx, _parentState);
					this.pushNewRecursionContext(localctx, _startState, n1qlParser.RULE_seq_alter_options);
					this.state = 3741;
					if (!(this.precpred(this._ctx, 1))) {
						throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
					}
					this.state = 3742;
					this.seq_alter_option();
					}
					}
				}
				this.state = 3747;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 218, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public seq_alter_option(): Seq_alter_optionContext {
		let localctx: Seq_alter_optionContext = new Seq_alter_optionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 620, n1qlParser.RULE_seq_alter_option);
		try {
			this.state = 3754;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 219, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3748;
				this.restart_with();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3749;
				this.increment_by();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3750;
				this.maxvalue();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 3751;
				this.minvalue();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 3752;
				this.cycle();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 3753;
				this.cache();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sequence_with(): Sequence_withContext {
		let localctx: Sequence_withContext = new Sequence_withContext(this, this._ctx, this.state);
		this.enterRule(localctx, 622, n1qlParser.RULE_sequence_with);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3756;
			this.match(n1qlParser.WITH);
			this.state = 3757;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public start_with(): Start_withContext {
		let localctx: Start_withContext = new Start_withContext(this, this._ctx, this.state);
		this.enterRule(localctx, 624, n1qlParser.RULE_start_with);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3759;
			this.match(n1qlParser.START);
			this.state = 3760;
			this.match(n1qlParser.WITH);
			this.state = 3761;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public restart_with(): Restart_withContext {
		let localctx: Restart_withContext = new Restart_withContext(this, this._ctx, this.state);
		this.enterRule(localctx, 626, n1qlParser.RULE_restart_with);
		try {
			this.state = 3767;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 220, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3763;
				this.match(n1qlParser.RESTART);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3764;
				this.match(n1qlParser.RESTART);
				this.state = 3765;
				this.match(n1qlParser.WITH);
				this.state = 3766;
				this.expr(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public increment_by(): Increment_byContext {
		let localctx: Increment_byContext = new Increment_byContext(this, this._ctx, this.state);
		this.enterRule(localctx, 628, n1qlParser.RULE_increment_by);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 3769;
			this.match(n1qlParser.INCREMENT);
			this.state = 3770;
			this.match(n1qlParser.BY);
			this.state = 3771;
			this.expr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public maxvalue(): MaxvalueContext {
		let localctx: MaxvalueContext = new MaxvalueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 630, n1qlParser.RULE_maxvalue);
		try {
			this.state = 3777;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 145:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3773;
				this.match(n1qlParser.NO);
				this.state = 3774;
				this.match(n1qlParser.MAXVALUE);
				}
				break;
			case 261:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3775;
				this.match(n1qlParser.MAXVALUE);
				this.state = 3776;
				this.expr(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public minvalue(): MinvalueContext {
		let localctx: MinvalueContext = new MinvalueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 632, n1qlParser.RULE_minvalue);
		try {
			this.state = 3783;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 145:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3779;
				this.match(n1qlParser.NO);
				this.state = 3780;
				this.match(n1qlParser.MINVALUE);
				}
				break;
			case 262:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3781;
				this.match(n1qlParser.MINVALUE);
				this.state = 3782;
				this.expr(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public cycle(): CycleContext {
		let localctx: CycleContext = new CycleContext(this, this._ctx, this.state);
		this.enterRule(localctx, 634, n1qlParser.RULE_cycle);
		try {
			this.state = 3788;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 145:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3785;
				this.match(n1qlParser.NO);
				this.state = 3786;
				this.match(n1qlParser.CYCLE);
				}
				break;
			case 249:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3787;
				this.match(n1qlParser.CYCLE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public cache(): CacheContext {
		let localctx: CacheContext = new CacheContext(this, this._ctx, this.state);
		this.enterRule(localctx, 636, n1qlParser.RULE_cache);
		try {
			this.state = 3794;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 145:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3790;
				this.match(n1qlParser.NO);
				this.state = 3791;
				this.match(n1qlParser.CACHE);
				}
				break;
			case 263:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3792;
				this.match(n1qlParser.CACHE);
				this.state = 3793;
				this.expr(0);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sequence_next(): Sequence_nextContext {
		let localctx: Sequence_nextContext = new Sequence_nextContext(this, this._ctx, this.state);
		this.enterRule(localctx, 638, n1qlParser.RULE_sequence_next);
		try {
			this.state = 3814;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 225, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3796;
				this.match(n1qlParser.NEXTVAL);
				this.state = 3797;
				this.match(n1qlParser.FOR);
				this.state = 3798;
				this.match(n1qlParser.NAMESPACE_ID);
				this.state = 3799;
				this.match(n1qlParser.COLON);
				this.state = 3800;
				this.permitted_identifiers();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3801;
				this.match(n1qlParser.NEXT);
				this.state = 3802;
				this.match(n1qlParser.VALUE);
				this.state = 3803;
				this.match(n1qlParser.FOR);
				this.state = 3804;
				this.match(n1qlParser.NAMESPACE_ID);
				this.state = 3805;
				this.match(n1qlParser.COLON);
				this.state = 3806;
				this.permitted_identifiers();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3807;
				this.match(n1qlParser.NEXTVAL);
				this.state = 3808;
				this.match(n1qlParser.FOR);
				this.state = 3809;
				this.permitted_identifiers();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 3810;
				this.match(n1qlParser.NEXT);
				this.state = 3811;
				this.match(n1qlParser.VALUE);
				this.state = 3812;
				this.match(n1qlParser.FOR);
				this.state = 3813;
				this.permitted_identifiers();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sequence_prev(): Sequence_prevContext {
		let localctx: Sequence_prevContext = new Sequence_prevContext(this, this._ctx, this.state);
		this.enterRule(localctx, 640, n1qlParser.RULE_sequence_prev);
		try {
			this.state = 3834;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 226, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3816;
				this.match(n1qlParser.PREVVAL);
				this.state = 3817;
				this.match(n1qlParser.FOR);
				this.state = 3818;
				this.match(n1qlParser.NAMESPACE_ID);
				this.state = 3819;
				this.match(n1qlParser.COLON);
				this.state = 3820;
				this.permitted_identifiers();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3821;
				this.match(n1qlParser.PREV);
				this.state = 3822;
				this.match(n1qlParser.VALUE);
				this.state = 3823;
				this.match(n1qlParser.FOR);
				this.state = 3824;
				this.match(n1qlParser.NAMESPACE_ID);
				this.state = 3825;
				this.match(n1qlParser.COLON);
				this.state = 3826;
				this.permitted_identifiers();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 3827;
				this.match(n1qlParser.PREVVAL);
				this.state = 3828;
				this.match(n1qlParser.FOR);
				this.state = 3829;
				this.permitted_identifiers();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 3830;
				this.match(n1qlParser.PREV);
				this.state = 3831;
				this.match(n1qlParser.VALUE);
				this.state = 3832;
				this.match(n1qlParser.FOR);
				this.state = 3833;
				this.permitted_identifiers();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public sequence_expr(): Sequence_exprContext {
		let localctx: Sequence_exprContext = new Sequence_exprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 642, n1qlParser.RULE_sequence_expr);
		try {
			this.state = 3838;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 264:
			case 265:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 3836;
				this.sequence_next();
				}
				break;
			case 266:
			case 267:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 3837;
				this.sequence_prev();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public sempred(localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 2:
			return this.opt_trailer_sempred(localctx as Opt_trailerContext, predIndex);
		case 33:
			return this.select_terms_sempred(localctx as Select_termsContext, predIndex);
		case 41:
			return this.optim_hints_sempred(localctx as Optim_hintsContext, predIndex);
		case 44:
			return this.hint_args_sempred(localctx as Hint_argsContext, predIndex);
		case 49:
			return this.projects_sempred(localctx as ProjectsContext, predIndex);
		case 56:
			return this.from_terms_sempred(localctx as From_termsContext, predIndex);
		case 57:
			return this.from_term_sempred(localctx as From_termContext, predIndex);
		case 72:
			return this.index_refs_sempred(localctx as Index_refsContext, predIndex);
		case 82:
			return this.bindings_sempred(localctx as BindingsContext, predIndex);
		case 85:
			return this.with_list_sempred(localctx as With_listContext, predIndex);
		case 93:
			return this.group_terms_sempred(localctx as Group_termsContext, predIndex);
		case 102:
			return this.sort_terms_sempred(localctx as Sort_termsContext, predIndex);
		case 117:
			return this.values_list_sempred(localctx as Values_listContext, predIndex);
		case 133:
			return this.set_terms_sempred(localctx as Set_termsContext, predIndex);
		case 138:
			return this.update_dimensions_sempred(localctx as Update_dimensionsContext, predIndex);
		case 139:
			return this.update_dimension_sempred(localctx as Update_dimensionContext, predIndex);
		case 144:
			return this.unset_terms_sempred(localctx as Unset_termsContext, predIndex);
		case 158:
			return this.user_opts_sempred(localctx as User_optsContext, predIndex);
		case 161:
			return this.groups_sempred(localctx as GroupsContext, predIndex);
		case 166:
			return this.group_opts_sempred(localctx as Group_optsContext, predIndex);
		case 168:
			return this.group_role_list_sempred(localctx as Group_role_listContext, predIndex);
		case 173:
			return this.role_list_sempred(localctx as Role_listContext, predIndex);
		case 175:
			return this.keyspace_scope_list_sempred(localctx as Keyspace_scope_listContext, predIndex);
		case 177:
			return this.user_list_sempred(localctx as User_listContext, predIndex);
		case 201:
			return this.index_terms_sempred(localctx as Index_termsContext, predIndex);
		case 207:
			return this.flatten_keys_exprs_sempred(localctx as Flatten_keys_exprsContext, predIndex);
		case 222:
			return this.parameter_terms_sempred(localctx as Parameter_termsContext, predIndex);
		case 228:
			return this.update_stat_terms_sempred(localctx as Update_stat_termsContext, predIndex);
		case 230:
			return this.path_sempred(localctx as PathContext, predIndex);
		case 233:
			return this.expr_sempred(localctx as ExprContext, predIndex);
		case 236:
			return this.b_expr_sempred(localctx as B_exprContext, predIndex);
		case 241:
			return this.members_sempred(localctx as MembersContext, predIndex);
		case 245:
			return this.exprs_sempred(localctx as ExprsContext, predIndex);
		case 250:
			return this.when_thens_sempred(localctx as When_thensContext, predIndex);
		case 257:
			return this.coll_bindings_sempred(localctx as Coll_bindingsContext, predIndex);
		case 265:
			return this.window_list_sempred(localctx as Window_listContext, predIndex);
		case 303:
			return this.sequence_name_options_sempred(localctx as Sequence_name_optionsContext, predIndex);
		case 305:
			return this.opt_seq_create_options_sempred(localctx as Opt_seq_create_optionsContext, predIndex);
		case 309:
			return this.seq_alter_options_sempred(localctx as Seq_alter_optionsContext, predIndex);
		}
		return true;
	}
	private opt_trailer_sempred(localctx: Opt_trailerContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private select_terms_sempred(localctx: Select_termsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 1:
			return this.precpred(this._ctx, 2);
		}
		return true;
	}
	private optim_hints_sempred(localctx: Optim_hintsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 2:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private hint_args_sempred(localctx: Hint_argsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 3:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private projects_sempred(localctx: ProjectsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 4:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private from_terms_sempred(localctx: From_termsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 5:
			return this.precpred(this._ctx, 2);
		case 6:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private from_term_sempred(localctx: From_termContext, predIndex: number): boolean {
		switch (predIndex) {
		case 7:
			return this.precpred(this._ctx, 15);
		case 8:
			return this.precpred(this._ctx, 14);
		case 9:
			return this.precpred(this._ctx, 13);
		case 10:
			return this.precpred(this._ctx, 12);
		case 11:
			return this.precpred(this._ctx, 11);
		case 12:
			return this.precpred(this._ctx, 10);
		case 13:
			return this.precpred(this._ctx, 9);
		case 14:
			return this.precpred(this._ctx, 8);
		case 15:
			return this.precpred(this._ctx, 7);
		case 16:
			return this.precpred(this._ctx, 6);
		case 17:
			return this.precpred(this._ctx, 5);
		case 18:
			return this.precpred(this._ctx, 4);
		case 19:
			return this.precpred(this._ctx, 3);
		}
		return true;
	}
	private index_refs_sempred(localctx: Index_refsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 20:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private bindings_sempred(localctx: BindingsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 21:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private with_list_sempred(localctx: With_listContext, predIndex: number): boolean {
		switch (predIndex) {
		case 22:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private group_terms_sempred(localctx: Group_termsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 23:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private sort_terms_sempred(localctx: Sort_termsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 24:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private values_list_sempred(localctx: Values_listContext, predIndex: number): boolean {
		switch (predIndex) {
		case 25:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private set_terms_sempred(localctx: Set_termsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 26:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private update_dimensions_sempred(localctx: Update_dimensionsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 27:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private update_dimension_sempred(localctx: Update_dimensionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 28:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private unset_terms_sempred(localctx: Unset_termsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 29:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private user_opts_sempred(localctx: User_optsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 30:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private groups_sempred(localctx: GroupsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 31:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private group_opts_sempred(localctx: Group_optsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 32:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private group_role_list_sempred(localctx: Group_role_listContext, predIndex: number): boolean {
		switch (predIndex) {
		case 33:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private role_list_sempred(localctx: Role_listContext, predIndex: number): boolean {
		switch (predIndex) {
		case 34:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private keyspace_scope_list_sempred(localctx: Keyspace_scope_listContext, predIndex: number): boolean {
		switch (predIndex) {
		case 35:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private user_list_sempred(localctx: User_listContext, predIndex: number): boolean {
		switch (predIndex) {
		case 36:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private index_terms_sempred(localctx: Index_termsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 37:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private flatten_keys_exprs_sempred(localctx: Flatten_keys_exprsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 38:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private parameter_terms_sempred(localctx: Parameter_termsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 39:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private update_stat_terms_sempred(localctx: Update_stat_termsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 40:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private path_sempred(localctx: PathContext, predIndex: number): boolean {
		switch (predIndex) {
		case 41:
			return this.precpred(this._ctx, 5);
		case 42:
			return this.precpred(this._ctx, 4);
		case 43:
			return this.precpred(this._ctx, 3);
		case 44:
			return this.precpred(this._ctx, 2);
		case 45:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private expr_sempred(localctx: ExprContext, predIndex: number): boolean {
		switch (predIndex) {
		case 46:
			return this.precpred(this._ctx, 38);
		case 47:
			return this.precpred(this._ctx, 37);
		case 48:
			return this.precpred(this._ctx, 36);
		case 49:
			return this.precpred(this._ctx, 35);
		case 50:
			return this.precpred(this._ctx, 34);
		case 51:
			return this.precpred(this._ctx, 33);
		case 52:
			return this.precpred(this._ctx, 32);
		case 53:
			return this.precpred(this._ctx, 31);
		case 54:
			return this.precpred(this._ctx, 30);
		case 55:
			return this.precpred(this._ctx, 28);
		case 56:
			return this.precpred(this._ctx, 27);
		case 57:
			return this.precpred(this._ctx, 26);
		case 58:
			return this.precpred(this._ctx, 25);
		case 59:
			return this.precpred(this._ctx, 24);
		case 60:
			return this.precpred(this._ctx, 23);
		case 61:
			return this.precpred(this._ctx, 22);
		case 62:
			return this.precpred(this._ctx, 19);
		case 63:
			return this.precpred(this._ctx, 18);
		case 64:
			return this.precpred(this._ctx, 17);
		case 65:
			return this.precpred(this._ctx, 16);
		case 66:
			return this.precpred(this._ctx, 15);
		case 67:
			return this.precpred(this._ctx, 14);
		case 68:
			return this.precpred(this._ctx, 13);
		case 69:
			return this.precpred(this._ctx, 12);
		case 70:
			return this.precpred(this._ctx, 3);
		case 71:
			return this.precpred(this._ctx, 2);
		case 72:
			return this.precpred(this._ctx, 51);
		case 73:
			return this.precpred(this._ctx, 50);
		case 74:
			return this.precpred(this._ctx, 49);
		case 75:
			return this.precpred(this._ctx, 48);
		case 76:
			return this.precpred(this._ctx, 47);
		case 77:
			return this.precpred(this._ctx, 46);
		case 78:
			return this.precpred(this._ctx, 45);
		case 79:
			return this.precpred(this._ctx, 44);
		case 80:
			return this.precpred(this._ctx, 43);
		case 81:
			return this.precpred(this._ctx, 42);
		case 82:
			return this.precpred(this._ctx, 41);
		case 83:
			return this.precpred(this._ctx, 40);
		case 84:
			return this.precpred(this._ctx, 39);
		case 85:
			return this.precpred(this._ctx, 21);
		case 86:
			return this.precpred(this._ctx, 20);
		case 87:
			return this.precpred(this._ctx, 11);
		case 88:
			return this.precpred(this._ctx, 10);
		case 89:
			return this.precpred(this._ctx, 9);
		case 90:
			return this.precpred(this._ctx, 8);
		case 91:
			return this.precpred(this._ctx, 7);
		case 92:
			return this.precpred(this._ctx, 6);
		case 93:
			return this.precpred(this._ctx, 5);
		case 94:
			return this.precpred(this._ctx, 4);
		}
		return true;
	}
	private b_expr_sempred(localctx: B_exprContext, predIndex: number): boolean {
		switch (predIndex) {
		case 95:
			return this.precpred(this._ctx, 7);
		case 96:
			return this.precpred(this._ctx, 6);
		case 97:
			return this.precpred(this._ctx, 5);
		case 98:
			return this.precpred(this._ctx, 4);
		case 99:
			return this.precpred(this._ctx, 3);
		case 100:
			return this.precpred(this._ctx, 2);
		case 101:
			return this.precpred(this._ctx, 1);
		case 102:
			return this.precpred(this._ctx, 18);
		case 103:
			return this.precpred(this._ctx, 17);
		case 104:
			return this.precpred(this._ctx, 16);
		case 105:
			return this.precpred(this._ctx, 15);
		case 106:
			return this.precpred(this._ctx, 14);
		case 107:
			return this.precpred(this._ctx, 13);
		case 108:
			return this.precpred(this._ctx, 12);
		case 109:
			return this.precpred(this._ctx, 11);
		case 110:
			return this.precpred(this._ctx, 10);
		case 111:
			return this.precpred(this._ctx, 9);
		case 112:
			return this.precpred(this._ctx, 8);
		}
		return true;
	}
	private members_sempred(localctx: MembersContext, predIndex: number): boolean {
		switch (predIndex) {
		case 113:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private exprs_sempred(localctx: ExprsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 114:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private when_thens_sempred(localctx: When_thensContext, predIndex: number): boolean {
		switch (predIndex) {
		case 115:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private coll_bindings_sempred(localctx: Coll_bindingsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 116:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private window_list_sempred(localctx: Window_listContext, predIndex: number): boolean {
		switch (predIndex) {
		case 117:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private sequence_name_options_sempred(localctx: Sequence_name_optionsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 118:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private opt_seq_create_options_sempred(localctx: Opt_seq_create_optionsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 119:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}
	private seq_alter_options_sempred(localctx: Seq_alter_optionsContext, predIndex: number): boolean {
		switch (predIndex) {
		case 120:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}

	public static readonly _serializedATN: number[] = [4,1,267,3841,2,0,7,0,
	2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,
	2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,
	17,7,17,2,18,7,18,2,19,7,19,2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,
	7,24,2,25,7,25,2,26,7,26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,
	31,2,32,7,32,2,33,7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,
	2,39,7,39,2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,7,45,2,
	46,7,46,2,47,7,47,2,48,7,48,2,49,7,49,2,50,7,50,2,51,7,51,2,52,7,52,2,53,
	7,53,2,54,7,54,2,55,7,55,2,56,7,56,2,57,7,57,2,58,7,58,2,59,7,59,2,60,7,
	60,2,61,7,61,2,62,7,62,2,63,7,63,2,64,7,64,2,65,7,65,2,66,7,66,2,67,7,67,
	2,68,7,68,2,69,7,69,2,70,7,70,2,71,7,71,2,72,7,72,2,73,7,73,2,74,7,74,2,
	75,7,75,2,76,7,76,2,77,7,77,2,78,7,78,2,79,7,79,2,80,7,80,2,81,7,81,2,82,
	7,82,2,83,7,83,2,84,7,84,2,85,7,85,2,86,7,86,2,87,7,87,2,88,7,88,2,89,7,
	89,2,90,7,90,2,91,7,91,2,92,7,92,2,93,7,93,2,94,7,94,2,95,7,95,2,96,7,96,
	2,97,7,97,2,98,7,98,2,99,7,99,2,100,7,100,2,101,7,101,2,102,7,102,2,103,
	7,103,2,104,7,104,2,105,7,105,2,106,7,106,2,107,7,107,2,108,7,108,2,109,
	7,109,2,110,7,110,2,111,7,111,2,112,7,112,2,113,7,113,2,114,7,114,2,115,
	7,115,2,116,7,116,2,117,7,117,2,118,7,118,2,119,7,119,2,120,7,120,2,121,
	7,121,2,122,7,122,2,123,7,123,2,124,7,124,2,125,7,125,2,126,7,126,2,127,
	7,127,2,128,7,128,2,129,7,129,2,130,7,130,2,131,7,131,2,132,7,132,2,133,
	7,133,2,134,7,134,2,135,7,135,2,136,7,136,2,137,7,137,2,138,7,138,2,139,
	7,139,2,140,7,140,2,141,7,141,2,142,7,142,2,143,7,143,2,144,7,144,2,145,
	7,145,2,146,7,146,2,147,7,147,2,148,7,148,2,149,7,149,2,150,7,150,2,151,
	7,151,2,152,7,152,2,153,7,153,2,154,7,154,2,155,7,155,2,156,7,156,2,157,
	7,157,2,158,7,158,2,159,7,159,2,160,7,160,2,161,7,161,2,162,7,162,2,163,
	7,163,2,164,7,164,2,165,7,165,2,166,7,166,2,167,7,167,2,168,7,168,2,169,
	7,169,2,170,7,170,2,171,7,171,2,172,7,172,2,173,7,173,2,174,7,174,2,175,
	7,175,2,176,7,176,2,177,7,177,2,178,7,178,2,179,7,179,2,180,7,180,2,181,
	7,181,2,182,7,182,2,183,7,183,2,184,7,184,2,185,7,185,2,186,7,186,2,187,
	7,187,2,188,7,188,2,189,7,189,2,190,7,190,2,191,7,191,2,192,7,192,2,193,
	7,193,2,194,7,194,2,195,7,195,2,196,7,196,2,197,7,197,2,198,7,198,2,199,
	7,199,2,200,7,200,2,201,7,201,2,202,7,202,2,203,7,203,2,204,7,204,2,205,
	7,205,2,206,7,206,2,207,7,207,2,208,7,208,2,209,7,209,2,210,7,210,2,211,
	7,211,2,212,7,212,2,213,7,213,2,214,7,214,2,215,7,215,2,216,7,216,2,217,
	7,217,2,218,7,218,2,219,7,219,2,220,7,220,2,221,7,221,2,222,7,222,2,223,
	7,223,2,224,7,224,2,225,7,225,2,226,7,226,2,227,7,227,2,228,7,228,2,229,
	7,229,2,230,7,230,2,231,7,231,2,232,7,232,2,233,7,233,2,234,7,234,2,235,
	7,235,2,236,7,236,2,237,7,237,2,238,7,238,2,239,7,239,2,240,7,240,2,241,
	7,241,2,242,7,242,2,243,7,243,2,244,7,244,2,245,7,245,2,246,7,246,2,247,
	7,247,2,248,7,248,2,249,7,249,2,250,7,250,2,251,7,251,2,252,7,252,2,253,
	7,253,2,254,7,254,2,255,7,255,2,256,7,256,2,257,7,257,2,258,7,258,2,259,
	7,259,2,260,7,260,2,261,7,261,2,262,7,262,2,263,7,263,2,264,7,264,2,265,
	7,265,2,266,7,266,2,267,7,267,2,268,7,268,2,269,7,269,2,270,7,270,2,271,
	7,271,2,272,7,272,2,273,7,273,2,274,7,274,2,275,7,275,2,276,7,276,2,277,
	7,277,2,278,7,278,2,279,7,279,2,280,7,280,2,281,7,281,2,282,7,282,2,283,
	7,283,2,284,7,284,2,285,7,285,2,286,7,286,2,287,7,287,2,288,7,288,2,289,
	7,289,2,290,7,290,2,291,7,291,2,292,7,292,2,293,7,293,2,294,7,294,2,295,
	7,295,2,296,7,296,2,297,7,297,2,298,7,298,2,299,7,299,2,300,7,300,2,301,
	7,301,2,302,7,302,2,303,7,303,2,304,7,304,2,305,7,305,2,306,7,306,2,307,
	7,307,2,308,7,308,2,309,7,309,2,310,7,310,2,311,7,311,2,312,7,312,2,313,
	7,313,2,314,7,314,2,315,7,315,2,316,7,316,2,317,7,317,2,318,7,318,2,319,
	7,319,2,320,7,320,2,321,7,321,1,0,1,0,1,0,1,0,1,0,3,0,650,8,0,1,1,1,1,1,
	2,1,2,1,2,5,2,657,8,2,10,2,12,2,660,9,2,1,3,1,3,1,3,1,3,1,3,1,3,3,3,668,
	8,3,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,3,4,681,8,4,1,5,1,5,1,5,
	1,5,1,6,1,6,3,6,689,8,6,1,7,1,7,1,7,1,8,1,8,1,8,1,8,1,9,1,9,1,9,1,9,1,9,
	1,10,1,10,3,10,705,8,10,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,3,
	11,716,8,11,1,12,1,12,1,13,1,13,1,14,1,14,1,14,1,14,1,15,1,15,1,15,3,15,
	729,8,15,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,
	16,1,16,1,16,1,16,1,16,3,16,748,8,16,1,17,1,17,1,18,1,18,3,18,754,8,18,
	1,19,1,19,1,20,1,20,1,21,1,21,1,21,1,21,1,21,3,21,765,8,21,1,22,1,22,1,
	22,1,22,3,22,771,8,22,1,23,1,23,1,23,3,23,776,8,23,1,24,1,24,1,24,3,24,
	781,8,24,1,25,1,25,3,25,785,8,25,1,26,1,26,1,26,1,26,3,26,791,8,26,1,27,
	1,27,1,27,3,27,796,8,27,1,28,1,28,3,28,800,8,28,1,29,1,29,1,29,3,29,805,
	8,29,1,30,1,30,1,30,3,30,810,8,30,1,31,1,31,1,31,1,31,1,31,3,31,817,8,31,
	1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,
	32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,
	3,32,848,8,32,1,33,1,33,1,33,1,33,1,33,1,33,3,33,856,8,33,1,33,1,33,1,33,
	1,33,5,33,862,8,33,10,33,12,33,865,9,33,1,34,1,34,3,34,869,8,34,1,35,1,
	35,3,35,873,8,35,1,36,1,36,1,36,1,36,1,36,1,36,1,36,1,36,1,36,1,37,1,37,
	1,37,1,37,1,37,1,37,1,37,1,37,1,37,1,38,1,38,1,38,1,38,1,38,1,38,1,38,1,
	38,1,38,3,38,902,8,38,1,39,1,39,3,39,906,8,39,1,40,1,40,1,40,1,40,3,40,
	912,8,40,1,41,1,41,1,41,1,41,1,41,5,41,919,8,41,10,41,12,41,922,9,41,1,
	42,1,42,1,42,1,42,1,42,1,42,1,42,1,42,1,42,1,42,1,42,3,42,935,8,42,1,43,
	1,43,3,43,939,8,43,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,1,44,3,
	44,951,8,44,1,44,1,44,5,44,955,8,44,10,44,12,44,958,9,44,1,45,1,45,1,45,
	1,45,1,45,1,45,1,45,1,45,1,45,3,45,969,8,45,1,46,1,46,1,46,3,46,974,8,46,
	1,47,1,47,1,47,3,47,979,8,47,1,48,1,48,1,49,1,49,1,49,1,49,1,49,1,49,5,
	49,989,8,49,10,49,12,49,992,9,49,1,50,1,50,1,50,1,50,1,50,1,50,1,50,1,50,
	3,50,1002,8,50,1,51,1,51,3,51,1006,8,51,1,52,1,52,1,52,3,52,1011,8,52,1,
	53,1,53,1,54,1,54,3,54,1017,8,54,1,55,1,55,1,55,1,56,1,56,1,56,1,56,1,56,
	1,56,1,56,1,56,1,56,1,56,5,56,1032,8,56,10,56,12,56,1035,9,56,1,57,1,57,
	1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,
	57,1,57,1,57,3,57,1056,8,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,
	1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,
	57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,
	1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,
	57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,
	1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,
	57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,1,57,
	5,57,1154,8,57,10,57,12,57,1157,9,57,1,58,1,58,1,58,1,58,1,58,3,58,1164,
	8,58,1,59,1,59,1,60,1,60,1,60,1,60,1,61,1,61,1,61,1,61,1,61,1,61,1,61,1,
	61,1,61,1,61,3,61,1182,8,61,1,62,1,62,1,62,3,62,1187,8,62,1,63,1,63,1,63,
	1,64,1,64,1,65,1,65,3,65,1196,8,65,1,66,1,66,1,66,3,66,1201,8,66,1,67,1,
	67,1,67,1,67,1,67,1,67,1,67,1,67,1,67,1,67,1,67,1,67,1,67,1,67,1,67,3,67,
	1218,8,67,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,68,3,68,1229,8,68,1,
	69,1,69,1,69,1,69,1,69,1,70,1,70,1,70,1,70,1,70,1,70,3,70,1242,8,70,1,71,
	1,71,3,71,1246,8,71,1,72,1,72,1,72,1,72,1,72,1,72,5,72,1254,8,72,10,72,
	12,72,1257,9,72,1,73,1,73,1,73,1,74,1,74,1,75,1,75,1,76,1,76,1,76,1,76,
	3,76,1270,8,76,1,77,1,77,3,77,1274,8,77,1,78,1,78,1,78,1,78,1,78,1,78,1,
	78,1,78,1,78,1,78,1,78,3,78,1287,8,78,1,79,1,79,1,79,1,79,1,79,1,79,1,79,
	1,79,1,79,1,79,1,79,3,79,1300,8,79,1,80,1,80,3,80,1304,8,80,1,81,1,81,1,
	81,1,82,1,82,1,82,1,82,1,82,1,82,5,82,1315,8,82,10,82,12,82,1318,9,82,1,
	83,1,83,1,83,1,83,1,84,1,84,1,84,1,84,1,84,3,84,1329,8,84,1,85,1,85,1,85,
	1,85,1,85,1,85,5,85,1337,8,85,10,85,12,85,1340,9,85,1,86,1,86,1,86,1,86,
	1,86,1,86,1,87,1,87,1,87,3,87,1351,8,87,1,88,1,88,1,88,1,88,1,88,3,88,1358,
	8,88,1,89,1,89,3,89,1362,8,89,1,90,1,90,1,90,1,91,1,91,3,91,1369,8,91,1,
	92,1,92,1,92,1,92,1,92,1,92,1,92,1,92,3,92,1379,8,92,1,93,1,93,1,93,1,93,
	1,93,1,93,5,93,1387,8,93,10,93,12,93,1390,9,93,1,94,1,94,1,94,1,95,1,95,
	3,95,1397,8,95,1,96,1,96,1,96,1,97,1,97,3,97,1404,8,97,1,98,1,98,1,98,1,
	99,1,99,1,99,1,99,3,99,1413,8,99,1,100,1,100,3,100,1417,8,100,1,101,1,101,
	1,101,1,101,1,102,1,102,1,102,1,102,1,102,1,102,5,102,1429,8,102,10,102,
	12,102,1432,9,102,1,103,1,103,1,103,1,103,1,104,1,104,3,104,1440,8,104,
	1,105,1,105,1,105,3,105,1445,8,105,1,106,1,106,1,106,1,106,1,106,1,106,
	1,106,3,106,1454,8,106,1,107,1,107,1,108,1,108,3,108,1460,8,108,1,109,1,
	109,1,109,1,110,1,110,3,110,1467,8,110,1,111,1,111,1,111,1,112,1,112,1,
	112,1,112,1,112,1,112,1,112,1,112,1,112,1,112,1,112,1,112,1,112,1,112,1,
	112,1,112,3,112,1488,8,112,1,113,1,113,1,113,1,113,1,113,1,113,1,113,1,
	113,1,113,1,113,1,113,1,113,1,113,1,113,1,113,1,113,1,113,1,113,3,113,1508,
	8,113,1,114,1,114,1,114,1,114,3,114,1514,8,114,1,115,1,115,1,115,1,115,
	1,115,1,115,1,115,1,115,1,115,1,115,1,115,1,115,1,115,1,115,1,115,1,115,
	1,115,3,115,1533,8,115,1,116,1,116,1,116,1,117,1,117,1,117,1,117,1,117,
	1,117,5,117,1544,8,117,10,117,12,117,1547,9,117,1,118,1,118,1,118,1,118,
	3,118,1553,8,118,1,119,1,119,1,119,3,119,1558,8,119,1,120,1,120,1,120,1,
	120,1,120,1,120,1,121,1,121,1,121,1,121,1,121,1,121,1,121,1,121,1,122,1,
	122,3,122,1576,8,122,1,123,1,123,1,123,1,124,1,124,1,124,1,124,3,124,1585,
	8,124,1,125,1,125,1,125,1,126,1,126,1,126,1,127,1,127,1,127,1,128,1,128,
	1,128,1,128,1,128,1,128,1,128,1,128,1,128,1,128,1,128,1,128,1,128,1,128,
	1,128,3,128,1611,8,128,1,129,1,129,1,129,1,129,1,129,1,129,1,129,1,129,
	1,129,1,129,1,129,1,129,1,129,1,129,1,129,1,129,3,129,1629,8,129,1,130,
	1,130,1,130,1,130,1,130,1,130,1,130,1,130,1,130,1,130,1,130,1,130,1,130,
	1,130,1,130,1,130,1,130,1,130,1,130,1,130,1,130,1,130,1,130,1,130,1,130,
	1,130,1,130,1,130,1,130,1,130,1,130,3,130,1662,8,130,1,131,1,131,1,131,
	1,131,1,131,1,131,1,131,1,131,1,131,1,131,1,131,1,131,1,131,1,131,1,131,
	1,131,1,131,1,131,1,131,1,131,1,131,1,131,1,131,1,131,1,131,1,131,1,131,
	1,131,1,131,1,131,1,131,3,131,1695,8,131,1,132,1,132,1,132,1,133,1,133,
	1,133,1,133,1,133,1,133,5,133,1706,8,133,10,133,12,133,1709,9,133,1,134,
	1,134,1,134,1,134,1,134,1,134,1,134,1,134,1,134,1,134,1,134,3,134,1722,
	8,134,1,135,1,135,1,135,1,135,1,135,1,136,1,136,3,136,1731,8,136,1,137,
	1,137,1,137,1,137,1,138,1,138,1,138,1,138,1,138,1,138,1,138,5,138,1744,
	8,138,10,138,12,138,1747,9,138,1,139,1,139,1,139,1,139,1,139,1,139,5,139,
	1755,8,139,10,139,12,139,1758,9,139,1,140,1,140,1,140,1,140,1,140,1,140,
	1,140,1,140,1,140,1,140,1,140,1,140,1,140,1,140,1,140,1,140,1,140,1,140,
	1,140,1,140,3,140,1780,8,140,1,141,1,141,1,142,1,142,1,142,3,142,1787,8,
	142,1,143,1,143,1,143,1,144,1,144,1,144,1,144,1,144,1,144,5,144,1798,8,
	144,10,144,12,144,1801,9,144,1,145,1,145,1,145,1,146,1,146,1,146,1,146,
	1,146,1,146,1,146,1,146,1,146,1,146,1,146,1,146,1,146,1,146,1,146,1,147,
	1,147,1,148,1,148,3,148,1825,8,148,1,149,1,149,1,149,1,149,1,149,1,149,
	1,149,1,149,1,149,1,149,1,149,1,149,1,149,1,149,1,149,1,149,1,149,1,149,
	1,149,1,149,1,149,3,149,1848,8,149,1,150,1,150,1,150,1,150,1,150,1,150,
	1,150,1,150,1,150,1,150,1,150,1,150,1,150,1,150,3,150,1864,8,150,1,151,
	1,151,1,151,1,151,1,151,1,151,1,151,3,151,1873,8,151,1,152,1,152,1,152,
	1,152,1,152,1,152,1,152,1,152,1,152,1,152,3,152,1885,8,152,1,153,1,153,
	1,154,1,154,1,154,1,154,1,154,1,154,1,154,1,154,1,154,1,154,1,154,1,154,
	1,154,1,154,3,154,1903,8,154,1,155,1,155,1,155,1,155,1,155,1,156,1,156,
	1,156,1,156,1,156,1,157,1,157,1,157,1,157,1,158,1,158,1,158,5,158,1922,
	8,158,10,158,12,158,1925,9,158,1,159,1,159,3,159,1929,8,159,1,160,1,160,
	1,160,1,160,1,160,1,160,1,160,1,160,1,160,1,160,3,160,1941,8,160,1,161,
	1,161,1,161,1,161,1,161,1,161,5,161,1949,8,161,10,161,12,161,1952,9,161,
	1,162,1,162,1,162,1,162,1,162,1,163,1,163,1,163,1,163,1,163,1,164,1,164,
	1,164,1,164,1,165,1,165,1,166,1,166,1,166,5,166,1973,8,166,10,166,12,166,
	1976,9,166,1,167,1,167,1,167,1,167,1,167,1,167,1,167,1,167,3,167,1986,8,
	167,1,168,1,168,1,168,1,168,1,168,1,168,5,168,1994,8,168,10,168,12,168,
	1997,9,168,1,169,1,169,1,169,1,169,1,169,3,169,2004,8,169,1,170,1,170,1,
	171,1,171,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,
	172,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,
	172,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,
	172,1,172,1,172,1,172,1,172,1,172,3,172,2050,8,172,1,173,1,173,1,173,1,
	173,1,173,1,173,5,173,2058,8,173,10,173,12,173,2061,9,173,1,174,1,174,1,
	174,1,174,1,174,3,174,2068,8,174,1,175,1,175,1,175,1,175,1,175,1,175,5,
	175,2076,8,175,10,175,12,175,2079,9,175,1,176,1,176,1,176,1,176,1,176,1,
	176,1,176,1,176,1,176,1,176,1,176,1,176,1,176,1,176,1,176,1,176,1,176,1,
	176,1,176,1,176,1,176,1,176,1,176,1,176,1,176,1,176,3,176,2107,8,176,1,
	177,1,177,1,177,1,177,1,177,1,177,5,177,2115,8,177,10,177,12,177,2118,9,
	177,1,178,1,178,1,178,1,178,1,178,3,178,2125,8,178,1,179,1,179,1,179,1,
	179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,
	179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,
	179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,179,1,
	179,3,179,2167,8,179,1,180,1,180,1,181,1,181,1,181,1,181,1,181,1,181,1,
	181,1,181,1,181,1,181,1,181,1,181,1,181,1,181,1,181,1,181,1,181,1,181,1,
	181,1,181,1,181,1,181,1,181,1,181,1,181,1,181,1,181,1,181,3,181,2199,8,
	181,1,182,1,182,1,182,1,182,1,182,1,182,1,182,1,182,1,182,1,182,3,182,2211,
	8,182,1,183,1,183,1,183,1,183,1,183,1,183,1,183,1,183,1,183,1,183,1,183,
	1,183,1,183,1,183,1,183,1,183,1,183,1,183,1,183,1,183,3,183,2233,8,183,
	1,184,1,184,1,184,1,184,1,184,1,184,1,184,1,184,1,184,1,184,1,184,3,184,
	2246,8,184,1,185,1,185,1,185,1,185,1,185,1,185,1,185,1,185,1,185,1,185,
	3,185,2258,8,185,1,186,1,186,1,186,1,186,1,186,1,186,1,186,1,186,1,186,
	1,186,1,186,1,186,1,186,1,186,3,186,2274,8,186,1,187,1,187,1,187,1,187,
	1,187,1,187,1,187,1,187,1,187,1,187,3,187,2286,8,187,1,188,1,188,1,188,
	1,188,1,189,1,189,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,
	1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,
	1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,
	1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,
	1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,
	1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,1,190,3,190,2360,8,190,
	1,191,1,191,3,191,2364,8,191,1,192,1,192,1,193,1,193,3,193,2370,8,193,1,
	194,1,194,1,194,1,194,3,194,2376,8,194,1,195,1,195,1,195,1,195,1,195,1,
	195,1,195,1,195,1,195,1,195,1,195,1,195,1,195,1,195,3,195,2392,8,195,1,
	196,1,196,1,196,1,196,1,196,1,196,1,196,1,196,3,196,2402,8,196,1,197,1,
	197,1,197,1,197,1,197,1,197,1,197,1,197,1,197,1,197,3,197,2414,8,197,1,
	198,1,198,1,198,1,198,1,198,1,198,1,198,1,198,3,198,2424,8,198,1,199,1,
	199,3,199,2428,8,199,1,200,1,200,1,200,1,200,1,200,1,200,3,200,2436,8,200,
	1,201,1,201,1,201,1,201,1,201,1,201,5,201,2444,8,201,10,201,12,201,2447,
	9,201,1,202,1,202,1,202,1,203,1,203,3,203,2454,8,203,1,204,1,204,1,204,
	1,204,1,204,1,204,1,204,1,204,1,204,3,204,2465,8,204,1,205,1,205,1,206,
	1,206,1,206,1,207,1,207,1,207,1,207,1,207,1,207,5,207,2478,8,207,10,207,
	12,207,2481,9,207,1,208,1,208,3,208,2485,8,208,1,209,1,209,1,209,3,209,
	2490,8,209,1,210,1,210,1,210,1,210,1,210,3,210,2497,8,210,1,211,1,211,1,
	211,1,211,3,211,2503,8,211,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,
	212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,
	212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,
	212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,
	212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,
	212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,3,212,2570,8,
	212,1,213,1,213,1,213,3,213,2575,8,213,1,214,1,214,1,214,1,214,1,214,1,
	214,1,214,1,214,1,214,1,214,1,214,1,214,1,214,1,214,1,214,1,214,3,214,2593,
	8,214,1,215,1,215,1,215,1,215,1,215,1,215,1,215,1,215,1,215,1,216,1,216,
	1,216,1,216,1,216,1,216,1,216,1,216,1,216,1,216,1,216,1,217,1,217,1,217,
	3,217,2618,8,217,1,218,1,218,3,218,2622,8,218,1,219,1,219,1,219,1,219,1,
	219,1,219,1,219,1,219,1,219,1,219,1,219,3,219,2635,8,219,1,220,1,220,1,
	220,1,220,1,220,1,220,1,220,1,220,1,220,1,220,3,220,2647,8,220,1,221,1,
	221,1,221,1,221,1,221,3,221,2654,8,221,1,222,1,222,1,222,1,222,1,222,1,
	222,5,222,2662,8,222,10,222,12,222,2665,9,222,1,223,1,223,1,223,1,223,1,
	223,1,223,1,223,1,223,1,223,1,223,1,223,1,223,1,223,1,223,1,223,1,223,1,
	223,1,223,1,223,1,223,1,223,1,223,1,223,1,223,3,223,2691,8,223,1,224,1,
	224,1,224,1,224,1,224,1,224,1,224,1,224,1,224,1,224,3,224,2703,8,224,1,
	225,1,225,1,225,1,225,1,225,1,225,1,225,1,226,1,226,1,226,1,226,1,226,1,
	226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,
	226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,
	226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,
	226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,
	226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,
	226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,
	226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,
	226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,
	226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,
	226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,1,226,3,226,2834,8,226,1,
	227,1,227,3,227,2838,8,227,1,228,1,228,1,228,1,228,1,228,1,228,5,228,2846,
	8,228,10,228,12,228,2849,9,228,1,229,1,229,1,230,1,230,1,230,1,230,1,230,
	1,230,1,230,1,230,1,230,1,230,1,230,1,230,1,230,1,230,1,230,1,230,1,230,
	1,230,1,230,1,230,1,230,1,230,1,230,1,230,1,230,1,230,5,230,2879,8,230,
	10,230,12,230,2882,9,230,1,231,1,231,1,232,1,232,1,233,1,233,1,233,1,233,
	1,233,1,233,3,233,2894,8,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,
	1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,1,233,5,233,
	3094,8,233,10,233,12,233,3097,9,233,1,234,1,234,1,235,1,235,1,235,1,235,
	1,235,1,235,1,235,1,235,1,235,1,235,1,235,1,235,1,235,1,235,1,235,1,235,
	1,235,1,235,1,235,1,235,1,235,1,235,1,235,1,235,1,235,1,235,1,235,1,235,
	1,235,1,235,3,235,3131,8,235,1,236,1,236,1,236,1,236,1,236,1,236,1,236,
	1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,
	1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,
	1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,
	1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,
	1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,
	1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,1,236,
	1,236,1,236,5,236,3214,8,236,10,236,12,236,3217,9,236,1,237,1,237,1,238,
	1,238,3,238,3223,8,238,1,239,1,239,1,239,1,239,1,240,1,240,3,240,3231,8,
	240,1,241,1,241,1,241,1,241,1,241,1,241,5,241,3239,8,241,10,241,12,241,
	3242,9,241,1,242,1,242,1,242,1,242,1,242,1,242,1,242,3,242,3251,8,242,1,
	243,1,243,1,243,1,243,1,244,1,244,3,244,3259,8,244,1,245,1,245,1,245,1,
	245,1,245,1,245,5,245,3267,8,245,10,245,12,245,3270,9,245,1,246,1,246,1,
	247,1,247,1,247,1,247,1,248,1,248,3,248,3280,8,248,1,249,1,249,1,249,1,
	249,1,250,1,250,1,250,1,250,1,250,1,250,1,250,1,250,1,250,1,250,1,250,1,
	250,5,250,3298,8,250,10,250,12,250,3301,9,250,1,251,1,251,1,251,1,252,1,
	252,1,252,3,252,3309,8,252,1,253,1,253,1,253,1,253,1,253,1,253,1,253,1,
	253,1,253,1,253,1,253,1,253,1,253,1,253,1,253,1,253,1,253,1,253,1,253,1,
	253,1,253,1,253,1,253,1,253,1,253,1,253,1,253,1,253,1,253,1,253,1,253,1,
	253,1,253,1,253,1,253,1,253,1,253,1,253,1,253,1,253,1,253,3,253,3352,8,
	253,1,254,1,254,3,254,3356,8,254,1,255,1,255,3,255,3360,8,255,1,256,1,256,
	1,256,1,256,1,256,1,256,1,256,1,256,1,256,1,256,1,256,1,256,1,256,1,256,
	1,256,1,256,1,256,1,256,1,256,1,256,1,256,1,256,1,256,1,256,1,256,1,256,
	1,256,1,256,1,256,3,256,3391,8,256,1,257,1,257,1,257,1,257,1,257,1,257,
	5,257,3399,8,257,10,257,12,257,3402,9,257,1,258,1,258,1,258,1,258,1,258,
	1,258,1,258,1,258,1,258,1,258,1,258,1,258,1,258,1,258,1,258,1,258,1,258,
	1,258,1,258,1,258,3,258,3424,8,258,1,259,1,259,1,259,1,260,1,260,1,260,
	1,260,1,260,1,260,1,260,1,260,1,260,1,260,1,260,1,260,1,260,1,260,1,260,
	1,260,1,260,1,260,1,260,1,260,1,260,1,260,1,260,3,260,3452,8,260,1,261,
	1,261,1,261,1,261,1,261,1,261,1,261,1,261,1,261,3,261,3463,8,261,1,262,
	1,262,1,262,1,262,1,262,1,262,1,262,1,262,1,262,3,262,3474,8,262,1,263,
	1,263,3,263,3478,8,263,1,264,1,264,1,264,3,264,3483,8,264,1,265,1,265,1,
	265,1,265,1,265,1,265,5,265,3491,8,265,10,265,12,265,3494,9,265,1,266,1,
	266,1,266,1,266,1,267,1,267,1,267,1,267,1,267,1,267,1,267,1,268,1,268,3,
	268,3509,8,268,1,269,1,269,1,269,1,269,3,269,3515,8,269,1,270,1,270,1,270,
	1,270,1,270,3,270,3522,8,270,1,271,1,271,1,272,1,272,1,272,1,272,1,272,
	1,272,1,272,1,272,1,272,1,272,1,272,3,272,3537,8,272,1,273,1,273,1,273,
	1,273,1,273,1,273,3,273,3545,8,273,1,274,1,274,1,274,1,274,1,274,1,274,
	1,274,1,274,1,274,3,274,3556,8,274,1,275,1,275,1,276,1,276,3,276,3562,8,
	276,1,277,1,277,1,277,1,277,3,277,3568,8,277,1,278,1,278,1,278,3,278,3573,
	8,278,1,279,1,279,1,280,1,280,1,280,1,280,1,280,1,280,3,280,3583,8,280,
	1,281,1,281,3,281,3587,8,281,1,282,1,282,1,282,1,282,3,282,3593,8,282,1,
	283,1,283,1,283,1,283,1,284,1,284,1,284,1,285,1,285,1,285,1,285,1,286,1,
	286,1,287,1,287,3,287,3610,8,287,1,288,1,288,1,289,1,289,1,289,1,289,3,
	289,3618,8,289,1,290,1,290,1,291,1,291,3,291,3624,8,291,1,292,1,292,1,292,
	1,292,1,293,1,293,1,293,1,294,1,294,1,294,1,294,1,295,1,295,1,295,1,296,
	1,296,3,296,3642,8,296,1,297,1,297,1,297,1,298,1,298,3,298,3649,8,298,1,
	299,1,299,3,299,3653,8,299,1,300,1,300,1,300,1,300,1,300,1,300,1,300,1,
	300,1,300,1,300,1,300,1,300,1,300,1,300,1,300,3,300,3670,8,300,1,301,1,
	301,1,301,3,301,3675,8,301,1,302,1,302,1,302,1,302,1,302,1,303,1,303,1,
	303,1,303,1,303,5,303,3687,8,303,10,303,12,303,3690,9,303,1,304,1,304,1,
	304,1,304,3,304,3696,8,304,1,305,1,305,1,305,5,305,3701,8,305,10,305,12,
	305,3704,9,305,1,306,1,306,1,306,1,306,1,306,1,306,1,306,3,306,3713,8,306,
	1,307,1,307,1,307,1,307,1,307,1,307,1,307,1,307,1,307,1,307,3,307,3725,
	8,307,1,308,1,308,1,308,1,308,1,308,1,308,1,308,1,308,1,308,1,308,3,308,
	3737,8,308,1,309,1,309,1,309,1,309,1,309,5,309,3744,8,309,10,309,12,309,
	3747,9,309,1,310,1,310,1,310,1,310,1,310,1,310,3,310,3755,8,310,1,311,1,
	311,1,311,1,312,1,312,1,312,1,312,1,313,1,313,1,313,1,313,3,313,3768,8,
	313,1,314,1,314,1,314,1,314,1,315,1,315,1,315,1,315,3,315,3778,8,315,1,
	316,1,316,1,316,1,316,3,316,3784,8,316,1,317,1,317,1,317,3,317,3789,8,317,
	1,318,1,318,1,318,1,318,3,318,3795,8,318,1,319,1,319,1,319,1,319,1,319,
	1,319,1,319,1,319,1,319,1,319,1,319,1,319,1,319,1,319,1,319,1,319,1,319,
	1,319,3,319,3815,8,319,1,320,1,320,1,320,1,320,1,320,1,320,1,320,1,320,
	1,320,1,320,1,320,1,320,1,320,1,320,1,320,1,320,1,320,1,320,3,320,3835,
	8,320,1,321,1,321,3,321,3839,8,321,1,321,0,39,4,66,82,88,98,112,114,144,
	164,170,186,204,234,266,276,278,288,316,322,332,336,346,350,354,402,414,
	444,456,460,466,472,482,490,500,514,530,606,610,618,322,0,2,4,6,8,10,12,
	14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,
	62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,
	108,110,112,114,116,118,120,122,124,126,128,130,132,134,136,138,140,142,
	144,146,148,150,152,154,156,158,160,162,164,166,168,170,172,174,176,178,
	180,182,184,186,188,190,192,194,196,198,200,202,204,206,208,210,212,214,
	216,218,220,222,224,226,228,230,232,234,236,238,240,242,244,246,248,250,
	252,254,256,258,260,262,264,266,268,270,272,274,276,278,280,282,284,286,
	288,290,292,294,296,298,300,302,304,306,308,310,312,314,316,318,320,322,
	324,326,328,330,332,334,336,338,340,342,344,346,348,350,352,354,356,358,
	360,362,364,366,368,370,372,374,376,378,380,382,384,386,388,390,392,394,
	396,398,400,402,404,406,408,410,412,414,416,418,420,422,424,426,428,430,
	432,434,436,438,440,442,444,446,448,450,452,454,456,458,460,462,464,466,
	468,470,472,474,476,478,480,482,484,486,488,490,492,494,496,498,500,502,
	504,506,508,510,512,514,516,518,520,522,524,526,528,530,532,534,536,538,
	540,542,544,546,548,550,552,554,556,558,560,562,564,566,568,570,572,574,
	576,578,580,582,584,586,588,590,592,594,596,598,600,602,604,606,608,610,
	612,614,616,618,620,622,624,626,628,630,632,634,636,638,640,642,0,19,3,
	0,221,221,238,238,242,245,2,0,40,40,96,96,2,0,56,56,125,125,3,0,78,78,175,
	175,224,224,2,0,91,91,216,216,2,0,49,49,172,172,2,0,90,90,128,128,1,0,101,
	102,2,0,221,221,243,243,2,0,92,92,210,210,2,0,34,34,77,77,2,0,126,126,225,
	225,5,0,1,3,87,87,141,141,148,148,209,209,1,0,239,241,3,0,102,102,174,174,
	189,189,2,0,93,93,166,166,2,0,34,34,74,74,2,0,43,43,199,199,2,0,206,207,
	235,235,3995,0,649,1,0,0,0,2,651,1,0,0,0,4,653,1,0,0,0,6,667,1,0,0,0,8,
	680,1,0,0,0,10,682,1,0,0,0,12,688,1,0,0,0,14,690,1,0,0,0,16,693,1,0,0,0,
	18,697,1,0,0,0,20,704,1,0,0,0,22,715,1,0,0,0,24,717,1,0,0,0,26,719,1,0,
	0,0,28,721,1,0,0,0,30,728,1,0,0,0,32,747,1,0,0,0,34,749,1,0,0,0,36,753,
	1,0,0,0,38,755,1,0,0,0,40,757,1,0,0,0,42,764,1,0,0,0,44,770,1,0,0,0,46,
	775,1,0,0,0,48,780,1,0,0,0,50,784,1,0,0,0,52,790,1,0,0,0,54,795,1,0,0,0,
	56,799,1,0,0,0,58,804,1,0,0,0,60,809,1,0,0,0,62,816,1,0,0,0,64,847,1,0,
	0,0,66,855,1,0,0,0,68,868,1,0,0,0,70,872,1,0,0,0,72,874,1,0,0,0,74,883,
	1,0,0,0,76,901,1,0,0,0,78,905,1,0,0,0,80,911,1,0,0,0,82,913,1,0,0,0,84,
	934,1,0,0,0,86,938,1,0,0,0,88,950,1,0,0,0,90,968,1,0,0,0,92,973,1,0,0,0,
	94,978,1,0,0,0,96,980,1,0,0,0,98,982,1,0,0,0,100,1001,1,0,0,0,102,1005,
	1,0,0,0,104,1010,1,0,0,0,106,1012,1,0,0,0,108,1016,1,0,0,0,110,1018,1,0,
	0,0,112,1021,1,0,0,0,114,1055,1,0,0,0,116,1163,1,0,0,0,118,1165,1,0,0,0,
	120,1167,1,0,0,0,122,1181,1,0,0,0,124,1186,1,0,0,0,126,1188,1,0,0,0,128,
	1191,1,0,0,0,130,1195,1,0,0,0,132,1200,1,0,0,0,134,1217,1,0,0,0,136,1228,
	1,0,0,0,138,1230,1,0,0,0,140,1241,1,0,0,0,142,1245,1,0,0,0,144,1247,1,0,
	0,0,146,1258,1,0,0,0,148,1261,1,0,0,0,150,1263,1,0,0,0,152,1269,1,0,0,0,
	154,1273,1,0,0,0,156,1286,1,0,0,0,158,1299,1,0,0,0,160,1303,1,0,0,0,162,
	1305,1,0,0,0,164,1308,1,0,0,0,166,1319,1,0,0,0,168,1328,1,0,0,0,170,1330,
	1,0,0,0,172,1341,1,0,0,0,174,1350,1,0,0,0,176,1357,1,0,0,0,178,1361,1,0,
	0,0,180,1363,1,0,0,0,182,1368,1,0,0,0,184,1378,1,0,0,0,186,1380,1,0,0,0,
	188,1391,1,0,0,0,190,1396,1,0,0,0,192,1398,1,0,0,0,194,1403,1,0,0,0,196,
	1405,1,0,0,0,198,1412,1,0,0,0,200,1416,1,0,0,0,202,1418,1,0,0,0,204,1422,
	1,0,0,0,206,1433,1,0,0,0,208,1439,1,0,0,0,210,1444,1,0,0,0,212,1453,1,0,
	0,0,214,1455,1,0,0,0,216,1459,1,0,0,0,218,1461,1,0,0,0,220,1466,1,0,0,0,
	222,1468,1,0,0,0,224,1487,1,0,0,0,226,1507,1,0,0,0,228,1513,1,0,0,0,230,
	1532,1,0,0,0,232,1534,1,0,0,0,234,1537,1,0,0,0,236,1552,1,0,0,0,238,1557,
	1,0,0,0,240,1559,1,0,0,0,242,1565,1,0,0,0,244,1575,1,0,0,0,246,1577,1,0,
	0,0,248,1584,1,0,0,0,250,1586,1,0,0,0,252,1589,1,0,0,0,254,1592,1,0,0,0,
	256,1610,1,0,0,0,258,1628,1,0,0,0,260,1661,1,0,0,0,262,1694,1,0,0,0,264,
	1696,1,0,0,0,266,1699,1,0,0,0,268,1721,1,0,0,0,270,1723,1,0,0,0,272,1730,
	1,0,0,0,274,1732,1,0,0,0,276,1736,1,0,0,0,278,1748,1,0,0,0,280,1779,1,0,
	0,0,282,1781,1,0,0,0,284,1786,1,0,0,0,286,1788,1,0,0,0,288,1791,1,0,0,0,
	290,1802,1,0,0,0,292,1805,1,0,0,0,294,1820,1,0,0,0,296,1824,1,0,0,0,298,
	1847,1,0,0,0,300,1863,1,0,0,0,302,1872,1,0,0,0,304,1884,1,0,0,0,306,1886,
	1,0,0,0,308,1902,1,0,0,0,310,1904,1,0,0,0,312,1909,1,0,0,0,314,1914,1,0,
	0,0,316,1918,1,0,0,0,318,1928,1,0,0,0,320,1940,1,0,0,0,322,1942,1,0,0,0,
	324,1953,1,0,0,0,326,1958,1,0,0,0,328,1963,1,0,0,0,330,1967,1,0,0,0,332,
	1969,1,0,0,0,334,1985,1,0,0,0,336,1987,1,0,0,0,338,2003,1,0,0,0,340,2005,
	1,0,0,0,342,2007,1,0,0,0,344,2049,1,0,0,0,346,2051,1,0,0,0,348,2067,1,0,
	0,0,350,2069,1,0,0,0,352,2106,1,0,0,0,354,2108,1,0,0,0,356,2124,1,0,0,0,
	358,2166,1,0,0,0,360,2168,1,0,0,0,362,2198,1,0,0,0,364,2210,1,0,0,0,366,
	2232,1,0,0,0,368,2245,1,0,0,0,370,2257,1,0,0,0,372,2273,1,0,0,0,374,2285,
	1,0,0,0,376,2287,1,0,0,0,378,2291,1,0,0,0,380,2359,1,0,0,0,382,2363,1,0,
	0,0,384,2365,1,0,0,0,386,2369,1,0,0,0,388,2375,1,0,0,0,390,2391,1,0,0,0,
	392,2401,1,0,0,0,394,2413,1,0,0,0,396,2423,1,0,0,0,398,2427,1,0,0,0,400,
	2435,1,0,0,0,402,2437,1,0,0,0,404,2448,1,0,0,0,406,2453,1,0,0,0,408,2464,
	1,0,0,0,410,2466,1,0,0,0,412,2468,1,0,0,0,414,2471,1,0,0,0,416,2484,1,0,
	0,0,418,2489,1,0,0,0,420,2496,1,0,0,0,422,2502,1,0,0,0,424,2569,1,0,0,0,
	426,2574,1,0,0,0,428,2592,1,0,0,0,430,2594,1,0,0,0,432,2603,1,0,0,0,434,
	2617,1,0,0,0,436,2621,1,0,0,0,438,2634,1,0,0,0,440,2646,1,0,0,0,442,2653,
	1,0,0,0,444,2655,1,0,0,0,446,2690,1,0,0,0,448,2702,1,0,0,0,450,2704,1,0,
	0,0,452,2833,1,0,0,0,454,2837,1,0,0,0,456,2839,1,0,0,0,458,2850,1,0,0,0,
	460,2852,1,0,0,0,462,2883,1,0,0,0,464,2885,1,0,0,0,466,2893,1,0,0,0,468,
	3098,1,0,0,0,470,3130,1,0,0,0,472,3132,1,0,0,0,474,3218,1,0,0,0,476,3222,
	1,0,0,0,478,3224,1,0,0,0,480,3230,1,0,0,0,482,3232,1,0,0,0,484,3250,1,0,
	0,0,486,3252,1,0,0,0,488,3258,1,0,0,0,490,3260,1,0,0,0,492,3271,1,0,0,0,
	494,3273,1,0,0,0,496,3279,1,0,0,0,498,3281,1,0,0,0,500,3285,1,0,0,0,502,
	3302,1,0,0,0,504,3308,1,0,0,0,506,3351,1,0,0,0,508,3355,1,0,0,0,510,3359,
	1,0,0,0,512,3390,1,0,0,0,514,3392,1,0,0,0,516,3423,1,0,0,0,518,3425,1,0,
	0,0,520,3451,1,0,0,0,522,3462,1,0,0,0,524,3473,1,0,0,0,526,3477,1,0,0,0,
	528,3482,1,0,0,0,530,3484,1,0,0,0,532,3495,1,0,0,0,534,3499,1,0,0,0,536,
	3508,1,0,0,0,538,3514,1,0,0,0,540,3521,1,0,0,0,542,3523,1,0,0,0,544,3536,
	1,0,0,0,546,3544,1,0,0,0,548,3555,1,0,0,0,550,3557,1,0,0,0,552,3561,1,0,
	0,0,554,3567,1,0,0,0,556,3572,1,0,0,0,558,3574,1,0,0,0,560,3582,1,0,0,0,
	562,3586,1,0,0,0,564,3592,1,0,0,0,566,3594,1,0,0,0,568,3598,1,0,0,0,570,
	3601,1,0,0,0,572,3605,1,0,0,0,574,3609,1,0,0,0,576,3611,1,0,0,0,578,3617,
	1,0,0,0,580,3619,1,0,0,0,582,3623,1,0,0,0,584,3625,1,0,0,0,586,3629,1,0,
	0,0,588,3632,1,0,0,0,590,3636,1,0,0,0,592,3641,1,0,0,0,594,3643,1,0,0,0,
	596,3648,1,0,0,0,598,3652,1,0,0,0,600,3669,1,0,0,0,602,3674,1,0,0,0,604,
	3676,1,0,0,0,606,3681,1,0,0,0,608,3695,1,0,0,0,610,3697,1,0,0,0,612,3712,
	1,0,0,0,614,3724,1,0,0,0,616,3736,1,0,0,0,618,3738,1,0,0,0,620,3754,1,0,
	0,0,622,3756,1,0,0,0,624,3759,1,0,0,0,626,3767,1,0,0,0,628,3769,1,0,0,0,
	630,3777,1,0,0,0,632,3783,1,0,0,0,634,3788,1,0,0,0,636,3794,1,0,0,0,638,
	3814,1,0,0,0,640,3834,1,0,0,0,642,3838,1,0,0,0,644,645,3,6,3,0,645,646,
	3,4,2,0,646,650,1,0,0,0,647,650,3,526,263,0,648,650,3,80,40,0,649,644,1,
	0,0,0,649,647,1,0,0,0,649,648,1,0,0,0,650,1,1,0,0,0,651,652,7,0,0,0,652,
	3,1,0,0,0,653,658,6,2,-1,0,654,655,10,1,0,0,655,657,5,30,0,0,656,654,1,
	0,0,0,657,660,1,0,0,0,658,656,1,0,0,0,658,659,1,0,0,0,659,5,1,0,0,0,660,
	658,1,0,0,0,661,668,3,10,5,0,662,668,3,14,7,0,663,668,3,18,9,0,664,668,
	3,28,14,0,665,668,3,16,8,0,666,668,3,8,4,0,667,661,1,0,0,0,667,662,1,0,
	0,0,667,663,1,0,0,0,667,664,1,0,0,0,667,665,1,0,0,0,667,666,1,0,0,0,668,
	7,1,0,0,0,669,681,3,40,20,0,670,681,3,42,21,0,671,681,3,44,22,0,672,681,
	3,32,16,0,673,681,3,452,226,0,674,681,3,46,23,0,675,681,3,48,24,0,676,681,
	3,50,25,0,677,681,3,60,30,0,678,681,3,62,31,0,679,681,3,602,301,0,680,669,
	1,0,0,0,680,670,1,0,0,0,680,671,1,0,0,0,680,672,1,0,0,0,680,673,1,0,0,0,
	680,674,1,0,0,0,680,675,1,0,0,0,680,676,1,0,0,0,680,677,1,0,0,0,680,678,
	1,0,0,0,680,679,1,0,0,0,681,9,1,0,0,0,682,683,5,33,0,0,683,684,3,12,6,0,
	684,685,3,8,4,0,685,11,1,0,0,0,686,689,1,0,0,0,687,689,5,112,0,0,688,686,
	1,0,0,0,688,687,1,0,0,0,689,13,1,0,0,0,690,691,5,86,0,0,691,692,3,8,4,0,
	692,15,1,0,0,0,693,694,5,86,0,0,694,695,5,98,0,0,695,696,3,436,218,0,696,
	17,1,0,0,0,697,698,5,167,0,0,698,699,3,20,10,0,699,700,3,22,11,0,700,701,
	3,8,4,0,701,19,1,0,0,0,702,705,1,0,0,0,703,705,5,95,0,0,704,702,1,0,0,0,
	704,703,1,0,0,0,705,21,1,0,0,0,706,716,1,0,0,0,707,708,3,2,1,0,708,709,
	3,26,13,0,709,716,1,0,0,0,710,711,3,24,12,0,711,712,3,26,13,0,712,716,1,
	0,0,0,713,714,5,1,0,0,714,716,3,26,13,0,715,706,1,0,0,0,715,707,1,0,0,0,
	715,710,1,0,0,0,715,713,1,0,0,0,716,23,1,0,0,0,717,718,5,237,0,0,718,25,
	1,0,0,0,719,720,7,1,0,0,720,27,1,0,0,0,721,722,5,84,0,0,722,723,3,466,233,
	0,723,724,3,30,15,0,724,29,1,0,0,0,725,729,1,0,0,0,726,727,5,222,0,0,727,
	729,3,476,238,0,728,725,1,0,0,0,728,726,1,0,0,0,729,31,1,0,0,0,730,731,
	5,113,0,0,731,732,3,34,17,0,732,733,3,226,113,0,733,734,3,38,19,0,734,735,
	3,592,296,0,735,748,1,0,0,0,736,737,5,113,0,0,737,738,3,122,61,0,738,739,
	3,102,51,0,739,740,3,38,19,0,740,741,3,592,296,0,741,748,1,0,0,0,742,743,
	5,113,0,0,743,744,3,466,233,0,744,745,3,38,19,0,745,746,3,592,296,0,746,
	748,1,0,0,0,747,730,1,0,0,0,747,736,1,0,0,0,747,742,1,0,0,0,748,33,1,0,
	0,0,749,750,7,2,0,0,750,35,1,0,0,0,751,754,1,0,0,0,752,754,3,34,17,0,753,
	751,1,0,0,0,753,752,1,0,0,0,754,37,1,0,0,0,755,756,1,0,0,0,756,39,1,0,0,
	0,757,758,3,64,32,0,758,41,1,0,0,0,759,765,3,224,112,0,760,765,3,258,129,
	0,761,765,3,260,130,0,762,765,3,262,131,0,763,765,3,292,146,0,764,759,1,
	0,0,0,764,760,1,0,0,0,764,761,1,0,0,0,764,762,1,0,0,0,764,763,1,0,0,0,765,
	43,1,0,0,0,766,771,3,52,26,0,767,771,3,54,27,0,768,771,3,56,28,0,769,771,
	3,58,29,0,770,766,1,0,0,0,770,767,1,0,0,0,770,768,1,0,0,0,770,769,1,0,0,
	0,771,45,1,0,0,0,772,776,3,310,155,0,773,776,3,312,156,0,774,776,3,314,
	157,0,775,772,1,0,0,0,775,773,1,0,0,0,775,774,1,0,0,0,776,47,1,0,0,0,777,
	781,3,324,162,0,778,781,3,326,163,0,779,781,3,328,164,0,780,777,1,0,0,0,
	780,778,1,0,0,0,780,779,1,0,0,0,781,49,1,0,0,0,782,785,3,344,172,0,783,
	785,3,358,179,0,784,782,1,0,0,0,784,783,1,0,0,0,785,51,1,0,0,0,786,791,
	3,380,190,0,787,791,3,424,212,0,788,791,3,428,214,0,789,791,3,430,215,0,
	790,786,1,0,0,0,790,787,1,0,0,0,790,788,1,0,0,0,790,789,1,0,0,0,791,53,
	1,0,0,0,792,796,3,362,181,0,793,796,3,364,182,0,794,796,3,366,183,0,795,
	792,1,0,0,0,795,793,1,0,0,0,795,794,1,0,0,0,796,55,1,0,0,0,797,800,3,368,
	184,0,798,800,3,370,185,0,799,797,1,0,0,0,799,798,1,0,0,0,800,57,1,0,0,
	0,801,805,3,372,186,0,802,805,3,374,187,0,803,805,3,376,188,0,804,801,1,
	0,0,0,804,802,1,0,0,0,804,803,1,0,0,0,805,59,1,0,0,0,806,810,3,432,216,
	0,807,810,3,448,224,0,808,810,3,450,225,0,809,806,1,0,0,0,809,807,1,0,0,
	0,809,808,1,0,0,0,810,61,1,0,0,0,811,817,3,566,283,0,812,817,3,568,284,
	0,813,817,3,570,285,0,814,817,3,590,295,0,815,817,3,588,294,0,816,811,1,
	0,0,0,816,812,1,0,0,0,816,813,1,0,0,0,816,814,1,0,0,0,816,815,1,0,0,0,817,
	63,1,0,0,0,818,819,3,66,33,0,819,820,3,200,100,0,820,848,1,0,0,0,821,822,
	3,66,33,0,822,823,3,200,100,0,823,824,3,218,109,0,824,825,3,220,110,0,825,
	848,1,0,0,0,826,827,3,66,33,0,827,828,3,200,100,0,828,829,3,222,111,0,829,
	830,3,216,108,0,830,848,1,0,0,0,831,832,3,168,84,0,832,833,3,66,33,0,833,
	834,3,200,100,0,834,848,1,0,0,0,835,836,3,168,84,0,836,837,3,66,33,0,837,
	838,3,200,100,0,838,839,3,218,109,0,839,840,3,220,110,0,840,848,1,0,0,0,
	841,842,3,168,84,0,842,843,3,66,33,0,843,844,3,200,100,0,844,845,3,222,
	111,0,845,846,3,216,108,0,846,848,1,0,0,0,847,818,1,0,0,0,847,821,1,0,0,
	0,847,826,1,0,0,0,847,831,1,0,0,0,847,835,1,0,0,0,847,841,1,0,0,0,848,65,
	1,0,0,0,849,850,6,33,-1,0,850,856,3,70,35,0,851,852,3,524,262,0,852,853,
	3,76,38,0,853,854,3,68,34,0,854,856,1,0,0,0,855,849,1,0,0,0,855,851,1,0,
	0,0,856,863,1,0,0,0,857,858,10,2,0,0,858,859,3,76,38,0,859,860,3,68,34,
	0,860,862,1,0,0,0,861,857,1,0,0,0,862,865,1,0,0,0,863,861,1,0,0,0,863,864,
	1,0,0,0,864,67,1,0,0,0,865,863,1,0,0,0,866,869,3,70,35,0,867,869,3,524,
	262,0,868,866,1,0,0,0,868,867,1,0,0,0,869,69,1,0,0,0,870,873,3,72,36,0,
	871,873,3,74,37,0,872,870,1,0,0,0,872,871,1,0,0,0,873,71,1,0,0,0,874,875,
	3,110,55,0,875,876,3,160,80,0,876,877,3,178,89,0,877,878,3,182,91,0,878,
	879,3,528,264,0,879,880,5,194,0,0,880,881,3,78,39,0,881,882,3,90,45,0,882,
	73,1,0,0,0,883,884,5,194,0,0,884,885,3,78,39,0,885,886,3,90,45,0,886,887,
	3,108,54,0,887,888,3,160,80,0,888,889,3,178,89,0,889,890,3,182,91,0,890,
	891,3,528,264,0,891,75,1,0,0,0,892,902,5,213,0,0,893,894,5,213,0,0,894,
	902,5,34,0,0,895,902,5,117,0,0,896,897,5,117,0,0,897,902,5,34,0,0,898,902,
	5,82,0,0,899,900,5,82,0,0,900,902,5,34,0,0,901,892,1,0,0,0,901,893,1,0,
	0,0,901,895,1,0,0,0,901,896,1,0,0,0,901,898,1,0,0,0,901,899,1,0,0,0,902,
	77,1,0,0,0,903,906,1,0,0,0,904,906,5,246,0,0,905,903,1,0,0,0,905,904,1,
	0,0,0,906,79,1,0,0,0,907,908,5,8,0,0,908,912,3,82,41,0,909,910,5,8,0,0,
	910,912,3,478,239,0,911,907,1,0,0,0,911,909,1,0,0,0,912,81,1,0,0,0,913,
	914,6,41,-1,0,914,915,3,84,42,0,915,920,1,0,0,0,916,917,10,1,0,0,917,919,
	3,84,42,0,918,916,1,0,0,0,919,922,1,0,0,0,920,918,1,0,0,0,920,921,1,0,0,
	0,921,83,1,0,0,0,922,920,1,0,0,0,923,935,3,2,1,0,924,925,3,2,1,0,925,926,
	5,21,0,0,926,927,3,86,43,0,927,928,5,22,0,0,928,935,1,0,0,0,929,930,5,112,
	0,0,930,931,5,21,0,0,931,932,3,86,43,0,932,933,5,22,0,0,933,935,1,0,0,0,
	934,923,1,0,0,0,934,924,1,0,0,0,934,929,1,0,0,0,935,85,1,0,0,0,936,939,
	1,0,0,0,937,939,3,88,44,0,938,936,1,0,0,0,938,937,1,0,0,0,939,87,1,0,0,
	0,940,941,6,44,-1,0,941,951,3,2,1,0,942,943,3,2,1,0,943,944,5,11,0,0,944,
	945,5,49,0,0,945,951,1,0,0,0,946,947,3,2,1,0,947,948,5,11,0,0,948,949,5,
	172,0,0,949,951,1,0,0,0,950,940,1,0,0,0,950,942,1,0,0,0,950,946,1,0,0,0,
	951,956,1,0,0,0,952,953,10,1,0,0,953,955,3,2,1,0,954,952,1,0,0,0,955,958,
	1,0,0,0,956,954,1,0,0,0,956,957,1,0,0,0,957,89,1,0,0,0,958,956,1,0,0,0,
	959,960,3,92,46,0,960,961,3,98,49,0,961,962,3,94,47,0,962,969,1,0,0,0,963,
	964,3,92,46,0,964,965,3,96,48,0,965,966,3,466,233,0,966,967,3,102,51,0,
	967,969,1,0,0,0,968,959,1,0,0,0,968,963,1,0,0,0,969,91,1,0,0,0,970,974,
	1,0,0,0,971,974,5,34,0,0,972,974,5,74,0,0,973,970,1,0,0,0,973,971,1,0,0,
	0,973,972,1,0,0,0,974,93,1,0,0,0,975,979,1,0,0,0,976,977,5,83,0,0,977,979,
	3,490,245,0,978,975,1,0,0,0,978,976,1,0,0,0,979,95,1,0,0,0,980,981,7,3,
	0,0,981,97,1,0,0,0,982,983,6,49,-1,0,983,984,3,100,50,0,984,990,1,0,0,0,
	985,986,10,1,0,0,986,987,5,25,0,0,987,989,3,100,50,0,988,985,1,0,0,0,989,
	992,1,0,0,0,990,988,1,0,0,0,990,991,1,0,0,0,991,99,1,0,0,0,992,990,1,0,
	0,0,993,1002,5,10,0,0,994,995,3,466,233,0,995,996,5,7,0,0,996,997,5,10,
	0,0,997,1002,1,0,0,0,998,999,3,466,233,0,999,1000,3,102,51,0,1000,1002,
	1,0,0,0,1001,993,1,0,0,0,1001,994,1,0,0,0,1001,998,1,0,0,0,1002,101,1,0,
	0,0,1003,1006,1,0,0,0,1004,1006,3,104,52,0,1005,1003,1,0,0,0,1005,1004,
	1,0,0,0,1006,103,1,0,0,0,1007,1011,3,106,53,0,1008,1009,5,40,0,0,1009,1011,
	3,106,53,0,1010,1007,1,0,0,0,1010,1008,1,0,0,0,1011,105,1,0,0,0,1012,1013,
	3,2,1,0,1013,107,1,0,0,0,1014,1017,1,0,0,0,1015,1017,3,110,55,0,1016,1014,
	1,0,0,0,1016,1015,1,0,0,0,1017,109,1,0,0,0,1018,1019,5,96,0,0,1019,1020,
	3,112,56,0,1020,111,1,0,0,0,1021,1022,6,56,-1,0,1022,1023,3,114,57,0,1023,
	1033,1,0,0,0,1024,1025,10,2,0,0,1025,1026,5,25,0,0,1026,1032,3,114,57,0,
	1027,1028,10,1,0,0,1028,1029,5,25,0,0,1029,1030,5,247,0,0,1030,1032,3,114,
	57,0,1031,1024,1,0,0,0,1031,1027,1,0,0,0,1032,1035,1,0,0,0,1033,1031,1,
	0,0,0,1033,1034,1,0,0,0,1034,113,1,0,0,0,1035,1033,1,0,0,0,1036,1037,6,
	57,-1,0,1037,1056,3,116,58,0,1038,1039,3,116,58,0,1039,1040,5,185,0,0,1040,
	1041,3,154,77,0,1041,1042,5,122,0,0,1042,1043,3,116,58,0,1043,1044,5,153,
	0,0,1044,1045,3,466,233,0,1045,1056,1,0,0,0,1046,1047,3,116,58,0,1047,1048,
	5,185,0,0,1048,1049,3,154,77,0,1049,1050,5,122,0,0,1050,1051,5,247,0,0,
	1051,1052,3,116,58,0,1052,1053,5,153,0,0,1053,1054,3,466,233,0,1054,1056,
	1,0,0,0,1055,1036,1,0,0,0,1055,1038,1,0,0,0,1055,1046,1,0,0,0,1056,1155,
	1,0,0,0,1057,1058,10,15,0,0,1058,1059,3,152,76,0,1059,1060,5,122,0,0,1060,
	1061,3,116,58,0,1061,1062,3,156,78,0,1062,1154,1,0,0,0,1063,1064,10,14,
	0,0,1064,1065,3,152,76,0,1065,1066,5,122,0,0,1066,1067,5,247,0,0,1067,1068,
	3,116,58,0,1068,1069,3,156,78,0,1069,1154,1,0,0,0,1070,1071,10,13,0,0,1071,
	1072,3,152,76,0,1072,1073,5,122,0,0,1073,1074,3,116,58,0,1074,1075,3,158,
	79,0,1075,1076,5,94,0,0,1076,1077,3,2,1,0,1077,1154,1,0,0,0,1078,1079,10,
	12,0,0,1079,1080,3,152,76,0,1080,1081,5,122,0,0,1081,1082,5,247,0,0,1082,
	1083,3,116,58,0,1083,1084,3,158,79,0,1084,1085,5,94,0,0,1085,1086,3,2,1,
	0,1086,1154,1,0,0,0,1087,1088,10,11,0,0,1088,1089,3,152,76,0,1089,1090,
	5,143,0,0,1090,1091,3,116,58,0,1091,1092,3,156,78,0,1092,1154,1,0,0,0,1093,
	1094,10,10,0,0,1094,1095,3,152,76,0,1095,1096,5,143,0,0,1096,1097,5,247,
	0,0,1097,1098,3,116,58,0,1098,1099,3,156,78,0,1099,1154,1,0,0,0,1100,1101,
	10,9,0,0,1101,1102,3,152,76,0,1102,1103,5,143,0,0,1103,1104,3,116,58,0,
	1104,1105,3,158,79,0,1105,1106,5,94,0,0,1106,1107,3,2,1,0,1107,1154,1,0,
	0,0,1108,1109,10,8,0,0,1109,1110,3,152,76,0,1110,1111,5,143,0,0,1111,1112,
	5,247,0,0,1112,1113,3,116,58,0,1113,1114,3,158,79,0,1114,1115,5,94,0,0,
	1115,1116,3,2,1,0,1116,1154,1,0,0,0,1117,1118,10,7,0,0,1118,1119,3,152,
	76,0,1119,1120,3,118,59,0,1120,1121,3,466,233,0,1121,1122,3,102,51,0,1122,
	1154,1,0,0,0,1123,1124,10,6,0,0,1124,1125,3,152,76,0,1125,1126,5,122,0,
	0,1126,1127,3,116,58,0,1127,1128,5,153,0,0,1128,1129,3,466,233,0,1129,1154,
	1,0,0,0,1130,1131,10,5,0,0,1131,1132,3,152,76,0,1132,1133,5,122,0,0,1133,
	1134,5,247,0,0,1134,1135,3,116,58,0,1135,1136,5,153,0,0,1136,1137,3,466,
	233,0,1137,1154,1,0,0,0,1138,1139,10,4,0,0,1139,1140,3,152,76,0,1140,1141,
	5,143,0,0,1141,1142,3,116,58,0,1142,1143,5,153,0,0,1143,1144,3,466,233,
	0,1144,1154,1,0,0,0,1145,1146,10,3,0,0,1146,1147,3,152,76,0,1147,1148,5,
	143,0,0,1148,1149,5,247,0,0,1149,1150,3,116,58,0,1150,1151,5,153,0,0,1151,
	1152,3,466,233,0,1152,1154,1,0,0,0,1153,1057,1,0,0,0,1153,1063,1,0,0,0,
	1153,1070,1,0,0,0,1153,1078,1,0,0,0,1153,1087,1,0,0,0,1153,1093,1,0,0,0,
	1153,1100,1,0,0,0,1153,1108,1,0,0,0,1153,1117,1,0,0,0,1153,1123,1,0,0,0,
	1153,1130,1,0,0,0,1153,1138,1,0,0,0,1153,1145,1,0,0,0,1154,1157,1,0,0,0,
	1155,1153,1,0,0,0,1155,1156,1,0,0,0,1156,115,1,0,0,0,1157,1155,1,0,0,0,
	1158,1164,3,120,60,0,1159,1160,3,466,233,0,1160,1161,3,102,51,0,1161,1162,
	3,132,66,0,1162,1164,1,0,0,0,1163,1158,1,0,0,0,1163,1159,1,0,0,0,1164,117,
	1,0,0,0,1165,1166,7,4,0,0,1166,119,1,0,0,0,1167,1168,3,122,61,0,1168,1169,
	3,102,51,0,1169,1170,3,132,66,0,1170,121,1,0,0,0,1171,1172,3,124,62,0,1172,
	1173,3,130,65,0,1173,1182,1,0,0,0,1174,1175,3,124,62,0,1175,1176,3,128,
	64,0,1176,1177,5,7,0,0,1177,1178,3,128,64,0,1178,1179,5,7,0,0,1179,1180,
	3,130,65,0,1180,1182,1,0,0,0,1181,1171,1,0,0,0,1181,1174,1,0,0,0,1182,123,
	1,0,0,0,1183,1187,3,126,63,0,1184,1185,5,202,0,0,1185,1187,5,26,0,0,1186,
	1183,1,0,0,0,1186,1184,1,0,0,0,1187,125,1,0,0,0,1188,1189,5,32,0,0,1189,
	1190,5,26,0,0,1190,127,1,0,0,0,1191,1192,3,2,1,0,1192,129,1,0,0,0,1193,
	1196,3,2,1,0,1194,1196,3,24,12,0,1195,1193,1,0,0,0,1195,1194,1,0,0,0,1196,
	131,1,0,0,0,1197,1201,1,0,0,0,1198,1199,5,220,0,0,1199,1201,3,134,67,0,
	1200,1197,1,0,0,0,1200,1198,1,0,0,0,1201,133,1,0,0,0,1202,1218,3,136,68,
	0,1203,1218,3,138,69,0,1204,1218,3,140,70,0,1205,1206,3,138,69,0,1206,1207,
	3,140,70,0,1207,1218,1,0,0,0,1208,1209,3,140,70,0,1209,1210,3,138,69,0,
	1210,1218,1,0,0,0,1211,1212,3,136,68,0,1212,1213,3,140,70,0,1213,1218,1,
	0,0,0,1214,1215,3,140,70,0,1215,1216,3,136,68,0,1216,1218,1,0,0,0,1217,
	1202,1,0,0,0,1217,1203,1,0,0,0,1217,1204,1,0,0,0,1217,1205,1,0,0,0,1217,
	1208,1,0,0,0,1217,1211,1,0,0,0,1217,1214,1,0,0,0,1218,135,1,0,0,0,1219,
	1220,3,142,71,0,1220,1221,5,124,0,0,1221,1222,3,466,233,0,1222,1229,1,0,
	0,0,1223,1224,3,142,71,0,1224,1225,5,124,0,0,1225,1226,5,223,0,0,1226,1227,
	3,466,233,0,1227,1229,1,0,0,0,1228,1219,1,0,0,0,1228,1223,1,0,0,0,1229,
	137,1,0,0,0,1230,1231,5,112,0,0,1231,1232,5,21,0,0,1232,1233,3,144,72,0,
	1233,1234,5,22,0,0,1234,139,1,0,0,0,1235,1236,5,104,0,0,1236,1237,5,21,
	0,0,1237,1238,3,148,74,0,1238,1239,5,22,0,0,1239,1242,1,0,0,0,1240,1242,
	5,144,0,0,1241,1235,1,0,0,0,1241,1240,1,0,0,0,1242,141,1,0,0,0,1243,1246,
	1,0,0,0,1244,1246,5,168,0,0,1245,1243,1,0,0,0,1245,1244,1,0,0,0,1246,143,
	1,0,0,0,1247,1248,6,72,-1,0,1248,1249,3,146,73,0,1249,1255,1,0,0,0,1250,
	1251,10,1,0,0,1251,1252,5,25,0,0,1252,1254,3,146,73,0,1253,1250,1,0,0,0,
	1254,1257,1,0,0,0,1255,1253,1,0,0,0,1255,1256,1,0,0,0,1256,145,1,0,0,0,
	1257,1255,1,0,0,0,1258,1259,3,386,193,0,1259,1260,3,398,199,0,1260,147,
	1,0,0,0,1261,1262,7,5,0,0,1262,149,1,0,0,0,1263,1264,3,132,66,0,1264,151,
	1,0,0,0,1265,1270,1,0,0,0,1266,1270,5,115,0,0,1267,1268,5,129,0,0,1268,
	1270,3,154,77,0,1269,1265,1,0,0,0,1269,1266,1,0,0,0,1269,1267,1,0,0,0,1270,
	153,1,0,0,0,1271,1274,1,0,0,0,1272,1274,5,159,0,0,1273,1271,1,0,0,0,1273,
	1272,1,0,0,0,1274,155,1,0,0,0,1275,1276,5,153,0,0,1276,1277,3,142,71,0,
	1277,1278,5,124,0,0,1278,1279,3,466,233,0,1279,1287,1,0,0,0,1280,1281,5,
	153,0,0,1281,1282,3,142,71,0,1282,1283,5,124,0,0,1283,1284,5,223,0,0,1284,
	1285,3,466,233,0,1285,1287,1,0,0,0,1286,1275,1,0,0,0,1286,1280,1,0,0,0,
	1287,157,1,0,0,0,1288,1289,5,153,0,0,1289,1290,3,142,71,0,1290,1291,5,123,
	0,0,1291,1292,3,466,233,0,1292,1300,1,0,0,0,1293,1294,5,153,0,0,1294,1295,
	3,142,71,0,1295,1296,5,123,0,0,1296,1297,5,223,0,0,1297,1298,3,466,233,
	0,1298,1300,1,0,0,0,1299,1288,1,0,0,0,1299,1293,1,0,0,0,1300,159,1,0,0,
	0,1301,1304,1,0,0,0,1302,1304,3,162,81,0,1303,1301,1,0,0,0,1303,1302,1,
	0,0,0,1304,161,1,0,0,0,1305,1306,5,130,0,0,1306,1307,3,164,82,0,1307,163,
	1,0,0,0,1308,1309,6,82,-1,0,1309,1310,3,166,83,0,1310,1316,1,0,0,0,1311,
	1312,10,1,0,0,1312,1313,5,25,0,0,1313,1315,3,166,83,0,1314,1311,1,0,0,0,
	1315,1318,1,0,0,0,1316,1314,1,0,0,0,1316,1317,1,0,0,0,1317,165,1,0,0,0,
	1318,1316,1,0,0,0,1319,1320,3,106,53,0,1320,1321,5,14,0,0,1321,1322,3,466,
	233,0,1322,167,1,0,0,0,1323,1324,5,233,0,0,1324,1329,3,170,85,0,1325,1326,
	5,233,0,0,1326,1327,5,248,0,0,1327,1329,3,170,85,0,1328,1323,1,0,0,0,1328,
	1325,1,0,0,0,1329,169,1,0,0,0,1330,1331,6,85,-1,0,1331,1332,3,172,86,0,
	1332,1338,1,0,0,0,1333,1334,10,1,0,0,1334,1335,5,25,0,0,1335,1337,3,172,
	86,0,1336,1333,1,0,0,0,1337,1340,1,0,0,0,1338,1336,1,0,0,0,1338,1339,1,
	0,0,0,1339,171,1,0,0,0,1340,1338,1,0,0,0,1341,1342,3,106,53,0,1342,1343,
	5,40,0,0,1343,1344,3,522,261,0,1344,1345,3,176,88,0,1345,1346,3,174,87,
	0,1346,173,1,0,0,0,1347,1351,1,0,0,0,1348,1349,5,155,0,0,1349,1351,3,478,
	239,0,1350,1347,1,0,0,0,1350,1348,1,0,0,0,1351,175,1,0,0,0,1352,1358,1,
	0,0,0,1353,1354,5,249,0,0,1354,1355,3,490,245,0,1355,1356,5,250,0,0,1356,
	1358,1,0,0,0,1357,1352,1,0,0,0,1357,1353,1,0,0,0,1358,177,1,0,0,0,1359,
	1362,1,0,0,0,1360,1362,3,180,90,0,1361,1359,1,0,0,0,1361,1360,1,0,0,0,1362,
	179,1,0,0,0,1363,1364,5,230,0,0,1364,1365,3,466,233,0,1365,181,1,0,0,0,
	1366,1369,1,0,0,0,1367,1369,3,184,92,0,1368,1366,1,0,0,0,1368,1367,1,0,
	0,0,1369,183,1,0,0,0,1370,1371,5,101,0,0,1371,1372,5,50,0,0,1372,1373,3,
	186,93,0,1373,1374,3,198,99,0,1374,1375,3,190,95,0,1375,1376,3,194,97,0,
	1376,1379,1,0,0,0,1377,1379,3,192,96,0,1378,1370,1,0,0,0,1378,1377,1,0,
	0,0,1379,185,1,0,0,0,1380,1381,6,93,-1,0,1381,1382,3,188,94,0,1382,1388,
	1,0,0,0,1383,1384,10,1,0,0,1384,1385,5,25,0,0,1385,1387,3,188,94,0,1386,
	1383,1,0,0,0,1387,1390,1,0,0,0,1388,1386,1,0,0,0,1388,1389,1,0,0,0,1389,
	187,1,0,0,0,1390,1388,1,0,0,0,1391,1392,3,466,233,0,1392,1393,3,102,51,
	0,1393,189,1,0,0,0,1394,1397,1,0,0,0,1395,1397,3,192,96,0,1396,1394,1,0,
	0,0,1396,1395,1,0,0,0,1397,191,1,0,0,0,1398,1399,5,131,0,0,1399,1400,3,
	164,82,0,1400,193,1,0,0,0,1401,1404,1,0,0,0,1402,1404,3,196,98,0,1403,1401,
	1,0,0,0,1403,1402,1,0,0,0,1404,195,1,0,0,0,1405,1406,5,105,0,0,1406,1407,
	3,466,233,0,1407,197,1,0,0,0,1408,1413,1,0,0,0,1409,1410,5,101,0,0,1410,
	1411,5,40,0,0,1411,1413,3,2,1,0,1412,1408,1,0,0,0,1412,1409,1,0,0,0,1413,
	199,1,0,0,0,1414,1417,1,0,0,0,1415,1417,3,202,101,0,1416,1414,1,0,0,0,1416,
	1415,1,0,0,0,1417,201,1,0,0,0,1418,1419,5,157,0,0,1419,1420,5,50,0,0,1420,
	1421,3,204,102,0,1421,203,1,0,0,0,1422,1423,6,102,-1,0,1423,1424,3,206,
	103,0,1424,1430,1,0,0,0,1425,1426,10,1,0,0,1426,1427,5,25,0,0,1427,1429,
	3,206,103,0,1428,1425,1,0,0,0,1429,1432,1,0,0,0,1430,1428,1,0,0,0,1430,
	1431,1,0,0,0,1431,205,1,0,0,0,1432,1430,1,0,0,0,1433,1434,3,466,233,0,1434,
	1435,3,208,104,0,1435,1436,3,212,106,0,1436,207,1,0,0,0,1437,1440,1,0,0,
	0,1438,1440,3,210,105,0,1439,1437,1,0,0,0,1439,1438,1,0,0,0,1440,209,1,
	0,0,0,1441,1445,3,492,246,0,1442,1445,5,41,0,0,1443,1445,5,72,0,0,1444,
	1441,1,0,0,0,1444,1442,1,0,0,0,1444,1443,1,0,0,0,1445,211,1,0,0,0,1446,
	1454,1,0,0,0,1447,1448,5,149,0,0,1448,1454,5,90,0,0,1449,1450,5,149,0,0,
	1450,1454,5,128,0,0,1451,1452,5,149,0,0,1452,1454,3,492,246,0,1453,1446,
	1,0,0,0,1453,1447,1,0,0,0,1453,1449,1,0,0,0,1453,1451,1,0,0,0,1454,213,
	1,0,0,0,1455,1456,7,6,0,0,1456,215,1,0,0,0,1457,1460,1,0,0,0,1458,1460,
	3,218,109,0,1459,1457,1,0,0,0,1459,1458,1,0,0,0,1460,217,1,0,0,0,1461,1462,
	5,134,0,0,1462,1463,3,466,233,0,1463,219,1,0,0,0,1464,1467,1,0,0,0,1465,
	1467,3,222,111,0,1466,1464,1,0,0,0,1466,1465,1,0,0,0,1467,221,1,0,0,0,1468,
	1469,5,152,0,0,1469,1470,3,466,233,0,1470,223,1,0,0,0,1471,1472,5,116,0,
	0,1472,1473,5,118,0,0,1473,1474,3,228,114,0,1474,1475,3,230,115,0,1475,
	1476,3,234,117,0,1476,1477,3,244,122,0,1477,1488,1,0,0,0,1478,1479,5,116,
	0,0,1479,1480,5,118,0,0,1480,1481,3,228,114,0,1481,1482,5,21,0,0,1482,1483,
	3,256,128,0,1483,1484,5,22,0,0,1484,1485,3,64,32,0,1485,1486,3,244,122,
	0,1486,1488,1,0,0,0,1487,1471,1,0,0,0,1487,1478,1,0,0,0,1488,225,1,0,0,
	0,1489,1490,3,130,65,0,1490,1491,3,102,51,0,1491,1508,1,0,0,0,1492,1493,
	3,128,64,0,1493,1494,5,7,0,0,1494,1495,3,128,64,0,1495,1496,3,102,51,0,
	1496,1508,1,0,0,0,1497,1498,3,122,61,0,1498,1499,3,102,51,0,1499,1508,1,
	0,0,0,1500,1501,3,128,64,0,1501,1502,5,7,0,0,1502,1503,3,128,64,0,1503,
	1504,5,7,0,0,1504,1505,3,130,65,0,1505,1506,3,102,51,0,1506,1508,1,0,0,
	0,1507,1489,1,0,0,0,1507,1492,1,0,0,0,1507,1497,1,0,0,0,1507,1500,1,0,0,
	0,1508,227,1,0,0,0,1509,1514,3,226,113,0,1510,1511,3,492,246,0,1511,1512,
	3,102,51,0,1512,1514,1,0,0,0,1513,1509,1,0,0,0,1513,1510,1,0,0,0,1514,229,
	1,0,0,0,1515,1533,1,0,0,0,1516,1517,5,21,0,0,1517,1518,3,142,71,0,1518,
	1519,5,123,0,0,1519,1520,5,25,0,0,1520,1521,5,224,0,0,1521,1522,5,22,0,
	0,1522,1533,1,0,0,0,1523,1524,5,21,0,0,1524,1525,3,142,71,0,1525,1526,5,
	123,0,0,1526,1527,5,25,0,0,1527,1528,5,224,0,0,1528,1529,5,25,0,0,1529,
	1530,5,155,0,0,1530,1531,5,22,0,0,1531,1533,1,0,0,0,1532,1515,1,0,0,0,1532,
	1516,1,0,0,0,1532,1523,1,0,0,0,1533,231,1,0,0,0,1534,1535,3,142,71,0,1535,
	1536,5,123,0,0,1536,233,1,0,0,0,1537,1538,6,117,-1,0,1538,1539,3,236,118,
	0,1539,1545,1,0,0,0,1540,1541,10,1,0,0,1541,1542,5,25,0,0,1542,1544,3,238,
	119,0,1543,1540,1,0,0,0,1544,1547,1,0,0,0,1545,1543,1,0,0,0,1545,1546,1,
	0,0,0,1546,235,1,0,0,0,1547,1545,1,0,0,0,1548,1549,5,226,0,0,1549,1553,
	3,240,120,0,1550,1551,5,226,0,0,1551,1553,3,242,121,0,1552,1548,1,0,0,0,
	1552,1550,1,0,0,0,1553,237,1,0,0,0,1554,1558,3,236,118,0,1555,1558,3,240,
	120,0,1556,1558,3,242,121,0,1557,1554,1,0,0,0,1557,1555,1,0,0,0,1557,1556,
	1,0,0,0,1558,239,1,0,0,0,1559,1560,5,21,0,0,1560,1561,3,466,233,0,1561,
	1562,5,25,0,0,1562,1563,3,466,233,0,1563,1564,5,22,0,0,1564,241,1,0,0,0,
	1565,1566,5,21,0,0,1566,1567,3,466,233,0,1567,1568,5,25,0,0,1568,1569,3,
	466,233,0,1569,1570,5,25,0,0,1570,1571,3,466,233,0,1571,1572,5,22,0,0,1572,
	243,1,0,0,0,1573,1576,1,0,0,0,1574,1576,3,246,123,0,1575,1573,1,0,0,0,1575,
	1574,1,0,0,0,1576,245,1,0,0,0,1577,1578,5,183,0,0,1578,1579,3,248,124,0,
	1579,247,1,0,0,0,1580,1585,3,98,49,0,1581,1582,3,96,48,0,1582,1583,3,466,
	233,0,1583,1585,1,0,0,0,1584,1580,1,0,0,0,1584,1581,1,0,0,0,1585,249,1,
	0,0,0,1586,1587,3,232,116,0,1587,1588,3,466,233,0,1588,251,1,0,0,0,1589,
	1590,5,224,0,0,1590,1591,3,466,233,0,1591,253,1,0,0,0,1592,1593,5,155,0,
	0,1593,1594,3,466,233,0,1594,255,1,0,0,0,1595,1611,3,250,125,0,1596,1597,
	3,250,125,0,1597,1598,5,25,0,0,1598,1599,3,252,126,0,1599,1611,1,0,0,0,
	1600,1601,3,250,125,0,1601,1602,5,25,0,0,1602,1603,3,252,126,0,1603,1604,
	5,25,0,0,1604,1605,3,254,127,0,1605,1611,1,0,0,0,1606,1607,3,250,125,0,
	1607,1608,5,25,0,0,1608,1609,3,254,127,0,1609,1611,1,0,0,0,1610,1595,1,
	0,0,0,1610,1596,1,0,0,0,1610,1600,1,0,0,0,1610,1606,1,0,0,0,1611,257,1,
	0,0,0,1612,1613,5,219,0,0,1613,1614,5,118,0,0,1614,1615,3,228,114,0,1615,
	1616,3,230,115,0,1616,1617,3,234,117,0,1617,1618,3,244,122,0,1618,1629,
	1,0,0,0,1619,1620,5,219,0,0,1620,1621,5,118,0,0,1621,1622,3,228,114,0,1622,
	1623,5,21,0,0,1623,1624,3,256,128,0,1624,1625,5,22,0,0,1625,1626,3,64,32,
	0,1626,1627,3,244,122,0,1627,1629,1,0,0,0,1628,1612,1,0,0,0,1628,1619,1,
	0,0,0,1629,259,1,0,0,0,1630,1631,5,70,0,0,1631,1632,3,78,39,0,1632,1633,
	5,96,0,0,1633,1634,3,228,114,0,1634,1635,3,150,75,0,1635,1636,3,160,80,
	0,1636,1637,3,178,89,0,1637,1638,3,218,109,0,1638,1639,3,220,110,0,1639,
	1640,3,244,122,0,1640,1662,1,0,0,0,1641,1642,5,70,0,0,1642,1643,3,78,39,
	0,1643,1644,5,96,0,0,1644,1645,3,228,114,0,1645,1646,3,150,75,0,1646,1647,
	3,160,80,0,1647,1648,3,178,89,0,1648,1649,3,222,111,0,1649,1650,3,216,108,
	0,1650,1651,3,244,122,0,1651,1662,1,0,0,0,1652,1653,5,70,0,0,1653,1654,
	3,78,39,0,1654,1655,5,96,0,0,1655,1656,3,228,114,0,1656,1657,3,150,75,0,
	1657,1658,3,160,80,0,1658,1659,3,178,89,0,1659,1660,3,244,122,0,1660,1662,
	1,0,0,0,1661,1630,1,0,0,0,1661,1641,1,0,0,0,1661,1652,1,0,0,0,1662,261,
	1,0,0,0,1663,1664,5,218,0,0,1664,1665,3,78,39,0,1665,1666,3,228,114,0,1666,
	1667,3,150,75,0,1667,1668,3,160,80,0,1668,1669,3,264,132,0,1669,1670,3,
	286,143,0,1670,1671,3,178,89,0,1671,1672,3,216,108,0,1672,1673,3,244,122,
	0,1673,1695,1,0,0,0,1674,1675,5,218,0,0,1675,1676,3,78,39,0,1676,1677,3,
	228,114,0,1677,1678,3,150,75,0,1678,1679,3,160,80,0,1679,1680,3,264,132,
	0,1680,1681,3,178,89,0,1681,1682,3,216,108,0,1682,1683,3,244,122,0,1683,
	1695,1,0,0,0,1684,1685,5,218,0,0,1685,1686,3,78,39,0,1686,1687,3,228,114,
	0,1687,1688,3,150,75,0,1688,1689,3,160,80,0,1689,1690,3,286,143,0,1690,
	1691,3,178,89,0,1691,1692,3,216,108,0,1692,1693,3,244,122,0,1693,1695,1,
	0,0,0,1694,1663,1,0,0,0,1694,1674,1,0,0,0,1694,1684,1,0,0,0,1695,263,1,
	0,0,0,1696,1697,5,196,0,0,1697,1698,3,266,133,0,1698,265,1,0,0,0,1699,1700,
	6,133,-1,0,1700,1701,3,268,134,0,1701,1707,1,0,0,0,1702,1703,10,1,0,0,1703,
	1704,5,25,0,0,1704,1706,3,268,134,0,1705,1702,1,0,0,0,1706,1709,1,0,0,0,
	1707,1705,1,0,0,0,1707,1708,1,0,0,0,1708,267,1,0,0,0,1709,1707,1,0,0,0,
	1710,1711,3,460,230,0,1711,1712,5,14,0,0,1712,1713,3,466,233,0,1713,1714,
	3,272,136,0,1714,1722,1,0,0,0,1715,1716,3,270,135,0,1716,1717,5,7,0,0,1717,
	1718,3,460,230,0,1718,1719,5,14,0,0,1719,1720,3,466,233,0,1720,1722,1,0,
	0,0,1721,1710,1,0,0,0,1721,1715,1,0,0,0,1722,269,1,0,0,0,1723,1724,3,508,
	254,0,1724,1725,5,21,0,0,1725,1726,3,488,244,0,1726,1727,5,22,0,0,1727,
	271,1,0,0,0,1728,1731,1,0,0,0,1729,1731,3,274,137,0,1730,1728,1,0,0,0,1730,
	1729,1,0,0,0,1731,273,1,0,0,0,1732,1733,3,276,138,0,1733,1734,3,284,142,
	0,1734,1735,5,80,0,0,1735,275,1,0,0,0,1736,1737,6,138,-1,0,1737,1738,5,
	94,0,0,1738,1739,3,278,139,0,1739,1745,1,0,0,0,1740,1741,10,1,0,0,1741,
	1742,5,94,0,0,1742,1744,3,278,139,0,1743,1740,1,0,0,0,1744,1747,1,0,0,0,
	1745,1743,1,0,0,0,1745,1746,1,0,0,0,1746,277,1,0,0,0,1747,1745,1,0,0,0,
	1748,1749,6,139,-1,0,1749,1750,3,280,140,0,1750,1756,1,0,0,0,1751,1752,
	10,1,0,0,1752,1753,5,25,0,0,1753,1755,3,280,140,0,1754,1751,1,0,0,0,1755,
	1758,1,0,0,0,1756,1754,1,0,0,0,1756,1757,1,0,0,0,1757,279,1,0,0,0,1758,
	1756,1,0,0,0,1759,1760,3,282,141,0,1760,1761,5,109,0,0,1761,1762,3,466,
	233,0,1762,1780,1,0,0,0,1763,1764,3,282,141,0,1764,1765,5,234,0,0,1765,
	1766,3,466,233,0,1766,1780,1,0,0,0,1767,1768,3,282,141,0,1768,1769,5,26,
	0,0,1769,1770,3,282,141,0,1770,1771,5,109,0,0,1771,1772,3,466,233,0,1772,
	1780,1,0,0,0,1773,1774,3,282,141,0,1774,1775,5,26,0,0,1775,1776,3,282,141,
	0,1776,1777,5,234,0,0,1777,1778,3,466,233,0,1778,1780,1,0,0,0,1779,1759,
	1,0,0,0,1779,1763,1,0,0,0,1779,1767,1,0,0,0,1779,1773,1,0,0,0,1780,281,
	1,0,0,0,1781,1782,3,2,1,0,1782,283,1,0,0,0,1783,1787,1,0,0,0,1784,1785,
	5,229,0,0,1785,1787,3,466,233,0,1786,1783,1,0,0,0,1786,1784,1,0,0,0,1787,
	285,1,0,0,0,1788,1789,5,217,0,0,1789,1790,3,288,144,0,1790,287,1,0,0,0,
	1791,1792,6,144,-1,0,1792,1793,3,290,145,0,1793,1799,1,0,0,0,1794,1795,
	10,1,0,0,1795,1796,5,25,0,0,1796,1798,3,290,145,0,1797,1794,1,0,0,0,1798,
	1801,1,0,0,0,1799,1797,1,0,0,0,1799,1800,1,0,0,0,1800,289,1,0,0,0,1801,
	1799,1,0,0,0,1802,1803,3,460,230,0,1803,1804,3,272,136,0,1804,291,1,0,0,
	0,1805,1806,5,140,0,0,1806,1807,3,78,39,0,1807,1808,5,118,0,0,1808,1809,
	3,226,113,0,1809,1810,3,294,147,0,1810,1811,5,222,0,0,1811,1812,3,116,58,
	0,1812,1813,5,153,0,0,1813,1814,3,296,148,0,1814,1815,3,466,233,0,1815,
	1816,3,160,80,0,1816,1817,3,298,149,0,1817,1818,3,216,108,0,1818,1819,3,
	244,122,0,1819,293,1,0,0,0,1820,1821,3,132,66,0,1821,295,1,0,0,0,1822,1825,
	1,0,0,0,1823,1825,3,232,116,0,1824,1822,1,0,0,0,1824,1823,1,0,0,0,1825,
	297,1,0,0,0,1826,1848,1,0,0,0,1827,1828,5,229,0,0,1828,1829,5,138,0,0,1829,
	1830,5,203,0,0,1830,1831,5,218,0,0,1831,1832,3,304,152,0,1832,1833,3,300,
	150,0,1833,1848,1,0,0,0,1834,1835,5,229,0,0,1835,1836,5,138,0,0,1836,1837,
	5,203,0,0,1837,1838,5,70,0,0,1838,1839,3,306,153,0,1839,1840,3,302,151,
	0,1840,1848,1,0,0,0,1841,1842,5,229,0,0,1842,1843,5,146,0,0,1843,1844,5,
	138,0,0,1844,1845,5,203,0,0,1845,1846,5,116,0,0,1846,1848,3,308,154,0,1847,
	1826,1,0,0,0,1847,1827,1,0,0,0,1847,1834,1,0,0,0,1847,1841,1,0,0,0,1848,
	299,1,0,0,0,1849,1864,1,0,0,0,1850,1851,5,229,0,0,1851,1852,5,138,0,0,1852,
	1853,5,203,0,0,1853,1854,5,70,0,0,1854,1855,3,306,153,0,1855,1856,3,302,
	151,0,1856,1864,1,0,0,0,1857,1858,5,229,0,0,1858,1859,5,146,0,0,1859,1860,
	5,138,0,0,1860,1861,5,203,0,0,1861,1862,5,116,0,0,1862,1864,3,308,154,0,
	1863,1849,1,0,0,0,1863,1850,1,0,0,0,1863,1857,1,0,0,0,1864,301,1,0,0,0,
	1865,1873,1,0,0,0,1866,1867,5,229,0,0,1867,1868,5,146,0,0,1868,1869,5,138,
	0,0,1869,1870,5,203,0,0,1870,1871,5,116,0,0,1871,1873,3,308,154,0,1872,
	1865,1,0,0,0,1872,1866,1,0,0,0,1873,303,1,0,0,0,1874,1875,3,264,132,0,1875,
	1876,3,178,89,0,1876,1885,1,0,0,0,1877,1878,3,264,132,0,1878,1879,3,286,
	143,0,1879,1880,3,178,89,0,1880,1885,1,0,0,0,1881,1882,3,286,143,0,1882,
	1883,3,178,89,0,1883,1885,1,0,0,0,1884,1874,1,0,0,0,1884,1877,1,0,0,0,1884,
	1881,1,0,0,0,1885,305,1,0,0,0,1886,1887,3,178,89,0,1887,307,1,0,0,0,1888,
	1889,3,466,233,0,1889,1890,3,178,89,0,1890,1903,1,0,0,0,1891,1892,3,240,
	120,0,1892,1893,3,178,89,0,1893,1903,1,0,0,0,1894,1895,3,242,121,0,1895,
	1896,3,178,89,0,1896,1903,1,0,0,0,1897,1898,5,21,0,0,1898,1899,3,256,128,
	0,1899,1900,5,22,0,0,1900,1901,3,178,89,0,1901,1903,1,0,0,0,1902,1888,1,
	0,0,0,1902,1891,1,0,0,0,1902,1894,1,0,0,0,1902,1897,1,0,0,0,1903,309,1,
	0,0,0,1904,1905,5,63,0,0,1905,1906,5,221,0,0,1906,1907,3,356,178,0,1907,
	1908,3,316,158,0,1908,311,1,0,0,0,1909,1910,5,35,0,0,1910,1911,5,221,0,
	0,1911,1912,3,356,178,0,1912,1913,3,316,158,0,1913,313,1,0,0,0,1914,1915,
	5,76,0,0,1915,1916,5,221,0,0,1916,1917,3,356,178,0,1917,315,1,0,0,0,1918,
	1923,6,158,-1,0,1919,1920,10,1,0,0,1920,1922,3,320,160,0,1921,1919,1,0,
	0,0,1922,1925,1,0,0,0,1923,1921,1,0,0,0,1923,1924,1,0,0,0,1924,317,1,0,
	0,0,1925,1923,1,0,0,0,1926,1929,3,492,246,0,1927,1929,5,1,0,0,1928,1926,
	1,0,0,0,1928,1927,1,0,0,0,1929,319,1,0,0,0,1930,1931,5,163,0,0,1931,1941,
	3,318,159,0,1932,1933,5,233,0,0,1933,1941,5,1,0,0,1934,1935,5,102,0,0,1935,
	1941,3,322,161,0,1936,1937,5,101,0,0,1937,1941,3,2,1,0,1938,1939,5,145,
	0,0,1939,1941,5,102,0,0,1940,1930,1,0,0,0,1940,1932,1,0,0,0,1940,1934,1,
	0,0,0,1940,1936,1,0,0,0,1940,1938,1,0,0,0,1941,321,1,0,0,0,1942,1943,6,
	161,-1,0,1943,1944,3,2,1,0,1944,1950,1,0,0,0,1945,1946,10,1,0,0,1946,1947,
	5,25,0,0,1947,1949,3,2,1,0,1948,1945,1,0,0,0,1949,1952,1,0,0,0,1950,1948,
	1,0,0,0,1950,1951,1,0,0,0,1951,323,1,0,0,0,1952,1950,1,0,0,0,1953,1954,
	5,63,0,0,1954,1955,5,101,0,0,1955,1956,3,330,165,0,1956,1957,3,332,166,
	0,1957,325,1,0,0,0,1958,1959,5,35,0,0,1959,1960,5,101,0,0,1960,1961,3,330,
	165,0,1961,1962,3,332,166,0,1962,327,1,0,0,0,1963,1964,5,76,0,0,1964,1965,
	5,101,0,0,1965,1966,3,330,165,0,1966,329,1,0,0,0,1967,1968,3,2,1,0,1968,
	331,1,0,0,0,1969,1974,6,166,-1,0,1970,1971,10,1,0,0,1971,1973,3,334,167,
	0,1972,1970,1,0,0,0,1973,1976,1,0,0,0,1974,1972,1,0,0,0,1974,1975,1,0,0,
	0,1975,333,1,0,0,0,1976,1974,1,0,0,0,1977,1978,5,233,0,0,1978,1986,5,1,
	0,0,1979,1980,5,251,0,0,1980,1986,3,336,168,0,1981,1982,5,145,0,0,1982,
	1986,5,251,0,0,1983,1984,5,186,0,0,1984,1986,3,338,169,0,1985,1977,1,0,
	0,0,1985,1979,1,0,0,0,1985,1981,1,0,0,0,1985,1983,1,0,0,0,1986,335,1,0,
	0,0,1987,1988,6,168,-1,0,1988,1989,3,338,169,0,1989,1995,1,0,0,0,1990,1991,
	10,1,0,0,1991,1992,5,25,0,0,1992,1994,3,338,169,0,1993,1990,1,0,0,0,1994,
	1997,1,0,0,0,1995,1993,1,0,0,0,1995,1996,1,0,0,0,1996,337,1,0,0,0,1997,
	1995,1,0,0,0,1998,2004,3,348,174,0,1999,2000,3,348,174,0,2000,2001,5,153,
	0,0,2001,2002,3,352,176,0,2002,2004,1,0,0,0,2003,1998,1,0,0,0,2003,1999,
	1,0,0,0,2004,339,1,0,0,0,2005,2006,7,7,0,0,2006,341,1,0,0,0,2007,2008,7,
	8,0,0,2008,343,1,0,0,0,2009,2010,5,100,0,0,2010,2011,3,346,173,0,2011,2012,
	5,205,0,0,2012,2013,3,354,177,0,2013,2050,1,0,0,0,2014,2015,5,100,0,0,2015,
	2016,3,346,173,0,2016,2017,5,153,0,0,2017,2018,3,350,175,0,2018,2019,5,
	205,0,0,2019,2020,3,354,177,0,2020,2050,1,0,0,0,2021,2022,5,100,0,0,2022,
	2023,3,346,173,0,2023,2024,5,205,0,0,2024,2025,3,342,171,0,2025,2026,3,
	354,177,0,2026,2050,1,0,0,0,2027,2028,5,100,0,0,2028,2029,3,346,173,0,2029,
	2030,5,153,0,0,2030,2031,3,350,175,0,2031,2032,5,205,0,0,2032,2033,3,342,
	171,0,2033,2034,3,354,177,0,2034,2050,1,0,0,0,2035,2036,5,100,0,0,2036,
	2037,3,346,173,0,2037,2038,5,205,0,0,2038,2039,3,340,170,0,2039,2040,3,
	322,161,0,2040,2050,1,0,0,0,2041,2042,5,100,0,0,2042,2043,3,346,173,0,2043,
	2044,5,153,0,0,2044,2045,3,350,175,0,2045,2046,5,205,0,0,2046,2047,3,340,
	170,0,2047,2048,3,322,161,0,2048,2050,1,0,0,0,2049,2009,1,0,0,0,2049,2014,
	1,0,0,0,2049,2021,1,0,0,0,2049,2027,1,0,0,0,2049,2035,1,0,0,0,2049,2041,
	1,0,0,0,2050,345,1,0,0,0,2051,2052,6,173,-1,0,2052,2053,3,348,174,0,2053,
	2059,1,0,0,0,2054,2055,10,1,0,0,2055,2056,5,25,0,0,2056,2058,3,348,174,
	0,2057,2054,1,0,0,0,2058,2061,1,0,0,0,2059,2057,1,0,0,0,2059,2060,1,0,0,
	0,2060,347,1,0,0,0,2061,2059,1,0,0,0,2062,2068,3,2,1,0,2063,2068,5,194,
	0,0,2064,2068,5,116,0,0,2065,2068,5,218,0,0,2066,2068,5,70,0,0,2067,2062,
	1,0,0,0,2067,2063,1,0,0,0,2067,2064,1,0,0,0,2067,2065,1,0,0,0,2067,2066,
	1,0,0,0,2068,349,1,0,0,0,2069,2070,6,175,-1,0,2070,2071,3,352,176,0,2071,
	2077,1,0,0,0,2072,2073,10,1,0,0,2073,2074,5,25,0,0,2074,2076,3,352,176,
	0,2075,2072,1,0,0,0,2076,2079,1,0,0,0,2077,2075,1,0,0,0,2077,2078,1,0,0,
	0,2078,351,1,0,0,0,2079,2077,1,0,0,0,2080,2107,3,130,65,0,2081,2082,3,128,
	64,0,2082,2083,5,7,0,0,2083,2084,3,128,64,0,2084,2107,1,0,0,0,2085,2086,
	3,126,63,0,2086,2087,3,130,65,0,2087,2107,1,0,0,0,2088,2089,3,126,63,0,
	2089,2090,3,128,64,0,2090,2091,5,7,0,0,2091,2092,3,128,64,0,2092,2093,5,
	7,0,0,2093,2094,3,130,65,0,2094,2107,1,0,0,0,2095,2096,3,128,64,0,2096,
	2097,5,7,0,0,2097,2098,3,128,64,0,2098,2099,5,7,0,0,2099,2100,3,130,65,
	0,2100,2107,1,0,0,0,2101,2102,3,126,63,0,2102,2103,3,128,64,0,2103,2104,
	5,7,0,0,2104,2105,3,128,64,0,2105,2107,1,0,0,0,2106,2080,1,0,0,0,2106,2081,
	1,0,0,0,2106,2085,1,0,0,0,2106,2088,1,0,0,0,2106,2095,1,0,0,0,2106,2101,
	1,0,0,0,2107,353,1,0,0,0,2108,2109,6,177,-1,0,2109,2110,3,356,178,0,2110,
	2116,1,0,0,0,2111,2112,10,1,0,0,2112,2113,5,25,0,0,2113,2115,3,356,178,
	0,2114,2111,1,0,0,0,2115,2118,1,0,0,0,2116,2114,1,0,0,0,2116,2117,1,0,0,
	0,2117,355,1,0,0,0,2118,2116,1,0,0,0,2119,2125,3,2,1,0,2120,2121,3,2,1,
	0,2121,2122,5,26,0,0,2122,2123,3,2,1,0,2123,2125,1,0,0,0,2124,2119,1,0,
	0,0,2124,2120,1,0,0,0,2125,357,1,0,0,0,2126,2127,5,184,0,0,2127,2128,3,
	346,173,0,2128,2129,5,96,0,0,2129,2130,3,354,177,0,2130,2167,1,0,0,0,2131,
	2132,5,184,0,0,2132,2133,3,346,173,0,2133,2134,5,153,0,0,2134,2135,3,350,
	175,0,2135,2136,5,96,0,0,2136,2137,3,354,177,0,2137,2167,1,0,0,0,2138,2139,
	5,184,0,0,2139,2140,3,346,173,0,2140,2141,5,96,0,0,2141,2142,3,342,171,
	0,2142,2143,3,354,177,0,2143,2167,1,0,0,0,2144,2145,5,184,0,0,2145,2146,
	3,346,173,0,2146,2147,5,153,0,0,2147,2148,3,350,175,0,2148,2149,5,96,0,
	0,2149,2150,3,342,171,0,2150,2151,3,354,177,0,2151,2167,1,0,0,0,2152,2153,
	5,184,0,0,2153,2154,3,346,173,0,2154,2155,5,96,0,0,2155,2156,3,340,170,
	0,2156,2157,3,322,161,0,2157,2167,1,0,0,0,2158,2159,5,184,0,0,2159,2160,
	3,346,173,0,2160,2161,5,153,0,0,2161,2162,3,350,175,0,2162,2163,5,96,0,
	0,2163,2164,3,340,170,0,2164,2165,3,322,161,0,2165,2167,1,0,0,0,2166,2126,
	1,0,0,0,2166,2131,1,0,0,0,2166,2138,1,0,0,0,2166,2144,1,0,0,0,2166,2152,
	1,0,0,0,2166,2158,1,0,0,0,2167,359,1,0,0,0,2168,2169,3,592,296,0,2169,361,
	1,0,0,0,2170,2171,5,63,0,0,2171,2172,5,48,0,0,2172,2173,3,2,1,0,2173,2174,
	3,388,194,0,2174,2175,3,360,180,0,2175,2199,1,0,0,0,2176,2177,5,63,0,0,
	2177,2178,5,48,0,0,2178,2179,5,106,0,0,2179,2180,5,146,0,0,2180,2181,5,
	85,0,0,2181,2182,3,2,1,0,2182,2183,3,360,180,0,2183,2199,1,0,0,0,2184,2185,
	5,63,0,0,2185,2186,5,65,0,0,2186,2187,3,2,1,0,2187,2188,3,388,194,0,2188,
	2189,3,360,180,0,2189,2199,1,0,0,0,2190,2191,5,63,0,0,2191,2192,5,65,0,
	0,2192,2193,5,106,0,0,2193,2194,5,146,0,0,2194,2195,5,85,0,0,2195,2196,
	3,2,1,0,2196,2197,3,360,180,0,2197,2199,1,0,0,0,2198,2170,1,0,0,0,2198,
	2176,1,0,0,0,2198,2184,1,0,0,0,2198,2190,1,0,0,0,2199,363,1,0,0,0,2200,
	2201,5,35,0,0,2201,2202,5,48,0,0,2202,2203,3,2,1,0,2203,2204,3,594,297,
	0,2204,2211,1,0,0,0,2205,2206,5,35,0,0,2206,2207,5,65,0,0,2207,2208,3,2,
	1,0,2208,2209,3,594,297,0,2209,2211,1,0,0,0,2210,2200,1,0,0,0,2210,2205,
	1,0,0,0,2211,365,1,0,0,0,2212,2213,5,76,0,0,2213,2214,5,48,0,0,2214,2215,
	3,2,1,0,2215,2216,3,426,213,0,2216,2233,1,0,0,0,2217,2218,5,76,0,0,2218,
	2219,5,48,0,0,2219,2220,5,106,0,0,2220,2221,5,85,0,0,2221,2233,3,2,1,0,
	2222,2223,5,76,0,0,2223,2224,5,65,0,0,2224,2225,3,2,1,0,2225,2226,3,426,
	213,0,2226,2233,1,0,0,0,2227,2228,5,76,0,0,2228,2229,5,65,0,0,2229,2230,
	5,106,0,0,2230,2231,5,85,0,0,2231,2233,3,2,1,0,2232,2212,1,0,0,0,2232,2217,
	1,0,0,0,2232,2222,1,0,0,0,2232,2227,1,0,0,0,2233,367,1,0,0,0,2234,2235,
	5,63,0,0,2235,2236,5,193,0,0,2236,2237,3,394,197,0,2237,2238,3,388,194,
	0,2238,2246,1,0,0,0,2239,2240,5,63,0,0,2240,2241,5,193,0,0,2241,2242,5,
	106,0,0,2242,2243,5,146,0,0,2243,2244,5,85,0,0,2244,2246,3,394,197,0,2245,
	2234,1,0,0,0,2245,2239,1,0,0,0,2246,369,1,0,0,0,2247,2248,5,76,0,0,2248,
	2249,5,193,0,0,2249,2250,3,394,197,0,2250,2251,3,426,213,0,2251,2258,1,
	0,0,0,2252,2253,5,76,0,0,2253,2254,5,193,0,0,2254,2255,5,106,0,0,2255,2256,
	5,85,0,0,2256,2258,3,394,197,0,2257,2247,1,0,0,0,2257,2252,1,0,0,0,2258,
	371,1,0,0,0,2259,2260,5,63,0,0,2260,2261,5,56,0,0,2261,2262,3,390,195,0,
	2262,2263,3,388,194,0,2263,2264,3,592,296,0,2264,2274,1,0,0,0,2265,2266,
	5,63,0,0,2266,2267,5,56,0,0,2267,2268,5,106,0,0,2268,2269,5,146,0,0,2269,
	2270,5,85,0,0,2270,2271,3,390,195,0,2271,2272,3,592,296,0,2272,2274,1,0,
	0,0,2273,2259,1,0,0,0,2273,2265,1,0,0,0,2274,373,1,0,0,0,2275,2276,5,76,
	0,0,2276,2277,5,56,0,0,2277,2278,3,390,195,0,2278,2279,3,426,213,0,2279,
	2286,1,0,0,0,2280,2281,5,76,0,0,2281,2282,5,56,0,0,2282,2283,5,106,0,0,
	2283,2284,5,85,0,0,2284,2286,3,390,195,0,2285,2275,1,0,0,0,2285,2280,1,
	0,0,0,2286,375,1,0,0,0,2287,2288,3,378,189,0,2288,2289,5,56,0,0,2289,2290,
	3,390,195,0,2290,377,1,0,0,0,2291,2292,7,9,0,0,2292,379,1,0,0,0,2293,2294,
	5,63,0,0,2294,2295,5,168,0,0,2295,2296,5,112,0,0,2296,2297,3,388,194,0,
	2297,2298,5,153,0,0,2298,2299,3,390,195,0,2299,2300,3,396,198,0,2300,2301,
	3,398,199,0,2301,2302,3,592,296,0,2302,2360,1,0,0,0,2303,2304,5,63,0,0,
	2304,2305,5,168,0,0,2305,2306,5,112,0,0,2306,2307,3,384,192,0,2307,2308,
	3,388,194,0,2308,2309,5,153,0,0,2309,2310,3,390,195,0,2310,2311,3,396,198,
	0,2311,2312,3,398,199,0,2312,2313,3,592,296,0,2313,2360,1,0,0,0,2314,2315,
	5,63,0,0,2315,2316,5,168,0,0,2316,2317,5,112,0,0,2317,2318,5,106,0,0,2318,
	2319,5,146,0,0,2319,2320,5,85,0,0,2320,2321,3,384,192,0,2321,2322,5,153,
	0,0,2322,2323,3,390,195,0,2323,2324,3,396,198,0,2324,2325,3,398,199,0,2325,
	2326,3,592,296,0,2326,2360,1,0,0,0,2327,2328,5,63,0,0,2328,2329,3,382,191,
	0,2329,2330,5,112,0,0,2330,2331,3,384,192,0,2331,2332,3,388,194,0,2332,
	2333,5,153,0,0,2333,2334,3,390,195,0,2334,2335,5,21,0,0,2335,2336,3,402,
	201,0,2336,2337,5,22,0,0,2337,2338,3,396,198,0,2338,2339,3,418,209,0,2339,
	2340,3,398,199,0,2340,2341,3,592,296,0,2341,2360,1,0,0,0,2342,2343,5,63,
	0,0,2343,2344,3,382,191,0,2344,2345,5,112,0,0,2345,2346,5,106,0,0,2346,
	2347,5,146,0,0,2347,2348,5,85,0,0,2348,2349,3,384,192,0,2349,2350,5,153,
	0,0,2350,2351,3,390,195,0,2351,2352,5,21,0,0,2352,2353,3,402,201,0,2353,
	2354,5,22,0,0,2354,2355,3,396,198,0,2355,2356,3,418,209,0,2356,2357,3,398,
	199,0,2357,2358,3,592,296,0,2358,2360,1,0,0,0,2359,2293,1,0,0,0,2359,2303,
	1,0,0,0,2359,2314,1,0,0,0,2359,2327,1,0,0,0,2359,2342,1,0,0,0,2360,381,
	1,0,0,0,2361,2364,1,0,0,0,2362,2364,5,245,0,0,2363,2361,1,0,0,0,2363,2362,
	1,0,0,0,2364,383,1,0,0,0,2365,2366,3,2,1,0,2366,385,1,0,0,0,2367,2370,1,
	0,0,0,2368,2370,3,384,192,0,2369,2367,1,0,0,0,2369,2368,1,0,0,0,2370,387,
	1,0,0,0,2371,2376,1,0,0,0,2372,2373,5,106,0,0,2373,2374,5,146,0,0,2374,
	2376,5,85,0,0,2375,2371,1,0,0,0,2375,2372,1,0,0,0,2376,389,1,0,0,0,2377,
	2392,3,392,196,0,2378,2379,3,126,63,0,2379,2380,3,128,64,0,2380,2392,1,
	0,0,0,2381,2382,3,128,64,0,2382,2383,5,7,0,0,2383,2384,3,128,64,0,2384,
	2385,5,7,0,0,2385,2386,3,130,65,0,2386,2392,1,0,0,0,2387,2388,3,128,64,
	0,2388,2389,5,7,0,0,2389,2390,3,130,65,0,2390,2392,1,0,0,0,2391,2377,1,
	0,0,0,2391,2378,1,0,0,0,2391,2381,1,0,0,0,2391,2387,1,0,0,0,2392,391,1,
	0,0,0,2393,2402,3,130,65,0,2394,2395,3,126,63,0,2395,2396,3,128,64,0,2396,
	2397,5,7,0,0,2397,2398,3,128,64,0,2398,2399,5,7,0,0,2399,2400,3,130,65,
	0,2400,2402,1,0,0,0,2401,2393,1,0,0,0,2401,2394,1,0,0,0,2402,393,1,0,0,
	0,2403,2404,3,126,63,0,2404,2405,3,128,64,0,2405,2406,5,7,0,0,2406,2407,
	3,128,64,0,2407,2414,1,0,0,0,2408,2409,3,128,64,0,2409,2410,5,7,0,0,2410,
	2411,3,128,64,0,2411,2414,1,0,0,0,2412,2414,3,128,64,0,2413,2403,1,0,0,
	0,2413,2408,1,0,0,0,2413,2412,1,0,0,0,2414,395,1,0,0,0,2415,2424,1,0,0,
	0,2416,2417,5,162,0,0,2417,2418,5,50,0,0,2418,2419,5,104,0,0,2419,2420,
	5,21,0,0,2420,2421,3,490,245,0,2421,2422,5,22,0,0,2422,2424,1,0,0,0,2423,
	2415,1,0,0,0,2423,2416,1,0,0,0,2424,397,1,0,0,0,2425,2428,1,0,0,0,2426,
	2428,3,400,200,0,2427,2425,1,0,0,0,2427,2426,1,0,0,0,2428,399,1,0,0,0,2429,
	2430,5,222,0,0,2430,2436,5,228,0,0,2431,2432,5,222,0,0,2432,2436,5,103,
	0,0,2433,2434,5,222,0,0,2434,2436,5,97,0,0,2435,2429,1,0,0,0,2435,2431,
	1,0,0,0,2435,2433,1,0,0,0,2436,401,1,0,0,0,2437,2438,6,201,-1,0,2438,2439,
	3,404,202,0,2439,2445,1,0,0,0,2440,2441,10,1,0,0,2441,2442,5,25,0,0,2442,
	2444,3,404,202,0,2443,2440,1,0,0,0,2444,2447,1,0,0,0,2445,2443,1,0,0,0,
	2445,2446,1,0,0,0,2446,403,1,0,0,0,2447,2445,1,0,0,0,2448,2449,3,406,203,
	0,2449,2450,3,420,210,0,2450,405,1,0,0,0,2451,2454,3,466,233,0,2452,2454,
	3,408,204,0,2453,2451,1,0,0,0,2453,2452,1,0,0,0,2454,407,1,0,0,0,2455,2456,
	3,410,205,0,2456,2457,3,466,233,0,2457,2465,1,0,0,0,2458,2459,3,410,205,
	0,2459,2460,5,74,0,0,2460,2461,3,466,233,0,2461,2465,1,0,0,0,2462,2463,
	5,74,0,0,2463,2465,3,466,233,0,2464,2455,1,0,0,0,2464,2458,1,0,0,0,2464,
	2462,1,0,0,0,2465,409,1,0,0,0,2466,2467,7,10,0,0,2467,411,1,0,0,0,2468,
	2469,3,466,233,0,2469,2470,3,420,210,0,2470,413,1,0,0,0,2471,2472,6,207,
	-1,0,2472,2473,3,412,206,0,2473,2479,1,0,0,0,2474,2475,10,1,0,0,2475,2476,
	5,25,0,0,2476,2478,3,412,206,0,2477,2474,1,0,0,0,2478,2481,1,0,0,0,2479,
	2477,1,0,0,0,2479,2480,1,0,0,0,2480,415,1,0,0,0,2481,2479,1,0,0,0,2482,
	2485,1,0,0,0,2483,2485,3,414,207,0,2484,2482,1,0,0,0,2484,2483,1,0,0,0,
	2485,417,1,0,0,0,2486,2490,1,0,0,0,2487,2488,5,230,0,0,2488,2490,3,466,
	233,0,2489,2486,1,0,0,0,2489,2487,1,0,0,0,2490,419,1,0,0,0,2491,2497,1,
	0,0,0,2492,2497,3,422,211,0,2493,2494,3,422,211,0,2494,2495,3,422,211,0,
	2495,2497,1,0,0,0,2496,2491,1,0,0,0,2496,2492,1,0,0,0,2496,2493,1,0,0,0,
	2497,421,1,0,0,0,2498,2503,5,41,0,0,2499,2503,5,72,0,0,2500,2501,5,110,
	0,0,2501,2503,5,141,0,0,2502,2498,1,0,0,0,2502,2499,1,0,0,0,2502,2500,1,
	0,0,0,2503,423,1,0,0,0,2504,2505,5,76,0,0,2505,2506,5,168,0,0,2506,2507,
	5,112,0,0,2507,2508,3,426,213,0,2508,2509,5,153,0,0,2509,2510,3,390,195,
	0,2510,2511,3,398,199,0,2511,2570,1,0,0,0,2512,2513,5,76,0,0,2513,2514,
	5,168,0,0,2514,2515,5,112,0,0,2515,2516,3,384,192,0,2516,2517,3,426,213,
	0,2517,2518,5,153,0,0,2518,2519,3,390,195,0,2519,2520,3,398,199,0,2520,
	2570,1,0,0,0,2521,2522,5,76,0,0,2522,2523,5,168,0,0,2523,2524,5,112,0,0,
	2524,2525,5,106,0,0,2525,2526,5,85,0,0,2526,2527,3,384,192,0,2527,2528,
	5,153,0,0,2528,2529,3,390,195,0,2529,2530,3,398,199,0,2530,2570,1,0,0,0,
	2531,2532,5,76,0,0,2532,2533,3,382,191,0,2533,2534,5,112,0,0,2534,2535,
	3,392,196,0,2535,2536,5,7,0,0,2536,2537,3,384,192,0,2537,2538,3,426,213,
	0,2538,2539,3,398,199,0,2539,2570,1,0,0,0,2540,2541,5,76,0,0,2541,2542,
	3,382,191,0,2542,2543,5,112,0,0,2543,2544,5,106,0,0,2544,2545,5,85,0,0,
	2545,2546,3,392,196,0,2546,2547,5,7,0,0,2547,2548,3,384,192,0,2548,2549,
	3,398,199,0,2549,2570,1,0,0,0,2550,2551,5,76,0,0,2551,2552,3,382,191,0,
	2552,2553,5,112,0,0,2553,2554,3,384,192,0,2554,2555,3,426,213,0,2555,2556,
	5,153,0,0,2556,2557,3,390,195,0,2557,2558,3,398,199,0,2558,2570,1,0,0,0,
	2559,2560,5,76,0,0,2560,2561,3,382,191,0,2561,2562,5,112,0,0,2562,2563,
	5,106,0,0,2563,2564,5,85,0,0,2564,2565,3,384,192,0,2565,2566,5,153,0,0,
	2566,2567,3,390,195,0,2567,2568,3,398,199,0,2568,2570,1,0,0,0,2569,2504,
	1,0,0,0,2569,2512,1,0,0,0,2569,2521,1,0,0,0,2569,2531,1,0,0,0,2569,2540,
	1,0,0,0,2569,2550,1,0,0,0,2569,2559,1,0,0,0,2570,425,1,0,0,0,2571,2575,
	1,0,0,0,2572,2573,5,106,0,0,2573,2575,5,85,0,0,2574,2571,1,0,0,0,2574,2572,
	1,0,0,0,2575,427,1,0,0,0,2576,2577,5,35,0,0,2577,2578,5,112,0,0,2578,2579,
	3,392,196,0,2579,2580,5,7,0,0,2580,2581,3,384,192,0,2581,2582,3,398,199,
	0,2582,2583,3,594,297,0,2583,2593,1,0,0,0,2584,2585,5,35,0,0,2585,2586,
	5,112,0,0,2586,2587,3,384,192,0,2587,2588,5,153,0,0,2588,2589,3,390,195,
	0,2589,2590,3,398,199,0,2590,2591,3,594,297,0,2591,2593,1,0,0,0,2592,2576,
	1,0,0,0,2592,2584,1,0,0,0,2593,429,1,0,0,0,2594,2595,5,49,0,0,2595,2596,
	5,112,0,0,2596,2597,5,153,0,0,2597,2598,3,390,195,0,2598,2599,5,21,0,0,
	2599,2600,3,490,245,0,2600,2601,5,22,0,0,2601,2602,3,398,199,0,2602,431,
	1,0,0,0,2603,2604,5,63,0,0,2604,2605,3,434,217,0,2605,2606,5,98,0,0,2606,
	2607,3,388,194,0,2607,2608,3,436,218,0,2608,2609,5,21,0,0,2609,2610,3,442,
	221,0,2610,2611,5,22,0,0,2611,2612,3,388,194,0,2612,2613,3,446,223,0,2613,
	433,1,0,0,0,2614,2618,1,0,0,0,2615,2616,5,156,0,0,2616,2618,5,180,0,0,2617,
	2614,1,0,0,0,2617,2615,1,0,0,0,2618,435,1,0,0,0,2619,2622,3,438,219,0,2620,
	2622,3,440,220,0,2621,2619,1,0,0,0,2621,2620,1,0,0,0,2622,437,1,0,0,0,2623,
	2635,3,130,65,0,2624,2625,3,128,64,0,2625,2626,5,7,0,0,2626,2627,3,128,
	64,0,2627,2635,1,0,0,0,2628,2629,3,128,64,0,2629,2630,5,7,0,0,2630,2631,
	3,128,64,0,2631,2632,5,7,0,0,2632,2633,3,128,64,0,2633,2635,1,0,0,0,2634,
	2623,1,0,0,0,2634,2624,1,0,0,0,2634,2628,1,0,0,0,2635,439,1,0,0,0,2636,
	2637,3,124,62,0,2637,2638,3,130,65,0,2638,2647,1,0,0,0,2639,2640,3,124,
	62,0,2640,2641,3,128,64,0,2641,2642,5,7,0,0,2642,2643,3,128,64,0,2643,2644,
	5,7,0,0,2644,2645,3,130,65,0,2645,2647,1,0,0,0,2646,2636,1,0,0,0,2646,2639,
	1,0,0,0,2647,441,1,0,0,0,2648,2654,1,0,0,0,2649,2650,5,7,0,0,2650,2651,
	5,7,0,0,2651,2654,5,7,0,0,2652,2654,3,444,222,0,2653,2648,1,0,0,0,2653,
	2649,1,0,0,0,2653,2652,1,0,0,0,2654,443,1,0,0,0,2655,2656,6,222,-1,0,2656,
	2657,3,2,1,0,2657,2663,1,0,0,0,2658,2659,10,1,0,0,2659,2660,5,25,0,0,2660,
	2662,3,2,1,0,2661,2658,1,0,0,0,2662,2665,1,0,0,0,2663,2661,1,0,0,0,2663,
	2664,1,0,0,0,2664,445,1,0,0,0,2665,2663,1,0,0,0,2666,2667,5,23,0,0,2667,
	2668,3,466,233,0,2668,2669,5,24,0,0,2669,2691,1,0,0,0,2670,2671,5,127,0,
	0,2671,2672,5,114,0,0,2672,2673,5,40,0,0,2673,2691,3,466,233,0,2674,2675,
	5,127,0,0,2675,2676,5,121,0,0,2676,2677,5,40,0,0,2677,2691,5,1,0,0,2678,
	2679,5,127,0,0,2679,2680,5,121,0,0,2680,2681,5,40,0,0,2681,2682,5,1,0,0,
	2682,2683,5,42,0,0,2683,2691,5,1,0,0,2684,2685,5,127,0,0,2685,2686,5,99,
	0,0,2686,2687,5,40,0,0,2687,2688,5,1,0,0,2688,2689,5,42,0,0,2689,2691,5,
	1,0,0,2690,2666,1,0,0,0,2690,2670,1,0,0,0,2690,2674,1,0,0,0,2690,2678,1,
	0,0,0,2690,2684,1,0,0,0,2691,447,1,0,0,0,2692,2693,5,76,0,0,2693,2694,5,
	98,0,0,2694,2695,3,436,218,0,2695,2696,3,426,213,0,2696,2703,1,0,0,0,2697,
	2698,5,76,0,0,2698,2699,5,98,0,0,2699,2700,5,106,0,0,2700,2701,5,85,0,0,
	2701,2703,3,436,218,0,2702,2692,1,0,0,0,2702,2697,1,0,0,0,2703,449,1,0,
	0,0,2704,2705,5,84,0,0,2705,2706,5,98,0,0,2706,2707,3,436,218,0,2707,2708,
	5,21,0,0,2708,2709,3,488,244,0,2709,2710,5,22,0,0,2710,451,1,0,0,0,2711,
	2712,5,218,0,0,2712,2713,5,200,0,0,2713,2714,3,454,227,0,2714,2715,3,390,
	195,0,2715,2716,5,21,0,0,2716,2717,3,456,228,0,2717,2718,5,22,0,0,2718,
	2719,3,592,296,0,2719,2834,1,0,0,0,2720,2721,5,218,0,0,2721,2722,5,200,
	0,0,2722,2723,3,454,227,0,2723,2724,3,390,195,0,2724,2725,5,70,0,0,2725,
	2726,5,21,0,0,2726,2727,3,456,228,0,2727,2728,5,22,0,0,2728,2834,1,0,0,
	0,2729,2730,5,218,0,0,2730,2731,5,200,0,0,2731,2732,3,454,227,0,2732,2733,
	3,390,195,0,2733,2734,5,70,0,0,2734,2735,5,34,0,0,2735,2834,1,0,0,0,2736,
	2737,5,218,0,0,2737,2738,5,200,0,0,2738,2739,3,454,227,0,2739,2740,3,390,
	195,0,2740,2741,5,112,0,0,2741,2742,5,21,0,0,2742,2743,3,490,245,0,2743,
	2744,5,22,0,0,2744,2745,3,398,199,0,2745,2746,3,592,296,0,2746,2834,1,0,
	0,0,2747,2748,5,218,0,0,2748,2749,5,200,0,0,2749,2750,3,454,227,0,2750,
	2751,3,390,195,0,2751,2752,5,112,0,0,2752,2753,5,34,0,0,2753,2754,3,398,
	199,0,2754,2755,3,592,296,0,2755,2834,1,0,0,0,2756,2757,5,218,0,0,2757,
	2758,5,200,0,0,2758,2759,5,94,0,0,2759,2760,5,112,0,0,2760,2761,3,392,196,
	0,2761,2762,5,7,0,0,2762,2763,3,384,192,0,2763,2764,3,398,199,0,2764,2765,
	3,592,296,0,2765,2834,1,0,0,0,2766,2767,5,218,0,0,2767,2768,5,200,0,0,2768,
	2769,5,94,0,0,2769,2770,5,112,0,0,2770,2771,3,384,192,0,2771,2772,5,153,
	0,0,2772,2773,3,390,195,0,2773,2774,3,398,199,0,2774,2775,3,592,296,0,2775,
	2834,1,0,0,0,2776,2777,5,36,0,0,2777,2778,3,36,18,0,2778,2779,3,390,195,
	0,2779,2780,5,21,0,0,2780,2781,3,456,228,0,2781,2782,5,22,0,0,2782,2783,
	3,592,296,0,2783,2834,1,0,0,0,2784,2785,5,36,0,0,2785,2786,3,36,18,0,2786,
	2787,3,390,195,0,2787,2788,5,70,0,0,2788,2789,5,200,0,0,2789,2790,5,21,
	0,0,2790,2791,3,456,228,0,2791,2792,5,22,0,0,2792,2834,1,0,0,0,2793,2794,
	5,36,0,0,2794,2795,3,36,18,0,2795,2796,3,390,195,0,2796,2797,5,70,0,0,2797,
	2798,5,200,0,0,2798,2834,1,0,0,0,2799,2800,5,36,0,0,2800,2801,3,36,18,0,
	2801,2802,3,390,195,0,2802,2803,5,112,0,0,2803,2804,5,21,0,0,2804,2805,
	3,490,245,0,2805,2806,5,22,0,0,2806,2807,3,398,199,0,2807,2808,3,592,296,
	0,2808,2834,1,0,0,0,2809,2810,5,36,0,0,2810,2811,3,36,18,0,2811,2812,3,
	390,195,0,2812,2813,5,112,0,0,2813,2814,5,34,0,0,2814,2815,3,398,199,0,
	2815,2816,3,592,296,0,2816,2834,1,0,0,0,2817,2818,5,36,0,0,2818,2819,5,
	112,0,0,2819,2820,3,392,196,0,2820,2821,5,7,0,0,2821,2822,3,384,192,0,2822,
	2823,3,398,199,0,2823,2824,3,592,296,0,2824,2834,1,0,0,0,2825,2826,5,36,
	0,0,2826,2827,5,112,0,0,2827,2828,3,384,192,0,2828,2829,5,153,0,0,2829,
	2830,3,390,195,0,2830,2831,3,398,199,0,2831,2832,3,592,296,0,2832,2834,
	1,0,0,0,2833,2711,1,0,0,0,2833,2720,1,0,0,0,2833,2729,1,0,0,0,2833,2736,
	1,0,0,0,2833,2747,1,0,0,0,2833,2756,1,0,0,0,2833,2766,1,0,0,0,2833,2776,
	1,0,0,0,2833,2784,1,0,0,0,2833,2793,1,0,0,0,2833,2799,1,0,0,0,2833,2809,
	1,0,0,0,2833,2817,1,0,0,0,2833,2825,1,0,0,0,2834,453,1,0,0,0,2835,2838,
	1,0,0,0,2836,2838,5,94,0,0,2837,2835,1,0,0,0,2837,2836,1,0,0,0,2838,455,
	1,0,0,0,2839,2840,6,228,-1,0,2840,2841,3,458,229,0,2841,2847,1,0,0,0,2842,
	2843,10,1,0,0,2843,2844,5,25,0,0,2844,2846,3,458,229,0,2845,2842,1,0,0,
	0,2846,2849,1,0,0,0,2847,2845,1,0,0,0,2847,2848,1,0,0,0,2848,457,1,0,0,
	0,2849,2847,1,0,0,0,2850,2851,3,406,203,0,2851,459,1,0,0,0,2852,2853,6,
	230,-1,0,2853,2854,3,2,1,0,2854,2880,1,0,0,0,2855,2856,10,5,0,0,2856,2857,
	5,7,0,0,2857,2879,3,2,1,0,2858,2859,10,4,0,0,2859,2860,5,7,0,0,2860,2879,
	3,464,232,0,2861,2862,10,3,0,0,2862,2863,5,7,0,0,2863,2864,5,27,0,0,2864,
	2865,3,466,233,0,2865,2866,5,28,0,0,2866,2879,1,0,0,0,2867,2868,10,2,0,
	0,2868,2869,5,7,0,0,2869,2870,5,27,0,0,2870,2871,3,466,233,0,2871,2872,
	5,29,0,0,2872,2879,1,0,0,0,2873,2874,10,1,0,0,2874,2875,5,27,0,0,2875,2876,
	3,466,233,0,2876,2877,5,28,0,0,2877,2879,1,0,0,0,2878,2855,1,0,0,0,2878,
	2858,1,0,0,0,2878,2861,1,0,0,0,2878,2867,1,0,0,0,2878,2873,1,0,0,0,2879,
	2882,1,0,0,0,2880,2878,1,0,0,0,2880,2881,1,0,0,0,2881,461,1,0,0,0,2882,
	2880,1,0,0,0,2883,2884,3,2,1,0,2884,463,1,0,0,0,2885,2886,5,237,0,0,2886,
	465,1,0,0,0,2887,2888,6,233,-1,0,2888,2894,3,470,235,0,2889,2890,5,146,
	0,0,2890,2894,3,466,233,29,2891,2892,5,85,0,0,2892,2894,3,466,233,1,2893,
	2887,1,0,0,0,2893,2889,1,0,0,0,2893,2891,1,0,0,0,2894,3095,1,0,0,0,2895,
	2896,10,38,0,0,2896,2897,5,8,0,0,2897,3094,3,466,233,39,2898,2899,10,37,
	0,0,2899,2900,5,9,0,0,2900,3094,3,466,233,38,2901,2902,10,36,0,0,2902,2903,
	5,10,0,0,2903,3094,3,466,233,37,2904,2905,10,35,0,0,2905,2906,5,11,0,0,
	2906,3094,3,466,233,36,2907,2908,10,34,0,0,2908,2909,5,12,0,0,2909,3094,
	3,466,233,35,2910,2911,10,33,0,0,2911,2912,5,252,0,0,2912,3094,3,466,233,
	34,2913,2914,10,32,0,0,2914,2915,5,20,0,0,2915,3094,3,466,233,33,2916,2917,
	10,31,0,0,2917,2918,5,37,0,0,2918,3094,3,466,233,32,2919,2920,10,30,0,0,
	2920,2921,5,156,0,0,2921,3094,3,466,233,31,2922,2923,10,28,0,0,2923,2924,
	5,14,0,0,2924,3094,3,466,233,29,2925,2926,10,27,0,0,2926,2927,5,13,0,0,
	2927,3094,3,466,233,28,2928,2929,10,26,0,0,2929,2930,5,15,0,0,2930,3094,
	3,466,233,27,2931,2932,10,25,0,0,2932,2933,5,16,0,0,2933,3094,3,466,233,
	26,2934,2935,10,24,0,0,2935,2936,5,18,0,0,2936,3094,3,466,233,25,2937,2938,
	10,23,0,0,2938,2939,5,17,0,0,2939,3094,3,466,233,24,2940,2941,10,22,0,0,
	2941,2942,5,19,0,0,2942,3094,3,466,233,23,2943,2944,10,19,0,0,2944,2945,
	5,133,0,0,2945,2946,3,466,233,0,2946,2947,5,253,0,0,2947,2948,3,466,233,
	20,2948,3094,1,0,0,0,2949,2950,10,18,0,0,2950,2951,5,133,0,0,2951,3094,
	3,466,233,19,2952,2953,10,17,0,0,2953,2954,5,146,0,0,2954,2955,5,133,0,
	0,2955,2956,3,466,233,0,2956,2957,5,253,0,0,2957,2958,3,466,233,18,2958,
	3094,1,0,0,0,2959,2960,10,16,0,0,2960,2961,5,146,0,0,2961,2962,5,133,0,
	0,2962,3094,3,466,233,17,2963,2964,10,15,0,0,2964,2965,5,109,0,0,2965,3094,
	3,466,233,16,2966,2967,10,14,0,0,2967,2968,5,146,0,0,2968,2969,5,109,0,
	0,2969,3094,3,466,233,15,2970,2971,10,13,0,0,2971,2972,5,234,0,0,2972,3094,
	3,466,233,14,2973,2974,10,12,0,0,2974,2975,5,146,0,0,2975,2976,5,234,0,
	0,2976,3094,3,466,233,13,2977,2978,10,3,0,0,2978,2979,5,119,0,0,2979,2980,
	5,74,0,0,2980,2981,5,96,0,0,2981,3094,3,466,233,4,2982,2983,10,2,0,0,2983,
	2984,5,119,0,0,2984,2985,5,146,0,0,2985,2986,5,74,0,0,2986,2987,5,96,0,
	0,2987,3094,3,466,233,3,2988,2989,10,51,0,0,2989,2990,5,7,0,0,2990,2991,
	3,462,231,0,2991,2992,5,21,0,0,2992,2993,3,488,244,0,2993,2994,5,22,0,0,
	2994,3094,1,0,0,0,2995,2996,10,50,0,0,2996,2997,5,7,0,0,2997,3094,3,462,
	231,0,2998,2999,10,49,0,0,2999,3000,5,7,0,0,3000,3094,3,464,232,0,3001,
	3002,10,48,0,0,3002,3003,5,7,0,0,3003,3004,5,27,0,0,3004,3005,3,466,233,
	0,3005,3006,5,28,0,0,3006,3094,1,0,0,0,3007,3008,10,47,0,0,3008,3009,5,
	7,0,0,3009,3010,5,27,0,0,3010,3011,3,466,233,0,3011,3012,5,29,0,0,3012,
	3094,1,0,0,0,3013,3014,10,46,0,0,3014,3015,5,27,0,0,3015,3016,5,254,0,0,
	3016,3094,5,28,0,0,3017,3018,10,45,0,0,3018,3019,5,27,0,0,3019,3020,3,466,
	233,0,3020,3021,5,28,0,0,3021,3094,1,0,0,0,3022,3023,10,44,0,0,3023,3024,
	5,27,0,0,3024,3025,3,466,233,0,3025,3026,5,26,0,0,3026,3027,5,28,0,0,3027,
	3094,1,0,0,0,3028,3029,10,43,0,0,3029,3030,5,27,0,0,3030,3031,3,466,233,
	0,3031,3032,5,26,0,0,3032,3033,3,466,233,0,3033,3034,5,28,0,0,3034,3094,
	1,0,0,0,3035,3036,10,42,0,0,3036,3037,5,27,0,0,3037,3038,5,26,0,0,3038,
	3039,3,466,233,0,3039,3040,5,28,0,0,3040,3094,1,0,0,0,3041,3042,10,41,0,
	0,3042,3043,5,27,0,0,3043,3044,5,26,0,0,3044,3094,5,28,0,0,3045,3046,10,
	40,0,0,3046,3047,5,27,0,0,3047,3094,5,28,0,0,3048,3049,10,39,0,0,3049,3050,
	5,27,0,0,3050,3051,5,10,0,0,3051,3094,5,28,0,0,3052,3053,10,21,0,0,3053,
	3054,5,44,0,0,3054,3055,3,472,236,0,3055,3056,5,37,0,0,3056,3057,3,472,
	236,0,3057,3094,1,0,0,0,3058,3059,10,20,0,0,3059,3060,5,146,0,0,3060,3061,
	5,44,0,0,3061,3062,3,472,236,0,3062,3063,5,37,0,0,3063,3064,3,472,236,0,
	3064,3094,1,0,0,0,3065,3066,10,11,0,0,3066,3067,5,119,0,0,3067,3094,5,148,
	0,0,3068,3069,10,10,0,0,3069,3070,5,119,0,0,3070,3071,5,146,0,0,3071,3094,
	5,148,0,0,3072,3073,10,9,0,0,3073,3074,5,119,0,0,3074,3094,5,141,0,0,3075,
	3076,10,8,0,0,3076,3077,5,119,0,0,3077,3078,5,146,0,0,3078,3094,5,141,0,
	0,3079,3080,10,7,0,0,3080,3081,5,119,0,0,3081,3094,3,468,234,0,3082,3083,
	10,6,0,0,3083,3084,5,119,0,0,3084,3085,5,146,0,0,3085,3094,5,215,0,0,3086,
	3087,10,5,0,0,3087,3088,5,119,0,0,3088,3089,5,146,0,0,3089,3094,3,468,234,
	0,3090,3091,10,4,0,0,3091,3092,5,119,0,0,3092,3094,5,215,0,0,3093,2895,
	1,0,0,0,3093,2898,1,0,0,0,3093,2901,1,0,0,0,3093,2904,1,0,0,0,3093,2907,
	1,0,0,0,3093,2910,1,0,0,0,3093,2913,1,0,0,0,3093,2916,1,0,0,0,3093,2919,
	1,0,0,0,3093,2922,1,0,0,0,3093,2925,1,0,0,0,3093,2928,1,0,0,0,3093,2931,
	1,0,0,0,3093,2934,1,0,0,0,3093,2937,1,0,0,0,3093,2940,1,0,0,0,3093,2943,
	1,0,0,0,3093,2949,1,0,0,0,3093,2952,1,0,0,0,3093,2959,1,0,0,0,3093,2963,
	1,0,0,0,3093,2966,1,0,0,0,3093,2970,1,0,0,0,3093,2973,1,0,0,0,3093,2977,
	1,0,0,0,3093,2982,1,0,0,0,3093,2988,1,0,0,0,3093,2995,1,0,0,0,3093,2998,
	1,0,0,0,3093,3001,1,0,0,0,3093,3007,1,0,0,0,3093,3013,1,0,0,0,3093,3017,
	1,0,0,0,3093,3022,1,0,0,0,3093,3028,1,0,0,0,3093,3035,1,0,0,0,3093,3041,
	1,0,0,0,3093,3045,1,0,0,0,3093,3048,1,0,0,0,3093,3052,1,0,0,0,3093,3058,
	1,0,0,0,3093,3065,1,0,0,0,3093,3068,1,0,0,0,3093,3072,1,0,0,0,3093,3075,
	1,0,0,0,3093,3079,1,0,0,0,3093,3082,1,0,0,0,3093,3086,1,0,0,0,3093,3090,
	1,0,0,0,3094,3097,1,0,0,0,3095,3093,1,0,0,0,3095,3096,1,0,0,0,3096,467,
	1,0,0,0,3097,3095,1,0,0,0,3098,3099,7,11,0,0,3099,469,1,0,0,0,3100,3131,
	3,474,237,0,3101,3131,3,642,321,0,3102,3131,3,476,238,0,3103,3131,3,2,1,
	0,3104,3131,5,237,0,0,3105,3131,5,195,0,0,3106,3131,3,492,246,0,3107,3131,
	3,506,253,0,3108,3109,5,9,0,0,3109,3131,3,466,233,0,3110,3131,3,494,247,
	0,3111,3131,3,510,255,0,3112,3131,3,522,261,0,3113,3114,5,255,0,0,3114,
	3115,5,21,0,0,3115,3116,3,466,233,0,3116,3117,5,22,0,0,3117,3131,1,0,0,
	0,3118,3119,5,256,0,0,3119,3120,5,21,0,0,3120,3121,3,466,233,0,3121,3122,
	5,22,0,0,3122,3131,1,0,0,0,3123,3124,5,257,0,0,3124,3125,5,21,0,0,3125,
	3126,3,466,233,0,3126,3127,5,22,0,0,3127,3131,1,0,0,0,3128,3129,5,64,0,
	0,3129,3131,5,221,0,0,3130,3100,1,0,0,0,3130,3101,1,0,0,0,3130,3102,1,0,
	0,0,3130,3103,1,0,0,0,3130,3104,1,0,0,0,3130,3105,1,0,0,0,3130,3106,1,0,
	0,0,3130,3107,1,0,0,0,3130,3108,1,0,0,0,3130,3110,1,0,0,0,3130,3111,1,0,
	0,0,3130,3112,1,0,0,0,3130,3113,1,0,0,0,3130,3118,1,0,0,0,3130,3123,1,0,
	0,0,3130,3128,1,0,0,0,3131,471,1,0,0,0,3132,3133,6,236,-1,0,3133,3134,3,
	470,235,0,3134,3215,1,0,0,0,3135,3136,10,7,0,0,3136,3137,5,8,0,0,3137,3214,
	3,472,236,8,3138,3139,10,6,0,0,3139,3140,5,9,0,0,3140,3214,3,472,236,7,
	3141,3142,10,5,0,0,3142,3143,5,10,0,0,3143,3214,3,472,236,6,3144,3145,10,
	4,0,0,3145,3146,5,11,0,0,3146,3214,3,472,236,5,3147,3148,10,3,0,0,3148,
	3149,5,12,0,0,3149,3214,3,472,236,4,3150,3151,10,2,0,0,3151,3152,5,252,
	0,0,3152,3214,3,472,236,3,3153,3154,10,1,0,0,3154,3155,5,20,0,0,3155,3214,
	3,472,236,2,3156,3157,10,18,0,0,3157,3158,5,7,0,0,3158,3159,3,2,1,0,3159,
	3160,5,21,0,0,3160,3161,3,488,244,0,3161,3162,5,22,0,0,3162,3214,1,0,0,
	0,3163,3164,10,17,0,0,3164,3165,5,7,0,0,3165,3214,3,2,1,0,3166,3167,10,
	16,0,0,3167,3168,5,7,0,0,3168,3214,3,464,232,0,3169,3170,10,15,0,0,3170,
	3171,5,7,0,0,3171,3172,5,27,0,0,3172,3173,3,466,233,0,3173,3174,5,28,0,
	0,3174,3214,1,0,0,0,3175,3176,10,14,0,0,3176,3177,5,7,0,0,3177,3178,5,27,
	0,0,3178,3179,3,466,233,0,3179,3180,5,29,0,0,3180,3214,1,0,0,0,3181,3182,
	10,13,0,0,3182,3183,5,27,0,0,3183,3184,3,466,233,0,3184,3185,5,28,0,0,3185,
	3214,1,0,0,0,3186,3187,10,12,0,0,3187,3188,5,27,0,0,3188,3189,3,466,233,
	0,3189,3190,5,26,0,0,3190,3191,5,28,0,0,3191,3214,1,0,0,0,3192,3193,10,
	11,0,0,3193,3194,5,27,0,0,3194,3195,5,26,0,0,3195,3196,3,466,233,0,3196,
	3197,5,28,0,0,3197,3214,1,0,0,0,3198,3199,10,10,0,0,3199,3200,5,27,0,0,
	3200,3201,3,466,233,0,3201,3202,5,26,0,0,3202,3203,3,466,233,0,3203,3204,
	5,28,0,0,3204,3214,1,0,0,0,3205,3206,10,9,0,0,3206,3207,5,27,0,0,3207,3208,
	5,26,0,0,3208,3214,5,28,0,0,3209,3210,10,8,0,0,3210,3211,5,27,0,0,3211,
	3212,5,10,0,0,3212,3214,5,28,0,0,3213,3135,1,0,0,0,3213,3138,1,0,0,0,3213,
	3141,1,0,0,0,3213,3144,1,0,0,0,3213,3147,1,0,0,0,3213,3150,1,0,0,0,3213,
	3153,1,0,0,0,3213,3156,1,0,0,0,3213,3163,1,0,0,0,3213,3166,1,0,0,0,3213,
	3169,1,0,0,0,3213,3175,1,0,0,0,3213,3181,1,0,0,0,3213,3186,1,0,0,0,3213,
	3192,1,0,0,0,3213,3198,1,0,0,0,3213,3205,1,0,0,0,3213,3209,1,0,0,0,3214,
	3217,1,0,0,0,3215,3213,1,0,0,0,3215,3216,1,0,0,0,3216,473,1,0,0,0,3217,
	3215,1,0,0,0,3218,3219,7,12,0,0,3219,475,1,0,0,0,3220,3223,3,478,239,0,
	3221,3223,3,486,243,0,3222,3220,1,0,0,0,3222,3221,1,0,0,0,3223,477,1,0,
	0,0,3224,3225,5,23,0,0,3225,3226,3,480,240,0,3226,3227,5,24,0,0,3227,479,
	1,0,0,0,3228,3231,1,0,0,0,3229,3231,3,482,241,0,3230,3228,1,0,0,0,3230,
	3229,1,0,0,0,3231,481,1,0,0,0,3232,3233,6,241,-1,0,3233,3234,3,484,242,
	0,3234,3240,1,0,0,0,3235,3236,10,1,0,0,3236,3237,5,25,0,0,3237,3239,3,484,
	242,0,3238,3235,1,0,0,0,3239,3242,1,0,0,0,3240,3238,1,0,0,0,3240,3241,1,
	0,0,0,3241,483,1,0,0,0,3242,3240,1,0,0,0,3243,3244,3,466,233,0,3244,3245,
	5,26,0,0,3245,3246,3,466,233,0,3246,3251,1,0,0,0,3247,3248,3,466,233,0,
	3248,3249,3,102,51,0,3249,3251,1,0,0,0,3250,3243,1,0,0,0,3250,3247,1,0,
	0,0,3251,485,1,0,0,0,3252,3253,5,27,0,0,3253,3254,3,488,244,0,3254,3255,
	5,28,0,0,3255,487,1,0,0,0,3256,3259,1,0,0,0,3257,3259,3,490,245,0,3258,
	3256,1,0,0,0,3258,3257,1,0,0,0,3259,489,1,0,0,0,3260,3261,6,245,-1,0,3261,
	3262,3,466,233,0,3262,3268,1,0,0,0,3263,3264,10,1,0,0,3264,3265,5,25,0,
	0,3265,3267,3,466,233,0,3266,3263,1,0,0,0,3267,3270,1,0,0,0,3268,3266,1,
	0,0,0,3268,3269,1,0,0,0,3269,491,1,0,0,0,3270,3268,1,0,0,0,3271,3272,7,
	13,0,0,3272,493,1,0,0,0,3273,3274,5,52,0,0,3274,3275,3,496,248,0,3275,3276,
	5,80,0,0,3276,495,1,0,0,0,3277,3280,3,498,249,0,3278,3280,3,502,251,0,3279,
	3277,1,0,0,0,3279,3278,1,0,0,0,3280,497,1,0,0,0,3281,3282,3,466,233,0,3282,
	3283,3,500,250,0,3283,3284,3,504,252,0,3284,499,1,0,0,0,3285,3286,6,250,
	-1,0,3286,3287,5,229,0,0,3287,3288,3,466,233,0,3288,3289,5,203,0,0,3289,
	3290,3,466,233,0,3290,3299,1,0,0,0,3291,3292,10,1,0,0,3292,3293,5,229,0,
	0,3293,3294,3,466,233,0,3294,3295,5,203,0,0,3295,3296,3,466,233,0,3296,
	3298,1,0,0,0,3297,3291,1,0,0,0,3298,3301,1,0,0,0,3299,3297,1,0,0,0,3299,
	3300,1,0,0,0,3300,501,1,0,0,0,3301,3299,1,0,0,0,3302,3303,3,500,250,0,3303,
	3304,3,504,252,0,3304,503,1,0,0,0,3305,3309,1,0,0,0,3306,3307,5,79,0,0,
	3307,3309,3,466,233,0,3308,3305,1,0,0,0,3308,3306,1,0,0,0,3309,505,1,0,
	0,0,3310,3311,5,258,0,0,3311,3312,5,21,0,0,3312,3313,3,416,208,0,3313,3314,
	5,22,0,0,3314,3352,1,0,0,0,3315,3316,5,147,0,0,3316,3317,5,21,0,0,3317,
	3318,3,490,245,0,3318,3319,5,22,0,0,3319,3320,3,556,278,0,3320,3321,3,552,
	276,0,3321,3322,3,564,282,0,3322,3352,1,0,0,0,3323,3324,3,508,254,0,3324,
	3325,5,21,0,0,3325,3326,3,488,244,0,3326,3327,5,22,0,0,3327,3328,3,560,
	280,0,3328,3329,3,552,276,0,3329,3330,3,562,281,0,3330,3352,1,0,0,0,3331,
	3332,3,508,254,0,3332,3333,5,21,0,0,3333,3334,3,558,279,0,3334,3335,3,466,
	233,0,3335,3336,5,22,0,0,3336,3337,3,560,280,0,3337,3338,3,562,281,0,3338,
	3352,1,0,0,0,3339,3340,3,508,254,0,3340,3341,5,21,0,0,3341,3342,5,10,0,
	0,3342,3343,5,22,0,0,3343,3344,3,560,280,0,3344,3345,3,562,281,0,3345,3352,
	1,0,0,0,3346,3347,3,440,220,0,3347,3348,5,21,0,0,3348,3349,3,488,244,0,
	3349,3350,5,22,0,0,3350,3352,1,0,0,0,3351,3310,1,0,0,0,3351,3315,1,0,0,
	0,3351,3323,1,0,0,0,3351,3331,1,0,0,0,3351,3339,1,0,0,0,3351,3346,1,0,0,
	0,3352,507,1,0,0,0,3353,3356,3,462,231,0,3354,3356,5,180,0,0,3355,3353,
	1,0,0,0,3355,3354,1,0,0,0,3356,509,1,0,0,0,3357,3360,3,512,256,0,3358,3360,
	3,520,260,0,3359,3357,1,0,0,0,3359,3358,1,0,0,0,3360,511,1,0,0,0,3361,3362,
	5,38,0,0,3362,3363,3,514,257,0,3363,3364,3,518,259,0,3364,3365,5,80,0,0,
	3365,3391,1,0,0,0,3366,3367,5,198,0,0,3367,3368,3,514,257,0,3368,3369,3,
	518,259,0,3369,3370,5,80,0,0,3370,3391,1,0,0,0,3371,3372,5,81,0,0,3372,
	3373,3,514,257,0,3373,3374,3,518,259,0,3374,3375,5,80,0,0,3375,3391,1,0,
	0,0,3376,3377,5,38,0,0,3377,3378,5,37,0,0,3378,3379,5,81,0,0,3379,3380,
	3,514,257,0,3380,3381,3,518,259,0,3381,3382,5,80,0,0,3382,3391,1,0,0,0,
	3383,3384,5,198,0,0,3384,3385,5,37,0,0,3385,3386,5,81,0,0,3386,3387,3,514,
	257,0,3387,3388,3,518,259,0,3388,3389,5,80,0,0,3389,3391,1,0,0,0,3390,3361,
	1,0,0,0,3390,3366,1,0,0,0,3390,3371,1,0,0,0,3390,3376,1,0,0,0,3390,3383,
	1,0,0,0,3391,513,1,0,0,0,3392,3393,6,257,-1,0,3393,3394,3,516,258,0,3394,
	3400,1,0,0,0,3395,3396,10,1,0,0,3396,3397,5,25,0,0,3397,3399,3,516,258,
	0,3398,3395,1,0,0,0,3399,3402,1,0,0,0,3400,3398,1,0,0,0,3400,3401,1,0,0,
	0,3401,515,1,0,0,0,3402,3400,1,0,0,0,3403,3404,3,282,141,0,3404,3405,5,
	109,0,0,3405,3406,3,466,233,0,3406,3424,1,0,0,0,3407,3408,3,282,141,0,3408,
	3409,5,234,0,0,3409,3410,3,466,233,0,3410,3424,1,0,0,0,3411,3412,3,282,
	141,0,3412,3413,5,26,0,0,3413,3414,3,282,141,0,3414,3415,5,109,0,0,3415,
	3416,3,466,233,0,3416,3424,1,0,0,0,3417,3418,3,282,141,0,3418,3419,5,26,
	0,0,3419,3420,3,282,141,0,3420,3421,5,234,0,0,3421,3422,3,466,233,0,3422,
	3424,1,0,0,0,3423,3403,1,0,0,0,3423,3407,1,0,0,0,3423,3411,1,0,0,0,3423,
	3417,1,0,0,0,3424,517,1,0,0,0,3425,3426,5,190,0,0,3426,3427,3,466,233,0,
	3427,519,1,0,0,0,3428,3429,5,39,0,0,3429,3430,3,466,233,0,3430,3431,5,94,
	0,0,3431,3432,3,514,257,0,3432,3433,3,284,142,0,3433,3434,5,80,0,0,3434,
	3452,1,0,0,0,3435,3436,5,90,0,0,3436,3437,3,466,233,0,3437,3438,5,94,0,
	0,3438,3439,3,514,257,0,3439,3440,3,284,142,0,3440,3441,5,80,0,0,3441,3452,
	1,0,0,0,3442,3443,5,151,0,0,3443,3444,3,466,233,0,3444,3445,5,26,0,0,3445,
	3446,3,466,233,0,3446,3447,5,94,0,0,3447,3448,3,514,257,0,3448,3449,3,284,
	142,0,3449,3450,5,80,0,0,3450,3452,1,0,0,0,3451,3428,1,0,0,0,3451,3435,
	1,0,0,0,3451,3442,1,0,0,0,3452,521,1,0,0,0,3453,3454,5,21,0,0,3454,3455,
	3,466,233,0,3455,3456,5,22,0,0,3456,3463,1,0,0,0,3457,3458,5,21,0,0,3458,
	3459,3,408,204,0,3459,3460,5,22,0,0,3460,3463,1,0,0,0,3461,3463,3,524,262,
	0,3462,3453,1,0,0,0,3462,3457,1,0,0,0,3462,3461,1,0,0,0,3463,523,1,0,0,
	0,3464,3465,5,259,0,0,3465,3466,5,21,0,0,3466,3467,3,64,32,0,3467,3468,
	5,22,0,0,3468,3474,1,0,0,0,3469,3470,5,21,0,0,3470,3471,3,64,32,0,3471,
	3472,5,22,0,0,3472,3474,1,0,0,0,3473,3464,1,0,0,0,3473,3469,1,0,0,0,3474,
	525,1,0,0,0,3475,3478,3,466,233,0,3476,3478,3,408,204,0,3477,3475,1,0,0,
	0,3477,3476,1,0,0,0,3478,527,1,0,0,0,3479,3483,1,0,0,0,3480,3481,5,232,
	0,0,3481,3483,3,530,265,0,3482,3479,1,0,0,0,3482,3480,1,0,0,0,3483,529,
	1,0,0,0,3484,3485,6,265,-1,0,3485,3486,3,532,266,0,3486,3492,1,0,0,0,3487,
	3488,10,1,0,0,3488,3489,5,25,0,0,3489,3491,3,532,266,0,3490,3487,1,0,0,
	0,3491,3494,1,0,0,0,3492,3490,1,0,0,0,3492,3493,1,0,0,0,3493,531,1,0,0,
	0,3494,3492,1,0,0,0,3495,3496,3,2,1,0,3496,3497,5,40,0,0,3497,3498,3,534,
	267,0,3498,533,1,0,0,0,3499,3500,5,21,0,0,3500,3501,3,536,268,0,3501,3502,
	3,538,269,0,3502,3503,3,200,100,0,3503,3504,3,540,270,0,3504,3505,5,22,
	0,0,3505,535,1,0,0,0,3506,3509,1,0,0,0,3507,3509,3,2,1,0,3508,3506,1,0,
	0,0,3508,3507,1,0,0,0,3509,537,1,0,0,0,3510,3515,1,0,0,0,3511,3512,5,162,
	0,0,3512,3513,5,50,0,0,3513,3515,3,490,245,0,3514,3510,1,0,0,0,3514,3511,
	1,0,0,0,3515,539,1,0,0,0,3516,3522,1,0,0,0,3517,3518,3,542,271,0,3518,3519,
	3,546,273,0,3519,3520,3,544,272,0,3520,3522,1,0,0,0,3521,3516,1,0,0,0,3521,
	3517,1,0,0,0,3522,541,1,0,0,0,3523,3524,7,14,0,0,3524,543,1,0,0,0,3525,
	3537,1,0,0,0,3526,3527,5,83,0,0,3527,3528,5,145,0,0,3528,3537,5,158,0,0,
	3529,3530,5,83,0,0,3530,3531,5,64,0,0,3531,3537,5,188,0,0,3532,3533,5,83,
	0,0,3533,3537,5,204,0,0,3534,3535,5,83,0,0,3535,3537,5,101,0,0,3536,3525,
	1,0,0,0,3536,3526,1,0,0,0,3536,3529,1,0,0,0,3536,3532,1,0,0,0,3536,3534,
	1,0,0,0,3537,545,1,0,0,0,3538,3545,3,548,274,0,3539,3540,5,44,0,0,3540,
	3541,3,548,274,0,3541,3542,5,37,0,0,3542,3543,3,548,274,0,3543,3545,1,0,
	0,0,3544,3538,1,0,0,0,3544,3539,1,0,0,0,3545,547,1,0,0,0,3546,3547,5,211,
	0,0,3547,3556,5,166,0,0,3548,3549,5,211,0,0,3549,3556,5,93,0,0,3550,3551,
	5,64,0,0,3551,3556,5,188,0,0,3552,3553,3,466,233,0,3553,3554,3,550,275,
	0,3554,3556,1,0,0,0,3555,3546,1,0,0,0,3555,3548,1,0,0,0,3555,3550,1,0,0,
	0,3555,3552,1,0,0,0,3556,549,1,0,0,0,3557,3558,7,15,0,0,3558,551,1,0,0,
	0,3559,3562,1,0,0,0,3560,3562,3,554,277,0,3561,3559,1,0,0,0,3561,3560,1,
	0,0,0,3562,553,1,0,0,0,3563,3564,5,181,0,0,3564,3568,5,149,0,0,3565,3566,
	5,107,0,0,3566,3568,5,149,0,0,3567,3563,1,0,0,0,3567,3565,1,0,0,0,3568,
	555,1,0,0,0,3569,3573,1,0,0,0,3570,3571,5,96,0,0,3571,3573,3,214,107,0,
	3572,3569,1,0,0,0,3572,3570,1,0,0,0,3573,557,1,0,0,0,3574,3575,7,16,0,0,
	3575,559,1,0,0,0,3576,3583,1,0,0,0,3577,3578,5,89,0,0,3578,3579,5,21,0,
	0,3579,3580,3,180,90,0,3580,3581,5,22,0,0,3581,3583,1,0,0,0,3582,3576,1,
	0,0,0,3582,3577,1,0,0,0,3583,561,1,0,0,0,3584,3587,1,0,0,0,3585,3587,3,
	564,282,0,3586,3584,1,0,0,0,3586,3585,1,0,0,0,3587,563,1,0,0,0,3588,3589,
	5,160,0,0,3589,3593,3,2,1,0,3590,3591,5,160,0,0,3591,3593,3,534,267,0,3592,
	3588,1,0,0,0,3592,3590,1,0,0,0,3593,565,1,0,0,0,3594,3595,3,572,286,0,3595,
	3596,3,576,288,0,3596,3597,3,582,291,0,3597,567,1,0,0,0,3598,3599,5,57,
	0,0,3599,3600,3,574,287,0,3600,569,1,0,0,0,3601,3602,5,187,0,0,3602,3603,
	3,574,287,0,3603,3604,3,578,289,0,3604,571,1,0,0,0,3605,3606,7,17,0,0,3606,
	573,1,0,0,0,3607,3610,1,0,0,0,3608,3610,3,576,288,0,3609,3607,1,0,0,0,3609,
	3608,1,0,0,0,3610,575,1,0,0,0,3611,3612,7,18,0,0,3612,577,1,0,0,0,3613,
	3618,1,0,0,0,3614,3615,5,205,0,0,3615,3616,5,191,0,0,3616,3618,3,580,290,
	0,3617,3613,1,0,0,0,3617,3614,1,0,0,0,3618,579,1,0,0,0,3619,3620,3,2,1,
	0,3620,581,1,0,0,0,3621,3624,1,0,0,0,3622,3624,3,584,292,0,3623,3621,1,
	0,0,0,3623,3622,1,0,0,0,3624,583,1,0,0,0,3625,3626,5,120,0,0,3626,3627,
	5,132,0,0,3627,3628,3,586,293,0,3628,585,1,0,0,0,3629,3630,5,176,0,0,3630,
	3631,5,58,0,0,3631,587,1,0,0,0,3632,3633,5,196,0,0,3633,3634,5,207,0,0,
	3634,3635,3,584,292,0,3635,589,1,0,0,0,3636,3637,5,191,0,0,3637,3638,3,
	580,290,0,3638,591,1,0,0,0,3639,3642,1,0,0,0,3640,3642,3,594,297,0,3641,
	3639,1,0,0,0,3641,3640,1,0,0,0,3642,593,1,0,0,0,3643,3644,5,233,0,0,3644,
	3645,3,466,233,0,3645,595,1,0,0,0,3646,3649,1,0,0,0,3647,3649,3,126,63,
	0,3648,3646,1,0,0,0,3648,3647,1,0,0,0,3649,597,1,0,0,0,3650,3653,3,2,1,
	0,3651,3653,3,24,12,0,3652,3650,1,0,0,0,3652,3651,1,0,0,0,3653,599,1,0,
	0,0,3654,3655,3,596,298,0,3655,3656,3,598,299,0,3656,3670,1,0,0,0,3657,
	3658,3,596,298,0,3658,3659,3,128,64,0,3659,3660,5,7,0,0,3660,3661,3,128,
	64,0,3661,3662,5,7,0,0,3662,3663,3,598,299,0,3663,3670,1,0,0,0,3664,3665,
	3,596,298,0,3665,3666,3,128,64,0,3666,3667,5,7,0,0,3667,3668,3,598,299,
	0,3668,3670,1,0,0,0,3669,3654,1,0,0,0,3669,3657,1,0,0,0,3669,3664,1,0,0,
	0,3670,601,1,0,0,0,3671,3675,3,604,302,0,3672,3675,3,614,307,0,3673,3675,
	3,616,308,0,3674,3671,1,0,0,0,3674,3672,1,0,0,0,3674,3673,1,0,0,0,3675,
	603,1,0,0,0,3676,3677,5,63,0,0,3677,3678,5,244,0,0,3678,3679,3,606,303,
	0,3679,3680,3,610,305,0,3680,605,1,0,0,0,3681,3682,6,303,-1,0,3682,3683,
	3,608,304,0,3683,3688,1,0,0,0,3684,3685,10,1,0,0,3685,3687,3,608,304,0,
	3686,3684,1,0,0,0,3687,3690,1,0,0,0,3688,3686,1,0,0,0,3688,3689,1,0,0,0,
	3689,607,1,0,0,0,3690,3688,1,0,0,0,3691,3692,5,106,0,0,3692,3693,5,146,
	0,0,3693,3696,5,85,0,0,3694,3696,3,600,300,0,3695,3691,1,0,0,0,3695,3694,
	1,0,0,0,3696,609,1,0,0,0,3697,3702,6,305,-1,0,3698,3699,10,1,0,0,3699,3701,
	3,612,306,0,3700,3698,1,0,0,0,3701,3704,1,0,0,0,3702,3700,1,0,0,0,3702,
	3703,1,0,0,0,3703,611,1,0,0,0,3704,3702,1,0,0,0,3705,3713,3,622,311,0,3706,
	3713,3,624,312,0,3707,3713,3,628,314,0,3708,3713,3,630,315,0,3709,3713,
	3,632,316,0,3710,3713,3,634,317,0,3711,3713,3,636,318,0,3712,3705,1,0,0,
	0,3712,3706,1,0,0,0,3712,3707,1,0,0,0,3712,3708,1,0,0,0,3712,3709,1,0,0,
	0,3712,3710,1,0,0,0,3712,3711,1,0,0,0,3713,613,1,0,0,0,3714,3715,5,76,0,
	0,3715,3716,5,244,0,0,3716,3717,3,600,300,0,3717,3718,3,426,213,0,3718,
	3725,1,0,0,0,3719,3720,5,76,0,0,3720,3721,5,244,0,0,3721,3722,5,106,0,0,
	3722,3723,5,85,0,0,3723,3725,3,600,300,0,3724,3714,1,0,0,0,3724,3719,1,
	0,0,0,3725,615,1,0,0,0,3726,3727,5,35,0,0,3727,3728,5,244,0,0,3728,3729,
	3,600,300,0,3729,3730,3,594,297,0,3730,3737,1,0,0,0,3731,3732,5,35,0,0,
	3732,3733,5,244,0,0,3733,3734,3,600,300,0,3734,3735,3,618,309,0,3735,3737,
	1,0,0,0,3736,3726,1,0,0,0,3736,3731,1,0,0,0,3737,617,1,0,0,0,3738,3739,
	6,309,-1,0,3739,3740,3,620,310,0,3740,3745,1,0,0,0,3741,3742,10,1,0,0,3742,
	3744,3,620,310,0,3743,3741,1,0,0,0,3744,3747,1,0,0,0,3745,3743,1,0,0,0,
	3745,3746,1,0,0,0,3746,619,1,0,0,0,3747,3745,1,0,0,0,3748,3755,3,626,313,
	0,3749,3755,3,628,314,0,3750,3755,3,630,315,0,3751,3755,3,632,316,0,3752,
	3755,3,634,317,0,3753,3755,3,636,318,0,3754,3748,1,0,0,0,3754,3749,1,0,
	0,0,3754,3750,1,0,0,0,3754,3751,1,0,0,0,3754,3752,1,0,0,0,3754,3753,1,0,
	0,0,3755,621,1,0,0,0,3756,3757,5,233,0,0,3757,3758,3,466,233,0,3758,623,
	1,0,0,0,3759,3760,5,199,0,0,3760,3761,5,233,0,0,3761,3762,3,466,233,0,3762,
	625,1,0,0,0,3763,3768,5,260,0,0,3764,3765,5,260,0,0,3765,3766,5,233,0,0,
	3766,3768,3,466,233,0,3767,3763,1,0,0,0,3767,3764,1,0,0,0,3768,627,1,0,
	0,0,3769,3770,5,111,0,0,3770,3771,5,50,0,0,3771,3772,3,466,233,0,3772,629,
	1,0,0,0,3773,3774,5,145,0,0,3774,3778,5,261,0,0,3775,3776,5,261,0,0,3776,
	3778,3,466,233,0,3777,3773,1,0,0,0,3777,3775,1,0,0,0,3778,631,1,0,0,0,3779,
	3780,5,145,0,0,3780,3784,5,262,0,0,3781,3782,5,262,0,0,3782,3784,3,466,
	233,0,3783,3779,1,0,0,0,3783,3781,1,0,0,0,3784,633,1,0,0,0,3785,3786,5,
	145,0,0,3786,3789,5,249,0,0,3787,3789,5,249,0,0,3788,3785,1,0,0,0,3788,
	3787,1,0,0,0,3789,635,1,0,0,0,3790,3791,5,145,0,0,3791,3795,5,263,0,0,3792,
	3793,5,263,0,0,3793,3795,3,466,233,0,3794,3790,1,0,0,0,3794,3792,1,0,0,
	0,3795,637,1,0,0,0,3796,3797,5,264,0,0,3797,3798,5,94,0,0,3798,3799,5,32,
	0,0,3799,3800,5,26,0,0,3800,3815,3,2,1,0,3801,3802,5,265,0,0,3802,3803,
	5,224,0,0,3803,3804,5,94,0,0,3804,3805,5,32,0,0,3805,3806,5,26,0,0,3806,
	3815,3,2,1,0,3807,3808,5,264,0,0,3808,3809,5,94,0,0,3809,3815,3,2,1,0,3810,
	3811,5,265,0,0,3811,3812,5,224,0,0,3812,3813,5,94,0,0,3813,3815,3,2,1,0,
	3814,3796,1,0,0,0,3814,3801,1,0,0,0,3814,3807,1,0,0,0,3814,3810,1,0,0,0,
	3815,639,1,0,0,0,3816,3817,5,266,0,0,3817,3818,5,94,0,0,3818,3819,5,32,
	0,0,3819,3820,5,26,0,0,3820,3835,3,2,1,0,3821,3822,5,267,0,0,3822,3823,
	5,224,0,0,3823,3824,5,94,0,0,3824,3825,5,32,0,0,3825,3826,5,26,0,0,3826,
	3835,3,2,1,0,3827,3828,5,266,0,0,3828,3829,5,94,0,0,3829,3835,3,2,1,0,3830,
	3831,5,267,0,0,3831,3832,5,224,0,0,3832,3833,5,94,0,0,3833,3835,3,2,1,0,
	3834,3816,1,0,0,0,3834,3821,1,0,0,0,3834,3827,1,0,0,0,3834,3830,1,0,0,0,
	3835,641,1,0,0,0,3836,3839,3,638,319,0,3837,3839,3,640,320,0,3838,3836,
	1,0,0,0,3838,3837,1,0,0,0,3839,643,1,0,0,0,228,649,658,667,680,688,704,
	715,728,747,753,764,770,775,780,784,790,795,799,804,809,816,847,855,863,
	868,872,901,905,911,920,934,938,950,956,968,973,978,990,1001,1005,1010,
	1016,1031,1033,1055,1153,1155,1163,1181,1186,1195,1200,1217,1228,1241,1245,
	1255,1269,1273,1286,1299,1303,1316,1328,1338,1350,1357,1361,1368,1378,1388,
	1396,1403,1412,1416,1430,1439,1444,1453,1459,1466,1487,1507,1513,1532,1545,
	1552,1557,1575,1584,1610,1628,1661,1694,1707,1721,1730,1745,1756,1779,1786,
	1799,1824,1847,1863,1872,1884,1902,1923,1928,1940,1950,1974,1985,1995,2003,
	2049,2059,2067,2077,2106,2116,2124,2166,2198,2210,2232,2245,2257,2273,2285,
	2359,2363,2369,2375,2391,2401,2413,2423,2427,2435,2445,2453,2464,2479,2484,
	2489,2496,2502,2569,2574,2592,2617,2621,2634,2646,2653,2663,2690,2702,2833,
	2837,2847,2878,2880,2893,3093,3095,3130,3213,3215,3222,3230,3240,3250,3258,
	3268,3279,3299,3308,3351,3355,3359,3390,3400,3423,3451,3462,3473,3477,3482,
	3492,3508,3514,3521,3536,3544,3555,3561,3567,3572,3582,3586,3592,3609,3617,
	3623,3641,3648,3652,3669,3674,3688,3695,3702,3712,3724,3736,3745,3754,3767,
	3777,3783,3788,3794,3814,3834,3838];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!n1qlParser.__ATN) {
			n1qlParser.__ATN = new ATNDeserializer().deserialize(n1qlParser._serializedATN);
		}

		return n1qlParser.__ATN;
	}


	static DecisionsToDFA = n1qlParser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class InputContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public stmt_body(): Stmt_bodyContext {
		return this.getTypedRuleContext(Stmt_bodyContext, 0) as Stmt_bodyContext;
	}
	public opt_trailer(): Opt_trailerContext {
		return this.getTypedRuleContext(Opt_trailerContext, 0) as Opt_trailerContext;
	}
	public expr_input(): Expr_inputContext {
		return this.getTypedRuleContext(Expr_inputContext, 0) as Expr_inputContext;
	}
	public hints_input(): Hints_inputContext {
		return this.getTypedRuleContext(Hints_inputContext, 0) as Hints_inputContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_input;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterInput) {
	 		listener.enterInput(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitInput) {
	 		listener.exitInput(this);
		}
	}
}


export class Permitted_identifiersContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENT(): TerminalNode {
		return this.getToken(n1qlParser.IDENT, 0);
	}
	public DEFAULT(): TerminalNode {
		return this.getToken(n1qlParser.DEFAULT, 0);
	}
	public USER(): TerminalNode {
		return this.getToken(n1qlParser.USER, 0);
	}
	public USERS(): TerminalNode {
		return this.getToken(n1qlParser.USERS, 0);
	}
	public SEQUENCE(): TerminalNode {
		return this.getToken(n1qlParser.SEQUENCE, 0);
	}
	public VECTOR(): TerminalNode {
		return this.getToken(n1qlParser.VECTOR, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_permitted_identifiers;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterPermitted_identifiers) {
	 		listener.enterPermitted_identifiers(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitPermitted_identifiers) {
	 		listener.exitPermitted_identifiers(this);
		}
	}
}


export class Opt_trailerContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public opt_trailer(): Opt_trailerContext {
		return this.getTypedRuleContext(Opt_trailerContext, 0) as Opt_trailerContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(n1qlParser.SEMI, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_trailer;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_trailer) {
	 		listener.enterOpt_trailer(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_trailer) {
	 		listener.exitOpt_trailer(this);
		}
	}
}


export class Stmt_bodyContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public advise(): AdviseContext {
		return this.getTypedRuleContext(AdviseContext, 0) as AdviseContext;
	}
	public explain(): ExplainContext {
		return this.getTypedRuleContext(ExplainContext, 0) as ExplainContext;
	}
	public prepare(): PrepareContext {
		return this.getTypedRuleContext(PrepareContext, 0) as PrepareContext;
	}
	public execute(): ExecuteContext {
		return this.getTypedRuleContext(ExecuteContext, 0) as ExecuteContext;
	}
	public explain_function(): Explain_functionContext {
		return this.getTypedRuleContext(Explain_functionContext, 0) as Explain_functionContext;
	}
	public stmt(): StmtContext {
		return this.getTypedRuleContext(StmtContext, 0) as StmtContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_stmt_body;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterStmt_body) {
	 		listener.enterStmt_body(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitStmt_body) {
	 		listener.exitStmt_body(this);
		}
	}
}


export class StmtContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public select_stmt(): Select_stmtContext {
		return this.getTypedRuleContext(Select_stmtContext, 0) as Select_stmtContext;
	}
	public dml_stmt(): Dml_stmtContext {
		return this.getTypedRuleContext(Dml_stmtContext, 0) as Dml_stmtContext;
	}
	public ddl_stmt(): Ddl_stmtContext {
		return this.getTypedRuleContext(Ddl_stmtContext, 0) as Ddl_stmtContext;
	}
	public infer(): InferContext {
		return this.getTypedRuleContext(InferContext, 0) as InferContext;
	}
	public update_statistics(): Update_statisticsContext {
		return this.getTypedRuleContext(Update_statisticsContext, 0) as Update_statisticsContext;
	}
	public user_stmt(): User_stmtContext {
		return this.getTypedRuleContext(User_stmtContext, 0) as User_stmtContext;
	}
	public group_stmt(): Group_stmtContext {
		return this.getTypedRuleContext(Group_stmtContext, 0) as Group_stmtContext;
	}
	public role_stmt(): Role_stmtContext {
		return this.getTypedRuleContext(Role_stmtContext, 0) as Role_stmtContext;
	}
	public function_stmt(): Function_stmtContext {
		return this.getTypedRuleContext(Function_stmtContext, 0) as Function_stmtContext;
	}
	public transaction_stmt(): Transaction_stmtContext {
		return this.getTypedRuleContext(Transaction_stmtContext, 0) as Transaction_stmtContext;
	}
	public sequence_stmt(): Sequence_stmtContext {
		return this.getTypedRuleContext(Sequence_stmtContext, 0) as Sequence_stmtContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_stmt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterStmt) {
	 		listener.enterStmt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitStmt) {
	 		listener.exitStmt(this);
		}
	}
}


export class AdviseContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ADVISE(): TerminalNode {
		return this.getToken(n1qlParser.ADVISE, 0);
	}
	public opt_index(): Opt_indexContext {
		return this.getTypedRuleContext(Opt_indexContext, 0) as Opt_indexContext;
	}
	public stmt(): StmtContext {
		return this.getTypedRuleContext(StmtContext, 0) as StmtContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_advise;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterAdvise) {
	 		listener.enterAdvise(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitAdvise) {
	 		listener.exitAdvise(this);
		}
	}
}


export class Opt_indexContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INDEX(): TerminalNode {
		return this.getToken(n1qlParser.INDEX, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_index;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_index) {
	 		listener.enterOpt_index(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_index) {
	 		listener.exitOpt_index(this);
		}
	}
}


export class ExplainContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EXPLAIN(): TerminalNode {
		return this.getToken(n1qlParser.EXPLAIN, 0);
	}
	public stmt(): StmtContext {
		return this.getTypedRuleContext(StmtContext, 0) as StmtContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_explain;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterExplain) {
	 		listener.enterExplain(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitExplain) {
	 		listener.exitExplain(this);
		}
	}
}


export class Explain_functionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EXPLAIN(): TerminalNode {
		return this.getToken(n1qlParser.EXPLAIN, 0);
	}
	public FUNCTION(): TerminalNode {
		return this.getToken(n1qlParser.FUNCTION, 0);
	}
	public func_name(): Func_nameContext {
		return this.getTypedRuleContext(Func_nameContext, 0) as Func_nameContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_explain_function;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterExplain_function) {
	 		listener.enterExplain_function(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitExplain_function) {
	 		listener.exitExplain_function(this);
		}
	}
}


export class PrepareContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PREPARE(): TerminalNode {
		return this.getToken(n1qlParser.PREPARE, 0);
	}
	public opt_force(): Opt_forceContext {
		return this.getTypedRuleContext(Opt_forceContext, 0) as Opt_forceContext;
	}
	public opt_name(): Opt_nameContext {
		return this.getTypedRuleContext(Opt_nameContext, 0) as Opt_nameContext;
	}
	public stmt(): StmtContext {
		return this.getTypedRuleContext(StmtContext, 0) as StmtContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_prepare;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterPrepare) {
	 		listener.enterPrepare(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitPrepare) {
	 		listener.exitPrepare(this);
		}
	}
}


export class Opt_forceContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FORCE(): TerminalNode {
		return this.getToken(n1qlParser.FORCE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_force;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_force) {
	 		listener.enterOpt_force(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_force) {
	 		listener.exitOpt_force(this);
		}
	}
}


export class Opt_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public from_or_as(): From_or_asContext {
		return this.getTypedRuleContext(From_or_asContext, 0) as From_or_asContext;
	}
	public p__invalid_case_insensitive_identifier(): P__invalid_case_insensitive_identifierContext {
		return this.getTypedRuleContext(P__invalid_case_insensitive_identifierContext, 0) as P__invalid_case_insensitive_identifierContext;
	}
	public STR(): TerminalNode {
		return this.getToken(n1qlParser.STR, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_name) {
	 		listener.enterOpt_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_name) {
	 		listener.exitOpt_name(this);
		}
	}
}


export class P__invalid_case_insensitive_identifierContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENT_ICASE(): TerminalNode {
		return this.getToken(n1qlParser.IDENT_ICASE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_p__invalid_case_insensitive_identifier;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterP__invalid_case_insensitive_identifier) {
	 		listener.enterP__invalid_case_insensitive_identifier(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitP__invalid_case_insensitive_identifier) {
	 		listener.exitP__invalid_case_insensitive_identifier(this);
		}
	}
}


export class From_or_asContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FROM(): TerminalNode {
		return this.getToken(n1qlParser.FROM, 0);
	}
	public AS(): TerminalNode {
		return this.getToken(n1qlParser.AS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_from_or_as;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFrom_or_as) {
	 		listener.enterFrom_or_as(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFrom_or_as) {
	 		listener.exitFrom_or_as(this);
		}
	}
}


export class ExecuteContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EXECUTE(): TerminalNode {
		return this.getToken(n1qlParser.EXECUTE, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public opt_execute_using(): Opt_execute_usingContext {
		return this.getTypedRuleContext(Opt_execute_usingContext, 0) as Opt_execute_usingContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_execute;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterExecute) {
	 		listener.enterExecute(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitExecute) {
	 		listener.exitExecute(this);
		}
	}
}


export class Opt_execute_usingContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public USING(): TerminalNode {
		return this.getToken(n1qlParser.USING, 0);
	}
	public construction_expr(): Construction_exprContext {
		return this.getTypedRuleContext(Construction_exprContext, 0) as Construction_exprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_execute_using;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_execute_using) {
	 		listener.enterOpt_execute_using(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_execute_using) {
	 		listener.exitOpt_execute_using(this);
		}
	}
}


export class InferContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INFER(): TerminalNode {
		return this.getToken(n1qlParser.INFER, 0);
	}
	public keyspace_collection(): Keyspace_collectionContext {
		return this.getTypedRuleContext(Keyspace_collectionContext, 0) as Keyspace_collectionContext;
	}
	public simple_keyspace_ref(): Simple_keyspace_refContext {
		return this.getTypedRuleContext(Simple_keyspace_refContext, 0) as Simple_keyspace_refContext;
	}
	public opt_infer_using(): Opt_infer_usingContext {
		return this.getTypedRuleContext(Opt_infer_usingContext, 0) as Opt_infer_usingContext;
	}
	public opt_with_clause(): Opt_with_clauseContext {
		return this.getTypedRuleContext(Opt_with_clauseContext, 0) as Opt_with_clauseContext;
	}
	public keyspace_path(): Keyspace_pathContext {
		return this.getTypedRuleContext(Keyspace_pathContext, 0) as Keyspace_pathContext;
	}
	public opt_as_alias(): Opt_as_aliasContext {
		return this.getTypedRuleContext(Opt_as_aliasContext, 0) as Opt_as_aliasContext;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_infer;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterInfer) {
	 		listener.enterInfer(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitInfer) {
	 		listener.exitInfer(this);
		}
	}
}


export class Keyspace_collectionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public KEYSPACE(): TerminalNode {
		return this.getToken(n1qlParser.KEYSPACE, 0);
	}
	public COLLECTION(): TerminalNode {
		return this.getToken(n1qlParser.COLLECTION, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_keyspace_collection;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterKeyspace_collection) {
	 		listener.enterKeyspace_collection(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitKeyspace_collection) {
	 		listener.exitKeyspace_collection(this);
		}
	}
}


export class Opt_keyspace_collectionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public keyspace_collection(): Keyspace_collectionContext {
		return this.getTypedRuleContext(Keyspace_collectionContext, 0) as Keyspace_collectionContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_keyspace_collection;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_keyspace_collection) {
	 		listener.enterOpt_keyspace_collection(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_keyspace_collection) {
	 		listener.exitOpt_keyspace_collection(this);
		}
	}
}


export class Opt_infer_usingContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_infer_using;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_infer_using) {
	 		listener.enterOpt_infer_using(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_infer_using) {
	 		listener.exitOpt_infer_using(this);
		}
	}
}


export class Select_stmtContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public fullselect(): FullselectContext {
		return this.getTypedRuleContext(FullselectContext, 0) as FullselectContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_select_stmt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSelect_stmt) {
	 		listener.enterSelect_stmt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSelect_stmt) {
	 		listener.exitSelect_stmt(this);
		}
	}
}


export class Dml_stmtContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public insert(): InsertContext {
		return this.getTypedRuleContext(InsertContext, 0) as InsertContext;
	}
	public upsert(): UpsertContext {
		return this.getTypedRuleContext(UpsertContext, 0) as UpsertContext;
	}
	public delete_(): Delete_Context {
		return this.getTypedRuleContext(Delete_Context, 0) as Delete_Context;
	}
	public update(): UpdateContext {
		return this.getTypedRuleContext(UpdateContext, 0) as UpdateContext;
	}
	public merge(): MergeContext {
		return this.getTypedRuleContext(MergeContext, 0) as MergeContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_dml_stmt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterDml_stmt) {
	 		listener.enterDml_stmt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitDml_stmt) {
	 		listener.exitDml_stmt(this);
		}
	}
}


export class Ddl_stmtContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public index_stmt(): Index_stmtContext {
		return this.getTypedRuleContext(Index_stmtContext, 0) as Index_stmtContext;
	}
	public bucket_stmt(): Bucket_stmtContext {
		return this.getTypedRuleContext(Bucket_stmtContext, 0) as Bucket_stmtContext;
	}
	public scope_stmt(): Scope_stmtContext {
		return this.getTypedRuleContext(Scope_stmtContext, 0) as Scope_stmtContext;
	}
	public collection_stmt(): Collection_stmtContext {
		return this.getTypedRuleContext(Collection_stmtContext, 0) as Collection_stmtContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_ddl_stmt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterDdl_stmt) {
	 		listener.enterDdl_stmt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitDdl_stmt) {
	 		listener.exitDdl_stmt(this);
		}
	}
}


export class User_stmtContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public create_user(): Create_userContext {
		return this.getTypedRuleContext(Create_userContext, 0) as Create_userContext;
	}
	public alter_user(): Alter_userContext {
		return this.getTypedRuleContext(Alter_userContext, 0) as Alter_userContext;
	}
	public drop_user(): Drop_userContext {
		return this.getTypedRuleContext(Drop_userContext, 0) as Drop_userContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_user_stmt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUser_stmt) {
	 		listener.enterUser_stmt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUser_stmt) {
	 		listener.exitUser_stmt(this);
		}
	}
}


export class Group_stmtContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public create_group(): Create_groupContext {
		return this.getTypedRuleContext(Create_groupContext, 0) as Create_groupContext;
	}
	public alter_group(): Alter_groupContext {
		return this.getTypedRuleContext(Alter_groupContext, 0) as Alter_groupContext;
	}
	public drop_group(): Drop_groupContext {
		return this.getTypedRuleContext(Drop_groupContext, 0) as Drop_groupContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_group_stmt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterGroup_stmt) {
	 		listener.enterGroup_stmt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitGroup_stmt) {
	 		listener.exitGroup_stmt(this);
		}
	}
}


export class Role_stmtContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public grant_role(): Grant_roleContext {
		return this.getTypedRuleContext(Grant_roleContext, 0) as Grant_roleContext;
	}
	public revoke_role(): Revoke_roleContext {
		return this.getTypedRuleContext(Revoke_roleContext, 0) as Revoke_roleContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_role_stmt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterRole_stmt) {
	 		listener.enterRole_stmt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitRole_stmt) {
	 		listener.exitRole_stmt(this);
		}
	}
}


export class Index_stmtContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public create_index(): Create_indexContext {
		return this.getTypedRuleContext(Create_indexContext, 0) as Create_indexContext;
	}
	public drop_index(): Drop_indexContext {
		return this.getTypedRuleContext(Drop_indexContext, 0) as Drop_indexContext;
	}
	public alter_index(): Alter_indexContext {
		return this.getTypedRuleContext(Alter_indexContext, 0) as Alter_indexContext;
	}
	public build_index(): Build_indexContext {
		return this.getTypedRuleContext(Build_indexContext, 0) as Build_indexContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_index_stmt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterIndex_stmt) {
	 		listener.enterIndex_stmt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitIndex_stmt) {
	 		listener.exitIndex_stmt(this);
		}
	}
}


export class Bucket_stmtContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public create_bucket(): Create_bucketContext {
		return this.getTypedRuleContext(Create_bucketContext, 0) as Create_bucketContext;
	}
	public alter_bucket(): Alter_bucketContext {
		return this.getTypedRuleContext(Alter_bucketContext, 0) as Alter_bucketContext;
	}
	public drop_bucket(): Drop_bucketContext {
		return this.getTypedRuleContext(Drop_bucketContext, 0) as Drop_bucketContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_bucket_stmt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterBucket_stmt) {
	 		listener.enterBucket_stmt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitBucket_stmt) {
	 		listener.exitBucket_stmt(this);
		}
	}
}


export class Scope_stmtContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public create_scope(): Create_scopeContext {
		return this.getTypedRuleContext(Create_scopeContext, 0) as Create_scopeContext;
	}
	public drop_scope(): Drop_scopeContext {
		return this.getTypedRuleContext(Drop_scopeContext, 0) as Drop_scopeContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_scope_stmt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterScope_stmt) {
	 		listener.enterScope_stmt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitScope_stmt) {
	 		listener.exitScope_stmt(this);
		}
	}
}


export class Collection_stmtContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public create_collection(): Create_collectionContext {
		return this.getTypedRuleContext(Create_collectionContext, 0) as Create_collectionContext;
	}
	public drop_collection(): Drop_collectionContext {
		return this.getTypedRuleContext(Drop_collectionContext, 0) as Drop_collectionContext;
	}
	public flush_collection(): Flush_collectionContext {
		return this.getTypedRuleContext(Flush_collectionContext, 0) as Flush_collectionContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_collection_stmt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCollection_stmt) {
	 		listener.enterCollection_stmt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCollection_stmt) {
	 		listener.exitCollection_stmt(this);
		}
	}
}


export class Function_stmtContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public create_function(): Create_functionContext {
		return this.getTypedRuleContext(Create_functionContext, 0) as Create_functionContext;
	}
	public drop_function(): Drop_functionContext {
		return this.getTypedRuleContext(Drop_functionContext, 0) as Drop_functionContext;
	}
	public execute_function(): Execute_functionContext {
		return this.getTypedRuleContext(Execute_functionContext, 0) as Execute_functionContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_function_stmt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFunction_stmt) {
	 		listener.enterFunction_stmt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFunction_stmt) {
	 		listener.exitFunction_stmt(this);
		}
	}
}


export class Transaction_stmtContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public start_transaction(): Start_transactionContext {
		return this.getTypedRuleContext(Start_transactionContext, 0) as Start_transactionContext;
	}
	public commit_transaction(): Commit_transactionContext {
		return this.getTypedRuleContext(Commit_transactionContext, 0) as Commit_transactionContext;
	}
	public rollback_transaction(): Rollback_transactionContext {
		return this.getTypedRuleContext(Rollback_transactionContext, 0) as Rollback_transactionContext;
	}
	public savepoint(): SavepointContext {
		return this.getTypedRuleContext(SavepointContext, 0) as SavepointContext;
	}
	public set_transaction_isolation(): Set_transaction_isolationContext {
		return this.getTypedRuleContext(Set_transaction_isolationContext, 0) as Set_transaction_isolationContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_transaction_stmt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterTransaction_stmt) {
	 		listener.enterTransaction_stmt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitTransaction_stmt) {
	 		listener.exitTransaction_stmt(this);
		}
	}
}


export class FullselectContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public select_terms(): Select_termsContext {
		return this.getTypedRuleContext(Select_termsContext, 0) as Select_termsContext;
	}
	public opt_order_by(): Opt_order_byContext {
		return this.getTypedRuleContext(Opt_order_byContext, 0) as Opt_order_byContext;
	}
	public limit(): LimitContext {
		return this.getTypedRuleContext(LimitContext, 0) as LimitContext;
	}
	public opt_offset(): Opt_offsetContext {
		return this.getTypedRuleContext(Opt_offsetContext, 0) as Opt_offsetContext;
	}
	public offset(): OffsetContext {
		return this.getTypedRuleContext(OffsetContext, 0) as OffsetContext;
	}
	public opt_limit(): Opt_limitContext {
		return this.getTypedRuleContext(Opt_limitContext, 0) as Opt_limitContext;
	}
	public with_(): WithContext {
		return this.getTypedRuleContext(WithContext, 0) as WithContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_fullselect;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFullselect) {
	 		listener.enterFullselect(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFullselect) {
	 		listener.exitFullselect(this);
		}
	}
}


export class Select_termsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public subselect(): SubselectContext {
		return this.getTypedRuleContext(SubselectContext, 0) as SubselectContext;
	}
	public subquery_expr(): Subquery_exprContext {
		return this.getTypedRuleContext(Subquery_exprContext, 0) as Subquery_exprContext;
	}
	public setop(): SetopContext {
		return this.getTypedRuleContext(SetopContext, 0) as SetopContext;
	}
	public select_term(): Select_termContext {
		return this.getTypedRuleContext(Select_termContext, 0) as Select_termContext;
	}
	public select_terms(): Select_termsContext {
		return this.getTypedRuleContext(Select_termsContext, 0) as Select_termsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_select_terms;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSelect_terms) {
	 		listener.enterSelect_terms(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSelect_terms) {
	 		listener.exitSelect_terms(this);
		}
	}
}


export class Select_termContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public subselect(): SubselectContext {
		return this.getTypedRuleContext(SubselectContext, 0) as SubselectContext;
	}
	public subquery_expr(): Subquery_exprContext {
		return this.getTypedRuleContext(Subquery_exprContext, 0) as Subquery_exprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_select_term;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSelect_term) {
	 		listener.enterSelect_term(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSelect_term) {
	 		listener.exitSelect_term(this);
		}
	}
}


export class SubselectContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public from_select(): From_selectContext {
		return this.getTypedRuleContext(From_selectContext, 0) as From_selectContext;
	}
	public select_from(): Select_fromContext {
		return this.getTypedRuleContext(Select_fromContext, 0) as Select_fromContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_subselect;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSubselect) {
	 		listener.enterSubselect(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSubselect) {
	 		listener.exitSubselect(this);
		}
	}
}


export class From_selectContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public from_(): FromContext {
		return this.getTypedRuleContext(FromContext, 0) as FromContext;
	}
	public opt_let(): Opt_letContext {
		return this.getTypedRuleContext(Opt_letContext, 0) as Opt_letContext;
	}
	public opt_where(): Opt_whereContext {
		return this.getTypedRuleContext(Opt_whereContext, 0) as Opt_whereContext;
	}
	public opt_group(): Opt_groupContext {
		return this.getTypedRuleContext(Opt_groupContext, 0) as Opt_groupContext;
	}
	public opt_window_clause(): Opt_window_clauseContext {
		return this.getTypedRuleContext(Opt_window_clauseContext, 0) as Opt_window_clauseContext;
	}
	public SELECT(): TerminalNode {
		return this.getToken(n1qlParser.SELECT, 0);
	}
	public opt_optim_hints(): Opt_optim_hintsContext {
		return this.getTypedRuleContext(Opt_optim_hintsContext, 0) as Opt_optim_hintsContext;
	}
	public projection(): ProjectionContext {
		return this.getTypedRuleContext(ProjectionContext, 0) as ProjectionContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_from_select;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFrom_select) {
	 		listener.enterFrom_select(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFrom_select) {
	 		listener.exitFrom_select(this);
		}
	}
}


export class Select_fromContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SELECT(): TerminalNode {
		return this.getToken(n1qlParser.SELECT, 0);
	}
	public opt_optim_hints(): Opt_optim_hintsContext {
		return this.getTypedRuleContext(Opt_optim_hintsContext, 0) as Opt_optim_hintsContext;
	}
	public projection(): ProjectionContext {
		return this.getTypedRuleContext(ProjectionContext, 0) as ProjectionContext;
	}
	public opt_from(): Opt_fromContext {
		return this.getTypedRuleContext(Opt_fromContext, 0) as Opt_fromContext;
	}
	public opt_let(): Opt_letContext {
		return this.getTypedRuleContext(Opt_letContext, 0) as Opt_letContext;
	}
	public opt_where(): Opt_whereContext {
		return this.getTypedRuleContext(Opt_whereContext, 0) as Opt_whereContext;
	}
	public opt_group(): Opt_groupContext {
		return this.getTypedRuleContext(Opt_groupContext, 0) as Opt_groupContext;
	}
	public opt_window_clause(): Opt_window_clauseContext {
		return this.getTypedRuleContext(Opt_window_clauseContext, 0) as Opt_window_clauseContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_select_from;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSelect_from) {
	 		listener.enterSelect_from(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSelect_from) {
	 		listener.exitSelect_from(this);
		}
	}
}


export class SetopContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNION(): TerminalNode {
		return this.getToken(n1qlParser.UNION, 0);
	}
	public ALL(): TerminalNode {
		return this.getToken(n1qlParser.ALL, 0);
	}
	public INTERSECT(): TerminalNode {
		return this.getToken(n1qlParser.INTERSECT, 0);
	}
	public EXCEPT(): TerminalNode {
		return this.getToken(n1qlParser.EXCEPT, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_setop;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSetop) {
	 		listener.enterSetop(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSetop) {
	 		listener.exitSetop(this);
		}
	}
}


export class Opt_optim_hintsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OPTIM_HINTS(): TerminalNode {
		return this.getToken(n1qlParser.OPTIM_HINTS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_optim_hints;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_optim_hints) {
	 		listener.enterOpt_optim_hints(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_optim_hints) {
	 		listener.exitOpt_optim_hints(this);
		}
	}
}


export class Hints_inputContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PLUS(): TerminalNode {
		return this.getToken(n1qlParser.PLUS, 0);
	}
	public optim_hints(): Optim_hintsContext {
		return this.getTypedRuleContext(Optim_hintsContext, 0) as Optim_hintsContext;
	}
	public object(): ObjectContext {
		return this.getTypedRuleContext(ObjectContext, 0) as ObjectContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_hints_input;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterHints_input) {
	 		listener.enterHints_input(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitHints_input) {
	 		listener.exitHints_input(this);
		}
	}
}


export class Optim_hintsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public optim_hint(): Optim_hintContext {
		return this.getTypedRuleContext(Optim_hintContext, 0) as Optim_hintContext;
	}
	public optim_hints(): Optim_hintsContext {
		return this.getTypedRuleContext(Optim_hintsContext, 0) as Optim_hintsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_optim_hints;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOptim_hints) {
	 		listener.enterOptim_hints(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOptim_hints) {
	 		listener.exitOptim_hints(this);
		}
	}
}


export class Optim_hintContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public opt_hint_args(): Opt_hint_argsContext {
		return this.getTypedRuleContext(Opt_hint_argsContext, 0) as Opt_hint_argsContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
	public INDEX(): TerminalNode {
		return this.getToken(n1qlParser.INDEX, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_optim_hint;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOptim_hint) {
	 		listener.enterOptim_hint(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOptim_hint) {
	 		listener.exitOptim_hint(this);
		}
	}
}


export class Opt_hint_argsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public hint_args(): Hint_argsContext {
		return this.getTypedRuleContext(Hint_argsContext, 0) as Hint_argsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_hint_args;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_hint_args) {
	 		listener.enterOpt_hint_args(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_hint_args) {
	 		listener.exitOpt_hint_args(this);
		}
	}
}


export class Hint_argsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public DIV(): TerminalNode {
		return this.getToken(n1qlParser.DIV, 0);
	}
	public BUILD(): TerminalNode {
		return this.getToken(n1qlParser.BUILD, 0);
	}
	public PROBE(): TerminalNode {
		return this.getToken(n1qlParser.PROBE, 0);
	}
	public hint_args(): Hint_argsContext {
		return this.getTypedRuleContext(Hint_argsContext, 0) as Hint_argsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_hint_args;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterHint_args) {
	 		listener.enterHint_args(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitHint_args) {
	 		listener.exitHint_args(this);
		}
	}
}


export class ProjectionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public opt_quantifier(): Opt_quantifierContext {
		return this.getTypedRuleContext(Opt_quantifierContext, 0) as Opt_quantifierContext;
	}
	public projects(): ProjectsContext {
		return this.getTypedRuleContext(ProjectsContext, 0) as ProjectsContext;
	}
	public opt_exclude(): Opt_excludeContext {
		return this.getTypedRuleContext(Opt_excludeContext, 0) as Opt_excludeContext;
	}
	public raw(): RawContext {
		return this.getTypedRuleContext(RawContext, 0) as RawContext;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public opt_as_alias(): Opt_as_aliasContext {
		return this.getTypedRuleContext(Opt_as_aliasContext, 0) as Opt_as_aliasContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_projection;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterProjection) {
	 		listener.enterProjection(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitProjection) {
	 		listener.exitProjection(this);
		}
	}
}


export class Opt_quantifierContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ALL(): TerminalNode {
		return this.getToken(n1qlParser.ALL, 0);
	}
	public DISTINCT(): TerminalNode {
		return this.getToken(n1qlParser.DISTINCT, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_quantifier;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_quantifier) {
	 		listener.enterOpt_quantifier(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_quantifier) {
	 		listener.exitOpt_quantifier(this);
		}
	}
}


export class Opt_excludeContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EXCLUDE(): TerminalNode {
		return this.getToken(n1qlParser.EXCLUDE, 0);
	}
	public exprs(): ExprsContext {
		return this.getTypedRuleContext(ExprsContext, 0) as ExprsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_exclude;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_exclude) {
	 		listener.enterOpt_exclude(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_exclude) {
	 		listener.exitOpt_exclude(this);
		}
	}
}


export class RawContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public RAW(): TerminalNode {
		return this.getToken(n1qlParser.RAW, 0);
	}
	public ELEMENT(): TerminalNode {
		return this.getToken(n1qlParser.ELEMENT, 0);
	}
	public VALUE(): TerminalNode {
		return this.getToken(n1qlParser.VALUE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_raw;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterRaw) {
	 		listener.enterRaw(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitRaw) {
	 		listener.exitRaw(this);
		}
	}
}


export class ProjectsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public project(): ProjectContext {
		return this.getTypedRuleContext(ProjectContext, 0) as ProjectContext;
	}
	public projects(): ProjectsContext {
		return this.getTypedRuleContext(ProjectsContext, 0) as ProjectsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_projects;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterProjects) {
	 		listener.enterProjects(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitProjects) {
	 		listener.exitProjects(this);
		}
	}
}


export class ProjectContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public STAR(): TerminalNode {
		return this.getToken(n1qlParser.STAR, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(n1qlParser.DOT, 0);
	}
	public opt_as_alias(): Opt_as_aliasContext {
		return this.getTypedRuleContext(Opt_as_aliasContext, 0) as Opt_as_aliasContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_project;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterProject) {
	 		listener.enterProject(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitProject) {
	 		listener.exitProject(this);
		}
	}
}


export class Opt_as_aliasContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public as_alias(): As_aliasContext {
		return this.getTypedRuleContext(As_aliasContext, 0) as As_aliasContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_as_alias;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_as_alias) {
	 		listener.enterOpt_as_alias(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_as_alias) {
	 		listener.exitOpt_as_alias(this);
		}
	}
}


export class As_aliasContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public alias(): AliasContext {
		return this.getTypedRuleContext(AliasContext, 0) as AliasContext;
	}
	public AS(): TerminalNode {
		return this.getToken(n1qlParser.AS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_as_alias;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterAs_alias) {
	 		listener.enterAs_alias(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitAs_alias) {
	 		listener.exitAs_alias(this);
		}
	}
}


export class AliasContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_alias;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterAlias) {
	 		listener.enterAlias(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitAlias) {
	 		listener.exitAlias(this);
		}
	}
}


export class Opt_fromContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public from_(): FromContext {
		return this.getTypedRuleContext(FromContext, 0) as FromContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_from;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_from) {
	 		listener.enterOpt_from(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_from) {
	 		listener.exitOpt_from(this);
		}
	}
}


export class FromContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FROM(): TerminalNode {
		return this.getToken(n1qlParser.FROM, 0);
	}
	public from_terms(): From_termsContext {
		return this.getTypedRuleContext(From_termsContext, 0) as From_termsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_from;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFrom) {
	 		listener.enterFrom(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFrom) {
	 		listener.exitFrom(this);
		}
	}
}


export class From_termsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public from_term(): From_termContext {
		return this.getTypedRuleContext(From_termContext, 0) as From_termContext;
	}
	public from_terms(): From_termsContext {
		return this.getTypedRuleContext(From_termsContext, 0) as From_termsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
	public LATERAL(): TerminalNode {
		return this.getToken(n1qlParser.LATERAL, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_from_terms;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFrom_terms) {
	 		listener.enterFrom_terms(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFrom_terms) {
	 		listener.exitFrom_terms(this);
		}
	}
}


export class From_termContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simple_from_term_list(): Simple_from_termContext[] {
		return this.getTypedRuleContexts(Simple_from_termContext) as Simple_from_termContext[];
	}
	public simple_from_term(i: number): Simple_from_termContext {
		return this.getTypedRuleContext(Simple_from_termContext, i) as Simple_from_termContext;
	}
	public RIGHT(): TerminalNode {
		return this.getToken(n1qlParser.RIGHT, 0);
	}
	public opt_outer(): Opt_outerContext {
		return this.getTypedRuleContext(Opt_outerContext, 0) as Opt_outerContext;
	}
	public JOIN(): TerminalNode {
		return this.getToken(n1qlParser.JOIN, 0);
	}
	public ON(): TerminalNode {
		return this.getToken(n1qlParser.ON, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public LATERAL(): TerminalNode {
		return this.getToken(n1qlParser.LATERAL, 0);
	}
	public from_term(): From_termContext {
		return this.getTypedRuleContext(From_termContext, 0) as From_termContext;
	}
	public opt_join_type(): Opt_join_typeContext {
		return this.getTypedRuleContext(Opt_join_typeContext, 0) as Opt_join_typeContext;
	}
	public on_keys(): On_keysContext {
		return this.getTypedRuleContext(On_keysContext, 0) as On_keysContext;
	}
	public on_key(): On_keyContext {
		return this.getTypedRuleContext(On_keyContext, 0) as On_keyContext;
	}
	public FOR(): TerminalNode {
		return this.getToken(n1qlParser.FOR, 0);
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public NEST(): TerminalNode {
		return this.getToken(n1qlParser.NEST, 0);
	}
	public unnest(): UnnestContext {
		return this.getTypedRuleContext(UnnestContext, 0) as UnnestContext;
	}
	public opt_as_alias(): Opt_as_aliasContext {
		return this.getTypedRuleContext(Opt_as_aliasContext, 0) as Opt_as_aliasContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_from_term;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFrom_term) {
	 		listener.enterFrom_term(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFrom_term) {
	 		listener.exitFrom_term(this);
		}
	}
}


export class Simple_from_termContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public keyspace_term(): Keyspace_termContext {
		return this.getTypedRuleContext(Keyspace_termContext, 0) as Keyspace_termContext;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public opt_as_alias(): Opt_as_aliasContext {
		return this.getTypedRuleContext(Opt_as_aliasContext, 0) as Opt_as_aliasContext;
	}
	public opt_use(): Opt_useContext {
		return this.getTypedRuleContext(Opt_useContext, 0) as Opt_useContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_simple_from_term;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSimple_from_term) {
	 		listener.enterSimple_from_term(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSimple_from_term) {
	 		listener.exitSimple_from_term(this);
		}
	}
}


export class UnnestContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNNEST(): TerminalNode {
		return this.getToken(n1qlParser.UNNEST, 0);
	}
	public FLATTEN(): TerminalNode {
		return this.getToken(n1qlParser.FLATTEN, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_unnest;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUnnest) {
	 		listener.enterUnnest(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUnnest) {
	 		listener.exitUnnest(this);
		}
	}
}


export class Keyspace_termContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public keyspace_path(): Keyspace_pathContext {
		return this.getTypedRuleContext(Keyspace_pathContext, 0) as Keyspace_pathContext;
	}
	public opt_as_alias(): Opt_as_aliasContext {
		return this.getTypedRuleContext(Opt_as_aliasContext, 0) as Opt_as_aliasContext;
	}
	public opt_use(): Opt_useContext {
		return this.getTypedRuleContext(Opt_useContext, 0) as Opt_useContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_keyspace_term;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterKeyspace_term) {
	 		listener.enterKeyspace_term(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitKeyspace_term) {
	 		listener.exitKeyspace_term(this);
		}
	}
}


export class Keyspace_pathContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public namespace_term(): Namespace_termContext {
		return this.getTypedRuleContext(Namespace_termContext, 0) as Namespace_termContext;
	}
	public keyspace_name(): Keyspace_nameContext {
		return this.getTypedRuleContext(Keyspace_nameContext, 0) as Keyspace_nameContext;
	}
	public path_part_list(): Path_partContext[] {
		return this.getTypedRuleContexts(Path_partContext) as Path_partContext[];
	}
	public path_part(i: number): Path_partContext {
		return this.getTypedRuleContext(Path_partContext, i) as Path_partContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(n1qlParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(n1qlParser.DOT, i);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_keyspace_path;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterKeyspace_path) {
	 		listener.enterKeyspace_path(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitKeyspace_path) {
	 		listener.exitKeyspace_path(this);
		}
	}
}


export class Namespace_termContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public namespace_name(): Namespace_nameContext {
		return this.getTypedRuleContext(Namespace_nameContext, 0) as Namespace_nameContext;
	}
	public SYSTEM(): TerminalNode {
		return this.getToken(n1qlParser.SYSTEM, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(n1qlParser.COLON, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_namespace_term;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterNamespace_term) {
	 		listener.enterNamespace_term(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitNamespace_term) {
	 		listener.exitNamespace_term(this);
		}
	}
}


export class Namespace_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NAMESPACE_ID(): TerminalNode {
		return this.getToken(n1qlParser.NAMESPACE_ID, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(n1qlParser.COLON, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_namespace_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterNamespace_name) {
	 		listener.enterNamespace_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitNamespace_name) {
	 		listener.exitNamespace_name(this);
		}
	}
}


export class Path_partContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_path_part;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterPath_part) {
	 		listener.enterPath_part(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitPath_part) {
	 		listener.exitPath_part(this);
		}
	}
}


export class Keyspace_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public p__invalid_case_insensitive_identifier(): P__invalid_case_insensitive_identifierContext {
		return this.getTypedRuleContext(P__invalid_case_insensitive_identifierContext, 0) as P__invalid_case_insensitive_identifierContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_keyspace_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterKeyspace_name) {
	 		listener.enterKeyspace_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitKeyspace_name) {
	 		listener.exitKeyspace_name(this);
		}
	}
}


export class Opt_useContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public USE(): TerminalNode {
		return this.getToken(n1qlParser.USE, 0);
	}
	public use_options(): Use_optionsContext {
		return this.getTypedRuleContext(Use_optionsContext, 0) as Use_optionsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_use;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_use) {
	 		listener.enterOpt_use(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_use) {
	 		listener.exitOpt_use(this);
		}
	}
}


export class Use_optionsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public use_keys(): Use_keysContext {
		return this.getTypedRuleContext(Use_keysContext, 0) as Use_keysContext;
	}
	public use_index(): Use_indexContext {
		return this.getTypedRuleContext(Use_indexContext, 0) as Use_indexContext;
	}
	public join_hint(): Join_hintContext {
		return this.getTypedRuleContext(Join_hintContext, 0) as Join_hintContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_use_options;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUse_options) {
	 		listener.enterUse_options(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUse_options) {
	 		listener.exitUse_options(this);
		}
	}
}


export class Use_keysContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public opt_primary(): Opt_primaryContext {
		return this.getTypedRuleContext(Opt_primaryContext, 0) as Opt_primaryContext;
	}
	public KEYS(): TerminalNode {
		return this.getToken(n1qlParser.KEYS, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public VALIDATE(): TerminalNode {
		return this.getToken(n1qlParser.VALIDATE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_use_keys;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUse_keys) {
	 		listener.enterUse_keys(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUse_keys) {
	 		listener.exitUse_keys(this);
		}
	}
}


export class Use_indexContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INDEX(): TerminalNode {
		return this.getToken(n1qlParser.INDEX, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public index_refs(): Index_refsContext {
		return this.getTypedRuleContext(Index_refsContext, 0) as Index_refsContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_use_index;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUse_index) {
	 		listener.enterUse_index(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUse_index) {
	 		listener.exitUse_index(this);
		}
	}
}


export class Join_hintContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public HASH(): TerminalNode {
		return this.getToken(n1qlParser.HASH, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public use_hash_option(): Use_hash_optionContext {
		return this.getTypedRuleContext(Use_hash_optionContext, 0) as Use_hash_optionContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
	public NL(): TerminalNode {
		return this.getToken(n1qlParser.NL, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_join_hint;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterJoin_hint) {
	 		listener.enterJoin_hint(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitJoin_hint) {
	 		listener.exitJoin_hint(this);
		}
	}
}


export class Opt_primaryContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PRIMARY(): TerminalNode {
		return this.getToken(n1qlParser.PRIMARY, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_primary;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_primary) {
	 		listener.enterOpt_primary(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_primary) {
	 		listener.exitOpt_primary(this);
		}
	}
}


export class Index_refsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public index_ref(): Index_refContext {
		return this.getTypedRuleContext(Index_refContext, 0) as Index_refContext;
	}
	public index_refs(): Index_refsContext {
		return this.getTypedRuleContext(Index_refsContext, 0) as Index_refsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_index_refs;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterIndex_refs) {
	 		listener.enterIndex_refs(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitIndex_refs) {
	 		listener.exitIndex_refs(this);
		}
	}
}


export class Index_refContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public opt_index_name(): Opt_index_nameContext {
		return this.getTypedRuleContext(Opt_index_nameContext, 0) as Opt_index_nameContext;
	}
	public opt_index_using(): Opt_index_usingContext {
		return this.getTypedRuleContext(Opt_index_usingContext, 0) as Opt_index_usingContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_index_ref;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterIndex_ref) {
	 		listener.enterIndex_ref(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitIndex_ref) {
	 		listener.exitIndex_ref(this);
		}
	}
}


export class Use_hash_optionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public BUILD(): TerminalNode {
		return this.getToken(n1qlParser.BUILD, 0);
	}
	public PROBE(): TerminalNode {
		return this.getToken(n1qlParser.PROBE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_use_hash_option;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUse_hash_option) {
	 		listener.enterUse_hash_option(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUse_hash_option) {
	 		listener.exitUse_hash_option(this);
		}
	}
}


export class Opt_use_del_updContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public opt_use(): Opt_useContext {
		return this.getTypedRuleContext(Opt_useContext, 0) as Opt_useContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_use_del_upd;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_use_del_upd) {
	 		listener.enterOpt_use_del_upd(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_use_del_upd) {
	 		listener.exitOpt_use_del_upd(this);
		}
	}
}


export class Opt_join_typeContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INNER(): TerminalNode {
		return this.getToken(n1qlParser.INNER, 0);
	}
	public LEFT(): TerminalNode {
		return this.getToken(n1qlParser.LEFT, 0);
	}
	public opt_outer(): Opt_outerContext {
		return this.getTypedRuleContext(Opt_outerContext, 0) as Opt_outerContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_join_type;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_join_type) {
	 		listener.enterOpt_join_type(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_join_type) {
	 		listener.exitOpt_join_type(this);
		}
	}
}


export class Opt_outerContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OUTER(): TerminalNode {
		return this.getToken(n1qlParser.OUTER, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_outer;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_outer) {
	 		listener.enterOpt_outer(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_outer) {
	 		listener.exitOpt_outer(this);
		}
	}
}


export class On_keysContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ON(): TerminalNode {
		return this.getToken(n1qlParser.ON, 0);
	}
	public opt_primary(): Opt_primaryContext {
		return this.getTypedRuleContext(Opt_primaryContext, 0) as Opt_primaryContext;
	}
	public KEYS(): TerminalNode {
		return this.getToken(n1qlParser.KEYS, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public VALIDATE(): TerminalNode {
		return this.getToken(n1qlParser.VALIDATE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_on_keys;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOn_keys) {
	 		listener.enterOn_keys(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOn_keys) {
	 		listener.exitOn_keys(this);
		}
	}
}


export class On_keyContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ON(): TerminalNode {
		return this.getToken(n1qlParser.ON, 0);
	}
	public opt_primary(): Opt_primaryContext {
		return this.getTypedRuleContext(Opt_primaryContext, 0) as Opt_primaryContext;
	}
	public KEY(): TerminalNode {
		return this.getToken(n1qlParser.KEY, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public VALIDATE(): TerminalNode {
		return this.getToken(n1qlParser.VALIDATE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_on_key;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOn_key) {
	 		listener.enterOn_key(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOn_key) {
	 		listener.exitOn_key(this);
		}
	}
}


export class Opt_letContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public let_(): Let_Context {
		return this.getTypedRuleContext(Let_Context, 0) as Let_Context;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_let;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_let) {
	 		listener.enterOpt_let(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_let) {
	 		listener.exitOpt_let(this);
		}
	}
}


export class Let_Context extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LET_(): TerminalNode {
		return this.getToken(n1qlParser.LET_, 0);
	}
	public bindings(): BindingsContext {
		return this.getTypedRuleContext(BindingsContext, 0) as BindingsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_let_;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterLet_) {
	 		listener.enterLet_(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitLet_) {
	 		listener.exitLet_(this);
		}
	}
}


export class BindingsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public binding(): BindingContext {
		return this.getTypedRuleContext(BindingContext, 0) as BindingContext;
	}
	public bindings(): BindingsContext {
		return this.getTypedRuleContext(BindingsContext, 0) as BindingsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_bindings;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterBindings) {
	 		listener.enterBindings(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitBindings) {
	 		listener.exitBindings(this);
		}
	}
}


export class BindingContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public alias(): AliasContext {
		return this.getTypedRuleContext(AliasContext, 0) as AliasContext;
	}
	public EQ(): TerminalNode {
		return this.getToken(n1qlParser.EQ, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_binding;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterBinding) {
	 		listener.enterBinding(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitBinding) {
	 		listener.exitBinding(this);
		}
	}
}


export class WithContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WITH(): TerminalNode {
		return this.getToken(n1qlParser.WITH, 0);
	}
	public with_list(): With_listContext {
		return this.getTypedRuleContext(With_listContext, 0) as With_listContext;
	}
	public RECURSIVE(): TerminalNode {
		return this.getToken(n1qlParser.RECURSIVE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_with;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterWith) {
	 		listener.enterWith(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitWith) {
	 		listener.exitWith(this);
		}
	}
}


export class With_listContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public with_term(): With_termContext {
		return this.getTypedRuleContext(With_termContext, 0) as With_termContext;
	}
	public with_list(): With_listContext {
		return this.getTypedRuleContext(With_listContext, 0) as With_listContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_with_list;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterWith_list) {
	 		listener.enterWith_list(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitWith_list) {
	 		listener.exitWith_list(this);
		}
	}
}


export class With_termContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public alias(): AliasContext {
		return this.getTypedRuleContext(AliasContext, 0) as AliasContext;
	}
	public AS(): TerminalNode {
		return this.getToken(n1qlParser.AS, 0);
	}
	public paren_expr(): Paren_exprContext {
		return this.getTypedRuleContext(Paren_exprContext, 0) as Paren_exprContext;
	}
	public opt_cycle_clause(): Opt_cycle_clauseContext {
		return this.getTypedRuleContext(Opt_cycle_clauseContext, 0) as Opt_cycle_clauseContext;
	}
	public opt_option_clause(): Opt_option_clauseContext {
		return this.getTypedRuleContext(Opt_option_clauseContext, 0) as Opt_option_clauseContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_with_term;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterWith_term) {
	 		listener.enterWith_term(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitWith_term) {
	 		listener.exitWith_term(this);
		}
	}
}


export class Opt_option_clauseContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OPTIONS(): TerminalNode {
		return this.getToken(n1qlParser.OPTIONS, 0);
	}
	public object(): ObjectContext {
		return this.getTypedRuleContext(ObjectContext, 0) as ObjectContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_option_clause;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_option_clause) {
	 		listener.enterOpt_option_clause(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_option_clause) {
	 		listener.exitOpt_option_clause(this);
		}
	}
}


export class Opt_cycle_clauseContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CYCLE(): TerminalNode {
		return this.getToken(n1qlParser.CYCLE, 0);
	}
	public exprs(): ExprsContext {
		return this.getTypedRuleContext(ExprsContext, 0) as ExprsContext;
	}
	public RESTRICT(): TerminalNode {
		return this.getToken(n1qlParser.RESTRICT, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_cycle_clause;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_cycle_clause) {
	 		listener.enterOpt_cycle_clause(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_cycle_clause) {
	 		listener.exitOpt_cycle_clause(this);
		}
	}
}


export class Opt_whereContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public where(): WhereContext {
		return this.getTypedRuleContext(WhereContext, 0) as WhereContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_where;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_where) {
	 		listener.enterOpt_where(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_where) {
	 		listener.exitOpt_where(this);
		}
	}
}


export class WhereContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WHERE(): TerminalNode {
		return this.getToken(n1qlParser.WHERE, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_where;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterWhere) {
	 		listener.enterWhere(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitWhere) {
	 		listener.exitWhere(this);
		}
	}
}


export class Opt_groupContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public group(): GroupContext {
		return this.getTypedRuleContext(GroupContext, 0) as GroupContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_group;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_group) {
	 		listener.enterOpt_group(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_group) {
	 		listener.exitOpt_group(this);
		}
	}
}


export class GroupContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public GROUP(): TerminalNode {
		return this.getToken(n1qlParser.GROUP, 0);
	}
	public BY(): TerminalNode {
		return this.getToken(n1qlParser.BY, 0);
	}
	public group_terms(): Group_termsContext {
		return this.getTypedRuleContext(Group_termsContext, 0) as Group_termsContext;
	}
	public opt_group_as(): Opt_group_asContext {
		return this.getTypedRuleContext(Opt_group_asContext, 0) as Opt_group_asContext;
	}
	public opt_letting(): Opt_lettingContext {
		return this.getTypedRuleContext(Opt_lettingContext, 0) as Opt_lettingContext;
	}
	public opt_having(): Opt_havingContext {
		return this.getTypedRuleContext(Opt_havingContext, 0) as Opt_havingContext;
	}
	public letting(): LettingContext {
		return this.getTypedRuleContext(LettingContext, 0) as LettingContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_group;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterGroup) {
	 		listener.enterGroup(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitGroup) {
	 		listener.exitGroup(this);
		}
	}
}


export class Group_termsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public group_term(): Group_termContext {
		return this.getTypedRuleContext(Group_termContext, 0) as Group_termContext;
	}
	public group_terms(): Group_termsContext {
		return this.getTypedRuleContext(Group_termsContext, 0) as Group_termsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_group_terms;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterGroup_terms) {
	 		listener.enterGroup_terms(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitGroup_terms) {
	 		listener.exitGroup_terms(this);
		}
	}
}


export class Group_termContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public opt_as_alias(): Opt_as_aliasContext {
		return this.getTypedRuleContext(Opt_as_aliasContext, 0) as Opt_as_aliasContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_group_term;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterGroup_term) {
	 		listener.enterGroup_term(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitGroup_term) {
	 		listener.exitGroup_term(this);
		}
	}
}


export class Opt_lettingContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public letting(): LettingContext {
		return this.getTypedRuleContext(LettingContext, 0) as LettingContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_letting;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_letting) {
	 		listener.enterOpt_letting(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_letting) {
	 		listener.exitOpt_letting(this);
		}
	}
}


export class LettingContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LETTING(): TerminalNode {
		return this.getToken(n1qlParser.LETTING, 0);
	}
	public bindings(): BindingsContext {
		return this.getTypedRuleContext(BindingsContext, 0) as BindingsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_letting;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterLetting) {
	 		listener.enterLetting(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitLetting) {
	 		listener.exitLetting(this);
		}
	}
}


export class Opt_havingContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public having(): HavingContext {
		return this.getTypedRuleContext(HavingContext, 0) as HavingContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_having;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_having) {
	 		listener.enterOpt_having(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_having) {
	 		listener.exitOpt_having(this);
		}
	}
}


export class HavingContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public HAVING(): TerminalNode {
		return this.getToken(n1qlParser.HAVING, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_having;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterHaving) {
	 		listener.enterHaving(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitHaving) {
	 		listener.exitHaving(this);
		}
	}
}


export class Opt_group_asContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public GROUP(): TerminalNode {
		return this.getToken(n1qlParser.GROUP, 0);
	}
	public AS(): TerminalNode {
		return this.getToken(n1qlParser.AS, 0);
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_group_as;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_group_as) {
	 		listener.enterOpt_group_as(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_group_as) {
	 		listener.exitOpt_group_as(this);
		}
	}
}


export class Opt_order_byContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public order_by(): Order_byContext {
		return this.getTypedRuleContext(Order_byContext, 0) as Order_byContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_order_by;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_order_by) {
	 		listener.enterOpt_order_by(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_order_by) {
	 		listener.exitOpt_order_by(this);
		}
	}
}


export class Order_byContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ORDER(): TerminalNode {
		return this.getToken(n1qlParser.ORDER, 0);
	}
	public BY(): TerminalNode {
		return this.getToken(n1qlParser.BY, 0);
	}
	public sort_terms(): Sort_termsContext {
		return this.getTypedRuleContext(Sort_termsContext, 0) as Sort_termsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_order_by;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOrder_by) {
	 		listener.enterOrder_by(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOrder_by) {
	 		listener.exitOrder_by(this);
		}
	}
}


export class Sort_termsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public sort_term(): Sort_termContext {
		return this.getTypedRuleContext(Sort_termContext, 0) as Sort_termContext;
	}
	public sort_terms(): Sort_termsContext {
		return this.getTypedRuleContext(Sort_termsContext, 0) as Sort_termsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_sort_terms;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSort_terms) {
	 		listener.enterSort_terms(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSort_terms) {
	 		listener.exitSort_terms(this);
		}
	}
}


export class Sort_termContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public opt_dir(): Opt_dirContext {
		return this.getTypedRuleContext(Opt_dirContext, 0) as Opt_dirContext;
	}
	public opt_order_nulls(): Opt_order_nullsContext {
		return this.getTypedRuleContext(Opt_order_nullsContext, 0) as Opt_order_nullsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_sort_term;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSort_term) {
	 		listener.enterSort_term(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSort_term) {
	 		listener.exitSort_term(this);
		}
	}
}


export class Opt_dirContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public dir(): DirContext {
		return this.getTypedRuleContext(DirContext, 0) as DirContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_dir;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_dir) {
	 		listener.enterOpt_dir(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_dir) {
	 		listener.exitOpt_dir(this);
		}
	}
}


export class DirContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public param_expr(): Param_exprContext {
		return this.getTypedRuleContext(Param_exprContext, 0) as Param_exprContext;
	}
	public ASC(): TerminalNode {
		return this.getToken(n1qlParser.ASC, 0);
	}
	public DESC(): TerminalNode {
		return this.getToken(n1qlParser.DESC, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_dir;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterDir) {
	 		listener.enterDir(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitDir) {
	 		listener.exitDir(this);
		}
	}
}


export class Opt_order_nullsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NULLS(): TerminalNode {
		return this.getToken(n1qlParser.NULLS, 0);
	}
	public FIRST(): TerminalNode {
		return this.getToken(n1qlParser.FIRST, 0);
	}
	public LAST(): TerminalNode {
		return this.getToken(n1qlParser.LAST, 0);
	}
	public param_expr(): Param_exprContext {
		return this.getTypedRuleContext(Param_exprContext, 0) as Param_exprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_order_nulls;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_order_nulls) {
	 		listener.enterOpt_order_nulls(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_order_nulls) {
	 		listener.exitOpt_order_nulls(this);
		}
	}
}


export class First_lastContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FIRST(): TerminalNode {
		return this.getToken(n1qlParser.FIRST, 0);
	}
	public LAST(): TerminalNode {
		return this.getToken(n1qlParser.LAST, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_first_last;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFirst_last) {
	 		listener.enterFirst_last(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFirst_last) {
	 		listener.exitFirst_last(this);
		}
	}
}


export class Opt_limitContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public limit(): LimitContext {
		return this.getTypedRuleContext(LimitContext, 0) as LimitContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_limit;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_limit) {
	 		listener.enterOpt_limit(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_limit) {
	 		listener.exitOpt_limit(this);
		}
	}
}


export class LimitContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LIMIT(): TerminalNode {
		return this.getToken(n1qlParser.LIMIT, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_limit;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterLimit) {
	 		listener.enterLimit(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitLimit) {
	 		listener.exitLimit(this);
		}
	}
}


export class Opt_offsetContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public offset(): OffsetContext {
		return this.getTypedRuleContext(OffsetContext, 0) as OffsetContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_offset;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_offset) {
	 		listener.enterOpt_offset(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_offset) {
	 		listener.exitOpt_offset(this);
		}
	}
}


export class OffsetContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OFFSET(): TerminalNode {
		return this.getToken(n1qlParser.OFFSET, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_offset;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOffset) {
	 		listener.enterOffset(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOffset) {
	 		listener.exitOffset(this);
		}
	}
}


export class InsertContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INSERT(): TerminalNode {
		return this.getToken(n1qlParser.INSERT, 0);
	}
	public INTO(): TerminalNode {
		return this.getToken(n1qlParser.INTO, 0);
	}
	public keyspace_ref(): Keyspace_refContext {
		return this.getTypedRuleContext(Keyspace_refContext, 0) as Keyspace_refContext;
	}
	public opt_values_header(): Opt_values_headerContext {
		return this.getTypedRuleContext(Opt_values_headerContext, 0) as Opt_values_headerContext;
	}
	public values_list(): Values_listContext {
		return this.getTypedRuleContext(Values_listContext, 0) as Values_listContext;
	}
	public opt_returning(): Opt_returningContext {
		return this.getTypedRuleContext(Opt_returningContext, 0) as Opt_returningContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public key_val_options_expr_header(): Key_val_options_expr_headerContext {
		return this.getTypedRuleContext(Key_val_options_expr_headerContext, 0) as Key_val_options_expr_headerContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
	public fullselect(): FullselectContext {
		return this.getTypedRuleContext(FullselectContext, 0) as FullselectContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_insert;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterInsert) {
	 		listener.enterInsert(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitInsert) {
	 		listener.exitInsert(this);
		}
	}
}


export class Simple_keyspace_refContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public keyspace_name(): Keyspace_nameContext {
		return this.getTypedRuleContext(Keyspace_nameContext, 0) as Keyspace_nameContext;
	}
	public opt_as_alias(): Opt_as_aliasContext {
		return this.getTypedRuleContext(Opt_as_aliasContext, 0) as Opt_as_aliasContext;
	}
	public path_part_list(): Path_partContext[] {
		return this.getTypedRuleContexts(Path_partContext) as Path_partContext[];
	}
	public path_part(i: number): Path_partContext {
		return this.getTypedRuleContext(Path_partContext, i) as Path_partContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(n1qlParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(n1qlParser.DOT, i);
	}
	public keyspace_path(): Keyspace_pathContext {
		return this.getTypedRuleContext(Keyspace_pathContext, 0) as Keyspace_pathContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_simple_keyspace_ref;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSimple_keyspace_ref) {
	 		listener.enterSimple_keyspace_ref(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSimple_keyspace_ref) {
	 		listener.exitSimple_keyspace_ref(this);
		}
	}
}


export class Keyspace_refContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simple_keyspace_ref(): Simple_keyspace_refContext {
		return this.getTypedRuleContext(Simple_keyspace_refContext, 0) as Simple_keyspace_refContext;
	}
	public param_expr(): Param_exprContext {
		return this.getTypedRuleContext(Param_exprContext, 0) as Param_exprContext;
	}
	public opt_as_alias(): Opt_as_aliasContext {
		return this.getTypedRuleContext(Opt_as_aliasContext, 0) as Opt_as_aliasContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_keyspace_ref;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterKeyspace_ref) {
	 		listener.enterKeyspace_ref(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitKeyspace_ref) {
	 		listener.exitKeyspace_ref(this);
		}
	}
}


export class Opt_values_headerContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public opt_primary(): Opt_primaryContext {
		return this.getTypedRuleContext(Opt_primaryContext, 0) as Opt_primaryContext;
	}
	public KEY(): TerminalNode {
		return this.getToken(n1qlParser.KEY, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(n1qlParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(n1qlParser.COMMA, i);
	}
	public VALUE(): TerminalNode {
		return this.getToken(n1qlParser.VALUE, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
	public OPTIONS(): TerminalNode {
		return this.getToken(n1qlParser.OPTIONS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_values_header;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_values_header) {
	 		listener.enterOpt_values_header(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_values_header) {
	 		listener.exitOpt_values_header(this);
		}
	}
}


export class KeyContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public opt_primary(): Opt_primaryContext {
		return this.getTypedRuleContext(Opt_primaryContext, 0) as Opt_primaryContext;
	}
	public KEY(): TerminalNode {
		return this.getToken(n1qlParser.KEY, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_key;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterKey) {
	 		listener.enterKey(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitKey) {
	 		listener.exitKey(this);
		}
	}
}


export class Values_listContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public values(): ValuesContext {
		return this.getTypedRuleContext(ValuesContext, 0) as ValuesContext;
	}
	public values_list(): Values_listContext {
		return this.getTypedRuleContext(Values_listContext, 0) as Values_listContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
	public next_values(): Next_valuesContext {
		return this.getTypedRuleContext(Next_valuesContext, 0) as Next_valuesContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_values_list;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterValues_list) {
	 		listener.enterValues_list(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitValues_list) {
	 		listener.exitValues_list(this);
		}
	}
}


export class ValuesContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public VALUES(): TerminalNode {
		return this.getToken(n1qlParser.VALUES, 0);
	}
	public key_val_expr(): Key_val_exprContext {
		return this.getTypedRuleContext(Key_val_exprContext, 0) as Key_val_exprContext;
	}
	public key_val_options_expr(): Key_val_options_exprContext {
		return this.getTypedRuleContext(Key_val_options_exprContext, 0) as Key_val_options_exprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_values;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterValues) {
	 		listener.enterValues(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitValues) {
	 		listener.exitValues(this);
		}
	}
}


export class Next_valuesContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public values(): ValuesContext {
		return this.getTypedRuleContext(ValuesContext, 0) as ValuesContext;
	}
	public key_val_expr(): Key_val_exprContext {
		return this.getTypedRuleContext(Key_val_exprContext, 0) as Key_val_exprContext;
	}
	public key_val_options_expr(): Key_val_options_exprContext {
		return this.getTypedRuleContext(Key_val_options_exprContext, 0) as Key_val_options_exprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_next_values;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterNext_values) {
	 		listener.enterNext_values(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitNext_values) {
	 		listener.exitNext_values(this);
		}
	}
}


export class Key_val_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public expr_list(): ExprContext[] {
		return this.getTypedRuleContexts(ExprContext) as ExprContext[];
	}
	public expr(i: number): ExprContext {
		return this.getTypedRuleContext(ExprContext, i) as ExprContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_key_val_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterKey_val_expr) {
	 		listener.enterKey_val_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitKey_val_expr) {
	 		listener.exitKey_val_expr(this);
		}
	}
}


export class Key_val_options_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public expr_list(): ExprContext[] {
		return this.getTypedRuleContexts(ExprContext) as ExprContext[];
	}
	public expr(i: number): ExprContext {
		return this.getTypedRuleContext(ExprContext, i) as ExprContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(n1qlParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(n1qlParser.COMMA, i);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_key_val_options_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterKey_val_options_expr) {
	 		listener.enterKey_val_options_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitKey_val_options_expr) {
	 		listener.exitKey_val_options_expr(this);
		}
	}
}


export class Opt_returningContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public returning(): ReturningContext {
		return this.getTypedRuleContext(ReturningContext, 0) as ReturningContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_returning;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_returning) {
	 		listener.enterOpt_returning(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_returning) {
	 		listener.exitOpt_returning(this);
		}
	}
}


export class ReturningContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public RETURNING(): TerminalNode {
		return this.getToken(n1qlParser.RETURNING, 0);
	}
	public returns_(): Returns_Context {
		return this.getTypedRuleContext(Returns_Context, 0) as Returns_Context;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_returning;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterReturning) {
	 		listener.enterReturning(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitReturning) {
	 		listener.exitReturning(this);
		}
	}
}


export class Returns_Context extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public projects(): ProjectsContext {
		return this.getTypedRuleContext(ProjectsContext, 0) as ProjectsContext;
	}
	public raw(): RawContext {
		return this.getTypedRuleContext(RawContext, 0) as RawContext;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_returns_;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterReturns_) {
	 		listener.enterReturns_(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitReturns_) {
	 		listener.exitReturns_(this);
		}
	}
}


export class Key_expr_headerContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public key(): KeyContext {
		return this.getTypedRuleContext(KeyContext, 0) as KeyContext;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_key_expr_header;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterKey_expr_header) {
	 		listener.enterKey_expr_header(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitKey_expr_header) {
	 		listener.exitKey_expr_header(this);
		}
	}
}


export class Value_expr_headerContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public VALUE(): TerminalNode {
		return this.getToken(n1qlParser.VALUE, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_value_expr_header;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterValue_expr_header) {
	 		listener.enterValue_expr_header(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitValue_expr_header) {
	 		listener.exitValue_expr_header(this);
		}
	}
}


export class Options_expr_headerContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OPTIONS(): TerminalNode {
		return this.getToken(n1qlParser.OPTIONS, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_options_expr_header;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOptions_expr_header) {
	 		listener.enterOptions_expr_header(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOptions_expr_header) {
	 		listener.exitOptions_expr_header(this);
		}
	}
}


export class Key_val_options_expr_headerContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public key_expr_header(): Key_expr_headerContext {
		return this.getTypedRuleContext(Key_expr_headerContext, 0) as Key_expr_headerContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(n1qlParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(n1qlParser.COMMA, i);
	}
	public value_expr_header(): Value_expr_headerContext {
		return this.getTypedRuleContext(Value_expr_headerContext, 0) as Value_expr_headerContext;
	}
	public options_expr_header(): Options_expr_headerContext {
		return this.getTypedRuleContext(Options_expr_headerContext, 0) as Options_expr_headerContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_key_val_options_expr_header;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterKey_val_options_expr_header) {
	 		listener.enterKey_val_options_expr_header(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitKey_val_options_expr_header) {
	 		listener.exitKey_val_options_expr_header(this);
		}
	}
}


export class UpsertContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UPSERT(): TerminalNode {
		return this.getToken(n1qlParser.UPSERT, 0);
	}
	public INTO(): TerminalNode {
		return this.getToken(n1qlParser.INTO, 0);
	}
	public keyspace_ref(): Keyspace_refContext {
		return this.getTypedRuleContext(Keyspace_refContext, 0) as Keyspace_refContext;
	}
	public opt_values_header(): Opt_values_headerContext {
		return this.getTypedRuleContext(Opt_values_headerContext, 0) as Opt_values_headerContext;
	}
	public values_list(): Values_listContext {
		return this.getTypedRuleContext(Values_listContext, 0) as Values_listContext;
	}
	public opt_returning(): Opt_returningContext {
		return this.getTypedRuleContext(Opt_returningContext, 0) as Opt_returningContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public key_val_options_expr_header(): Key_val_options_expr_headerContext {
		return this.getTypedRuleContext(Key_val_options_expr_headerContext, 0) as Key_val_options_expr_headerContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
	public fullselect(): FullselectContext {
		return this.getTypedRuleContext(FullselectContext, 0) as FullselectContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_upsert;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUpsert) {
	 		listener.enterUpsert(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUpsert) {
	 		listener.exitUpsert(this);
		}
	}
}


export class Delete_Context extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DELETE_(): TerminalNode {
		return this.getToken(n1qlParser.DELETE_, 0);
	}
	public opt_optim_hints(): Opt_optim_hintsContext {
		return this.getTypedRuleContext(Opt_optim_hintsContext, 0) as Opt_optim_hintsContext;
	}
	public FROM(): TerminalNode {
		return this.getToken(n1qlParser.FROM, 0);
	}
	public keyspace_ref(): Keyspace_refContext {
		return this.getTypedRuleContext(Keyspace_refContext, 0) as Keyspace_refContext;
	}
	public opt_use_del_upd(): Opt_use_del_updContext {
		return this.getTypedRuleContext(Opt_use_del_updContext, 0) as Opt_use_del_updContext;
	}
	public opt_let(): Opt_letContext {
		return this.getTypedRuleContext(Opt_letContext, 0) as Opt_letContext;
	}
	public opt_where(): Opt_whereContext {
		return this.getTypedRuleContext(Opt_whereContext, 0) as Opt_whereContext;
	}
	public limit(): LimitContext {
		return this.getTypedRuleContext(LimitContext, 0) as LimitContext;
	}
	public opt_offset(): Opt_offsetContext {
		return this.getTypedRuleContext(Opt_offsetContext, 0) as Opt_offsetContext;
	}
	public opt_returning(): Opt_returningContext {
		return this.getTypedRuleContext(Opt_returningContext, 0) as Opt_returningContext;
	}
	public offset(): OffsetContext {
		return this.getTypedRuleContext(OffsetContext, 0) as OffsetContext;
	}
	public opt_limit(): Opt_limitContext {
		return this.getTypedRuleContext(Opt_limitContext, 0) as Opt_limitContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_delete_;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterDelete_) {
	 		listener.enterDelete_(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitDelete_) {
	 		listener.exitDelete_(this);
		}
	}
}


export class UpdateContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UPDATE(): TerminalNode {
		return this.getToken(n1qlParser.UPDATE, 0);
	}
	public opt_optim_hints(): Opt_optim_hintsContext {
		return this.getTypedRuleContext(Opt_optim_hintsContext, 0) as Opt_optim_hintsContext;
	}
	public keyspace_ref(): Keyspace_refContext {
		return this.getTypedRuleContext(Keyspace_refContext, 0) as Keyspace_refContext;
	}
	public opt_use_del_upd(): Opt_use_del_updContext {
		return this.getTypedRuleContext(Opt_use_del_updContext, 0) as Opt_use_del_updContext;
	}
	public opt_let(): Opt_letContext {
		return this.getTypedRuleContext(Opt_letContext, 0) as Opt_letContext;
	}
	public set_(): SetContext {
		return this.getTypedRuleContext(SetContext, 0) as SetContext;
	}
	public unset(): UnsetContext {
		return this.getTypedRuleContext(UnsetContext, 0) as UnsetContext;
	}
	public opt_where(): Opt_whereContext {
		return this.getTypedRuleContext(Opt_whereContext, 0) as Opt_whereContext;
	}
	public opt_limit(): Opt_limitContext {
		return this.getTypedRuleContext(Opt_limitContext, 0) as Opt_limitContext;
	}
	public opt_returning(): Opt_returningContext {
		return this.getTypedRuleContext(Opt_returningContext, 0) as Opt_returningContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_update;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUpdate) {
	 		listener.enterUpdate(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUpdate) {
	 		listener.exitUpdate(this);
		}
	}
}


export class SetContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SET(): TerminalNode {
		return this.getToken(n1qlParser.SET, 0);
	}
	public set_terms(): Set_termsContext {
		return this.getTypedRuleContext(Set_termsContext, 0) as Set_termsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_set;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSet) {
	 		listener.enterSet(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSet) {
	 		listener.exitSet(this);
		}
	}
}


export class Set_termsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public set_term(): Set_termContext {
		return this.getTypedRuleContext(Set_termContext, 0) as Set_termContext;
	}
	public set_terms(): Set_termsContext {
		return this.getTypedRuleContext(Set_termsContext, 0) as Set_termsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_set_terms;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSet_terms) {
	 		listener.enterSet_terms(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSet_terms) {
	 		listener.exitSet_terms(this);
		}
	}
}


export class Set_termContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public path(): PathContext {
		return this.getTypedRuleContext(PathContext, 0) as PathContext;
	}
	public EQ(): TerminalNode {
		return this.getToken(n1qlParser.EQ, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public opt_update_for(): Opt_update_forContext {
		return this.getTypedRuleContext(Opt_update_forContext, 0) as Opt_update_forContext;
	}
	public function_meta_expr(): Function_meta_exprContext {
		return this.getTypedRuleContext(Function_meta_exprContext, 0) as Function_meta_exprContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(n1qlParser.DOT, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_set_term;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSet_term) {
	 		listener.enterSet_term(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSet_term) {
	 		listener.exitSet_term(this);
		}
	}
}


export class Function_meta_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public function_name(): Function_nameContext {
		return this.getTypedRuleContext(Function_nameContext, 0) as Function_nameContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public opt_exprs(): Opt_exprsContext {
		return this.getTypedRuleContext(Opt_exprsContext, 0) as Opt_exprsContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_function_meta_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFunction_meta_expr) {
	 		listener.enterFunction_meta_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFunction_meta_expr) {
	 		listener.exitFunction_meta_expr(this);
		}
	}
}


export class Opt_update_forContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public update_for(): Update_forContext {
		return this.getTypedRuleContext(Update_forContext, 0) as Update_forContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_update_for;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_update_for) {
	 		listener.enterOpt_update_for(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_update_for) {
	 		listener.exitOpt_update_for(this);
		}
	}
}


export class Update_forContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public update_dimensions(): Update_dimensionsContext {
		return this.getTypedRuleContext(Update_dimensionsContext, 0) as Update_dimensionsContext;
	}
	public opt_when(): Opt_whenContext {
		return this.getTypedRuleContext(Opt_whenContext, 0) as Opt_whenContext;
	}
	public END(): TerminalNode {
		return this.getToken(n1qlParser.END, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_update_for;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUpdate_for) {
	 		listener.enterUpdate_for(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUpdate_for) {
	 		listener.exitUpdate_for(this);
		}
	}
}


export class Update_dimensionsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FOR(): TerminalNode {
		return this.getToken(n1qlParser.FOR, 0);
	}
	public update_dimension(): Update_dimensionContext {
		return this.getTypedRuleContext(Update_dimensionContext, 0) as Update_dimensionContext;
	}
	public update_dimensions(): Update_dimensionsContext {
		return this.getTypedRuleContext(Update_dimensionsContext, 0) as Update_dimensionsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_update_dimensions;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUpdate_dimensions) {
	 		listener.enterUpdate_dimensions(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUpdate_dimensions) {
	 		listener.exitUpdate_dimensions(this);
		}
	}
}


export class Update_dimensionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public update_binding(): Update_bindingContext {
		return this.getTypedRuleContext(Update_bindingContext, 0) as Update_bindingContext;
	}
	public update_dimension(): Update_dimensionContext {
		return this.getTypedRuleContext(Update_dimensionContext, 0) as Update_dimensionContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_update_dimension;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUpdate_dimension) {
	 		listener.enterUpdate_dimension(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUpdate_dimension) {
	 		listener.exitUpdate_dimension(this);
		}
	}
}


export class Update_bindingContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public variable_list(): VariableContext[] {
		return this.getTypedRuleContexts(VariableContext) as VariableContext[];
	}
	public variable(i: number): VariableContext {
		return this.getTypedRuleContext(VariableContext, i) as VariableContext;
	}
	public IN(): TerminalNode {
		return this.getToken(n1qlParser.IN, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public WITHIN(): TerminalNode {
		return this.getToken(n1qlParser.WITHIN, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(n1qlParser.COLON, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_update_binding;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUpdate_binding) {
	 		listener.enterUpdate_binding(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUpdate_binding) {
	 		listener.exitUpdate_binding(this);
		}
	}
}


export class VariableContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_variable;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterVariable) {
	 		listener.enterVariable(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitVariable) {
	 		listener.exitVariable(this);
		}
	}
}


export class Opt_whenContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WHEN(): TerminalNode {
		return this.getToken(n1qlParser.WHEN, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_when;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_when) {
	 		listener.enterOpt_when(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_when) {
	 		listener.exitOpt_when(this);
		}
	}
}


export class UnsetContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNSET(): TerminalNode {
		return this.getToken(n1qlParser.UNSET, 0);
	}
	public unset_terms(): Unset_termsContext {
		return this.getTypedRuleContext(Unset_termsContext, 0) as Unset_termsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_unset;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUnset) {
	 		listener.enterUnset(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUnset) {
	 		listener.exitUnset(this);
		}
	}
}


export class Unset_termsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public unset_term(): Unset_termContext {
		return this.getTypedRuleContext(Unset_termContext, 0) as Unset_termContext;
	}
	public unset_terms(): Unset_termsContext {
		return this.getTypedRuleContext(Unset_termsContext, 0) as Unset_termsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_unset_terms;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUnset_terms) {
	 		listener.enterUnset_terms(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUnset_terms) {
	 		listener.exitUnset_terms(this);
		}
	}
}


export class Unset_termContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public path(): PathContext {
		return this.getTypedRuleContext(PathContext, 0) as PathContext;
	}
	public opt_update_for(): Opt_update_forContext {
		return this.getTypedRuleContext(Opt_update_forContext, 0) as Opt_update_forContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_unset_term;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUnset_term) {
	 		listener.enterUnset_term(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUnset_term) {
	 		listener.exitUnset_term(this);
		}
	}
}


export class MergeContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MERGE(): TerminalNode {
		return this.getToken(n1qlParser.MERGE, 0);
	}
	public opt_optim_hints(): Opt_optim_hintsContext {
		return this.getTypedRuleContext(Opt_optim_hintsContext, 0) as Opt_optim_hintsContext;
	}
	public INTO(): TerminalNode {
		return this.getToken(n1qlParser.INTO, 0);
	}
	public simple_keyspace_ref(): Simple_keyspace_refContext {
		return this.getTypedRuleContext(Simple_keyspace_refContext, 0) as Simple_keyspace_refContext;
	}
	public opt_use_merge(): Opt_use_mergeContext {
		return this.getTypedRuleContext(Opt_use_mergeContext, 0) as Opt_use_mergeContext;
	}
	public USING(): TerminalNode {
		return this.getToken(n1qlParser.USING, 0);
	}
	public simple_from_term(): Simple_from_termContext {
		return this.getTypedRuleContext(Simple_from_termContext, 0) as Simple_from_termContext;
	}
	public ON(): TerminalNode {
		return this.getToken(n1qlParser.ON, 0);
	}
	public opt_key(): Opt_keyContext {
		return this.getTypedRuleContext(Opt_keyContext, 0) as Opt_keyContext;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public opt_let(): Opt_letContext {
		return this.getTypedRuleContext(Opt_letContext, 0) as Opt_letContext;
	}
	public opt_merge_actions(): Opt_merge_actionsContext {
		return this.getTypedRuleContext(Opt_merge_actionsContext, 0) as Opt_merge_actionsContext;
	}
	public opt_limit(): Opt_limitContext {
		return this.getTypedRuleContext(Opt_limitContext, 0) as Opt_limitContext;
	}
	public opt_returning(): Opt_returningContext {
		return this.getTypedRuleContext(Opt_returningContext, 0) as Opt_returningContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_merge;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterMerge) {
	 		listener.enterMerge(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitMerge) {
	 		listener.exitMerge(this);
		}
	}
}


export class Opt_use_mergeContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public opt_use(): Opt_useContext {
		return this.getTypedRuleContext(Opt_useContext, 0) as Opt_useContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_use_merge;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_use_merge) {
	 		listener.enterOpt_use_merge(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_use_merge) {
	 		listener.exitOpt_use_merge(this);
		}
	}
}


export class Opt_keyContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public key(): KeyContext {
		return this.getTypedRuleContext(KeyContext, 0) as KeyContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_key;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_key) {
	 		listener.enterOpt_key(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_key) {
	 		listener.exitOpt_key(this);
		}
	}
}


export class Opt_merge_actionsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WHEN(): TerminalNode {
		return this.getToken(n1qlParser.WHEN, 0);
	}
	public MATCHED(): TerminalNode {
		return this.getToken(n1qlParser.MATCHED, 0);
	}
	public THEN(): TerminalNode {
		return this.getToken(n1qlParser.THEN, 0);
	}
	public UPDATE(): TerminalNode {
		return this.getToken(n1qlParser.UPDATE, 0);
	}
	public merge_update(): Merge_updateContext {
		return this.getTypedRuleContext(Merge_updateContext, 0) as Merge_updateContext;
	}
	public opt_merge_delete_insert(): Opt_merge_delete_insertContext {
		return this.getTypedRuleContext(Opt_merge_delete_insertContext, 0) as Opt_merge_delete_insertContext;
	}
	public DELETE_(): TerminalNode {
		return this.getToken(n1qlParser.DELETE_, 0);
	}
	public merge_delete(): Merge_deleteContext {
		return this.getTypedRuleContext(Merge_deleteContext, 0) as Merge_deleteContext;
	}
	public opt_merge_insert(): Opt_merge_insertContext {
		return this.getTypedRuleContext(Opt_merge_insertContext, 0) as Opt_merge_insertContext;
	}
	public NOT(): TerminalNode {
		return this.getToken(n1qlParser.NOT, 0);
	}
	public INSERT(): TerminalNode {
		return this.getToken(n1qlParser.INSERT, 0);
	}
	public merge_insert(): Merge_insertContext {
		return this.getTypedRuleContext(Merge_insertContext, 0) as Merge_insertContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_merge_actions;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_merge_actions) {
	 		listener.enterOpt_merge_actions(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_merge_actions) {
	 		listener.exitOpt_merge_actions(this);
		}
	}
}


export class Opt_merge_delete_insertContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WHEN(): TerminalNode {
		return this.getToken(n1qlParser.WHEN, 0);
	}
	public MATCHED(): TerminalNode {
		return this.getToken(n1qlParser.MATCHED, 0);
	}
	public THEN(): TerminalNode {
		return this.getToken(n1qlParser.THEN, 0);
	}
	public DELETE_(): TerminalNode {
		return this.getToken(n1qlParser.DELETE_, 0);
	}
	public merge_delete(): Merge_deleteContext {
		return this.getTypedRuleContext(Merge_deleteContext, 0) as Merge_deleteContext;
	}
	public opt_merge_insert(): Opt_merge_insertContext {
		return this.getTypedRuleContext(Opt_merge_insertContext, 0) as Opt_merge_insertContext;
	}
	public NOT(): TerminalNode {
		return this.getToken(n1qlParser.NOT, 0);
	}
	public INSERT(): TerminalNode {
		return this.getToken(n1qlParser.INSERT, 0);
	}
	public merge_insert(): Merge_insertContext {
		return this.getTypedRuleContext(Merge_insertContext, 0) as Merge_insertContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_merge_delete_insert;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_merge_delete_insert) {
	 		listener.enterOpt_merge_delete_insert(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_merge_delete_insert) {
	 		listener.exitOpt_merge_delete_insert(this);
		}
	}
}


export class Opt_merge_insertContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WHEN(): TerminalNode {
		return this.getToken(n1qlParser.WHEN, 0);
	}
	public NOT(): TerminalNode {
		return this.getToken(n1qlParser.NOT, 0);
	}
	public MATCHED(): TerminalNode {
		return this.getToken(n1qlParser.MATCHED, 0);
	}
	public THEN(): TerminalNode {
		return this.getToken(n1qlParser.THEN, 0);
	}
	public INSERT(): TerminalNode {
		return this.getToken(n1qlParser.INSERT, 0);
	}
	public merge_insert(): Merge_insertContext {
		return this.getTypedRuleContext(Merge_insertContext, 0) as Merge_insertContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_merge_insert;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_merge_insert) {
	 		listener.enterOpt_merge_insert(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_merge_insert) {
	 		listener.exitOpt_merge_insert(this);
		}
	}
}


export class Merge_updateContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public set_(): SetContext {
		return this.getTypedRuleContext(SetContext, 0) as SetContext;
	}
	public opt_where(): Opt_whereContext {
		return this.getTypedRuleContext(Opt_whereContext, 0) as Opt_whereContext;
	}
	public unset(): UnsetContext {
		return this.getTypedRuleContext(UnsetContext, 0) as UnsetContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_merge_update;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterMerge_update) {
	 		listener.enterMerge_update(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitMerge_update) {
	 		listener.exitMerge_update(this);
		}
	}
}


export class Merge_deleteContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public opt_where(): Opt_whereContext {
		return this.getTypedRuleContext(Opt_whereContext, 0) as Opt_whereContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_merge_delete;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterMerge_delete) {
	 		listener.enterMerge_delete(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitMerge_delete) {
	 		listener.exitMerge_delete(this);
		}
	}
}


export class Merge_insertContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public opt_where(): Opt_whereContext {
		return this.getTypedRuleContext(Opt_whereContext, 0) as Opt_whereContext;
	}
	public key_val_expr(): Key_val_exprContext {
		return this.getTypedRuleContext(Key_val_exprContext, 0) as Key_val_exprContext;
	}
	public key_val_options_expr(): Key_val_options_exprContext {
		return this.getTypedRuleContext(Key_val_options_exprContext, 0) as Key_val_options_exprContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public key_val_options_expr_header(): Key_val_options_expr_headerContext {
		return this.getTypedRuleContext(Key_val_options_expr_headerContext, 0) as Key_val_options_expr_headerContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_merge_insert;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterMerge_insert) {
	 		listener.enterMerge_insert(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitMerge_insert) {
	 		listener.exitMerge_insert(this);
		}
	}
}


export class Create_userContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CREATE(): TerminalNode {
		return this.getToken(n1qlParser.CREATE, 0);
	}
	public USER(): TerminalNode {
		return this.getToken(n1qlParser.USER, 0);
	}
	public user(): UserContext {
		return this.getTypedRuleContext(UserContext, 0) as UserContext;
	}
	public user_opts(): User_optsContext {
		return this.getTypedRuleContext(User_optsContext, 0) as User_optsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_create_user;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCreate_user) {
	 		listener.enterCreate_user(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCreate_user) {
	 		listener.exitCreate_user(this);
		}
	}
}


export class Alter_userContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ALTER(): TerminalNode {
		return this.getToken(n1qlParser.ALTER, 0);
	}
	public USER(): TerminalNode {
		return this.getToken(n1qlParser.USER, 0);
	}
	public user(): UserContext {
		return this.getTypedRuleContext(UserContext, 0) as UserContext;
	}
	public user_opts(): User_optsContext {
		return this.getTypedRuleContext(User_optsContext, 0) as User_optsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_alter_user;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterAlter_user) {
	 		listener.enterAlter_user(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitAlter_user) {
	 		listener.exitAlter_user(this);
		}
	}
}


export class Drop_userContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DROP(): TerminalNode {
		return this.getToken(n1qlParser.DROP, 0);
	}
	public USER(): TerminalNode {
		return this.getToken(n1qlParser.USER, 0);
	}
	public user(): UserContext {
		return this.getTypedRuleContext(UserContext, 0) as UserContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_drop_user;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterDrop_user) {
	 		listener.enterDrop_user(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitDrop_user) {
	 		listener.exitDrop_user(this);
		}
	}
}


export class User_optsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public user_opts(): User_optsContext {
		return this.getTypedRuleContext(User_optsContext, 0) as User_optsContext;
	}
	public user_opt(): User_optContext {
		return this.getTypedRuleContext(User_optContext, 0) as User_optContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_user_opts;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUser_opts) {
	 		listener.enterUser_opts(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUser_opts) {
	 		listener.exitUser_opts(this);
		}
	}
}


export class Param_or_strContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public param_expr(): Param_exprContext {
		return this.getTypedRuleContext(Param_exprContext, 0) as Param_exprContext;
	}
	public STR(): TerminalNode {
		return this.getToken(n1qlParser.STR, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_param_or_str;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterParam_or_str) {
	 		listener.enterParam_or_str(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitParam_or_str) {
	 		listener.exitParam_or_str(this);
		}
	}
}


export class User_optContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PASSWORD(): TerminalNode {
		return this.getToken(n1qlParser.PASSWORD, 0);
	}
	public param_or_str(): Param_or_strContext {
		return this.getTypedRuleContext(Param_or_strContext, 0) as Param_or_strContext;
	}
	public WITH(): TerminalNode {
		return this.getToken(n1qlParser.WITH, 0);
	}
	public STR(): TerminalNode {
		return this.getToken(n1qlParser.STR, 0);
	}
	public GROUPS(): TerminalNode {
		return this.getToken(n1qlParser.GROUPS, 0);
	}
	public groups(): GroupsContext {
		return this.getTypedRuleContext(GroupsContext, 0) as GroupsContext;
	}
	public GROUP(): TerminalNode {
		return this.getToken(n1qlParser.GROUP, 0);
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public NO(): TerminalNode {
		return this.getToken(n1qlParser.NO, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_user_opt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUser_opt) {
	 		listener.enterUser_opt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUser_opt) {
	 		listener.exitUser_opt(this);
		}
	}
}


export class GroupsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public groups(): GroupsContext {
		return this.getTypedRuleContext(GroupsContext, 0) as GroupsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_groups;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterGroups) {
	 		listener.enterGroups(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitGroups) {
	 		listener.exitGroups(this);
		}
	}
}


export class Create_groupContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CREATE(): TerminalNode {
		return this.getToken(n1qlParser.CREATE, 0);
	}
	public GROUP(): TerminalNode {
		return this.getToken(n1qlParser.GROUP, 0);
	}
	public group_name(): Group_nameContext {
		return this.getTypedRuleContext(Group_nameContext, 0) as Group_nameContext;
	}
	public group_opts(): Group_optsContext {
		return this.getTypedRuleContext(Group_optsContext, 0) as Group_optsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_create_group;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCreate_group) {
	 		listener.enterCreate_group(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCreate_group) {
	 		listener.exitCreate_group(this);
		}
	}
}


export class Alter_groupContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ALTER(): TerminalNode {
		return this.getToken(n1qlParser.ALTER, 0);
	}
	public GROUP(): TerminalNode {
		return this.getToken(n1qlParser.GROUP, 0);
	}
	public group_name(): Group_nameContext {
		return this.getTypedRuleContext(Group_nameContext, 0) as Group_nameContext;
	}
	public group_opts(): Group_optsContext {
		return this.getTypedRuleContext(Group_optsContext, 0) as Group_optsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_alter_group;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterAlter_group) {
	 		listener.enterAlter_group(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitAlter_group) {
	 		listener.exitAlter_group(this);
		}
	}
}


export class Drop_groupContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DROP(): TerminalNode {
		return this.getToken(n1qlParser.DROP, 0);
	}
	public GROUP(): TerminalNode {
		return this.getToken(n1qlParser.GROUP, 0);
	}
	public group_name(): Group_nameContext {
		return this.getTypedRuleContext(Group_nameContext, 0) as Group_nameContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_drop_group;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterDrop_group) {
	 		listener.enterDrop_group(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitDrop_group) {
	 		listener.exitDrop_group(this);
		}
	}
}


export class Group_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_group_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterGroup_name) {
	 		listener.enterGroup_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitGroup_name) {
	 		listener.exitGroup_name(this);
		}
	}
}


export class Group_optsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public group_opts(): Group_optsContext {
		return this.getTypedRuleContext(Group_optsContext, 0) as Group_optsContext;
	}
	public group_opt(): Group_optContext {
		return this.getTypedRuleContext(Group_optContext, 0) as Group_optContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_group_opts;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterGroup_opts) {
	 		listener.enterGroup_opts(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitGroup_opts) {
	 		listener.exitGroup_opts(this);
		}
	}
}


export class Group_optContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WITH(): TerminalNode {
		return this.getToken(n1qlParser.WITH, 0);
	}
	public STR(): TerminalNode {
		return this.getToken(n1qlParser.STR, 0);
	}
	public ROLES(): TerminalNode {
		return this.getToken(n1qlParser.ROLES, 0);
	}
	public group_role_list(): Group_role_listContext {
		return this.getTypedRuleContext(Group_role_listContext, 0) as Group_role_listContext;
	}
	public NO(): TerminalNode {
		return this.getToken(n1qlParser.NO, 0);
	}
	public ROLE(): TerminalNode {
		return this.getToken(n1qlParser.ROLE, 0);
	}
	public group_role_list_item(): Group_role_list_itemContext {
		return this.getTypedRuleContext(Group_role_list_itemContext, 0) as Group_role_list_itemContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_group_opt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterGroup_opt) {
	 		listener.enterGroup_opt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitGroup_opt) {
	 		listener.exitGroup_opt(this);
		}
	}
}


export class Group_role_listContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public group_role_list_item(): Group_role_list_itemContext {
		return this.getTypedRuleContext(Group_role_list_itemContext, 0) as Group_role_list_itemContext;
	}
	public group_role_list(): Group_role_listContext {
		return this.getTypedRuleContext(Group_role_listContext, 0) as Group_role_listContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_group_role_list;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterGroup_role_list) {
	 		listener.enterGroup_role_list(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitGroup_role_list) {
	 		listener.exitGroup_role_list(this);
		}
	}
}


export class Group_role_list_itemContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public role_name(): Role_nameContext {
		return this.getTypedRuleContext(Role_nameContext, 0) as Role_nameContext;
	}
	public ON(): TerminalNode {
		return this.getToken(n1qlParser.ON, 0);
	}
	public keyspace_scope(): Keyspace_scopeContext {
		return this.getTypedRuleContext(Keyspace_scopeContext, 0) as Keyspace_scopeContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_group_role_list_item;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterGroup_role_list_item) {
	 		listener.enterGroup_role_list_item(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitGroup_role_list_item) {
	 		listener.exitGroup_role_list_item(this);
		}
	}
}


export class Group_or_groupsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public GROUP(): TerminalNode {
		return this.getToken(n1qlParser.GROUP, 0);
	}
	public GROUPS(): TerminalNode {
		return this.getToken(n1qlParser.GROUPS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_group_or_groups;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterGroup_or_groups) {
	 		listener.enterGroup_or_groups(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitGroup_or_groups) {
	 		listener.exitGroup_or_groups(this);
		}
	}
}


export class User_usersContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public USER(): TerminalNode {
		return this.getToken(n1qlParser.USER, 0);
	}
	public USERS(): TerminalNode {
		return this.getToken(n1qlParser.USERS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_user_users;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUser_users) {
	 		listener.enterUser_users(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUser_users) {
	 		listener.exitUser_users(this);
		}
	}
}


export class Grant_roleContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public GRANT(): TerminalNode {
		return this.getToken(n1qlParser.GRANT, 0);
	}
	public role_list(): Role_listContext {
		return this.getTypedRuleContext(Role_listContext, 0) as Role_listContext;
	}
	public TO(): TerminalNode {
		return this.getToken(n1qlParser.TO, 0);
	}
	public user_list(): User_listContext {
		return this.getTypedRuleContext(User_listContext, 0) as User_listContext;
	}
	public ON(): TerminalNode {
		return this.getToken(n1qlParser.ON, 0);
	}
	public keyspace_scope_list(): Keyspace_scope_listContext {
		return this.getTypedRuleContext(Keyspace_scope_listContext, 0) as Keyspace_scope_listContext;
	}
	public user_users(): User_usersContext {
		return this.getTypedRuleContext(User_usersContext, 0) as User_usersContext;
	}
	public group_or_groups(): Group_or_groupsContext {
		return this.getTypedRuleContext(Group_or_groupsContext, 0) as Group_or_groupsContext;
	}
	public groups(): GroupsContext {
		return this.getTypedRuleContext(GroupsContext, 0) as GroupsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_grant_role;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterGrant_role) {
	 		listener.enterGrant_role(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitGrant_role) {
	 		listener.exitGrant_role(this);
		}
	}
}


export class Role_listContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public role_name(): Role_nameContext {
		return this.getTypedRuleContext(Role_nameContext, 0) as Role_nameContext;
	}
	public role_list(): Role_listContext {
		return this.getTypedRuleContext(Role_listContext, 0) as Role_listContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_role_list;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterRole_list) {
	 		listener.enterRole_list(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitRole_list) {
	 		listener.exitRole_list(this);
		}
	}
}


export class Role_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public SELECT(): TerminalNode {
		return this.getToken(n1qlParser.SELECT, 0);
	}
	public INSERT(): TerminalNode {
		return this.getToken(n1qlParser.INSERT, 0);
	}
	public UPDATE(): TerminalNode {
		return this.getToken(n1qlParser.UPDATE, 0);
	}
	public DELETE_(): TerminalNode {
		return this.getToken(n1qlParser.DELETE_, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_role_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterRole_name) {
	 		listener.enterRole_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitRole_name) {
	 		listener.exitRole_name(this);
		}
	}
}


export class Keyspace_scope_listContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public keyspace_scope(): Keyspace_scopeContext {
		return this.getTypedRuleContext(Keyspace_scopeContext, 0) as Keyspace_scopeContext;
	}
	public keyspace_scope_list(): Keyspace_scope_listContext {
		return this.getTypedRuleContext(Keyspace_scope_listContext, 0) as Keyspace_scope_listContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_keyspace_scope_list;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterKeyspace_scope_list) {
	 		listener.enterKeyspace_scope_list(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitKeyspace_scope_list) {
	 		listener.exitKeyspace_scope_list(this);
		}
	}
}


export class Keyspace_scopeContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public keyspace_name(): Keyspace_nameContext {
		return this.getTypedRuleContext(Keyspace_nameContext, 0) as Keyspace_nameContext;
	}
	public path_part_list(): Path_partContext[] {
		return this.getTypedRuleContexts(Path_partContext) as Path_partContext[];
	}
	public path_part(i: number): Path_partContext {
		return this.getTypedRuleContext(Path_partContext, i) as Path_partContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(n1qlParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(n1qlParser.DOT, i);
	}
	public namespace_name(): Namespace_nameContext {
		return this.getTypedRuleContext(Namespace_nameContext, 0) as Namespace_nameContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_keyspace_scope;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterKeyspace_scope) {
	 		listener.enterKeyspace_scope(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitKeyspace_scope) {
	 		listener.exitKeyspace_scope(this);
		}
	}
}


export class User_listContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public user(): UserContext {
		return this.getTypedRuleContext(UserContext, 0) as UserContext;
	}
	public user_list(): User_listContext {
		return this.getTypedRuleContext(User_listContext, 0) as User_listContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_user_list;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUser_list) {
	 		listener.enterUser_list(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUser_list) {
	 		listener.exitUser_list(this);
		}
	}
}


export class UserContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers_list(): Permitted_identifiersContext[] {
		return this.getTypedRuleContexts(Permitted_identifiersContext) as Permitted_identifiersContext[];
	}
	public permitted_identifiers(i: number): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, i) as Permitted_identifiersContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(n1qlParser.COLON, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_user;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUser) {
	 		listener.enterUser(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUser) {
	 		listener.exitUser(this);
		}
	}
}


export class Revoke_roleContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public REVOKE(): TerminalNode {
		return this.getToken(n1qlParser.REVOKE, 0);
	}
	public role_list(): Role_listContext {
		return this.getTypedRuleContext(Role_listContext, 0) as Role_listContext;
	}
	public FROM(): TerminalNode {
		return this.getToken(n1qlParser.FROM, 0);
	}
	public user_list(): User_listContext {
		return this.getTypedRuleContext(User_listContext, 0) as User_listContext;
	}
	public ON(): TerminalNode {
		return this.getToken(n1qlParser.ON, 0);
	}
	public keyspace_scope_list(): Keyspace_scope_listContext {
		return this.getTypedRuleContext(Keyspace_scope_listContext, 0) as Keyspace_scope_listContext;
	}
	public user_users(): User_usersContext {
		return this.getTypedRuleContext(User_usersContext, 0) as User_usersContext;
	}
	public group_or_groups(): Group_or_groupsContext {
		return this.getTypedRuleContext(Group_or_groupsContext, 0) as Group_or_groupsContext;
	}
	public groups(): GroupsContext {
		return this.getTypedRuleContext(GroupsContext, 0) as GroupsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_revoke_role;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterRevoke_role) {
	 		listener.enterRevoke_role(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitRevoke_role) {
	 		listener.exitRevoke_role(this);
		}
	}
}


export class Opt_def_with_clauseContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public opt_with_clause(): Opt_with_clauseContext {
		return this.getTypedRuleContext(Opt_with_clauseContext, 0) as Opt_with_clauseContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_def_with_clause;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_def_with_clause) {
	 		listener.enterOpt_def_with_clause(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_def_with_clause) {
	 		listener.exitOpt_def_with_clause(this);
		}
	}
}


export class Create_bucketContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CREATE(): TerminalNode {
		return this.getToken(n1qlParser.CREATE, 0);
	}
	public BUCKET(): TerminalNode {
		return this.getToken(n1qlParser.BUCKET, 0);
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public opt_if_not_exists(): Opt_if_not_existsContext {
		return this.getTypedRuleContext(Opt_if_not_existsContext, 0) as Opt_if_not_existsContext;
	}
	public opt_def_with_clause(): Opt_def_with_clauseContext {
		return this.getTypedRuleContext(Opt_def_with_clauseContext, 0) as Opt_def_with_clauseContext;
	}
	public IF(): TerminalNode {
		return this.getToken(n1qlParser.IF, 0);
	}
	public NOT(): TerminalNode {
		return this.getToken(n1qlParser.NOT, 0);
	}
	public EXISTS(): TerminalNode {
		return this.getToken(n1qlParser.EXISTS, 0);
	}
	public DATABASE(): TerminalNode {
		return this.getToken(n1qlParser.DATABASE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_create_bucket;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCreate_bucket) {
	 		listener.enterCreate_bucket(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCreate_bucket) {
	 		listener.exitCreate_bucket(this);
		}
	}
}


export class Alter_bucketContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ALTER(): TerminalNode {
		return this.getToken(n1qlParser.ALTER, 0);
	}
	public BUCKET(): TerminalNode {
		return this.getToken(n1qlParser.BUCKET, 0);
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public with_clause(): With_clauseContext {
		return this.getTypedRuleContext(With_clauseContext, 0) as With_clauseContext;
	}
	public DATABASE(): TerminalNode {
		return this.getToken(n1qlParser.DATABASE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_alter_bucket;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterAlter_bucket) {
	 		listener.enterAlter_bucket(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitAlter_bucket) {
	 		listener.exitAlter_bucket(this);
		}
	}
}


export class Drop_bucketContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DROP(): TerminalNode {
		return this.getToken(n1qlParser.DROP, 0);
	}
	public BUCKET(): TerminalNode {
		return this.getToken(n1qlParser.BUCKET, 0);
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public opt_if_exists(): Opt_if_existsContext {
		return this.getTypedRuleContext(Opt_if_existsContext, 0) as Opt_if_existsContext;
	}
	public IF(): TerminalNode {
		return this.getToken(n1qlParser.IF, 0);
	}
	public EXISTS(): TerminalNode {
		return this.getToken(n1qlParser.EXISTS, 0);
	}
	public DATABASE(): TerminalNode {
		return this.getToken(n1qlParser.DATABASE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_drop_bucket;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterDrop_bucket) {
	 		listener.enterDrop_bucket(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitDrop_bucket) {
	 		listener.exitDrop_bucket(this);
		}
	}
}


export class Create_scopeContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CREATE(): TerminalNode {
		return this.getToken(n1qlParser.CREATE, 0);
	}
	public SCOPE(): TerminalNode {
		return this.getToken(n1qlParser.SCOPE, 0);
	}
	public named_scope_ref(): Named_scope_refContext {
		return this.getTypedRuleContext(Named_scope_refContext, 0) as Named_scope_refContext;
	}
	public opt_if_not_exists(): Opt_if_not_existsContext {
		return this.getTypedRuleContext(Opt_if_not_existsContext, 0) as Opt_if_not_existsContext;
	}
	public IF(): TerminalNode {
		return this.getToken(n1qlParser.IF, 0);
	}
	public NOT(): TerminalNode {
		return this.getToken(n1qlParser.NOT, 0);
	}
	public EXISTS(): TerminalNode {
		return this.getToken(n1qlParser.EXISTS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_create_scope;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCreate_scope) {
	 		listener.enterCreate_scope(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCreate_scope) {
	 		listener.exitCreate_scope(this);
		}
	}
}


export class Drop_scopeContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DROP(): TerminalNode {
		return this.getToken(n1qlParser.DROP, 0);
	}
	public SCOPE(): TerminalNode {
		return this.getToken(n1qlParser.SCOPE, 0);
	}
	public named_scope_ref(): Named_scope_refContext {
		return this.getTypedRuleContext(Named_scope_refContext, 0) as Named_scope_refContext;
	}
	public opt_if_exists(): Opt_if_existsContext {
		return this.getTypedRuleContext(Opt_if_existsContext, 0) as Opt_if_existsContext;
	}
	public IF(): TerminalNode {
		return this.getToken(n1qlParser.IF, 0);
	}
	public EXISTS(): TerminalNode {
		return this.getToken(n1qlParser.EXISTS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_drop_scope;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterDrop_scope) {
	 		listener.enterDrop_scope(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitDrop_scope) {
	 		listener.exitDrop_scope(this);
		}
	}
}


export class Create_collectionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CREATE(): TerminalNode {
		return this.getToken(n1qlParser.CREATE, 0);
	}
	public COLLECTION(): TerminalNode {
		return this.getToken(n1qlParser.COLLECTION, 0);
	}
	public named_keyspace_ref(): Named_keyspace_refContext {
		return this.getTypedRuleContext(Named_keyspace_refContext, 0) as Named_keyspace_refContext;
	}
	public opt_if_not_exists(): Opt_if_not_existsContext {
		return this.getTypedRuleContext(Opt_if_not_existsContext, 0) as Opt_if_not_existsContext;
	}
	public opt_with_clause(): Opt_with_clauseContext {
		return this.getTypedRuleContext(Opt_with_clauseContext, 0) as Opt_with_clauseContext;
	}
	public IF(): TerminalNode {
		return this.getToken(n1qlParser.IF, 0);
	}
	public NOT(): TerminalNode {
		return this.getToken(n1qlParser.NOT, 0);
	}
	public EXISTS(): TerminalNode {
		return this.getToken(n1qlParser.EXISTS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_create_collection;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCreate_collection) {
	 		listener.enterCreate_collection(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCreate_collection) {
	 		listener.exitCreate_collection(this);
		}
	}
}


export class Drop_collectionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DROP(): TerminalNode {
		return this.getToken(n1qlParser.DROP, 0);
	}
	public COLLECTION(): TerminalNode {
		return this.getToken(n1qlParser.COLLECTION, 0);
	}
	public named_keyspace_ref(): Named_keyspace_refContext {
		return this.getTypedRuleContext(Named_keyspace_refContext, 0) as Named_keyspace_refContext;
	}
	public opt_if_exists(): Opt_if_existsContext {
		return this.getTypedRuleContext(Opt_if_existsContext, 0) as Opt_if_existsContext;
	}
	public IF(): TerminalNode {
		return this.getToken(n1qlParser.IF, 0);
	}
	public EXISTS(): TerminalNode {
		return this.getToken(n1qlParser.EXISTS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_drop_collection;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterDrop_collection) {
	 		listener.enterDrop_collection(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitDrop_collection) {
	 		listener.exitDrop_collection(this);
		}
	}
}


export class Flush_collectionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public flush_or_truncate(): Flush_or_truncateContext {
		return this.getTypedRuleContext(Flush_or_truncateContext, 0) as Flush_or_truncateContext;
	}
	public COLLECTION(): TerminalNode {
		return this.getToken(n1qlParser.COLLECTION, 0);
	}
	public named_keyspace_ref(): Named_keyspace_refContext {
		return this.getTypedRuleContext(Named_keyspace_refContext, 0) as Named_keyspace_refContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_flush_collection;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFlush_collection) {
	 		listener.enterFlush_collection(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFlush_collection) {
	 		listener.exitFlush_collection(this);
		}
	}
}


export class Flush_or_truncateContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FLUSH(): TerminalNode {
		return this.getToken(n1qlParser.FLUSH, 0);
	}
	public TRUNCATE(): TerminalNode {
		return this.getToken(n1qlParser.TRUNCATE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_flush_or_truncate;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFlush_or_truncate) {
	 		listener.enterFlush_or_truncate(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFlush_or_truncate) {
	 		listener.exitFlush_or_truncate(this);
		}
	}
}


export class Create_indexContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CREATE(): TerminalNode {
		return this.getToken(n1qlParser.CREATE, 0);
	}
	public PRIMARY(): TerminalNode {
		return this.getToken(n1qlParser.PRIMARY, 0);
	}
	public INDEX(): TerminalNode {
		return this.getToken(n1qlParser.INDEX, 0);
	}
	public opt_if_not_exists(): Opt_if_not_existsContext {
		return this.getTypedRuleContext(Opt_if_not_existsContext, 0) as Opt_if_not_existsContext;
	}
	public ON(): TerminalNode {
		return this.getToken(n1qlParser.ON, 0);
	}
	public named_keyspace_ref(): Named_keyspace_refContext {
		return this.getTypedRuleContext(Named_keyspace_refContext, 0) as Named_keyspace_refContext;
	}
	public opt_index_partition(): Opt_index_partitionContext {
		return this.getTypedRuleContext(Opt_index_partitionContext, 0) as Opt_index_partitionContext;
	}
	public opt_index_using(): Opt_index_usingContext {
		return this.getTypedRuleContext(Opt_index_usingContext, 0) as Opt_index_usingContext;
	}
	public opt_with_clause(): Opt_with_clauseContext {
		return this.getTypedRuleContext(Opt_with_clauseContext, 0) as Opt_with_clauseContext;
	}
	public index_name(): Index_nameContext {
		return this.getTypedRuleContext(Index_nameContext, 0) as Index_nameContext;
	}
	public IF(): TerminalNode {
		return this.getToken(n1qlParser.IF, 0);
	}
	public NOT(): TerminalNode {
		return this.getToken(n1qlParser.NOT, 0);
	}
	public EXISTS(): TerminalNode {
		return this.getToken(n1qlParser.EXISTS, 0);
	}
	public opt_vector(): Opt_vectorContext {
		return this.getTypedRuleContext(Opt_vectorContext, 0) as Opt_vectorContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public index_terms(): Index_termsContext {
		return this.getTypedRuleContext(Index_termsContext, 0) as Index_termsContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
	public opt_index_where(): Opt_index_whereContext {
		return this.getTypedRuleContext(Opt_index_whereContext, 0) as Opt_index_whereContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_create_index;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCreate_index) {
	 		listener.enterCreate_index(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCreate_index) {
	 		listener.exitCreate_index(this);
		}
	}
}


export class Opt_vectorContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public VECTOR(): TerminalNode {
		return this.getToken(n1qlParser.VECTOR, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_vector;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_vector) {
	 		listener.enterOpt_vector(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_vector) {
	 		listener.exitOpt_vector(this);
		}
	}
}


export class Index_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_index_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterIndex_name) {
	 		listener.enterIndex_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitIndex_name) {
	 		listener.exitIndex_name(this);
		}
	}
}


export class Opt_index_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public index_name(): Index_nameContext {
		return this.getTypedRuleContext(Index_nameContext, 0) as Index_nameContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_index_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_index_name) {
	 		listener.enterOpt_index_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_index_name) {
	 		listener.exitOpt_index_name(this);
		}
	}
}


export class Opt_if_not_existsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IF(): TerminalNode {
		return this.getToken(n1qlParser.IF, 0);
	}
	public NOT(): TerminalNode {
		return this.getToken(n1qlParser.NOT, 0);
	}
	public EXISTS(): TerminalNode {
		return this.getToken(n1qlParser.EXISTS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_if_not_exists;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_if_not_exists) {
	 		listener.enterOpt_if_not_exists(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_if_not_exists) {
	 		listener.exitOpt_if_not_exists(this);
		}
	}
}


export class Named_keyspace_refContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simple_named_keyspace_ref(): Simple_named_keyspace_refContext {
		return this.getTypedRuleContext(Simple_named_keyspace_refContext, 0) as Simple_named_keyspace_refContext;
	}
	public namespace_name(): Namespace_nameContext {
		return this.getTypedRuleContext(Namespace_nameContext, 0) as Namespace_nameContext;
	}
	public path_part_list(): Path_partContext[] {
		return this.getTypedRuleContexts(Path_partContext) as Path_partContext[];
	}
	public path_part(i: number): Path_partContext {
		return this.getTypedRuleContext(Path_partContext, i) as Path_partContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(n1qlParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(n1qlParser.DOT, i);
	}
	public keyspace_name(): Keyspace_nameContext {
		return this.getTypedRuleContext(Keyspace_nameContext, 0) as Keyspace_nameContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_named_keyspace_ref;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterNamed_keyspace_ref) {
	 		listener.enterNamed_keyspace_ref(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitNamed_keyspace_ref) {
	 		listener.exitNamed_keyspace_ref(this);
		}
	}
}


export class Simple_named_keyspace_refContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public keyspace_name(): Keyspace_nameContext {
		return this.getTypedRuleContext(Keyspace_nameContext, 0) as Keyspace_nameContext;
	}
	public namespace_name(): Namespace_nameContext {
		return this.getTypedRuleContext(Namespace_nameContext, 0) as Namespace_nameContext;
	}
	public path_part_list(): Path_partContext[] {
		return this.getTypedRuleContexts(Path_partContext) as Path_partContext[];
	}
	public path_part(i: number): Path_partContext {
		return this.getTypedRuleContext(Path_partContext, i) as Path_partContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(n1qlParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(n1qlParser.DOT, i);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_simple_named_keyspace_ref;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSimple_named_keyspace_ref) {
	 		listener.enterSimple_named_keyspace_ref(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSimple_named_keyspace_ref) {
	 		listener.exitSimple_named_keyspace_ref(this);
		}
	}
}


export class Named_scope_refContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public namespace_name(): Namespace_nameContext {
		return this.getTypedRuleContext(Namespace_nameContext, 0) as Namespace_nameContext;
	}
	public path_part_list(): Path_partContext[] {
		return this.getTypedRuleContexts(Path_partContext) as Path_partContext[];
	}
	public path_part(i: number): Path_partContext {
		return this.getTypedRuleContext(Path_partContext, i) as Path_partContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(n1qlParser.DOT, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_named_scope_ref;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterNamed_scope_ref) {
	 		listener.enterNamed_scope_ref(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitNamed_scope_ref) {
	 		listener.exitNamed_scope_ref(this);
		}
	}
}


export class Opt_index_partitionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PARTITION(): TerminalNode {
		return this.getToken(n1qlParser.PARTITION, 0);
	}
	public BY(): TerminalNode {
		return this.getToken(n1qlParser.BY, 0);
	}
	public HASH(): TerminalNode {
		return this.getToken(n1qlParser.HASH, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public exprs(): ExprsContext {
		return this.getTypedRuleContext(ExprsContext, 0) as ExprsContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_index_partition;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_index_partition) {
	 		listener.enterOpt_index_partition(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_index_partition) {
	 		listener.exitOpt_index_partition(this);
		}
	}
}


export class Opt_index_usingContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public index_using(): Index_usingContext {
		return this.getTypedRuleContext(Index_usingContext, 0) as Index_usingContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_index_using;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_index_using) {
	 		listener.enterOpt_index_using(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_index_using) {
	 		listener.exitOpt_index_using(this);
		}
	}
}


export class Index_usingContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public USING(): TerminalNode {
		return this.getToken(n1qlParser.USING, 0);
	}
	public VIEW(): TerminalNode {
		return this.getToken(n1qlParser.VIEW, 0);
	}
	public GSI(): TerminalNode {
		return this.getToken(n1qlParser.GSI, 0);
	}
	public FTS(): TerminalNode {
		return this.getToken(n1qlParser.FTS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_index_using;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterIndex_using) {
	 		listener.enterIndex_using(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitIndex_using) {
	 		listener.exitIndex_using(this);
		}
	}
}


export class Index_termsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public index_term(): Index_termContext {
		return this.getTypedRuleContext(Index_termContext, 0) as Index_termContext;
	}
	public index_terms(): Index_termsContext {
		return this.getTypedRuleContext(Index_termsContext, 0) as Index_termsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_index_terms;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterIndex_terms) {
	 		listener.enterIndex_terms(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitIndex_terms) {
	 		listener.exitIndex_terms(this);
		}
	}
}


export class Index_termContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public index_term_expr(): Index_term_exprContext {
		return this.getTypedRuleContext(Index_term_exprContext, 0) as Index_term_exprContext;
	}
	public opt_ikattr(): Opt_ikattrContext {
		return this.getTypedRuleContext(Opt_ikattrContext, 0) as Opt_ikattrContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_index_term;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterIndex_term) {
	 		listener.enterIndex_term(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitIndex_term) {
	 		listener.exitIndex_term(this);
		}
	}
}


export class Index_term_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public all_expr(): All_exprContext {
		return this.getTypedRuleContext(All_exprContext, 0) as All_exprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_index_term_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterIndex_term_expr) {
	 		listener.enterIndex_term_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitIndex_term_expr) {
	 		listener.exitIndex_term_expr(this);
		}
	}
}


export class All_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public all(): AllContext {
		return this.getTypedRuleContext(AllContext, 0) as AllContext;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public DISTINCT(): TerminalNode {
		return this.getToken(n1qlParser.DISTINCT, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_all_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterAll_expr) {
	 		listener.enterAll_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitAll_expr) {
	 		listener.exitAll_expr(this);
		}
	}
}


export class AllContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ALL(): TerminalNode {
		return this.getToken(n1qlParser.ALL, 0);
	}
	public EACH(): TerminalNode {
		return this.getToken(n1qlParser.EACH, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_all;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterAll) {
	 		listener.enterAll(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitAll) {
	 		listener.exitAll(this);
		}
	}
}


export class Flatten_keys_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public opt_ikattr(): Opt_ikattrContext {
		return this.getTypedRuleContext(Opt_ikattrContext, 0) as Opt_ikattrContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_flatten_keys_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFlatten_keys_expr) {
	 		listener.enterFlatten_keys_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFlatten_keys_expr) {
	 		listener.exitFlatten_keys_expr(this);
		}
	}
}


export class Flatten_keys_exprsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public flatten_keys_expr(): Flatten_keys_exprContext {
		return this.getTypedRuleContext(Flatten_keys_exprContext, 0) as Flatten_keys_exprContext;
	}
	public flatten_keys_exprs(): Flatten_keys_exprsContext {
		return this.getTypedRuleContext(Flatten_keys_exprsContext, 0) as Flatten_keys_exprsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_flatten_keys_exprs;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFlatten_keys_exprs) {
	 		listener.enterFlatten_keys_exprs(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFlatten_keys_exprs) {
	 		listener.exitFlatten_keys_exprs(this);
		}
	}
}


export class Opt_flatten_keys_exprsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public flatten_keys_exprs(): Flatten_keys_exprsContext {
		return this.getTypedRuleContext(Flatten_keys_exprsContext, 0) as Flatten_keys_exprsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_flatten_keys_exprs;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_flatten_keys_exprs) {
	 		listener.enterOpt_flatten_keys_exprs(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_flatten_keys_exprs) {
	 		listener.exitOpt_flatten_keys_exprs(this);
		}
	}
}


export class Opt_index_whereContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WHERE(): TerminalNode {
		return this.getToken(n1qlParser.WHERE, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_index_where;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_index_where) {
	 		listener.enterOpt_index_where(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_index_where) {
	 		listener.exitOpt_index_where(this);
		}
	}
}


export class Opt_ikattrContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ikattr_list(): IkattrContext[] {
		return this.getTypedRuleContexts(IkattrContext) as IkattrContext[];
	}
	public ikattr(i: number): IkattrContext {
		return this.getTypedRuleContext(IkattrContext, i) as IkattrContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_ikattr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_ikattr) {
	 		listener.enterOpt_ikattr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_ikattr) {
	 		listener.exitOpt_ikattr(this);
		}
	}
}


export class IkattrContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ASC(): TerminalNode {
		return this.getToken(n1qlParser.ASC, 0);
	}
	public DESC(): TerminalNode {
		return this.getToken(n1qlParser.DESC, 0);
	}
	public INCLUDE(): TerminalNode {
		return this.getToken(n1qlParser.INCLUDE, 0);
	}
	public MISSING(): TerminalNode {
		return this.getToken(n1qlParser.MISSING, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_ikattr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterIkattr) {
	 		listener.enterIkattr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitIkattr) {
	 		listener.exitIkattr(this);
		}
	}
}


export class Drop_indexContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DROP(): TerminalNode {
		return this.getToken(n1qlParser.DROP, 0);
	}
	public PRIMARY(): TerminalNode {
		return this.getToken(n1qlParser.PRIMARY, 0);
	}
	public INDEX(): TerminalNode {
		return this.getToken(n1qlParser.INDEX, 0);
	}
	public opt_if_exists(): Opt_if_existsContext {
		return this.getTypedRuleContext(Opt_if_existsContext, 0) as Opt_if_existsContext;
	}
	public ON(): TerminalNode {
		return this.getToken(n1qlParser.ON, 0);
	}
	public named_keyspace_ref(): Named_keyspace_refContext {
		return this.getTypedRuleContext(Named_keyspace_refContext, 0) as Named_keyspace_refContext;
	}
	public opt_index_using(): Opt_index_usingContext {
		return this.getTypedRuleContext(Opt_index_usingContext, 0) as Opt_index_usingContext;
	}
	public index_name(): Index_nameContext {
		return this.getTypedRuleContext(Index_nameContext, 0) as Index_nameContext;
	}
	public IF(): TerminalNode {
		return this.getToken(n1qlParser.IF, 0);
	}
	public EXISTS(): TerminalNode {
		return this.getToken(n1qlParser.EXISTS, 0);
	}
	public opt_vector(): Opt_vectorContext {
		return this.getTypedRuleContext(Opt_vectorContext, 0) as Opt_vectorContext;
	}
	public simple_named_keyspace_ref(): Simple_named_keyspace_refContext {
		return this.getTypedRuleContext(Simple_named_keyspace_refContext, 0) as Simple_named_keyspace_refContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(n1qlParser.DOT, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_drop_index;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterDrop_index) {
	 		listener.enterDrop_index(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitDrop_index) {
	 		listener.exitDrop_index(this);
		}
	}
}


export class Opt_if_existsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IF(): TerminalNode {
		return this.getToken(n1qlParser.IF, 0);
	}
	public EXISTS(): TerminalNode {
		return this.getToken(n1qlParser.EXISTS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_if_exists;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_if_exists) {
	 		listener.enterOpt_if_exists(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_if_exists) {
	 		listener.exitOpt_if_exists(this);
		}
	}
}


export class Alter_indexContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ALTER(): TerminalNode {
		return this.getToken(n1qlParser.ALTER, 0);
	}
	public INDEX(): TerminalNode {
		return this.getToken(n1qlParser.INDEX, 0);
	}
	public simple_named_keyspace_ref(): Simple_named_keyspace_refContext {
		return this.getTypedRuleContext(Simple_named_keyspace_refContext, 0) as Simple_named_keyspace_refContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(n1qlParser.DOT, 0);
	}
	public index_name(): Index_nameContext {
		return this.getTypedRuleContext(Index_nameContext, 0) as Index_nameContext;
	}
	public opt_index_using(): Opt_index_usingContext {
		return this.getTypedRuleContext(Opt_index_usingContext, 0) as Opt_index_usingContext;
	}
	public with_clause(): With_clauseContext {
		return this.getTypedRuleContext(With_clauseContext, 0) as With_clauseContext;
	}
	public ON(): TerminalNode {
		return this.getToken(n1qlParser.ON, 0);
	}
	public named_keyspace_ref(): Named_keyspace_refContext {
		return this.getTypedRuleContext(Named_keyspace_refContext, 0) as Named_keyspace_refContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_alter_index;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterAlter_index) {
	 		listener.enterAlter_index(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitAlter_index) {
	 		listener.exitAlter_index(this);
		}
	}
}


export class Build_indexContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public BUILD(): TerminalNode {
		return this.getToken(n1qlParser.BUILD, 0);
	}
	public INDEX(): TerminalNode {
		return this.getToken(n1qlParser.INDEX, 0);
	}
	public ON(): TerminalNode {
		return this.getToken(n1qlParser.ON, 0);
	}
	public named_keyspace_ref(): Named_keyspace_refContext {
		return this.getTypedRuleContext(Named_keyspace_refContext, 0) as Named_keyspace_refContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public exprs(): ExprsContext {
		return this.getTypedRuleContext(ExprsContext, 0) as ExprsContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
	public opt_index_using(): Opt_index_usingContext {
		return this.getTypedRuleContext(Opt_index_usingContext, 0) as Opt_index_usingContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_build_index;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterBuild_index) {
	 		listener.enterBuild_index(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitBuild_index) {
	 		listener.exitBuild_index(this);
		}
	}
}


export class Create_functionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CREATE(): TerminalNode {
		return this.getToken(n1qlParser.CREATE, 0);
	}
	public opt_replace(): Opt_replaceContext {
		return this.getTypedRuleContext(Opt_replaceContext, 0) as Opt_replaceContext;
	}
	public FUNCTION(): TerminalNode {
		return this.getToken(n1qlParser.FUNCTION, 0);
	}
	public opt_if_not_exists_list(): Opt_if_not_existsContext[] {
		return this.getTypedRuleContexts(Opt_if_not_existsContext) as Opt_if_not_existsContext[];
	}
	public opt_if_not_exists(i: number): Opt_if_not_existsContext {
		return this.getTypedRuleContext(Opt_if_not_existsContext, i) as Opt_if_not_existsContext;
	}
	public func_name(): Func_nameContext {
		return this.getTypedRuleContext(Func_nameContext, 0) as Func_nameContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public opt_parm_list(): Opt_parm_listContext {
		return this.getTypedRuleContext(Opt_parm_listContext, 0) as Opt_parm_listContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
	public func_body(): Func_bodyContext {
		return this.getTypedRuleContext(Func_bodyContext, 0) as Func_bodyContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_create_function;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCreate_function) {
	 		listener.enterCreate_function(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCreate_function) {
	 		listener.exitCreate_function(this);
		}
	}
}


export class Opt_replaceContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OR(): TerminalNode {
		return this.getToken(n1qlParser.OR, 0);
	}
	public REPLACE(): TerminalNode {
		return this.getToken(n1qlParser.REPLACE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_replace;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_replace) {
	 		listener.enterOpt_replace(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_replace) {
	 		listener.exitOpt_replace(this);
		}
	}
}


export class Func_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public short_func_name(): Short_func_nameContext {
		return this.getTypedRuleContext(Short_func_nameContext, 0) as Short_func_nameContext;
	}
	public long_func_name(): Long_func_nameContext {
		return this.getTypedRuleContext(Long_func_nameContext, 0) as Long_func_nameContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_func_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFunc_name) {
	 		listener.enterFunc_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFunc_name) {
	 		listener.exitFunc_name(this);
		}
	}
}


export class Short_func_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public keyspace_name(): Keyspace_nameContext {
		return this.getTypedRuleContext(Keyspace_nameContext, 0) as Keyspace_nameContext;
	}
	public path_part_list(): Path_partContext[] {
		return this.getTypedRuleContexts(Path_partContext) as Path_partContext[];
	}
	public path_part(i: number): Path_partContext {
		return this.getTypedRuleContext(Path_partContext, i) as Path_partContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(n1qlParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(n1qlParser.DOT, i);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_short_func_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterShort_func_name) {
	 		listener.enterShort_func_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitShort_func_name) {
	 		listener.exitShort_func_name(this);
		}
	}
}


export class Long_func_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public namespace_term(): Namespace_termContext {
		return this.getTypedRuleContext(Namespace_termContext, 0) as Namespace_termContext;
	}
	public keyspace_name(): Keyspace_nameContext {
		return this.getTypedRuleContext(Keyspace_nameContext, 0) as Keyspace_nameContext;
	}
	public path_part_list(): Path_partContext[] {
		return this.getTypedRuleContexts(Path_partContext) as Path_partContext[];
	}
	public path_part(i: number): Path_partContext {
		return this.getTypedRuleContext(Path_partContext, i) as Path_partContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(n1qlParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(n1qlParser.DOT, i);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_long_func_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterLong_func_name) {
	 		listener.enterLong_func_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitLong_func_name) {
	 		listener.exitLong_func_name(this);
		}
	}
}


export class Opt_parm_listContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(n1qlParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(n1qlParser.DOT, i);
	}
	public parameter_terms(): Parameter_termsContext {
		return this.getTypedRuleContext(Parameter_termsContext, 0) as Parameter_termsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_parm_list;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_parm_list) {
	 		listener.enterOpt_parm_list(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_parm_list) {
	 		listener.exitOpt_parm_list(this);
		}
	}
}


export class Parameter_termsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public parameter_terms(): Parameter_termsContext {
		return this.getTypedRuleContext(Parameter_termsContext, 0) as Parameter_termsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_parameter_terms;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterParameter_terms) {
	 		listener.enterParameter_terms(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitParameter_terms) {
	 		listener.exitParameter_terms(this);
		}
	}
}


export class Func_bodyContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LBRACE(): TerminalNode {
		return this.getToken(n1qlParser.LBRACE, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public RBRACE(): TerminalNode {
		return this.getToken(n1qlParser.RBRACE, 0);
	}
	public LANGUAGE(): TerminalNode {
		return this.getToken(n1qlParser.LANGUAGE, 0);
	}
	public INLINE(): TerminalNode {
		return this.getToken(n1qlParser.INLINE, 0);
	}
	public AS(): TerminalNode {
		return this.getToken(n1qlParser.AS, 0);
	}
	public JAVASCRIPT(): TerminalNode {
		return this.getToken(n1qlParser.JAVASCRIPT, 0);
	}
	public STR_list(): TerminalNode[] {
	    	return this.getTokens(n1qlParser.STR);
	}
	public STR(i: number): TerminalNode {
		return this.getToken(n1qlParser.STR, i);
	}
	public AT(): TerminalNode {
		return this.getToken(n1qlParser.AT, 0);
	}
	public GOLANG(): TerminalNode {
		return this.getToken(n1qlParser.GOLANG, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_func_body;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFunc_body) {
	 		listener.enterFunc_body(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFunc_body) {
	 		listener.exitFunc_body(this);
		}
	}
}


export class Drop_functionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DROP(): TerminalNode {
		return this.getToken(n1qlParser.DROP, 0);
	}
	public FUNCTION(): TerminalNode {
		return this.getToken(n1qlParser.FUNCTION, 0);
	}
	public func_name(): Func_nameContext {
		return this.getTypedRuleContext(Func_nameContext, 0) as Func_nameContext;
	}
	public opt_if_exists(): Opt_if_existsContext {
		return this.getTypedRuleContext(Opt_if_existsContext, 0) as Opt_if_existsContext;
	}
	public IF(): TerminalNode {
		return this.getToken(n1qlParser.IF, 0);
	}
	public EXISTS(): TerminalNode {
		return this.getToken(n1qlParser.EXISTS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_drop_function;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterDrop_function) {
	 		listener.enterDrop_function(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitDrop_function) {
	 		listener.exitDrop_function(this);
		}
	}
}


export class Execute_functionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EXECUTE(): TerminalNode {
		return this.getToken(n1qlParser.EXECUTE, 0);
	}
	public FUNCTION(): TerminalNode {
		return this.getToken(n1qlParser.FUNCTION, 0);
	}
	public func_name(): Func_nameContext {
		return this.getTypedRuleContext(Func_nameContext, 0) as Func_nameContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public opt_exprs(): Opt_exprsContext {
		return this.getTypedRuleContext(Opt_exprsContext, 0) as Opt_exprsContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_execute_function;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterExecute_function) {
	 		listener.enterExecute_function(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitExecute_function) {
	 		listener.exitExecute_function(this);
		}
	}
}


export class Update_statisticsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UPDATE(): TerminalNode {
		return this.getToken(n1qlParser.UPDATE, 0);
	}
	public STATISTICS(): TerminalNode {
		return this.getToken(n1qlParser.STATISTICS, 0);
	}
	public opt_for(): Opt_forContext {
		return this.getTypedRuleContext(Opt_forContext, 0) as Opt_forContext;
	}
	public named_keyspace_ref(): Named_keyspace_refContext {
		return this.getTypedRuleContext(Named_keyspace_refContext, 0) as Named_keyspace_refContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public update_stat_terms(): Update_stat_termsContext {
		return this.getTypedRuleContext(Update_stat_termsContext, 0) as Update_stat_termsContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
	public opt_with_clause(): Opt_with_clauseContext {
		return this.getTypedRuleContext(Opt_with_clauseContext, 0) as Opt_with_clauseContext;
	}
	public DELETE_(): TerminalNode {
		return this.getToken(n1qlParser.DELETE_, 0);
	}
	public ALL(): TerminalNode {
		return this.getToken(n1qlParser.ALL, 0);
	}
	public INDEX(): TerminalNode {
		return this.getToken(n1qlParser.INDEX, 0);
	}
	public exprs(): ExprsContext {
		return this.getTypedRuleContext(ExprsContext, 0) as ExprsContext;
	}
	public opt_index_using(): Opt_index_usingContext {
		return this.getTypedRuleContext(Opt_index_usingContext, 0) as Opt_index_usingContext;
	}
	public FOR(): TerminalNode {
		return this.getToken(n1qlParser.FOR, 0);
	}
	public simple_named_keyspace_ref(): Simple_named_keyspace_refContext {
		return this.getTypedRuleContext(Simple_named_keyspace_refContext, 0) as Simple_named_keyspace_refContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(n1qlParser.DOT, 0);
	}
	public index_name(): Index_nameContext {
		return this.getTypedRuleContext(Index_nameContext, 0) as Index_nameContext;
	}
	public ON(): TerminalNode {
		return this.getToken(n1qlParser.ON, 0);
	}
	public ANALYZE(): TerminalNode {
		return this.getToken(n1qlParser.ANALYZE, 0);
	}
	public opt_keyspace_collection(): Opt_keyspace_collectionContext {
		return this.getTypedRuleContext(Opt_keyspace_collectionContext, 0) as Opt_keyspace_collectionContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_update_statistics;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUpdate_statistics) {
	 		listener.enterUpdate_statistics(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUpdate_statistics) {
	 		listener.exitUpdate_statistics(this);
		}
	}
}


export class Opt_forContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FOR(): TerminalNode {
		return this.getToken(n1qlParser.FOR, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_for;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_for) {
	 		listener.enterOpt_for(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_for) {
	 		listener.exitOpt_for(this);
		}
	}
}


export class Update_stat_termsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public update_stat_term(): Update_stat_termContext {
		return this.getTypedRuleContext(Update_stat_termContext, 0) as Update_stat_termContext;
	}
	public update_stat_terms(): Update_stat_termsContext {
		return this.getTypedRuleContext(Update_stat_termsContext, 0) as Update_stat_termsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_update_stat_terms;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUpdate_stat_terms) {
	 		listener.enterUpdate_stat_terms(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUpdate_stat_terms) {
	 		listener.exitUpdate_stat_terms(this);
		}
	}
}


export class Update_stat_termContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public index_term_expr(): Index_term_exprContext {
		return this.getTypedRuleContext(Index_term_exprContext, 0) as Index_term_exprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_update_stat_term;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterUpdate_stat_term) {
	 		listener.enterUpdate_stat_term(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitUpdate_stat_term) {
	 		listener.exitUpdate_stat_term(this);
		}
	}
}


export class PathContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public path(): PathContext {
		return this.getTypedRuleContext(PathContext, 0) as PathContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(n1qlParser.DOT, 0);
	}
	public ident_icase(): Ident_icaseContext {
		return this.getTypedRuleContext(Ident_icaseContext, 0) as Ident_icaseContext;
	}
	public LBRACKET(): TerminalNode {
		return this.getToken(n1qlParser.LBRACKET, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public RBRACKET(): TerminalNode {
		return this.getToken(n1qlParser.RBRACKET, 0);
	}
	public RBRACKET_ICASE(): TerminalNode {
		return this.getToken(n1qlParser.RBRACKET_ICASE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_path;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterPath) {
	 		listener.enterPath(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitPath) {
	 		listener.exitPath(this);
		}
	}
}


export class IdentContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_ident;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterIdent) {
	 		listener.enterIdent(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitIdent) {
	 		listener.exitIdent(this);
		}
	}
}


export class Ident_icaseContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENT_ICASE(): TerminalNode {
		return this.getToken(n1qlParser.IDENT_ICASE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_ident_icase;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterIdent_icase) {
	 		listener.enterIdent_icase(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitIdent_icase) {
	 		listener.exitIdent_icase(this);
		}
	}
}


export class ExprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public c_expr(): C_exprContext {
		return this.getTypedRuleContext(C_exprContext, 0) as C_exprContext;
	}
	public NOT(): TerminalNode {
		return this.getToken(n1qlParser.NOT, 0);
	}
	public expr_list(): ExprContext[] {
		return this.getTypedRuleContexts(ExprContext) as ExprContext[];
	}
	public expr(i: number): ExprContext {
		return this.getTypedRuleContext(ExprContext, i) as ExprContext;
	}
	public EXISTS(): TerminalNode {
		return this.getToken(n1qlParser.EXISTS, 0);
	}
	public PLUS(): TerminalNode {
		return this.getToken(n1qlParser.PLUS, 0);
	}
	public MINUS(): TerminalNode {
		return this.getToken(n1qlParser.MINUS, 0);
	}
	public STAR(): TerminalNode {
		return this.getToken(n1qlParser.STAR, 0);
	}
	public DIV(): TerminalNode {
		return this.getToken(n1qlParser.DIV, 0);
	}
	public MOD(): TerminalNode {
		return this.getToken(n1qlParser.MOD, 0);
	}
	public POW(): TerminalNode {
		return this.getToken(n1qlParser.POW, 0);
	}
	public CONCAT(): TerminalNode {
		return this.getToken(n1qlParser.CONCAT, 0);
	}
	public AND(): TerminalNode {
		return this.getToken(n1qlParser.AND, 0);
	}
	public OR(): TerminalNode {
		return this.getToken(n1qlParser.OR, 0);
	}
	public EQ(): TerminalNode {
		return this.getToken(n1qlParser.EQ, 0);
	}
	public DEQ(): TerminalNode {
		return this.getToken(n1qlParser.DEQ, 0);
	}
	public NE(): TerminalNode {
		return this.getToken(n1qlParser.NE, 0);
	}
	public LT(): TerminalNode {
		return this.getToken(n1qlParser.LT, 0);
	}
	public GT(): TerminalNode {
		return this.getToken(n1qlParser.GT, 0);
	}
	public LE(): TerminalNode {
		return this.getToken(n1qlParser.LE, 0);
	}
	public GE(): TerminalNode {
		return this.getToken(n1qlParser.GE, 0);
	}
	public LIKE(): TerminalNode {
		return this.getToken(n1qlParser.LIKE, 0);
	}
	public ESCAPE(): TerminalNode {
		return this.getToken(n1qlParser.ESCAPE, 0);
	}
	public IN(): TerminalNode {
		return this.getToken(n1qlParser.IN, 0);
	}
	public WITHIN(): TerminalNode {
		return this.getToken(n1qlParser.WITHIN, 0);
	}
	public IS(): TerminalNode {
		return this.getToken(n1qlParser.IS, 0);
	}
	public DISTINCT(): TerminalNode {
		return this.getToken(n1qlParser.DISTINCT, 0);
	}
	public FROM(): TerminalNode {
		return this.getToken(n1qlParser.FROM, 0);
	}
	public DOT(): TerminalNode {
		return this.getToken(n1qlParser.DOT, 0);
	}
	public ident(): IdentContext {
		return this.getTypedRuleContext(IdentContext, 0) as IdentContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public opt_exprs(): Opt_exprsContext {
		return this.getTypedRuleContext(Opt_exprsContext, 0) as Opt_exprsContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
	public ident_icase(): Ident_icaseContext {
		return this.getTypedRuleContext(Ident_icaseContext, 0) as Ident_icaseContext;
	}
	public LBRACKET(): TerminalNode {
		return this.getToken(n1qlParser.LBRACKET, 0);
	}
	public RBRACKET(): TerminalNode {
		return this.getToken(n1qlParser.RBRACKET, 0);
	}
	public RBRACKET_ICASE(): TerminalNode {
		return this.getToken(n1qlParser.RBRACKET_ICASE, 0);
	}
	public RANDOM_ELEMENT(): TerminalNode {
		return this.getToken(n1qlParser.RANDOM_ELEMENT, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(n1qlParser.COLON, 0);
	}
	public BETWEEN(): TerminalNode {
		return this.getToken(n1qlParser.BETWEEN, 0);
	}
	public b_expr_list(): B_exprContext[] {
		return this.getTypedRuleContexts(B_exprContext) as B_exprContext[];
	}
	public b_expr(i: number): B_exprContext {
		return this.getTypedRuleContext(B_exprContext, i) as B_exprContext;
	}
	public NULL(): TerminalNode {
		return this.getToken(n1qlParser.NULL, 0);
	}
	public MISSING(): TerminalNode {
		return this.getToken(n1qlParser.MISSING, 0);
	}
	public valued(): ValuedContext {
		return this.getTypedRuleContext(ValuedContext, 0) as ValuedContext;
	}
	public UNKNOWN(): TerminalNode {
		return this.getToken(n1qlParser.UNKNOWN, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterExpr) {
	 		listener.enterExpr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitExpr) {
	 		listener.exitExpr(this);
		}
	}
}


export class ValuedContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public VALUED(): TerminalNode {
		return this.getToken(n1qlParser.VALUED, 0);
	}
	public KNOWN(): TerminalNode {
		return this.getToken(n1qlParser.KNOWN, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_valued;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterValued) {
	 		listener.enterValued(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitValued) {
	 		listener.exitValued(this);
		}
	}
}


export class C_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public literal(): LiteralContext {
		return this.getTypedRuleContext(LiteralContext, 0) as LiteralContext;
	}
	public sequence_expr(): Sequence_exprContext {
		return this.getTypedRuleContext(Sequence_exprContext, 0) as Sequence_exprContext;
	}
	public construction_expr(): Construction_exprContext {
		return this.getTypedRuleContext(Construction_exprContext, 0) as Construction_exprContext;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public IDENT_ICASE(): TerminalNode {
		return this.getToken(n1qlParser.IDENT_ICASE, 0);
	}
	public SELF(): TerminalNode {
		return this.getToken(n1qlParser.SELF, 0);
	}
	public param_expr(): Param_exprContext {
		return this.getTypedRuleContext(Param_exprContext, 0) as Param_exprContext;
	}
	public function_expr(): Function_exprContext {
		return this.getTypedRuleContext(Function_exprContext, 0) as Function_exprContext;
	}
	public MINUS(): TerminalNode {
		return this.getToken(n1qlParser.MINUS, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public case_expr(): Case_exprContext {
		return this.getTypedRuleContext(Case_exprContext, 0) as Case_exprContext;
	}
	public collection_expr(): Collection_exprContext {
		return this.getTypedRuleContext(Collection_exprContext, 0) as Collection_exprContext;
	}
	public paren_expr(): Paren_exprContext {
		return this.getTypedRuleContext(Paren_exprContext, 0) as Paren_exprContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
	public CURRENT(): TerminalNode {
		return this.getToken(n1qlParser.CURRENT, 0);
	}
	public USER(): TerminalNode {
		return this.getToken(n1qlParser.USER, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_c_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterC_expr) {
	 		listener.enterC_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitC_expr) {
	 		listener.exitC_expr(this);
		}
	}
}


export class B_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public c_expr(): C_exprContext {
		return this.getTypedRuleContext(C_exprContext, 0) as C_exprContext;
	}
	public b_expr_list(): B_exprContext[] {
		return this.getTypedRuleContexts(B_exprContext) as B_exprContext[];
	}
	public b_expr(i: number): B_exprContext {
		return this.getTypedRuleContext(B_exprContext, i) as B_exprContext;
	}
	public PLUS(): TerminalNode {
		return this.getToken(n1qlParser.PLUS, 0);
	}
	public MINUS(): TerminalNode {
		return this.getToken(n1qlParser.MINUS, 0);
	}
	public STAR(): TerminalNode {
		return this.getToken(n1qlParser.STAR, 0);
	}
	public DIV(): TerminalNode {
		return this.getToken(n1qlParser.DIV, 0);
	}
	public MOD(): TerminalNode {
		return this.getToken(n1qlParser.MOD, 0);
	}
	public POW(): TerminalNode {
		return this.getToken(n1qlParser.POW, 0);
	}
	public CONCAT(): TerminalNode {
		return this.getToken(n1qlParser.CONCAT, 0);
	}
	public DOT(): TerminalNode {
		return this.getToken(n1qlParser.DOT, 0);
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public opt_exprs(): Opt_exprsContext {
		return this.getTypedRuleContext(Opt_exprsContext, 0) as Opt_exprsContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
	public ident_icase(): Ident_icaseContext {
		return this.getTypedRuleContext(Ident_icaseContext, 0) as Ident_icaseContext;
	}
	public LBRACKET(): TerminalNode {
		return this.getToken(n1qlParser.LBRACKET, 0);
	}
	public expr_list(): ExprContext[] {
		return this.getTypedRuleContexts(ExprContext) as ExprContext[];
	}
	public expr(i: number): ExprContext {
		return this.getTypedRuleContext(ExprContext, i) as ExprContext;
	}
	public RBRACKET(): TerminalNode {
		return this.getToken(n1qlParser.RBRACKET, 0);
	}
	public RBRACKET_ICASE(): TerminalNode {
		return this.getToken(n1qlParser.RBRACKET_ICASE, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(n1qlParser.COLON, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_b_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterB_expr) {
	 		listener.enterB_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitB_expr) {
	 		listener.exitB_expr(this);
		}
	}
}


export class LiteralContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NULL(): TerminalNode {
		return this.getToken(n1qlParser.NULL, 0);
	}
	public MISSING(): TerminalNode {
		return this.getToken(n1qlParser.MISSING, 0);
	}
	public FALSE(): TerminalNode {
		return this.getToken(n1qlParser.FALSE, 0);
	}
	public TRUE(): TerminalNode {
		return this.getToken(n1qlParser.TRUE, 0);
	}
	public NUM(): TerminalNode {
		return this.getToken(n1qlParser.NUM, 0);
	}
	public INT(): TerminalNode {
		return this.getToken(n1qlParser.INT, 0);
	}
	public STR(): TerminalNode {
		return this.getToken(n1qlParser.STR, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_literal;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterLiteral) {
	 		listener.enterLiteral(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitLiteral) {
	 		listener.exitLiteral(this);
		}
	}
}


export class Construction_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public object(): ObjectContext {
		return this.getTypedRuleContext(ObjectContext, 0) as ObjectContext;
	}
	public array(): ArrayContext {
		return this.getTypedRuleContext(ArrayContext, 0) as ArrayContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_construction_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterConstruction_expr) {
	 		listener.enterConstruction_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitConstruction_expr) {
	 		listener.exitConstruction_expr(this);
		}
	}
}


export class ObjectContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LBRACE(): TerminalNode {
		return this.getToken(n1qlParser.LBRACE, 0);
	}
	public opt_members(): Opt_membersContext {
		return this.getTypedRuleContext(Opt_membersContext, 0) as Opt_membersContext;
	}
	public RBRACE(): TerminalNode {
		return this.getToken(n1qlParser.RBRACE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_object;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterObject) {
	 		listener.enterObject(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitObject) {
	 		listener.exitObject(this);
		}
	}
}


export class Opt_membersContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public members(): MembersContext {
		return this.getTypedRuleContext(MembersContext, 0) as MembersContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_members;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_members) {
	 		listener.enterOpt_members(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_members) {
	 		listener.exitOpt_members(this);
		}
	}
}


export class MembersContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public member(): MemberContext {
		return this.getTypedRuleContext(MemberContext, 0) as MemberContext;
	}
	public members(): MembersContext {
		return this.getTypedRuleContext(MembersContext, 0) as MembersContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_members;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterMembers) {
	 		listener.enterMembers(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitMembers) {
	 		listener.exitMembers(this);
		}
	}
}


export class MemberContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expr_list(): ExprContext[] {
		return this.getTypedRuleContexts(ExprContext) as ExprContext[];
	}
	public expr(i: number): ExprContext {
		return this.getTypedRuleContext(ExprContext, i) as ExprContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(n1qlParser.COLON, 0);
	}
	public opt_as_alias(): Opt_as_aliasContext {
		return this.getTypedRuleContext(Opt_as_aliasContext, 0) as Opt_as_aliasContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_member;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterMember) {
	 		listener.enterMember(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitMember) {
	 		listener.exitMember(this);
		}
	}
}


export class ArrayContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LBRACKET(): TerminalNode {
		return this.getToken(n1qlParser.LBRACKET, 0);
	}
	public opt_exprs(): Opt_exprsContext {
		return this.getTypedRuleContext(Opt_exprsContext, 0) as Opt_exprsContext;
	}
	public RBRACKET(): TerminalNode {
		return this.getToken(n1qlParser.RBRACKET, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_array;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterArray) {
	 		listener.enterArray(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitArray) {
	 		listener.exitArray(this);
		}
	}
}


export class Opt_exprsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public exprs(): ExprsContext {
		return this.getTypedRuleContext(ExprsContext, 0) as ExprsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_exprs;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_exprs) {
	 		listener.enterOpt_exprs(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_exprs) {
	 		listener.exitOpt_exprs(this);
		}
	}
}


export class ExprsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public exprs(): ExprsContext {
		return this.getTypedRuleContext(ExprsContext, 0) as ExprsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_exprs;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterExprs) {
	 		listener.enterExprs(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitExprs) {
	 		listener.exitExprs(this);
		}
	}
}


export class Param_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NAMED_PARAM(): TerminalNode {
		return this.getToken(n1qlParser.NAMED_PARAM, 0);
	}
	public POSITIONAL_PARAM(): TerminalNode {
		return this.getToken(n1qlParser.POSITIONAL_PARAM, 0);
	}
	public NEXT_PARAM(): TerminalNode {
		return this.getToken(n1qlParser.NEXT_PARAM, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_param_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterParam_expr) {
	 		listener.enterParam_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitParam_expr) {
	 		listener.exitParam_expr(this);
		}
	}
}


export class Case_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CASE(): TerminalNode {
		return this.getToken(n1qlParser.CASE, 0);
	}
	public simple_or_searched_case(): Simple_or_searched_caseContext {
		return this.getTypedRuleContext(Simple_or_searched_caseContext, 0) as Simple_or_searched_caseContext;
	}
	public END(): TerminalNode {
		return this.getToken(n1qlParser.END, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_case_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCase_expr) {
	 		listener.enterCase_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCase_expr) {
	 		listener.exitCase_expr(this);
		}
	}
}


export class Simple_or_searched_caseContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simple_case(): Simple_caseContext {
		return this.getTypedRuleContext(Simple_caseContext, 0) as Simple_caseContext;
	}
	public searched_case(): Searched_caseContext {
		return this.getTypedRuleContext(Searched_caseContext, 0) as Searched_caseContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_simple_or_searched_case;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSimple_or_searched_case) {
	 		listener.enterSimple_or_searched_case(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSimple_or_searched_case) {
	 		listener.exitSimple_or_searched_case(this);
		}
	}
}


export class Simple_caseContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public when_thens(): When_thensContext {
		return this.getTypedRuleContext(When_thensContext, 0) as When_thensContext;
	}
	public opt_else(): Opt_elseContext {
		return this.getTypedRuleContext(Opt_elseContext, 0) as Opt_elseContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_simple_case;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSimple_case) {
	 		listener.enterSimple_case(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSimple_case) {
	 		listener.exitSimple_case(this);
		}
	}
}


export class When_thensContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WHEN(): TerminalNode {
		return this.getToken(n1qlParser.WHEN, 0);
	}
	public expr_list(): ExprContext[] {
		return this.getTypedRuleContexts(ExprContext) as ExprContext[];
	}
	public expr(i: number): ExprContext {
		return this.getTypedRuleContext(ExprContext, i) as ExprContext;
	}
	public THEN(): TerminalNode {
		return this.getToken(n1qlParser.THEN, 0);
	}
	public when_thens(): When_thensContext {
		return this.getTypedRuleContext(When_thensContext, 0) as When_thensContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_when_thens;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterWhen_thens) {
	 		listener.enterWhen_thens(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitWhen_thens) {
	 		listener.exitWhen_thens(this);
		}
	}
}


export class Searched_caseContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public when_thens(): When_thensContext {
		return this.getTypedRuleContext(When_thensContext, 0) as When_thensContext;
	}
	public opt_else(): Opt_elseContext {
		return this.getTypedRuleContext(Opt_elseContext, 0) as Opt_elseContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_searched_case;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSearched_case) {
	 		listener.enterSearched_case(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSearched_case) {
	 		listener.exitSearched_case(this);
		}
	}
}


export class Opt_elseContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ELSE(): TerminalNode {
		return this.getToken(n1qlParser.ELSE, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_else;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_else) {
	 		listener.enterOpt_else(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_else) {
	 		listener.exitOpt_else(this);
		}
	}
}


export class Function_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FLATTEN_KEYS(): TerminalNode {
		return this.getToken(n1qlParser.FLATTEN_KEYS, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public opt_flatten_keys_exprs(): Opt_flatten_keys_exprsContext {
		return this.getTypedRuleContext(Opt_flatten_keys_exprsContext, 0) as Opt_flatten_keys_exprsContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
	public NTH_VALUE(): TerminalNode {
		return this.getToken(n1qlParser.NTH_VALUE, 0);
	}
	public exprs(): ExprsContext {
		return this.getTypedRuleContext(ExprsContext, 0) as ExprsContext;
	}
	public opt_from_first_last(): Opt_from_first_lastContext {
		return this.getTypedRuleContext(Opt_from_first_lastContext, 0) as Opt_from_first_lastContext;
	}
	public opt_nulls_treatment(): Opt_nulls_treatmentContext {
		return this.getTypedRuleContext(Opt_nulls_treatmentContext, 0) as Opt_nulls_treatmentContext;
	}
	public window_function_details(): Window_function_detailsContext {
		return this.getTypedRuleContext(Window_function_detailsContext, 0) as Window_function_detailsContext;
	}
	public function_name(): Function_nameContext {
		return this.getTypedRuleContext(Function_nameContext, 0) as Function_nameContext;
	}
	public opt_exprs(): Opt_exprsContext {
		return this.getTypedRuleContext(Opt_exprsContext, 0) as Opt_exprsContext;
	}
	public opt_filter(): Opt_filterContext {
		return this.getTypedRuleContext(Opt_filterContext, 0) as Opt_filterContext;
	}
	public opt_window_function(): Opt_window_functionContext {
		return this.getTypedRuleContext(Opt_window_functionContext, 0) as Opt_window_functionContext;
	}
	public agg_quantifier(): Agg_quantifierContext {
		return this.getTypedRuleContext(Agg_quantifierContext, 0) as Agg_quantifierContext;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public STAR(): TerminalNode {
		return this.getToken(n1qlParser.STAR, 0);
	}
	public long_func_name(): Long_func_nameContext {
		return this.getTypedRuleContext(Long_func_nameContext, 0) as Long_func_nameContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_function_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFunction_expr) {
	 		listener.enterFunction_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFunction_expr) {
	 		listener.exitFunction_expr(this);
		}
	}
}


export class Function_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ident(): IdentContext {
		return this.getTypedRuleContext(IdentContext, 0) as IdentContext;
	}
	public REPLACE(): TerminalNode {
		return this.getToken(n1qlParser.REPLACE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_function_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterFunction_name) {
	 		listener.enterFunction_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitFunction_name) {
	 		listener.exitFunction_name(this);
		}
	}
}


export class Collection_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public collection_cond(): Collection_condContext {
		return this.getTypedRuleContext(Collection_condContext, 0) as Collection_condContext;
	}
	public collection_xform(): Collection_xformContext {
		return this.getTypedRuleContext(Collection_xformContext, 0) as Collection_xformContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_collection_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCollection_expr) {
	 		listener.enterCollection_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCollection_expr) {
	 		listener.exitCollection_expr(this);
		}
	}
}


export class Collection_condContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ANY(): TerminalNode {
		return this.getToken(n1qlParser.ANY, 0);
	}
	public coll_bindings(): Coll_bindingsContext {
		return this.getTypedRuleContext(Coll_bindingsContext, 0) as Coll_bindingsContext;
	}
	public satisfies(): SatisfiesContext {
		return this.getTypedRuleContext(SatisfiesContext, 0) as SatisfiesContext;
	}
	public END(): TerminalNode {
		return this.getToken(n1qlParser.END, 0);
	}
	public SOME(): TerminalNode {
		return this.getToken(n1qlParser.SOME, 0);
	}
	public EVERY(): TerminalNode {
		return this.getToken(n1qlParser.EVERY, 0);
	}
	public AND(): TerminalNode {
		return this.getToken(n1qlParser.AND, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_collection_cond;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCollection_cond) {
	 		listener.enterCollection_cond(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCollection_cond) {
	 		listener.exitCollection_cond(this);
		}
	}
}


export class Coll_bindingsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public coll_binding(): Coll_bindingContext {
		return this.getTypedRuleContext(Coll_bindingContext, 0) as Coll_bindingContext;
	}
	public coll_bindings(): Coll_bindingsContext {
		return this.getTypedRuleContext(Coll_bindingsContext, 0) as Coll_bindingsContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_coll_bindings;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterColl_bindings) {
	 		listener.enterColl_bindings(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitColl_bindings) {
	 		listener.exitColl_bindings(this);
		}
	}
}


export class Coll_bindingContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public variable_list(): VariableContext[] {
		return this.getTypedRuleContexts(VariableContext) as VariableContext[];
	}
	public variable(i: number): VariableContext {
		return this.getTypedRuleContext(VariableContext, i) as VariableContext;
	}
	public IN(): TerminalNode {
		return this.getToken(n1qlParser.IN, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public WITHIN(): TerminalNode {
		return this.getToken(n1qlParser.WITHIN, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(n1qlParser.COLON, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_coll_binding;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterColl_binding) {
	 		listener.enterColl_binding(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitColl_binding) {
	 		listener.exitColl_binding(this);
		}
	}
}


export class SatisfiesContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SATISFIES(): TerminalNode {
		return this.getToken(n1qlParser.SATISFIES, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_satisfies;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSatisfies) {
	 		listener.enterSatisfies(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSatisfies) {
	 		listener.exitSatisfies(this);
		}
	}
}


export class Collection_xformContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ARRAY(): TerminalNode {
		return this.getToken(n1qlParser.ARRAY, 0);
	}
	public expr_list(): ExprContext[] {
		return this.getTypedRuleContexts(ExprContext) as ExprContext[];
	}
	public expr(i: number): ExprContext {
		return this.getTypedRuleContext(ExprContext, i) as ExprContext;
	}
	public FOR(): TerminalNode {
		return this.getToken(n1qlParser.FOR, 0);
	}
	public coll_bindings(): Coll_bindingsContext {
		return this.getTypedRuleContext(Coll_bindingsContext, 0) as Coll_bindingsContext;
	}
	public opt_when(): Opt_whenContext {
		return this.getTypedRuleContext(Opt_whenContext, 0) as Opt_whenContext;
	}
	public END(): TerminalNode {
		return this.getToken(n1qlParser.END, 0);
	}
	public FIRST(): TerminalNode {
		return this.getToken(n1qlParser.FIRST, 0);
	}
	public OBJECT(): TerminalNode {
		return this.getToken(n1qlParser.OBJECT, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(n1qlParser.COLON, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_collection_xform;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCollection_xform) {
	 		listener.enterCollection_xform(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCollection_xform) {
	 		listener.exitCollection_xform(this);
		}
	}
}


export class Paren_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
	public all_expr(): All_exprContext {
		return this.getTypedRuleContext(All_exprContext, 0) as All_exprContext;
	}
	public subquery_expr(): Subquery_exprContext {
		return this.getTypedRuleContext(Subquery_exprContext, 0) as Subquery_exprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_paren_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterParen_expr) {
	 		listener.enterParen_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitParen_expr) {
	 		listener.exitParen_expr(this);
		}
	}
}


export class Subquery_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public fullselect(): FullselectContext {
		return this.getTypedRuleContext(FullselectContext, 0) as FullselectContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_subquery_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSubquery_expr) {
	 		listener.enterSubquery_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSubquery_expr) {
	 		listener.exitSubquery_expr(this);
		}
	}
}


export class Expr_inputContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public all_expr(): All_exprContext {
		return this.getTypedRuleContext(All_exprContext, 0) as All_exprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_expr_input;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterExpr_input) {
	 		listener.enterExpr_input(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitExpr_input) {
	 		listener.exitExpr_input(this);
		}
	}
}


export class Opt_window_clauseContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WINDOW(): TerminalNode {
		return this.getToken(n1qlParser.WINDOW, 0);
	}
	public window_list(): Window_listContext {
		return this.getTypedRuleContext(Window_listContext, 0) as Window_listContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_window_clause;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_window_clause) {
	 		listener.enterOpt_window_clause(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_window_clause) {
	 		listener.exitOpt_window_clause(this);
		}
	}
}


export class Window_listContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public window_term(): Window_termContext {
		return this.getTypedRuleContext(Window_termContext, 0) as Window_termContext;
	}
	public window_list(): Window_listContext {
		return this.getTypedRuleContext(Window_listContext, 0) as Window_listContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(n1qlParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_window_list;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterWindow_list) {
	 		listener.enterWindow_list(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitWindow_list) {
	 		listener.exitWindow_list(this);
		}
	}
}


export class Window_termContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public AS(): TerminalNode {
		return this.getToken(n1qlParser.AS, 0);
	}
	public window_specification(): Window_specificationContext {
		return this.getTypedRuleContext(Window_specificationContext, 0) as Window_specificationContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_window_term;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterWindow_term) {
	 		listener.enterWindow_term(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitWindow_term) {
	 		listener.exitWindow_term(this);
		}
	}
}


export class Window_specificationContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public opt_window_name(): Opt_window_nameContext {
		return this.getTypedRuleContext(Opt_window_nameContext, 0) as Opt_window_nameContext;
	}
	public opt_window_partition(): Opt_window_partitionContext {
		return this.getTypedRuleContext(Opt_window_partitionContext, 0) as Opt_window_partitionContext;
	}
	public opt_order_by(): Opt_order_byContext {
		return this.getTypedRuleContext(Opt_order_byContext, 0) as Opt_order_byContext;
	}
	public opt_window_frame(): Opt_window_frameContext {
		return this.getTypedRuleContext(Opt_window_frameContext, 0) as Opt_window_frameContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_window_specification;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterWindow_specification) {
	 		listener.enterWindow_specification(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitWindow_specification) {
	 		listener.exitWindow_specification(this);
		}
	}
}


export class Opt_window_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_window_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_window_name) {
	 		listener.enterOpt_window_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_window_name) {
	 		listener.exitOpt_window_name(this);
		}
	}
}


export class Opt_window_partitionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PARTITION(): TerminalNode {
		return this.getToken(n1qlParser.PARTITION, 0);
	}
	public BY(): TerminalNode {
		return this.getToken(n1qlParser.BY, 0);
	}
	public exprs(): ExprsContext {
		return this.getTypedRuleContext(ExprsContext, 0) as ExprsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_window_partition;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_window_partition) {
	 		listener.enterOpt_window_partition(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_window_partition) {
	 		listener.exitOpt_window_partition(this);
		}
	}
}


export class Opt_window_frameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public window_frame_modifier(): Window_frame_modifierContext {
		return this.getTypedRuleContext(Window_frame_modifierContext, 0) as Window_frame_modifierContext;
	}
	public window_frame_extents(): Window_frame_extentsContext {
		return this.getTypedRuleContext(Window_frame_extentsContext, 0) as Window_frame_extentsContext;
	}
	public opt_window_frame_exclusion(): Opt_window_frame_exclusionContext {
		return this.getTypedRuleContext(Opt_window_frame_exclusionContext, 0) as Opt_window_frame_exclusionContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_window_frame;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_window_frame) {
	 		listener.enterOpt_window_frame(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_window_frame) {
	 		listener.exitOpt_window_frame(this);
		}
	}
}


export class Window_frame_modifierContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ROWS(): TerminalNode {
		return this.getToken(n1qlParser.ROWS, 0);
	}
	public RANGE(): TerminalNode {
		return this.getToken(n1qlParser.RANGE, 0);
	}
	public GROUPS(): TerminalNode {
		return this.getToken(n1qlParser.GROUPS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_window_frame_modifier;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterWindow_frame_modifier) {
	 		listener.enterWindow_frame_modifier(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitWindow_frame_modifier) {
	 		listener.exitWindow_frame_modifier(this);
		}
	}
}


export class Opt_window_frame_exclusionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EXCLUDE(): TerminalNode {
		return this.getToken(n1qlParser.EXCLUDE, 0);
	}
	public NO(): TerminalNode {
		return this.getToken(n1qlParser.NO, 0);
	}
	public OTHERS(): TerminalNode {
		return this.getToken(n1qlParser.OTHERS, 0);
	}
	public CURRENT(): TerminalNode {
		return this.getToken(n1qlParser.CURRENT, 0);
	}
	public ROW(): TerminalNode {
		return this.getToken(n1qlParser.ROW, 0);
	}
	public TIES(): TerminalNode {
		return this.getToken(n1qlParser.TIES, 0);
	}
	public GROUP(): TerminalNode {
		return this.getToken(n1qlParser.GROUP, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_window_frame_exclusion;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_window_frame_exclusion) {
	 		listener.enterOpt_window_frame_exclusion(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_window_frame_exclusion) {
	 		listener.exitOpt_window_frame_exclusion(this);
		}
	}
}


export class Window_frame_extentsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public window_frame_extent_list(): Window_frame_extentContext[] {
		return this.getTypedRuleContexts(Window_frame_extentContext) as Window_frame_extentContext[];
	}
	public window_frame_extent(i: number): Window_frame_extentContext {
		return this.getTypedRuleContext(Window_frame_extentContext, i) as Window_frame_extentContext;
	}
	public BETWEEN(): TerminalNode {
		return this.getToken(n1qlParser.BETWEEN, 0);
	}
	public AND(): TerminalNode {
		return this.getToken(n1qlParser.AND, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_window_frame_extents;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterWindow_frame_extents) {
	 		listener.enterWindow_frame_extents(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitWindow_frame_extents) {
	 		listener.exitWindow_frame_extents(this);
		}
	}
}


export class Window_frame_extentContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public UNBOUNDED(): TerminalNode {
		return this.getToken(n1qlParser.UNBOUNDED, 0);
	}
	public PRECEDING(): TerminalNode {
		return this.getToken(n1qlParser.PRECEDING, 0);
	}
	public FOLLOWING(): TerminalNode {
		return this.getToken(n1qlParser.FOLLOWING, 0);
	}
	public CURRENT(): TerminalNode {
		return this.getToken(n1qlParser.CURRENT, 0);
	}
	public ROW(): TerminalNode {
		return this.getToken(n1qlParser.ROW, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
	public window_frame_valexpr_modifier(): Window_frame_valexpr_modifierContext {
		return this.getTypedRuleContext(Window_frame_valexpr_modifierContext, 0) as Window_frame_valexpr_modifierContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_window_frame_extent;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterWindow_frame_extent) {
	 		listener.enterWindow_frame_extent(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitWindow_frame_extent) {
	 		listener.exitWindow_frame_extent(this);
		}
	}
}


export class Window_frame_valexpr_modifierContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PRECEDING(): TerminalNode {
		return this.getToken(n1qlParser.PRECEDING, 0);
	}
	public FOLLOWING(): TerminalNode {
		return this.getToken(n1qlParser.FOLLOWING, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_window_frame_valexpr_modifier;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterWindow_frame_valexpr_modifier) {
	 		listener.enterWindow_frame_valexpr_modifier(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitWindow_frame_valexpr_modifier) {
	 		listener.exitWindow_frame_valexpr_modifier(this);
		}
	}
}


export class Opt_nulls_treatmentContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public nulls_treatment(): Nulls_treatmentContext {
		return this.getTypedRuleContext(Nulls_treatmentContext, 0) as Nulls_treatmentContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_nulls_treatment;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_nulls_treatment) {
	 		listener.enterOpt_nulls_treatment(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_nulls_treatment) {
	 		listener.exitOpt_nulls_treatment(this);
		}
	}
}


export class Nulls_treatmentContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public RESPECT(): TerminalNode {
		return this.getToken(n1qlParser.RESPECT, 0);
	}
	public NULLS(): TerminalNode {
		return this.getToken(n1qlParser.NULLS, 0);
	}
	public IGNORE(): TerminalNode {
		return this.getToken(n1qlParser.IGNORE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_nulls_treatment;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterNulls_treatment) {
	 		listener.enterNulls_treatment(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitNulls_treatment) {
	 		listener.exitNulls_treatment(this);
		}
	}
}


export class Opt_from_first_lastContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FROM(): TerminalNode {
		return this.getToken(n1qlParser.FROM, 0);
	}
	public first_last(): First_lastContext {
		return this.getTypedRuleContext(First_lastContext, 0) as First_lastContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_from_first_last;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_from_first_last) {
	 		listener.enterOpt_from_first_last(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_from_first_last) {
	 		listener.exitOpt_from_first_last(this);
		}
	}
}


export class Agg_quantifierContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ALL(): TerminalNode {
		return this.getToken(n1qlParser.ALL, 0);
	}
	public DISTINCT(): TerminalNode {
		return this.getToken(n1qlParser.DISTINCT, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_agg_quantifier;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterAgg_quantifier) {
	 		listener.enterAgg_quantifier(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitAgg_quantifier) {
	 		listener.exitAgg_quantifier(this);
		}
	}
}


export class Opt_filterContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FILTER(): TerminalNode {
		return this.getToken(n1qlParser.FILTER, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(n1qlParser.LPAREN, 0);
	}
	public where(): WhereContext {
		return this.getTypedRuleContext(WhereContext, 0) as WhereContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(n1qlParser.RPAREN, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_filter;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_filter) {
	 		listener.enterOpt_filter(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_filter) {
	 		listener.exitOpt_filter(this);
		}
	}
}


export class Opt_window_functionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public window_function_details(): Window_function_detailsContext {
		return this.getTypedRuleContext(Window_function_detailsContext, 0) as Window_function_detailsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_window_function;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_window_function) {
	 		listener.enterOpt_window_function(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_window_function) {
	 		listener.exitOpt_window_function(this);
		}
	}
}


export class Window_function_detailsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OVER(): TerminalNode {
		return this.getToken(n1qlParser.OVER, 0);
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public window_specification(): Window_specificationContext {
		return this.getTypedRuleContext(Window_specificationContext, 0) as Window_specificationContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_window_function_details;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterWindow_function_details) {
	 		listener.enterWindow_function_details(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitWindow_function_details) {
	 		listener.exitWindow_function_details(this);
		}
	}
}


export class Start_transactionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public start_or_begin(): Start_or_beginContext {
		return this.getTypedRuleContext(Start_or_beginContext, 0) as Start_or_beginContext;
	}
	public transaction(): TransactionContext {
		return this.getTypedRuleContext(TransactionContext, 0) as TransactionContext;
	}
	public opt_isolation_level(): Opt_isolation_levelContext {
		return this.getTypedRuleContext(Opt_isolation_levelContext, 0) as Opt_isolation_levelContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_start_transaction;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterStart_transaction) {
	 		listener.enterStart_transaction(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitStart_transaction) {
	 		listener.exitStart_transaction(this);
		}
	}
}


export class Commit_transactionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public COMMIT(): TerminalNode {
		return this.getToken(n1qlParser.COMMIT, 0);
	}
	public opt_transaction(): Opt_transactionContext {
		return this.getTypedRuleContext(Opt_transactionContext, 0) as Opt_transactionContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_commit_transaction;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCommit_transaction) {
	 		listener.enterCommit_transaction(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCommit_transaction) {
	 		listener.exitCommit_transaction(this);
		}
	}
}


export class Rollback_transactionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ROLLBACK(): TerminalNode {
		return this.getToken(n1qlParser.ROLLBACK, 0);
	}
	public opt_transaction(): Opt_transactionContext {
		return this.getTypedRuleContext(Opt_transactionContext, 0) as Opt_transactionContext;
	}
	public opt_savepoint(): Opt_savepointContext {
		return this.getTypedRuleContext(Opt_savepointContext, 0) as Opt_savepointContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_rollback_transaction;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterRollback_transaction) {
	 		listener.enterRollback_transaction(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitRollback_transaction) {
	 		listener.exitRollback_transaction(this);
		}
	}
}


export class Start_or_beginContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public START(): TerminalNode {
		return this.getToken(n1qlParser.START, 0);
	}
	public BEGIN(): TerminalNode {
		return this.getToken(n1qlParser.BEGIN, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_start_or_begin;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterStart_or_begin) {
	 		listener.enterStart_or_begin(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitStart_or_begin) {
	 		listener.exitStart_or_begin(this);
		}
	}
}


export class Opt_transactionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public transaction(): TransactionContext {
		return this.getTypedRuleContext(TransactionContext, 0) as TransactionContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_transaction;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_transaction) {
	 		listener.enterOpt_transaction(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_transaction) {
	 		listener.exitOpt_transaction(this);
		}
	}
}


export class TransactionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TRAN(): TerminalNode {
		return this.getToken(n1qlParser.TRAN, 0);
	}
	public TRANSACTION(): TerminalNode {
		return this.getToken(n1qlParser.TRANSACTION, 0);
	}
	public WORK(): TerminalNode {
		return this.getToken(n1qlParser.WORK, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_transaction;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterTransaction) {
	 		listener.enterTransaction(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitTransaction) {
	 		listener.exitTransaction(this);
		}
	}
}


export class Opt_savepointContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TO(): TerminalNode {
		return this.getToken(n1qlParser.TO, 0);
	}
	public SAVEPOINT(): TerminalNode {
		return this.getToken(n1qlParser.SAVEPOINT, 0);
	}
	public savepoint_name(): Savepoint_nameContext {
		return this.getTypedRuleContext(Savepoint_nameContext, 0) as Savepoint_nameContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_savepoint;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_savepoint) {
	 		listener.enterOpt_savepoint(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_savepoint) {
	 		listener.exitOpt_savepoint(this);
		}
	}
}


export class Savepoint_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_savepoint_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSavepoint_name) {
	 		listener.enterSavepoint_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSavepoint_name) {
	 		listener.exitSavepoint_name(this);
		}
	}
}


export class Opt_isolation_levelContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public isolation_level(): Isolation_levelContext {
		return this.getTypedRuleContext(Isolation_levelContext, 0) as Isolation_levelContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_isolation_level;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_isolation_level) {
	 		listener.enterOpt_isolation_level(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_isolation_level) {
	 		listener.exitOpt_isolation_level(this);
		}
	}
}


export class Isolation_levelContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ISOLATION(): TerminalNode {
		return this.getToken(n1qlParser.ISOLATION, 0);
	}
	public LEVEL(): TerminalNode {
		return this.getToken(n1qlParser.LEVEL, 0);
	}
	public isolation_val(): Isolation_valContext {
		return this.getTypedRuleContext(Isolation_valContext, 0) as Isolation_valContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_isolation_level;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterIsolation_level) {
	 		listener.enterIsolation_level(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitIsolation_level) {
	 		listener.exitIsolation_level(this);
		}
	}
}


export class Isolation_valContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public READ(): TerminalNode {
		return this.getToken(n1qlParser.READ, 0);
	}
	public COMMITTED(): TerminalNode {
		return this.getToken(n1qlParser.COMMITTED, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_isolation_val;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterIsolation_val) {
	 		listener.enterIsolation_val(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitIsolation_val) {
	 		listener.exitIsolation_val(this);
		}
	}
}


export class Set_transaction_isolationContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SET(): TerminalNode {
		return this.getToken(n1qlParser.SET, 0);
	}
	public TRANSACTION(): TerminalNode {
		return this.getToken(n1qlParser.TRANSACTION, 0);
	}
	public isolation_level(): Isolation_levelContext {
		return this.getTypedRuleContext(Isolation_levelContext, 0) as Isolation_levelContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_set_transaction_isolation;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSet_transaction_isolation) {
	 		listener.enterSet_transaction_isolation(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSet_transaction_isolation) {
	 		listener.exitSet_transaction_isolation(this);
		}
	}
}


export class SavepointContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SAVEPOINT(): TerminalNode {
		return this.getToken(n1qlParser.SAVEPOINT, 0);
	}
	public savepoint_name(): Savepoint_nameContext {
		return this.getTypedRuleContext(Savepoint_nameContext, 0) as Savepoint_nameContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_savepoint;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSavepoint) {
	 		listener.enterSavepoint(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSavepoint) {
	 		listener.exitSavepoint(this);
		}
	}
}


export class Opt_with_clauseContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public with_clause(): With_clauseContext {
		return this.getTypedRuleContext(With_clauseContext, 0) as With_clauseContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_with_clause;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_with_clause) {
	 		listener.enterOpt_with_clause(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_with_clause) {
	 		listener.exitOpt_with_clause(this);
		}
	}
}


export class With_clauseContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WITH(): TerminalNode {
		return this.getToken(n1qlParser.WITH, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_with_clause;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterWith_clause) {
	 		listener.enterWith_clause(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitWith_clause) {
	 		listener.exitWith_clause(this);
		}
	}
}


export class Opt_namespace_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public namespace_name(): Namespace_nameContext {
		return this.getTypedRuleContext(Namespace_nameContext, 0) as Namespace_nameContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_namespace_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_namespace_name) {
	 		listener.enterOpt_namespace_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_namespace_name) {
	 		listener.exitOpt_namespace_name(this);
		}
	}
}


export class Sequence_object_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public p__invalid_case_insensitive_identifier(): P__invalid_case_insensitive_identifierContext {
		return this.getTypedRuleContext(P__invalid_case_insensitive_identifierContext, 0) as P__invalid_case_insensitive_identifierContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_sequence_object_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSequence_object_name) {
	 		listener.enterSequence_object_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSequence_object_name) {
	 		listener.exitSequence_object_name(this);
		}
	}
}


export class Sequence_full_nameContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public opt_namespace_name(): Opt_namespace_nameContext {
		return this.getTypedRuleContext(Opt_namespace_nameContext, 0) as Opt_namespace_nameContext;
	}
	public sequence_object_name(): Sequence_object_nameContext {
		return this.getTypedRuleContext(Sequence_object_nameContext, 0) as Sequence_object_nameContext;
	}
	public path_part_list(): Path_partContext[] {
		return this.getTypedRuleContexts(Path_partContext) as Path_partContext[];
	}
	public path_part(i: number): Path_partContext {
		return this.getTypedRuleContext(Path_partContext, i) as Path_partContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(n1qlParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(n1qlParser.DOT, i);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_sequence_full_name;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSequence_full_name) {
	 		listener.enterSequence_full_name(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSequence_full_name) {
	 		listener.exitSequence_full_name(this);
		}
	}
}


export class Sequence_stmtContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public create_sequence(): Create_sequenceContext {
		return this.getTypedRuleContext(Create_sequenceContext, 0) as Create_sequenceContext;
	}
	public drop_sequence(): Drop_sequenceContext {
		return this.getTypedRuleContext(Drop_sequenceContext, 0) as Drop_sequenceContext;
	}
	public alter_sequence(): Alter_sequenceContext {
		return this.getTypedRuleContext(Alter_sequenceContext, 0) as Alter_sequenceContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_sequence_stmt;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSequence_stmt) {
	 		listener.enterSequence_stmt(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSequence_stmt) {
	 		listener.exitSequence_stmt(this);
		}
	}
}


export class Create_sequenceContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CREATE(): TerminalNode {
		return this.getToken(n1qlParser.CREATE, 0);
	}
	public SEQUENCE(): TerminalNode {
		return this.getToken(n1qlParser.SEQUENCE, 0);
	}
	public sequence_name_options(): Sequence_name_optionsContext {
		return this.getTypedRuleContext(Sequence_name_optionsContext, 0) as Sequence_name_optionsContext;
	}
	public opt_seq_create_options(): Opt_seq_create_optionsContext {
		return this.getTypedRuleContext(Opt_seq_create_optionsContext, 0) as Opt_seq_create_optionsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_create_sequence;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCreate_sequence) {
	 		listener.enterCreate_sequence(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCreate_sequence) {
	 		listener.exitCreate_sequence(this);
		}
	}
}


export class Sequence_name_optionsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public sequence_name_option(): Sequence_name_optionContext {
		return this.getTypedRuleContext(Sequence_name_optionContext, 0) as Sequence_name_optionContext;
	}
	public sequence_name_options(): Sequence_name_optionsContext {
		return this.getTypedRuleContext(Sequence_name_optionsContext, 0) as Sequence_name_optionsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_sequence_name_options;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSequence_name_options) {
	 		listener.enterSequence_name_options(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSequence_name_options) {
	 		listener.exitSequence_name_options(this);
		}
	}
}


export class Sequence_name_optionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IF(): TerminalNode {
		return this.getToken(n1qlParser.IF, 0);
	}
	public NOT(): TerminalNode {
		return this.getToken(n1qlParser.NOT, 0);
	}
	public EXISTS(): TerminalNode {
		return this.getToken(n1qlParser.EXISTS, 0);
	}
	public sequence_full_name(): Sequence_full_nameContext {
		return this.getTypedRuleContext(Sequence_full_nameContext, 0) as Sequence_full_nameContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_sequence_name_option;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSequence_name_option) {
	 		listener.enterSequence_name_option(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSequence_name_option) {
	 		listener.exitSequence_name_option(this);
		}
	}
}


export class Opt_seq_create_optionsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public opt_seq_create_options(): Opt_seq_create_optionsContext {
		return this.getTypedRuleContext(Opt_seq_create_optionsContext, 0) as Opt_seq_create_optionsContext;
	}
	public seq_create_option(): Seq_create_optionContext {
		return this.getTypedRuleContext(Seq_create_optionContext, 0) as Seq_create_optionContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_opt_seq_create_options;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterOpt_seq_create_options) {
	 		listener.enterOpt_seq_create_options(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitOpt_seq_create_options) {
	 		listener.exitOpt_seq_create_options(this);
		}
	}
}


export class Seq_create_optionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public sequence_with(): Sequence_withContext {
		return this.getTypedRuleContext(Sequence_withContext, 0) as Sequence_withContext;
	}
	public start_with(): Start_withContext {
		return this.getTypedRuleContext(Start_withContext, 0) as Start_withContext;
	}
	public increment_by(): Increment_byContext {
		return this.getTypedRuleContext(Increment_byContext, 0) as Increment_byContext;
	}
	public maxvalue(): MaxvalueContext {
		return this.getTypedRuleContext(MaxvalueContext, 0) as MaxvalueContext;
	}
	public minvalue(): MinvalueContext {
		return this.getTypedRuleContext(MinvalueContext, 0) as MinvalueContext;
	}
	public cycle(): CycleContext {
		return this.getTypedRuleContext(CycleContext, 0) as CycleContext;
	}
	public cache(): CacheContext {
		return this.getTypedRuleContext(CacheContext, 0) as CacheContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_seq_create_option;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSeq_create_option) {
	 		listener.enterSeq_create_option(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSeq_create_option) {
	 		listener.exitSeq_create_option(this);
		}
	}
}


export class Drop_sequenceContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DROP(): TerminalNode {
		return this.getToken(n1qlParser.DROP, 0);
	}
	public SEQUENCE(): TerminalNode {
		return this.getToken(n1qlParser.SEQUENCE, 0);
	}
	public sequence_full_name(): Sequence_full_nameContext {
		return this.getTypedRuleContext(Sequence_full_nameContext, 0) as Sequence_full_nameContext;
	}
	public opt_if_exists(): Opt_if_existsContext {
		return this.getTypedRuleContext(Opt_if_existsContext, 0) as Opt_if_existsContext;
	}
	public IF(): TerminalNode {
		return this.getToken(n1qlParser.IF, 0);
	}
	public EXISTS(): TerminalNode {
		return this.getToken(n1qlParser.EXISTS, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_drop_sequence;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterDrop_sequence) {
	 		listener.enterDrop_sequence(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitDrop_sequence) {
	 		listener.exitDrop_sequence(this);
		}
	}
}


export class Alter_sequenceContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ALTER(): TerminalNode {
		return this.getToken(n1qlParser.ALTER, 0);
	}
	public SEQUENCE(): TerminalNode {
		return this.getToken(n1qlParser.SEQUENCE, 0);
	}
	public sequence_full_name(): Sequence_full_nameContext {
		return this.getTypedRuleContext(Sequence_full_nameContext, 0) as Sequence_full_nameContext;
	}
	public with_clause(): With_clauseContext {
		return this.getTypedRuleContext(With_clauseContext, 0) as With_clauseContext;
	}
	public seq_alter_options(): Seq_alter_optionsContext {
		return this.getTypedRuleContext(Seq_alter_optionsContext, 0) as Seq_alter_optionsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_alter_sequence;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterAlter_sequence) {
	 		listener.enterAlter_sequence(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitAlter_sequence) {
	 		listener.exitAlter_sequence(this);
		}
	}
}


export class Seq_alter_optionsContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public seq_alter_option(): Seq_alter_optionContext {
		return this.getTypedRuleContext(Seq_alter_optionContext, 0) as Seq_alter_optionContext;
	}
	public seq_alter_options(): Seq_alter_optionsContext {
		return this.getTypedRuleContext(Seq_alter_optionsContext, 0) as Seq_alter_optionsContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_seq_alter_options;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSeq_alter_options) {
	 		listener.enterSeq_alter_options(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSeq_alter_options) {
	 		listener.exitSeq_alter_options(this);
		}
	}
}


export class Seq_alter_optionContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public restart_with(): Restart_withContext {
		return this.getTypedRuleContext(Restart_withContext, 0) as Restart_withContext;
	}
	public increment_by(): Increment_byContext {
		return this.getTypedRuleContext(Increment_byContext, 0) as Increment_byContext;
	}
	public maxvalue(): MaxvalueContext {
		return this.getTypedRuleContext(MaxvalueContext, 0) as MaxvalueContext;
	}
	public minvalue(): MinvalueContext {
		return this.getTypedRuleContext(MinvalueContext, 0) as MinvalueContext;
	}
	public cycle(): CycleContext {
		return this.getTypedRuleContext(CycleContext, 0) as CycleContext;
	}
	public cache(): CacheContext {
		return this.getTypedRuleContext(CacheContext, 0) as CacheContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_seq_alter_option;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSeq_alter_option) {
	 		listener.enterSeq_alter_option(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSeq_alter_option) {
	 		listener.exitSeq_alter_option(this);
		}
	}
}


export class Sequence_withContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WITH(): TerminalNode {
		return this.getToken(n1qlParser.WITH, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_sequence_with;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSequence_with) {
	 		listener.enterSequence_with(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSequence_with) {
	 		listener.exitSequence_with(this);
		}
	}
}


export class Start_withContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public START(): TerminalNode {
		return this.getToken(n1qlParser.START, 0);
	}
	public WITH(): TerminalNode {
		return this.getToken(n1qlParser.WITH, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_start_with;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterStart_with) {
	 		listener.enterStart_with(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitStart_with) {
	 		listener.exitStart_with(this);
		}
	}
}


export class Restart_withContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public RESTART(): TerminalNode {
		return this.getToken(n1qlParser.RESTART, 0);
	}
	public WITH(): TerminalNode {
		return this.getToken(n1qlParser.WITH, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_restart_with;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterRestart_with) {
	 		listener.enterRestart_with(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitRestart_with) {
	 		listener.exitRestart_with(this);
		}
	}
}


export class Increment_byContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INCREMENT(): TerminalNode {
		return this.getToken(n1qlParser.INCREMENT, 0);
	}
	public BY(): TerminalNode {
		return this.getToken(n1qlParser.BY, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_increment_by;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterIncrement_by) {
	 		listener.enterIncrement_by(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitIncrement_by) {
	 		listener.exitIncrement_by(this);
		}
	}
}


export class MaxvalueContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NO(): TerminalNode {
		return this.getToken(n1qlParser.NO, 0);
	}
	public MAXVALUE(): TerminalNode {
		return this.getToken(n1qlParser.MAXVALUE, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_maxvalue;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterMaxvalue) {
	 		listener.enterMaxvalue(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitMaxvalue) {
	 		listener.exitMaxvalue(this);
		}
	}
}


export class MinvalueContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NO(): TerminalNode {
		return this.getToken(n1qlParser.NO, 0);
	}
	public MINVALUE(): TerminalNode {
		return this.getToken(n1qlParser.MINVALUE, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_minvalue;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterMinvalue) {
	 		listener.enterMinvalue(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitMinvalue) {
	 		listener.exitMinvalue(this);
		}
	}
}


export class CycleContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NO(): TerminalNode {
		return this.getToken(n1qlParser.NO, 0);
	}
	public CYCLE(): TerminalNode {
		return this.getToken(n1qlParser.CYCLE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_cycle;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCycle) {
	 		listener.enterCycle(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCycle) {
	 		listener.exitCycle(this);
		}
	}
}


export class CacheContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NO(): TerminalNode {
		return this.getToken(n1qlParser.NO, 0);
	}
	public CACHE(): TerminalNode {
		return this.getToken(n1qlParser.CACHE, 0);
	}
	public expr(): ExprContext {
		return this.getTypedRuleContext(ExprContext, 0) as ExprContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_cache;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterCache) {
	 		listener.enterCache(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitCache) {
	 		listener.exitCache(this);
		}
	}
}


export class Sequence_nextContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NEXTVAL(): TerminalNode {
		return this.getToken(n1qlParser.NEXTVAL, 0);
	}
	public FOR(): TerminalNode {
		return this.getToken(n1qlParser.FOR, 0);
	}
	public NAMESPACE_ID(): TerminalNode {
		return this.getToken(n1qlParser.NAMESPACE_ID, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(n1qlParser.COLON, 0);
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public NEXT(): TerminalNode {
		return this.getToken(n1qlParser.NEXT, 0);
	}
	public VALUE(): TerminalNode {
		return this.getToken(n1qlParser.VALUE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_sequence_next;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSequence_next) {
	 		listener.enterSequence_next(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSequence_next) {
	 		listener.exitSequence_next(this);
		}
	}
}


export class Sequence_prevContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PREVVAL(): TerminalNode {
		return this.getToken(n1qlParser.PREVVAL, 0);
	}
	public FOR(): TerminalNode {
		return this.getToken(n1qlParser.FOR, 0);
	}
	public NAMESPACE_ID(): TerminalNode {
		return this.getToken(n1qlParser.NAMESPACE_ID, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(n1qlParser.COLON, 0);
	}
	public permitted_identifiers(): Permitted_identifiersContext {
		return this.getTypedRuleContext(Permitted_identifiersContext, 0) as Permitted_identifiersContext;
	}
	public PREV(): TerminalNode {
		return this.getToken(n1qlParser.PREV, 0);
	}
	public VALUE(): TerminalNode {
		return this.getToken(n1qlParser.VALUE, 0);
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_sequence_prev;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSequence_prev) {
	 		listener.enterSequence_prev(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSequence_prev) {
	 		listener.exitSequence_prev(this);
		}
	}
}


export class Sequence_exprContext extends ParserRuleContext {
	constructor(parser?: n1qlParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public sequence_next(): Sequence_nextContext {
		return this.getTypedRuleContext(Sequence_nextContext, 0) as Sequence_nextContext;
	}
	public sequence_prev(): Sequence_prevContext {
		return this.getTypedRuleContext(Sequence_prevContext, 0) as Sequence_prevContext;
	}
    public get ruleIndex(): number {
    	return n1qlParser.RULE_sequence_expr;
	}
	public enterRule(listener: n1qlListener): void {
	    if(listener.enterSequence_expr) {
	 		listener.enterSequence_expr(this);
		}
	}
	public exitRule(listener: n1qlListener): void {
	    if(listener.exitSequence_expr) {
	 		listener.exitSequence_expr(this);
		}
	}
}
