export class RoutingConstants {

    public static LOBS_URL = 'lobs';
    public static STATES_URL = 'states';
    public static CATEGORIES_URL = 'categories';
    public static JURISDICTIONS_URL = 'jurisdictions';
    public static REVENUE_CODE_URL = 'revenue-code';
    public static CLAIM_TYPES = 'claim-types-by-id';
    public static MODIFIERS_URL = 'modifiers';
    public static IDEAS_URL = 'ideas';
    public static IDEAS_BY_ASSIGNED_RETURNED_URL = 'ideasByAssignedReturned';
    public static ASSIGN_NEW_IDEA = "assignment-new-idea";
    public static ALL_RULES_URL = 'allRules';
    public static JOB_MANAGEMENT_URL = 'job-scheduler';

    // User Setup
    public static USERS_URL = 'users';
    public static USER_ACCESS_SETUP_URL = 'user-access-setup';
    public static USER_SETUP_CATEGORIES_RC= 'user-setup-categories-rc';
    public static USER_SETUP_CATEGORIES_RM= 'user-setup-categories-rm';
    public static ROLES_URL = 'roles';
    public static TEAMS_URL = 'teams';
    public static TEAMS_CI_JIRA_URL = 'teams/get-ci-jira-teams';
    public static ACTIVE_USERS_SUMMARY = 'summary';
    public static RULE_ENGINES_URL = 'rule-engines';
    public static FUNCTIONALITIES_URL = 'functionalities';
    public static ROLE_FUNCTIONALITIES_URL = 'role-functionalities';
    public static USER_SEARCH_BY_USERNAME = 'search-user-by-username';

    public static PROVISIONAL_RULES_FOR_PO_URL = 'provisional-rules-for-policy-owner';
    public static IDEA_ID_TOP_URL = 'idea-id-top';
    public static REASSIGN_URL = 'reAssign';
    public static RETURN_IDEA_URL = 'return-idea';
    public static REASSIGN_IMPACT_ANALYSIS_URL = 'reassign-impact-analysis';
    public static ASSIGN_RECORDS_URL = 'assign';
    public static NEW_IDEA_RESEARCH_URL = 'new-idea-research';
    public static NEW_IDEA_RESEARCH_SEARCH_URL = 'new-idea-research-search';
    public static PROVISIONAL_RULE_URL = 'provisional-rule';
    public static PROVISIONAL_RULE_SEQUENCE_URL = 'provisional-rule-sequence-id';
    public static PROVISIONAL_URL = 'provisional';
    public static MULTI_PROVISIONAL_RULES_URL = 'multi-provisional-rules';
    public static ECL_REFERENCES_URL = 'ecl-reference';
    public static REF_FILE_DOWNLOAD_FIRST_URL = 'ref-file-download-first';
    public static REF_FILE_DOWNLOAD_SECOND_URL = 'ref-file-download-second';
    public static REF_FILE_DOWNLOAD_THIRD_URL = 'ref-file-download-third';
    public static SAVE_AUTO_ASSIGNMENT_URL = 'auto-assign/save';
    public static AUTO_ASSIGN_USER_URL = 'auto-assign/user';
    public static GET_RULE_APPLICATION_URL = 'rules/applications';
    public static CREATE_JOB_URL = 'schedule-job';
    public static GET_ALL_JOBS_URL = 'get-all-jobs';
    public static GET_ALL_SCHEDULED_JOBS_URL = 'get-all-scheduled-jobs';
    public static RESCHEDULE_JOB_URL = 'reschedule-job';
    public static EXECUTE_JOB_URL = 'execute-job';
    public static DELETE_JOB_URL = 'delete-job';
    public static REF_SOURCES_URL = 'refSources';
    public static FILTERED = 'filtered';
    public static REFERENCE_SOURCE_URL = 'reference-source';
    public static GET_REF_INFO_URL = 'getRefInfo';
    public static REFERENCE_INFO_BY_REF_SOURCSE_URL = 'reference-info-by-ref-sources';
    public static REFERENCE_ATTACHMENT_DELETE_URL = 'reference-attachment-delete';
    public static ATTACHMENT_DELETE_URL = 'attachment-delete';
    public static RULES_URL = 'rules';
    public static RULE_DELTAS = 'get-deltas';
    public static DUPLICATE_CHECK_IDEAS_URL = 'dupcheckideas';
    public static REFERENCES_URL = 'references';
    public static LIBRARY_VIEW_URL = 'libraryView';
    public static VALIDATE_USER_URL = 'validate-user';
    public static LOGIN_URL = 'login';
    public static INITIATE_URL = 'initiate';
    public static FREQUENCIES_URL = 'frequencies';
    public static MY_TASK_URL = 'my-tasks';
    public static IDEAS_GENERATED_URL = 'ideas-generated';
    public static RULES_IMPLEMENTED_URL = 'rules-implemented';
    public static NEW_VERSION_RULES_URL = 'new-version-of-rules';
    public static RULE_REFERENCE_UPDATES_URL = 'ruleRefUpdates';
    public static PERMISSIONS_URL = 'permissions';
    public static RULE_INGESTION_URL = 'rule-ingestion';
    public static CPE_INGESTION_URL = 'cpe-ingestion';
    public static CVP_INGESTION = 'cvp-ingestion';
    public static PROCESS_CVP_INGESTION_FILE = 'process-cvpingestion-file';
    public static PROCESS_CPE_INGESTION_FILE = 'process-cpeingestion-file';
    public static RULE_VERSIONING_URL = 'rule-versioning';
    public static INGESTED_RULES = 'ingested-rules';
    public static INGESTED_RULES_MID_RULE = 'ingested-rules-mid-rule';
    public static USER_DASHBOARD_URL = 'usrdashboard';
    public static ROLE_WIDGETS_URL = 'rolewidgets';
    public static INTERESTS_URL = 'favorites';
    public static LOOKUPS_URL = 'lookups';
    public static ICMS_CATALOG_URL = 'icms-catalog';
    public static LOOKUPS_TYPE_AND_CODES_URL = 'type-and-code-list';
    public static LOOKUPS_TYPE_AND_DESCRIPTION = 'type-and-lookup-description';
    public static LOOKUPS_SEARCH_URL = 'search';
    public static LOOKUPS_SAVE_URL = 'save';
    public static LOOKUPS_UPDATE_URL = 'update';
    public static SAVE_IMPACT_RULE_APPROVAL_URL = 'ImpactRuleApproval';
    public static PARAMETERS_SETTINGS_URL = 'settings';
    public static REF_IMPACT_ANALYSIS_URL = 'refImpactAnalysis';
    public static TYPE_LINK_URL = 'type-like';
    public static NEW_RULES_IN_ECL_URL = 'new-rules-in-ecl'
    public static IMPACTED_URL = 'impacted';
    public static VIEW_IMPACTED_RULES = 'view-impacted-rules';
    public static RUN_DETAIL_URL = 'run-detail';
    public static BY_USERS_URL = 'by-users';
    public static SPECIALITY_TYPES_URL = 'specialityTypes';
    public static SUBSPECIALITY_TYPES_URL = 'subspecialityTypes';
    public static CLAIM_TYPE_URL = 'claimType';
    public static SAVE_RULE_APPROVAL_URL = 'ruleApprovalSave';
    public static SUBMIT_RULE_APPROVAL_URL = 'ruleApprovalSubmit';
    public static SUBMIT_RULE_AUDIT_URL = 'ruleSubmitAuditLogs';
    public static START_IDEA_URL = 'start-idea';
    public static VALID_APPROVAL_STATUS_URL = 'valid-app-status';
    public static STAGE_STATUS_ID_URL = 'stage-id';
    public static RULE_STAGE_STATUS = 'stage';
    public static TOP_REVENUE_RULES_URL = 'get-top-revenue-rules';
    public static WIDGETS_URL = 'widgets';
    public static MY_CONTRIBUTIONS_URL = 'my-contributions';
    public static IS_FAVORITE_RULE_URL = 'is-favorite-rule';
    public static IS_FAVORITE_IDEA_URL = 'is-favorite-idea';
    public static UPDATE_FAVORITE_RULE_URL = 'manage-favorite-rule';
    public static UPDATE_FAVORITE_IDEA_URL = 'manage-favorite-idea';
    public static MY_FAVORITES_URL = 'get-user-favorites';
    public static PARENT_RULE_URL = 'parentRule';
    public static RULES_CATALOGUE_URL = 'rules-catalogue';
    public static CATEGORY_NAME_URL = 'category-name';
    public static CATEGORY_STATUS_URL = 'category-status';
    public static RULES_CHILD_CATALOGUE_URL = 'ancestor-rules-catalogue';
    public static LIBRARY_VIEW_CATALOGUE_URL = 'library-view-search';
    public static RULE_HISTORY_URL = 'rule-history';
    public static RULE_ENGINE_URL = 'rule-engine';
    public static ICMS_TEMPLATE_URL = 'icms-template';
    public static ICMS_TYPE_TEMPLATE_URL = 'icms-type-template';
    public static CLIENT_INFO_URL = 'clientInfo';
    public static SAVE_ICMS_TEMPLATE_URL = 'save-icms-template';
    public static SAVE_CVP_TEMPLATE_URL = 'cvp-upload';
    public static FIND_ALL_CCAS_URL = 'find-all-ccas';
    public static SAVE_PO_TO_CCA_URL = 'save-po-to-cca-hierarchy';
    public static CVP_FILE_DOWNLOAD_URL = 'cvp-file-download';
    public static RPE_UPLOAD_URL = 'rpe-upload';
    public static RPE_FILE_DOWNLOAD_URL = 'rpe-file-download';
    public static LATEST_VERSION_URL = 'latest-version';
    public static SUBMIT_ICMS_TEMPLATE_URL = 'submit-icms-template';
    public static ICMS_RULES_BY_RULE_URL = 'icms-rules-by-rule';
    public static ASSIGNED_CCAS_URL = 'assigned-ccas';
    public static ASSIGNED_CCAS_TEAM_URL = 'assigned-ccas-team';
    public static ECL_HELP = 'ecl-help';
    public static DNB_HELP = 'dnb-help';
    public static OPP_VALUE_URL = 'oppvalue';
    public static RETURN_RULES_POLICY_OWNER_URL = 'return-rules-policy-owner';
    public static SAME_SIM_RETURN_RULES_POLICY_OWNER_URL = 'return-rules-cca';


    public static RETURN_RULES_URL = 'return-rules';
    public static GOOD_IDEA_URL = 'good-idea';
    public static REVIEWED_GOOD_IDEA_URL = 'status/reviewed';
    public static NOT_REVIEWED_GOOD_IDEA_URL = 'status/not-reviewed';
    public static SECURITY_ADMIN_URL = 'security-admin';
    public static EXTENDED_TIMEOUT_URL = 'extended-timeout';
    public static ENGINE_SAVINGS_REPORT_URL = 'engine-savings-report';
    public static CVP_SAVINGS_URL = "cpe-savings";
    public static IDEAS_RESEARCH_URL = 'ideas-research';
    public static RULES_RESEARCH_URL = 'rules-research';
    public static FILE_MANAGER_URL = 'file-manager';
    public static DOWNLOAD_FILE = 'download-file'
    public static EMAIL_CONFIGURATIONS_URL = 'email-configurations';
    public static EMAIL_CONFIGURATIONS_ALL_URL = 'get-all';
    public static INDUSTRY_UPDATE_URL = 'industry-update-history';
    public static INITIATE_INDUSTRY_UPDATE_URL = 'initiate-industry-update';
    public static CROSS_WALK_URL = "crosswalk";
    public static MID_RULE_VALIDTION = "validate-mid-rule";
    public static ALL_RULES_RESEARCH_URL = 'all-rules-research';
    public static ATTACHMENT_DOWNLOAD = 'attachment-download';
    public static GET_REFERENCES_BY_RULE = 'get-ref-by-rule';
    public static UPDATE_REFERENCE = 'update-reference';

    public static MWF_REPORT_URL = 'mwf-report';
    public static MWF_REPORT_UPDATE_INSTANCE_URL = 'update-instance-names';
    public static MWF_REPORT_CLIENTS_URL = 'clients';
    public static MWF_REPORT_PAYERS_URL = 'payers';

    public static MWF_REPORT_VIEW_RESULT_URL = 'view-result';

    public static MWF_GENERATE_REPORT_URL = 'generate-report';

    // User Directory
    public static ECL_USER_DIRECTORY = 'ecl-user-directory';
    public static ECL_USER_AUTHORITY_SETUP = 'ecl-user-authority-setup';
    public static ECL_USER_TEAM = 'teams';
    public static ECL_USER_GET_CATEGORY_USER_ROLE = 'get-category-user-role';
    public static ECL_USER_SAVE_TEAM = "save-user-categories-map";
    public static ECL_RM_REPORTING_TO_USER = 'reporting-to-user';

    //filter tag
    public static METADATA_FILTER = 'filter';
    public static METADATA = 'metadata';
    // Provisional Rule
    public static GET_POLICY_OWNER = 'get-policy-owners';

    // Same Simulation
    public static SAME_SIM = 'same-sim';
    public static SAME_SIM_INDUSTRY_UPDATES_PARAM_YES = '?all=Y';
    public static SAME_SIM_INDUSTRY_UPDATES_PARAM_NO = '?all=N';
    public static SAME_SIM_GET_CCA_IMPACT_RULES = 'cca-impact-rules';
    public static SAME_SIM_GET_APPROVAL_RULES = 'approval-rules';
    public static SAME_SIM_GET_FOR_MEDICAL_DIRECTOR_APPROVAL_RULES = 'for-medical-director-approval-rules';
    public static SAME_SIM_GET_MEDICAL_DIRECTOR_APPROVAL_RULES = 'medical-director-approval-rules';
    public static SAME_SIM_DETAIL = 'get-same-sim-detail';
    public static SAME_SIM_PROCESS_FILE = 'process-samesim-file';
    public static SAME_SIM_PROCESS_ICD_FILE = 'process-samesim-icd-file';
    public static ASSIGN_FOR_PEER_REVIEWER_APPROVAL = "assign-peer-reviewer-approval";
    public static REASSIGNMENT_IMPACT_ANALYSIS = 'reassignment-for-impact-analysis';
    public static REASSIGNMENT_RULES = 'reassign-rules';
    public static SAME_SIM_INTANCES_USER = 'get-instances';
    public static SAME_SIM_COUTNS = 'get-samesim-counts';

    public static IMPACT_ANALYSIS = 'impact-analysis';

    public static REASSIGNMENT_FOR_IMPACT_ANALYSIS = 'reassignment-for-impact-analysis';
    public static LIST_OF_RULES_IMPACT_ANALYSIS = 'list-of-rules-for-impact-analysis';
    public static IMPACTED_REASSIGNMENT_FOR_POLICY_OWNER = 'impacted-reassignment-for-policy-owner';
    public static IMPACTED_POLICY_OWNER_APPROVAL = 'impacted-policy-owner-approval';
    public static IMPACTED_ASSIGN_FOR_PEER_REVIEW = 'impacted-assign-for-pr-approval';
    public static IMPACTED_PEER_REVIEWER_APPROVAL = 'impacted-peer-reviewer-approval';
    public static PO_APPROVAL_RULE_MAINTENANCE = "rules/policy-owner-approval/";

    // PreImpat Analysis
    public static PRE_IMPACT_ANALYSIS = 'pre-impact-analysis';
    public static SEARCH = 'search';

    public static SAME_SIM_GET_RULES = 'impact-rules';
    public static SAME_SIM_MD_ASSIGN = 'md-assign';
    public static SAME_SIM_ASSIGNED_RULES_FOR_PO = 'assigned-rules-for-po';
    public static SAME_SIM_ASSIGNED_RULES_FOR_CCA = 'assigned-rules-for-cca';
    public static SAME_SIM_PROCESS_IMPACTED_RULES = 'process-impacted-rules';


    public static SAME_SIM_PROCESS_IMPACT_RULES = 'process-impacted-rules';
    public static SAME_SIM_GET_CODES_BY_RULE = 'codes-by-rule';
    public static SAME_SIM_PROCESS_MD_RULES = 'md-process-rules';
    public static PAGENUMBER = 'pageNumber=';
    public static ELEMENTSAMOUNT = 'elementsAmount=';
    public static DEPRECATED_ITEMS_COUNT = 'get-count-in-dates';
    public static DEPRECATED_ITEMS_LIST = 'get-rules-in-dates-and-status';
    public static REFERENCE_INFO = 'referenceInfo';
    public static AUDIT_URL = 'audit';
    public static HISTORY_LOGS = 'history-logs';

    public static RULES_CATALOG_URL = 'eclRuleCatalogue';
    public static CVP_INGESTION_TEMPLATE = 'cvp-ingestion';
    public static CPE_INGESTION_TEMPLATE = 'cpe-ingestion';
    public static SAVE_CVP_INGESTION_TEMPLATE = 'save-cvp-ingestion-template';
    public static SAVE_CPE_INGESTION_TEMPLATE = 'template';
    public static EXPORT_CVP_RULES_TEMPLATE = 'export-selected-data';
    public static EXPORT_CPE_RULES_TEMPLATE = 'export-selected-data';

    public static TEAM_USERS_RC = 'team-users-rc';
    public static TEAM_USERS_RM = 'team-users-rm';
    public static SAVE_USER_CATEGORIES_MAP= "save-user-categories-map";
    public static USER_TEAM_CATEGORY_ASSIGNMENTS = 'user-team-category-assignments';

    public static USER_TEAMS_URL = 'user-teams';
    public static TEAM_MEMBERS_URL = 'team-members';
    public static TEAM_COUNTERS_URL = 'teams-user-count-items';
    public static GET_TEAM_USER_ITEMS_DETAILS_URL = 'get-team-user-items-details';
    public static GET_TEAM_USER_ITEMS_DETAILS_COUNT_URL = 'get-team-user-items-details-count';

    public static RMR_URL = 'rmr';
    public static RMR_CREATE_PROJECT = 'create-prid';
    public static RMR_INDUSTRY_UPDATE_PROCESS = 'industry-update-process';

    public static LOAD_DATA_CVP_TEMPLATE = 'load-ui-data';
    public static LOAD_DATA_CPE_TEMPLATE = 'load-cpe-ui-data';
    public static PEER_REVIEWER_APPROVAL_URL = "peer-reviewer-approval";

    // ecl-1608 - Reference Data Acquisition Service methods/parameters
    public static FILE_INFO = 'file-info';
    public static FILE_LOG_INFO = 'fileLogInfo';
    public static FILE_TYPE_DETAILS = 'fileTypeDetails';
    public static FILE_TYPE = 'fileType';
    public static FILE_PERIOD = 'period';
    public static SVN_VERSION = 'svnRevision';
    public static FILE_DOWNLOAD = 'file-download';

    public static REASSIGNMENT_PO = 'reassignment-for-policy-owner';
    public static LIBRARY_REASSIGNMENT_PO = 'library';

    public static ELL_URL = 'ell';
    public static ELL_DECISION_URL = 'decision';
    public static ELL_POLICY = 'policy';
    public static ELL_PROJECT = 'project';
    public static ELL_TOPIC = 'topic';
    public static ELL_LIBRARY = 'library';
    public static ELL_MID_RULES = 'midrules';
    public static ELL_GET_TOPICS = 'get-all-topics-by-policy';
    public static ELL_LAST_RELEASE_KEY = 'last-release-key';
    public static ELL_GET_DECISIONS = 'get-all-decisions-by-topic';
    public static ELL_FILTERS = 'get-all-policies-by-filter';
    public static ELL_PAYER = 'payers';
    public static ELL_PAYER_CATALOG = 'catalog';
    public static ELL_ALL_PAYER = 'get-all-payers';
    public static ELL_SUB_RULELS_BY_PAYERS = 'sub-rules';
    public static ELL_FILTER_BY_KEYWORD = 'filter-by-keyword';
    public static ELL_CHANGE_RESOURCE = 'change-resource';
    public static ELL_CHANGE_TYPES ='change-types';
    public static ELL_CHANGE_LOGS = 'change-log-group-type';
    public static ELL_CHANGE_SOURCES ='change-sources';
    public static ELL_CPT_CODE = 'cpt-code';
    public static ELL_ICD_CODE = 'icd-code';
    public static ELL_STATUS_CODES =  'status-codes';
    public static ELL_TYPES =  'types';
    public static ELL_CATEGORIES =  'categories';
    public static ELL_REFERENCE =  'reference';
    public static ELL_SOURCES =  'sources';
    public static ELL_REASON_CODE = 'code';
    public static ELL_REVISED_CODE = 'revised';
    public static ELL_RULE_HEADERS = 'rule-headers';
    public static ELL_REASON = 'reason';
    public static ELL_WORK_STATUS = 'work-status';
    public static ELL_SUB_SPEC = 'sub-spec';
    public static ELL_REFERENCE_TITLE = 'ref-title';
    public static ELL_REQUEST_TYPE = 'request-type';
    public static ELL_MVIEW_LOG = 'mview-log';
    public static ELL_MAP_REASON = 'map';
    public static ELL_INSURANCE = 'insurance';
    public static ELL_POS = 'pos';
    public static ELL_GENDER = 'gender';

    public static PROC_CODES_URL = 'procedure-codes';
    public static PROC_CODES_VALIDATE = 'validate-codes';
    public static PROC_CODES_URL_DIAGNOSIS = 'diagnosis-codes';
    public static DELETE_RULE_CODE_URL = 'delete-rule-code';
    public static CLONE_RULE_CODE_URL = 'clone-rule-codes';

    public static WHITE_PAPER = 'white-papers';
    public static WHITE_PAPER_SAVE = 'save';
    public static WHITE_PAPER_UPDATE = 'update';
    public static WHITE_PAPER_LOAD = 'load';
    // Research Request
    public static RESEARCH_REQUEST_URL = '/research-requests';
    public static RESEARCH_REQUEST_CLIENTS_URL = '/clients';
    public static RESEARCH_REQUEST_CLIENT_URL = '/client';
    public static RESEARCH_REQUEST_SUPER_PAYERS_URL = '/super-payers';
    public static RESEARCH_REQUEST_PAYERS_URL = '/payers';
    public static RESEARCH_REQUEST_CLIENT_PROJECT_URL = '/client-projects';
    public static UNASSIGNED_LIST = '/unassigned-list';
    public static RR_BY_USER = '/by-user/';
    public static CLAIM_UNASSIGNED = '/claim-unassigned';
    public static RULE_SEARCH_LIST_URL = '/rule-search-list';
    public static RULE_RESPONSE_URL = '/rule-response';
    public static SEARCH_RESEARCH_REQUEST = 'search-research-request';
    public static RR_ASSIGNEE_TO = '/assignee-to';
    public static NAV_MY_RESEARCH_REQUEST_PAGE = '/my-research-request';
    public static RR_INITIATE_IMPACT_ANALYSIS = '/initiate-impact-analysis';
    public static RR_RULE_RESPONSE_INDICATOR = '/rule-response-indicator';
    public static RR_RULE_RR_CODE = '/rule-rr-code';
    public static RR_SAVE_COMMENTS = '/saveComments';
    public static RR_GET_COMMENTS = '/getComments';
    public static JIRA_REQUEST_URL = '/jira-request';
    public static JIRA_ISSUE = '/issue';
    public static SAVE_RESPONSE_INDICATOR_URL = '/save-response-indicator';
    public static RR_SEND_RULE_NOTIFICATION = '/send-rule-notification';
    public static RR_START_RESEARCH = '/start-research';
    public static RR_CLONE_RESEARCH = '/clone-rr'
    public static RR_ISSUE_LINK = '/issue-link'
    public static RR_AUDIT_DETAILS = '/rr-audit-details';
    public static CI_JIRA_LOGIN = '/ci-jira-login';
    public static PROJECT_REQUEST = '/project-requests';
    public static GET_PROJECT_REQUEST = '/pr-id';
    public static PROJECT_REQUEST_ISSUE = '/project-request-issue';


    // Crosswalk service
    public static CROSSWALK_URL = 'crosswalk';
    public static RR_RULES_URL = '/rules';
    public static RR_RULE_DETAILS_URL = '/rr-rule-details';
    public static RESEARCH_REQUEST_ATTACHMENTS = '/attachments';

    public static WHITE_PAPERS_SHARED_WHIT_ME = 'get-white-papers-by-users';
    public static WHITE_PAPERS_USERS_SHARED = 'get-users-by-shared-white-paper';
    public static WHITE_PAPERS_SHARE = 'share';
    public static WHITE_PAPER_SEARCH = 'search';

    public static MID_RULES_URL = 'mid-rules';
    public static MID_RULE_URL = 'mid-rule';
    public static MEDCAID_RECOMMEND_REPORT_RUL = 'medicaid-recomend-report';
    // CURE
    public static CURE_URL = 'cure';
    public static CURE_GET_MODULES = 'modules';
    public static CURE_MODULE = 'module';
    public static CURE_MODULE_VIEW_LIST = 'module-view-list';
    public static CURE_GET_QUERIES = 'queries';
    public static CURE_SAVE_QUERY = 'save-query';
    public static CURE_EXPORT_QUERY = 'export-query';

    // CACHE
    public static CACHE_URL = 'cache';
    public static CACHE_LIBRARY_VIEW_SEARCH = '/rule-code/query-condition/';
    public static RULE_URL = 'rule';
    public static RULE_DETAILS_URL = 'get-rule-details';
    public static RULE_CATALOG_SEARCH = 'rule-catalogue/query-condition/';

    //METADATA
    public static METADATA_URL = 'metadata';
    public static METADATA_GET_TAGS = 'tag';
    public static METADATA_GET_FILTER = 'filter';
    public static METADATA_GENERATE_REPORT = 'generate-report';
    public static METADATA_SEND_TAG_REPORT = 'email-report'
    public static METADATA_TAG = 'tag';
    public static METADATA_GET_FILTERS = 'filters';
    public static METADATA_SAVED_FILTERS = 'saved-filters';
    public static METADATA_TAG_DETAILS = 'tag-details';
    public static CACHE_ENV_URL = 'cache-url';
    public static METADATA_EXPIRY = 'expiry-date';
    public static METADATA_TAG_RULES = 'tag-rules';

    //CONVERGENCE POINT DOCUMENTATION
    public static LOAD_CONVERGENCE_POINT_MODULE = 'modules';
    public static LOAD_CONVERGENCE_POINT_SUBMODULE = 'submodules';
    public static LOAD_CONVERGENCE_POINT = 'module-instances';
    public static LOAD_SUBMODULES_CONVERGENCE_POINT = 'submodules';
    public static GET_MODULE_VERSION = 'get-module-version';
    public static CONVERGENCE_SECTIONS = 'sections';
    public static GET_TABS_BY_SECTION = 'get-tabs-by-section-option';
    public static MODULE_INSTANCE_USER = 'module-instances-user';
    public static EXPORT_TO_PDF = "export-pdf";
    public static WORKFLOW_CVP = 'workflow';
    public static SUBMIT_REVIEW_CVP = 'submit-for-review';
    public static CVP_TEMPLATES = 'cvp-templates';
    public static GET_FILE_BY_ID_KEYWORD = 'get-templates-file-keyword';
    public static GET_FILE_BY_KEYWORD = 'get-templates-keyword';
    public static APPROVE_CVP = 'approve';
    public static RETURN_CVP = 'return';
    public static LOCK_CVP = 'cvp-locks';
    public static LOCK_INSTANCES = 'lock-cvp-instances';
    public static ASSOCIATE_SUBMODULE = 'associate-submodule';
    public static CVP_RECOVER = 'recover';
    public static CVP_REVIEW_DELETION = 'submit-for-deletion-review';
    public static CVP_APPROVE_DELETION = 'approve-deletion';
    public static CVP_FILTERS = 'filtered';
    public static CVP_AUDIT_LOG = 'audit-log';
    public static CVP_AUDIT_LOG_FILTERS = 'log-filters';
    public static CVP_COMMENTS = 'comment';
    public static CVP_DELETE_COMMENTS = 'cvp-module-comment';

    //FILE-INBOX
    public static FILE_INBOX = 'file-inbox';
    public static CREATE_ASYNC_FILE = 'create-async-file';
    public static MARK_FOR_DELETION = 'mark-file-for-deletion';

    // REPO
    public static REPO_URL ='repo';
    public static REPO_TABLES ='tables';

    // WEB CRAWLING
    public static baseUrl = '/dnb/web-crawling';
    public static drugSearch = 'drug-search';
    public static geDrugByName = 'get-drug-by-drugname/';
    public static getDrugById = 'get-drug-by-id/';
    public static getAllDrugs = 'get-all-drugs';
    public static listDrugs = 'list-all-drugs';
    public static updateDrug = 'update-drug';
    public static addNewDrug = 'add-new-drug';
    public static deleteDrug = 'delete-drug/';
    public static deleteBiosimilar = 'delete-biosimilar/';
    public static addNewBiosimilar = 'add-new-biosimilar';
    public static updateBiosimilar = 'update-biosimilar';
    public static addAuditLog = 'add-audit-log';
    public static getAuditLogs = 'get-audit-logs';
    public static auditLogs = 'user-audit-logs';
    public static comparedResults = 'compare-results';
    public static getComparisonData = 'get-comparison-file';
    public static SAVE_RR_MAPPING = '/save-rr-mapping';
    public static SAVE_PROV_RR_MAPPING = '/save-prov-rr-mapping';

    public static METADATA_TAG_DETAILS_COMPARE = 'tag-details-compare';
    public static VALIDATE_PROC_CODES = 'validate-procedurecodes';

    public static FIND_ALL_CCAS_PO_URL = 'all-ccas-pos';
    public static FIND_ALL_PO_URL = 'all-pos';
    public static REASSIGN_RR = '/rr-reassign';
    public static REASSIGN_RR_LIST = '/reassign-list';
    //Notes Tab Constants
    public static RULE_NOTES_URL = 'rule-notes/';
    public static NOTES = 'notes/';
    public static COMMENTS = 'comment/';

    public static TEMPLATE_FILE_MANAGER_URL = 'template-file-manager';
    public static DOWNLOAD_TEMPLATE = 'download-codes-template-file';
    public static PDG_TEMPLATE = 'pdg-template';
    public static UPLOAD_PDG_FILES = 'upload-pdg-files';
    public static PDG_FILES = 'pdg-files';
    public static ALL_PDG_FILES = 'all-pdg-files';
    public static ICMS_REASON_CODES = 'icms-reason-codes';

    // Idea comments
    public static IDEA_COMMENTS = 'comments';
    public static PDG_DOWNLOAD_TEMPLATE = 'download';
    public static PDG_PREVIEW = 'preview';
    public static PDG_AUDIT_URL = 'pdg-audit-logs';
    public static PDG_REF_ATTACHMENT_DELETE = 'pdg-ref-attachment-delete';

    public static RVA_PDG_REPORT = 'rva-pdg-reports';
    public static RVA_GET_REPORT = 'get-reports';

    //Policy Package
    public static POLICY_PACKAGE = 'policy-package';

}
