// Generated from src/antlr/n1ql/n1ql.g4 by ANTLR 4.13.1

import {ParseTreeListener} from "antlr4";


import { InputContext } from "./n1qlParser";
import { Permitted_identifiersContext } from "./n1qlParser";
import { Opt_trailerContext } from "./n1qlParser";
import { Stmt_bodyContext } from "./n1qlParser";
import { StmtContext } from "./n1qlParser";
import { AdviseContext } from "./n1qlParser";
import { Opt_indexContext } from "./n1qlParser";
import { ExplainContext } from "./n1qlParser";
import { Explain_functionContext } from "./n1qlParser";
import { PrepareContext } from "./n1qlParser";
import { Opt_forceContext } from "./n1qlParser";
import { Opt_nameContext } from "./n1qlParser";
import { P__invalid_case_insensitive_identifierContext } from "./n1qlParser";
import { From_or_asContext } from "./n1qlParser";
import { ExecuteContext } from "./n1qlParser";
import { Opt_execute_usingContext } from "./n1qlParser";
import { InferContext } from "./n1qlParser";
import { Keyspace_collectionContext } from "./n1qlParser";
import { Opt_keyspace_collectionContext } from "./n1qlParser";
import { Opt_infer_usingContext } from "./n1qlParser";
import { Select_stmtContext } from "./n1qlParser";
import { Dml_stmtContext } from "./n1qlParser";
import { Ddl_stmtContext } from "./n1qlParser";
import { User_stmtContext } from "./n1qlParser";
import { Group_stmtContext } from "./n1qlParser";
import { Role_stmtContext } from "./n1qlParser";
import { Index_stmtContext } from "./n1qlParser";
import { Bucket_stmtContext } from "./n1qlParser";
import { Scope_stmtContext } from "./n1qlParser";
import { Collection_stmtContext } from "./n1qlParser";
import { Function_stmtContext } from "./n1qlParser";
import { Transaction_stmtContext } from "./n1qlParser";
import { FullselectContext } from "./n1qlParser";
import { Select_termsContext } from "./n1qlParser";
import { Select_termContext } from "./n1qlParser";
import { SubselectContext } from "./n1qlParser";
import { From_selectContext } from "./n1qlParser";
import { Select_fromContext } from "./n1qlParser";
import { SetopContext } from "./n1qlParser";
import { Opt_optim_hintsContext } from "./n1qlParser";
import { Hints_inputContext } from "./n1qlParser";
import { Optim_hintsContext } from "./n1qlParser";
import { Optim_hintContext } from "./n1qlParser";
import { Opt_hint_argsContext } from "./n1qlParser";
import { Hint_argsContext } from "./n1qlParser";
import { ProjectionContext } from "./n1qlParser";
import { Opt_quantifierContext } from "./n1qlParser";
import { Opt_excludeContext } from "./n1qlParser";
import { RawContext } from "./n1qlParser";
import { ProjectsContext } from "./n1qlParser";
import { ProjectContext } from "./n1qlParser";
import { Opt_as_aliasContext } from "./n1qlParser";
import { As_aliasContext } from "./n1qlParser";
import { AliasContext } from "./n1qlParser";
import { Opt_fromContext } from "./n1qlParser";
import { FromContext } from "./n1qlParser";
import { From_termsContext } from "./n1qlParser";
import { From_termContext } from "./n1qlParser";
import { Simple_from_termContext } from "./n1qlParser";
import { UnnestContext } from "./n1qlParser";
import { Keyspace_termContext } from "./n1qlParser";
import { Keyspace_pathContext } from "./n1qlParser";
import { Namespace_termContext } from "./n1qlParser";
import { Namespace_nameContext } from "./n1qlParser";
import { Path_partContext } from "./n1qlParser";
import { Keyspace_nameContext } from "./n1qlParser";
import { Opt_useContext } from "./n1qlParser";
import { Use_optionsContext } from "./n1qlParser";
import { Use_keysContext } from "./n1qlParser";
import { Use_indexContext } from "./n1qlParser";
import { Join_hintContext } from "./n1qlParser";
import { Opt_primaryContext } from "./n1qlParser";
import { Index_refsContext } from "./n1qlParser";
import { Index_refContext } from "./n1qlParser";
import { Use_hash_optionContext } from "./n1qlParser";
import { Opt_use_del_updContext } from "./n1qlParser";
import { Opt_join_typeContext } from "./n1qlParser";
import { Opt_outerContext } from "./n1qlParser";
import { On_keysContext } from "./n1qlParser";
import { On_keyContext } from "./n1qlParser";
import { Opt_letContext } from "./n1qlParser";
import { Let_Context } from "./n1qlParser";
import { BindingsContext } from "./n1qlParser";
import { BindingContext } from "./n1qlParser";
import { WithContext } from "./n1qlParser";
import { With_listContext } from "./n1qlParser";
import { With_termContext } from "./n1qlParser";
import { Opt_option_clauseContext } from "./n1qlParser";
import { Opt_cycle_clauseContext } from "./n1qlParser";
import { Opt_whereContext } from "./n1qlParser";
import { WhereContext } from "./n1qlParser";
import { Opt_groupContext } from "./n1qlParser";
import { GroupContext } from "./n1qlParser";
import { Group_termsContext } from "./n1qlParser";
import { Group_termContext } from "./n1qlParser";
import { Opt_lettingContext } from "./n1qlParser";
import { LettingContext } from "./n1qlParser";
import { Opt_havingContext } from "./n1qlParser";
import { HavingContext } from "./n1qlParser";
import { Opt_group_asContext } from "./n1qlParser";
import { Opt_order_byContext } from "./n1qlParser";
import { Order_byContext } from "./n1qlParser";
import { Sort_termsContext } from "./n1qlParser";
import { Sort_termContext } from "./n1qlParser";
import { Opt_dirContext } from "./n1qlParser";
import { DirContext } from "./n1qlParser";
import { Opt_order_nullsContext } from "./n1qlParser";
import { First_lastContext } from "./n1qlParser";
import { Opt_limitContext } from "./n1qlParser";
import { LimitContext } from "./n1qlParser";
import { Opt_offsetContext } from "./n1qlParser";
import { OffsetContext } from "./n1qlParser";
import { InsertContext } from "./n1qlParser";
import { Simple_keyspace_refContext } from "./n1qlParser";
import { Keyspace_refContext } from "./n1qlParser";
import { Opt_values_headerContext } from "./n1qlParser";
import { KeyContext } from "./n1qlParser";
import { Values_listContext } from "./n1qlParser";
import { ValuesContext } from "./n1qlParser";
import { Next_valuesContext } from "./n1qlParser";
import { Key_val_exprContext } from "./n1qlParser";
import { Key_val_options_exprContext } from "./n1qlParser";
import { Opt_returningContext } from "./n1qlParser";
import { ReturningContext } from "./n1qlParser";
import { Returns_Context } from "./n1qlParser";
import { Key_expr_headerContext } from "./n1qlParser";
import { Value_expr_headerContext } from "./n1qlParser";
import { Options_expr_headerContext } from "./n1qlParser";
import { Key_val_options_expr_headerContext } from "./n1qlParser";
import { UpsertContext } from "./n1qlParser";
import { Delete_Context } from "./n1qlParser";
import { UpdateContext } from "./n1qlParser";
import { SetContext } from "./n1qlParser";
import { Set_termsContext } from "./n1qlParser";
import { Set_termContext } from "./n1qlParser";
import { Function_meta_exprContext } from "./n1qlParser";
import { Opt_update_forContext } from "./n1qlParser";
import { Update_forContext } from "./n1qlParser";
import { Update_dimensionsContext } from "./n1qlParser";
import { Update_dimensionContext } from "./n1qlParser";
import { Update_bindingContext } from "./n1qlParser";
import { VariableContext } from "./n1qlParser";
import { Opt_whenContext } from "./n1qlParser";
import { UnsetContext } from "./n1qlParser";
import { Unset_termsContext } from "./n1qlParser";
import { Unset_termContext } from "./n1qlParser";
import { MergeContext } from "./n1qlParser";
import { Opt_use_mergeContext } from "./n1qlParser";
import { Opt_keyContext } from "./n1qlParser";
import { Opt_merge_actionsContext } from "./n1qlParser";
import { Opt_merge_delete_insertContext } from "./n1qlParser";
import { Opt_merge_insertContext } from "./n1qlParser";
import { Merge_updateContext } from "./n1qlParser";
import { Merge_deleteContext } from "./n1qlParser";
import { Merge_insertContext } from "./n1qlParser";
import { Create_userContext } from "./n1qlParser";
import { Alter_userContext } from "./n1qlParser";
import { Drop_userContext } from "./n1qlParser";
import { User_optsContext } from "./n1qlParser";
import { Param_or_strContext } from "./n1qlParser";
import { User_optContext } from "./n1qlParser";
import { GroupsContext } from "./n1qlParser";
import { Create_groupContext } from "./n1qlParser";
import { Alter_groupContext } from "./n1qlParser";
import { Drop_groupContext } from "./n1qlParser";
import { Group_nameContext } from "./n1qlParser";
import { Group_optsContext } from "./n1qlParser";
import { Group_optContext } from "./n1qlParser";
import { Group_role_listContext } from "./n1qlParser";
import { Group_role_list_itemContext } from "./n1qlParser";
import { Group_or_groupsContext } from "./n1qlParser";
import { User_usersContext } from "./n1qlParser";
import { Grant_roleContext } from "./n1qlParser";
import { Role_listContext } from "./n1qlParser";
import { Role_nameContext } from "./n1qlParser";
import { Keyspace_scope_listContext } from "./n1qlParser";
import { Keyspace_scopeContext } from "./n1qlParser";
import { User_listContext } from "./n1qlParser";
import { UserContext } from "./n1qlParser";
import { Revoke_roleContext } from "./n1qlParser";
import { Opt_def_with_clauseContext } from "./n1qlParser";
import { Create_bucketContext } from "./n1qlParser";
import { Alter_bucketContext } from "./n1qlParser";
import { Drop_bucketContext } from "./n1qlParser";
import { Create_scopeContext } from "./n1qlParser";
import { Drop_scopeContext } from "./n1qlParser";
import { Create_collectionContext } from "./n1qlParser";
import { Drop_collectionContext } from "./n1qlParser";
import { Flush_collectionContext } from "./n1qlParser";
import { Flush_or_truncateContext } from "./n1qlParser";
import { Create_indexContext } from "./n1qlParser";
import { Opt_vectorContext } from "./n1qlParser";
import { Index_nameContext } from "./n1qlParser";
import { Opt_index_nameContext } from "./n1qlParser";
import { Opt_if_not_existsContext } from "./n1qlParser";
import { Named_keyspace_refContext } from "./n1qlParser";
import { Simple_named_keyspace_refContext } from "./n1qlParser";
import { Named_scope_refContext } from "./n1qlParser";
import { Opt_index_partitionContext } from "./n1qlParser";
import { Opt_index_usingContext } from "./n1qlParser";
import { Index_usingContext } from "./n1qlParser";
import { Index_termsContext } from "./n1qlParser";
import { Index_termContext } from "./n1qlParser";
import { Index_term_exprContext } from "./n1qlParser";
import { All_exprContext } from "./n1qlParser";
import { AllContext } from "./n1qlParser";
import { Flatten_keys_exprContext } from "./n1qlParser";
import { Flatten_keys_exprsContext } from "./n1qlParser";
import { Opt_flatten_keys_exprsContext } from "./n1qlParser";
import { Opt_index_whereContext } from "./n1qlParser";
import { Opt_ikattrContext } from "./n1qlParser";
import { IkattrContext } from "./n1qlParser";
import { Drop_indexContext } from "./n1qlParser";
import { Opt_if_existsContext } from "./n1qlParser";
import { Alter_indexContext } from "./n1qlParser";
import { Build_indexContext } from "./n1qlParser";
import { Create_functionContext } from "./n1qlParser";
import { Opt_replaceContext } from "./n1qlParser";
import { Func_nameContext } from "./n1qlParser";
import { Short_func_nameContext } from "./n1qlParser";
import { Long_func_nameContext } from "./n1qlParser";
import { Opt_parm_listContext } from "./n1qlParser";
import { Parameter_termsContext } from "./n1qlParser";
import { Func_bodyContext } from "./n1qlParser";
import { Drop_functionContext } from "./n1qlParser";
import { Execute_functionContext } from "./n1qlParser";
import { Update_statisticsContext } from "./n1qlParser";
import { Opt_forContext } from "./n1qlParser";
import { Update_stat_termsContext } from "./n1qlParser";
import { Update_stat_termContext } from "./n1qlParser";
import { PathContext } from "./n1qlParser";
import { IdentContext } from "./n1qlParser";
import { Ident_icaseContext } from "./n1qlParser";
import { ExprContext } from "./n1qlParser";
import { ValuedContext } from "./n1qlParser";
import { C_exprContext } from "./n1qlParser";
import { B_exprContext } from "./n1qlParser";
import { LiteralContext } from "./n1qlParser";
import { Construction_exprContext } from "./n1qlParser";
import { ObjectContext } from "./n1qlParser";
import { Opt_membersContext } from "./n1qlParser";
import { MembersContext } from "./n1qlParser";
import { MemberContext } from "./n1qlParser";
import { ArrayContext } from "./n1qlParser";
import { Opt_exprsContext } from "./n1qlParser";
import { ExprsContext } from "./n1qlParser";
import { Param_exprContext } from "./n1qlParser";
import { Case_exprContext } from "./n1qlParser";
import { Simple_or_searched_caseContext } from "./n1qlParser";
import { Simple_caseContext } from "./n1qlParser";
import { When_thensContext } from "./n1qlParser";
import { Searched_caseContext } from "./n1qlParser";
import { Opt_elseContext } from "./n1qlParser";
import { Function_exprContext } from "./n1qlParser";
import { Function_nameContext } from "./n1qlParser";
import { Collection_exprContext } from "./n1qlParser";
import { Collection_condContext } from "./n1qlParser";
import { Coll_bindingsContext } from "./n1qlParser";
import { Coll_bindingContext } from "./n1qlParser";
import { SatisfiesContext } from "./n1qlParser";
import { Collection_xformContext } from "./n1qlParser";
import { Paren_exprContext } from "./n1qlParser";
import { Subquery_exprContext } from "./n1qlParser";
import { Expr_inputContext } from "./n1qlParser";
import { Opt_window_clauseContext } from "./n1qlParser";
import { Window_listContext } from "./n1qlParser";
import { Window_termContext } from "./n1qlParser";
import { Window_specificationContext } from "./n1qlParser";
import { Opt_window_nameContext } from "./n1qlParser";
import { Opt_window_partitionContext } from "./n1qlParser";
import { Opt_window_frameContext } from "./n1qlParser";
import { Window_frame_modifierContext } from "./n1qlParser";
import { Opt_window_frame_exclusionContext } from "./n1qlParser";
import { Window_frame_extentsContext } from "./n1qlParser";
import { Window_frame_extentContext } from "./n1qlParser";
import { Window_frame_valexpr_modifierContext } from "./n1qlParser";
import { Opt_nulls_treatmentContext } from "./n1qlParser";
import { Nulls_treatmentContext } from "./n1qlParser";
import { Opt_from_first_lastContext } from "./n1qlParser";
import { Agg_quantifierContext } from "./n1qlParser";
import { Opt_filterContext } from "./n1qlParser";
import { Opt_window_functionContext } from "./n1qlParser";
import { Window_function_detailsContext } from "./n1qlParser";
import { Start_transactionContext } from "./n1qlParser";
import { Commit_transactionContext } from "./n1qlParser";
import { Rollback_transactionContext } from "./n1qlParser";
import { Start_or_beginContext } from "./n1qlParser";
import { Opt_transactionContext } from "./n1qlParser";
import { TransactionContext } from "./n1qlParser";
import { Opt_savepointContext } from "./n1qlParser";
import { Savepoint_nameContext } from "./n1qlParser";
import { Opt_isolation_levelContext } from "./n1qlParser";
import { Isolation_levelContext } from "./n1qlParser";
import { Isolation_valContext } from "./n1qlParser";
import { Set_transaction_isolationContext } from "./n1qlParser";
import { SavepointContext } from "./n1qlParser";
import { Opt_with_clauseContext } from "./n1qlParser";
import { With_clauseContext } from "./n1qlParser";
import { Opt_namespace_nameContext } from "./n1qlParser";
import { Sequence_object_nameContext } from "./n1qlParser";
import { Sequence_full_nameContext } from "./n1qlParser";
import { Sequence_stmtContext } from "./n1qlParser";
import { Create_sequenceContext } from "./n1qlParser";
import { Sequence_name_optionsContext } from "./n1qlParser";
import { Sequence_name_optionContext } from "./n1qlParser";
import { Opt_seq_create_optionsContext } from "./n1qlParser";
import { Seq_create_optionContext } from "./n1qlParser";
import { Drop_sequenceContext } from "./n1qlParser";
import { Alter_sequenceContext } from "./n1qlParser";
import { Seq_alter_optionsContext } from "./n1qlParser";
import { Seq_alter_optionContext } from "./n1qlParser";
import { Sequence_withContext } from "./n1qlParser";
import { Start_withContext } from "./n1qlParser";
import { Restart_withContext } from "./n1qlParser";
import { Increment_byContext } from "./n1qlParser";
import { MaxvalueContext } from "./n1qlParser";
import { MinvalueContext } from "./n1qlParser";
import { CycleContext } from "./n1qlParser";
import { CacheContext } from "./n1qlParser";
import { Sequence_nextContext } from "./n1qlParser";
import { Sequence_prevContext } from "./n1qlParser";
import { Sequence_exprContext } from "./n1qlParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `n1qlParser`.
 */
export default class n1qlListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `n1qlParser.input`.
	 * @param ctx the parse tree
	 */
	enterInput?: (ctx: InputContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.input`.
	 * @param ctx the parse tree
	 */
	exitInput?: (ctx: InputContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.permitted_identifiers`.
	 * @param ctx the parse tree
	 */
	enterPermitted_identifiers?: (ctx: Permitted_identifiersContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.permitted_identifiers`.
	 * @param ctx the parse tree
	 */
	exitPermitted_identifiers?: (ctx: Permitted_identifiersContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_trailer`.
	 * @param ctx the parse tree
	 */
	enterOpt_trailer?: (ctx: Opt_trailerContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_trailer`.
	 * @param ctx the parse tree
	 */
	exitOpt_trailer?: (ctx: Opt_trailerContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.stmt_body`.
	 * @param ctx the parse tree
	 */
	enterStmt_body?: (ctx: Stmt_bodyContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.stmt_body`.
	 * @param ctx the parse tree
	 */
	exitStmt_body?: (ctx: Stmt_bodyContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.stmt`.
	 * @param ctx the parse tree
	 */
	enterStmt?: (ctx: StmtContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.stmt`.
	 * @param ctx the parse tree
	 */
	exitStmt?: (ctx: StmtContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.advise`.
	 * @param ctx the parse tree
	 */
	enterAdvise?: (ctx: AdviseContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.advise`.
	 * @param ctx the parse tree
	 */
	exitAdvise?: (ctx: AdviseContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_index`.
	 * @param ctx the parse tree
	 */
	enterOpt_index?: (ctx: Opt_indexContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_index`.
	 * @param ctx the parse tree
	 */
	exitOpt_index?: (ctx: Opt_indexContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.explain`.
	 * @param ctx the parse tree
	 */
	enterExplain?: (ctx: ExplainContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.explain`.
	 * @param ctx the parse tree
	 */
	exitExplain?: (ctx: ExplainContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.explain_function`.
	 * @param ctx the parse tree
	 */
	enterExplain_function?: (ctx: Explain_functionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.explain_function`.
	 * @param ctx the parse tree
	 */
	exitExplain_function?: (ctx: Explain_functionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.prepare`.
	 * @param ctx the parse tree
	 */
	enterPrepare?: (ctx: PrepareContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.prepare`.
	 * @param ctx the parse tree
	 */
	exitPrepare?: (ctx: PrepareContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_force`.
	 * @param ctx the parse tree
	 */
	enterOpt_force?: (ctx: Opt_forceContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_force`.
	 * @param ctx the parse tree
	 */
	exitOpt_force?: (ctx: Opt_forceContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_name`.
	 * @param ctx the parse tree
	 */
	enterOpt_name?: (ctx: Opt_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_name`.
	 * @param ctx the parse tree
	 */
	exitOpt_name?: (ctx: Opt_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.p__invalid_case_insensitive_identifier`.
	 * @param ctx the parse tree
	 */
	enterP__invalid_case_insensitive_identifier?: (ctx: P__invalid_case_insensitive_identifierContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.p__invalid_case_insensitive_identifier`.
	 * @param ctx the parse tree
	 */
	exitP__invalid_case_insensitive_identifier?: (ctx: P__invalid_case_insensitive_identifierContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.from_or_as`.
	 * @param ctx the parse tree
	 */
	enterFrom_or_as?: (ctx: From_or_asContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.from_or_as`.
	 * @param ctx the parse tree
	 */
	exitFrom_or_as?: (ctx: From_or_asContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.execute`.
	 * @param ctx the parse tree
	 */
	enterExecute?: (ctx: ExecuteContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.execute`.
	 * @param ctx the parse tree
	 */
	exitExecute?: (ctx: ExecuteContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_execute_using`.
	 * @param ctx the parse tree
	 */
	enterOpt_execute_using?: (ctx: Opt_execute_usingContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_execute_using`.
	 * @param ctx the parse tree
	 */
	exitOpt_execute_using?: (ctx: Opt_execute_usingContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.infer`.
	 * @param ctx the parse tree
	 */
	enterInfer?: (ctx: InferContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.infer`.
	 * @param ctx the parse tree
	 */
	exitInfer?: (ctx: InferContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.keyspace_collection`.
	 * @param ctx the parse tree
	 */
	enterKeyspace_collection?: (ctx: Keyspace_collectionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.keyspace_collection`.
	 * @param ctx the parse tree
	 */
	exitKeyspace_collection?: (ctx: Keyspace_collectionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_keyspace_collection`.
	 * @param ctx the parse tree
	 */
	enterOpt_keyspace_collection?: (ctx: Opt_keyspace_collectionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_keyspace_collection`.
	 * @param ctx the parse tree
	 */
	exitOpt_keyspace_collection?: (ctx: Opt_keyspace_collectionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_infer_using`.
	 * @param ctx the parse tree
	 */
	enterOpt_infer_using?: (ctx: Opt_infer_usingContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_infer_using`.
	 * @param ctx the parse tree
	 */
	exitOpt_infer_using?: (ctx: Opt_infer_usingContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.select_stmt`.
	 * @param ctx the parse tree
	 */
	enterSelect_stmt?: (ctx: Select_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.select_stmt`.
	 * @param ctx the parse tree
	 */
	exitSelect_stmt?: (ctx: Select_stmtContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.dml_stmt`.
	 * @param ctx the parse tree
	 */
	enterDml_stmt?: (ctx: Dml_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.dml_stmt`.
	 * @param ctx the parse tree
	 */
	exitDml_stmt?: (ctx: Dml_stmtContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.ddl_stmt`.
	 * @param ctx the parse tree
	 */
	enterDdl_stmt?: (ctx: Ddl_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.ddl_stmt`.
	 * @param ctx the parse tree
	 */
	exitDdl_stmt?: (ctx: Ddl_stmtContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.user_stmt`.
	 * @param ctx the parse tree
	 */
	enterUser_stmt?: (ctx: User_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.user_stmt`.
	 * @param ctx the parse tree
	 */
	exitUser_stmt?: (ctx: User_stmtContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.group_stmt`.
	 * @param ctx the parse tree
	 */
	enterGroup_stmt?: (ctx: Group_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.group_stmt`.
	 * @param ctx the parse tree
	 */
	exitGroup_stmt?: (ctx: Group_stmtContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.role_stmt`.
	 * @param ctx the parse tree
	 */
	enterRole_stmt?: (ctx: Role_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.role_stmt`.
	 * @param ctx the parse tree
	 */
	exitRole_stmt?: (ctx: Role_stmtContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.index_stmt`.
	 * @param ctx the parse tree
	 */
	enterIndex_stmt?: (ctx: Index_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.index_stmt`.
	 * @param ctx the parse tree
	 */
	exitIndex_stmt?: (ctx: Index_stmtContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.bucket_stmt`.
	 * @param ctx the parse tree
	 */
	enterBucket_stmt?: (ctx: Bucket_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.bucket_stmt`.
	 * @param ctx the parse tree
	 */
	exitBucket_stmt?: (ctx: Bucket_stmtContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.scope_stmt`.
	 * @param ctx the parse tree
	 */
	enterScope_stmt?: (ctx: Scope_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.scope_stmt`.
	 * @param ctx the parse tree
	 */
	exitScope_stmt?: (ctx: Scope_stmtContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.collection_stmt`.
	 * @param ctx the parse tree
	 */
	enterCollection_stmt?: (ctx: Collection_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.collection_stmt`.
	 * @param ctx the parse tree
	 */
	exitCollection_stmt?: (ctx: Collection_stmtContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.function_stmt`.
	 * @param ctx the parse tree
	 */
	enterFunction_stmt?: (ctx: Function_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.function_stmt`.
	 * @param ctx the parse tree
	 */
	exitFunction_stmt?: (ctx: Function_stmtContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.transaction_stmt`.
	 * @param ctx the parse tree
	 */
	enterTransaction_stmt?: (ctx: Transaction_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.transaction_stmt`.
	 * @param ctx the parse tree
	 */
	exitTransaction_stmt?: (ctx: Transaction_stmtContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.fullselect`.
	 * @param ctx the parse tree
	 */
	enterFullselect?: (ctx: FullselectContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.fullselect`.
	 * @param ctx the parse tree
	 */
	exitFullselect?: (ctx: FullselectContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.select_terms`.
	 * @param ctx the parse tree
	 */
	enterSelect_terms?: (ctx: Select_termsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.select_terms`.
	 * @param ctx the parse tree
	 */
	exitSelect_terms?: (ctx: Select_termsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.select_term`.
	 * @param ctx the parse tree
	 */
	enterSelect_term?: (ctx: Select_termContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.select_term`.
	 * @param ctx the parse tree
	 */
	exitSelect_term?: (ctx: Select_termContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.subselect`.
	 * @param ctx the parse tree
	 */
	enterSubselect?: (ctx: SubselectContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.subselect`.
	 * @param ctx the parse tree
	 */
	exitSubselect?: (ctx: SubselectContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.from_select`.
	 * @param ctx the parse tree
	 */
	enterFrom_select?: (ctx: From_selectContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.from_select`.
	 * @param ctx the parse tree
	 */
	exitFrom_select?: (ctx: From_selectContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.select_from`.
	 * @param ctx the parse tree
	 */
	enterSelect_from?: (ctx: Select_fromContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.select_from`.
	 * @param ctx the parse tree
	 */
	exitSelect_from?: (ctx: Select_fromContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.setop`.
	 * @param ctx the parse tree
	 */
	enterSetop?: (ctx: SetopContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.setop`.
	 * @param ctx the parse tree
	 */
	exitSetop?: (ctx: SetopContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_optim_hints`.
	 * @param ctx the parse tree
	 */
	enterOpt_optim_hints?: (ctx: Opt_optim_hintsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_optim_hints`.
	 * @param ctx the parse tree
	 */
	exitOpt_optim_hints?: (ctx: Opt_optim_hintsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.hints_input`.
	 * @param ctx the parse tree
	 */
	enterHints_input?: (ctx: Hints_inputContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.hints_input`.
	 * @param ctx the parse tree
	 */
	exitHints_input?: (ctx: Hints_inputContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.optim_hints`.
	 * @param ctx the parse tree
	 */
	enterOptim_hints?: (ctx: Optim_hintsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.optim_hints`.
	 * @param ctx the parse tree
	 */
	exitOptim_hints?: (ctx: Optim_hintsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.optim_hint`.
	 * @param ctx the parse tree
	 */
	enterOptim_hint?: (ctx: Optim_hintContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.optim_hint`.
	 * @param ctx the parse tree
	 */
	exitOptim_hint?: (ctx: Optim_hintContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_hint_args`.
	 * @param ctx the parse tree
	 */
	enterOpt_hint_args?: (ctx: Opt_hint_argsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_hint_args`.
	 * @param ctx the parse tree
	 */
	exitOpt_hint_args?: (ctx: Opt_hint_argsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.hint_args`.
	 * @param ctx the parse tree
	 */
	enterHint_args?: (ctx: Hint_argsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.hint_args`.
	 * @param ctx the parse tree
	 */
	exitHint_args?: (ctx: Hint_argsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.projection`.
	 * @param ctx the parse tree
	 */
	enterProjection?: (ctx: ProjectionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.projection`.
	 * @param ctx the parse tree
	 */
	exitProjection?: (ctx: ProjectionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_quantifier`.
	 * @param ctx the parse tree
	 */
	enterOpt_quantifier?: (ctx: Opt_quantifierContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_quantifier`.
	 * @param ctx the parse tree
	 */
	exitOpt_quantifier?: (ctx: Opt_quantifierContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_exclude`.
	 * @param ctx the parse tree
	 */
	enterOpt_exclude?: (ctx: Opt_excludeContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_exclude`.
	 * @param ctx the parse tree
	 */
	exitOpt_exclude?: (ctx: Opt_excludeContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.raw`.
	 * @param ctx the parse tree
	 */
	enterRaw?: (ctx: RawContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.raw`.
	 * @param ctx the parse tree
	 */
	exitRaw?: (ctx: RawContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.projects`.
	 * @param ctx the parse tree
	 */
	enterProjects?: (ctx: ProjectsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.projects`.
	 * @param ctx the parse tree
	 */
	exitProjects?: (ctx: ProjectsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.project`.
	 * @param ctx the parse tree
	 */
	enterProject?: (ctx: ProjectContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.project`.
	 * @param ctx the parse tree
	 */
	exitProject?: (ctx: ProjectContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_as_alias`.
	 * @param ctx the parse tree
	 */
	enterOpt_as_alias?: (ctx: Opt_as_aliasContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_as_alias`.
	 * @param ctx the parse tree
	 */
	exitOpt_as_alias?: (ctx: Opt_as_aliasContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.as_alias`.
	 * @param ctx the parse tree
	 */
	enterAs_alias?: (ctx: As_aliasContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.as_alias`.
	 * @param ctx the parse tree
	 */
	exitAs_alias?: (ctx: As_aliasContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.alias`.
	 * @param ctx the parse tree
	 */
	enterAlias?: (ctx: AliasContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.alias`.
	 * @param ctx the parse tree
	 */
	exitAlias?: (ctx: AliasContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_from`.
	 * @param ctx the parse tree
	 */
	enterOpt_from?: (ctx: Opt_fromContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_from`.
	 * @param ctx the parse tree
	 */
	exitOpt_from?: (ctx: Opt_fromContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.from`.
	 * @param ctx the parse tree
	 */
	enterFrom?: (ctx: FromContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.from`.
	 * @param ctx the parse tree
	 */
	exitFrom?: (ctx: FromContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.from_terms`.
	 * @param ctx the parse tree
	 */
	enterFrom_terms?: (ctx: From_termsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.from_terms`.
	 * @param ctx the parse tree
	 */
	exitFrom_terms?: (ctx: From_termsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.from_term`.
	 * @param ctx the parse tree
	 */
	enterFrom_term?: (ctx: From_termContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.from_term`.
	 * @param ctx the parse tree
	 */
	exitFrom_term?: (ctx: From_termContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.simple_from_term`.
	 * @param ctx the parse tree
	 */
	enterSimple_from_term?: (ctx: Simple_from_termContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.simple_from_term`.
	 * @param ctx the parse tree
	 */
	exitSimple_from_term?: (ctx: Simple_from_termContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.unnest`.
	 * @param ctx the parse tree
	 */
	enterUnnest?: (ctx: UnnestContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.unnest`.
	 * @param ctx the parse tree
	 */
	exitUnnest?: (ctx: UnnestContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.keyspace_term`.
	 * @param ctx the parse tree
	 */
	enterKeyspace_term?: (ctx: Keyspace_termContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.keyspace_term`.
	 * @param ctx the parse tree
	 */
	exitKeyspace_term?: (ctx: Keyspace_termContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.keyspace_path`.
	 * @param ctx the parse tree
	 */
	enterKeyspace_path?: (ctx: Keyspace_pathContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.keyspace_path`.
	 * @param ctx the parse tree
	 */
	exitKeyspace_path?: (ctx: Keyspace_pathContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.namespace_term`.
	 * @param ctx the parse tree
	 */
	enterNamespace_term?: (ctx: Namespace_termContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.namespace_term`.
	 * @param ctx the parse tree
	 */
	exitNamespace_term?: (ctx: Namespace_termContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.namespace_name`.
	 * @param ctx the parse tree
	 */
	enterNamespace_name?: (ctx: Namespace_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.namespace_name`.
	 * @param ctx the parse tree
	 */
	exitNamespace_name?: (ctx: Namespace_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.path_part`.
	 * @param ctx the parse tree
	 */
	enterPath_part?: (ctx: Path_partContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.path_part`.
	 * @param ctx the parse tree
	 */
	exitPath_part?: (ctx: Path_partContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.keyspace_name`.
	 * @param ctx the parse tree
	 */
	enterKeyspace_name?: (ctx: Keyspace_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.keyspace_name`.
	 * @param ctx the parse tree
	 */
	exitKeyspace_name?: (ctx: Keyspace_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_use`.
	 * @param ctx the parse tree
	 */
	enterOpt_use?: (ctx: Opt_useContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_use`.
	 * @param ctx the parse tree
	 */
	exitOpt_use?: (ctx: Opt_useContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.use_options`.
	 * @param ctx the parse tree
	 */
	enterUse_options?: (ctx: Use_optionsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.use_options`.
	 * @param ctx the parse tree
	 */
	exitUse_options?: (ctx: Use_optionsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.use_keys`.
	 * @param ctx the parse tree
	 */
	enterUse_keys?: (ctx: Use_keysContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.use_keys`.
	 * @param ctx the parse tree
	 */
	exitUse_keys?: (ctx: Use_keysContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.use_index`.
	 * @param ctx the parse tree
	 */
	enterUse_index?: (ctx: Use_indexContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.use_index`.
	 * @param ctx the parse tree
	 */
	exitUse_index?: (ctx: Use_indexContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.join_hint`.
	 * @param ctx the parse tree
	 */
	enterJoin_hint?: (ctx: Join_hintContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.join_hint`.
	 * @param ctx the parse tree
	 */
	exitJoin_hint?: (ctx: Join_hintContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_primary`.
	 * @param ctx the parse tree
	 */
	enterOpt_primary?: (ctx: Opt_primaryContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_primary`.
	 * @param ctx the parse tree
	 */
	exitOpt_primary?: (ctx: Opt_primaryContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.index_refs`.
	 * @param ctx the parse tree
	 */
	enterIndex_refs?: (ctx: Index_refsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.index_refs`.
	 * @param ctx the parse tree
	 */
	exitIndex_refs?: (ctx: Index_refsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.index_ref`.
	 * @param ctx the parse tree
	 */
	enterIndex_ref?: (ctx: Index_refContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.index_ref`.
	 * @param ctx the parse tree
	 */
	exitIndex_ref?: (ctx: Index_refContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.use_hash_option`.
	 * @param ctx the parse tree
	 */
	enterUse_hash_option?: (ctx: Use_hash_optionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.use_hash_option`.
	 * @param ctx the parse tree
	 */
	exitUse_hash_option?: (ctx: Use_hash_optionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_use_del_upd`.
	 * @param ctx the parse tree
	 */
	enterOpt_use_del_upd?: (ctx: Opt_use_del_updContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_use_del_upd`.
	 * @param ctx the parse tree
	 */
	exitOpt_use_del_upd?: (ctx: Opt_use_del_updContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_join_type`.
	 * @param ctx the parse tree
	 */
	enterOpt_join_type?: (ctx: Opt_join_typeContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_join_type`.
	 * @param ctx the parse tree
	 */
	exitOpt_join_type?: (ctx: Opt_join_typeContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_outer`.
	 * @param ctx the parse tree
	 */
	enterOpt_outer?: (ctx: Opt_outerContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_outer`.
	 * @param ctx the parse tree
	 */
	exitOpt_outer?: (ctx: Opt_outerContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.on_keys`.
	 * @param ctx the parse tree
	 */
	enterOn_keys?: (ctx: On_keysContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.on_keys`.
	 * @param ctx the parse tree
	 */
	exitOn_keys?: (ctx: On_keysContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.on_key`.
	 * @param ctx the parse tree
	 */
	enterOn_key?: (ctx: On_keyContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.on_key`.
	 * @param ctx the parse tree
	 */
	exitOn_key?: (ctx: On_keyContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_let`.
	 * @param ctx the parse tree
	 */
	enterOpt_let?: (ctx: Opt_letContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_let`.
	 * @param ctx the parse tree
	 */
	exitOpt_let?: (ctx: Opt_letContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.let_`.
	 * @param ctx the parse tree
	 */
	enterLet_?: (ctx: Let_Context) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.let_`.
	 * @param ctx the parse tree
	 */
	exitLet_?: (ctx: Let_Context) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.bindings`.
	 * @param ctx the parse tree
	 */
	enterBindings?: (ctx: BindingsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.bindings`.
	 * @param ctx the parse tree
	 */
	exitBindings?: (ctx: BindingsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.binding`.
	 * @param ctx the parse tree
	 */
	enterBinding?: (ctx: BindingContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.binding`.
	 * @param ctx the parse tree
	 */
	exitBinding?: (ctx: BindingContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.with`.
	 * @param ctx the parse tree
	 */
	enterWith?: (ctx: WithContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.with`.
	 * @param ctx the parse tree
	 */
	exitWith?: (ctx: WithContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.with_list`.
	 * @param ctx the parse tree
	 */
	enterWith_list?: (ctx: With_listContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.with_list`.
	 * @param ctx the parse tree
	 */
	exitWith_list?: (ctx: With_listContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.with_term`.
	 * @param ctx the parse tree
	 */
	enterWith_term?: (ctx: With_termContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.with_term`.
	 * @param ctx the parse tree
	 */
	exitWith_term?: (ctx: With_termContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_option_clause`.
	 * @param ctx the parse tree
	 */
	enterOpt_option_clause?: (ctx: Opt_option_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_option_clause`.
	 * @param ctx the parse tree
	 */
	exitOpt_option_clause?: (ctx: Opt_option_clauseContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_cycle_clause`.
	 * @param ctx the parse tree
	 */
	enterOpt_cycle_clause?: (ctx: Opt_cycle_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_cycle_clause`.
	 * @param ctx the parse tree
	 */
	exitOpt_cycle_clause?: (ctx: Opt_cycle_clauseContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_where`.
	 * @param ctx the parse tree
	 */
	enterOpt_where?: (ctx: Opt_whereContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_where`.
	 * @param ctx the parse tree
	 */
	exitOpt_where?: (ctx: Opt_whereContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.where`.
	 * @param ctx the parse tree
	 */
	enterWhere?: (ctx: WhereContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.where`.
	 * @param ctx the parse tree
	 */
	exitWhere?: (ctx: WhereContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_group`.
	 * @param ctx the parse tree
	 */
	enterOpt_group?: (ctx: Opt_groupContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_group`.
	 * @param ctx the parse tree
	 */
	exitOpt_group?: (ctx: Opt_groupContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.group`.
	 * @param ctx the parse tree
	 */
	enterGroup?: (ctx: GroupContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.group`.
	 * @param ctx the parse tree
	 */
	exitGroup?: (ctx: GroupContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.group_terms`.
	 * @param ctx the parse tree
	 */
	enterGroup_terms?: (ctx: Group_termsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.group_terms`.
	 * @param ctx the parse tree
	 */
	exitGroup_terms?: (ctx: Group_termsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.group_term`.
	 * @param ctx the parse tree
	 */
	enterGroup_term?: (ctx: Group_termContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.group_term`.
	 * @param ctx the parse tree
	 */
	exitGroup_term?: (ctx: Group_termContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_letting`.
	 * @param ctx the parse tree
	 */
	enterOpt_letting?: (ctx: Opt_lettingContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_letting`.
	 * @param ctx the parse tree
	 */
	exitOpt_letting?: (ctx: Opt_lettingContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.letting`.
	 * @param ctx the parse tree
	 */
	enterLetting?: (ctx: LettingContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.letting`.
	 * @param ctx the parse tree
	 */
	exitLetting?: (ctx: LettingContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_having`.
	 * @param ctx the parse tree
	 */
	enterOpt_having?: (ctx: Opt_havingContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_having`.
	 * @param ctx the parse tree
	 */
	exitOpt_having?: (ctx: Opt_havingContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.having`.
	 * @param ctx the parse tree
	 */
	enterHaving?: (ctx: HavingContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.having`.
	 * @param ctx the parse tree
	 */
	exitHaving?: (ctx: HavingContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_group_as`.
	 * @param ctx the parse tree
	 */
	enterOpt_group_as?: (ctx: Opt_group_asContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_group_as`.
	 * @param ctx the parse tree
	 */
	exitOpt_group_as?: (ctx: Opt_group_asContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_order_by`.
	 * @param ctx the parse tree
	 */
	enterOpt_order_by?: (ctx: Opt_order_byContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_order_by`.
	 * @param ctx the parse tree
	 */
	exitOpt_order_by?: (ctx: Opt_order_byContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.order_by`.
	 * @param ctx the parse tree
	 */
	enterOrder_by?: (ctx: Order_byContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.order_by`.
	 * @param ctx the parse tree
	 */
	exitOrder_by?: (ctx: Order_byContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.sort_terms`.
	 * @param ctx the parse tree
	 */
	enterSort_terms?: (ctx: Sort_termsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.sort_terms`.
	 * @param ctx the parse tree
	 */
	exitSort_terms?: (ctx: Sort_termsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.sort_term`.
	 * @param ctx the parse tree
	 */
	enterSort_term?: (ctx: Sort_termContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.sort_term`.
	 * @param ctx the parse tree
	 */
	exitSort_term?: (ctx: Sort_termContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_dir`.
	 * @param ctx the parse tree
	 */
	enterOpt_dir?: (ctx: Opt_dirContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_dir`.
	 * @param ctx the parse tree
	 */
	exitOpt_dir?: (ctx: Opt_dirContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.dir`.
	 * @param ctx the parse tree
	 */
	enterDir?: (ctx: DirContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.dir`.
	 * @param ctx the parse tree
	 */
	exitDir?: (ctx: DirContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_order_nulls`.
	 * @param ctx the parse tree
	 */
	enterOpt_order_nulls?: (ctx: Opt_order_nullsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_order_nulls`.
	 * @param ctx the parse tree
	 */
	exitOpt_order_nulls?: (ctx: Opt_order_nullsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.first_last`.
	 * @param ctx the parse tree
	 */
	enterFirst_last?: (ctx: First_lastContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.first_last`.
	 * @param ctx the parse tree
	 */
	exitFirst_last?: (ctx: First_lastContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_limit`.
	 * @param ctx the parse tree
	 */
	enterOpt_limit?: (ctx: Opt_limitContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_limit`.
	 * @param ctx the parse tree
	 */
	exitOpt_limit?: (ctx: Opt_limitContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.limit`.
	 * @param ctx the parse tree
	 */
	enterLimit?: (ctx: LimitContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.limit`.
	 * @param ctx the parse tree
	 */
	exitLimit?: (ctx: LimitContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_offset`.
	 * @param ctx the parse tree
	 */
	enterOpt_offset?: (ctx: Opt_offsetContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_offset`.
	 * @param ctx the parse tree
	 */
	exitOpt_offset?: (ctx: Opt_offsetContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.offset`.
	 * @param ctx the parse tree
	 */
	enterOffset?: (ctx: OffsetContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.offset`.
	 * @param ctx the parse tree
	 */
	exitOffset?: (ctx: OffsetContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.insert`.
	 * @param ctx the parse tree
	 */
	enterInsert?: (ctx: InsertContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.insert`.
	 * @param ctx the parse tree
	 */
	exitInsert?: (ctx: InsertContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.simple_keyspace_ref`.
	 * @param ctx the parse tree
	 */
	enterSimple_keyspace_ref?: (ctx: Simple_keyspace_refContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.simple_keyspace_ref`.
	 * @param ctx the parse tree
	 */
	exitSimple_keyspace_ref?: (ctx: Simple_keyspace_refContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.keyspace_ref`.
	 * @param ctx the parse tree
	 */
	enterKeyspace_ref?: (ctx: Keyspace_refContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.keyspace_ref`.
	 * @param ctx the parse tree
	 */
	exitKeyspace_ref?: (ctx: Keyspace_refContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_values_header`.
	 * @param ctx the parse tree
	 */
	enterOpt_values_header?: (ctx: Opt_values_headerContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_values_header`.
	 * @param ctx the parse tree
	 */
	exitOpt_values_header?: (ctx: Opt_values_headerContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.key`.
	 * @param ctx the parse tree
	 */
	enterKey?: (ctx: KeyContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.key`.
	 * @param ctx the parse tree
	 */
	exitKey?: (ctx: KeyContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.values_list`.
	 * @param ctx the parse tree
	 */
	enterValues_list?: (ctx: Values_listContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.values_list`.
	 * @param ctx the parse tree
	 */
	exitValues_list?: (ctx: Values_listContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.values`.
	 * @param ctx the parse tree
	 */
	enterValues?: (ctx: ValuesContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.values`.
	 * @param ctx the parse tree
	 */
	exitValues?: (ctx: ValuesContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.next_values`.
	 * @param ctx the parse tree
	 */
	enterNext_values?: (ctx: Next_valuesContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.next_values`.
	 * @param ctx the parse tree
	 */
	exitNext_values?: (ctx: Next_valuesContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.key_val_expr`.
	 * @param ctx the parse tree
	 */
	enterKey_val_expr?: (ctx: Key_val_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.key_val_expr`.
	 * @param ctx the parse tree
	 */
	exitKey_val_expr?: (ctx: Key_val_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.key_val_options_expr`.
	 * @param ctx the parse tree
	 */
	enterKey_val_options_expr?: (ctx: Key_val_options_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.key_val_options_expr`.
	 * @param ctx the parse tree
	 */
	exitKey_val_options_expr?: (ctx: Key_val_options_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_returning`.
	 * @param ctx the parse tree
	 */
	enterOpt_returning?: (ctx: Opt_returningContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_returning`.
	 * @param ctx the parse tree
	 */
	exitOpt_returning?: (ctx: Opt_returningContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.returning`.
	 * @param ctx the parse tree
	 */
	enterReturning?: (ctx: ReturningContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.returning`.
	 * @param ctx the parse tree
	 */
	exitReturning?: (ctx: ReturningContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.returns_`.
	 * @param ctx the parse tree
	 */
	enterReturns_?: (ctx: Returns_Context) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.returns_`.
	 * @param ctx the parse tree
	 */
	exitReturns_?: (ctx: Returns_Context) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.key_expr_header`.
	 * @param ctx the parse tree
	 */
	enterKey_expr_header?: (ctx: Key_expr_headerContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.key_expr_header`.
	 * @param ctx the parse tree
	 */
	exitKey_expr_header?: (ctx: Key_expr_headerContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.value_expr_header`.
	 * @param ctx the parse tree
	 */
	enterValue_expr_header?: (ctx: Value_expr_headerContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.value_expr_header`.
	 * @param ctx the parse tree
	 */
	exitValue_expr_header?: (ctx: Value_expr_headerContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.options_expr_header`.
	 * @param ctx the parse tree
	 */
	enterOptions_expr_header?: (ctx: Options_expr_headerContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.options_expr_header`.
	 * @param ctx the parse tree
	 */
	exitOptions_expr_header?: (ctx: Options_expr_headerContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.key_val_options_expr_header`.
	 * @param ctx the parse tree
	 */
	enterKey_val_options_expr_header?: (ctx: Key_val_options_expr_headerContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.key_val_options_expr_header`.
	 * @param ctx the parse tree
	 */
	exitKey_val_options_expr_header?: (ctx: Key_val_options_expr_headerContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.upsert`.
	 * @param ctx the parse tree
	 */
	enterUpsert?: (ctx: UpsertContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.upsert`.
	 * @param ctx the parse tree
	 */
	exitUpsert?: (ctx: UpsertContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.delete_`.
	 * @param ctx the parse tree
	 */
	enterDelete_?: (ctx: Delete_Context) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.delete_`.
	 * @param ctx the parse tree
	 */
	exitDelete_?: (ctx: Delete_Context) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.update`.
	 * @param ctx the parse tree
	 */
	enterUpdate?: (ctx: UpdateContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.update`.
	 * @param ctx the parse tree
	 */
	exitUpdate?: (ctx: UpdateContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.set`.
	 * @param ctx the parse tree
	 */
	enterSet?: (ctx: SetContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.set`.
	 * @param ctx the parse tree
	 */
	exitSet?: (ctx: SetContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.set_terms`.
	 * @param ctx the parse tree
	 */
	enterSet_terms?: (ctx: Set_termsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.set_terms`.
	 * @param ctx the parse tree
	 */
	exitSet_terms?: (ctx: Set_termsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.set_term`.
	 * @param ctx the parse tree
	 */
	enterSet_term?: (ctx: Set_termContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.set_term`.
	 * @param ctx the parse tree
	 */
	exitSet_term?: (ctx: Set_termContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.function_meta_expr`.
	 * @param ctx the parse tree
	 */
	enterFunction_meta_expr?: (ctx: Function_meta_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.function_meta_expr`.
	 * @param ctx the parse tree
	 */
	exitFunction_meta_expr?: (ctx: Function_meta_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_update_for`.
	 * @param ctx the parse tree
	 */
	enterOpt_update_for?: (ctx: Opt_update_forContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_update_for`.
	 * @param ctx the parse tree
	 */
	exitOpt_update_for?: (ctx: Opt_update_forContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.update_for`.
	 * @param ctx the parse tree
	 */
	enterUpdate_for?: (ctx: Update_forContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.update_for`.
	 * @param ctx the parse tree
	 */
	exitUpdate_for?: (ctx: Update_forContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.update_dimensions`.
	 * @param ctx the parse tree
	 */
	enterUpdate_dimensions?: (ctx: Update_dimensionsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.update_dimensions`.
	 * @param ctx the parse tree
	 */
	exitUpdate_dimensions?: (ctx: Update_dimensionsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.update_dimension`.
	 * @param ctx the parse tree
	 */
	enterUpdate_dimension?: (ctx: Update_dimensionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.update_dimension`.
	 * @param ctx the parse tree
	 */
	exitUpdate_dimension?: (ctx: Update_dimensionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.update_binding`.
	 * @param ctx the parse tree
	 */
	enterUpdate_binding?: (ctx: Update_bindingContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.update_binding`.
	 * @param ctx the parse tree
	 */
	exitUpdate_binding?: (ctx: Update_bindingContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.variable`.
	 * @param ctx the parse tree
	 */
	enterVariable?: (ctx: VariableContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.variable`.
	 * @param ctx the parse tree
	 */
	exitVariable?: (ctx: VariableContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_when`.
	 * @param ctx the parse tree
	 */
	enterOpt_when?: (ctx: Opt_whenContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_when`.
	 * @param ctx the parse tree
	 */
	exitOpt_when?: (ctx: Opt_whenContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.unset`.
	 * @param ctx the parse tree
	 */
	enterUnset?: (ctx: UnsetContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.unset`.
	 * @param ctx the parse tree
	 */
	exitUnset?: (ctx: UnsetContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.unset_terms`.
	 * @param ctx the parse tree
	 */
	enterUnset_terms?: (ctx: Unset_termsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.unset_terms`.
	 * @param ctx the parse tree
	 */
	exitUnset_terms?: (ctx: Unset_termsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.unset_term`.
	 * @param ctx the parse tree
	 */
	enterUnset_term?: (ctx: Unset_termContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.unset_term`.
	 * @param ctx the parse tree
	 */
	exitUnset_term?: (ctx: Unset_termContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.merge`.
	 * @param ctx the parse tree
	 */
	enterMerge?: (ctx: MergeContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.merge`.
	 * @param ctx the parse tree
	 */
	exitMerge?: (ctx: MergeContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_use_merge`.
	 * @param ctx the parse tree
	 */
	enterOpt_use_merge?: (ctx: Opt_use_mergeContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_use_merge`.
	 * @param ctx the parse tree
	 */
	exitOpt_use_merge?: (ctx: Opt_use_mergeContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_key`.
	 * @param ctx the parse tree
	 */
	enterOpt_key?: (ctx: Opt_keyContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_key`.
	 * @param ctx the parse tree
	 */
	exitOpt_key?: (ctx: Opt_keyContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_merge_actions`.
	 * @param ctx the parse tree
	 */
	enterOpt_merge_actions?: (ctx: Opt_merge_actionsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_merge_actions`.
	 * @param ctx the parse tree
	 */
	exitOpt_merge_actions?: (ctx: Opt_merge_actionsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_merge_delete_insert`.
	 * @param ctx the parse tree
	 */
	enterOpt_merge_delete_insert?: (ctx: Opt_merge_delete_insertContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_merge_delete_insert`.
	 * @param ctx the parse tree
	 */
	exitOpt_merge_delete_insert?: (ctx: Opt_merge_delete_insertContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_merge_insert`.
	 * @param ctx the parse tree
	 */
	enterOpt_merge_insert?: (ctx: Opt_merge_insertContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_merge_insert`.
	 * @param ctx the parse tree
	 */
	exitOpt_merge_insert?: (ctx: Opt_merge_insertContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.merge_update`.
	 * @param ctx the parse tree
	 */
	enterMerge_update?: (ctx: Merge_updateContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.merge_update`.
	 * @param ctx the parse tree
	 */
	exitMerge_update?: (ctx: Merge_updateContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.merge_delete`.
	 * @param ctx the parse tree
	 */
	enterMerge_delete?: (ctx: Merge_deleteContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.merge_delete`.
	 * @param ctx the parse tree
	 */
	exitMerge_delete?: (ctx: Merge_deleteContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.merge_insert`.
	 * @param ctx the parse tree
	 */
	enterMerge_insert?: (ctx: Merge_insertContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.merge_insert`.
	 * @param ctx the parse tree
	 */
	exitMerge_insert?: (ctx: Merge_insertContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.create_user`.
	 * @param ctx the parse tree
	 */
	enterCreate_user?: (ctx: Create_userContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.create_user`.
	 * @param ctx the parse tree
	 */
	exitCreate_user?: (ctx: Create_userContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.alter_user`.
	 * @param ctx the parse tree
	 */
	enterAlter_user?: (ctx: Alter_userContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.alter_user`.
	 * @param ctx the parse tree
	 */
	exitAlter_user?: (ctx: Alter_userContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.drop_user`.
	 * @param ctx the parse tree
	 */
	enterDrop_user?: (ctx: Drop_userContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.drop_user`.
	 * @param ctx the parse tree
	 */
	exitDrop_user?: (ctx: Drop_userContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.user_opts`.
	 * @param ctx the parse tree
	 */
	enterUser_opts?: (ctx: User_optsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.user_opts`.
	 * @param ctx the parse tree
	 */
	exitUser_opts?: (ctx: User_optsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.param_or_str`.
	 * @param ctx the parse tree
	 */
	enterParam_or_str?: (ctx: Param_or_strContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.param_or_str`.
	 * @param ctx the parse tree
	 */
	exitParam_or_str?: (ctx: Param_or_strContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.user_opt`.
	 * @param ctx the parse tree
	 */
	enterUser_opt?: (ctx: User_optContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.user_opt`.
	 * @param ctx the parse tree
	 */
	exitUser_opt?: (ctx: User_optContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.groups`.
	 * @param ctx the parse tree
	 */
	enterGroups?: (ctx: GroupsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.groups`.
	 * @param ctx the parse tree
	 */
	exitGroups?: (ctx: GroupsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.create_group`.
	 * @param ctx the parse tree
	 */
	enterCreate_group?: (ctx: Create_groupContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.create_group`.
	 * @param ctx the parse tree
	 */
	exitCreate_group?: (ctx: Create_groupContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.alter_group`.
	 * @param ctx the parse tree
	 */
	enterAlter_group?: (ctx: Alter_groupContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.alter_group`.
	 * @param ctx the parse tree
	 */
	exitAlter_group?: (ctx: Alter_groupContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.drop_group`.
	 * @param ctx the parse tree
	 */
	enterDrop_group?: (ctx: Drop_groupContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.drop_group`.
	 * @param ctx the parse tree
	 */
	exitDrop_group?: (ctx: Drop_groupContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.group_name`.
	 * @param ctx the parse tree
	 */
	enterGroup_name?: (ctx: Group_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.group_name`.
	 * @param ctx the parse tree
	 */
	exitGroup_name?: (ctx: Group_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.group_opts`.
	 * @param ctx the parse tree
	 */
	enterGroup_opts?: (ctx: Group_optsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.group_opts`.
	 * @param ctx the parse tree
	 */
	exitGroup_opts?: (ctx: Group_optsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.group_opt`.
	 * @param ctx the parse tree
	 */
	enterGroup_opt?: (ctx: Group_optContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.group_opt`.
	 * @param ctx the parse tree
	 */
	exitGroup_opt?: (ctx: Group_optContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.group_role_list`.
	 * @param ctx the parse tree
	 */
	enterGroup_role_list?: (ctx: Group_role_listContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.group_role_list`.
	 * @param ctx the parse tree
	 */
	exitGroup_role_list?: (ctx: Group_role_listContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.group_role_list_item`.
	 * @param ctx the parse tree
	 */
	enterGroup_role_list_item?: (ctx: Group_role_list_itemContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.group_role_list_item`.
	 * @param ctx the parse tree
	 */
	exitGroup_role_list_item?: (ctx: Group_role_list_itemContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.group_or_groups`.
	 * @param ctx the parse tree
	 */
	enterGroup_or_groups?: (ctx: Group_or_groupsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.group_or_groups`.
	 * @param ctx the parse tree
	 */
	exitGroup_or_groups?: (ctx: Group_or_groupsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.user_users`.
	 * @param ctx the parse tree
	 */
	enterUser_users?: (ctx: User_usersContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.user_users`.
	 * @param ctx the parse tree
	 */
	exitUser_users?: (ctx: User_usersContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.grant_role`.
	 * @param ctx the parse tree
	 */
	enterGrant_role?: (ctx: Grant_roleContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.grant_role`.
	 * @param ctx the parse tree
	 */
	exitGrant_role?: (ctx: Grant_roleContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.role_list`.
	 * @param ctx the parse tree
	 */
	enterRole_list?: (ctx: Role_listContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.role_list`.
	 * @param ctx the parse tree
	 */
	exitRole_list?: (ctx: Role_listContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.role_name`.
	 * @param ctx the parse tree
	 */
	enterRole_name?: (ctx: Role_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.role_name`.
	 * @param ctx the parse tree
	 */
	exitRole_name?: (ctx: Role_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.keyspace_scope_list`.
	 * @param ctx the parse tree
	 */
	enterKeyspace_scope_list?: (ctx: Keyspace_scope_listContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.keyspace_scope_list`.
	 * @param ctx the parse tree
	 */
	exitKeyspace_scope_list?: (ctx: Keyspace_scope_listContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.keyspace_scope`.
	 * @param ctx the parse tree
	 */
	enterKeyspace_scope?: (ctx: Keyspace_scopeContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.keyspace_scope`.
	 * @param ctx the parse tree
	 */
	exitKeyspace_scope?: (ctx: Keyspace_scopeContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.user_list`.
	 * @param ctx the parse tree
	 */
	enterUser_list?: (ctx: User_listContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.user_list`.
	 * @param ctx the parse tree
	 */
	exitUser_list?: (ctx: User_listContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.user`.
	 * @param ctx the parse tree
	 */
	enterUser?: (ctx: UserContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.user`.
	 * @param ctx the parse tree
	 */
	exitUser?: (ctx: UserContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.revoke_role`.
	 * @param ctx the parse tree
	 */
	enterRevoke_role?: (ctx: Revoke_roleContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.revoke_role`.
	 * @param ctx the parse tree
	 */
	exitRevoke_role?: (ctx: Revoke_roleContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_def_with_clause`.
	 * @param ctx the parse tree
	 */
	enterOpt_def_with_clause?: (ctx: Opt_def_with_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_def_with_clause`.
	 * @param ctx the parse tree
	 */
	exitOpt_def_with_clause?: (ctx: Opt_def_with_clauseContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.create_bucket`.
	 * @param ctx the parse tree
	 */
	enterCreate_bucket?: (ctx: Create_bucketContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.create_bucket`.
	 * @param ctx the parse tree
	 */
	exitCreate_bucket?: (ctx: Create_bucketContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.alter_bucket`.
	 * @param ctx the parse tree
	 */
	enterAlter_bucket?: (ctx: Alter_bucketContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.alter_bucket`.
	 * @param ctx the parse tree
	 */
	exitAlter_bucket?: (ctx: Alter_bucketContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.drop_bucket`.
	 * @param ctx the parse tree
	 */
	enterDrop_bucket?: (ctx: Drop_bucketContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.drop_bucket`.
	 * @param ctx the parse tree
	 */
	exitDrop_bucket?: (ctx: Drop_bucketContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.create_scope`.
	 * @param ctx the parse tree
	 */
	enterCreate_scope?: (ctx: Create_scopeContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.create_scope`.
	 * @param ctx the parse tree
	 */
	exitCreate_scope?: (ctx: Create_scopeContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.drop_scope`.
	 * @param ctx the parse tree
	 */
	enterDrop_scope?: (ctx: Drop_scopeContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.drop_scope`.
	 * @param ctx the parse tree
	 */
	exitDrop_scope?: (ctx: Drop_scopeContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.create_collection`.
	 * @param ctx the parse tree
	 */
	enterCreate_collection?: (ctx: Create_collectionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.create_collection`.
	 * @param ctx the parse tree
	 */
	exitCreate_collection?: (ctx: Create_collectionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.drop_collection`.
	 * @param ctx the parse tree
	 */
	enterDrop_collection?: (ctx: Drop_collectionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.drop_collection`.
	 * @param ctx the parse tree
	 */
	exitDrop_collection?: (ctx: Drop_collectionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.flush_collection`.
	 * @param ctx the parse tree
	 */
	enterFlush_collection?: (ctx: Flush_collectionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.flush_collection`.
	 * @param ctx the parse tree
	 */
	exitFlush_collection?: (ctx: Flush_collectionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.flush_or_truncate`.
	 * @param ctx the parse tree
	 */
	enterFlush_or_truncate?: (ctx: Flush_or_truncateContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.flush_or_truncate`.
	 * @param ctx the parse tree
	 */
	exitFlush_or_truncate?: (ctx: Flush_or_truncateContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.create_index`.
	 * @param ctx the parse tree
	 */
	enterCreate_index?: (ctx: Create_indexContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.create_index`.
	 * @param ctx the parse tree
	 */
	exitCreate_index?: (ctx: Create_indexContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_vector`.
	 * @param ctx the parse tree
	 */
	enterOpt_vector?: (ctx: Opt_vectorContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_vector`.
	 * @param ctx the parse tree
	 */
	exitOpt_vector?: (ctx: Opt_vectorContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.index_name`.
	 * @param ctx the parse tree
	 */
	enterIndex_name?: (ctx: Index_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.index_name`.
	 * @param ctx the parse tree
	 */
	exitIndex_name?: (ctx: Index_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_index_name`.
	 * @param ctx the parse tree
	 */
	enterOpt_index_name?: (ctx: Opt_index_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_index_name`.
	 * @param ctx the parse tree
	 */
	exitOpt_index_name?: (ctx: Opt_index_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_if_not_exists`.
	 * @param ctx the parse tree
	 */
	enterOpt_if_not_exists?: (ctx: Opt_if_not_existsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_if_not_exists`.
	 * @param ctx the parse tree
	 */
	exitOpt_if_not_exists?: (ctx: Opt_if_not_existsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.named_keyspace_ref`.
	 * @param ctx the parse tree
	 */
	enterNamed_keyspace_ref?: (ctx: Named_keyspace_refContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.named_keyspace_ref`.
	 * @param ctx the parse tree
	 */
	exitNamed_keyspace_ref?: (ctx: Named_keyspace_refContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.simple_named_keyspace_ref`.
	 * @param ctx the parse tree
	 */
	enterSimple_named_keyspace_ref?: (ctx: Simple_named_keyspace_refContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.simple_named_keyspace_ref`.
	 * @param ctx the parse tree
	 */
	exitSimple_named_keyspace_ref?: (ctx: Simple_named_keyspace_refContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.named_scope_ref`.
	 * @param ctx the parse tree
	 */
	enterNamed_scope_ref?: (ctx: Named_scope_refContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.named_scope_ref`.
	 * @param ctx the parse tree
	 */
	exitNamed_scope_ref?: (ctx: Named_scope_refContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_index_partition`.
	 * @param ctx the parse tree
	 */
	enterOpt_index_partition?: (ctx: Opt_index_partitionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_index_partition`.
	 * @param ctx the parse tree
	 */
	exitOpt_index_partition?: (ctx: Opt_index_partitionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_index_using`.
	 * @param ctx the parse tree
	 */
	enterOpt_index_using?: (ctx: Opt_index_usingContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_index_using`.
	 * @param ctx the parse tree
	 */
	exitOpt_index_using?: (ctx: Opt_index_usingContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.index_using`.
	 * @param ctx the parse tree
	 */
	enterIndex_using?: (ctx: Index_usingContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.index_using`.
	 * @param ctx the parse tree
	 */
	exitIndex_using?: (ctx: Index_usingContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.index_terms`.
	 * @param ctx the parse tree
	 */
	enterIndex_terms?: (ctx: Index_termsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.index_terms`.
	 * @param ctx the parse tree
	 */
	exitIndex_terms?: (ctx: Index_termsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.index_term`.
	 * @param ctx the parse tree
	 */
	enterIndex_term?: (ctx: Index_termContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.index_term`.
	 * @param ctx the parse tree
	 */
	exitIndex_term?: (ctx: Index_termContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.index_term_expr`.
	 * @param ctx the parse tree
	 */
	enterIndex_term_expr?: (ctx: Index_term_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.index_term_expr`.
	 * @param ctx the parse tree
	 */
	exitIndex_term_expr?: (ctx: Index_term_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.all_expr`.
	 * @param ctx the parse tree
	 */
	enterAll_expr?: (ctx: All_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.all_expr`.
	 * @param ctx the parse tree
	 */
	exitAll_expr?: (ctx: All_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.all`.
	 * @param ctx the parse tree
	 */
	enterAll?: (ctx: AllContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.all`.
	 * @param ctx the parse tree
	 */
	exitAll?: (ctx: AllContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.flatten_keys_expr`.
	 * @param ctx the parse tree
	 */
	enterFlatten_keys_expr?: (ctx: Flatten_keys_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.flatten_keys_expr`.
	 * @param ctx the parse tree
	 */
	exitFlatten_keys_expr?: (ctx: Flatten_keys_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.flatten_keys_exprs`.
	 * @param ctx the parse tree
	 */
	enterFlatten_keys_exprs?: (ctx: Flatten_keys_exprsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.flatten_keys_exprs`.
	 * @param ctx the parse tree
	 */
	exitFlatten_keys_exprs?: (ctx: Flatten_keys_exprsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_flatten_keys_exprs`.
	 * @param ctx the parse tree
	 */
	enterOpt_flatten_keys_exprs?: (ctx: Opt_flatten_keys_exprsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_flatten_keys_exprs`.
	 * @param ctx the parse tree
	 */
	exitOpt_flatten_keys_exprs?: (ctx: Opt_flatten_keys_exprsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_index_where`.
	 * @param ctx the parse tree
	 */
	enterOpt_index_where?: (ctx: Opt_index_whereContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_index_where`.
	 * @param ctx the parse tree
	 */
	exitOpt_index_where?: (ctx: Opt_index_whereContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_ikattr`.
	 * @param ctx the parse tree
	 */
	enterOpt_ikattr?: (ctx: Opt_ikattrContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_ikattr`.
	 * @param ctx the parse tree
	 */
	exitOpt_ikattr?: (ctx: Opt_ikattrContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.ikattr`.
	 * @param ctx the parse tree
	 */
	enterIkattr?: (ctx: IkattrContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.ikattr`.
	 * @param ctx the parse tree
	 */
	exitIkattr?: (ctx: IkattrContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.drop_index`.
	 * @param ctx the parse tree
	 */
	enterDrop_index?: (ctx: Drop_indexContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.drop_index`.
	 * @param ctx the parse tree
	 */
	exitDrop_index?: (ctx: Drop_indexContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_if_exists`.
	 * @param ctx the parse tree
	 */
	enterOpt_if_exists?: (ctx: Opt_if_existsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_if_exists`.
	 * @param ctx the parse tree
	 */
	exitOpt_if_exists?: (ctx: Opt_if_existsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.alter_index`.
	 * @param ctx the parse tree
	 */
	enterAlter_index?: (ctx: Alter_indexContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.alter_index`.
	 * @param ctx the parse tree
	 */
	exitAlter_index?: (ctx: Alter_indexContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.build_index`.
	 * @param ctx the parse tree
	 */
	enterBuild_index?: (ctx: Build_indexContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.build_index`.
	 * @param ctx the parse tree
	 */
	exitBuild_index?: (ctx: Build_indexContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.create_function`.
	 * @param ctx the parse tree
	 */
	enterCreate_function?: (ctx: Create_functionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.create_function`.
	 * @param ctx the parse tree
	 */
	exitCreate_function?: (ctx: Create_functionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_replace`.
	 * @param ctx the parse tree
	 */
	enterOpt_replace?: (ctx: Opt_replaceContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_replace`.
	 * @param ctx the parse tree
	 */
	exitOpt_replace?: (ctx: Opt_replaceContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.func_name`.
	 * @param ctx the parse tree
	 */
	enterFunc_name?: (ctx: Func_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.func_name`.
	 * @param ctx the parse tree
	 */
	exitFunc_name?: (ctx: Func_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.short_func_name`.
	 * @param ctx the parse tree
	 */
	enterShort_func_name?: (ctx: Short_func_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.short_func_name`.
	 * @param ctx the parse tree
	 */
	exitShort_func_name?: (ctx: Short_func_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.long_func_name`.
	 * @param ctx the parse tree
	 */
	enterLong_func_name?: (ctx: Long_func_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.long_func_name`.
	 * @param ctx the parse tree
	 */
	exitLong_func_name?: (ctx: Long_func_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_parm_list`.
	 * @param ctx the parse tree
	 */
	enterOpt_parm_list?: (ctx: Opt_parm_listContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_parm_list`.
	 * @param ctx the parse tree
	 */
	exitOpt_parm_list?: (ctx: Opt_parm_listContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.parameter_terms`.
	 * @param ctx the parse tree
	 */
	enterParameter_terms?: (ctx: Parameter_termsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.parameter_terms`.
	 * @param ctx the parse tree
	 */
	exitParameter_terms?: (ctx: Parameter_termsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.func_body`.
	 * @param ctx the parse tree
	 */
	enterFunc_body?: (ctx: Func_bodyContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.func_body`.
	 * @param ctx the parse tree
	 */
	exitFunc_body?: (ctx: Func_bodyContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.drop_function`.
	 * @param ctx the parse tree
	 */
	enterDrop_function?: (ctx: Drop_functionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.drop_function`.
	 * @param ctx the parse tree
	 */
	exitDrop_function?: (ctx: Drop_functionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.execute_function`.
	 * @param ctx the parse tree
	 */
	enterExecute_function?: (ctx: Execute_functionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.execute_function`.
	 * @param ctx the parse tree
	 */
	exitExecute_function?: (ctx: Execute_functionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.update_statistics`.
	 * @param ctx the parse tree
	 */
	enterUpdate_statistics?: (ctx: Update_statisticsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.update_statistics`.
	 * @param ctx the parse tree
	 */
	exitUpdate_statistics?: (ctx: Update_statisticsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_for`.
	 * @param ctx the parse tree
	 */
	enterOpt_for?: (ctx: Opt_forContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_for`.
	 * @param ctx the parse tree
	 */
	exitOpt_for?: (ctx: Opt_forContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.update_stat_terms`.
	 * @param ctx the parse tree
	 */
	enterUpdate_stat_terms?: (ctx: Update_stat_termsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.update_stat_terms`.
	 * @param ctx the parse tree
	 */
	exitUpdate_stat_terms?: (ctx: Update_stat_termsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.update_stat_term`.
	 * @param ctx the parse tree
	 */
	enterUpdate_stat_term?: (ctx: Update_stat_termContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.update_stat_term`.
	 * @param ctx the parse tree
	 */
	exitUpdate_stat_term?: (ctx: Update_stat_termContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.path`.
	 * @param ctx the parse tree
	 */
	enterPath?: (ctx: PathContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.path`.
	 * @param ctx the parse tree
	 */
	exitPath?: (ctx: PathContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.ident`.
	 * @param ctx the parse tree
	 */
	enterIdent?: (ctx: IdentContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.ident`.
	 * @param ctx the parse tree
	 */
	exitIdent?: (ctx: IdentContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.ident_icase`.
	 * @param ctx the parse tree
	 */
	enterIdent_icase?: (ctx: Ident_icaseContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.ident_icase`.
	 * @param ctx the parse tree
	 */
	exitIdent_icase?: (ctx: Ident_icaseContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.expr`.
	 * @param ctx the parse tree
	 */
	enterExpr?: (ctx: ExprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.expr`.
	 * @param ctx the parse tree
	 */
	exitExpr?: (ctx: ExprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.valued`.
	 * @param ctx the parse tree
	 */
	enterValued?: (ctx: ValuedContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.valued`.
	 * @param ctx the parse tree
	 */
	exitValued?: (ctx: ValuedContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.c_expr`.
	 * @param ctx the parse tree
	 */
	enterC_expr?: (ctx: C_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.c_expr`.
	 * @param ctx the parse tree
	 */
	exitC_expr?: (ctx: C_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.b_expr`.
	 * @param ctx the parse tree
	 */
	enterB_expr?: (ctx: B_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.b_expr`.
	 * @param ctx the parse tree
	 */
	exitB_expr?: (ctx: B_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.literal`.
	 * @param ctx the parse tree
	 */
	enterLiteral?: (ctx: LiteralContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.literal`.
	 * @param ctx the parse tree
	 */
	exitLiteral?: (ctx: LiteralContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.construction_expr`.
	 * @param ctx the parse tree
	 */
	enterConstruction_expr?: (ctx: Construction_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.construction_expr`.
	 * @param ctx the parse tree
	 */
	exitConstruction_expr?: (ctx: Construction_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.object`.
	 * @param ctx the parse tree
	 */
	enterObject?: (ctx: ObjectContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.object`.
	 * @param ctx the parse tree
	 */
	exitObject?: (ctx: ObjectContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_members`.
	 * @param ctx the parse tree
	 */
	enterOpt_members?: (ctx: Opt_membersContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_members`.
	 * @param ctx the parse tree
	 */
	exitOpt_members?: (ctx: Opt_membersContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.members`.
	 * @param ctx the parse tree
	 */
	enterMembers?: (ctx: MembersContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.members`.
	 * @param ctx the parse tree
	 */
	exitMembers?: (ctx: MembersContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.member`.
	 * @param ctx the parse tree
	 */
	enterMember?: (ctx: MemberContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.member`.
	 * @param ctx the parse tree
	 */
	exitMember?: (ctx: MemberContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.array`.
	 * @param ctx the parse tree
	 */
	enterArray?: (ctx: ArrayContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.array`.
	 * @param ctx the parse tree
	 */
	exitArray?: (ctx: ArrayContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_exprs`.
	 * @param ctx the parse tree
	 */
	enterOpt_exprs?: (ctx: Opt_exprsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_exprs`.
	 * @param ctx the parse tree
	 */
	exitOpt_exprs?: (ctx: Opt_exprsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.exprs`.
	 * @param ctx the parse tree
	 */
	enterExprs?: (ctx: ExprsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.exprs`.
	 * @param ctx the parse tree
	 */
	exitExprs?: (ctx: ExprsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.param_expr`.
	 * @param ctx the parse tree
	 */
	enterParam_expr?: (ctx: Param_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.param_expr`.
	 * @param ctx the parse tree
	 */
	exitParam_expr?: (ctx: Param_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.case_expr`.
	 * @param ctx the parse tree
	 */
	enterCase_expr?: (ctx: Case_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.case_expr`.
	 * @param ctx the parse tree
	 */
	exitCase_expr?: (ctx: Case_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.simple_or_searched_case`.
	 * @param ctx the parse tree
	 */
	enterSimple_or_searched_case?: (ctx: Simple_or_searched_caseContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.simple_or_searched_case`.
	 * @param ctx the parse tree
	 */
	exitSimple_or_searched_case?: (ctx: Simple_or_searched_caseContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.simple_case`.
	 * @param ctx the parse tree
	 */
	enterSimple_case?: (ctx: Simple_caseContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.simple_case`.
	 * @param ctx the parse tree
	 */
	exitSimple_case?: (ctx: Simple_caseContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.when_thens`.
	 * @param ctx the parse tree
	 */
	enterWhen_thens?: (ctx: When_thensContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.when_thens`.
	 * @param ctx the parse tree
	 */
	exitWhen_thens?: (ctx: When_thensContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.searched_case`.
	 * @param ctx the parse tree
	 */
	enterSearched_case?: (ctx: Searched_caseContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.searched_case`.
	 * @param ctx the parse tree
	 */
	exitSearched_case?: (ctx: Searched_caseContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_else`.
	 * @param ctx the parse tree
	 */
	enterOpt_else?: (ctx: Opt_elseContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_else`.
	 * @param ctx the parse tree
	 */
	exitOpt_else?: (ctx: Opt_elseContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.function_expr`.
	 * @param ctx the parse tree
	 */
	enterFunction_expr?: (ctx: Function_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.function_expr`.
	 * @param ctx the parse tree
	 */
	exitFunction_expr?: (ctx: Function_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.function_name`.
	 * @param ctx the parse tree
	 */
	enterFunction_name?: (ctx: Function_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.function_name`.
	 * @param ctx the parse tree
	 */
	exitFunction_name?: (ctx: Function_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.collection_expr`.
	 * @param ctx the parse tree
	 */
	enterCollection_expr?: (ctx: Collection_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.collection_expr`.
	 * @param ctx the parse tree
	 */
	exitCollection_expr?: (ctx: Collection_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.collection_cond`.
	 * @param ctx the parse tree
	 */
	enterCollection_cond?: (ctx: Collection_condContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.collection_cond`.
	 * @param ctx the parse tree
	 */
	exitCollection_cond?: (ctx: Collection_condContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.coll_bindings`.
	 * @param ctx the parse tree
	 */
	enterColl_bindings?: (ctx: Coll_bindingsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.coll_bindings`.
	 * @param ctx the parse tree
	 */
	exitColl_bindings?: (ctx: Coll_bindingsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.coll_binding`.
	 * @param ctx the parse tree
	 */
	enterColl_binding?: (ctx: Coll_bindingContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.coll_binding`.
	 * @param ctx the parse tree
	 */
	exitColl_binding?: (ctx: Coll_bindingContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.satisfies`.
	 * @param ctx the parse tree
	 */
	enterSatisfies?: (ctx: SatisfiesContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.satisfies`.
	 * @param ctx the parse tree
	 */
	exitSatisfies?: (ctx: SatisfiesContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.collection_xform`.
	 * @param ctx the parse tree
	 */
	enterCollection_xform?: (ctx: Collection_xformContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.collection_xform`.
	 * @param ctx the parse tree
	 */
	exitCollection_xform?: (ctx: Collection_xformContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.paren_expr`.
	 * @param ctx the parse tree
	 */
	enterParen_expr?: (ctx: Paren_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.paren_expr`.
	 * @param ctx the parse tree
	 */
	exitParen_expr?: (ctx: Paren_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.subquery_expr`.
	 * @param ctx the parse tree
	 */
	enterSubquery_expr?: (ctx: Subquery_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.subquery_expr`.
	 * @param ctx the parse tree
	 */
	exitSubquery_expr?: (ctx: Subquery_exprContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.expr_input`.
	 * @param ctx the parse tree
	 */
	enterExpr_input?: (ctx: Expr_inputContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.expr_input`.
	 * @param ctx the parse tree
	 */
	exitExpr_input?: (ctx: Expr_inputContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_window_clause`.
	 * @param ctx the parse tree
	 */
	enterOpt_window_clause?: (ctx: Opt_window_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_window_clause`.
	 * @param ctx the parse tree
	 */
	exitOpt_window_clause?: (ctx: Opt_window_clauseContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.window_list`.
	 * @param ctx the parse tree
	 */
	enterWindow_list?: (ctx: Window_listContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.window_list`.
	 * @param ctx the parse tree
	 */
	exitWindow_list?: (ctx: Window_listContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.window_term`.
	 * @param ctx the parse tree
	 */
	enterWindow_term?: (ctx: Window_termContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.window_term`.
	 * @param ctx the parse tree
	 */
	exitWindow_term?: (ctx: Window_termContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.window_specification`.
	 * @param ctx the parse tree
	 */
	enterWindow_specification?: (ctx: Window_specificationContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.window_specification`.
	 * @param ctx the parse tree
	 */
	exitWindow_specification?: (ctx: Window_specificationContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_window_name`.
	 * @param ctx the parse tree
	 */
	enterOpt_window_name?: (ctx: Opt_window_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_window_name`.
	 * @param ctx the parse tree
	 */
	exitOpt_window_name?: (ctx: Opt_window_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_window_partition`.
	 * @param ctx the parse tree
	 */
	enterOpt_window_partition?: (ctx: Opt_window_partitionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_window_partition`.
	 * @param ctx the parse tree
	 */
	exitOpt_window_partition?: (ctx: Opt_window_partitionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_window_frame`.
	 * @param ctx the parse tree
	 */
	enterOpt_window_frame?: (ctx: Opt_window_frameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_window_frame`.
	 * @param ctx the parse tree
	 */
	exitOpt_window_frame?: (ctx: Opt_window_frameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.window_frame_modifier`.
	 * @param ctx the parse tree
	 */
	enterWindow_frame_modifier?: (ctx: Window_frame_modifierContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.window_frame_modifier`.
	 * @param ctx the parse tree
	 */
	exitWindow_frame_modifier?: (ctx: Window_frame_modifierContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_window_frame_exclusion`.
	 * @param ctx the parse tree
	 */
	enterOpt_window_frame_exclusion?: (ctx: Opt_window_frame_exclusionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_window_frame_exclusion`.
	 * @param ctx the parse tree
	 */
	exitOpt_window_frame_exclusion?: (ctx: Opt_window_frame_exclusionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.window_frame_extents`.
	 * @param ctx the parse tree
	 */
	enterWindow_frame_extents?: (ctx: Window_frame_extentsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.window_frame_extents`.
	 * @param ctx the parse tree
	 */
	exitWindow_frame_extents?: (ctx: Window_frame_extentsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.window_frame_extent`.
	 * @param ctx the parse tree
	 */
	enterWindow_frame_extent?: (ctx: Window_frame_extentContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.window_frame_extent`.
	 * @param ctx the parse tree
	 */
	exitWindow_frame_extent?: (ctx: Window_frame_extentContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.window_frame_valexpr_modifier`.
	 * @param ctx the parse tree
	 */
	enterWindow_frame_valexpr_modifier?: (ctx: Window_frame_valexpr_modifierContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.window_frame_valexpr_modifier`.
	 * @param ctx the parse tree
	 */
	exitWindow_frame_valexpr_modifier?: (ctx: Window_frame_valexpr_modifierContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_nulls_treatment`.
	 * @param ctx the parse tree
	 */
	enterOpt_nulls_treatment?: (ctx: Opt_nulls_treatmentContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_nulls_treatment`.
	 * @param ctx the parse tree
	 */
	exitOpt_nulls_treatment?: (ctx: Opt_nulls_treatmentContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.nulls_treatment`.
	 * @param ctx the parse tree
	 */
	enterNulls_treatment?: (ctx: Nulls_treatmentContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.nulls_treatment`.
	 * @param ctx the parse tree
	 */
	exitNulls_treatment?: (ctx: Nulls_treatmentContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_from_first_last`.
	 * @param ctx the parse tree
	 */
	enterOpt_from_first_last?: (ctx: Opt_from_first_lastContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_from_first_last`.
	 * @param ctx the parse tree
	 */
	exitOpt_from_first_last?: (ctx: Opt_from_first_lastContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.agg_quantifier`.
	 * @param ctx the parse tree
	 */
	enterAgg_quantifier?: (ctx: Agg_quantifierContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.agg_quantifier`.
	 * @param ctx the parse tree
	 */
	exitAgg_quantifier?: (ctx: Agg_quantifierContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_filter`.
	 * @param ctx the parse tree
	 */
	enterOpt_filter?: (ctx: Opt_filterContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_filter`.
	 * @param ctx the parse tree
	 */
	exitOpt_filter?: (ctx: Opt_filterContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_window_function`.
	 * @param ctx the parse tree
	 */
	enterOpt_window_function?: (ctx: Opt_window_functionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_window_function`.
	 * @param ctx the parse tree
	 */
	exitOpt_window_function?: (ctx: Opt_window_functionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.window_function_details`.
	 * @param ctx the parse tree
	 */
	enterWindow_function_details?: (ctx: Window_function_detailsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.window_function_details`.
	 * @param ctx the parse tree
	 */
	exitWindow_function_details?: (ctx: Window_function_detailsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.start_transaction`.
	 * @param ctx the parse tree
	 */
	enterStart_transaction?: (ctx: Start_transactionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.start_transaction`.
	 * @param ctx the parse tree
	 */
	exitStart_transaction?: (ctx: Start_transactionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.commit_transaction`.
	 * @param ctx the parse tree
	 */
	enterCommit_transaction?: (ctx: Commit_transactionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.commit_transaction`.
	 * @param ctx the parse tree
	 */
	exitCommit_transaction?: (ctx: Commit_transactionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.rollback_transaction`.
	 * @param ctx the parse tree
	 */
	enterRollback_transaction?: (ctx: Rollback_transactionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.rollback_transaction`.
	 * @param ctx the parse tree
	 */
	exitRollback_transaction?: (ctx: Rollback_transactionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.start_or_begin`.
	 * @param ctx the parse tree
	 */
	enterStart_or_begin?: (ctx: Start_or_beginContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.start_or_begin`.
	 * @param ctx the parse tree
	 */
	exitStart_or_begin?: (ctx: Start_or_beginContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_transaction`.
	 * @param ctx the parse tree
	 */
	enterOpt_transaction?: (ctx: Opt_transactionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_transaction`.
	 * @param ctx the parse tree
	 */
	exitOpt_transaction?: (ctx: Opt_transactionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.transaction`.
	 * @param ctx the parse tree
	 */
	enterTransaction?: (ctx: TransactionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.transaction`.
	 * @param ctx the parse tree
	 */
	exitTransaction?: (ctx: TransactionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_savepoint`.
	 * @param ctx the parse tree
	 */
	enterOpt_savepoint?: (ctx: Opt_savepointContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_savepoint`.
	 * @param ctx the parse tree
	 */
	exitOpt_savepoint?: (ctx: Opt_savepointContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.savepoint_name`.
	 * @param ctx the parse tree
	 */
	enterSavepoint_name?: (ctx: Savepoint_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.savepoint_name`.
	 * @param ctx the parse tree
	 */
	exitSavepoint_name?: (ctx: Savepoint_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_isolation_level`.
	 * @param ctx the parse tree
	 */
	enterOpt_isolation_level?: (ctx: Opt_isolation_levelContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_isolation_level`.
	 * @param ctx the parse tree
	 */
	exitOpt_isolation_level?: (ctx: Opt_isolation_levelContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.isolation_level`.
	 * @param ctx the parse tree
	 */
	enterIsolation_level?: (ctx: Isolation_levelContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.isolation_level`.
	 * @param ctx the parse tree
	 */
	exitIsolation_level?: (ctx: Isolation_levelContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.isolation_val`.
	 * @param ctx the parse tree
	 */
	enterIsolation_val?: (ctx: Isolation_valContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.isolation_val`.
	 * @param ctx the parse tree
	 */
	exitIsolation_val?: (ctx: Isolation_valContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.set_transaction_isolation`.
	 * @param ctx the parse tree
	 */
	enterSet_transaction_isolation?: (ctx: Set_transaction_isolationContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.set_transaction_isolation`.
	 * @param ctx the parse tree
	 */
	exitSet_transaction_isolation?: (ctx: Set_transaction_isolationContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.savepoint`.
	 * @param ctx the parse tree
	 */
	enterSavepoint?: (ctx: SavepointContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.savepoint`.
	 * @param ctx the parse tree
	 */
	exitSavepoint?: (ctx: SavepointContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_with_clause`.
	 * @param ctx the parse tree
	 */
	enterOpt_with_clause?: (ctx: Opt_with_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_with_clause`.
	 * @param ctx the parse tree
	 */
	exitOpt_with_clause?: (ctx: Opt_with_clauseContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.with_clause`.
	 * @param ctx the parse tree
	 */
	enterWith_clause?: (ctx: With_clauseContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.with_clause`.
	 * @param ctx the parse tree
	 */
	exitWith_clause?: (ctx: With_clauseContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_namespace_name`.
	 * @param ctx the parse tree
	 */
	enterOpt_namespace_name?: (ctx: Opt_namespace_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_namespace_name`.
	 * @param ctx the parse tree
	 */
	exitOpt_namespace_name?: (ctx: Opt_namespace_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.sequence_object_name`.
	 * @param ctx the parse tree
	 */
	enterSequence_object_name?: (ctx: Sequence_object_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.sequence_object_name`.
	 * @param ctx the parse tree
	 */
	exitSequence_object_name?: (ctx: Sequence_object_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.sequence_full_name`.
	 * @param ctx the parse tree
	 */
	enterSequence_full_name?: (ctx: Sequence_full_nameContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.sequence_full_name`.
	 * @param ctx the parse tree
	 */
	exitSequence_full_name?: (ctx: Sequence_full_nameContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.sequence_stmt`.
	 * @param ctx the parse tree
	 */
	enterSequence_stmt?: (ctx: Sequence_stmtContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.sequence_stmt`.
	 * @param ctx the parse tree
	 */
	exitSequence_stmt?: (ctx: Sequence_stmtContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.create_sequence`.
	 * @param ctx the parse tree
	 */
	enterCreate_sequence?: (ctx: Create_sequenceContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.create_sequence`.
	 * @param ctx the parse tree
	 */
	exitCreate_sequence?: (ctx: Create_sequenceContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.sequence_name_options`.
	 * @param ctx the parse tree
	 */
	enterSequence_name_options?: (ctx: Sequence_name_optionsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.sequence_name_options`.
	 * @param ctx the parse tree
	 */
	exitSequence_name_options?: (ctx: Sequence_name_optionsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.sequence_name_option`.
	 * @param ctx the parse tree
	 */
	enterSequence_name_option?: (ctx: Sequence_name_optionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.sequence_name_option`.
	 * @param ctx the parse tree
	 */
	exitSequence_name_option?: (ctx: Sequence_name_optionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.opt_seq_create_options`.
	 * @param ctx the parse tree
	 */
	enterOpt_seq_create_options?: (ctx: Opt_seq_create_optionsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.opt_seq_create_options`.
	 * @param ctx the parse tree
	 */
	exitOpt_seq_create_options?: (ctx: Opt_seq_create_optionsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.seq_create_option`.
	 * @param ctx the parse tree
	 */
	enterSeq_create_option?: (ctx: Seq_create_optionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.seq_create_option`.
	 * @param ctx the parse tree
	 */
	exitSeq_create_option?: (ctx: Seq_create_optionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.drop_sequence`.
	 * @param ctx the parse tree
	 */
	enterDrop_sequence?: (ctx: Drop_sequenceContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.drop_sequence`.
	 * @param ctx the parse tree
	 */
	exitDrop_sequence?: (ctx: Drop_sequenceContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.alter_sequence`.
	 * @param ctx the parse tree
	 */
	enterAlter_sequence?: (ctx: Alter_sequenceContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.alter_sequence`.
	 * @param ctx the parse tree
	 */
	exitAlter_sequence?: (ctx: Alter_sequenceContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.seq_alter_options`.
	 * @param ctx the parse tree
	 */
	enterSeq_alter_options?: (ctx: Seq_alter_optionsContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.seq_alter_options`.
	 * @param ctx the parse tree
	 */
	exitSeq_alter_options?: (ctx: Seq_alter_optionsContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.seq_alter_option`.
	 * @param ctx the parse tree
	 */
	enterSeq_alter_option?: (ctx: Seq_alter_optionContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.seq_alter_option`.
	 * @param ctx the parse tree
	 */
	exitSeq_alter_option?: (ctx: Seq_alter_optionContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.sequence_with`.
	 * @param ctx the parse tree
	 */
	enterSequence_with?: (ctx: Sequence_withContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.sequence_with`.
	 * @param ctx the parse tree
	 */
	exitSequence_with?: (ctx: Sequence_withContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.start_with`.
	 * @param ctx the parse tree
	 */
	enterStart_with?: (ctx: Start_withContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.start_with`.
	 * @param ctx the parse tree
	 */
	exitStart_with?: (ctx: Start_withContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.restart_with`.
	 * @param ctx the parse tree
	 */
	enterRestart_with?: (ctx: Restart_withContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.restart_with`.
	 * @param ctx the parse tree
	 */
	exitRestart_with?: (ctx: Restart_withContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.increment_by`.
	 * @param ctx the parse tree
	 */
	enterIncrement_by?: (ctx: Increment_byContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.increment_by`.
	 * @param ctx the parse tree
	 */
	exitIncrement_by?: (ctx: Increment_byContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.maxvalue`.
	 * @param ctx the parse tree
	 */
	enterMaxvalue?: (ctx: MaxvalueContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.maxvalue`.
	 * @param ctx the parse tree
	 */
	exitMaxvalue?: (ctx: MaxvalueContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.minvalue`.
	 * @param ctx the parse tree
	 */
	enterMinvalue?: (ctx: MinvalueContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.minvalue`.
	 * @param ctx the parse tree
	 */
	exitMinvalue?: (ctx: MinvalueContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.cycle`.
	 * @param ctx the parse tree
	 */
	enterCycle?: (ctx: CycleContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.cycle`.
	 * @param ctx the parse tree
	 */
	exitCycle?: (ctx: CycleContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.cache`.
	 * @param ctx the parse tree
	 */
	enterCache?: (ctx: CacheContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.cache`.
	 * @param ctx the parse tree
	 */
	exitCache?: (ctx: CacheContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.sequence_next`.
	 * @param ctx the parse tree
	 */
	enterSequence_next?: (ctx: Sequence_nextContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.sequence_next`.
	 * @param ctx the parse tree
	 */
	exitSequence_next?: (ctx: Sequence_nextContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.sequence_prev`.
	 * @param ctx the parse tree
	 */
	enterSequence_prev?: (ctx: Sequence_prevContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.sequence_prev`.
	 * @param ctx the parse tree
	 */
	exitSequence_prev?: (ctx: Sequence_prevContext) => void;
	/**
	 * Enter a parse tree produced by `n1qlParser.sequence_expr`.
	 * @param ctx the parse tree
	 */
	enterSequence_expr?: (ctx: Sequence_exprContext) => void;
	/**
	 * Exit a parse tree produced by `n1qlParser.sequence_expr`.
	 * @param ctx the parse tree
	 */
	exitSequence_expr?: (ctx: Sequence_exprContext) => void;
}

