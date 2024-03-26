// Generated from src/antlr/n1ql/n1ql.g4 by ANTLR 4.13.1
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols
import {
	ATN,
	ATNDeserializer,
	CharStream,
	DecisionState, DFA,
	Lexer,
	LexerATNSimulator,
	RuleContext,
	PredictionContextCache,
	Token
} from "antlr4";
export default class n1qlLexer extends Lexer {
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
	public static readonly EOF = Token.EOF;

	public static readonly channelNames: string[] = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
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
                                                             "NEXT_PARAM" ];
	public static readonly modeNames: string[] = [ "DEFAULT_MODE", ];

	public static readonly ruleNames: string[] = [
		"SingleStringCharacter", "DoubleStringCharacter", "STR", "NumStart", "Digit", 
		"Int", "Exponent", "INT", "NUM", "BLOCK_COMMENT", "LINE_COMMENT", "WHITESPACE", 
		"DOT", "PLUS", "MINUS", "STAR", "DIV", "MOD", "DEQ", "EQ", "NE", "LT", 
		"LE", "GT", "GE", "CONCAT", "LPAREN", "RPAREN", "LBRACE", "RBRACE", "COMMA", 
		"COLON", "LBRACKET", "RBRACKET", "RBRACKET_ICASE", "SEMI", "NOT_A_TOKEN", 
		"NAMESPACE_ID", "ADVISE", "ALL", "ALTER", "ANALYZE", "AND", "ANY", "ARRAY", 
		"AS", "ASC", "AT", "BEGIN", "BETWEEN", "BINARY", "BOOLEAN", "BREAK", "BUCKET", 
		"BUILD", "BY", "CALL", "CASE", "CAST", "CLUSTER", "COLLATE", "COLLECTION", 
		"COMMIT", "COMMITTED", "CONNECT", "CONTINUE", "CORRELATED", "COVER", "CREATE", 
		"CURRENT", "DATABASE", "DATASET", "DATASTORE", "DECLARE", "DECREMENT", 
		"DELETE_", "DERIVED", "DESC", "DESCRIBE", "DISTINCT", "DO", "DROP", "EACH", 
		"ELEMENT", "ELSE", "END", "EVERY", "EXCEPT", "EXCLUDE", "EXECUTE", "EXISTS", 
		"EXPLAIN", "FALSE", "FETCH", "FILTER", "FIRST", "FLATTEN", "FLUSH", "FOLLOWING", 
		"FOR", "FORCE", "FROM", "FTS", "FUNCTION", "GOLANG", "GRANT", "GROUP", 
		"GROUPS", "GSI", "HASH", "HAVING", "IF", "IGNORE", "ILIKE", "IN", "INCLUDE", 
		"INCREMENT", "INDEX", "INFER", "INLINE", "INNER", "INSERT", "INTERSECT", 
		"INTO", "IS", "ISOLATION", "JAVASCRIPT", "JOIN", "KEY", "KEYS", "KEYSPACE", 
		"KNOWN", "LANGUAGE", "LAST", "LEFT", "LET_", "LETTING", "LEVEL", "LIKE", 
		"LIMIT", "LSM", "MAP", "MAPPING", "MATCHED", "MATERIALIZED", "MERGE", 
		"MISSING", "NAMESPACE", "NEST", "NL", "NO", "NOT", "NTH_VALUE", "NULL", 
		"NULLS", "NUMBER", "OBJECT", "OFFSET", "ON", "OPTION", "OPTIONS", "OR", 
		"ORDER", "OTHERS", "OUTER", "OVER", "PARSE", "PARTITION", "PASSWORD", 
		"PATH", "POOL", "PRECEDING", "PREPARE", "PRIMARY", "PRIVATE", "PRIVILEGE", 
		"PROCEDURE", "PROBE", "PUBLIC", "RANGE", "RAW", "READ", "REALM", "REDUCE", 
		"RENAME", "REPLACE", "RESPECT", "RETURN", "RETURNING", "REVOKE", "RIGHT", 
		"ROLE", "ROLLBACK", "ROW", "ROWS", "SATISFIES", "SAVEPOINT", "SCHEMA", 
		"SCOPE", "SELECT", "SELF", "SET", "SHOW", "SOME", "START", "STATISTICS", 
		"STRING", "SYSTEM", "THEN", "TIES", "TO", "TRAN", "TRANSACTION", "TRIGGER", 
		"TRUE", "TRUNCATE", "UNBOUNDED", "UNDER", "UNION", "UNIQUE", "UNKNOWN", 
		"UNNEST", "UNSET", "UPDATE", "UPSERT", "USE", "USER", "USING", "VALIDATE", 
		"VALUE", "VALUED", "VALUES", "VIA", "VIEW", "WHEN", "WHERE", "WHILE", 
		"WINDOW", "WITH", "WITHIN", "WORK", "XOR", "IdentChar", "IdentFirstChar", 
		"IdentLaterChar", "IDENT_ICASE", "IDENT", "NAMED_PARAM", "POSITIONAL_PARAM", 
		"NEXT_PARAM",
	];


	constructor(input: CharStream) {
		super(input);
		this._interp = new LexerATNSimulator(this, n1qlLexer._ATN, n1qlLexer.DecisionsToDFA, new PredictionContextCache());
	}

	public get grammarFileName(): string { return "n1ql.g4"; }

	public get literalNames(): (string | null)[] { return n1qlLexer.literalNames; }
	public get symbolicNames(): (string | null)[] { return n1qlLexer.symbolicNames; }
	public get ruleNames(): string[] { return n1qlLexer.ruleNames; }

	public get serializedATN(): number[] { return n1qlLexer._serializedATN; }

	public get channelNames(): string[] { return n1qlLexer.channelNames; }

	public get modeNames(): string[] { return n1qlLexer.modeNames; }

	public static readonly _serializedATN: number[] = [4,0,241,2072,6,-1,2,
	0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,
	9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,14,2,15,7,15,2,16,
	7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,
	23,2,24,7,24,2,25,7,25,2,26,7,26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,
	2,31,7,31,2,32,7,32,2,33,7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,
	38,7,38,2,39,7,39,2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,
	7,45,2,46,7,46,2,47,7,47,2,48,7,48,2,49,7,49,2,50,7,50,2,51,7,51,2,52,7,
	52,2,53,7,53,2,54,7,54,2,55,7,55,2,56,7,56,2,57,7,57,2,58,7,58,2,59,7,59,
	2,60,7,60,2,61,7,61,2,62,7,62,2,63,7,63,2,64,7,64,2,65,7,65,2,66,7,66,2,
	67,7,67,2,68,7,68,2,69,7,69,2,70,7,70,2,71,7,71,2,72,7,72,2,73,7,73,2,74,
	7,74,2,75,7,75,2,76,7,76,2,77,7,77,2,78,7,78,2,79,7,79,2,80,7,80,2,81,7,
	81,2,82,7,82,2,83,7,83,2,84,7,84,2,85,7,85,2,86,7,86,2,87,7,87,2,88,7,88,
	2,89,7,89,2,90,7,90,2,91,7,91,2,92,7,92,2,93,7,93,2,94,7,94,2,95,7,95,2,
	96,7,96,2,97,7,97,2,98,7,98,2,99,7,99,2,100,7,100,2,101,7,101,2,102,7,102,
	2,103,7,103,2,104,7,104,2,105,7,105,2,106,7,106,2,107,7,107,2,108,7,108,
	2,109,7,109,2,110,7,110,2,111,7,111,2,112,7,112,2,113,7,113,2,114,7,114,
	2,115,7,115,2,116,7,116,2,117,7,117,2,118,7,118,2,119,7,119,2,120,7,120,
	2,121,7,121,2,122,7,122,2,123,7,123,2,124,7,124,2,125,7,125,2,126,7,126,
	2,127,7,127,2,128,7,128,2,129,7,129,2,130,7,130,2,131,7,131,2,132,7,132,
	2,133,7,133,2,134,7,134,2,135,7,135,2,136,7,136,2,137,7,137,2,138,7,138,
	2,139,7,139,2,140,7,140,2,141,7,141,2,142,7,142,2,143,7,143,2,144,7,144,
	2,145,7,145,2,146,7,146,2,147,7,147,2,148,7,148,2,149,7,149,2,150,7,150,
	2,151,7,151,2,152,7,152,2,153,7,153,2,154,7,154,2,155,7,155,2,156,7,156,
	2,157,7,157,2,158,7,158,2,159,7,159,2,160,7,160,2,161,7,161,2,162,7,162,
	2,163,7,163,2,164,7,164,2,165,7,165,2,166,7,166,2,167,7,167,2,168,7,168,
	2,169,7,169,2,170,7,170,2,171,7,171,2,172,7,172,2,173,7,173,2,174,7,174,
	2,175,7,175,2,176,7,176,2,177,7,177,2,178,7,178,2,179,7,179,2,180,7,180,
	2,181,7,181,2,182,7,182,2,183,7,183,2,184,7,184,2,185,7,185,2,186,7,186,
	2,187,7,187,2,188,7,188,2,189,7,189,2,190,7,190,2,191,7,191,2,192,7,192,
	2,193,7,193,2,194,7,194,2,195,7,195,2,196,7,196,2,197,7,197,2,198,7,198,
	2,199,7,199,2,200,7,200,2,201,7,201,2,202,7,202,2,203,7,203,2,204,7,204,
	2,205,7,205,2,206,7,206,2,207,7,207,2,208,7,208,2,209,7,209,2,210,7,210,
	2,211,7,211,2,212,7,212,2,213,7,213,2,214,7,214,2,215,7,215,2,216,7,216,
	2,217,7,217,2,218,7,218,2,219,7,219,2,220,7,220,2,221,7,221,2,222,7,222,
	2,223,7,223,2,224,7,224,2,225,7,225,2,226,7,226,2,227,7,227,2,228,7,228,
	2,229,7,229,2,230,7,230,2,231,7,231,2,232,7,232,2,233,7,233,2,234,7,234,
	2,235,7,235,2,236,7,236,2,237,7,237,2,238,7,238,2,239,7,239,2,240,7,240,
	2,241,7,241,2,242,7,242,2,243,7,243,2,244,7,244,2,245,7,245,2,246,7,246,
	2,247,7,247,2,248,7,248,2,249,7,249,1,0,1,0,1,0,1,0,1,0,1,0,1,0,3,0,509,
	8,0,1,1,1,1,1,1,1,1,1,1,3,1,516,8,1,1,2,1,2,5,2,520,8,2,10,2,12,2,523,9,
	2,1,2,1,2,1,2,5,2,528,8,2,10,2,12,2,531,9,2,1,2,3,2,534,8,2,1,3,3,3,537,
	8,3,1,4,1,4,1,5,1,5,1,5,5,5,544,8,5,10,5,12,5,547,9,5,3,5,549,8,5,1,6,1,
	6,3,6,553,8,6,1,6,4,6,556,8,6,11,6,12,6,557,1,7,1,7,1,8,1,8,1,8,4,8,565,
	8,8,11,8,12,8,566,1,8,3,8,570,8,8,1,8,1,8,1,8,3,8,575,8,8,1,9,1,9,1,9,1,
	9,5,9,581,8,9,10,9,12,9,584,9,9,1,9,1,9,1,9,1,10,1,10,1,10,1,10,5,10,593,
	8,10,10,10,12,10,596,9,10,1,11,4,11,599,8,11,11,11,12,11,600,1,11,1,11,
	1,12,1,12,1,13,1,13,1,14,1,14,1,14,1,14,1,14,1,14,3,14,615,8,14,1,15,1,
	15,1,16,1,16,1,17,1,17,1,18,1,18,1,18,1,19,1,19,1,20,1,20,1,20,1,20,3,20,
	632,8,20,1,21,1,21,1,22,1,22,1,22,1,23,1,23,1,24,1,24,1,24,1,25,1,25,1,
	25,1,26,1,26,1,27,1,27,1,28,1,28,1,29,1,29,1,30,1,30,1,31,1,31,1,32,1,32,
	1,33,1,33,1,34,1,34,1,34,1,35,1,35,1,36,1,36,1,37,1,37,1,37,1,37,1,37,1,
	37,1,37,1,37,1,38,1,38,1,38,1,38,1,38,1,38,1,38,1,39,1,39,1,39,1,39,1,40,
	1,40,1,40,1,40,1,40,1,40,1,41,1,41,1,41,1,41,1,41,1,41,1,41,1,41,1,42,1,
	42,1,42,1,42,1,43,1,43,1,43,1,43,1,44,1,44,1,44,1,44,1,44,1,44,1,45,1,45,
	1,45,1,46,1,46,1,46,1,46,1,47,1,47,1,47,1,48,1,48,1,48,1,48,1,48,1,48,1,
	49,1,49,1,49,1,49,1,49,1,49,1,49,1,49,1,50,1,50,1,50,1,50,1,50,1,50,1,50,
	1,51,1,51,1,51,1,51,1,51,1,51,1,51,1,51,1,52,1,52,1,52,1,52,1,52,1,52,1,
	53,1,53,1,53,1,53,1,53,1,53,1,53,1,54,1,54,1,54,1,54,1,54,1,54,1,55,1,55,
	1,55,1,56,1,56,1,56,1,56,1,56,1,57,1,57,1,57,1,57,1,57,1,58,1,58,1,58,1,
	58,1,58,1,59,1,59,1,59,1,59,1,59,1,59,1,59,1,59,1,60,1,60,1,60,1,60,1,60,
	1,60,1,60,1,60,1,61,1,61,1,61,1,61,1,61,1,61,1,61,1,61,1,61,1,61,1,61,1,
	62,1,62,1,62,1,62,1,62,1,62,1,62,1,63,1,63,1,63,1,63,1,63,1,63,1,63,1,63,
	1,63,1,63,1,64,1,64,1,64,1,64,1,64,1,64,1,64,1,64,1,65,1,65,1,65,1,65,1,
	65,1,65,1,65,1,65,1,65,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,
	1,66,1,67,1,67,1,67,1,67,1,67,1,67,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,
	69,1,69,1,69,1,69,1,69,1,69,1,69,1,69,1,70,1,70,1,70,1,70,1,70,1,70,1,70,
	1,70,1,70,1,71,1,71,1,71,1,71,1,71,1,71,1,71,1,71,1,72,1,72,1,72,1,72,1,
	72,1,72,1,72,1,72,1,72,1,72,1,73,1,73,1,73,1,73,1,73,1,73,1,73,1,73,1,74,
	1,74,1,74,1,74,1,74,1,74,1,74,1,74,1,74,1,74,1,75,1,75,1,75,1,75,1,75,1,
	75,1,75,1,76,1,76,1,76,1,76,1,76,1,76,1,76,1,76,1,77,1,77,1,77,1,77,1,77,
	1,78,1,78,1,78,1,78,1,78,1,78,1,78,1,78,1,78,1,79,1,79,1,79,1,79,1,79,1,
	79,1,79,1,79,1,79,1,80,1,80,1,80,1,81,1,81,1,81,1,81,1,81,1,82,1,82,1,82,
	1,82,1,82,1,83,1,83,1,83,1,83,1,83,1,83,1,83,1,83,1,84,1,84,1,84,1,84,1,
	84,1,85,1,85,1,85,1,85,1,86,1,86,1,86,1,86,1,86,1,86,1,87,1,87,1,87,1,87,
	1,87,1,87,1,87,1,88,1,88,1,88,1,88,1,88,1,88,1,88,1,88,1,89,1,89,1,89,1,
	89,1,89,1,89,1,89,1,89,1,90,1,90,1,90,1,90,1,90,1,90,1,90,1,91,1,91,1,91,
	1,91,1,91,1,91,1,91,1,91,1,92,1,92,1,92,1,92,1,92,1,92,1,93,1,93,1,93,1,
	93,1,93,1,93,1,94,1,94,1,94,1,94,1,94,1,94,1,94,1,95,1,95,1,95,1,95,1,95,
	1,95,1,96,1,96,1,96,1,96,1,96,1,96,1,96,1,96,1,97,1,97,1,97,1,97,1,97,1,
	97,1,98,1,98,1,98,1,98,1,98,1,98,1,98,1,98,1,98,1,98,1,99,1,99,1,99,1,99,
	1,100,1,100,1,100,1,100,1,100,1,100,1,101,1,101,1,101,1,101,1,101,1,102,
	1,102,1,102,1,102,1,103,1,103,1,103,1,103,1,103,1,103,1,103,1,103,1,103,
	1,104,1,104,1,104,1,104,1,104,1,104,1,104,1,105,1,105,1,105,1,105,1,105,
	1,105,1,106,1,106,1,106,1,106,1,106,1,106,1,107,1,107,1,107,1,107,1,107,
	1,107,1,107,1,108,1,108,1,108,1,108,1,109,1,109,1,109,1,109,1,109,1,110,
	1,110,1,110,1,110,1,110,1,110,1,110,1,111,1,111,1,111,1,112,1,112,1,112,
	1,112,1,112,1,112,1,112,1,113,1,113,1,113,1,113,1,113,1,113,1,114,1,114,
	1,114,1,115,1,115,1,115,1,115,1,115,1,115,1,115,1,115,1,116,1,116,1,116,
	1,116,1,116,1,116,1,116,1,116,1,116,1,116,1,117,1,117,1,117,1,117,1,117,
	1,117,1,118,1,118,1,118,1,118,1,118,1,118,1,119,1,119,1,119,1,119,1,119,
	1,119,1,119,1,120,1,120,1,120,1,120,1,120,1,120,1,121,1,121,1,121,1,121,
	1,121,1,121,1,121,1,122,1,122,1,122,1,122,1,122,1,122,1,122,1,122,1,122,
	1,122,1,123,1,123,1,123,1,123,1,123,1,124,1,124,1,124,1,125,1,125,1,125,
	1,125,1,125,1,125,1,125,1,125,1,125,1,125,1,126,1,126,1,126,1,126,1,126,
	1,126,1,126,1,126,1,126,1,126,1,126,1,127,1,127,1,127,1,127,1,127,1,128,
	1,128,1,128,1,128,1,129,1,129,1,129,1,129,1,129,1,130,1,130,1,130,1,130,
	1,130,1,130,1,130,1,130,1,130,1,131,1,131,1,131,1,131,1,131,1,131,1,132,
	1,132,1,132,1,132,1,132,1,132,1,132,1,132,1,132,1,133,1,133,1,133,1,133,
	1,133,1,134,1,134,1,134,1,134,1,134,1,135,1,135,1,135,1,135,1,136,1,136,
	1,136,1,136,1,136,1,136,1,136,1,136,1,137,1,137,1,137,1,137,1,137,1,137,
	1,138,1,138,1,138,1,138,1,138,1,139,1,139,1,139,1,139,1,139,1,139,1,140,
	1,140,1,140,1,140,1,141,1,141,1,141,1,141,1,142,1,142,1,142,1,142,1,142,
	1,142,1,142,1,142,1,143,1,143,1,143,1,143,1,143,1,143,1,143,1,143,1,144,
	1,144,1,144,1,144,1,144,1,144,1,144,1,144,1,144,1,144,1,144,1,144,1,144,
	1,145,1,145,1,145,1,145,1,145,1,145,1,146,1,146,1,146,1,146,1,146,1,146,
	1,146,1,146,1,147,1,147,1,147,1,147,1,147,1,147,1,147,1,147,1,147,1,147,
	1,148,1,148,1,148,1,148,1,148,1,149,1,149,1,149,1,150,1,150,1,150,1,151,
	1,151,1,151,1,151,1,152,1,152,1,152,1,152,1,152,1,152,1,152,1,152,1,152,
	1,152,1,153,1,153,1,153,1,153,1,153,1,154,1,154,1,154,1,154,1,154,1,154,
	1,155,1,155,1,155,1,155,1,155,1,155,1,155,1,156,1,156,1,156,1,156,1,156,
	1,156,1,156,1,157,1,157,1,157,1,157,1,157,1,157,1,157,1,158,1,158,1,158,
	1,159,1,159,1,159,1,159,1,159,1,159,1,159,1,160,1,160,1,160,1,160,1,160,
	1,160,1,160,1,160,1,161,1,161,1,161,1,162,1,162,1,162,1,162,1,162,1,162,
	1,163,1,163,1,163,1,163,1,163,1,163,1,163,1,164,1,164,1,164,1,164,1,164,
	1,164,1,165,1,165,1,165,1,165,1,165,1,166,1,166,1,166,1,166,1,166,1,166,
	1,167,1,167,1,167,1,167,1,167,1,167,1,167,1,167,1,167,1,167,1,168,1,168,
	1,168,1,168,1,168,1,168,1,168,1,168,1,168,1,169,1,169,1,169,1,169,1,169,
	1,170,1,170,1,170,1,170,1,170,1,171,1,171,1,171,1,171,1,171,1,171,1,171,
	1,171,1,171,1,171,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,172,1,173,
	1,173,1,173,1,173,1,173,1,173,1,173,1,173,1,174,1,174,1,174,1,174,1,174,
	1,174,1,174,1,174,1,175,1,175,1,175,1,175,1,175,1,175,1,175,1,175,1,175,
	1,175,1,176,1,176,1,176,1,176,1,176,1,176,1,176,1,176,1,176,1,176,1,177,
	1,177,1,177,1,177,1,177,1,177,1,178,1,178,1,178,1,178,1,178,1,178,1,178,
	1,179,1,179,1,179,1,179,1,179,1,179,1,180,1,180,1,180,1,180,1,181,1,181,
	1,181,1,181,1,181,1,182,1,182,1,182,1,182,1,182,1,182,1,183,1,183,1,183,
	1,183,1,183,1,183,1,183,1,184,1,184,1,184,1,184,1,184,1,184,1,184,1,185,
	1,185,1,185,1,185,1,185,1,185,1,185,1,185,1,186,1,186,1,186,1,186,1,186,
	1,186,1,186,1,186,1,187,1,187,1,187,1,187,1,187,1,187,1,187,1,188,1,188,
	1,188,1,188,1,188,1,188,1,188,1,188,1,188,1,188,1,189,1,189,1,189,1,189,
	1,189,1,189,1,189,1,190,1,190,1,190,1,190,1,190,1,190,1,191,1,191,1,191,
	1,191,1,191,1,192,1,192,1,192,1,192,1,192,1,192,1,192,1,192,1,192,1,193,
	1,193,1,193,1,193,1,194,1,194,1,194,1,194,1,194,1,195,1,195,1,195,1,195,
	1,195,1,195,1,195,1,195,1,195,1,195,1,196,1,196,1,196,1,196,1,196,1,196,
	1,196,1,196,1,196,1,196,1,197,1,197,1,197,1,197,1,197,1,197,1,197,1,198,
	1,198,1,198,1,198,1,198,1,198,1,199,1,199,1,199,1,199,1,199,1,199,1,199,
	1,200,1,200,1,200,1,200,1,200,1,201,1,201,1,201,1,201,1,202,1,202,1,202,
	1,202,1,202,1,203,1,203,1,203,1,203,1,203,1,204,1,204,1,204,1,204,1,204,
	1,204,1,205,1,205,1,205,1,205,1,205,1,205,1,205,1,205,1,205,1,205,1,205,
	1,206,1,206,1,206,1,206,1,206,1,206,1,206,1,207,1,207,1,207,1,207,1,207,
	1,207,1,207,1,208,1,208,1,208,1,208,1,208,1,209,1,209,1,209,1,209,1,209,
	1,210,1,210,1,210,1,211,1,211,1,211,1,211,1,211,1,212,1,212,1,212,1,212,
	1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,212,1,213,1,213,1,213,1,213,
	1,213,1,213,1,213,1,213,1,214,1,214,1,214,1,214,1,214,1,215,1,215,1,215,
	1,215,1,215,1,215,1,215,1,215,1,215,1,216,1,216,1,216,1,216,1,216,1,216,
	1,216,1,216,1,216,1,216,1,217,1,217,1,217,1,217,1,217,1,217,1,218,1,218,
	1,218,1,218,1,218,1,218,1,219,1,219,1,219,1,219,1,219,1,219,1,219,1,220,
	1,220,1,220,1,220,1,220,1,220,1,220,1,220,1,221,1,221,1,221,1,221,1,221,
	1,221,1,221,1,222,1,222,1,222,1,222,1,222,1,222,1,223,1,223,1,223,1,223,
	1,223,1,223,1,223,1,224,1,224,1,224,1,224,1,224,1,224,1,224,1,225,1,225,
	1,225,1,225,1,226,1,226,1,226,1,226,1,226,1,227,1,227,1,227,1,227,1,227,
	1,227,1,228,1,228,1,228,1,228,1,228,1,228,1,228,1,228,1,228,1,229,1,229,
	1,229,1,229,1,229,1,229,1,230,1,230,1,230,1,230,1,230,1,230,1,230,1,231,
	1,231,1,231,1,231,1,231,1,231,1,231,1,232,1,232,1,232,1,232,1,233,1,233,
	1,233,1,233,1,233,1,234,1,234,1,234,1,234,1,234,1,235,1,235,1,235,1,235,
	1,235,1,235,1,236,1,236,1,236,1,236,1,236,1,236,1,237,1,237,1,237,1,237,
	1,237,1,237,1,237,1,238,1,238,1,238,1,238,1,238,1,239,1,239,1,239,1,239,
	1,239,1,239,1,239,1,240,1,240,1,240,1,240,1,240,1,241,1,241,1,241,1,241,
	1,242,1,242,1,242,3,242,2023,8,242,1,243,1,243,1,244,1,244,1,245,1,245,
	4,245,2031,8,245,11,245,12,245,2032,1,245,1,245,1,245,1,246,1,246,4,246,
	2040,8,246,11,246,12,246,2041,1,246,1,246,1,246,1,246,5,246,2048,8,246,
	10,246,12,246,2051,9,246,3,246,2053,8,246,1,247,1,247,1,247,5,247,2058,
	8,247,10,247,12,247,2061,9,247,1,248,1,248,1,248,5,248,2066,8,248,10,248,
	12,248,2069,9,248,1,249,1,249,1,582,0,250,1,0,3,0,5,1,7,0,9,0,11,0,13,0,
	15,2,17,3,19,4,21,5,23,6,25,7,27,8,29,9,31,10,33,11,35,12,37,13,39,14,41,
	15,43,16,45,17,47,18,49,19,51,20,53,21,55,22,57,23,59,24,61,25,63,26,65,
	27,67,28,69,29,71,30,73,31,75,32,77,33,79,34,81,35,83,36,85,37,87,38,89,
	39,91,40,93,41,95,42,97,43,99,44,101,45,103,46,105,47,107,48,109,49,111,
	50,113,51,115,52,117,53,119,54,121,55,123,56,125,57,127,58,129,59,131,60,
	133,61,135,62,137,63,139,64,141,65,143,66,145,67,147,68,149,69,151,70,153,
	71,155,72,157,73,159,74,161,75,163,76,165,77,167,78,169,79,171,80,173,81,
	175,82,177,83,179,84,181,85,183,86,185,87,187,88,189,89,191,90,193,91,195,
	92,197,93,199,94,201,95,203,96,205,97,207,98,209,99,211,100,213,101,215,
	102,217,103,219,104,221,105,223,106,225,107,227,108,229,109,231,110,233,
	111,235,112,237,113,239,114,241,115,243,116,245,117,247,118,249,119,251,
	120,253,121,255,122,257,123,259,124,261,125,263,126,265,127,267,128,269,
	129,271,130,273,131,275,132,277,133,279,134,281,135,283,136,285,137,287,
	138,289,139,291,140,293,141,295,142,297,143,299,144,301,145,303,146,305,
	147,307,148,309,149,311,150,313,151,315,152,317,153,319,154,321,155,323,
	156,325,157,327,158,329,159,331,160,333,161,335,162,337,163,339,164,341,
	165,343,166,345,167,347,168,349,169,351,170,353,171,355,172,357,173,359,
	174,361,175,363,176,365,177,367,178,369,179,371,180,373,181,375,182,377,
	183,379,184,381,185,383,186,385,187,387,188,389,189,391,190,393,191,395,
	192,397,193,399,194,401,195,403,196,405,197,407,198,409,199,411,200,413,
	201,415,202,417,203,419,204,421,205,423,206,425,207,427,208,429,209,431,
	210,433,211,435,212,437,213,439,214,441,215,443,216,445,217,447,218,449,
	219,451,220,453,221,455,222,457,223,459,224,461,225,463,226,465,227,467,
	228,469,229,471,230,473,231,475,232,477,233,479,234,481,235,483,236,485,
	0,487,0,489,0,491,237,493,238,495,239,497,240,499,241,1,0,40,1,0,39,39,
	4,0,10,10,13,13,39,39,92,92,1,0,34,34,2,0,34,34,92,92,1,0,48,57,2,0,69,
	69,101,101,2,0,43,43,45,45,2,0,10,10,13,13,4,0,9,10,12,13,32,32,160,160,
	2,0,77,77,109,109,2,0,73,73,105,105,2,0,78,78,110,110,2,0,85,85,117,117,
	2,0,83,83,115,115,2,0,68,68,100,100,2,0,70,70,102,102,2,0,65,65,97,97,2,
	0,76,76,108,108,2,0,84,84,116,116,2,0,86,86,118,118,2,0,82,82,114,114,2,
	0,89,89,121,121,2,0,90,90,122,122,2,0,67,67,99,99,2,0,66,66,98,98,2,0,71,
	71,103,103,2,0,87,87,119,119,2,0,79,79,111,111,2,0,75,75,107,107,2,0,80,
	80,112,112,2,0,72,72,104,104,2,0,88,88,120,120,2,0,74,74,106,106,1,0,95,
	95,2,0,78,78,117,117,2,0,81,81,113,113,1,0,96,96,3,0,65,90,95,95,97,122,
	4,0,48,57,65,90,95,95,97,122,1,0,49,57,2089,0,5,1,0,0,0,0,15,1,0,0,0,0,
	17,1,0,0,0,0,19,1,0,0,0,0,21,1,0,0,0,0,23,1,0,0,0,0,25,1,0,0,0,0,27,1,0,
	0,0,0,29,1,0,0,0,0,31,1,0,0,0,0,33,1,0,0,0,0,35,1,0,0,0,0,37,1,0,0,0,0,
	39,1,0,0,0,0,41,1,0,0,0,0,43,1,0,0,0,0,45,1,0,0,0,0,47,1,0,0,0,0,49,1,0,
	0,0,0,51,1,0,0,0,0,53,1,0,0,0,0,55,1,0,0,0,0,57,1,0,0,0,0,59,1,0,0,0,0,
	61,1,0,0,0,0,63,1,0,0,0,0,65,1,0,0,0,0,67,1,0,0,0,0,69,1,0,0,0,0,71,1,0,
	0,0,0,73,1,0,0,0,0,75,1,0,0,0,0,77,1,0,0,0,0,79,1,0,0,0,0,81,1,0,0,0,0,
	83,1,0,0,0,0,85,1,0,0,0,0,87,1,0,0,0,0,89,1,0,0,0,0,91,1,0,0,0,0,93,1,0,
	0,0,0,95,1,0,0,0,0,97,1,0,0,0,0,99,1,0,0,0,0,101,1,0,0,0,0,103,1,0,0,0,
	0,105,1,0,0,0,0,107,1,0,0,0,0,109,1,0,0,0,0,111,1,0,0,0,0,113,1,0,0,0,0,
	115,1,0,0,0,0,117,1,0,0,0,0,119,1,0,0,0,0,121,1,0,0,0,0,123,1,0,0,0,0,125,
	1,0,0,0,0,127,1,0,0,0,0,129,1,0,0,0,0,131,1,0,0,0,0,133,1,0,0,0,0,135,1,
	0,0,0,0,137,1,0,0,0,0,139,1,0,0,0,0,141,1,0,0,0,0,143,1,0,0,0,0,145,1,0,
	0,0,0,147,1,0,0,0,0,149,1,0,0,0,0,151,1,0,0,0,0,153,1,0,0,0,0,155,1,0,0,
	0,0,157,1,0,0,0,0,159,1,0,0,0,0,161,1,0,0,0,0,163,1,0,0,0,0,165,1,0,0,0,
	0,167,1,0,0,0,0,169,1,0,0,0,0,171,1,0,0,0,0,173,1,0,0,0,0,175,1,0,0,0,0,
	177,1,0,0,0,0,179,1,0,0,0,0,181,1,0,0,0,0,183,1,0,0,0,0,185,1,0,0,0,0,187,
	1,0,0,0,0,189,1,0,0,0,0,191,1,0,0,0,0,193,1,0,0,0,0,195,1,0,0,0,0,197,1,
	0,0,0,0,199,1,0,0,0,0,201,1,0,0,0,0,203,1,0,0,0,0,205,1,0,0,0,0,207,1,0,
	0,0,0,209,1,0,0,0,0,211,1,0,0,0,0,213,1,0,0,0,0,215,1,0,0,0,0,217,1,0,0,
	0,0,219,1,0,0,0,0,221,1,0,0,0,0,223,1,0,0,0,0,225,1,0,0,0,0,227,1,0,0,0,
	0,229,1,0,0,0,0,231,1,0,0,0,0,233,1,0,0,0,0,235,1,0,0,0,0,237,1,0,0,0,0,
	239,1,0,0,0,0,241,1,0,0,0,0,243,1,0,0,0,0,245,1,0,0,0,0,247,1,0,0,0,0,249,
	1,0,0,0,0,251,1,0,0,0,0,253,1,0,0,0,0,255,1,0,0,0,0,257,1,0,0,0,0,259,1,
	0,0,0,0,261,1,0,0,0,0,263,1,0,0,0,0,265,1,0,0,0,0,267,1,0,0,0,0,269,1,0,
	0,0,0,271,1,0,0,0,0,273,1,0,0,0,0,275,1,0,0,0,0,277,1,0,0,0,0,279,1,0,0,
	0,0,281,1,0,0,0,0,283,1,0,0,0,0,285,1,0,0,0,0,287,1,0,0,0,0,289,1,0,0,0,
	0,291,1,0,0,0,0,293,1,0,0,0,0,295,1,0,0,0,0,297,1,0,0,0,0,299,1,0,0,0,0,
	301,1,0,0,0,0,303,1,0,0,0,0,305,1,0,0,0,0,307,1,0,0,0,0,309,1,0,0,0,0,311,
	1,0,0,0,0,313,1,0,0,0,0,315,1,0,0,0,0,317,1,0,0,0,0,319,1,0,0,0,0,321,1,
	0,0,0,0,323,1,0,0,0,0,325,1,0,0,0,0,327,1,0,0,0,0,329,1,0,0,0,0,331,1,0,
	0,0,0,333,1,0,0,0,0,335,1,0,0,0,0,337,1,0,0,0,0,339,1,0,0,0,0,341,1,0,0,
	0,0,343,1,0,0,0,0,345,1,0,0,0,0,347,1,0,0,0,0,349,1,0,0,0,0,351,1,0,0,0,
	0,353,1,0,0,0,0,355,1,0,0,0,0,357,1,0,0,0,0,359,1,0,0,0,0,361,1,0,0,0,0,
	363,1,0,0,0,0,365,1,0,0,0,0,367,1,0,0,0,0,369,1,0,0,0,0,371,1,0,0,0,0,373,
	1,0,0,0,0,375,1,0,0,0,0,377,1,0,0,0,0,379,1,0,0,0,0,381,1,0,0,0,0,383,1,
	0,0,0,0,385,1,0,0,0,0,387,1,0,0,0,0,389,1,0,0,0,0,391,1,0,0,0,0,393,1,0,
	0,0,0,395,1,0,0,0,0,397,1,0,0,0,0,399,1,0,0,0,0,401,1,0,0,0,0,403,1,0,0,
	0,0,405,1,0,0,0,0,407,1,0,0,0,0,409,1,0,0,0,0,411,1,0,0,0,0,413,1,0,0,0,
	0,415,1,0,0,0,0,417,1,0,0,0,0,419,1,0,0,0,0,421,1,0,0,0,0,423,1,0,0,0,0,
	425,1,0,0,0,0,427,1,0,0,0,0,429,1,0,0,0,0,431,1,0,0,0,0,433,1,0,0,0,0,435,
	1,0,0,0,0,437,1,0,0,0,0,439,1,0,0,0,0,441,1,0,0,0,0,443,1,0,0,0,0,445,1,
	0,0,0,0,447,1,0,0,0,0,449,1,0,0,0,0,451,1,0,0,0,0,453,1,0,0,0,0,455,1,0,
	0,0,0,457,1,0,0,0,0,459,1,0,0,0,0,461,1,0,0,0,0,463,1,0,0,0,0,465,1,0,0,
	0,0,467,1,0,0,0,0,469,1,0,0,0,0,471,1,0,0,0,0,473,1,0,0,0,0,475,1,0,0,0,
	0,477,1,0,0,0,0,479,1,0,0,0,0,481,1,0,0,0,0,483,1,0,0,0,0,491,1,0,0,0,0,
	493,1,0,0,0,0,495,1,0,0,0,0,497,1,0,0,0,0,499,1,0,0,0,1,508,1,0,0,0,3,515,
	1,0,0,0,5,533,1,0,0,0,7,536,1,0,0,0,9,538,1,0,0,0,11,548,1,0,0,0,13,550,
	1,0,0,0,15,559,1,0,0,0,17,574,1,0,0,0,19,576,1,0,0,0,21,588,1,0,0,0,23,
	598,1,0,0,0,25,604,1,0,0,0,27,606,1,0,0,0,29,614,1,0,0,0,31,616,1,0,0,0,
	33,618,1,0,0,0,35,620,1,0,0,0,37,622,1,0,0,0,39,625,1,0,0,0,41,631,1,0,
	0,0,43,633,1,0,0,0,45,635,1,0,0,0,47,638,1,0,0,0,49,640,1,0,0,0,51,643,
	1,0,0,0,53,646,1,0,0,0,55,648,1,0,0,0,57,650,1,0,0,0,59,652,1,0,0,0,61,
	654,1,0,0,0,63,656,1,0,0,0,65,658,1,0,0,0,67,660,1,0,0,0,69,662,1,0,0,0,
	71,665,1,0,0,0,73,667,1,0,0,0,75,669,1,0,0,0,77,677,1,0,0,0,79,684,1,0,
	0,0,81,688,1,0,0,0,83,694,1,0,0,0,85,702,1,0,0,0,87,706,1,0,0,0,89,710,
	1,0,0,0,91,716,1,0,0,0,93,719,1,0,0,0,95,723,1,0,0,0,97,726,1,0,0,0,99,
	732,1,0,0,0,101,740,1,0,0,0,103,747,1,0,0,0,105,755,1,0,0,0,107,761,1,0,
	0,0,109,768,1,0,0,0,111,774,1,0,0,0,113,777,1,0,0,0,115,782,1,0,0,0,117,
	787,1,0,0,0,119,792,1,0,0,0,121,800,1,0,0,0,123,808,1,0,0,0,125,819,1,0,
	0,0,127,826,1,0,0,0,129,836,1,0,0,0,131,844,1,0,0,0,133,853,1,0,0,0,135,
	864,1,0,0,0,137,870,1,0,0,0,139,877,1,0,0,0,141,885,1,0,0,0,143,894,1,0,
	0,0,145,902,1,0,0,0,147,912,1,0,0,0,149,920,1,0,0,0,151,930,1,0,0,0,153,
	937,1,0,0,0,155,945,1,0,0,0,157,950,1,0,0,0,159,959,1,0,0,0,161,968,1,0,
	0,0,163,971,1,0,0,0,165,976,1,0,0,0,167,981,1,0,0,0,169,989,1,0,0,0,171,
	994,1,0,0,0,173,998,1,0,0,0,175,1004,1,0,0,0,177,1011,1,0,0,0,179,1019,
	1,0,0,0,181,1027,1,0,0,0,183,1034,1,0,0,0,185,1042,1,0,0,0,187,1048,1,0,
	0,0,189,1054,1,0,0,0,191,1061,1,0,0,0,193,1067,1,0,0,0,195,1075,1,0,0,0,
	197,1081,1,0,0,0,199,1091,1,0,0,0,201,1095,1,0,0,0,203,1101,1,0,0,0,205,
	1106,1,0,0,0,207,1110,1,0,0,0,209,1119,1,0,0,0,211,1126,1,0,0,0,213,1132,
	1,0,0,0,215,1138,1,0,0,0,217,1145,1,0,0,0,219,1149,1,0,0,0,221,1154,1,0,
	0,0,223,1161,1,0,0,0,225,1164,1,0,0,0,227,1171,1,0,0,0,229,1177,1,0,0,0,
	231,1180,1,0,0,0,233,1188,1,0,0,0,235,1198,1,0,0,0,237,1204,1,0,0,0,239,
	1210,1,0,0,0,241,1217,1,0,0,0,243,1223,1,0,0,0,245,1230,1,0,0,0,247,1240,
	1,0,0,0,249,1245,1,0,0,0,251,1248,1,0,0,0,253,1258,1,0,0,0,255,1269,1,0,
	0,0,257,1274,1,0,0,0,259,1278,1,0,0,0,261,1283,1,0,0,0,263,1292,1,0,0,0,
	265,1298,1,0,0,0,267,1307,1,0,0,0,269,1312,1,0,0,0,271,1317,1,0,0,0,273,
	1321,1,0,0,0,275,1329,1,0,0,0,277,1335,1,0,0,0,279,1340,1,0,0,0,281,1346,
	1,0,0,0,283,1350,1,0,0,0,285,1354,1,0,0,0,287,1362,1,0,0,0,289,1370,1,0,
	0,0,291,1383,1,0,0,0,293,1389,1,0,0,0,295,1397,1,0,0,0,297,1407,1,0,0,0,
	299,1412,1,0,0,0,301,1415,1,0,0,0,303,1418,1,0,0,0,305,1422,1,0,0,0,307,
	1432,1,0,0,0,309,1437,1,0,0,0,311,1443,1,0,0,0,313,1450,1,0,0,0,315,1457,
	1,0,0,0,317,1464,1,0,0,0,319,1467,1,0,0,0,321,1474,1,0,0,0,323,1482,1,0,
	0,0,325,1485,1,0,0,0,327,1491,1,0,0,0,329,1498,1,0,0,0,331,1504,1,0,0,0,
	333,1509,1,0,0,0,335,1515,1,0,0,0,337,1525,1,0,0,0,339,1534,1,0,0,0,341,
	1539,1,0,0,0,343,1544,1,0,0,0,345,1554,1,0,0,0,347,1562,1,0,0,0,349,1570,
	1,0,0,0,351,1578,1,0,0,0,353,1588,1,0,0,0,355,1598,1,0,0,0,357,1604,1,0,
	0,0,359,1611,1,0,0,0,361,1617,1,0,0,0,363,1621,1,0,0,0,365,1626,1,0,0,0,
	367,1632,1,0,0,0,369,1639,1,0,0,0,371,1646,1,0,0,0,373,1654,1,0,0,0,375,
	1662,1,0,0,0,377,1669,1,0,0,0,379,1679,1,0,0,0,381,1686,1,0,0,0,383,1692,
	1,0,0,0,385,1697,1,0,0,0,387,1706,1,0,0,0,389,1710,1,0,0,0,391,1715,1,0,
	0,0,393,1725,1,0,0,0,395,1735,1,0,0,0,397,1742,1,0,0,0,399,1748,1,0,0,0,
	401,1755,1,0,0,0,403,1760,1,0,0,0,405,1764,1,0,0,0,407,1769,1,0,0,0,409,
	1774,1,0,0,0,411,1780,1,0,0,0,413,1791,1,0,0,0,415,1798,1,0,0,0,417,1805,
	1,0,0,0,419,1810,1,0,0,0,421,1815,1,0,0,0,423,1818,1,0,0,0,425,1823,1,0,
	0,0,427,1835,1,0,0,0,429,1843,1,0,0,0,431,1848,1,0,0,0,433,1857,1,0,0,0,
	435,1867,1,0,0,0,437,1873,1,0,0,0,439,1879,1,0,0,0,441,1886,1,0,0,0,443,
	1894,1,0,0,0,445,1901,1,0,0,0,447,1907,1,0,0,0,449,1914,1,0,0,0,451,1921,
	1,0,0,0,453,1925,1,0,0,0,455,1930,1,0,0,0,457,1936,1,0,0,0,459,1945,1,0,
	0,0,461,1951,1,0,0,0,463,1958,1,0,0,0,465,1965,1,0,0,0,467,1969,1,0,0,0,
	469,1974,1,0,0,0,471,1979,1,0,0,0,473,1985,1,0,0,0,475,1991,1,0,0,0,477,
	1998,1,0,0,0,479,2003,1,0,0,0,481,2010,1,0,0,0,483,2015,1,0,0,0,485,2022,
	1,0,0,0,487,2024,1,0,0,0,489,2026,1,0,0,0,491,2028,1,0,0,0,493,2052,1,0,
	0,0,495,2054,1,0,0,0,497,2062,1,0,0,0,499,2070,1,0,0,0,501,502,5,39,0,0,
	502,509,5,39,0,0,503,504,5,92,0,0,504,509,5,39,0,0,505,506,5,92,0,0,506,
	509,8,0,0,0,507,509,8,1,0,0,508,501,1,0,0,0,508,503,1,0,0,0,508,505,1,0,
	0,0,508,507,1,0,0,0,509,2,1,0,0,0,510,511,5,92,0,0,511,516,5,34,0,0,512,
	513,5,92,0,0,513,516,8,2,0,0,514,516,8,3,0,0,515,510,1,0,0,0,515,512,1,
	0,0,0,515,514,1,0,0,0,516,4,1,0,0,0,517,521,5,39,0,0,518,520,3,1,0,0,519,
	518,1,0,0,0,520,523,1,0,0,0,521,519,1,0,0,0,521,522,1,0,0,0,522,524,1,0,
	0,0,523,521,1,0,0,0,524,534,5,39,0,0,525,529,5,34,0,0,526,528,3,3,1,0,527,
	526,1,0,0,0,528,531,1,0,0,0,529,527,1,0,0,0,529,530,1,0,0,0,530,532,1,0,
	0,0,531,529,1,0,0,0,532,534,5,34,0,0,533,517,1,0,0,0,533,525,1,0,0,0,534,
	6,1,0,0,0,535,537,2,48,57,0,536,535,1,0,0,0,537,8,1,0,0,0,538,539,7,4,0,
	0,539,10,1,0,0,0,540,549,5,48,0,0,541,545,3,7,3,0,542,544,3,9,4,0,543,542,
	1,0,0,0,544,547,1,0,0,0,545,543,1,0,0,0,545,546,1,0,0,0,546,549,1,0,0,0,
	547,545,1,0,0,0,548,540,1,0,0,0,548,541,1,0,0,0,549,12,1,0,0,0,550,552,
	7,5,0,0,551,553,7,6,0,0,552,551,1,0,0,0,552,553,1,0,0,0,553,555,1,0,0,0,
	554,556,3,9,4,0,555,554,1,0,0,0,556,557,1,0,0,0,557,555,1,0,0,0,557,558,
	1,0,0,0,558,14,1,0,0,0,559,560,3,11,5,0,560,16,1,0,0,0,561,562,3,11,5,0,
	562,564,5,46,0,0,563,565,3,9,4,0,564,563,1,0,0,0,565,566,1,0,0,0,566,564,
	1,0,0,0,566,567,1,0,0,0,567,569,1,0,0,0,568,570,3,13,6,0,569,568,1,0,0,
	0,569,570,1,0,0,0,570,575,1,0,0,0,571,572,3,11,5,0,572,573,3,13,6,0,573,
	575,1,0,0,0,574,561,1,0,0,0,574,571,1,0,0,0,575,18,1,0,0,0,576,577,5,47,
	0,0,577,578,5,42,0,0,578,582,1,0,0,0,579,581,9,0,0,0,580,579,1,0,0,0,581,
	584,1,0,0,0,582,583,1,0,0,0,582,580,1,0,0,0,583,585,1,0,0,0,584,582,1,0,
	0,0,585,586,5,42,0,0,586,587,5,47,0,0,587,20,1,0,0,0,588,589,5,45,0,0,589,
	590,5,45,0,0,590,594,1,0,0,0,591,593,8,7,0,0,592,591,1,0,0,0,593,596,1,
	0,0,0,594,592,1,0,0,0,594,595,1,0,0,0,595,22,1,0,0,0,596,594,1,0,0,0,597,
	599,7,8,0,0,598,597,1,0,0,0,599,600,1,0,0,0,600,598,1,0,0,0,600,601,1,0,
	0,0,601,602,1,0,0,0,602,603,6,11,0,0,603,24,1,0,0,0,604,605,5,46,0,0,605,
	26,1,0,0,0,606,607,5,43,0,0,607,28,1,0,0,0,608,615,5,45,0,0,609,610,7,9,
	0,0,610,611,7,10,0,0,611,612,7,11,0,0,612,613,7,12,0,0,613,615,7,13,0,0,
	614,608,1,0,0,0,614,609,1,0,0,0,615,30,1,0,0,0,616,617,5,42,0,0,617,32,
	1,0,0,0,618,619,5,47,0,0,619,34,1,0,0,0,620,621,5,37,0,0,621,36,1,0,0,0,
	622,623,5,61,0,0,623,624,5,61,0,0,624,38,1,0,0,0,625,626,5,61,0,0,626,40,
	1,0,0,0,627,628,5,33,0,0,628,632,5,61,0,0,629,630,5,60,0,0,630,632,5,62,
	0,0,631,627,1,0,0,0,631,629,1,0,0,0,632,42,1,0,0,0,633,634,5,60,0,0,634,
	44,1,0,0,0,635,636,5,60,0,0,636,637,5,61,0,0,637,46,1,0,0,0,638,639,5,62,
	0,0,639,48,1,0,0,0,640,641,5,62,0,0,641,642,5,61,0,0,642,50,1,0,0,0,643,
	644,5,124,0,0,644,645,5,124,0,0,645,52,1,0,0,0,646,647,5,40,0,0,647,54,
	1,0,0,0,648,649,5,41,0,0,649,56,1,0,0,0,650,651,5,123,0,0,651,58,1,0,0,
	0,652,653,5,125,0,0,653,60,1,0,0,0,654,655,5,44,0,0,655,62,1,0,0,0,656,
	657,5,58,0,0,657,64,1,0,0,0,658,659,5,91,0,0,659,66,1,0,0,0,660,661,5,93,
	0,0,661,68,1,0,0,0,662,663,5,93,0,0,663,664,5,105,0,0,664,70,1,0,0,0,665,
	666,5,59,0,0,666,72,1,0,0,0,667,668,5,33,0,0,668,74,1,0,0,0,669,670,7,14,
	0,0,670,671,7,5,0,0,671,672,7,15,0,0,672,673,7,16,0,0,673,674,7,12,0,0,
	674,675,7,17,0,0,675,676,7,18,0,0,676,76,1,0,0,0,677,678,7,16,0,0,678,679,
	7,14,0,0,679,680,7,19,0,0,680,681,7,10,0,0,681,682,7,13,0,0,682,683,7,5,
	0,0,683,78,1,0,0,0,684,685,7,16,0,0,685,686,7,17,0,0,686,687,7,17,0,0,687,
	80,1,0,0,0,688,689,7,16,0,0,689,690,7,17,0,0,690,691,7,18,0,0,691,692,7,
	5,0,0,692,693,7,20,0,0,693,82,1,0,0,0,694,695,7,16,0,0,695,696,7,11,0,0,
	696,697,7,16,0,0,697,698,7,17,0,0,698,699,7,21,0,0,699,700,7,22,0,0,700,
	701,7,5,0,0,701,84,1,0,0,0,702,703,7,16,0,0,703,704,7,11,0,0,704,705,7,
	14,0,0,705,86,1,0,0,0,706,707,7,16,0,0,707,708,7,11,0,0,708,709,7,21,0,
	0,709,88,1,0,0,0,710,711,7,16,0,0,711,712,7,20,0,0,712,713,7,20,0,0,713,
	714,7,16,0,0,714,715,7,21,0,0,715,90,1,0,0,0,716,717,7,16,0,0,717,718,7,
	13,0,0,718,92,1,0,0,0,719,720,7,16,0,0,720,721,7,13,0,0,721,722,7,23,0,
	0,722,94,1,0,0,0,723,724,7,16,0,0,724,725,7,18,0,0,725,96,1,0,0,0,726,727,
	7,24,0,0,727,728,7,5,0,0,728,729,7,25,0,0,729,730,7,10,0,0,730,731,7,11,
	0,0,731,98,1,0,0,0,732,733,7,24,0,0,733,734,7,5,0,0,734,735,7,18,0,0,735,
	736,7,26,0,0,736,737,7,5,0,0,737,738,7,5,0,0,738,739,7,11,0,0,739,100,1,
	0,0,0,740,741,7,24,0,0,741,742,7,10,0,0,742,743,7,11,0,0,743,744,7,16,0,
	0,744,745,7,20,0,0,745,746,7,21,0,0,746,102,1,0,0,0,747,748,7,24,0,0,748,
	749,7,27,0,0,749,750,7,27,0,0,750,751,7,17,0,0,751,752,7,5,0,0,752,753,
	7,16,0,0,753,754,7,11,0,0,754,104,1,0,0,0,755,756,7,24,0,0,756,757,7,20,
	0,0,757,758,7,5,0,0,758,759,7,16,0,0,759,760,7,28,0,0,760,106,1,0,0,0,761,
	762,7,24,0,0,762,763,7,12,0,0,763,764,7,23,0,0,764,765,7,28,0,0,765,766,
	7,5,0,0,766,767,7,18,0,0,767,108,1,0,0,0,768,769,7,24,0,0,769,770,7,12,
	0,0,770,771,7,10,0,0,771,772,7,17,0,0,772,773,7,14,0,0,773,110,1,0,0,0,
	774,775,7,24,0,0,775,776,7,21,0,0,776,112,1,0,0,0,777,778,7,23,0,0,778,
	779,7,16,0,0,779,780,7,17,0,0,780,781,7,17,0,0,781,114,1,0,0,0,782,783,
	7,23,0,0,783,784,7,16,0,0,784,785,7,13,0,0,785,786,7,5,0,0,786,116,1,0,
	0,0,787,788,7,23,0,0,788,789,7,16,0,0,789,790,7,13,0,0,790,791,7,18,0,0,
	791,118,1,0,0,0,792,793,7,23,0,0,793,794,7,17,0,0,794,795,7,12,0,0,795,
	796,7,13,0,0,796,797,7,18,0,0,797,798,7,5,0,0,798,799,7,20,0,0,799,120,
	1,0,0,0,800,801,7,23,0,0,801,802,7,27,0,0,802,803,7,17,0,0,803,804,7,17,
	0,0,804,805,7,16,0,0,805,806,7,18,0,0,806,807,7,5,0,0,807,122,1,0,0,0,808,
	809,7,23,0,0,809,810,7,27,0,0,810,811,7,17,0,0,811,812,7,17,0,0,812,813,
	7,5,0,0,813,814,7,23,0,0,814,815,7,18,0,0,815,816,7,10,0,0,816,817,7,27,
	0,0,817,818,7,11,0,0,818,124,1,0,0,0,819,820,7,23,0,0,820,821,7,27,0,0,
	821,822,7,9,0,0,822,823,7,9,0,0,823,824,7,10,0,0,824,825,7,18,0,0,825,126,
	1,0,0,0,826,827,7,23,0,0,827,828,7,27,0,0,828,829,7,9,0,0,829,830,7,9,0,
	0,830,831,7,10,0,0,831,832,7,18,0,0,832,833,7,18,0,0,833,834,7,5,0,0,834,
	835,7,14,0,0,835,128,1,0,0,0,836,837,7,23,0,0,837,838,7,27,0,0,838,839,
	7,11,0,0,839,840,7,11,0,0,840,841,7,5,0,0,841,842,7,23,0,0,842,843,7,18,
	0,0,843,130,1,0,0,0,844,845,7,23,0,0,845,846,7,27,0,0,846,847,7,11,0,0,
	847,848,7,18,0,0,848,849,7,10,0,0,849,850,7,11,0,0,850,851,7,12,0,0,851,
	852,7,5,0,0,852,132,1,0,0,0,853,854,7,23,0,0,854,855,7,27,0,0,855,856,7,
	20,0,0,856,857,7,20,0,0,857,858,7,5,0,0,858,859,7,17,0,0,859,860,7,16,0,
	0,860,861,7,18,0,0,861,862,7,5,0,0,862,863,7,14,0,0,863,134,1,0,0,0,864,
	865,7,23,0,0,865,866,7,27,0,0,866,867,7,19,0,0,867,868,7,5,0,0,868,869,
	7,20,0,0,869,136,1,0,0,0,870,871,7,23,0,0,871,872,7,20,0,0,872,873,7,5,
	0,0,873,874,7,16,0,0,874,875,7,18,0,0,875,876,7,5,0,0,876,138,1,0,0,0,877,
	878,7,23,0,0,878,879,7,12,0,0,879,880,7,20,0,0,880,881,7,20,0,0,881,882,
	7,5,0,0,882,883,7,11,0,0,883,884,7,18,0,0,884,140,1,0,0,0,885,886,7,14,
	0,0,886,887,7,16,0,0,887,888,7,18,0,0,888,889,7,16,0,0,889,890,7,24,0,0,
	890,891,7,16,0,0,891,892,7,13,0,0,892,893,7,5,0,0,893,142,1,0,0,0,894,895,
	7,14,0,0,895,896,7,16,0,0,896,897,7,18,0,0,897,898,7,16,0,0,898,899,7,13,
	0,0,899,900,7,5,0,0,900,901,7,18,0,0,901,144,1,0,0,0,902,903,7,14,0,0,903,
	904,7,16,0,0,904,905,7,18,0,0,905,906,7,16,0,0,906,907,7,13,0,0,907,908,
	7,18,0,0,908,909,7,27,0,0,909,910,7,20,0,0,910,911,7,5,0,0,911,146,1,0,
	0,0,912,913,7,14,0,0,913,914,7,5,0,0,914,915,7,23,0,0,915,916,7,17,0,0,
	916,917,7,16,0,0,917,918,7,20,0,0,918,919,7,5,0,0,919,148,1,0,0,0,920,921,
	7,14,0,0,921,922,7,5,0,0,922,923,7,23,0,0,923,924,7,20,0,0,924,925,7,5,
	0,0,925,926,7,9,0,0,926,927,7,5,0,0,927,928,7,11,0,0,928,929,7,18,0,0,929,
	150,1,0,0,0,930,931,7,14,0,0,931,932,7,5,0,0,932,933,7,17,0,0,933,934,7,
	5,0,0,934,935,7,18,0,0,935,936,7,5,0,0,936,152,1,0,0,0,937,938,7,14,0,0,
	938,939,7,5,0,0,939,940,7,20,0,0,940,941,7,10,0,0,941,942,7,19,0,0,942,
	943,7,5,0,0,943,944,7,14,0,0,944,154,1,0,0,0,945,946,7,14,0,0,946,947,7,
	5,0,0,947,948,7,13,0,0,948,949,7,23,0,0,949,156,1,0,0,0,950,951,7,14,0,
	0,951,952,7,5,0,0,952,953,7,13,0,0,953,954,7,23,0,0,954,955,7,20,0,0,955,
	956,7,10,0,0,956,957,7,24,0,0,957,958,7,5,0,0,958,158,1,0,0,0,959,960,7,
	14,0,0,960,961,7,10,0,0,961,962,7,13,0,0,962,963,7,18,0,0,963,964,7,10,
	0,0,964,965,7,11,0,0,965,966,7,23,0,0,966,967,7,18,0,0,967,160,1,0,0,0,
	968,969,7,14,0,0,969,970,7,27,0,0,970,162,1,0,0,0,971,972,7,14,0,0,972,
	973,7,20,0,0,973,974,7,27,0,0,974,975,7,29,0,0,975,164,1,0,0,0,976,977,
	7,5,0,0,977,978,7,16,0,0,978,979,7,23,0,0,979,980,7,30,0,0,980,166,1,0,
	0,0,981,982,7,5,0,0,982,983,7,17,0,0,983,984,7,5,0,0,984,985,7,9,0,0,985,
	986,7,5,0,0,986,987,7,11,0,0,987,988,7,18,0,0,988,168,1,0,0,0,989,990,7,
	5,0,0,990,991,7,17,0,0,991,992,7,13,0,0,992,993,7,5,0,0,993,170,1,0,0,0,
	994,995,7,5,0,0,995,996,7,11,0,0,996,997,7,14,0,0,997,172,1,0,0,0,998,999,
	7,5,0,0,999,1000,7,19,0,0,1000,1001,7,5,0,0,1001,1002,7,20,0,0,1002,1003,
	7,21,0,0,1003,174,1,0,0,0,1004,1005,7,5,0,0,1005,1006,7,31,0,0,1006,1007,
	7,23,0,0,1007,1008,7,5,0,0,1008,1009,7,29,0,0,1009,1010,7,18,0,0,1010,176,
	1,0,0,0,1011,1012,7,5,0,0,1012,1013,7,31,0,0,1013,1014,7,23,0,0,1014,1015,
	7,17,0,0,1015,1016,7,12,0,0,1016,1017,7,14,0,0,1017,1018,7,5,0,0,1018,178,
	1,0,0,0,1019,1020,7,5,0,0,1020,1021,7,31,0,0,1021,1022,7,5,0,0,1022,1023,
	7,23,0,0,1023,1024,7,12,0,0,1024,1025,7,18,0,0,1025,1026,7,5,0,0,1026,180,
	1,0,0,0,1027,1028,7,5,0,0,1028,1029,7,31,0,0,1029,1030,7,10,0,0,1030,1031,
	7,13,0,0,1031,1032,7,18,0,0,1032,1033,7,13,0,0,1033,182,1,0,0,0,1034,1035,
	7,5,0,0,1035,1036,7,31,0,0,1036,1037,7,29,0,0,1037,1038,7,17,0,0,1038,1039,
	7,16,0,0,1039,1040,7,10,0,0,1040,1041,7,11,0,0,1041,184,1,0,0,0,1042,1043,
	7,15,0,0,1043,1044,7,16,0,0,1044,1045,7,17,0,0,1045,1046,7,13,0,0,1046,
	1047,7,5,0,0,1047,186,1,0,0,0,1048,1049,7,15,0,0,1049,1050,7,5,0,0,1050,
	1051,7,18,0,0,1051,1052,7,23,0,0,1052,1053,7,30,0,0,1053,188,1,0,0,0,1054,
	1055,7,15,0,0,1055,1056,7,10,0,0,1056,1057,7,17,0,0,1057,1058,7,18,0,0,
	1058,1059,7,5,0,0,1059,1060,7,20,0,0,1060,190,1,0,0,0,1061,1062,7,15,0,
	0,1062,1063,7,10,0,0,1063,1064,7,20,0,0,1064,1065,7,13,0,0,1065,1066,7,
	18,0,0,1066,192,1,0,0,0,1067,1068,7,15,0,0,1068,1069,7,17,0,0,1069,1070,
	7,16,0,0,1070,1071,7,18,0,0,1071,1072,7,18,0,0,1072,1073,7,5,0,0,1073,1074,
	7,11,0,0,1074,194,1,0,0,0,1075,1076,7,15,0,0,1076,1077,7,17,0,0,1077,1078,
	7,12,0,0,1078,1079,7,13,0,0,1079,1080,7,30,0,0,1080,196,1,0,0,0,1081,1082,
	7,15,0,0,1082,1083,7,27,0,0,1083,1084,7,17,0,0,1084,1085,7,17,0,0,1085,
	1086,7,27,0,0,1086,1087,7,26,0,0,1087,1088,7,10,0,0,1088,1089,7,11,0,0,
	1089,1090,7,25,0,0,1090,198,1,0,0,0,1091,1092,7,15,0,0,1092,1093,7,27,0,
	0,1093,1094,7,20,0,0,1094,200,1,0,0,0,1095,1096,7,15,0,0,1096,1097,7,27,
	0,0,1097,1098,7,20,0,0,1098,1099,7,23,0,0,1099,1100,7,5,0,0,1100,202,1,
	0,0,0,1101,1102,7,15,0,0,1102,1103,7,20,0,0,1103,1104,7,27,0,0,1104,1105,
	7,9,0,0,1105,204,1,0,0,0,1106,1107,7,15,0,0,1107,1108,7,18,0,0,1108,1109,
	7,13,0,0,1109,206,1,0,0,0,1110,1111,7,15,0,0,1111,1112,7,12,0,0,1112,1113,
	7,11,0,0,1113,1114,7,23,0,0,1114,1115,7,18,0,0,1115,1116,7,10,0,0,1116,
	1117,7,27,0,0,1117,1118,7,11,0,0,1118,208,1,0,0,0,1119,1120,7,25,0,0,1120,
	1121,7,27,0,0,1121,1122,7,17,0,0,1122,1123,7,16,0,0,1123,1124,7,11,0,0,
	1124,1125,7,25,0,0,1125,210,1,0,0,0,1126,1127,7,25,0,0,1127,1128,7,20,0,
	0,1128,1129,7,16,0,0,1129,1130,7,11,0,0,1130,1131,7,18,0,0,1131,212,1,0,
	0,0,1132,1133,7,25,0,0,1133,1134,7,20,0,0,1134,1135,7,27,0,0,1135,1136,
	7,12,0,0,1136,1137,7,29,0,0,1137,214,1,0,0,0,1138,1139,7,25,0,0,1139,1140,
	7,20,0,0,1140,1141,7,27,0,0,1141,1142,7,12,0,0,1142,1143,7,29,0,0,1143,
	1144,7,13,0,0,1144,216,1,0,0,0,1145,1146,7,25,0,0,1146,1147,7,13,0,0,1147,
	1148,7,10,0,0,1148,218,1,0,0,0,1149,1150,7,30,0,0,1150,1151,7,16,0,0,1151,
	1152,7,13,0,0,1152,1153,7,30,0,0,1153,220,1,0,0,0,1154,1155,7,30,0,0,1155,
	1156,7,16,0,0,1156,1157,7,19,0,0,1157,1158,7,10,0,0,1158,1159,7,11,0,0,
	1159,1160,7,25,0,0,1160,222,1,0,0,0,1161,1162,7,10,0,0,1162,1163,7,15,0,
	0,1163,224,1,0,0,0,1164,1165,7,10,0,0,1165,1166,7,25,0,0,1166,1167,7,11,
	0,0,1167,1168,7,27,0,0,1168,1169,7,20,0,0,1169,1170,7,5,0,0,1170,226,1,
	0,0,0,1171,1172,7,10,0,0,1172,1173,7,17,0,0,1173,1174,7,10,0,0,1174,1175,
	7,28,0,0,1175,1176,7,5,0,0,1176,228,1,0,0,0,1177,1178,7,10,0,0,1178,1179,
	7,11,0,0,1179,230,1,0,0,0,1180,1181,7,10,0,0,1181,1182,7,11,0,0,1182,1183,
	7,23,0,0,1183,1184,7,17,0,0,1184,1185,7,12,0,0,1185,1186,7,14,0,0,1186,
	1187,7,5,0,0,1187,232,1,0,0,0,1188,1189,7,10,0,0,1189,1190,7,11,0,0,1190,
	1191,7,23,0,0,1191,1192,7,20,0,0,1192,1193,7,5,0,0,1193,1194,7,9,0,0,1194,
	1195,7,5,0,0,1195,1196,7,11,0,0,1196,1197,7,18,0,0,1197,234,1,0,0,0,1198,
	1199,7,10,0,0,1199,1200,7,11,0,0,1200,1201,7,14,0,0,1201,1202,7,5,0,0,1202,
	1203,7,31,0,0,1203,236,1,0,0,0,1204,1205,7,10,0,0,1205,1206,7,11,0,0,1206,
	1207,7,15,0,0,1207,1208,7,5,0,0,1208,1209,7,20,0,0,1209,238,1,0,0,0,1210,
	1211,7,10,0,0,1211,1212,7,11,0,0,1212,1213,7,17,0,0,1213,1214,7,10,0,0,
	1214,1215,7,11,0,0,1215,1216,7,5,0,0,1216,240,1,0,0,0,1217,1218,7,10,0,
	0,1218,1219,7,11,0,0,1219,1220,7,11,0,0,1220,1221,7,5,0,0,1221,1222,7,20,
	0,0,1222,242,1,0,0,0,1223,1224,7,10,0,0,1224,1225,7,11,0,0,1225,1226,7,
	13,0,0,1226,1227,7,5,0,0,1227,1228,7,20,0,0,1228,1229,7,18,0,0,1229,244,
	1,0,0,0,1230,1231,7,10,0,0,1231,1232,7,11,0,0,1232,1233,7,18,0,0,1233,1234,
	7,5,0,0,1234,1235,7,20,0,0,1235,1236,7,13,0,0,1236,1237,7,5,0,0,1237,1238,
	7,23,0,0,1238,1239,7,18,0,0,1239,246,1,0,0,0,1240,1241,7,10,0,0,1241,1242,
	7,11,0,0,1242,1243,7,18,0,0,1243,1244,7,27,0,0,1244,248,1,0,0,0,1245,1246,
	7,10,0,0,1246,1247,7,13,0,0,1247,250,1,0,0,0,1248,1249,7,10,0,0,1249,1250,
	7,13,0,0,1250,1251,7,27,0,0,1251,1252,7,17,0,0,1252,1253,7,16,0,0,1253,
	1254,7,18,0,0,1254,1255,7,10,0,0,1255,1256,7,27,0,0,1256,1257,7,11,0,0,
	1257,252,1,0,0,0,1258,1259,7,32,0,0,1259,1260,7,16,0,0,1260,1261,7,19,0,
	0,1261,1262,7,16,0,0,1262,1263,7,13,0,0,1263,1264,7,23,0,0,1264,1265,7,
	20,0,0,1265,1266,7,10,0,0,1266,1267,7,29,0,0,1267,1268,7,18,0,0,1268,254,
	1,0,0,0,1269,1270,7,32,0,0,1270,1271,7,27,0,0,1271,1272,7,10,0,0,1272,1273,
	7,11,0,0,1273,256,1,0,0,0,1274,1275,7,28,0,0,1275,1276,7,5,0,0,1276,1277,
	7,21,0,0,1277,258,1,0,0,0,1278,1279,7,28,0,0,1279,1280,7,5,0,0,1280,1281,
	7,21,0,0,1281,1282,7,13,0,0,1282,260,1,0,0,0,1283,1284,7,28,0,0,1284,1285,
	7,5,0,0,1285,1286,7,21,0,0,1286,1287,7,13,0,0,1287,1288,7,29,0,0,1288,1289,
	7,16,0,0,1289,1290,7,23,0,0,1290,1291,7,5,0,0,1291,262,1,0,0,0,1292,1293,
	7,28,0,0,1293,1294,7,11,0,0,1294,1295,7,27,0,0,1295,1296,7,26,0,0,1296,
	1297,7,11,0,0,1297,264,1,0,0,0,1298,1299,7,17,0,0,1299,1300,7,16,0,0,1300,
	1301,7,11,0,0,1301,1302,7,25,0,0,1302,1303,7,12,0,0,1303,1304,7,16,0,0,
	1304,1305,7,25,0,0,1305,1306,7,5,0,0,1306,266,1,0,0,0,1307,1308,7,17,0,
	0,1308,1309,7,16,0,0,1309,1310,7,13,0,0,1310,1311,7,18,0,0,1311,268,1,0,
	0,0,1312,1313,7,17,0,0,1313,1314,7,5,0,0,1314,1315,7,15,0,0,1315,1316,7,
	18,0,0,1316,270,1,0,0,0,1317,1318,7,17,0,0,1318,1319,7,5,0,0,1319,1320,
	7,18,0,0,1320,272,1,0,0,0,1321,1322,7,17,0,0,1322,1323,7,5,0,0,1323,1324,
	7,18,0,0,1324,1325,7,18,0,0,1325,1326,7,10,0,0,1326,1327,7,11,0,0,1327,
	1328,7,25,0,0,1328,274,1,0,0,0,1329,1330,7,17,0,0,1330,1331,7,5,0,0,1331,
	1332,7,19,0,0,1332,1333,7,5,0,0,1333,1334,7,17,0,0,1334,276,1,0,0,0,1335,
	1336,7,17,0,0,1336,1337,7,10,0,0,1337,1338,7,28,0,0,1338,1339,7,5,0,0,1339,
	278,1,0,0,0,1340,1341,7,17,0,0,1341,1342,7,10,0,0,1342,1343,7,9,0,0,1343,
	1344,7,10,0,0,1344,1345,7,18,0,0,1345,280,1,0,0,0,1346,1347,7,17,0,0,1347,
	1348,7,13,0,0,1348,1349,7,9,0,0,1349,282,1,0,0,0,1350,1351,7,9,0,0,1351,
	1352,7,16,0,0,1352,1353,7,29,0,0,1353,284,1,0,0,0,1354,1355,7,9,0,0,1355,
	1356,7,16,0,0,1356,1357,7,29,0,0,1357,1358,7,29,0,0,1358,1359,7,10,0,0,
	1359,1360,7,11,0,0,1360,1361,7,25,0,0,1361,286,1,0,0,0,1362,1363,7,9,0,
	0,1363,1364,7,16,0,0,1364,1365,7,18,0,0,1365,1366,7,23,0,0,1366,1367,7,
	30,0,0,1367,1368,7,5,0,0,1368,1369,7,14,0,0,1369,288,1,0,0,0,1370,1371,
	7,9,0,0,1371,1372,7,16,0,0,1372,1373,7,18,0,0,1373,1374,7,5,0,0,1374,1375,
	7,20,0,0,1375,1376,7,10,0,0,1376,1377,7,16,0,0,1377,1378,7,17,0,0,1378,
	1379,7,10,0,0,1379,1380,7,22,0,0,1380,1381,7,5,0,0,1381,1382,7,14,0,0,1382,
	290,1,0,0,0,1383,1384,7,9,0,0,1384,1385,7,5,0,0,1385,1386,7,20,0,0,1386,
	1387,7,25,0,0,1387,1388,7,5,0,0,1388,292,1,0,0,0,1389,1390,7,9,0,0,1390,
	1391,7,10,0,0,1391,1392,7,13,0,0,1392,1393,7,13,0,0,1393,1394,7,10,0,0,
	1394,1395,7,11,0,0,1395,1396,7,25,0,0,1396,294,1,0,0,0,1397,1398,7,11,0,
	0,1398,1399,7,16,0,0,1399,1400,7,9,0,0,1400,1401,7,5,0,0,1401,1402,7,13,
	0,0,1402,1403,7,29,0,0,1403,1404,7,16,0,0,1404,1405,7,23,0,0,1405,1406,
	7,5,0,0,1406,296,1,0,0,0,1407,1408,7,11,0,0,1408,1409,7,5,0,0,1409,1410,
	7,13,0,0,1410,1411,7,18,0,0,1411,298,1,0,0,0,1412,1413,7,11,0,0,1413,1414,
	7,17,0,0,1414,300,1,0,0,0,1415,1416,7,11,0,0,1416,1417,7,27,0,0,1417,302,
	1,0,0,0,1418,1419,7,11,0,0,1419,1420,7,27,0,0,1420,1421,7,18,0,0,1421,304,
	1,0,0,0,1422,1423,7,11,0,0,1423,1424,7,18,0,0,1424,1425,7,30,0,0,1425,1426,
	7,33,0,0,1426,1427,7,19,0,0,1427,1428,7,16,0,0,1428,1429,7,17,0,0,1429,
	1430,7,12,0,0,1430,1431,7,5,0,0,1431,306,1,0,0,0,1432,1433,7,11,0,0,1433,
	1434,7,12,0,0,1434,1435,7,17,0,0,1435,1436,7,17,0,0,1436,308,1,0,0,0,1437,
	1438,7,11,0,0,1438,1439,7,12,0,0,1439,1440,7,17,0,0,1440,1441,7,17,0,0,
	1441,1442,7,13,0,0,1442,310,1,0,0,0,1443,1444,7,11,0,0,1444,1445,7,34,0,
	0,1445,1446,7,9,0,0,1446,1447,7,24,0,0,1447,1448,7,5,0,0,1448,1449,7,20,
	0,0,1449,312,1,0,0,0,1450,1451,7,27,0,0,1451,1452,7,24,0,0,1452,1453,7,
	32,0,0,1453,1454,7,5,0,0,1454,1455,7,23,0,0,1455,1456,7,18,0,0,1456,314,
	1,0,0,0,1457,1458,7,27,0,0,1458,1459,7,15,0,0,1459,1460,7,15,0,0,1460,1461,
	7,13,0,0,1461,1462,7,5,0,0,1462,1463,7,18,0,0,1463,316,1,0,0,0,1464,1465,
	7,27,0,0,1465,1466,7,11,0,0,1466,318,1,0,0,0,1467,1468,7,27,0,0,1468,1469,
	7,29,0,0,1469,1470,7,18,0,0,1470,1471,7,10,0,0,1471,1472,7,27,0,0,1472,
	1473,7,11,0,0,1473,320,1,0,0,0,1474,1475,7,27,0,0,1475,1476,7,29,0,0,1476,
	1477,7,18,0,0,1477,1478,7,10,0,0,1478,1479,7,27,0,0,1479,1480,7,11,0,0,
	1480,1481,7,13,0,0,1481,322,1,0,0,0,1482,1483,7,27,0,0,1483,1484,7,20,0,
	0,1484,324,1,0,0,0,1485,1486,7,27,0,0,1486,1487,7,20,0,0,1487,1488,7,14,
	0,0,1488,1489,7,5,0,0,1489,1490,7,20,0,0,1490,326,1,0,0,0,1491,1492,7,27,
	0,0,1492,1493,7,18,0,0,1493,1494,7,30,0,0,1494,1495,7,5,0,0,1495,1496,7,
	20,0,0,1496,1497,7,13,0,0,1497,328,1,0,0,0,1498,1499,7,27,0,0,1499,1500,
	7,12,0,0,1500,1501,7,18,0,0,1501,1502,7,5,0,0,1502,1503,7,20,0,0,1503,330,
	1,0,0,0,1504,1505,7,27,0,0,1505,1506,7,19,0,0,1506,1507,7,5,0,0,1507,1508,
	7,20,0,0,1508,332,1,0,0,0,1509,1510,7,29,0,0,1510,1511,7,16,0,0,1511,1512,
	7,20,0,0,1512,1513,7,13,0,0,1513,1514,7,5,0,0,1514,334,1,0,0,0,1515,1516,
	7,29,0,0,1516,1517,7,16,0,0,1517,1518,7,20,0,0,1518,1519,7,18,0,0,1519,
	1520,7,10,0,0,1520,1521,7,18,0,0,1521,1522,7,10,0,0,1522,1523,7,27,0,0,
	1523,1524,7,11,0,0,1524,336,1,0,0,0,1525,1526,7,29,0,0,1526,1527,7,16,0,
	0,1527,1528,7,13,0,0,1528,1529,7,13,0,0,1529,1530,7,26,0,0,1530,1531,7,
	27,0,0,1531,1532,7,20,0,0,1532,1533,7,14,0,0,1533,338,1,0,0,0,1534,1535,
	7,29,0,0,1535,1536,7,16,0,0,1536,1537,7,18,0,0,1537,1538,7,30,0,0,1538,
	340,1,0,0,0,1539,1540,7,29,0,0,1540,1541,7,27,0,0,1541,1542,7,27,0,0,1542,
	1543,7,17,0,0,1543,342,1,0,0,0,1544,1545,7,29,0,0,1545,1546,7,20,0,0,1546,
	1547,7,5,0,0,1547,1548,7,23,0,0,1548,1549,7,5,0,0,1549,1550,7,14,0,0,1550,
	1551,7,10,0,0,1551,1552,7,11,0,0,1552,1553,7,25,0,0,1553,344,1,0,0,0,1554,
	1555,7,29,0,0,1555,1556,7,20,0,0,1556,1557,7,5,0,0,1557,1558,7,29,0,0,1558,
	1559,7,16,0,0,1559,1560,7,20,0,0,1560,1561,7,5,0,0,1561,346,1,0,0,0,1562,
	1563,7,29,0,0,1563,1564,7,20,0,0,1564,1565,7,10,0,0,1565,1566,7,9,0,0,1566,
	1567,7,16,0,0,1567,1568,7,20,0,0,1568,1569,7,21,0,0,1569,348,1,0,0,0,1570,
	1571,7,29,0,0,1571,1572,7,20,0,0,1572,1573,7,10,0,0,1573,1574,7,19,0,0,
	1574,1575,7,16,0,0,1575,1576,7,18,0,0,1576,1577,7,5,0,0,1577,350,1,0,0,
	0,1578,1579,7,29,0,0,1579,1580,7,20,0,0,1580,1581,7,10,0,0,1581,1582,7,
	19,0,0,1582,1583,7,10,0,0,1583,1584,7,17,0,0,1584,1585,7,5,0,0,1585,1586,
	7,25,0,0,1586,1587,7,5,0,0,1587,352,1,0,0,0,1588,1589,7,29,0,0,1589,1590,
	7,20,0,0,1590,1591,7,27,0,0,1591,1592,7,23,0,0,1592,1593,7,5,0,0,1593,1594,
	7,14,0,0,1594,1595,7,12,0,0,1595,1596,7,20,0,0,1596,1597,7,5,0,0,1597,354,
	1,0,0,0,1598,1599,7,29,0,0,1599,1600,7,20,0,0,1600,1601,7,27,0,0,1601,1602,
	7,24,0,0,1602,1603,7,5,0,0,1603,356,1,0,0,0,1604,1605,7,29,0,0,1605,1606,
	7,12,0,0,1606,1607,7,24,0,0,1607,1608,7,17,0,0,1608,1609,7,10,0,0,1609,
	1610,7,23,0,0,1610,358,1,0,0,0,1611,1612,7,20,0,0,1612,1613,7,16,0,0,1613,
	1614,7,11,0,0,1614,1615,7,25,0,0,1615,1616,7,5,0,0,1616,360,1,0,0,0,1617,
	1618,7,20,0,0,1618,1619,7,16,0,0,1619,1620,7,26,0,0,1620,362,1,0,0,0,1621,
	1622,7,20,0,0,1622,1623,7,5,0,0,1623,1624,7,16,0,0,1624,1625,7,14,0,0,1625,
	364,1,0,0,0,1626,1627,7,20,0,0,1627,1628,7,5,0,0,1628,1629,7,16,0,0,1629,
	1630,7,17,0,0,1630,1631,7,9,0,0,1631,366,1,0,0,0,1632,1633,7,20,0,0,1633,
	1634,7,5,0,0,1634,1635,7,14,0,0,1635,1636,7,12,0,0,1636,1637,7,23,0,0,1637,
	1638,7,5,0,0,1638,368,1,0,0,0,1639,1640,7,20,0,0,1640,1641,7,5,0,0,1641,
	1642,7,11,0,0,1642,1643,7,16,0,0,1643,1644,7,9,0,0,1644,1645,7,5,0,0,1645,
	370,1,0,0,0,1646,1647,7,20,0,0,1647,1648,7,5,0,0,1648,1649,7,29,0,0,1649,
	1650,7,17,0,0,1650,1651,7,16,0,0,1651,1652,7,23,0,0,1652,1653,7,5,0,0,1653,
	372,1,0,0,0,1654,1655,7,20,0,0,1655,1656,7,5,0,0,1656,1657,7,13,0,0,1657,
	1658,7,29,0,0,1658,1659,7,5,0,0,1659,1660,7,23,0,0,1660,1661,7,18,0,0,1661,
	374,1,0,0,0,1662,1663,7,20,0,0,1663,1664,7,5,0,0,1664,1665,7,18,0,0,1665,
	1666,7,12,0,0,1666,1667,7,20,0,0,1667,1668,7,11,0,0,1668,376,1,0,0,0,1669,
	1670,7,20,0,0,1670,1671,7,5,0,0,1671,1672,7,18,0,0,1672,1673,7,12,0,0,1673,
	1674,7,20,0,0,1674,1675,7,11,0,0,1675,1676,7,10,0,0,1676,1677,7,11,0,0,
	1677,1678,7,25,0,0,1678,378,1,0,0,0,1679,1680,7,20,0,0,1680,1681,7,5,0,
	0,1681,1682,7,19,0,0,1682,1683,7,27,0,0,1683,1684,7,28,0,0,1684,1685,7,
	5,0,0,1685,380,1,0,0,0,1686,1687,7,20,0,0,1687,1688,7,10,0,0,1688,1689,
	7,25,0,0,1689,1690,7,30,0,0,1690,1691,7,18,0,0,1691,382,1,0,0,0,1692,1693,
	7,20,0,0,1693,1694,7,27,0,0,1694,1695,7,17,0,0,1695,1696,7,5,0,0,1696,384,
	1,0,0,0,1697,1698,7,20,0,0,1698,1699,7,27,0,0,1699,1700,7,17,0,0,1700,1701,
	7,17,0,0,1701,1702,7,24,0,0,1702,1703,7,16,0,0,1703,1704,7,23,0,0,1704,
	1705,7,28,0,0,1705,386,1,0,0,0,1706,1707,7,20,0,0,1707,1708,7,27,0,0,1708,
	1709,7,26,0,0,1709,388,1,0,0,0,1710,1711,7,20,0,0,1711,1712,7,27,0,0,1712,
	1713,7,26,0,0,1713,1714,7,13,0,0,1714,390,1,0,0,0,1715,1716,7,13,0,0,1716,
	1717,7,16,0,0,1717,1718,7,18,0,0,1718,1719,7,10,0,0,1719,1720,7,13,0,0,
	1720,1721,7,15,0,0,1721,1722,7,10,0,0,1722,1723,7,5,0,0,1723,1724,7,13,
	0,0,1724,392,1,0,0,0,1725,1726,7,13,0,0,1726,1727,7,16,0,0,1727,1728,7,
	19,0,0,1728,1729,7,5,0,0,1729,1730,7,29,0,0,1730,1731,7,27,0,0,1731,1732,
	7,10,0,0,1732,1733,7,11,0,0,1733,1734,7,18,0,0,1734,394,1,0,0,0,1735,1736,
	7,13,0,0,1736,1737,7,23,0,0,1737,1738,7,30,0,0,1738,1739,7,5,0,0,1739,1740,
	7,9,0,0,1740,1741,7,16,0,0,1741,396,1,0,0,0,1742,1743,7,13,0,0,1743,1744,
	7,23,0,0,1744,1745,7,27,0,0,1745,1746,7,29,0,0,1746,1747,7,5,0,0,1747,398,
	1,0,0,0,1748,1749,7,13,0,0,1749,1750,7,5,0,0,1750,1751,7,17,0,0,1751,1752,
	7,5,0,0,1752,1753,7,23,0,0,1753,1754,7,18,0,0,1754,400,1,0,0,0,1755,1756,
	7,13,0,0,1756,1757,7,5,0,0,1757,1758,7,17,0,0,1758,1759,7,15,0,0,1759,402,
	1,0,0,0,1760,1761,7,13,0,0,1761,1762,7,5,0,0,1762,1763,7,18,0,0,1763,404,
	1,0,0,0,1764,1765,7,13,0,0,1765,1766,7,30,0,0,1766,1767,7,27,0,0,1767,1768,
	7,26,0,0,1768,406,1,0,0,0,1769,1770,7,13,0,0,1770,1771,7,27,0,0,1771,1772,
	7,9,0,0,1772,1773,7,5,0,0,1773,408,1,0,0,0,1774,1775,7,13,0,0,1775,1776,
	7,18,0,0,1776,1777,7,16,0,0,1777,1778,7,20,0,0,1778,1779,7,18,0,0,1779,
	410,1,0,0,0,1780,1781,7,13,0,0,1781,1782,7,18,0,0,1782,1783,7,16,0,0,1783,
	1784,7,18,0,0,1784,1785,7,10,0,0,1785,1786,7,13,0,0,1786,1787,7,18,0,0,
	1787,1788,7,10,0,0,1788,1789,7,23,0,0,1789,1790,7,13,0,0,1790,412,1,0,0,
	0,1791,1792,7,13,0,0,1792,1793,7,18,0,0,1793,1794,7,20,0,0,1794,1795,7,
	10,0,0,1795,1796,7,11,0,0,1796,1797,7,25,0,0,1797,414,1,0,0,0,1798,1799,
	7,13,0,0,1799,1800,7,21,0,0,1800,1801,7,13,0,0,1801,1802,7,18,0,0,1802,
	1803,7,5,0,0,1803,1804,7,9,0,0,1804,416,1,0,0,0,1805,1806,7,18,0,0,1806,
	1807,7,30,0,0,1807,1808,7,5,0,0,1808,1809,7,11,0,0,1809,418,1,0,0,0,1810,
	1811,7,18,0,0,1811,1812,7,10,0,0,1812,1813,7,5,0,0,1813,1814,7,13,0,0,1814,
	420,1,0,0,0,1815,1816,7,18,0,0,1816,1817,7,27,0,0,1817,422,1,0,0,0,1818,
	1819,7,18,0,0,1819,1820,7,20,0,0,1820,1821,7,16,0,0,1821,1822,7,11,0,0,
	1822,424,1,0,0,0,1823,1824,7,18,0,0,1824,1825,7,20,0,0,1825,1826,7,16,0,
	0,1826,1827,7,11,0,0,1827,1828,7,13,0,0,1828,1829,7,16,0,0,1829,1830,7,
	23,0,0,1830,1831,7,18,0,0,1831,1832,7,10,0,0,1832,1833,7,27,0,0,1833,1834,
	7,11,0,0,1834,426,1,0,0,0,1835,1836,7,18,0,0,1836,1837,7,20,0,0,1837,1838,
	7,10,0,0,1838,1839,7,25,0,0,1839,1840,7,25,0,0,1840,1841,7,5,0,0,1841,1842,
	7,20,0,0,1842,428,1,0,0,0,1843,1844,7,18,0,0,1844,1845,7,20,0,0,1845,1846,
	7,12,0,0,1846,1847,7,5,0,0,1847,430,1,0,0,0,1848,1849,7,18,0,0,1849,1850,
	7,20,0,0,1850,1851,7,12,0,0,1851,1852,7,11,0,0,1852,1853,7,23,0,0,1853,
	1854,7,16,0,0,1854,1855,7,18,0,0,1855,1856,7,5,0,0,1856,432,1,0,0,0,1857,
	1858,7,12,0,0,1858,1859,7,11,0,0,1859,1860,7,24,0,0,1860,1861,7,27,0,0,
	1861,1862,7,12,0,0,1862,1863,7,11,0,0,1863,1864,7,14,0,0,1864,1865,7,5,
	0,0,1865,1866,7,14,0,0,1866,434,1,0,0,0,1867,1868,7,12,0,0,1868,1869,7,
	11,0,0,1869,1870,7,14,0,0,1870,1871,7,5,0,0,1871,1872,7,20,0,0,1872,436,
	1,0,0,0,1873,1874,7,12,0,0,1874,1875,7,11,0,0,1875,1876,7,10,0,0,1876,1877,
	7,27,0,0,1877,1878,7,11,0,0,1878,438,1,0,0,0,1879,1880,7,12,0,0,1880,1881,
	7,11,0,0,1881,1882,7,10,0,0,1882,1883,7,35,0,0,1883,1884,7,12,0,0,1884,
	1885,7,5,0,0,1885,440,1,0,0,0,1886,1887,7,12,0,0,1887,1888,7,11,0,0,1888,
	1889,7,28,0,0,1889,1890,7,11,0,0,1890,1891,7,27,0,0,1891,1892,7,26,0,0,
	1892,1893,7,11,0,0,1893,442,1,0,0,0,1894,1895,7,12,0,0,1895,1896,7,11,0,
	0,1896,1897,7,11,0,0,1897,1898,7,5,0,0,1898,1899,7,13,0,0,1899,1900,7,18,
	0,0,1900,444,1,0,0,0,1901,1902,7,12,0,0,1902,1903,7,11,0,0,1903,1904,7,
	13,0,0,1904,1905,7,5,0,0,1905,1906,7,18,0,0,1906,446,1,0,0,0,1907,1908,
	7,12,0,0,1908,1909,7,29,0,0,1909,1910,7,14,0,0,1910,1911,7,16,0,0,1911,
	1912,7,18,0,0,1912,1913,7,5,0,0,1913,448,1,0,0,0,1914,1915,7,12,0,0,1915,
	1916,7,29,0,0,1916,1917,7,13,0,0,1917,1918,7,5,0,0,1918,1919,7,20,0,0,1919,
	1920,7,18,0,0,1920,450,1,0,0,0,1921,1922,7,12,0,0,1922,1923,7,13,0,0,1923,
	1924,7,5,0,0,1924,452,1,0,0,0,1925,1926,7,12,0,0,1926,1927,7,13,0,0,1927,
	1928,7,5,0,0,1928,1929,7,20,0,0,1929,454,1,0,0,0,1930,1931,7,12,0,0,1931,
	1932,7,13,0,0,1932,1933,7,10,0,0,1933,1934,7,11,0,0,1934,1935,7,25,0,0,
	1935,456,1,0,0,0,1936,1937,7,19,0,0,1937,1938,7,16,0,0,1938,1939,7,17,0,
	0,1939,1940,7,10,0,0,1940,1941,7,14,0,0,1941,1942,7,16,0,0,1942,1943,7,
	18,0,0,1943,1944,7,5,0,0,1944,458,1,0,0,0,1945,1946,7,19,0,0,1946,1947,
	7,16,0,0,1947,1948,7,17,0,0,1948,1949,7,12,0,0,1949,1950,7,5,0,0,1950,460,
	1,0,0,0,1951,1952,7,19,0,0,1952,1953,7,16,0,0,1953,1954,7,17,0,0,1954,1955,
	7,12,0,0,1955,1956,7,5,0,0,1956,1957,7,14,0,0,1957,462,1,0,0,0,1958,1959,
	7,19,0,0,1959,1960,7,16,0,0,1960,1961,7,17,0,0,1961,1962,7,12,0,0,1962,
	1963,7,5,0,0,1963,1964,7,13,0,0,1964,464,1,0,0,0,1965,1966,7,19,0,0,1966,
	1967,7,10,0,0,1967,1968,7,16,0,0,1968,466,1,0,0,0,1969,1970,7,19,0,0,1970,
	1971,7,10,0,0,1971,1972,7,5,0,0,1972,1973,7,26,0,0,1973,468,1,0,0,0,1974,
	1975,7,26,0,0,1975,1976,7,30,0,0,1976,1977,7,5,0,0,1977,1978,7,11,0,0,1978,
	470,1,0,0,0,1979,1980,7,26,0,0,1980,1981,7,30,0,0,1981,1982,7,5,0,0,1982,
	1983,7,20,0,0,1983,1984,7,5,0,0,1984,472,1,0,0,0,1985,1986,7,26,0,0,1986,
	1987,7,30,0,0,1987,1988,7,10,0,0,1988,1989,7,17,0,0,1989,1990,7,5,0,0,1990,
	474,1,0,0,0,1991,1992,7,26,0,0,1992,1993,7,10,0,0,1993,1994,7,11,0,0,1994,
	1995,7,14,0,0,1995,1996,7,27,0,0,1996,1997,7,26,0,0,1997,476,1,0,0,0,1998,
	1999,7,26,0,0,1999,2000,7,10,0,0,2000,2001,7,18,0,0,2001,2002,7,30,0,0,
	2002,478,1,0,0,0,2003,2004,7,26,0,0,2004,2005,7,10,0,0,2005,2006,7,18,0,
	0,2006,2007,7,30,0,0,2007,2008,7,10,0,0,2008,2009,7,11,0,0,2009,480,1,0,
	0,0,2010,2011,7,26,0,0,2011,2012,7,27,0,0,2012,2013,7,20,0,0,2013,2014,
	7,28,0,0,2014,482,1,0,0,0,2015,2016,7,31,0,0,2016,2017,7,27,0,0,2017,2018,
	7,20,0,0,2018,484,1,0,0,0,2019,2020,5,96,0,0,2020,2023,5,96,0,0,2021,2023,
	8,36,0,0,2022,2019,1,0,0,0,2022,2021,1,0,0,0,2023,486,1,0,0,0,2024,2025,
	7,37,0,0,2025,488,1,0,0,0,2026,2027,7,38,0,0,2027,490,1,0,0,0,2028,2030,
	5,96,0,0,2029,2031,3,485,242,0,2030,2029,1,0,0,0,2031,2032,1,0,0,0,2032,
	2030,1,0,0,0,2032,2033,1,0,0,0,2033,2034,1,0,0,0,2034,2035,5,96,0,0,2035,
	2036,5,105,0,0,2036,492,1,0,0,0,2037,2039,5,96,0,0,2038,2040,3,485,242,
	0,2039,2038,1,0,0,0,2040,2041,1,0,0,0,2041,2039,1,0,0,0,2041,2042,1,0,0,
	0,2042,2043,1,0,0,0,2043,2044,5,96,0,0,2044,2053,1,0,0,0,2045,2049,3,487,
	243,0,2046,2048,3,489,244,0,2047,2046,1,0,0,0,2048,2051,1,0,0,0,2049,2047,
	1,0,0,0,2049,2050,1,0,0,0,2050,2053,1,0,0,0,2051,2049,1,0,0,0,2052,2037,
	1,0,0,0,2052,2045,1,0,0,0,2053,494,1,0,0,0,2054,2055,5,36,0,0,2055,2059,
	3,487,243,0,2056,2058,3,489,244,0,2057,2056,1,0,0,0,2058,2061,1,0,0,0,2059,
	2057,1,0,0,0,2059,2060,1,0,0,0,2060,496,1,0,0,0,2061,2059,1,0,0,0,2062,
	2063,5,36,0,0,2063,2067,7,39,0,0,2064,2066,7,4,0,0,2065,2064,1,0,0,0,2066,
	2069,1,0,0,0,2067,2065,1,0,0,0,2067,2068,1,0,0,0,2068,498,1,0,0,0,2069,
	2067,1,0,0,0,2070,2071,5,63,0,0,2071,500,1,0,0,0,26,0,508,515,521,529,533,
	536,545,548,552,557,566,569,574,582,594,600,614,631,2022,2032,2041,2049,
	2052,2059,2067,1,6,0,0];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!n1qlLexer.__ATN) {
			n1qlLexer.__ATN = new ATNDeserializer().deserialize(n1qlLexer._serializedATN);
		}

		return n1qlLexer.__ATN;
	}


	static DecisionsToDFA = n1qlLexer._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );
}