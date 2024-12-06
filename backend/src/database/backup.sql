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
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (1,3,'2024-11-22 12:32:33','1:10','1:13',3,'@Dongseop place your feet together',0,'2024-11-22 12:37:38'),(2,3,'2024-11-22 12:32:33','1:54','1:57',3,'timing is not right',1,'2024-11-22 12:38:01'),(3,3,'2024-11-22 12:32:33','2:11','2:15',3,'@sunghyeok spread your arms more',0,'2024-11-22 12:38:22'),(4,3,'2024-11-22 12:32:33','2:18','2:19',3,'spacing is not even',0,'2024-11-22 12:38:44'),(5,4,'2024-11-23 07:09:15','1:1','1:38',1,'asd',2,'2024-11-25 12:50:53'),(12,8,'2024-11-26 01:18:16','00:12','00:28',5,'Alice likes this!',0,'2024-11-26 01:18:40'),(14,4,'2024-11-23 07:09:15','00:12','00:28',5,'Alice likes this!',0,'2024-12-01 17:25:40'),(16,4,'2024-11-23 07:09:15','00:12','00:28',5,'Alice likes this!',0,'2024-12-01 17:30:02'),(19,4,'2024-11-23 07:09:15','00:12','00:28',5,'Alice likes this!',0,'2024-12-01 17:58:22');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `comment_likes`
--

LOCK TABLES `comment_likes` WRITE;
/*!40000 ALTER TABLE `comment_likes` DISABLE KEYS */;
INSERT INTO `comment_likes` VALUES (4,2),(1,5),(5,5);
/*!40000 ALTER TABLE `comment_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,1,1),(2,2,2),(3,2,3),(4,2,4),(5,3,5),(6,4,5),(8,5,7),(9,5,8);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (1,'123',1),(2,'asdf',2),(3,'asdf',2),(4,'asdfasdf',2),(5,'24 Spring',3),(7,'Test\'s project',5),(8,'Test\'s project',5);
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reply`
--

LOCK TABLES `reply` WRITE;
/*!40000 ALTER TABLE `reply` DISABLE KEYS */;
INSERT INTO `reply` VALUES (3,12,5,'I really like this comment',0,'2024-11-27 02:48:11'),(4,12,5,'I really like this comment',0,'2024-12-01 17:35:44'),(5,12,5,'I really like this comment',0,'2024-12-01 17:35:48'),(6,12,5,'I really like this comment',0,'2024-12-01 17:54:31'),(7,12,5,'I really like this comment',0,'2024-12-01 17:54:57'),(8,12,5,'I really like this comment',0,'2024-12-01 17:55:40'),(9,12,5,'I really like this comment',0,'2024-12-01 17:56:07'),(10,12,5,'I really like this comment',0,'2024-12-01 17:56:15'),(11,12,5,'I really like this comment',0,NULL),(12,19,5,'I really like this comment',0,NULL),(13,19,5,'I really like this comment',0,'2024-11-23 07:09:15'),(14,19,5,'I really like this comment',0,'2024-11-23 07:09:15'),(15,19,5,'I really like this comment',0,'2024-11-23 07:09:15'),(16,19,5,'I really like this comment!!!',0,'2024-12-01 18:02:59'),(17,19,5,'I really like this comment!!!',0,'2024-12-01 18:03:13'),(18,5,5,'I really like this comment!!!',0,'2024-12-01 18:04:05'),(19,5,5,'I really like this comment!!!',0,'2024-12-01 18:05:27'),(22,5,5,'I really like this comment',0,'2024-11-23 07:09:15');
/*!40000 ALTER TABLE `reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reply_likes`
--

LOCK TABLES `reply_likes` WRITE;
/*!40000 ALTER TABLE `reply_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `reply_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES (5,'tag1',1,4,'2024-11-23 07:09:15',3),(6,'tag2',1,4,'2024-11-23 07:09:15',10),(8,'tag3',1,4,'2024-11-23 07:09:15',2),(10,'tag1',7,8,'2024-12-01 17:55:40',1),(11,'tag2',7,8,'2024-12-01 17:55:40',1),(12,'tag3',7,8,'2024-12-01 17:56:07',1),(13,'tag4',7,8,'2024-12-01 17:56:07',1),(14,'tag2',7,8,'2024-12-01 17:56:15',1),(15,'tag3',7,8,'2024-12-01 17:56:15',1),(16,'tag2',7,8,NULL,1),(17,'tag3',7,8,NULL,1),(18,'tag2',1,4,NULL,1),(19,'tag3',1,4,NULL,1),(22,'tag10',1,4,'2024-11-23 07:09:15',1),(23,'tag20',1,4,'2024-11-23 07:09:15',1);
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Alice','alice@kaist.ac.kr','password','http://34.170.203.67:8000/static/images/profilePicture-1732158752191-30153798.png','2024-11-21 03:12:32'),(2,'asdf','asdf@kaist.ac.kr','asdf',NULL,'2024-11-21 15:17:37'),(3,'Director','director@kaist.ac.kr','director',NULL,'2024-11-22 12:14:12'),(4,'Dongseop','dongseop@kaist.ac.kr','dongseop',NULL,'2024-11-22 12:45:42'),(5,'Test','test@kaist.ac.kr','password',NULL,'2024-11-26 00:48:59');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `video`
--

LOCK TABLES `video` WRITE;
/*!40000 ALTER TABLE `video` DISABLE KEYS */;
INSERT INTO `video` VALUES (1,'2024-11-21 15:20:21','ㅁㄴㅇㄹㅁㄴㅇㄹ','ㅁㄴㅇㄹ',2,2,'http://34.170.203.67:8000/static/videos/videoFile-1732202421217-458118038.mp4',0),(2,'2024-11-21 15:33:09','asdf','asdf',2,4,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732203188508-516843181.mp4',0),(3,'2024-11-22 12:32:33','24/07/29-1','#11. Strawberry and Banana (Reprise)',3,5,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732278730874-36929968.mp4',0),(4,'2024-11-23 07:09:15','nuzup','ohi',1,1,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732345754236-960967053.mp4',0),(8,'2024-11-26 01:18:16','Perfect Choreo1','video 1 description',5,7,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732551495978-46440004.mp4',0),(9,'2024-11-27 03:11:33','Perfect Choreo1','video 1 description',5,7,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732644692994-161280005.mp4',0),(10,'2024-11-27 03:11:35','Perfect Choreo1','video 1 description',5,7,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732644695002-741899882.mp4',0),(10,'2024-11-27 03:11:46','Perfect Choreo1','video 1 description',5,7,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732644706361-658519654.mp4',0),(10,'2024-11-27 03:11:49','Perfect Choreo1','video 1 description',5,7,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1732644708656-725771627.mp4',0),(11,'2024-12-05 03:16:12','Perfect Choreo1','video 1 description',5,1,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733336172403-105351974.mp4',0),(12,'2024-12-05 03:16:14','Perfect Choreo1','video 1 description',5,1,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733336173556-904228678.mp4',0),(13,'2024-12-05 03:16:15','Perfect Choreo1','video 1 description',5,1,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733336174663-349075633.mp4',0),(13,'2024-12-05 03:16:42','Perfect Choreo1','video 1 description',5,1,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733336202397-92207988.mp4',0),(13,'2024-12-05 03:16:43','Perfect Choreo1','video 1 description',5,1,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733336203398-262395508.mp4',0),(13,'2024-12-05 03:16:44','Perfect Choreo1','video 1 description',5,1,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733336204406-751620243.mp4',0),(13,'2024-12-05 03:16:47','Perfect Choreo1','video 1 description',5,1,'https://dancehub-backend.run.goorm.site/static/videos/videoFile-1733336206559-665897269.mp4',0);
/*!40000 ALTER TABLE `video` ENABLE KEYS */;
UNLOCK TABLES;

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

-- Dump completed on 2024-12-07  1:18:20
