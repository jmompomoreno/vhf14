ALTER TABLE `reports` ADD `event_time_original` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `reports` ADD `time_reference` text DEFAULT 'utc' NOT NULL;--> statement-breakpoint
ALTER TABLE `reports` ADD `port_timezone` text DEFAULT '' NOT NULL;