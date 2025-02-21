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
-- Table structure for table `arena`
--

DROP TABLE IF EXISTS `arena`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arena` (
  `arena_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `arena_name` varchar(100) DEFAULT NULL,
  `photo_url` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`arena_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arena`
--

LOCK TABLES `arena` WRITE;
/*!40000 ALTER TABLE `arena` DISABLE KEYS */;
INSERT INTO `arena` VALUES (1,'KSPO DOME','https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/arena/kspo.png'),(2,'잠실 주경기장','https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/arena/%EC%9E%A0%EC%8B%A4.png'),(3,'상암 월드컵 경기장','https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/arena/%EC%83%81%EC%95%94.jpg'),(4,'고척스카이돔','https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/arena/%EA%B3%A0%EC%B2%99.png'),(5,'SK 핸드볼 경기장','https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/arena/%ED%95%B8%EB%93%9C%EB%B3%BC.png'),(6,'인스파이어 아레나','https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/arena/%EC%9D%B8%EC%8A%A4%ED%8C%8C%EC%9D%B4%EC%96%B4.jpg');
/*!40000 ALTER TABLE `arena` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21 11:27:52
