CREATE TABLE `admin_audit_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor_user_id` text NOT NULL,
	`subject_type` text NOT NULL,
	`subject_id` text NOT NULL,
	`action` text NOT NULL,
	`reason` text NOT NULL,
	`previous_value` text DEFAULT '' NOT NULL,
	`new_value` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_admin_audit_subject_created` ON `admin_audit_log` (`subject_type`,`subject_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_admin_audit_actor_created` ON `admin_audit_log` (`actor_user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `admin_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`note` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_admin_notes_user_created` ON `admin_notes` (`user_id`,`created_at`);--> statement-breakpoint
ALTER TABLE `accounts` ADD `status` text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `accounts` ADD `status_reason` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `accounts` ADD `status_changed_by` text;--> statement-breakpoint
ALTER TABLE `accounts` ADD `status_changed_at` text;