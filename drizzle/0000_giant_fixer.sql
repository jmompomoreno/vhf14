CREATE TABLE `reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vessel_name` text NOT NULL,
	`imo` text DEFAULT '' NOT NULL,
	`port_code` text NOT NULL,
	`event_type` text NOT NULL,
	`event_time_utc` text NOT NULL,
	`source_role` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`reporter_user_id` text,
	`reporter_email` text,
	`reviewed_by` text,
	`reviewed_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reports_status_created` ON `reports` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_reports_port_created` ON `reports` (`port_code`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_reports_imo_created` ON `reports` (`imo`,`created_at`);