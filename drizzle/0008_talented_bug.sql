ALTER TABLE `professional_profiles` ADD `organisation_status` text DEFAULT 'not_applicable' NOT NULL;--> statement-breakpoint
ALTER TABLE `professional_profiles` ADD `professional_reviewed_by` text;--> statement-breakpoint
ALTER TABLE `professional_profiles` ADD `professional_reviewed_at` text;--> statement-breakpoint
ALTER TABLE `professional_profiles` ADD `organisation_reviewed_by` text;--> statement-breakpoint
ALTER TABLE `professional_profiles` ADD `organisation_reviewed_at` text;