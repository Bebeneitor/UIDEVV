export class Constants {

  /***Year range requirement from customer is from 1700 to 9999***/
  public static MIN_VALID_DATE = new Date(1700, 0, 1);
  public static SUB_RULE_DOS_FROM_DATE = new Date(1752, 12, 1);

  public static MIN_VALID_YEAR = 1700;
  public static MAX_VALID_YEAR = 9999;
  public static DATE_FORMAT = 'mm/dd/yyyy';
  public static DATE_FORMAT_IN_ECL_TABLE = 'MM/dd/yyyy';

  public static CODES_DEF_DATE_FROM = '01/01/1753';
  public static CODES_DEF_DATE_TO = '12/31/9999';

  public static EFT_MIN_VALID_YEAR = 1950;
  public static EFT_MAX_VALID_YEAR = 2100;


  public static PR_CODE_MIN_VALID_YEAR = 1753;
  public static PR_CODE_MAX_VALID_YEAR = 9999;



  public static AVAILABLE_COLORS = ['#31006F', '#333333', '#9579D3', '#E9008B'];

  public static SHELVED_VALUE = 6;
  public static PR_APPROVAL_VALUE = 7;
  public static LIBRARY_RULE_VALUE = 9;
  public static RULE_ENGINEID_ICMS =2;
  public static PROVISIONAL_RULE_VALUE = 5;
  public static NEED_MORE_INFO_VALUE = 12;
  public static RULE_IMPACTED_VALUE = 15;
  public static RULE_NEED_MORE_INFO_VALUE = 61;
  public static USERS_POLICY_OWNER_ROLE = 11;
  public static STATUS_ACTIVE = 1;
  public static STATUS_INACTIVE = 2;
  public static STATUS_CODE_ACTIVE = 'A';
  public static STATUS_CODE_INACTIVE = 'I';
  public static ECL_IDEA_STAGE = 1;
  public static ECL_PROVISIONAL_STAGE = 2;
  public static ECL_LIBRARY_STAGE = 3;
  public static RESEARCH_REQUEST_STAGE = 4;
  public static LR_IMPACT_MEDIACL_RETURNED = 'Reassignment Needed';
  public static CUSTOM_RULE = 'Custom';
  public static LR_EDITORIAL = 'Editorial';
  public static LR_LOGICAL = 'Logical';
  public static LR_EDITORIAL_STATUS = 'Existing Version Pending Approval';
  public static LR_LOGICAL_STATUS = 'New Version Pending Approval';
  public static SPECIAL_CHAR = /[!@#$%^&*()_+\=\[\]{};':"\\|<>\/?]/;
  public static DASH_CHAR = '-';
  public static EXISTING_IDEA = 2;
  public static INVALID_IDEA = 2;
  public static NULL_IDEA = 0;
  public static SKIP_ASSIGNMENT_CODE_ACTIVE = 'Y';
  public static SKIP_ASSIGNMENT_CODE_INACTIVE = 'N';
  public static SHELVED_CODE = 'RJ';
  public static NEED_MORE_INFO_CODE = 'RN';
  public static MD_APPROVAL_CODE = 'MN';
  public static PROV_DRAFT_STATUS_CODE = 'D';
  public static MEDICARE = 2;
  public static MEDICAID = 1;
  public static PROVISIONAL_RULE_CREATION = 'Provisional Rule Creation';
  public static LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
    'v', 'w', 'x', 'y', 'z'];
  public static HTTP_NAME = 'https://';
  public static JIRA_URL = 'https://jira2.cotiviti.com/secure/Dashboard.jspa';
  public static REF_URL_FILE = 1;
  public static REF_DOC_FILE1 = 2;
  public static REF_DOC_FILE2 = 3;

  public static ICMS_NAME_VALUE = 'ICMS';
  public static ECL_NAME_VALUE = 'ECL';
  public static CVP_NAME_VALUE = 'CVP';
  public static CPE_NAME_VALUE = 'CPE';
  public static CVP_ECL_STAGE_VALUE = 6;
  public static CPE_ECL_STAGE_VALUE = 7;
  public static WC_BILLED_WITHOUT = 'billed without';
  public static WC_BILLEDWITHOUT = 'billedwithout';
  public static WC_BILLED_WITH = 'billed with';
  public static WC_BILLEDWITH = 'billedwith';
  public static WC_AND = 'and';
  public static WC_OR = 'or';

  public static ICD_CODES_CATEGORY_LIST = ['BLW_OR', 'BLW_AND', 'BLWO_OR', 'BLWO_AND'];
  public static HCPCS_CODES_CATEGORY_LIST = ['DNY', 'BLW_OR', 'BLW_AND', 'BLWO_OR', 'BLWO_AND', 'INC', 'PND'];
  public static RESERVED_WORDS = ['billed without', 'billedwithout', 'billed with', 'billedwith', 'and', 'or'];
  public static ERROR_SEARCHING_WITH_WC_START_END = 'Reserved words "\ replaceWord "\ must have a previous search criteria. Please type a search criteria before and after them.';
  public static CCA_ROLE = 'CCA';
  public static MD_ROLE = 'MD';
  public static PO_ROLE = 'PO';
  public static MD_CLAIM_ROLE = 'MD-CLAIM';
  public static DEFAULT_ROLE = 'Default';
  public static ICMS_RMR_CHANGE_TITLE = 'ICMS Change RMR';
  public static DRUGS_BIOLOGICALS_APPROVER = 'DNBA';
  public static DRUGS_BIOLOGICALS_EDITOR = 'DNBE';
  public static DRUGS_BIOLOGICALS_ADMIN = 'DNBADMIN';
  public static DRUGS_BIOLOGICALS_VIEWER = 'DNBVIEWER';

  public static TOAST_SEVERITY_SUCCESS = 'success';
  public static TOAST_SEVERITY_INFO = 'info';
  public static TOAST_SEVERITY_WARN = 'warn';
  public static TOAST_SEVERITY_ERROR = 'error';
  public static TOAST_SUMMARY_WARN = 'Warning';
  public static TOAST_SUMMARY_INFO = 'Information';
  public static TOAST_SUMMARY_SUCCESS = 'Success';
  public static TOAST_SUMMARY_ERROR = 'Error';
  public static TOAST_SUMMARY_DOWNLOAD = 'File downloaded';
  public static TOAST_DEFAULT_LIFE_TIME = 4000;
  public static TOAST_CLOSABLE = true;
  public static TOAST_NOT_CLOSABLE = false;
  public static RETURN_PARAMETER_EVALUATION = 'return';

  public static RMR_TEMPLATE_IS_SUBMITTED = '1';
  public static RMR_TEMPLATE_IS_NOT_SUBMITTED = '0';
  public static DUPLICATE_CHECKING_REQUIRED = 4;
  public static RMR_CHANGE_TYPE = 'RMR_CHANGE';
  public static RMR_TEMP_TYPE = 'RMR_TMP';
  public static SAME_SIM_UPDATE_TYPE = 'SAME_SIM_UPDATE_TYPE';
  public static SAME_SIM_ICD_UPDATE_TYPE = 'SAME_SIM_ICD_UPDATE_TYPE';
  public static SAME_SIM_CPT_TEMPLATE = 'SameSimTemplate.xlsx';
  public static SAME_SIM_ICD_TEMPLATE = 'SameSimIcdTemplate.xlsx';

  public static EDITORIAL_APPROVED = "Editorial-Approved";
  public static EDITORIAL_SUBMIT_APPROVAL = 'Editorial-Submit for Approval';
  public static LOGICAL_SUBMIT_APPROVAL = 'Logical-Submit for Approval';
  public static RETIRE_SUBMIT_APPROVAL = 'Retire-Submit for Approval';

  public static APPROVED = 'Approved';
  public static SUBMIT_FOR_APPROVAL = 'Submit for Approval';
  public static NOT_APPROVED = 'Not Approved';

  public static INDUSTRY_UPDATE_ANALYSIS_INITIATED = 'EIUAI';
  public static RETURN_TO_RESEARCH_ANALYSIS = 'RNR';
  public static NEW_VERSION_PENDING_CODE = 'PSN';
  public static EXISTING_VERSION_PENDING_SUBMITION = 'PSE';
  public static APPROVED_CODE = 'A';
  public static APPROVED_PENDING_SUBMITION = 'APS';
  public static MEDICAL_DIRECTOR_APPROVAL_NEEDED_CODE = 'RNM';
  public static PO_RETURN_RESEARCH_ANALYST_CODE = 'RLRBPO';
  public static STAGE_MD_CLAIM = 3;
  public static SAMESIM_FLOW = 'SameSim';
  public static SAMESIM_IMPACT_TYPE = 'SAMESIM_LOGICAL';
  public static SAMESIM_NAV_REASSIGNMENT_CCA = 'reassignment-cca';
  public static SAME_SIM_NAV_INITIATE_ANALYSIS = 'initiate-analysis';
  public static SAME_SIM_NAV_POLICY_OWNER_APPROVAL = 'policy-owner-approval';
  public static SAME_SIM_NAV_FOR_MEDICAL_DIRECTOR_APPROVAL = 'for-medical-director-approval';
  public static SAME_SIM_NAV_MEDICAL_DIRECTOR_APPROVAL = 'medical-director-approval';
  public static SAME_SIM_NAV_REASSIGNMENT_PO = 'reassignment-po';
  public static SAME_SIM_NAV_CODES = 'codes';

  public static ASSIGNED_TAB = "assigned";
  public static RETURNED_TAB = "returned";
  public static ICMS_INGESTION_TAB = "ICMS";
  public static CVP_INGESTION_TAB = "CVP";
  public static CPE_INGESTION_TAB = "CPE";

  //Reassignment Comments lookuptype
  public static RULE_REASSIGN_WORKFLOW_COMMENT = 'REASSIGN_WORKFLOW_COMMENT';

  //CCA
  public static RETURN_TO_RESEARCH_ANALYST = 'RNR';

  //PO
  public static PO_APPROVAL_PENDING_SUBMISSION_CODE = 'POAPS';
  public static NEW_VERION_PENDING_APPROVAL = 'NPA';
  public static PO_MD_APPROVAL_PENDING_SUBMISSION = 'POMDPS';
  public static PO_RETURN_TO_RA_PENDING_SUBMISSION = 'PORAPS';


  // MD
  public static MD_APPROVAL_PENDING_SUBMISSION = 'MDAPS';
  public static MD_RETURN_TO_RA_PENDING_SUBMISSION = 'MDRAPS';
  public static RETURN_TO_MEDICAL_DIRECTOR = 'RLRBMD';

  public static MANUAL_REF_SOURCE = 'MANUAL ENTRY';


  // Process Actions
  public static SUBMIT_ACTION = 'submit';
  public static SAVE_ACTION = 'save';

  // Error Messages
  public static NO_SELECTED_STATUS_ERROR_FOR_RULE = 'Select Approval Status for rule ';
  public static EMPTY_COMMENTS_ERROR_FOR_RULE = 'Please provide comments about the reason this rule is returned to the CCA for ';
  public static EMPTY_COMMENTS_ERROR_FOR_APPROVED_RULE = 'Please provide comments about the reason this rule is approved for ';
  public static APPROVAL_STATUS_MANDATORY = "Approval Status is mandatory field for ";
  public static COMMENTS_MANDATORY = "Comments is a mandatory field for ";
  public static APPROVAL_AND_COMMENTS_MANDATORY = "Approval Status and Comments are mandatory fields for "
  public static NOT_SELECTED_RULES_ERROR = 'No rules selected, please select at least one rule to continue.';
  public static EMPTY_COMMENTS_AND_NO_SELECTED_STATUS_ERROR = 'Please provide Approval Status and Comments for rule ';
  public static EMPTY_FILE_SELECTED = 'File is empty, the processed file must contain at least one code.';
  public static INVALID_FILE_SELECTED = 'File with invalid format, please select the correct one.';
  public static INVALID_LAST_PRIMARY_ERROR = 'To proceed with deletion please select latest version of Primary Requirement.';
  public static INVALID_LAST_SECTION_ERROR = 'Section associated to a previous version of a Primary Requirement cannot be deleted. If required please select the latest version of the Primary Requirement and proceed with deletion.';
  public static INVALID_LAST_ATTACHMENT_ERROR = 'Attachment assigned to a previous version of a Primary requirement cannot be deleted. If required please select the latest version of  the Primary Requirement and proceed with deletion.';
  public static INVALID_ATTACHMENT_CLONING_ERROR = 'Attachment assigned to a Primary requirement In Deletion or Deletion in Review status, cannot be cloned.';
  public static INVALID_PRIMARY_CLONING_ERROR = 'Primary requirement In Deletion or Deletion in Review status, cannot be cloned.';
  public static INVALID_ARGUMENTS_ONLY_NUMERIC = 'Please enter valid arguments, only numeric values are allowed.';

  //Question Messages
  public static ARE_YOU_SURE_THAT_DO_YOU_WANT_EXIT_DIALOG = 'Are you sure, you want to exit the dialog?';
  public static ALL_UNSAVED_CHANGES_WILL_LOST_DO_YOU_WANT_EXIT = 'All unsaved changes will lost. Are you sure that you want to Exit?';
  public static ARE_YOU_WANT_TO_REMOVE_CODE = 'Are you sure you want to remove this code?';
  public static ARE_YOU_WANT_TO_REMOVE_REFERENCE = 'Are you sure you want to remove this Reference?';
  public static ARE_YOU_WANT_TO_REMOVE_CODES = 'Are you sure you want to remove these codes?';

  // Claim types static values to select the radio buttons in claims component
  public static CLAIM_PROFESSIONAL_TYPE = 'professional';
  public static CLAIM_FACILITY_TYPE = 'facility';
  public static CLAIM_REVENUE_CODES_TYPE = 'revenue';
  public static CLAIM_PROFESSIONAL_VALUE = 1;

  //Sucessfully messages
  public static CPT_REMOVED_SUCCESSFULLY = 'Rule procedure codes were removed successfully.';
  public static ICD_REMOVED_SUCCESSFULLY = 'Diagnosis rule codes were removed successfully.'
  public static DUP_RECORD_SUCCESS = 'Codes validated successfully, however same data already exist';
  public static DUP_RECORD_FAIL = 'Same data already exist';
  public static DUP_RECORD_TAG = 'DUP_RECORD';
  public static ATTRIBUTE_UPDATED = 'Attribute updated.';
  public static TABLE_ACTIVATED = 'Table activated.';
  public static TABLE_DEACTIVATED = 'Table deactivated.';
  public static TABLES_UPDATED = 'Tables updated.';

  public static CCA_RETURNED = 'CCA-RETURNED';
  public static RETURNED_FROM_CCA = 'returnedFromCCA';

  public static RULES_CATALOG_PARAMETER_VIEW_LAST_REQUEST = 'last-request'
  public static CONFIRM_DELETION = 'Confirm Deletion';

  //Store Key
  public static USER_SESSION_KEY = 'userSession';
  public static PARENT_NAVIGATION = 'PARENT_NAVIGATION';
  public static PARENT_NAVIGATION_RULE_CATALOGUE = 'PARENT_NAVIGATION_RULES_CATALOGUE';

  // Change Status
  public static STATUS_CODE_RETIRE = 2;

  // Ecl-table ev constants.
  public static ECL_TABLE_START_SERVICE_CALL = 'eclTableStartServiceCall';
  public static ECL_TABLE_END_SERVICE_CALL = 'eclTableEndServiceCall';

  public static HTTP_OK = 200;
  public static CATEGORY = 'category';
  public static FUNCTION_TYPE_RM = 'RM';
  public static FUNCTION_TYPE_RC = 'RC';
  public static RETIRE_RULE_PENDING_SUBMISSION = 'Retire Pending Submission';

  public static CHANGE_STATUS_NO_CHANGE = 'No Change';
  public static CHANGE_STATUS_CHANGE = 'Change';
  public static CHANGE_STATUS_RETIRE = 'Retire';

  public static CHANGE_STATUS_NO_CHANGE_VALUE = 0;
  public static CHANGE_STATUS_CHANGE_VALUE = 1;
  public static CHANGE_STATUS_RETIRE_VALUE = 2;

  public static WINDOW_TARGET_BLANK = '_blank';
  public static WINDOW_DEFAULT_FEATURES = 'location=yes,height=600,width=765,scrollbars=yes,status=yes';

  public static LOOKUP_TYPE_PROC_CODE_OPTION = 'PROC_CODES_OPTION';
  public static LOOKUP_TYPE_CLAIM_PLACE_OF_SERVICE = 'CLAIM_PLACE_OF_SERVICE';
  public static LIBRARY = "library";
  public static LIBRARY_VIEW = 'Library View';
  public static LIBRARY_RULE_DETAILS = 'Library Rule Details';

  public static INDUSTRY_UPDATES_CODES_URL = `${window.location.origin}/ecl/#/industry-updates/rule-process/codes`;
  public static PO_MD_RETIRE_APPROVAL_PENDING_SUBMISSION = 'PO MD Retire Approval Pending Submission';
  public static PO_RETIRE_APPROVAL_PENDING_SUBMISSION = 'PO Retire Approval Pending Submission';
  public static RETIRE_PENDING_APPROVAL = 'Retire Pending Approval';
  public static PO_SAVE_RETIRED_MESSAGE = 'Policy Owner Retire Pending Approval Saved Successfully';
  public static RETIRE_RULE_PENDING_APPROVAL = 'Retire Pending Approval';

  public static DEFAULT_STATUS_LIST_OF_RULES_FOR_IMPACT_ANALYSIS = 290;

  public static SAME_SIM_FILE_PROCESS_CONFIRMATION_MSG = 'This process may take several minutes, you will be notified by email when the process is complete';
  public static CONFIRMATION_WORD = 'Confirmation';
  public static SUCCESS_PR_CLAIM_MESSAGE = 'Selected rules have been assigned to you for approval.';

  public static ALL_STATUSES = 'ALL';
  public static IDEAS_GENERATED = 'IG';
  public static PROVISIONAL_RULES_GENERATED = 'PRG';
  public static PROVISIONAL_RULES_ASSIGNED = 'PRA';
  public static RULES_GENERATED = 'RG';
  public static SHELVED = 'S';
  public static INVALID = 'I';
  public static DUPLICATED = 'D';

  //Sub Rule Types (Parent dropdown in Sub Rule Seach screen)
  public static ALL_BY_ID = 'AB';
  public static LIBRARY_RULES_ID = 'LR';
  public static MID_RULES_KEY_ID = 'MRK';
  public static CODE_RESOURCES_ID = 'CR';
  public static MAPPING_TABLES_ID = 'MT';

  //Sub Rule Secondary Types (Son dropdown in Sub Rule Seach screen)
  public static MID_RULE_ID = 'MR';
  public static PAYER_ID = 'P';
  public static CHANGE_LOG_GROUPS_ID = 'CLG';
  public static CHANGE_TYPES_ID = 'CT';
  public static CHANGE_SOURCES_ID = 'CS';
  public static CPT_CODES_ELL = "CPT";
  public static ICD_CODES_ELL = "ICD";
  public static LIBRARY_STATUS_CODES_ID = "LSC";
  public static PAYER_CATALOG = "PC";
  public static POLICY_TYPES_ID = 'PT';
  public static REASON_TYPES_ID = 'RT'
  public static PROJECT_CATEGORIES_ID = 'PRC'
  public static REFERENCE_SOURCES_ID = 'RSI'
  public static REFERENCE_TITLE = "REFT";
  public static REQUEST_TYPE = "REQT";
  public static RPCD_REASONS_TYPE = "RPCD";
  public static RULE_HEADERS_TYPE = "RH";
  public static WORK_STATUS = "WS";
  public static SUB_SPEC = "SP";
  public static REASON = "R";
  public static INSURANCE = "INS";
  public static ELL_POS = 'POS';
  public static GENDER = 'GENDER';

  //Search Types
  public static NA_TYPE_SEARCH = 'N/A';
  public static KEYWORD_TYPE_SEARCH = 'KEYWORD';

  //STATUS ID OF ELL
  public static DO_NOT_PRESENT_STATUS_ID = -1;
  public static RETIRED_STATUS_ID = 3;

  //Source Screen
  public static RULE_CATALOG_SCREEN = "RC";
  public static DECISION_POINT_SCREEN = "DP";
  public static LIBRARY_RULE_SCREEN = "LRS";

  //Impact Analysis Request types
  public static IMPACT_ANALYSIS_REQUEST_TYPE_INTERNAL = 'Internal';
  public static IMPACT_ANALYSIS_REQUEST_TYPE_REFERENCE_CHANGE = 'Reference';

  // CVP Ingestion Template Constants
  public static CVP_EXPORT_SUCCESS = 'CVP Template(s) Exported Successfully';
  public static CPE_EXPORT_SUCCESS = 'CPE Template(s) Exported Successfully';
  public static CVP_EXPORT_ERROR_SELECTION_TITLE = 'No CVP Templates selected to Export';
  public static EMPTY_MESSAGE = '';
  public static FILE_TYPE = 'fileType';
  public static CVP_FILE_NAME = 'CVP_Ingestion_Report.xlsx';
  public static CPE_FILE_NAME = 'CPE_Ingestion_Report.xlsx';
  public static YES = 'Yes';
  public static NO = 'No';

  public static MOST_PROVIDE_INPUT_PROPERTY = 'You most provide @Input(): ';
  public static EMPTY_STRING = '';

  public static ASSIGNED_STATUS = 'assigned';
  public static RETURNED_STATUS = 'returned';
  public static NOT_ASSIGN_STATUS = 'notAssigned';

  public static ALL_YES = 'Y';
  public static ALL_NO = 'N';

  public static TAB_ANALYSES = 'Analyses';
  public static TAB_MYANALYSES = 'My Analyses';

  public static TAB_NOT_ASSIGNED = 'Not Assigned';
  public static TAB_ASSIGNED = 'Assigned';
  public static TAB_RETURNED = 'Returned';

  public static LOCAL_SERVER_TIMEZONE = 'America/New_York';
  public static LOCAL_SERVER_LOCALE = 'en-US';

  /** Rule codes types. */
  public static CPT_CODE_TYPE = 'CPT';
  public static HCPCS_CODE_TYPE = 'HCPCS';
  public static ICD_CODE_TYPE = 'ICD';
  public static CODE_VALID_STATUS = 'Valid';
  public static CODE_INVALID_STATUS = 'Invalid';
  public static TWO_PERC_POS= '2%-Expired/Invalid POS';

  public static TYPE_LIST = 'LIST';
  public static TYPE_DATE = 'DATE'

  /* FILE CONSTANTS */
  public static MAX_FILE_SIZE = 10;
  public static ACCEPT_FILE_TYPES = ".txt, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword"

  /* Research Request lookup type constants */
  public static RR_SEND_BACK_REASON = 'RR_SEND_BACK_REASON';
  public static RR_PAYER_STATUS = 'RR_PAYER_STATUS';
  public static RR_ISSUE_TYPE = 'RR_ISSUE_TYPE';
  public static RR_POLICY_TYPE = 'RR_POLICY_TYPE';
  public static RR_ATTACHMENT_CATEGORIES = 'RR_ATTACHMENT_CATEGORIES';
  public static RR_SD_PRIORITY = 'RR_SD_PRIORITY';
  public static RR_ELL_COMMITTEE_REVIEW = 'RR_ELL_COMMITTEE_REVIEW';
  public static RR_ELL_QA_RESULT_REASON = 'RR_ELL_QA_RESULT_REASON';
  public static RR_REQUEST_CLASSIFICATION = 'RR_REQUEST_CLASSIFICATION';
  public static RR_PROJECT_REQUEST_CATEGORY= 'PROJECT_REQUEST_CATEGORY';
  public static RR_SOURCE = 'RR_REQUEST_TYPE';
  public static RR_CLIENT_COTIVITI_ALL = 1;
  public static RR_CLIENT_COTIVITI_QA = 2;
  public static RR_CLIENT_COTIVITI_SPD = 3;
  public static RR_NO_CHANGE = 'No Change';
  public static RR_UPDATE = 'Update Rule';
  public static RR_IDEA_CREATE_NEW = 'Create New';
  public static RR_RULE_STATUS_REJECT = 'Reject';
  public static RR_RULE_STATUS_ACCEPT = 'Accept';
  public static RR_WORKFLOW_STATUS_DRAFT = 'Draft';
  public static RR_WORKFLOW_STATUS_IN_PROGRESS = 'In-Progress';
  public static RR_WORKFLOW_STATUS_NOT_STARTED = 'Not Started';
  public static RR_WORKFLOW_STATUS_ASSITANCE_COMPLETED = 'Assistance Completed';
  public static RR_WORKFLOW_STATUS_PENDING_ASSISTANCE = 'Pending Assistance';
  public static RR_WORKFLOW_STATUS_REQUESTOR_REVIEW = 'Requestor Review';
  public static RR_WORKFLOW_STATUS_SUBMIT_FOR_ASSISTANCE = 'Submit for Assistance';
  public static RR_WORKFLOW_STATUS_RESEARCH_COMPLETED = 'Research Completed';
  public static RR_WORKFLOW_STATUS_SEND_BACK_FOR_RESEARCH = 'Send Back For Research';
  public static RR_WORKFLOW_STATUS_NEED_ADDITIONAL_RESEARCH = 'Need Additional Research';
  public static RR_WORKFLOW_STATUS = 'RR_WORKFLOW_STATUS';
  public static RR_PR_WORKFLOW_STATUS = 'PR_WORKFLOW_STATUS';
  public static RR_ROUTE_TO_TYPE = 'RR_ROUTE_TO_TYPE';
  public static RR_ROUTE_TO_VALUE_SUBMIT_ASSISTANCE_CODE = 'SBMTASST';
  public static RR_ROUTE_TO_VALUE_ASSISTANCE_COMPLETED_CODE = 'ASSCMPL';
  public static RR_ROUTE_TO_VALUE_NEED_ADDITIONAL_RESEARCH = 'NDADTNLRESRCH';
  public static RR_ROUTE_TO_VALUE_REQUESTOR_REVIEW_CODE = 'REQREVW';
  public static RR_ROUTE_TO_VALUE_CODE_SBFR = 'SBFR';
  public static RR_ROUTE_TO_VALUE_CODE_RC = 'RC';
  public static RR_DUPLICATE_VALIDATE_TAB_HEADER = 'Duplicate & Validate Check';
  public static RR_NEW_REQUEST_TAB_HEADER = 'New Request';
  public static YES_IND = 'Y';
  public static RULE_POTENTIALLY_IMPACT_STATUS = 'Potentially Impacted';
  public static RR_APPROVAL_STATUS = 'Return to CCA';
  public static NONE = 'None';
  public static CHOOSE_LABEL = 'Choose';
  public static RR_CUSTOM_SERVICE_ERROR_MSG = 'Please try again after sometime and reach out to ECL.Support@cotiviti.com';
  public static INVALID_TEAM_MEMBER = 'InValid Team Member';
  public static INTERNAL_SERVER_ERROR = 'Internal Server Error';
  public static SERVICE_FAILURE       = 'Failure';

  public static QUERY_PARAM_RETURNED = 'RETURNED';

  /* Research Request Pages constants */

  /* Project Request */
  public static PROJECT_REQUEST_BUTTON_DISABLED = 'PR_BTN_ENABLED';

  public static MY_RESEARCH_REQUEST_ROUTE = 'my-research-request';
  public static NEW_RESEARCH_REQUEST_ROUTE = 'new-research-request';
  public static RESEARCH_REQUEST_ROUTE = 'research-request';
  public static RESEARCH_REQUEST_INDICATOR_CLASS = 'rr-indicator';

  // Cure and repo
  public static CURE_MODULE_CONSULTING_PATH = 'module-consulting';
  public static CURE_MODULE_ADMIN_LIST_PATH = 'module-admin-list';
  public static CURE_MODULE_ADD_EDIT_PATH = 'module-add-edit';

  public static REPO_TABLE_ADMIN_LIST_PATH = 'table-admin-list';
  public static REPO_TABLE_ADD_EDIT_PATH = 'table-add-edit';
  public static REPO_TABLES_ADMIN_LIST_PATH = 'table-admin-list'

  //metadata
  public static DUPLICATE_FILTER_NAME = 'DUPLICATE_FILTER_NAME';
  public static DUPLICATE_TAG_NAME = 'DUPLICATE_TAG_NAME';
  public static SELECTED_TAG = 'tagSelected';
  public static SELECTED_FILTER = 'filterSelected';

  //redis
  public static redisCacheUrl = null;

  public static VALIDATION_ERROR = 'ERROR_VALIDATION';
  public static FILTER_UPDATE_ERROR = 'Cannot update selected filter';
  public static REPO_MODULE_CONSULTING_PATH = 'module-consulting';

  public static NOT_ASSIGNED_IDEA_WORKFLOW_ID = 8;
  public static ASSIGNED_IDEA_WORKFLOW_ID = 9;
  public static RETURNED_IDEA_WORKFLOW_ID = 10;

  public static MWF_INSTANCE_NUMBER = 30;
  public static MWF_MID_RULE_INSTANCE_NUMBER = 31;
  public static MWF_CLIENT_NUMBER = 40;
  public static MWF_PAYER_NUMBER = 50;
  public static MWF_DEFAULT_NUMBER = 60;

  public static EDIT_MODE = 'edit';
  public static ADD_MODE = 'add';
  public static DELETE_MODE = 'delete';

  public static ACTIVE_STRING_VALUE = 'Active';
  public static INACTIVE_STRING_VALUE = 'Inactive';

  public static DISABLED_STATUS =  'DISABLED';
  //FILE INBOX
  public static FILE_INBOX_MESSAGE = 'Your file will be available in a while at Downloads section and you will notify by email when the file is ready'

  //FILE INBOX - ASYMC PROCESS
  public static CURE_QUERY_PROCESS = 'CURE_QUERY';
  public static RR_RULE_RESPONSE_STATUS = 'RR_RULE_RESPONSE_STATUS';
  public static RR_RULE_RESP_TYPE_CHNG = 'RR_RULE_RESP_TYPE_CHNG';
  public static RR_RULE_RESP_TYPE_CHNG_IDEA = 'RR_RUL_RES_TYPE_CHNG_IDEA';
  //ecl-table
  public static ECL_TABLE_ASC_ORDER = 1;

  public static LIBRARY_RULE = 'Library Rule';
  public static RETURN_TO_RA = "Return to Research Analyst";
  public static RR_MY_REQUEST_PAGE = 'rr-my-req-page';
  public static RR_REQUEST_ID_PAGE = 'rr-req-id-page';

  public static APPROVED_STATUS = 'Approved';
  public static DRAFT_STATUS = 'Draft';
  public static IDEA_STATUS = 'Idea';
  public static IN_REVIEW_STATUS = 'In Review';
  public static RETURNED_CVP_STATUS = 'Returned';
  public static IN_DELETION_STATUS = 'In Deletion';
  public static DELETED_STATUS = 'Deleted';
  public static DELETION_IN_REVIEW = 'Deletion In Review';
  public static CLINICAL_REQUIREMENTS_SCREEN = 'CRC';
  public static ANCILLARY_INFORMATION_SCREEN = 'AI';

  public static CVP_EDITOR_ROLE_NAME = 'CVPE';
  public static CVP_APPROVER_ROLE_NAME = 'CVPAP';

  public static NEW = 'new';
  public static TAG = 'tag';

  //Web Crawling Constants
  public static DATA_ENABLED = 'YES';
  public static DATA_DISABLED = 'NO';
  public static CLINICAL_PHARMA = 'clinicalpharma';
  public static LCD_LCA = 'lcdlca';
  public static LEXI_PN = 'lexipn';
  public static AHFS_DI = 'ahfsdi';
  public static COMPARE_CLINICAL_PHARMA = 'clinical pharma';
  public static COMPARE_LCD_LCA = 'lcd-lca';
  public static COMPARE_LEXI_PN = 'Lexi PN';
  public static COMPARE_AHFS_DI = 'ahfs-di';
  public static LCDLCA = 'LCD-LCA';
  public static SWITCH_ON = 'ON';
  public static SWITCH_OFF = 'OFF';
  public static SUBPROCESS_NCCN = 'NCCN';
  public static SUBPROCESS_DRUGLABEL = 'Druglabel';

  public static STATUS_ACTION_DEACTIVATE = 'Deactivate';
  public static STATUS_ACTION_ACTIVATE = 'Activate';
  public static NEW_VERSION_PENDING_SUBMISSION = 'New Version Pending Submission';
  public static EXISTING_VERSION_PENDING_SUBMISSION = 'Existing Version Pending Submission';
  public static APPROVED_PENDING_SUBMISSION = 'Approved Pending Submission';
  public static PROVISIONAL_RULE = 'Provisional Rule';

  //RR Status

  public static PENDING_ASSISTANCE = 'Pending Assistance';
  public static ASSISTANCE_COMPLETED = 'Assistance Completed';
  public static IN_PROGRESS = 'In-Progress';
  public static SEND_BACK_RESEARCH = 'Send Back For Research';
  public static NOT_STARTED = 'Not Started';

  public static ERROR_DELETE_MESSAGE_HEAD = "Delete";
  public static ERROR_CLONE_MESSAGE_HEAD = "Clone Module";
  public static RR_FLOW_ENABLED = 'RR_FLOW_ENABLED';
  public static RR_JIRA_LOGIN_FLAG = 'RR_JIRA_LOGIN_FLAG';

  public static RESEARCH_REQUEST_PROCESS_FILE = 'RESEARCH_REQUEST_PROCESS';

  public static LOOKUP_PRIMARY_SECONDARY_ICD = 'DIAGNOSIS_CODE_PRM_SEC';
  public static LOOKUP_ICMS_PROVIDER_TYPE = 'ICMS_PROVIDER_TYPE';

  public static PROCCODE_TEMPLATE_TYPE = 'procedureCode';
  public static DIAGCODE_TEMPLATE_TYPE = 'diagnosisCode';

  public static KEYPRESS = 2;
  public static INPUT = 1;
  public static SUB_VERSION_ONE = 1;
  public static SELECTION_MODE_SINGLE = 'single';
  public static SELECTION_MODE_MULTIPLE = 'multiple';
  public static INDIVIDUALLY = 'individually';
  public static EXISTING_RULE_CODE_ERROR = 'EXISTING_RULE_CODE_ERROR';
  public static RR_NAVIGATE_TITLE_UNASSIGNED = 'Unassigned Request';
  public static RR_NAVIGATE_PAGE_FROM = 'reassignment_research_request';
  public static RR_NAVIGATE_TITLE_SEARCH = 'Requests Search';

  //PdgTemplate
  public static ICMS_REASON_CODES = 'ICMS_REASON_CODES';
  public static ICMS_REF_TITLE = 'ICMS_REF_TITLE';
  public static ICMS_INDUSTRY_UPDATE = 'ICMS_INDUSTRY_UPDATE';
  public static MCD_RULE_REFERENCES = 'MCD_RULE_REFERENCES';
  public static STATE = 'STATE';
  public static MCAID = 'MCAID:';
  public static DEFAULT_DATE_FROM = '01-01-1753';
  public static DEFAULT_DATE_TO = '12-31-9999';
  public static WASHINGTONDC_CAT= 'Washington DC';
  public static WASHINGTONDC_ST= 'District of Columbia';
  public static WASHINGTON_ST = 'Washington';
  public static WASHINGTON_CAT = 'Washington State';
  public static MEDICAID_CAT = 'medicaid -';

  public static EQUAL_OPERATOR = '=';
  public static ENTER_KEY_EVENT = 13;

  public static NEW_RR_ROUTE_PAGE = 'NR';
  public static MY_RR_ROUTE_PAGE = 'MR';
  public static UNASSIGNED_RR_ROUTE_PAGE = 'UR';
  public static REASSIGNED_RR_ROUTE_PAGE = 'RR';
  public static REQUEST_SEARCH_ROUTE_PAGE = 'RS';

  //DNB Template
  public static DNB_TEMPLATE_FLAG = 'DNB_TEMPLATE';
  public static CPE_LOAD_FILE_NAME ='CPE Load File_';
}
