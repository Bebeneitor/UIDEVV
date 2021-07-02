export class PdgConstants {
    public static PDG_FIELDS_MANDATORY = "Please fill all mandatory fields in PDG Template";
    public static STATE_MANDATORY = "Please enter State in PDG Template";
    public static CODE_DESCRIPTION_MANDATORY = "Please enter Code Description in PDG Template";
    public static CLAIM_TYPE_MANDATORY = (text : string) => `Please select ${text}Claim Types in PDG Template`;
    public static DOS_FROM_MANDATORY = "Please enter Sub Rule DOS From in PDG Template";
    public static DOS_TO_MANDATORY = "Please enter Sub Rule DOS To in PDG Template";
    public static REF_DETAILS_MANDATORY = (text : string) => `Please enter ${text}Reference Details in PDG Template`;
    public static PRIM_REFTITLE_MANDATORY = "Please enter Primary Reference Title in PDG Template";
    public static REASON_CODE_MANDATORY = (text : string) => `Please enter ${text}Reason Code & Description in PDG Template`;
    public static CV_CODE_MANDATORY = "Please enter CV Code in PDG Template";
    public static INDUSTRY_UPD_MANDATORY = "Please enter Industry Update Required field in PDG Template";
    public static SCRIPT_MANDATORY = (text : string) =>`Please enter ${text}Script field in PDG Template`;
    public static RATIONALE_MANDATORY = (text : string) =>`Please enter ${text}Rationale field in PDG Template`;
    public static CPT_FILES_MANDATORY = "Please select CPT Distribution files in PDG Template";
    public static CGRID_FILES_MANDATORY = "Please attach at least one Client Grid file in PDG Template";
    public static HPP_MR_MANDATORY = "Please enter HPP MR in PDG Template";
    public static HPP_DESCRIPTION_MANDATORY = "Please enter HPP Rule Description field in PDG Template";
    public static HPP_REVISIONS_MANDATORY = "Please enter MSSP Revisions field in PDG Template";
    public static VALID_REFURL = "Please enter valid State References URL in PDG Template!";
    public static FILL_STATEREF_FIELDS_MANDATORY = "Please fill all State Reference Information mandatory fields in PDG Template!";
    public static ERROR_SAVING_REFS = "Issue saving one or more State Reference Information Details in PDG Template";
    public static CV_CODE_DEFAULT = "1 -  CORE";
    public static CPT_FILES = 'CPT';
    public static ITU_FILES = 'ITU';
    public static CLAIM_FILES = "CLAIM";
    public static CODE_FILES = "CODE";
    public static OTHER_FILES = "OTHER";
    public static CLIENTGRID_FILES = "CGRID";
    public static DOS_FILES = "DOS";
    public static ELL_TEAM = "ELL_TEAM";
    public static RULE_REL = "RULE_RELATIONSHIPS";
    public static KEYRULE_TOOLTIP = 'If applicable, mention any NON-DEFAULT configuration items for inclusion in ITU Report request. Examples: any claim type, CPT link same';
    public static RULE_TOOLTIP = 'Mention about package or rule relationship in addition to the reason for requesting ITU';
    public static CGRID_TOOLTIP = 'Copy/paste Client Grid, in this section for the state for which the logic is proposed. Select grid from current grid list present on iShare and paste only following parameters State, Payer short, Client name, Team, CPM, MD, Research MD, LOB';
    public static CPTDISTR_TOOLTIP = 'Provide screenshot of rule codes from the CPT Distribution Value Tool';
    public static CODE_TOOLTIP = 'Provider reference information and screenshots supporting state coverage of the rule codes';
    public static CLAIMTYPE_TOOLTIP = 'Provider reference information and screenshots supporting claim type selection for the rule';
    public static DOS_TOOLTIP ='Provider reference information and screenshots supporting the Sub Rule DOS From for the rule';
    public static OTHERS_TOOLTIP ='Provider reference information and screenshots supporting other items related to the rule (e.g., state & RMI modifier descriptions';
    public static ITU_TOOLTIP ='Provider information and screenshots for the ITU data analysis';
    public static SCRIPT_LABEL = (text : string) =>`${text}Script`;
    public static RATIONALE_LABEL = (text : string) =>`${text}Rationale`;
    public static REASON_CODE_LABEL = (text : string) =>`${text}Reason Code & Description`;
    public static CLAIM_TYPE_LABEL = (text : string) =>`${text}Claim Types`;
    public static NOTE_LABEL = (text : string) =>`${text}Sub Rule Notes`;
    public static RULEDESC_LABEL = (text : string) =>`${text}Unresolved Rule Description`;
    public static REFDETAIL_LABEL = (text : string) =>`${text}Reference Details`;

    public static PNG_MIME = 'image/png';
    public static GIF_MIME = 'image/gif';
    public static JPG_MIME = 'image/jpeg';
    public static MAXLEN_4000 = 4000;
    public static MAXLEN_5000 = 5000;
    public static MAXLEN_32600 = 32600;

    public static ERROR_SAVING_REFS_ATTACHS = "Error while saving references and attachments!";
}