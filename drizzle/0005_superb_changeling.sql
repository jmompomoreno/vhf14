CREATE TABLE `professional_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`full_name` text NOT NULL,
	`professional_role` text NOT NULL,
	`job_title` text DEFAULT '' NOT NULL,
	`organisation` text DEFAULT '' NOT NULL,
	`port_scope` text DEFAULT '' NOT NULL,
	`country` text DEFAULT '' NOT NULL,
	`professional_identifier` text DEFAULT '' NOT NULL,
	`verification_notes` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_professional_profiles_user` ON `professional_profiles` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_professional_profiles_role_status` ON `professional_profiles` (`professional_role`,`status`);--> statement-breakpoint
ALTER TABLE `reports` ADD `port_call_id` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_reports_port_call` ON `reports` (`port_call_id`,`event_time_utc`);