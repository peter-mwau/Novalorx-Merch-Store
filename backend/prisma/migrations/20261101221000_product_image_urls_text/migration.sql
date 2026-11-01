-- Allow selected image files to be stored as data URLs.
ALTER TABLE `product_images` MODIFY `url` MEDIUMTEXT NOT NULL;
