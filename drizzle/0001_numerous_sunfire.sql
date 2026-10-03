CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`full_name` text,
	`company` text DEFAULT '' NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`plan` text DEFAULT 'free' NOT NULL,
	`subscription_status` text DEFAULT 'trial' NOT NULL,
	`billing_cycle` text DEFAULT 'monthly' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_accounts_user_id` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_accounts_email` ON `accounts` (`email`);--> statement-breakpoint
CREATE TABLE `usage_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`resource` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_usage_user_created` ON `usage_events` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `watchlist` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`reference` text NOT NULL,
	`label` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_watchlist_user_kind_ref` ON `watchlist` (`user_id`,`kind`,`reference`);--> statement-breakpoint
CREATE INDEX `idx_watchlist_user_kind` ON `watchlist` (`user_id`,`kind`);