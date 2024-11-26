-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: localhost    Database: social_computing
-- ------------------------------------------------------
-- Server version	8.0.40-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `videoId` int DEFAULT NULL COMMENT 'Video Id',
  `version` datetime DEFAULT NULL COMMENT 'Version',
  `start` varchar(10) DEFAULT NULL COMMENT 'Start Time',
  `end` varchar(10) DEFAULT NULL COMMENT 'End Time',
  `userId` int DEFAULT NULL COMMENT 'User Id',
  `content` varchar(255) DEFAULT NULL COMMENT 'Content',
  `likes` int DEFAULT NULL COMMENT 'Likes',
  `modifiedAt` datetime DEFAULT NULL COMMENT 'Modified Time',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `videoId` (`videoId`,`version`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`videoId`, `version`) REFERENCES `video` (`id`, `version`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (1,3,'2024-11-22 12:32:33','1:10','1:13',3,'@Dongseop place your feet together',0,'2024-11-22 12:37:38'),(2,3,'2024-11-22 12:32:33','1:54','1:57',3,'timing is not right',1,'2024-11-22 12:38:01'),(3,3,'2024-11-22 12:32:33','2:11','2:15',3,'@sunghyeok spread your arms more',0,'2024-11-22 12:38:22'),(4,3,'2024-11-22 12:32:33','2:18','2:19',3,'spacing is not even',0,'2024-11-22 12:38:44'),(5,4,'2024-11-23 07:09:15','1:1','1:38',1,'asd',0,'2024-11-25 12:50:53');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_likes`
--

DROP TABLE IF EXISTS `comment_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_likes` (
  `userId` int NOT NULL COMMENT 'User Id',
  `commentId` int NOT NULL COMMENT 'Comment Id',
  PRIMARY KEY (`userId`,`commentId`),
  KEY `commentId` (`commentId`),
  CONSTRAINT `comment_likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_likes_ibfk_2` FOREIGN KEY (`commentId`) REFERENCES `comment` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_likes`
--

LOCK TABLES `comment_likes` WRITE;
/*!40000 ALTER TABLE `comment_likes` DISABLE KEYS */;
INSERT INTO `comment_likes` VALUES (4,2);
/*!40000 ALTER TABLE `comment_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `userId` int DEFAULT NULL COMMENT 'User Id',
  `projectId` int DEFAULT NULL COMMENT 'Project Id',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `projectId` (`projectId`),
  CONSTRAINT `member_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `member_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,1,1),(2,2,2),(3,2,3),(4,2,4),(5,3,5),(6,4,5);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `title` varchar(255) DEFAULT NULL COMMENT 'Title',
  `administratorId` int DEFAULT NULL COMMENT 'Administrator Id',
  PRIMARY KEY (`id`),
  KEY `administratorId` (`administratorId`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`administratorId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (1,'123',1),(2,'asdf',2),(3,'asdf',2),(4,'asdfasdf',2),(5,'24 Spring',3);
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reply`
--

DROP TABLE IF EXISTS `reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reply` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `commentId` int DEFAULT NULL COMMENT 'Video Id',
  `userId` int DEFAULT NULL COMMENT 'User Id',
  `content` varchar(255) DEFAULT NULL COMMENT 'Content',
  `likes` int DEFAULT NULL COMMENT 'Likes',
  `modifiedAt` datetime DEFAULT NULL COMMENT 'Modified Time',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `commentId` (`commentId`),
  CONSTRAINT `reply_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reply_ibfk_2` FOREIGN KEY (`commentId`) REFERENCES `comment` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reply`
--

LOCK TABLES `reply` WRITE;
/*!40000 ALTER TABLE `reply` DISABLE KEYS */;
/*!40000 ALTER TABLE `reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reply_likes`
--

DROP TABLE IF EXISTS `reply_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reply_likes` (
  `userId` int NOT NULL COMMENT 'User Id',
  `replyId` int NOT NULL COMMENT 'Reply Id',
  PRIMARY KEY (`userId`,`replyId`),
  KEY `replyId` (`replyId`),
  CONSTRAINT `reply_likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reply_likes_ibfk_2` FOREIGN KEY (`replyId`) REFERENCES `reply` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reply_likes`
--

LOCK TABLES `reply_likes` WRITE;
/*!40000 ALTER TABLE `reply_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `reply_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL COMMENT 'Email',
  `password` varchar(255) DEFAULT NULL COMMENT 'Password',
  `profilePicture` varchar(255) DEFAULT NULL COMMENT 'Profile Picture',
  `createdAt` datetime DEFAULT NULL COMMENT 'Create Time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Alice','alice@kaist.ac.kr','password','http://34.170.203.67:8000/static/images/profilePicture-1732158752191-30153798.png','2024-11-21 03:12:32'),(2,'asdf','asdf@kaist.ac.kr','asdf',NULL,'2024-11-21 15:17:37'),(3,'Director','director@kaist.ac.kr','director',NULL,'2024-11-22 12:14:12'),(4,'Dongseop','dongseop@kaist.ac.kr','dongseop',NULL,'2024-11-22 12:45:42');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video`
--

DROP TABLE IF EXISTS `video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `version` datetime NOT NULL COMMENT 'Version',
  `title` varchar(255) DEFAULT NULL COMMENT 'Title',
  `description` varchar(255) DEFAULT NULL COMMENT 'Description',
  `uploaderId` int DEFAULT NULL COMMENT 'Uploader Id',
  `projectId` int DEFAULT NULL COMMENT 'Project Id',
  `videoUrl` varchar(255) DEFAULT NULL COMMENT 'Video Url',
  `likes` int DEFAULT NULL COMMENT 'Likes',
  PRIMARY KEY (`id`,`version`),
  KEY `uploaderId` (`uploaderId`),
  KEY `projectId` (`projectId`),
  CONSTRAINT `video_ibfk_1` FOREIGN KEY (`uploaderId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `video_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video`
--

LOCK TABLES `video` WRITE;
/*!40000 ALTER TABLE `video` DISABLE KEYS */;
INSERT INTO `video` VALUES (1,'2024-11-21 15:20:21','ㅁㄴㅇㄹㅁㄴㅇㄹ','ㅁㄴㅇㄹ',2,2,'http://34.170.203.67:8000/static/videos/videoFile-1732202421217-458118038.mp4',0),(2,'2024-11-21 15:33:09','asdf','asdf',2,4,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732203188508-516843181.mp4',0),(3,'2024-11-22 12:32:33','24/07/29-1','#11. Strawberry and Banana (Reprise)',3,5,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732278730874-36929968.mp4',0),(4,'2024-11-23 07:09:15','nuzup','ohi',1,1,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732345754236-960967053.mp4',0);
/*!40000 ALTER TABLE `video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video_likes`
--

DROP TABLE IF EXISTS `video_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video_likes` (
  `userId` int NOT NULL COMMENT 'User Id',
  `videoId` int NOT NULL COMMENT 'Video Id',
  `version` datetime NOT NULL COMMENT 'Version',
  PRIMARY KEY (`userId`,`videoId`,`version`),
  KEY `videoId` (`videoId`,`version`),
  CONSTRAINT `video_likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `video_likes_ibfk_2` FOREIGN KEY (`videoId`, `version`) REFERENCES `video` (`id`, `version`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video_likes`
--

LOCK TABLES `video_likes` WRITE;
/*!40000 ALTER TABLE `video_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `video_likes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-25 13:51:32
