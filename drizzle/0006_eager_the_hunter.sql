CREATE TABLE `report_corrections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`report_id` integer NOT NULL,
	`requester_user_id` text NOT NULL,
	`proposed_data` text NOT NULL,
	`reason` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`reviewed_by` text,
	`reviewed_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_report_corrections_status_created` ON `report_corrections` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_report_corrections_report` ON `report_corrections` (`report_id`);--> statement-breakpoint
CREATE TABLE `report_revisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`report_id` integer NOT NULL,
	`actor_user_id` text NOT NULL,
	`action` text NOT NULL,
	`previous_data` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_report_revisions_report_created` ON `report_revisions` (`report_id`,`created_at`);