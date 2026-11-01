/*
  Warnings:

  - You are about to drop the column `barcode` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `compareAtCents` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `costCents` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `hasVariants` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `requiresShipping` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `taxClass` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `weightGrams` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `products_isFeatured_idx` ON `products`;

-- DropIndex
DROP INDEX `products_priceCents_idx` ON `products`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `barcode`,
    DROP COLUMN `compareAtCents`,
    DROP COLUMN `costCents`,
    DROP COLUMN `hasVariants`,
    DROP COLUMN `isFeatured`,
    DROP COLUMN `metaDescription`,
    DROP COLUMN `metaTitle`,
    DROP COLUMN `publishedAt`,
    DROP COLUMN `requiresShipping`,
    DROP COLUMN `shortDescription`,
    DROP COLUMN `taxClass`,
    DROP COLUMN `weightGrams`;
