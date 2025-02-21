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
-- Table structure for table `scrap_seat`
--

DROP TABLE IF EXISTS `scrap_seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scrap_seat` (
  `scrap_seat_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `seat_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `stage_type` enum('ALL','DEGREE_360','EXTENDED','STANDARD') DEFAULT NULL,
  PRIMARY KEY (`scrap_seat_id`),
  KEY `FKomgyw7fi94rdygnoggngdll6t` (`seat_id`),
  KEY `FKqmv3qj6yvd3uipskm8m2dixgn` (`user_id`),
  CONSTRAINT `FKomgyw7fi94rdygnoggngdll6t` FOREIGN KEY (`seat_id`) REFERENCES `seat` (`seat_id`),
  CONSTRAINT `FKqmv3qj6yvd3uipskm8m2dixgn` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scrap_seat`
--

LOCK TABLES `scrap_seat` WRITE;
/*!40000 ALTER TABLE `scrap_seat` DISABLE KEYS */;
INSERT INTO `scrap_seat` VALUES (1,137,4,'DEGREE_360'),(2,233,4,'DEGREE_360'),(3,195,1,'DEGREE_360'),(4,147,4,'DEGREE_360'),(5,4861,4,'DEGREE_360'),(6,4892,4,'DEGREE_360'),(9,50,4,'ALL'),(10,121,4,'ALL'),(11,289,4,'ALL'),(13,2135,4,'EXTENDED'),(14,561,4,'EXTENDED'),(15,1,3,'ALL'),(16,143,16,'ALL'),(19,2917,4,'ALL'),(20,4246,21,'EXTENDED'),(23,525,2,'ALL'),(24,148,2,'ALL'),(28,1082,4,'ALL'),(29,1165,4,'ALL'),(30,525,1,'DEGREE_360'),(31,5765,4,'ALL'),(32,167,4,'ALL'),(34,426,4,'ALL'),(36,6685,4,'ALL'),(37,10697,3,'ALL'),(38,9618,4,'ALL'),(39,671,2,'ALL'),(40,698,2,'ALL'),(41,148,4,'ALL'),(42,8825,7,'ALL'),(44,790,4,'EXTENDED'),(45,3233,4,'EXTENDED'),(46,1256,5,'EXTENDED'),(47,1294,3,'EXTENDED'),(48,9451,4,'EXTENDED'),(49,9566,4,'EXTENDED'),(50,9574,4,'EXTENDED'),(51,9696,4,'EXTENDED'),(52,9671,4,'EXTENDED'),(53,671,4,'ALL'),(54,1805,4,'ALL'),(55,1047,4,'EXTENDED'),(58,1294,2,'EXTENDED'),(59,1480,5,'ALL');
/*!40000 ALTER TABLE `scrap_seat` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21 11:27:55
