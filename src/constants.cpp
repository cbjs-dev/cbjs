#include "constants.h"

#include "lcbx.h"
#include <libcouchbase/couchbase.h>

namespace couchnode
{

namespace constants
{

static inline void define_constant(Local<Object> target, const char *k, int n)
{
    Nan::DefineOwnProperty(
        target, Nan::New<String>(k).ToLocalChecked(), Nan::New<Number>(n),
        static_cast<v8::PropertyAttribute>(v8::ReadOnly | v8::DontDelete));
}

NAN_MODULE_INIT(Init)
{
#define X(n) define_constant(target, #n, n);
    X(LCB_CNTL_SET)
    X(LCB_CNTL_GET)
    X(LCB_CNTL_OP_TIMEOUT)
    X(LCB_CNTL_DURABILITY_INTERVAL)
    X(LCB_CNTL_DURABILITY_TIMEOUT)
    X(LCB_CNTL_HTTP_TIMEOUT)
    X(LCB_CNTL_QUERY_TIMEOUT)
    X(LCB_CNTL_VIEW_TIMEOUT)
    X(LCB_CNTL_CONFIGURATION_TIMEOUT)
    X(LCB_CNTL_VBMAP)
    X(LCB_CNTL_CONFIG_HTTP_NODES)
    X(LCB_CNTL_CONFIG_CCCP_NODES)
    X(LCB_CNTL_CHANGESET)
    X(LCB_CNTL_CONFIGCACHE)
    X(LCB_CNTL_SSL_MODE)
    X(LCB_CNTL_SSL_CACERT)
    X(LCB_CNTL_RETRYMODE)
    X(LCB_CNTL_HTCONFIG_URLTYPE)
    X(LCB_CNTL_COMPRESSION_OPTS)
    X(LCB_CNTL_RDBALLOCFACTORY)
    X(LCB_CNTL_SYNCDESTROY)
    X(LCB_CNTL_CONLOGGER_LEVEL)
    X(LCB_CNTL_DETAILED_ERRCODES)
    X(LCB_CNTL_REINIT_CONNSTR)
    X(LCB_CNTL_CONFDELAY_THRESH)
    X(LCB_CNTL_CONFIG_NODE_TIMEOUT)

    X(LCB_STORE_UPSERT)
    X(LCB_STORE_REPLACE)
    X(LCB_STORE_INSERT)
    X(LCB_STORE_APPEND)
    X(LCB_STORE_PREPEND)

    X(LCB_SUCCESS)
    X(LCB_ERR_GENERIC)
    X(LCB_ERR_TIMEOUT)
    X(LCB_ERR_REQUEST_CANCELED)
    X(LCB_ERR_INVALID_ARGUMENT)
    X(LCB_ERR_SERVICE_NOT_AVAILABLE)
    X(LCB_ERR_INTERNAL_SERVER_FAILURE)
    X(LCB_ERR_AUTHENTICATION_FAILURE)
    X(LCB_ERR_TEMPORARY_FAILURE)
    X(LCB_ERR_PARSING_FAILURE)
    X(LCB_ERR_CAS_MISMATCH)
    X(LCB_ERR_BUCKET_NOT_FOUND)
    X(LCB_ERR_COLLECTION_NOT_FOUND)
    X(LCB_ERR_ENCODING_FAILURE)
    X(LCB_ERR_DECODING_FAILURE)
    X(LCB_ERR_UNSUPPORTED_OPERATION)
    X(LCB_ERR_AMBIGUOUS_TIMEOUT)
    X(LCB_ERR_UNAMBIGUOUS_TIMEOUT)
    X(LCB_ERR_SCOPE_NOT_FOUND)
    X(LCB_ERR_INDEX_NOT_FOUND)
    X(LCB_ERR_INDEX_EXISTS)
    X(LCB_ERR_DOCUMENT_NOT_FOUND)
    X(LCB_ERR_DOCUMENT_UNRETRIEVABLE)
    X(LCB_ERR_DOCUMENT_LOCKED)
    X(LCB_ERR_VALUE_TOO_LARGE)
    X(LCB_ERR_DOCUMENT_EXISTS)
    X(LCB_ERR_VALUE_NOT_JSON)
    X(LCB_ERR_DURABILITY_LEVEL_NOT_AVAILABLE)
    X(LCB_ERR_DURABILITY_IMPOSSIBLE)
    X(LCB_ERR_DURABILITY_AMBIGUOUS)
    X(LCB_ERR_DURABLE_WRITE_IN_PROGRESS)
    X(LCB_ERR_DURABLE_WRITE_RE_COMMIT_IN_PROGRESS)
    X(LCB_ERR_MUTATION_LOST)
    X(LCB_ERR_SUBDOC_PATH_NOT_FOUND)
    X(LCB_ERR_SUBDOC_PATH_MISMATCH)
    X(LCB_ERR_SUBDOC_PATH_INVALID)
    X(LCB_ERR_SUBDOC_PATH_TOO_BIG)
    X(LCB_ERR_SUBDOC_PATH_TOO_DEEP)
    X(LCB_ERR_SUBDOC_VALUE_TOO_DEEP)
    X(LCB_ERR_SUBDOC_VALUE_INVALID)
    X(LCB_ERR_SUBDOC_DOCUMENT_NOT_JSON)
    X(LCB_ERR_SUBDOC_NUMBER_TOO_BIG)
    X(LCB_ERR_SUBDOC_DELTA_INVALID)
    X(LCB_ERR_SUBDOC_PATH_EXISTS)
    X(LCB_ERR_SUBDOC_XATTR_UNKNOWN_MACRO)
    X(LCB_ERR_SUBDOC_XATTR_INVALID_FLAG_COMBO)
    X(LCB_ERR_SUBDOC_XATTR_INVALID_KEY_COMBO)
    X(LCB_ERR_SUBDOC_XATTR_UNKNOWN_VIRTUAL_ATTRIBUTE)
    X(LCB_ERR_SUBDOC_XATTR_CANNOT_MODIFY_VIRTUAL_ATTRIBUTE)
    X(LCB_ERR_SUBDOC_XATTR_INVALID_ORDER)
    X(LCB_ERR_PLANNING_FAILURE)
    X(LCB_ERR_INDEX_FAILURE)
    X(LCB_ERR_PREPARED_STATEMENT_FAILURE)
    X(LCB_ERR_COMPILATION_FAILED)
    X(LCB_ERR_JOB_QUEUE_FULL)
    X(LCB_ERR_DATASET_NOT_FOUND)
    X(LCB_ERR_DATAVERSE_NOT_FOUND)
    X(LCB_ERR_DATASET_EXISTS)
    X(LCB_ERR_DATAVERSE_EXISTS)
    X(LCB_ERR_ANALYTICS_LINK_NOT_FOUND)
    X(LCB_ERR_VIEW_NOT_FOUND)
    X(LCB_ERR_DESIGN_DOCUMENT_NOT_FOUND)
    X(LCB_ERR_COLLECTION_ALREADY_EXISTS)
    X(LCB_ERR_SCOPE_EXISTS)
    X(LCB_ERR_USER_NOT_FOUND)
    X(LCB_ERR_GROUP_NOT_FOUND)
    X(LCB_ERR_BUCKET_ALREADY_EXISTS)
    X(LCB_ERR_SSL_INVALID_CIPHERSUITES)
    X(LCB_ERR_SSL_NO_CIPHERS)
    X(LCB_ERR_SSL_ERROR)
    X(LCB_ERR_SSL_CANTVERIFY)
    X(LCB_ERR_FD_LIMIT_REACHED)
    X(LCB_ERR_NODE_UNREACHABLE)
    X(LCB_ERR_CONTROL_UNKNOWN_CODE)
    X(LCB_ERR_CONTROL_UNSUPPORTED_MODE)
    X(LCB_ERR_CONTROL_INVALID_ARGUMENT)
    X(LCB_ERR_DUPLICATE_COMMANDS)
    X(LCB_ERR_NO_MATCHING_SERVER)
    X(LCB_ERR_PLUGIN_VERSION_MISMATCH)
    X(LCB_ERR_INVALID_HOST_FORMAT)
    X(LCB_ERR_INVALID_CHAR)
    X(LCB_ERR_BAD_ENVIRONMENT)
    X(LCB_ERR_NO_MEMORY)
    X(LCB_ERR_NO_CONFIGURATION)
    X(LCB_ERR_DLOPEN_FAILED)
    X(LCB_ERR_DLSYM_FAILED)
    X(LCB_ERR_CONFIG_CACHE_INVALID)
    X(LCB_ERR_COLLECTION_MANIFEST_IS_AHEAD)
    X(LCB_ERR_COLLECTION_NO_MANIFEST)
    X(LCB_ERR_COLLECTION_CANNOT_APPLY_MANIFEST)
    X(LCB_ERR_AUTH_CONTINUE)
    X(LCB_ERR_CONNECTION_REFUSED)
    X(LCB_ERR_SOCKET_SHUTDOWN)
    X(LCB_ERR_CONNECTION_RESET)
    X(LCB_ERR_CANNOT_GET_PORT)
    X(LCB_ERR_INCOMPLETE_PACKET)
    X(LCB_ERR_SDK_FEATURE_UNAVAILABLE)
    X(LCB_ERR_OPTIONS_CONFLICT)
    X(LCB_ERR_KVENGINE_INVALID_PACKET)
    X(LCB_ERR_DURABILITY_TOO_MANY)
    X(LCB_ERR_SHEDULE_FAILURE)
    X(LCB_ERR_DURABILITY_NO_MUTATION_TOKENS)
    X(LCB_ERR_SASLMECH_UNAVAILABLE)
    X(LCB_ERR_TOO_MANY_REDIRECTS)
    X(LCB_ERR_MAP_CHANGED)
    X(LCB_ERR_NOT_MY_VBUCKET)
    X(LCB_ERR_UNKNOWN_SUBDOC_COMMAND)
    X(LCB_ERR_KVENGINE_UNKNOWN_ERROR)
    X(LCB_ERR_NAMESERVER)
    X(LCB_ERR_INVALID_RANGE)
    X(LCB_ERR_NOT_STORED)
    X(LCB_ERR_BUSY)
    X(LCB_ERR_SDK_INTERNAL)
    X(LCB_ERR_INVALID_DELTA)
    X(LCB_ERR_NO_COMMANDS)
    X(LCB_ERR_NETWORK)
    X(LCB_ERR_UNKNOWN_HOST)
    X(LCB_ERR_PROTOCOL_ERROR)
    X(LCB_ERR_CONNECT_ERROR)
    X(LCB_ERR_EMPTY_KEY)
    X(LCB_ERR_HTTP)
    X(LCB_ERR_QUERY)
    X(LCB_ERR_TOPOLOGY_CHANGE)

    X(LCB_LOG_TRACE)
    X(LCB_LOG_DEBUG)
    X(LCB_LOG_INFO)
    X(LCB_LOG_WARN)
    X(LCB_LOG_ERROR)
    X(LCB_LOG_FATAL)

    X(LCB_HTTP_TYPE_VIEW)
    X(LCB_HTTP_TYPE_MANAGEMENT)
    X(LCB_HTTP_TYPE_RAW)
    X(LCB_HTTP_TYPE_QUERY)
    X(LCB_HTTP_TYPE_SEARCH)
    X(LCB_HTTP_TYPE_ANALYTICS)
    X(LCB_HTTP_METHOD_GET)
    X(LCB_HTTP_METHOD_POST)
    X(LCB_HTTP_METHOD_PUT)
    X(LCB_HTTP_METHOD_DELETE)

    X(LCB_STORE_UPSERT)
    X(LCB_STORE_INSERT)
    X(LCB_STORE_REPLACE)
    X(LCB_STORE_APPEND)
    X(LCB_STORE_PREPEND)

    X(LCBX_SDCMD_GET)
    X(LCBX_SDCMD_EXISTS)
    X(LCBX_SDCMD_REPLACE)
    X(LCBX_SDCMD_DICT_ADD)
    X(LCBX_SDCMD_DICT_UPSERT)
    X(LCBX_SDCMD_ARRAY_ADD_FIRST)
    X(LCBX_SDCMD_ARRAY_ADD_LAST)
    X(LCBX_SDCMD_ARRAY_ADD_UNIQUE)
    X(LCBX_SDCMD_ARRAY_INSERT)
    X(LCBX_SDCMD_REMOVE)
    X(LCBX_SDCMD_COUNTER)
    X(LCBX_SDCMD_GET_COUNT)

    X(LCB_REPLICA_MODE_ANY)
    X(LCB_REPLICA_MODE_ALL)
    X(LCB_REPLICA_MODE_IDX0)
    X(LCB_REPLICA_MODE_IDX1)
    X(LCB_REPLICA_MODE_IDX2)

    X(LCB_DURABILITYLEVEL_NONE)
    X(LCB_DURABILITYLEVEL_MAJORITY)
    X(LCB_DURABILITYLEVEL_MAJORITY_AND_PERSIST_TO_ACTIVE)
    X(LCB_DURABILITYLEVEL_PERSIST_TO_MAJORITY)

    X(LCBX_SDFLAG_UPSERT_DOC)
    X(LCBX_SDFLAG_INSERT_DOC)
    X(LCBX_SDFLAG_ACCESS_DELETED)

    X(LCB_SUBDOCSPECS_F_MKINTERMEDIATES)
    X(LCB_SUBDOCSPECS_F_XATTRPATH)
    X(LCB_SUBDOCSPECS_F_XATTR_MACROVALUES)
    X(LCB_SUBDOCSPECS_F_XATTR_DELETED_OK)

    X(LCB_RESP_F_FINAL)
    X(LCB_RESP_F_CLIENTGEN)
    X(LCB_RESP_F_NMVGEN)
    X(LCB_RESP_F_EXTDATA)
    X(LCB_RESP_F_SDSINGLE)
    X(LCB_RESP_F_ERRINFO)

    X(LCBX_SERVICETYPE_KEYVALUE)
    X(LCBX_SERVICETYPE_MANAGEMENT)
    X(LCBX_SERVICETYPE_VIEWS)
    X(LCBX_SERVICETYPE_QUERY)
    X(LCBX_SERVICETYPE_SEARCH)
    X(LCBX_SERVICETYPE_ANALYTICS)

    X(LCBX_VIEWFLAG_INCLUDEDOCS)

    X(LCBX_QUERYFLAG_PREPCACHE)

    X(LCBX_ANALYTICSFLAG_PRIORITY)

    X(LCB_TYPE_BUCKET)
    X(LCB_TYPE_CLUSTER)

    X(LCB_LOG_TRACE)
    X(LCB_LOG_DEBUG)
    X(LCB_LOG_INFO)
    X(LCB_LOG_WARN)
    X(LCB_LOG_ERROR)
    X(LCB_LOG_FATAL)

    X(LCBX_RESP_F_NONFINAL)

#undef X
}

} // namespace constants

} // namespace couchnode
