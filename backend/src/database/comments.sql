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
INSERT INTO `comment` VALUES (44,12,'2024-12-06 15:45:33','0:22','0:24',13,'@Tom right leg needs to be more bended than left leg',0,'2024-12-09 06:06:13'),(46,12,'2024-12-06 15:45:33','0:23','0:25',13,'Eric face angle is different from others',0,'2024-12-09 06:18:33'),(47,12,'2024-12-06 15:45:33','0:49','0:50',13,'@Mary too fast',0,'2024-12-09 07:44:05'),(48,12,'2024-12-06 15:45:33','0:37','0:38',13,'@Tom @Sharon arm height is different',0,'2024-12-09 08:04:32'),(49,12,'2024-12-06 15:45:33','0:14','0:15',13,'@Sharon need to move head',0,'2024-12-09 08:08:49'),(50,12,'2024-12-06 15:45:33','1:30','1:31',13,'@Jane @Sharon #FootLift timing different',0,'2024-12-09 11:55:19'),(51,12,'2024-12-06 15:45:33','1:53','1:58',13,'@Tom #HandOnWaistPose mistake',0,'2024-12-09 11:38:19'),(52,12,'2024-12-06 15:45:33','1:59','2:2',13,'@Mary center not aligned',0,'2024-12-09 11:39:43'),(53,12,'2024-12-06 15:45:33','3:27','3:31',13,'@Sharon @Jane Timing is delayed',0,'2024-12-09 11:44:40'),(54,12,'2024-12-06 15:45:33','3:35','3:37',13,'@Rachel head returning time too fast',0,'2024-12-09 11:45:43'),(55,12,'2024-12-06 15:53:48','1:56','1:58',13,'@Tom #HandOnWaistPose Fixed!',0,'2024-12-09 11:52:08'),(56,12,'2024-12-06 15:53:48','1:32','1:32',13,'@Jane @Sharon #FootLift timing still different',0,'2024-12-09 11:55:03'),(57,12,'2024-12-06 15:45:33','0:34','0:40',16,'Love this part!',0,'2024-12-09 11:58:18'),(58,12,'2024-12-06 15:45:33','2:49','2:51',16,'Nice timing with music',0,'2024-12-09 12:00:11'),(59,12,'2024-12-06 15:45:33','1:10','1:12',15,'@Sharon nice solo',0,'2024-12-09 12:02:24'),(60,12,'2024-12-06 15:53:48','1:36','1:41',15,'@Mary so pretty',0,'2024-12-09 12:03:56'),(61,12,'2024-12-06 15:45:33','1:38','1:43',20,'Timing is great',0,'2024-12-09 12:05:14'),(62,12,'2024-12-06 15:53:48','0:12','0:16',20,'Nice moves everyone!',0,'2024-12-09 12:06:38');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-10 23:27:57
