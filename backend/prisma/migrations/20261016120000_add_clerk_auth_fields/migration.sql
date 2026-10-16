ALTER TABLE `users`
    ADD COLUMN `authProvider` ENUM('CLERK', 'EMAIL') NOT NULL DEFAULT 'EMAIL',
    ADD COLUMN `clerkId` VARCHAR(191) NULL;

CREATE UNIQUE INDEX `users_clerkId_key` ON `users`(`clerkId`);
