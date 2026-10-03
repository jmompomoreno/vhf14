ALTER TABLE `reports` ADD `reporting_capacity` text DEFAULT 'personal' NOT NULL;--> statement-breakpoint
ALTER TABLE `reports` ADD `organisation` text DEFAULT '' NOT NULL;