export const drugVersionStatus = {
  Approved: { code: "AV", description: "Approved" },
  PendingApproval: { code: "PA", description: "Pending for approval" },
  Draft: { code: "DRAFT", description: "Draft" },
  InProgress: { code: "IP", description: "In Progress" },
  inReview: { code: "IR", description: "In Review" },
  submitedReview: { code: "SR", description: "Submited For Review" },
};

export const DnBRoles = {
  Editor: { name: "DNBE" },
  Approver: { name: "DNBA" },
  Admin: { name: "DNBADMIN" },
};

export const FeedBackStatus = {
  Sent: { code: "SE", name: "Sent" },
  Resolved: { code: "RE", name: "Resolved" },
  Verified: { code: "VE", name: "Verified" },
  NotDetermined: { code: "ND", name: "Not Determined" },
};
