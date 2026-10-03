CREATE TABLE `verification_authorities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`organisation` text NOT NULL,
	`port_scope` text DEFAULT '' NOT NULL,
	`professional_role_scope` text DEFAULT '' NOT NULL,
	`event_type_scope` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'inactive' NOT NULL,
	`granted_by` text NOT NULL,
	`granted_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`revoked_by` text,
	`revoked_at` text
);
--> statement-breakpoint
CREATE INDEX `idx_verification_authorities_user_status` ON `verification_authorities` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_verification_authorities_port_status` ON `verification_authorities` (`port_scope`,`status`);--> statement-breakpoint
ALTER TABLE `report_revisions` ADD `new_data` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `report_revisions` ADD `replacement_report_id` integer;