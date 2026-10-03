import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vesselName: text("vessel_name").notNull(), imo: text("imo").notNull().default(""), portCode: text("port_code").notNull(),
  eventType: text("event_type").notNull(), eventTimeUtc: text("event_time_utc").notNull(),
  eventTimeOriginal: text("event_time_original").notNull().default(""),
  timeReference: text("time_reference", { enum: ["port_local", "utc"] }).notNull().default("utc"),
  portTimezone: text("port_timezone").notNull().default(""),
  timeBasis: text("time_basis", { enum: ["actual", "estimated", "planned", "requested"] }).notNull().default("actual"), sourceRole: text("source_role").notNull(), notes: text("notes").notNull().default(""),
  terminal: text("terminal").notNull().default(""),
  berth: text("berth").notNull().default(""),
  pilotBoardingPlace: text("pilot_boarding_place").notNull().default(""),
  visibility: text("visibility", { enum: ["public", "restricted", "internal"] }).notNull().default("public"),
  reportingCapacity: text("reporting_capacity", { enum: ["personal", "organisation"] }).notNull().default("personal"),
  organisation: text("organisation").notNull().default(""),
  status: text("status", { enum: ["pending", "verified", "rejected", "superseded"] }).notNull().default("pending"),
  reporterUserId: text("reporter_user_id"), reporterEmail: text("reporter_email"), reviewedBy: text("reviewed_by"), reviewedAt: text("reviewed_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  portCallId: text("port_call_id").notNull().default(""),
}, (table) => [index("idx_reports_status_created").on(table.status, table.createdAt), index("idx_reports_port_created").on(table.portCode, table.createdAt), index("idx_reports_imo_created").on(table.imo, table.createdAt), index("idx_reports_port_call").on(table.portCallId, table.eventTimeUtc)]);

export const reportRevisions = sqliteTable("report_revisions", {
  id: integer("id").primaryKey({ autoIncrement: true }), reportId: integer("report_id").notNull(),
  actorUserId: text("actor_user_id").notNull(), action: text("action", { enum: ["edited", "withdrawn", "correction_applied"] }).notNull(),
  previousData: text("previous_data").notNull(), newData: text("new_data").notNull().default(""),
  replacementReportId: integer("replacement_report_id"), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_report_revisions_report_created").on(table.reportId, table.createdAt)]);

export const reportCorrections = sqliteTable("report_corrections", {
  id: integer("id").primaryKey({ autoIncrement: true }), reportId: integer("report_id").notNull(), requesterUserId: text("requester_user_id").notNull(),
  proposedData: text("proposed_data").notNull(), reason: text("reason").notNull(), status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  reviewedBy: text("reviewed_by"), reviewedAt: text("reviewed_at"), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_report_corrections_status_created").on(table.status, table.createdAt), index("idx_report_corrections_report").on(table.reportId)]);

export const accounts = sqliteTable("accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  company: text("company").notNull().default(""),
  role: text("role", { enum: ["member", "analyst", "admin"] }).notNull().default("member"),
  plan: text("plan", { enum: ["free", "watch", "operations", "enterprise"] }).notNull().default("free"),
  subscriptionStatus: text("subscription_status", { enum: ["trial", "active", "past_due", "cancelled"] }).notNull().default("trial"),
  billingCycle: text("billing_cycle", { enum: ["monthly", "annual"] }).notNull().default("monthly"),
  status: text("status", { enum: ["active", "suspended"] }).notNull().default("active"),
  statusReason: text("status_reason").notNull().default(""),
  statusChangedBy: text("status_changed_by"),
  statusChangedAt: text("status_changed_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_accounts_user_id").on(table.userId), index("idx_accounts_email").on(table.email)]);

export const watchlist = sqliteTable("watchlist", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  kind: text("kind", { enum: ["vessel", "port"] }).notNull(),
  reference: text("reference").notNull(),
  label: text("label").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_watchlist_user_kind_ref").on(table.userId, table.kind, table.reference), index("idx_watchlist_user_kind").on(table.userId, table.kind)]);

export const usageEvents = sqliteTable("usage_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  action: text("action").notNull(),
  resource: text("resource").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_usage_user_created").on(table.userId, table.createdAt)]);

export const contributionCredits = sqliteTable("contribution_credits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  reportId: integer("report_id").notNull(),
  amount: integer("amount").notNull().default(1),
  reason: text("reason").notNull().default("Verified unique operational event"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_contribution_credits_report").on(table.reportId),
  index("idx_contribution_credits_user_created").on(table.userId, table.createdAt),
]);

export const adminNotes = sqliteTable("admin_notes", {
  id: integer("id").primaryKey({ autoIncrement: true }), userId: text("user_id").notNull(),
  note: text("note").notNull(), createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_admin_notes_user_created").on(table.userId, table.createdAt)]);

export const adminAuditLog = sqliteTable("admin_audit_log", {
  id: integer("id").primaryKey({ autoIncrement: true }), actorUserId: text("actor_user_id").notNull(),
  subjectType: text("subject_type").notNull(), subjectId: text("subject_id").notNull(), action: text("action").notNull(),
  reason: text("reason").notNull(), previousValue: text("previous_value").notNull().default(""), newValue: text("new_value").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_admin_audit_subject_created").on(table.subjectType, table.subjectId, table.createdAt), index("idx_admin_audit_actor_created").on(table.actorUserId, table.createdAt)]);

export const professionalProfiles = sqliteTable("professional_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  professionalRole: text("professional_role", { enum: ["vts", "pilot", "tug", "mooring", "terminal", "agent", "crew"] }).notNull(),
  jobTitle: text("job_title").notNull().default(""),
  participationType: text("participation_type", { enum: ["individual", "organisation"] }).notNull().default("individual"),
  organisation: text("organisation").notNull().default(""),
  organisationType: text("organisation_type").notNull().default(""),
  organisationWebsite: text("organisation_website").notNull().default(""),
  corporateEmail: text("corporate_email").notNull().default(""),
  legalRegistrationId: text("legal_registration_id").notNull().default(""),
  authorityToRepresent: text("authority_to_represent").notNull().default(""),
  portScope: text("port_scope").notNull().default(""),
  country: text("country").notNull().default(""),
  professionalIdentifier: text("professional_identifier").notNull().default(""),
  verificationNotes: text("verification_notes").notNull().default(""),
  status: text("status", { enum: ["pending", "verified", "rejected"] }).notNull().default("pending"),
  organisationStatus: text("organisation_status", { enum: ["not_applicable", "pending", "verified", "rejected"] }).notNull().default("not_applicable"),
  professionalReviewedBy: text("professional_reviewed_by"),
  professionalReviewedAt: text("professional_reviewed_at"),
  organisationReviewedBy: text("organisation_reviewed_by"),
  organisationReviewedAt: text("organisation_reviewed_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_professional_profiles_user").on(table.userId), index("idx_professional_profiles_role_status").on(table.professionalRole, table.status)]);

// Prepared for a later controlled rollout. Beta verification remains administrator-only.
export const verificationAuthorities = sqliteTable("verification_authorities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  organisation: text("organisation").notNull(),
  portScope: text("port_scope").notNull().default(""),
  professionalRoleScope: text("professional_role_scope").notNull().default(""),
  eventTypeScope: text("event_type_scope").notNull().default("[]"),
  status: text("status", { enum: ["inactive", "active", "revoked"] }).notNull().default("inactive"),
  grantedBy: text("granted_by").notNull(),
  grantedAt: text("granted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  revokedBy: text("revoked_by"),
  revokedAt: text("revoked_at"),
}, (table) => [
  index("idx_verification_authorities_user_status").on(table.userId, table.status),
  index("idx_verification_authorities_port_status").on(table.portScope, table.status),
]);
