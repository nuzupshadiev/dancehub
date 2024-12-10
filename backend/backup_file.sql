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
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (1,3,'2024-11-22 12:32:33','1:10','1:13',3,'@Dongseop place your feet together',0,'2024-11-22 12:37:38'),(2,3,'2024-11-22 12:32:33','1:54','1:57',3,'timing is not right',1,'2024-11-22 12:38:01'),(3,3,'2024-11-22 12:32:33','2:11','2:15',3,'@sunghyeok spread your arms more',0,'2024-11-22 12:38:22'),(4,3,'2024-11-22 12:32:33','2:18','2:19',3,'spacing is not even',0,'2024-11-22 12:38:44'),(10,6,'2024-11-28 05:55:39','0:1','0:4',7,'It is first snow',1,'2024-11-28 05:56:38'),(11,6,'2024-11-28 05:55:39','0:1','0:4',7,'@Jeanne First snow',0,'2024-11-28 05:57:22'),(12,6,'2024-11-28 05:55:39','0:1','0:5',7,'#dance yay',0,'2024-11-28 06:15:11'),(13,1,'2024-11-21 15:20:21','0:1','0:2',2,'ㅁㄴㅇㄹ',0,'2024-12-01 13:45:44'),(14,7,'2024-12-02 14:11:46','0:1','0:5',8,'#fine its cool!',0,'2024-12-02 14:12:11'),(17,5,'2024-11-25 15:25:26','0:1','0:2',5,'asdfawef',0,'2024-12-04 12:29:00'),(18,5,'2024-11-25 15:25:26','0:0','0:1',5,'asdfawefawef',2,'2024-12-04 12:29:44'),(19,8,'2024-12-04 12:38:44','0:13','0:14',9,'awefawefawefwaefsad',0,'2024-12-04 12:40:30'),(20,8,'2024-12-04 12:38:44','0:1','0:2',9,'adfasdf',0,'2024-12-04 12:40:48'),(21,8,'2024-12-04 12:38:44','0:1','0:4',9,'asdgaweawefawefawefwef',0,'2024-12-04 12:41:41'),(22,8,'2024-12-04 12:42:03','0:1','0:2',9,'asdfawefawef',0,'2024-12-04 12:43:15'),(23,8,'2024-12-04 12:44:55','0:1','0:2',9,'asdfadfwaef',0,'2024-12-04 12:46:09'),(25,8,'2024-12-04 12:44:55','0:1','0:3',9,'asdfawefwe',0,'2024-12-04 13:03:14'),(30,5,'2024-11-25 15:25:26','0:0','0:1',5,'asdfawefawefawefawe',0,'2024-12-04 18:39:46'),(31,3,'2024-11-22 12:32:33','1:15','1:30',3,'kafkdfa',0,'2024-12-06 07:07:47'),(32,10,'2024-12-06 07:09:49','1:20','1:40',3,'#Spin mistake',0,'2024-12-06 07:11:22'),(33,3,'2024-11-22 12:32:33','1:59','1:0',3,'dkddjf',0,'2024-12-06 13:32:01'),(34,8,'2024-12-04 12:44:55','0:0','0:5',5,'asdfawef #tag',0,'2024-12-06 16:08:16'),(35,13,'2024-12-06 19:09:35','0:0','0:10',14,'awfwaefw e #tag1',1,'2024-12-06 19:10:01'),(38,13,'2024-12-06 19:09:35','0:0','0:1',14,'asdf',0,'2024-12-08 08:37:25'),(39,13,'2024-12-06 19:09:35','0:1','0:5',14,'asdf',0,'2024-12-08 08:42:03'),(40,13,'2024-12-06 19:09:35','0:1','0:5',14,'asdfwaewaef',0,'2024-12-08 08:42:07'),(41,13,'2024-12-06 19:09:35','0:1','0:5',14,'asdfsadfewaw',0,'2024-12-08 08:42:12'),(42,13,'2024-12-08 08:52:36','0:1','0:5',14,'asdf',0,'2024-12-08 08:53:52'),(43,13,'2024-12-08 08:52:36','0:1','0:5',14,'#tag1',0,'2024-12-08 13:26:59'),(44,12,'2024-12-06 15:45:33','0:22','0:24',13,'@Tom right leg needs to be more bended than left leg',0,'2024-12-09 06:06:13'),(46,12,'2024-12-06 15:45:33','0:23','0:25',13,'Eric face angle is different from others',0,'2024-12-09 06:18:33'),(47,12,'2024-12-06 15:45:33','0:49','0:50',13,'@Mary too fast',0,'2024-12-09 07:44:05'),(48,12,'2024-12-06 15:45:33','0:37','0:38',13,'@Tom @Sharon arm height is different',0,'2024-12-09 08:04:32'),(49,12,'2024-12-06 15:45:33','0:14','0:15',13,'@Sharon need to move head',0,'2024-12-09 08:08:49'),(50,12,'2024-12-06 15:45:33','1:30','1:31',13,'@Jane @Sharon #FootLift timing different',0,'2024-12-09 11:55:19'),(51,12,'2024-12-06 15:45:33','1:53','1:58',13,'@Tom #HandOnWaistPose mistake',0,'2024-12-09 11:38:19'),(52,12,'2024-12-06 15:45:33','1:59','2:2',13,'@Mary center not aligned',0,'2024-12-09 11:39:43'),(53,12,'2024-12-06 15:45:33','3:27','3:31',13,'@Sharon @Jane Timing is delayed',0,'2024-12-09 11:44:40'),(54,12,'2024-12-06 15:45:33','3:35','3:37',13,'@Rachel head returning time too fast',0,'2024-12-09 11:45:43'),(55,12,'2024-12-06 15:53:48','1:56','1:58',13,'@Tom #HandOnWaistPose Fixed!',0,'2024-12-09 11:52:08'),(56,12,'2024-12-06 15:53:48','1:32','1:32',13,'@Jane @Sharon #FootLift timing still different',0,'2024-12-09 11:55:03'),(57,12,'2024-12-06 15:45:33','0:34','0:40',16,'Love this part!',0,'2024-12-09 11:58:18'),(58,12,'2024-12-06 15:45:33','2:49','2:51',16,'Nice timing with music',0,'2024-12-09 12:00:11'),(59,12,'2024-12-06 15:45:33','1:10','1:12',15,'@Sharon nice solo',0,'2024-12-09 12:02:24'),(60,12,'2024-12-06 15:53:48','1:36','1:41',15,'@Mary so pretty',0,'2024-12-09 12:03:56'),(61,12,'2024-12-06 15:45:33','1:38','1:43',20,'Timing is great',0,'2024-12-09 12:05:14'),(62,12,'2024-12-06 15:53:48','0:12','0:16',20,'Nice moves everyone!',0,'2024-12-09 12:06:38'),(64,20,'2024-12-10 10:19:37','0:0','0:1',13,'#newtag',0,'2024-12-10 10:20:08'),(65,20,'2024-12-10 10:19:37','0:0','0:1',13,'#tag2',0,'2024-12-10 10:30:24'),(66,20,'2024-12-10 10:19:37','0:0','0:1',13,'#tag3 #tag4',0,'2024-12-10 10:40:05'),(68,21,'2024-12-10 12:35:55','0:0','0:1',1,'#tag1',0,'2024-12-10 12:37:23'),(69,21,'2024-12-10 12:35:55','0:0','0:1',1,'#tag1',0,'2024-12-10 12:37:36'),(71,22,'2024-12-10 12:45:52','1:1','1:18',1,'Hi #yes',0,'2024-12-10 12:46:16'),(72,22,'2024-12-10 12:45:52','1:1','1:10',1,'asd #portugal #monk',0,'2024-12-10 12:50:11');
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
INSERT INTO `comment_likes` VALUES (4,2),(7,10),(5,18),(9,18),(14,35);
/*!40000 ALTER TABLE `comment_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_tag`
--

DROP TABLE IF EXISTS `comment_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_tag` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `name` varchar(255) DEFAULT NULL COMMENT 'Name',
  `projectId` int DEFAULT NULL COMMENT 'Project Id',
  `videoId` int DEFAULT NULL COMMENT 'Video Id',
  `version` datetime DEFAULT NULL COMMENT 'Version',
  `commentId` int DEFAULT NULL COMMENT 'Comment Id',
  PRIMARY KEY (`id`),
  KEY `projectId` (`projectId`),
  KEY `videoId` (`videoId`),
  KEY `commentId` (`commentId`),
  CONSTRAINT `comment_tag_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_tag_ibfk_2` FOREIGN KEY (`videoId`) REFERENCES `video` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_tag_ibfk_3` FOREIGN KEY (`commentId`) REFERENCES `comment` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_tag`
--

LOCK TABLES `comment_tag` WRITE;
/*!40000 ALTER TABLE `comment_tag` DISABLE KEYS */;
INSERT INTO `comment_tag` VALUES (1,'#tag1',14,21,'2024-12-10 12:35:55',68),(2,'#tag1',14,21,'2024-12-10 12:35:55',69),(5,'#yes',15,22,'2024-12-10 12:45:52',71),(6,'portugal',15,22,'2024-12-10 12:45:52',72),(7,'monk',15,22,'2024-12-10 12:45:52',72);
/*!40000 ALTER TABLE `comment_tag` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (2,2,2),(3,2,3),(4,2,4),(5,3,5),(6,4,5),(8,5,7),(10,7,8),(11,7,5),(12,8,9),(13,9,7),(14,10,5),(15,1,10),(16,1,7),(17,13,11),(18,14,12),(19,15,11),(20,16,11),(21,17,11),(22,18,11),(23,19,11),(24,20,11),(25,13,13),(26,1,14),(27,1,15);
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (2,'asdf',2),(3,'asdf',2),(4,'asdfasdf',2),(5,'24 Spring',3),(7,'Test\'s project',5),(8,'Fake project',7),(9,'project1',8),(10,'aweafwwaef',1),(11,'My Project',13),(12,'newneoproj',14),(13,'test',13),(14,'testfortag',1),(15,'new project',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reply`
--

LOCK TABLES `reply` WRITE;
/*!40000 ALTER TABLE `reply` DISABLE KEYS */;
INSERT INTO `reply` VALUES (8,18,5,'wgwegwefasdf',0,'2024-11-25 15:25:26'),(9,18,9,'asdf',0,'2024-11-25 15:25:26'),(10,18,9,'asdgawefwefawefwef',0,'2024-11-25 15:25:26');
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
-- Table structure for table `reply_tag`
--

DROP TABLE IF EXISTS `reply_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reply_tag` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `name` varchar(255) DEFAULT NULL COMMENT 'Name',
  `projectId` int DEFAULT NULL COMMENT 'Project Id',
  `videoId` int DEFAULT NULL COMMENT 'Video Id',
  `version` datetime DEFAULT NULL COMMENT 'Version',
  `replyId` int DEFAULT NULL COMMENT 'Comment Id',
  PRIMARY KEY (`id`),
  KEY `projectId` (`projectId`),
  KEY `videoId` (`videoId`),
  KEY `replyId` (`replyId`),
  CONSTRAINT `reply_tag_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reply_tag_ibfk_2` FOREIGN KEY (`videoId`) REFERENCES `video` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reply_tag_ibfk_3` FOREIGN KEY (`replyId`) REFERENCES `reply` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reply_tag`
--

LOCK TABLES `reply_tag` WRITE;
/*!40000 ALTER TABLE `reply_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `reply_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `name` varchar(255) DEFAULT NULL COMMENT 'Name',
  `projectId` int DEFAULT NULL COMMENT 'Project Id',
  `videoId` int DEFAULT NULL COMMENT 'Video Id',
  `version` datetime DEFAULT NULL COMMENT 'Version',
  `refcount` int DEFAULT NULL COMMENT 'Reference Count',
  PRIMARY KEY (`id`),
  KEY `projectId` (`projectId`),
  KEY `videoId` (`videoId`),
  CONSTRAINT `tag_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tag_ibfk_2` FOREIGN KEY (`videoId`) REFERENCES `video` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Alice','alice@kaist.ac.kr','password','http://34.170.203.67:8000/static/images/profilePicture-1732158752191-30153798.png','2024-11-21 03:12:32'),(2,'asdf','asdf@kaist.ac.kr','asdf',NULL,'2024-11-21 15:17:37'),(3,'Director','director@kaist.ac.kr','director',NULL,'2024-11-22 12:14:12'),(4,'Dongseop','dongseop@kaist.ac.kr','dongseop',NULL,'2024-11-22 12:45:42'),(5,'Test','test@kaist.ac.kr','password',NULL,'2024-11-25 15:14:56'),(6,'nuzup','nuzup123@kaist.ac.kr','123',NULL,'2024-11-26 09:39:19'),(7,'Jeanne','jeannechoi@kaist.ac.kr','choi9969',NULL,'2024-11-28 05:51:39'),(8,'User1','user1@kaist.ac.kr','password',NULL,'2024-12-02 14:08:43'),(9,'Test2','test2@kaist.ac.kr','password',NULL,'2024-12-04 12:31:40'),(10,'user3','user3@kaist.ac.kr','password',NULL,'2024-12-04 12:47:51'),(11,'asdf12','asdf12@kaist.ac.kr','asdf',NULL,'2024-12-06 14:03:38'),(12,'test10','test10','password',NULL,'2024-12-06 14:06:24'),(13,'Director','test','test',NULL,'2024-12-06 15:19:08'),(14,'newneo','newneo@kaist.ac.kr','password',NULL,'2024-12-06 19:08:36'),(15,'Jane','jane','jane',NULL,'2024-12-09 06:08:17'),(16,'Mary','mary','mary',NULL,'2024-12-09 06:09:06'),(17,'Rachel','rachel','rachel',NULL,'2024-12-09 06:09:31'),(18,'Tom','tom','tom',NULL,'2024-12-09 06:09:54'),(19,'Sharon','sharon','sharon',NULL,'2024-12-09 06:10:19'),(20,'Eric','eric','eric',NULL,'2024-12-09 06:10:41');
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video`
--

LOCK TABLES `video` WRITE;
/*!40000 ALTER TABLE `video` DISABLE KEYS */;
INSERT INTO `video` VALUES (1,'2024-11-21 15:20:21','ㅁㄴㅇㄹㅁㄴㅇㄹ','ㅁㄴㅇㄹ',2,2,'http://34.170.203.67:8000/static/videos/videoFile-1732202421217-458118038.mp4',0),(2,'2024-11-21 15:33:09','asdf','asdf',2,4,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732203188508-516843181.mp4',0),(3,'2024-11-22 12:32:33','24/07/29-1','#11. Strawberry and Banana (Reprise)',3,5,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732278730874-36929968.mp4',0),(5,'2024-11-25 15:21:47','Perfect Choreo1','video 1 description',1,7,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732548107166-356818991.mp4',1),(5,'2024-11-25 15:25:26','Perfect Choreo1','video 1 description',5,7,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732548325968-336225984.mp4',1),(6,'2024-11-28 05:55:39','First','Snow',7,8,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732773339015-652392766.mov',0),(7,'2024-12-02 14:11:46','introduction','introduction for a fullstackgpt',8,9,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733148701255-649798583.mp4',0),(8,'2024-12-04 12:38:44','asdfawsedf','awefawefawef',9,7,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733315922282-512330709.mp4',1),(8,'2024-12-04 12:42:03','asdfawsedf','awefawefawef',9,7,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733316117646-994943682.mp4',0),(8,'2024-12-04 12:44:55','asdfawsedf','awefawefawef',9,7,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733316293987-460368876.mp4',0),(9,'2024-12-04 13:02:34','intro','introduction',1,10,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733317352286-445550081.mp4',0),(10,'2024-12-06 07:09:49','choreo','choreo',3,5,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733468971900-623775392.mp4',0),(10,'2024-12-06 07:12:17','choreo','choreo',3,5,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733469119142-610749781.mp4',0),(12,'2024-12-06 15:45:33','Waaking','24/12/07',13,11,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733499898322-480529989.mp4',0),(12,'2024-12-06 15:53:48','Waaking','24/12/07',13,11,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733500296562-498101394.mp4',0),(13,'2024-12-06 19:09:35','introduction','asdgwglsbdljs',14,12,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733512172325-44802563.mp4',0),(13,'2024-12-08 08:52:36','introduction','asdgwglsbdljs',14,12,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733647922171-289610944.mp4',0),(20,'2024-12-10 10:19:37','intro','introduction',13,13,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733825949477-340035808.mp4',0),(21,'2024-12-10 12:35:55','title','desc',1,14,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733834140432-343192267.mp4',0),(22,'2024-12-10 12:45:52','your video','This is a description',1,15,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733834750556-170429620.mp4',1);
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
INSERT INTO `video_likes` VALUES (5,5,'2024-11-25 15:25:26'),(9,8,'2024-12-04 12:38:44'),(1,22,'2024-12-10 12:45:52');
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

-- Dump completed on 2024-12-10 13:20:46
