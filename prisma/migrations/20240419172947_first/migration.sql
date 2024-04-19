/*
  Warnings:

  - You are about to drop the column `expires_in` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `ext_expires_in` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `accounts` DROP COLUMN `expires_in`,
    DROP COLUMN `ext_expires_in`,
    ADD COLUMN `expires_at` INTEGER NULL;
