CREATE TABLE `contribution_credits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`report_id` integer NOT NULL,
	`amount` integer DEFAULT 1 NOT NULL,
	`reason` text DEFAULT 'Verified unique operational event' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_contribution_credits_report` ON `contribution_credits` (`report_id`);--> statement-breakpoint
CREATE INDEX `idx_contribution_credits_user_created` ON `contribution_credits` (`user_id`,`created_at`);