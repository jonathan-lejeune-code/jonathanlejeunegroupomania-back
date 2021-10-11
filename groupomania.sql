CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` time NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
CREATE TABLE `publications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `likes` int(11) DEFAULT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` time NOT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
ALTER TABLE
  `publications`
ADD
  PRIMARY KEY (`id`),
ADD
  KEY `UserId` (`UserId`);
ALTER TABLE
  `publications`
MODIFY
  `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 605;
CREATE TABLE `comments` (
    `id` int NOT NULL,
    `postId` INT(11) NOT NULL,
    `userId` int(11) NOT NULL,
    `username` varchar(255) DEFAULT NULL,
    `content` varchar(255) DEFAULT NULL,
    `createdAt` date NOT NULL,
    `updatedAt` time NOT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8;
ALTER TABLE
  `comments`
ADD
  PRIMARY KEY (`id`),
ADD
  KEY `userid` (`userid`) USING BTREE,
ADD
  KEY `postId` (`postId`, `userid`) USING BTREE,
ADD
  KEY `username` (`username`);
ALTER TABLE
  `comments`
MODIFY
  `id` int NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 80;
ALTER TABLE
  `comments`
ADD
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `Publications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;