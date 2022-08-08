#include "constants.hpp"
#include "jstocbpp.hpp"
#include <couchbase/cluster.hxx>
#include <couchbase/errors.hxx>
#include <couchbase/transactions.hxx>
#include <couchbase/transactions/internal/exceptions_internal.hxx>
#include <set>
#include <vector>

namespace couchnode
{

template <typename T>
static inline Napi::Object
cbppEnumToJs(Napi::Env env,
             const std::vector<std::pair<std::string, T>> &values)
{
    auto jsVals = Napi::Object::New(env);
    auto dedupValues = std::set<T>();
    for (const auto &value : values) {
        auto dedupRes = dedupValues.emplace(value.second);
        if (!dedupRes.second) {
            throw Napi::Error::New(env,
                                   "duplicate constants during initialization");
        }

        jsVals.Set(value.first,
                   Napi::Number::New(env, static_cast<int64_t>(value.second)));
    }
    return jsVals;
}

void Constants::Init(Napi::Env env, Napi::Object exports)
{
    InitAutogen(env, exports);

    exports.Set("protocol_lookup_in_request_body_doc_flag",
                cbppEnumToJs<uint8_t>(
                    env, {
                             {"access_deleted",
                              couchbase::protocol::lookup_in_request_body::
                                  doc_flag_access_deleted},

                         }));

    exports.Set(
        "protocol_lookup_in_request_body_lookup_in_specs_path_flag",
        cbppEnumToJs<uint8_t>(
            env, {
                     {"xattr", couchbase::protocol::lookup_in_request_body::
                                   lookup_in_specs::path_flag_xattr},
                 }));

    exports.Set(
        "protocol_mutate_in_request_body_doc_flag",
        cbppEnumToJs<uint8_t>(
            env,
            {
                {"mkdoc",
                 couchbase::protocol::mutate_in_request_body::doc_flag_mkdoc},
                {"add",
                 couchbase::protocol::mutate_in_request_body::doc_flag_add},
                {"access_deleted", couchbase::protocol::mutate_in_request_body::
                                       doc_flag_access_deleted},
                {"create_as_deleted",
                 couchbase::protocol::mutate_in_request_body::
                     doc_flag_create_as_deleted},
                {"revive_document",
                 couchbase::protocol::mutate_in_request_body::
                     doc_flag_revive_document},
            }));

    exports.Set(
        "protocol_mutate_in_request_body_mutate_in_specs_path_flag",
        cbppEnumToJs<uint8_t>(
            env,
            {
                {"create_parents",
                 couchbase::protocol::mutate_in_request_body::mutate_in_specs::
                     path_flag_create_parents},
                {"xattr", couchbase::protocol::mutate_in_request_body::
                              mutate_in_specs::path_flag_xattr},
                {"expand_macros", couchbase::protocol::mutate_in_request_body::
                                      mutate_in_specs::path_flag_expand_macros},
            }));

    exports.Set(
        "txn_failure_type",
        cbppEnumToJs<couchbase::transactions::failure_type>(
            env, {
                     {"fail", couchbase::transactions::failure_type::FAIL},
                     {"expiry", couchbase::transactions::failure_type::EXPIRY},
                     {"commit_ambiguous",
                      couchbase::transactions::failure_type::COMMIT_AMBIGUOUS},
                 }));

    exports.Set(
        "txn_external_exception",
        cbppEnumToJs<couchbase::transactions::external_exception>(
            env,
            {
                {"unknown",
                 couchbase::transactions::external_exception::UNKNOWN},
                {"active_transaction_record_entry_not_found",
                 couchbase::transactions::external_exception::
                     ACTIVE_TRANSACTION_RECORD_ENTRY_NOT_FOUND},
                {"active_transaction_record_full",
                 couchbase::transactions::external_exception::
                     ACTIVE_TRANSACTION_RECORD_FULL},
                {"active_transaction_record_not_found",
                 couchbase::transactions::external_exception::
                     ACTIVE_TRANSACTION_RECORD_NOT_FOUND},
                {"document_already_in_transaction",
                 couchbase::transactions::external_exception::
                     DOCUMENT_ALREADY_IN_TRANSACTION},
                {"document_exists_exception",
                 couchbase::transactions::external_exception::
                     DOCUMENT_EXISTS_EXCEPTION},
                {"document_not_found_exception",
                 couchbase::transactions::external_exception::
                     DOCUMENT_NOT_FOUND_EXCEPTION},
                {"not_set",
                 couchbase::transactions::external_exception::NOT_SET},
                {"feature_not_available_exception",
                 couchbase::transactions::external_exception::
                     FEATURE_NOT_AVAILABLE_EXCEPTION},
                {"transaction_aborted_externally",
                 couchbase::transactions::external_exception::
                     TRANSACTION_ABORTED_EXTERNALLY},
                {"previous_operation_failed",
                 couchbase::transactions::external_exception::
                     PREVIOUS_OPERATION_FAILED},
                {"forward_compatibility_failure",
                 couchbase::transactions::external_exception::
                     FORWARD_COMPATIBILITY_FAILURE},
                {"parsing_failure",
                 couchbase::transactions::external_exception::PARSING_FAILURE},
                {"illegal_state_exception",
                 couchbase::transactions::external_exception::
                     ILLEGAL_STATE_EXCEPTION},
                {"couchbase_exception",
                 couchbase::transactions::external_exception::
                     COUCHBASE_EXCEPTION},
                {"service_not_available_exception",
                 couchbase::transactions::external_exception::
                     SERVICE_NOT_AVAILABLE_EXCEPTION},
                {"request_canceled_exception",
                 couchbase::transactions::external_exception::
                     REQUEST_CANCELED_EXCEPTION},
                {"concurrent_operations_detected_on_same_document",
                 couchbase::transactions::external_exception::
                     CONCURRENT_OPERATIONS_DETECTED_ON_SAME_DOCUMENT},
                {"commit_not_permitted",
                 couchbase::transactions::external_exception::
                     COMMIT_NOT_PERMITTED},
                {"rollback_not_permitted",
                 couchbase::transactions::external_exception::
                     ROLLBACK_NOT_PERMITTED},
                {"transaction_already_aborted",
                 couchbase::transactions::external_exception::
                     TRANSACTION_ALREADY_ABORTED},
                {"transaction_already_committed",
                 couchbase::transactions::external_exception::
                     TRANSACTION_ALREADY_COMMITTED},
            }));
}

void Constants::InitAutogen(Napi::Env env, Napi::Object exports)
{
    //#region Autogenerated Constants

    exports.Set(
        "management_analytics_couchbase_link_encryption_level",
        cbppEnumToJs<
            couchbase::management::analytics::couchbase_link_encryption_level>(
            env, {
                     {"none", couchbase::management::analytics::
                                  couchbase_link_encryption_level::none},
                     {"half", couchbase::management::analytics::
                                  couchbase_link_encryption_level::half},
                     {"full", couchbase::management::analytics::
                                  couchbase_link_encryption_level::full},
                 }));

    exports.Set(
        "management_cluster_bucket_type",
        cbppEnumToJs<couchbase::management::cluster::bucket_type>(
            env, {
                     {"unknown",
                      couchbase::management::cluster::bucket_type::unknown},
                     {"couchbase",
                      couchbase::management::cluster::bucket_type::couchbase},
                     {"memcached",
                      couchbase::management::cluster::bucket_type::memcached},
                     {"ephemeral",
                      couchbase::management::cluster::bucket_type::ephemeral},
                 }));

    exports.Set(
        "management_cluster_bucket_compression",
        cbppEnumToJs<couchbase::management::cluster::bucket_compression>(
            env,
            {
                {"unknown",
                 couchbase::management::cluster::bucket_compression::unknown},
                {"off",
                 couchbase::management::cluster::bucket_compression::off},
                {"active",
                 couchbase::management::cluster::bucket_compression::active},
                {"passive",
                 couchbase::management::cluster::bucket_compression::passive},
            }));

    exports.Set(
        "management_cluster_bucket_eviction_policy",
        cbppEnumToJs<couchbase::management::cluster::bucket_eviction_policy>(
            env,
            {
                {"unknown", couchbase::management::cluster::
                                bucket_eviction_policy::unknown},
                {"full",
                 couchbase::management::cluster::bucket_eviction_policy::full},
                {"value_only", couchbase::management::cluster::
                                   bucket_eviction_policy::value_only},
                {"no_eviction", couchbase::management::cluster::
                                    bucket_eviction_policy::no_eviction},
                {"not_recently_used",
                 couchbase::management::cluster::bucket_eviction_policy::
                     not_recently_used},
            }));

    exports.Set(
        "management_cluster_bucket_conflict_resolution",
        cbppEnumToJs<
            couchbase::management::cluster::bucket_conflict_resolution>(
            env, {
                     {"unknown", couchbase::management::cluster::
                                     bucket_conflict_resolution::unknown},
                     {"timestamp", couchbase::management::cluster::
                                       bucket_conflict_resolution::timestamp},
                     {"sequence_number",
                      couchbase::management::cluster::
                          bucket_conflict_resolution::sequence_number},
                     {"custom", couchbase::management::cluster::
                                    bucket_conflict_resolution::custom},
                 }));

    exports.Set(
        "management_cluster_bucket_storage_backend",
        cbppEnumToJs<couchbase::management::cluster::bucket_storage_backend>(
            env,
            {
                {"unknown", couchbase::management::cluster::
                                bucket_storage_backend::unknown},
                {"couchstore", couchbase::management::cluster::
                                   bucket_storage_backend::couchstore},
                {"magma",
                 couchbase::management::cluster::bucket_storage_backend::magma},
            }));

    exports.Set(
        "management_eventing_function_dcp_boundary",
        cbppEnumToJs<couchbase::management::eventing::function_dcp_boundary>(
            env, {
                     {"everything", couchbase::management::eventing::
                                        function_dcp_boundary::everything},
                     {"from_now", couchbase::management::eventing::
                                      function_dcp_boundary::from_now},
                 }));

    exports.Set(
        "management_eventing_function_language_compatibility",
        cbppEnumToJs<
            couchbase::management::eventing::function_language_compatibility>(
            env, {
                     {"version_6_0_0",
                      couchbase::management::eventing::
                          function_language_compatibility::version_6_0_0},
                     {"version_6_5_0",
                      couchbase::management::eventing::
                          function_language_compatibility::version_6_5_0},
                     {"version_6_6_2",
                      couchbase::management::eventing::
                          function_language_compatibility::version_6_6_2},
                 }));

    exports.Set(
        "management_eventing_function_log_level",
        cbppEnumToJs<couchbase::management::eventing::function_log_level>(
            env,
            {
                {"info",
                 couchbase::management::eventing::function_log_level::info},
                {"error",
                 couchbase::management::eventing::function_log_level::error},
                {"warning",
                 couchbase::management::eventing::function_log_level::warning},
                {"debug",
                 couchbase::management::eventing::function_log_level::debug},
                {"trace",
                 couchbase::management::eventing::function_log_level::trace},
            }));

    exports.Set(
        "management_eventing_function_bucket_access",
        cbppEnumToJs<couchbase::management::eventing::function_bucket_access>(
            env, {
                     {"read_only", couchbase::management::eventing::
                                       function_bucket_access::read_only},
                     {"read_write", couchbase::management::eventing::
                                        function_bucket_access::read_write},
                 }));

    exports.Set(
        "management_eventing_function_status",
        cbppEnumToJs<couchbase::management::eventing::function_status>(
            env,
            {
                {"undeployed",
                 couchbase::management::eventing::function_status::undeployed},
                {"undeploying",
                 couchbase::management::eventing::function_status::undeploying},
                {"deploying",
                 couchbase::management::eventing::function_status::deploying},
                {"deployed",
                 couchbase::management::eventing::function_status::deployed},
                {"paused",
                 couchbase::management::eventing::function_status::paused},
                {"pausing",
                 couchbase::management::eventing::function_status::pausing},
            }));

    exports.Set(
        "management_eventing_function_deployment_status",
        cbppEnumToJs<
            couchbase::management::eventing::function_deployment_status>(
            env, {
                     {"deployed", couchbase::management::eventing::
                                      function_deployment_status::deployed},
                     {"undeployed", couchbase::management::eventing::
                                        function_deployment_status::undeployed},
                 }));

    exports.Set(
        "management_eventing_function_processing_status",
        cbppEnumToJs<
            couchbase::management::eventing::function_processing_status>(
            env, {
                     {"running", couchbase::management::eventing::
                                     function_processing_status::running},
                     {"paused", couchbase::management::eventing::
                                    function_processing_status::paused},
                 }));

    exports.Set(
        "management_rbac_auth_domain",
        cbppEnumToJs<couchbase::management::rbac::auth_domain>(
            env,
            {
                {"unknown", couchbase::management::rbac::auth_domain::unknown},
                {"local", couchbase::management::rbac::auth_domain::local},
                {"external",
                 couchbase::management::rbac::auth_domain::external},
            }));

    exports.Set(
        "io_retry_reason",
        cbppEnumToJs<couchbase::io::retry_reason>(
            env,
            {
                {"do_not_retry", couchbase::io::retry_reason::do_not_retry},
                {"unknown", couchbase::io::retry_reason::unknown},
                {"socket_not_available",
                 couchbase::io::retry_reason::socket_not_available},
                {"service_not_available",
                 couchbase::io::retry_reason::service_not_available},
                {"node_not_available",
                 couchbase::io::retry_reason::node_not_available},
                {"kv_not_my_vbucket",
                 couchbase::io::retry_reason::kv_not_my_vbucket},
                {"kv_collection_outdated",
                 couchbase::io::retry_reason::kv_collection_outdated},
                {"kv_error_map_retry_indicated",
                 couchbase::io::retry_reason::kv_error_map_retry_indicated},
                {"kv_locked", couchbase::io::retry_reason::kv_locked},
                {"kv_temporary_failure",
                 couchbase::io::retry_reason::kv_temporary_failure},
                {"kv_sync_write_in_progress",
                 couchbase::io::retry_reason::kv_sync_write_in_progress},
                {"kv_sync_write_re_commit_in_progress",
                 couchbase::io::retry_reason::
                     kv_sync_write_re_commit_in_progress},
                {"service_response_code_indicated",
                 couchbase::io::retry_reason::service_response_code_indicated},
                {"socket_closed_while_in_flight",
                 couchbase::io::retry_reason::socket_closed_while_in_flight},
                {"circuit_breaker_open",
                 couchbase::io::retry_reason::circuit_breaker_open},
                {"query_prepared_statement_failure",
                 couchbase::io::retry_reason::query_prepared_statement_failure},
                {"query_index_not_found",
                 couchbase::io::retry_reason::query_index_not_found},
                {"analytics_temporary_failure",
                 couchbase::io::retry_reason::analytics_temporary_failure},
                {"search_too_many_requests",
                 couchbase::io::retry_reason::search_too_many_requests},
                {"views_temporary_failure",
                 couchbase::io::retry_reason::views_temporary_failure},
                {"views_no_active_partition",
                 couchbase::io::retry_reason::views_no_active_partition},
            }));

    exports.Set(
        "protocol_subdoc_opcode",
        cbppEnumToJs<couchbase::protocol::subdoc_opcode>(
            env,
            {
                {"get_doc", couchbase::protocol::subdoc_opcode::get_doc},
                {"set_doc", couchbase::protocol::subdoc_opcode::set_doc},
                {"remove_doc", couchbase::protocol::subdoc_opcode::remove_doc},
                {"get", couchbase::protocol::subdoc_opcode::get},
                {"exists", couchbase::protocol::subdoc_opcode::exists},
                {"dict_add", couchbase::protocol::subdoc_opcode::dict_add},
                {"dict_upsert",
                 couchbase::protocol::subdoc_opcode::dict_upsert},
                {"remove", couchbase::protocol::subdoc_opcode::remove},
                {"replace", couchbase::protocol::subdoc_opcode::replace},
                {"array_push_last",
                 couchbase::protocol::subdoc_opcode::array_push_last},
                {"array_push_first",
                 couchbase::protocol::subdoc_opcode::array_push_first},
                {"array_insert",
                 couchbase::protocol::subdoc_opcode::array_insert},
                {"array_add_unique",
                 couchbase::protocol::subdoc_opcode::array_add_unique},
                {"counter", couchbase::protocol::subdoc_opcode::counter},
                {"get_count", couchbase::protocol::subdoc_opcode::get_count},
                {"replace_body_with_xattr",
                 couchbase::protocol::subdoc_opcode::replace_body_with_xattr},
            }));

    exports.Set(
        "protocol_mutate_in_request_body_store_semantics_type",
        cbppEnumToJs<
            couchbase::protocol::mutate_in_request_body::store_semantics_type>(
            env, {
                     {"replace", couchbase::protocol::mutate_in_request_body::
                                     store_semantics_type::replace},
                     {"upsert", couchbase::protocol::mutate_in_request_body::
                                    store_semantics_type::upsert},
                     {"insert", couchbase::protocol::mutate_in_request_body::
                                    store_semantics_type::insert},
                 }));

    exports.Set(
        "protocol_durability_level",
        cbppEnumToJs<couchbase::protocol::durability_level>(
            env,
            {
                {"none", couchbase::protocol::durability_level::none},
                {"majority", couchbase::protocol::durability_level::majority},
                {"majority_and_persist_to_active",
                 couchbase::protocol::durability_level::
                     majority_and_persist_to_active},
                {"persist_to_majority",
                 couchbase::protocol::durability_level::persist_to_majority},
            }));

    exports.Set(
        "protocol_status",
        cbppEnumToJs<couchbase::protocol::status>(
            env,
            {
                {"success", couchbase::protocol::status::success},
                {"not_found", couchbase::protocol::status::not_found},
                {"exists", couchbase::protocol::status::exists},
                {"too_big", couchbase::protocol::status::too_big},
                {"invalid", couchbase::protocol::status::invalid},
                {"not_stored", couchbase::protocol::status::not_stored},
                {"delta_bad_value",
                 couchbase::protocol::status::delta_bad_value},
                {"not_my_vbucket", couchbase::protocol::status::not_my_vbucket},
                {"no_bucket", couchbase::protocol::status::no_bucket},
                {"dcp_stream_not_found",
                 couchbase::protocol::status::dcp_stream_not_found},
                {"opaque_no_match",
                 couchbase::protocol::status::opaque_no_match},
                {"locked", couchbase::protocol::status::locked},
                {"auth_stale", couchbase::protocol::status::auth_stale},
                {"auth_error", couchbase::protocol::status::auth_error},
                {"auth_continue", couchbase::protocol::status::auth_continue},
                {"range_error", couchbase::protocol::status::range_error},
                {"rollback", couchbase::protocol::status::rollback},
                {"no_access", couchbase::protocol::status::no_access},
                {"not_initialized",
                 couchbase::protocol::status::not_initialized},
                {"rate_limited_network_ingress",
                 couchbase::protocol::status::rate_limited_network_ingress},
                {"rate_limited_network_egress",
                 couchbase::protocol::status::rate_limited_network_egress},
                {"rate_limited_max_connections",
                 couchbase::protocol::status::rate_limited_max_connections},
                {"rate_limited_max_commands",
                 couchbase::protocol::status::rate_limited_max_commands},
                {"scope_size_limit_exceeded",
                 couchbase::protocol::status::scope_size_limit_exceeded},
                {"unknown_frame_info",
                 couchbase::protocol::status::unknown_frame_info},
                {"unknown_command",
                 couchbase::protocol::status::unknown_command},
                {"no_memory", couchbase::protocol::status::no_memory},
                {"not_supported", couchbase::protocol::status::not_supported},
                {"internal", couchbase::protocol::status::internal},
                {"busy", couchbase::protocol::status::busy},
                {"temporary_failure",
                 couchbase::protocol::status::temporary_failure},
                {"xattr_invalid", couchbase::protocol::status::xattr_invalid},
                {"unknown_collection",
                 couchbase::protocol::status::unknown_collection},
                {"no_collections_manifest",
                 couchbase::protocol::status::no_collections_manifest},
                {"cannot_apply_collections_manifest",
                 couchbase::protocol::status::
                     cannot_apply_collections_manifest},
                {"collections_manifest_is_ahead",
                 couchbase::protocol::status::collections_manifest_is_ahead},
                {"unknown_scope", couchbase::protocol::status::unknown_scope},
                {"dcp_stream_id_invalid",
                 couchbase::protocol::status::dcp_stream_id_invalid},
                {"durability_invalid_level",
                 couchbase::protocol::status::durability_invalid_level},
                {"durability_impossible",
                 couchbase::protocol::status::durability_impossible},
                {"sync_write_in_progress",
                 couchbase::protocol::status::sync_write_in_progress},
                {"sync_write_ambiguous",
                 couchbase::protocol::status::sync_write_ambiguous},
                {"sync_write_re_commit_in_progress",
                 couchbase::protocol::status::sync_write_re_commit_in_progress},
                {"subdoc_path_not_found",
                 couchbase::protocol::status::subdoc_path_not_found},
                {"subdoc_path_mismatch",
                 couchbase::protocol::status::subdoc_path_mismatch},
                {"subdoc_path_invalid",
                 couchbase::protocol::status::subdoc_path_invalid},
                {"subdoc_path_too_big",
                 couchbase::protocol::status::subdoc_path_too_big},
                {"subdoc_doc_too_deep",
                 couchbase::protocol::status::subdoc_doc_too_deep},
                {"subdoc_value_cannot_insert",
                 couchbase::protocol::status::subdoc_value_cannot_insert},
                {"subdoc_doc_not_json",
                 couchbase::protocol::status::subdoc_doc_not_json},
                {"subdoc_num_range_error",
                 couchbase::protocol::status::subdoc_num_range_error},
                {"subdoc_delta_invalid",
                 couchbase::protocol::status::subdoc_delta_invalid},
                {"subdoc_path_exists",
                 couchbase::protocol::status::subdoc_path_exists},
                {"subdoc_value_too_deep",
                 couchbase::protocol::status::subdoc_value_too_deep},
                {"subdoc_invalid_combo",
                 couchbase::protocol::status::subdoc_invalid_combo},
                {"subdoc_multi_path_failure",
                 couchbase::protocol::status::subdoc_multi_path_failure},
                {"subdoc_success_deleted",
                 couchbase::protocol::status::subdoc_success_deleted},
                {"subdoc_xattr_invalid_flag_combo",
                 couchbase::protocol::status::subdoc_xattr_invalid_flag_combo},
                {"subdoc_xattr_invalid_key_combo",
                 couchbase::protocol::status::subdoc_xattr_invalid_key_combo},
                {"subdoc_xattr_unknown_macro",
                 couchbase::protocol::status::subdoc_xattr_unknown_macro},
                {"subdoc_xattr_unknown_vattr",
                 couchbase::protocol::status::subdoc_xattr_unknown_vattr},
                {"subdoc_xattr_cannot_modify_vattr",
                 couchbase::protocol::status::subdoc_xattr_cannot_modify_vattr},
                {"subdoc_multi_path_failure_deleted",
                 couchbase::protocol::status::
                     subdoc_multi_path_failure_deleted},
                {"subdoc_invalid_xattr_order",
                 couchbase::protocol::status::subdoc_invalid_xattr_order},
                {"subdoc_xattr_unknown_vattr_macro",
                 couchbase::protocol::status::subdoc_xattr_unknown_vattr_macro},
                {"subdoc_can_only_revive_deleted_documents",
                 couchbase::protocol::status::
                     subdoc_can_only_revive_deleted_documents},
                {"subdoc_deleted_document_cannot_have_value",
                 couchbase::protocol::status::
                     subdoc_deleted_document_cannot_have_value},
            }));

    exports.Set(
        "error_common_errc",
        cbppEnumToJs<couchbase::error::common_errc>(
            env,
            {
                {"request_canceled",
                 couchbase::error::common_errc::request_canceled},
                {"invalid_argument",
                 couchbase::error::common_errc::invalid_argument},
                {"service_not_available",
                 couchbase::error::common_errc::service_not_available},
                {"internal_server_failure",
                 couchbase::error::common_errc::internal_server_failure},
                {"authentication_failure",
                 couchbase::error::common_errc::authentication_failure},
                {"temporary_failure",
                 couchbase::error::common_errc::temporary_failure},
                {"parsing_failure",
                 couchbase::error::common_errc::parsing_failure},
                {"cas_mismatch", couchbase::error::common_errc::cas_mismatch},
                {"bucket_not_found",
                 couchbase::error::common_errc::bucket_not_found},
                {"collection_not_found",
                 couchbase::error::common_errc::collection_not_found},
                {"unsupported_operation",
                 couchbase::error::common_errc::unsupported_operation},
                {"ambiguous_timeout",
                 couchbase::error::common_errc::ambiguous_timeout},
                {"unambiguous_timeout",
                 couchbase::error::common_errc::unambiguous_timeout},
                {"feature_not_available",
                 couchbase::error::common_errc::feature_not_available},
                {"scope_not_found",
                 couchbase::error::common_errc::scope_not_found},
                {"index_not_found",
                 couchbase::error::common_errc::index_not_found},
                {"index_exists", couchbase::error::common_errc::index_exists},
                {"encoding_failure",
                 couchbase::error::common_errc::encoding_failure},
                {"decoding_failure",
                 couchbase::error::common_errc::decoding_failure},
                {"rate_limited", couchbase::error::common_errc::rate_limited},
                {"quota_limited", couchbase::error::common_errc::quota_limited},
            }));

    exports.Set(
        "error_key_value_errc",
        cbppEnumToJs<couchbase::error::key_value_errc>(
            env,
            {
                {"document_not_found",
                 couchbase::error::key_value_errc::document_not_found},
                {"document_irretrievable",
                 couchbase::error::key_value_errc::document_irretrievable},
                {"document_locked",
                 couchbase::error::key_value_errc::document_locked},
                {"value_too_large",
                 couchbase::error::key_value_errc::value_too_large},
                {"document_exists",
                 couchbase::error::key_value_errc::document_exists},
                {"durability_level_not_available",
                 couchbase::error::key_value_errc::
                     durability_level_not_available},
                {"durability_impossible",
                 couchbase::error::key_value_errc::durability_impossible},
                {"durability_ambiguous",
                 couchbase::error::key_value_errc::durability_ambiguous},
                {"durable_write_in_progress",
                 couchbase::error::key_value_errc::durable_write_in_progress},
                {"durable_write_re_commit_in_progress",
                 couchbase::error::key_value_errc::
                     durable_write_re_commit_in_progress},
                {"path_not_found",
                 couchbase::error::key_value_errc::path_not_found},
                {"path_mismatch",
                 couchbase::error::key_value_errc::path_mismatch},
                {"path_invalid",
                 couchbase::error::key_value_errc::path_invalid},
                {"path_too_big",
                 couchbase::error::key_value_errc::path_too_big},
                {"path_too_deep",
                 couchbase::error::key_value_errc::path_too_deep},
                {"value_too_deep",
                 couchbase::error::key_value_errc::value_too_deep},
                {"value_invalid",
                 couchbase::error::key_value_errc::value_invalid},
                {"document_not_json",
                 couchbase::error::key_value_errc::document_not_json},
                {"number_too_big",
                 couchbase::error::key_value_errc::number_too_big},
                {"delta_invalid",
                 couchbase::error::key_value_errc::delta_invalid},
                {"path_exists", couchbase::error::key_value_errc::path_exists},
                {"xattr_unknown_macro",
                 couchbase::error::key_value_errc::xattr_unknown_macro},
                {"xattr_invalid_key_combo",
                 couchbase::error::key_value_errc::xattr_invalid_key_combo},
                {"xattr_unknown_virtual_attribute",
                 couchbase::error::key_value_errc::
                     xattr_unknown_virtual_attribute},
                {"xattr_cannot_modify_virtual_attribute",
                 couchbase::error::key_value_errc::
                     xattr_cannot_modify_virtual_attribute},
                {"xattr_no_access",
                 couchbase::error::key_value_errc::xattr_no_access},
                {"cannot_revive_living_document",
                 couchbase::error::key_value_errc::
                     cannot_revive_living_document},
            }));

    exports.Set(
        "error_query_errc",
        cbppEnumToJs<couchbase::error::query_errc>(
            env,
            {
                {"planning_failure",
                 couchbase::error::query_errc::planning_failure},
                {"index_failure", couchbase::error::query_errc::index_failure},
                {"prepared_statement_failure",
                 couchbase::error::query_errc::prepared_statement_failure},
                {"dml_failure", couchbase::error::query_errc::dml_failure},
            }));

    exports.Set(
        "error_analytics_errc",
        cbppEnumToJs<couchbase::error::analytics_errc>(
            env,
            {
                {"compilation_failure",
                 couchbase::error::analytics_errc::compilation_failure},
                {"job_queue_full",
                 couchbase::error::analytics_errc::job_queue_full},
                {"dataset_not_found",
                 couchbase::error::analytics_errc::dataset_not_found},
                {"dataverse_not_found",
                 couchbase::error::analytics_errc::dataverse_not_found},
                {"dataset_exists",
                 couchbase::error::analytics_errc::dataset_exists},
                {"dataverse_exists",
                 couchbase::error::analytics_errc::dataverse_exists},
                {"link_not_found",
                 couchbase::error::analytics_errc::link_not_found},
                {"link_exists", couchbase::error::analytics_errc::link_exists},
            }));

    exports.Set(
        "error_search_errc",
        cbppEnumToJs<couchbase::error::search_errc>(
            env, {
                     {"index_not_ready",
                      couchbase::error::search_errc::index_not_ready},
                     {"consistency_mismatch",
                      couchbase::error::search_errc::consistency_mismatch},
                 }));

    exports.Set(
        "error_view_errc",
        cbppEnumToJs<couchbase::error::view_errc>(
            env,
            {
                {"view_not_found", couchbase::error::view_errc::view_not_found},
                {"design_document_not_found",
                 couchbase::error::view_errc::design_document_not_found},
            }));

    exports.Set(
        "error_management_errc",
        cbppEnumToJs<couchbase::error::management_errc>(
            env,
            {
                {"collection_exists",
                 couchbase::error::management_errc::collection_exists},
                {"scope_exists",
                 couchbase::error::management_errc::scope_exists},
                {"user_not_found",
                 couchbase::error::management_errc::user_not_found},
                {"group_not_found",
                 couchbase::error::management_errc::group_not_found},
                {"bucket_exists",
                 couchbase::error::management_errc::bucket_exists},
                {"user_exists", couchbase::error::management_errc::user_exists},
                {"bucket_not_flushable",
                 couchbase::error::management_errc::bucket_not_flushable},
                {"eventing_function_not_found",
                 couchbase::error::management_errc::
                     eventing_function_not_found},
                {"eventing_function_not_deployed",
                 couchbase::error::management_errc::
                     eventing_function_not_deployed},
                {"eventing_function_compilation_failure",
                 couchbase::error::management_errc::
                     eventing_function_compilation_failure},
                {"eventing_function_identical_keyspace",
                 couchbase::error::management_errc::
                     eventing_function_identical_keyspace},
                {"eventing_function_not_bootstrapped",
                 couchbase::error::management_errc::
                     eventing_function_not_bootstrapped},
                {"eventing_function_deployed",
                 couchbase::error::management_errc::eventing_function_deployed},
                {"eventing_function_paused",
                 couchbase::error::management_errc::eventing_function_paused},
            }));

    exports.Set("error_field_level_encryption_errc",
                cbppEnumToJs<couchbase::error::field_level_encryption_errc>(
                    env, {
                             {"generic_cryptography_failure",
                              couchbase::error::field_level_encryption_errc::
                                  generic_cryptography_failure},
                             {"encryption_failure",
                              couchbase::error::field_level_encryption_errc::
                                  encryption_failure},
                             {"decryption_failure",
                              couchbase::error::field_level_encryption_errc::
                                  decryption_failure},
                             {"crypto_key_not_found",
                              couchbase::error::field_level_encryption_errc::
                                  crypto_key_not_found},
                             {"invalid_crypto_key",
                              couchbase::error::field_level_encryption_errc::
                                  invalid_crypto_key},
                             {"decrypter_not_found",
                              couchbase::error::field_level_encryption_errc::
                                  decrypter_not_found},
                             {"encrypter_not_found",
                              couchbase::error::field_level_encryption_errc::
                                  encrypter_not_found},
                             {"invalid_ciphertext",
                              couchbase::error::field_level_encryption_errc::
                                  invalid_ciphertext},
                         }));

    exports.Set(
        "error_network_errc",
        cbppEnumToJs<couchbase::error::network_errc>(
            env,
            {
                {"resolve_failure",
                 couchbase::error::network_errc::resolve_failure},
                {"no_endpoints_left",
                 couchbase::error::network_errc::no_endpoints_left},
                {"handshake_failure",
                 couchbase::error::network_errc::handshake_failure},
                {"protocol_error",
                 couchbase::error::network_errc::protocol_error},
                {"configuration_not_available",
                 couchbase::error::network_errc::configuration_not_available},
                {"cluster_closed",
                 couchbase::error::network_errc::cluster_closed},
            }));

    exports.Set(
        "analytics_scan_consistency",
        cbppEnumToJs<couchbase::analytics_scan_consistency>(
            env, {
                     {"not_bounded",
                      couchbase::analytics_scan_consistency::not_bounded},
                     {"request_plus",
                      couchbase::analytics_scan_consistency::request_plus},
                 }));

    exports.Set(
        "design_document_namespace",
        cbppEnumToJs<couchbase::design_document_namespace>(
            env, {
                     {"development",
                      couchbase::design_document_namespace::development},
                     {"production",
                      couchbase::design_document_namespace::production},
                 }));

    exports.Set(
        "diag_cluster_state",
        cbppEnumToJs<couchbase::diag::cluster_state>(
            env, {
                     {"online", couchbase::diag::cluster_state::online},
                     {"degraded", couchbase::diag::cluster_state::degraded},
                     {"offline", couchbase::diag::cluster_state::offline},
                 }));

    exports.Set(
        "diag_endpoint_state",
        cbppEnumToJs<couchbase::diag::endpoint_state>(
            env,
            {
                {"disconnected", couchbase::diag::endpoint_state::disconnected},
                {"connecting", couchbase::diag::endpoint_state::connecting},
                {"connected", couchbase::diag::endpoint_state::connected},
                {"disconnecting",
                 couchbase::diag::endpoint_state::disconnecting},
            }));

    exports.Set("diag_ping_state",
                cbppEnumToJs<couchbase::diag::ping_state>(
                    env, {
                             {"ok", couchbase::diag::ping_state::ok},
                             {"timeout", couchbase::diag::ping_state::timeout},
                             {"error", couchbase::diag::ping_state::error},
                         }));

    exports.Set(
        "query_profile_mode",
        cbppEnumToJs<couchbase::query_profile_mode>(
            env, {
                     {"off", couchbase::query_profile_mode::off},
                     {"phases", couchbase::query_profile_mode::phases},
                     {"timings", couchbase::query_profile_mode::timings},
                 }));

    exports.Set("query_scan_consistency",
                cbppEnumToJs<couchbase::query_scan_consistency>(
                    env, {
                             {"not_bounded",
                              couchbase::query_scan_consistency::not_bounded},
                             {"request_plus",
                              couchbase::query_scan_consistency::request_plus},
                         }));

    exports.Set("search_highlight_style",
                cbppEnumToJs<couchbase::search_highlight_style>(
                    env, {
                             {"html", couchbase::search_highlight_style::html},
                             {"ansi", couchbase::search_highlight_style::ansi},
                         }));

    exports.Set("search_scan_consistency",
                cbppEnumToJs<couchbase::search_scan_consistency>(
                    env, {
                             {"not_bounded",
                              couchbase::search_scan_consistency::not_bounded},
                         }));

    exports.Set(
        "service_type",
        cbppEnumToJs<couchbase::service_type>(
            env, {
                     {"key_value", couchbase::service_type::key_value},
                     {"query", couchbase::service_type::query},
                     {"analytics", couchbase::service_type::analytics},
                     {"search", couchbase::service_type::search},
                     {"view", couchbase::service_type::view},
                     {"management", couchbase::service_type::management},
                     {"eventing", couchbase::service_type::eventing},
                 }));

    exports.Set("view_scan_consistency",
                cbppEnumToJs<couchbase::view_scan_consistency>(
                    env, {
                             {"not_bounded",
                              couchbase::view_scan_consistency::not_bounded},
                             {"update_after",
                              couchbase::view_scan_consistency::update_after},
                             {"request_plus",
                              couchbase::view_scan_consistency::request_plus},
                         }));

    exports.Set(
        "view_sort_order",
        cbppEnumToJs<couchbase::view_sort_order>(
            env, {
                     {"ascending", couchbase::view_sort_order::ascending},
                     {"descending", couchbase::view_sort_order::descending},
                 }));

    //#endregion Autogenerated Constants
}

} // namespace couchnode
