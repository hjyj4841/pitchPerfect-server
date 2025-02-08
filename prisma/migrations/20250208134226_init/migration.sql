-- CreateTable
CREATE TABLE `User` (
    `user_id` VARCHAR(100) NOT NULL,
    `user_password` VARCHAR(100) NOT NULL,
    `user_name` VARCHAR(100) NOT NULL,
    `user_profile_image` VARCHAR(200) NULL,
    `user_introduce` TEXT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Album` (
    `album_id` INTEGER NOT NULL AUTO_INCREMENT,
    `spotify_code` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(100) NULL,
    `album_rate` INTEGER NULL,
    `album_review` TEXT NULL,
    `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`album_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Album` ADD CONSTRAINT `album_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
