ALTER TABLE `professional_profiles` ADD `participation_type` text DEFAULT 'individual' NOT NULL;--> statement-breakpoint
ALTER TABLE `professional_profiles` ADD `organisation_type` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `professional_profiles` ADD `organisation_website` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `professional_profiles` ADD `corporate_email` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `professional_profiles` ADD `legal_registration_id` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `professional_profiles` ADD `authority_to_represent` text DEFAULT '' NOT NULL;