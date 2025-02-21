-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: i12b207.p.ssafy.io    Database: conkiri
-- ------------------------------------------------------
-- Server version	8.0.4-rc-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
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
  `comment_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `modify_time` datetime(6) DEFAULT NULL,
  `write_time` datetime(6) DEFAULT NULL,
  `content` varchar(250) DEFAULT NULL,
  `sharing_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `FK4nhddlq7ejx4uexechepvu7ki` (`sharing_id`),
  KEY `FK8kcum44fvpupyw6f5baccx25c` (`user_id`),
  CONSTRAINT `FK4nhddlq7ejx4uexechepvu7ki` FOREIGN KEY (`sharing_id`) REFERENCES `sharing` (`sharing_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK8kcum44fvpupyw6f5baccx25c` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (19,'2025-02-18 09:09:03.668052','2025-02-18 09:09:03.668052','줄서봅니다~',30,1),(21,'2025-02-18 12:35:39.041533','2025-02-18 12:35:39.041533','저욥',30,20),(22,'2025-02-18 12:36:05.496703','2025-02-18 12:36:05.496703','와 감사합니다~',34,22),(23,'2025-02-18 12:42:59.644543','2025-02-18 12:42:59.644543','와 갖고싶어욥',30,4),(24,'2025-02-18 12:44:00.684544','2025-02-18 12:43:52.815326','혹시 남아있나요??',30,7),(27,'2025-02-18 12:50:36.947863','2025-02-18 12:50:36.947863','gdgd',30,2),(31,'2025-02-18 19:26:12.845803','2025-02-18 19:26:12.845803','저주세요',30,9),(39,'2025-02-20 23:22:14.066899','2025-02-20 23:22:14.066899','아주 기대됩니다!!',46,4),(40,'2025-02-21 10:36:19.871889','2025-02-21 10:36:19.871889','저 받고싶어요ㅜㅠㅜ',45,2),(43,'2025-02-21 11:27:12.245471','2025-02-21 11:27:12.245471','저 받고싶어요!',49,3);
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

-- Dump completed on 2025-02-21 11:27:50
