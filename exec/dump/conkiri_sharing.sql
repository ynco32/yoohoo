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
-- Table structure for table `sharing`
--

DROP TABLE IF EXISTS `sharing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sharing` (
  `sharing_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `modify_time` datetime(6) DEFAULT NULL,
  `write_time` datetime(6) DEFAULT NULL,
  `content` varchar(500) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `photo_url` varchar(250) DEFAULT NULL,
  `start_time` datetime(6) DEFAULT NULL,
  `status` enum('CLOSED','ONGOING','UPCOMING') DEFAULT 'UPCOMING',
  `title` varchar(100) DEFAULT NULL,
  `concert_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`sharing_id`),
  KEY `FKffv6ddu132ie66uyy80qryc83` (`concert_id`),
  KEY `FKb6lnq5lh9klrgdkx854j9cry1` (`user_id`),
  CONSTRAINT `FKb6lnq5lh9klrgdkx854j9cry1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKffv6ddu132ie66uyy80qryc83` FOREIGN KEY (`concert_id`) REFERENCES `concert` (`concert_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sharing`
--

LOCK TABLES `sharing` WRITE;
/*!40000 ALTER TABLE `sharing` DISABLE KEYS */;
INSERT INTO `sharing` VALUES (30,'2025-02-18 11:03:35.562303','2025-02-17 22:33:18.136085','선착순 주차장 옆으로 오세요~!! ',37.518600380614245,127.1282019019229,'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/sharing/2025/02/18/11/5fcad01b-c749-44e7-a5c5-2184fd4eac53_image.jpg','2025-02-28 16:00:00.000000','UPCOMING','직접 만든 팔찌 나눔합니다',425,3),(33,'2025-02-18 12:33:18.975736','2025-02-18 12:33:18.975736','ㅇㅇ',37.518796654947174,127.12791944294473,'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/sharing/2025/02/18/12/04d0bcc1-c454-44b7-b977-6d67dd3bc70c_IMG_4038.jpeg','2025-03-08 00:20:00.000000','UPCOMING','나눔',429,20),(34,'2025-02-18 12:37:04.528816','2025-02-18 12:35:12.477325','테스트',37.51924,127.127343,'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/sharing/2025/02/18/12/cd27a1e8-2755-45f2-9930-802e4c32c231_IMG_0287.jpeg','2025-02-28 00:00:00.000000','CLOSED','아메',425,21),(41,'2025-02-20 16:37:21.284534','2025-02-20 16:37:03.574218','제이홉 포토카드 나눔합니다~!! 딱 5분에게만 나눔할거니까 얼른 오세요! ',37.518642062833486,127.12714997884736,'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/sharing/2025/02/20/16/90f5bf86-e9ab-49e3-9665-fd2e2e194da9_IMG_4308.jpeg','2025-02-28 11:00:00.000000','CLOSED','?️ 홉 포토카드 나눔합니다~!!',425,7),(42,'2025-02-20 22:41:56.729402','2025-02-20 22:39:12.990709','선착순 10명 정도 드려요\n공원 앞에서 4시에 나눔하겠습니다!?',37.5182327299958,127.12656955937192,'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/sharing/2025/02/20/22/9d6327a9-9db4-4ef2-9e58-650b1bff0177_20241220_193329.jpg','2025-03-07 16:00:00.000000','UPCOMING','직접 만든 팔찌 나눔합니다!',428,3),(44,'2025-02-20 23:04:13.654997','2025-02-20 22:40:04.399740','올콘 기념으로 투명 포카 소량으로 제작해보았습니다!\n금손이 아니여서 조금 민망하지만\n?‍♀️?‍♀️?‍♀️?‍♀️?‍♀️?‍♀️?‍♀️?‍♀️?‍♀️?‍♀️\n1인 1포카 나눔입니다!!',37.51865332230226,127.12715282589475,'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/sharing/2025/02/20/22/23abf1f5-b298-40a3-a818-5360c8e9bfa3_image.jpg','2025-03-07 11:00:00.000000','UPCOMING','태연 투명 포카 나눔합니다!!',428,7),(45,'2025-02-20 23:04:06.642388','2025-02-20 22:46:26.085584','탱탄절 포카홀더 나눔합니다 소량(5개)이므로 인증 기준을 조금 높여서 받습니다!\n\n당일 콘서트 티켓 + 공식 응원봉\nLetter to my self 스트리밍 1004회 이상 태연버블 100일 이상',37.518764721181874,127.12828702147864,'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/sharing/2025/02/20/22/f715b285-b1d7-444d-8b1c-3385450920f4_IMG_4330.jpeg','2025-03-07 13:30:00.000000','UPCOMING','?Taeyeon concert - The tense 나눔?',428,7),(46,'2025-02-20 22:48:02.911762','2025-02-20 22:48:02.911762','수량: 30개(3종 중 1개, 랜덤)\n* 공식포카는 선착순 7분께 드립니다.',37.51880782861117,127.12800147251531,'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/sharing/2025/02/20/22/7843d09c-1644-4fd5-bb3d-de4067db1478_IMG_4328.jpeg','2025-03-07 14:00:00.000000','UPCOMING','?필름 북마크와 공식포카 나눔합니다?',428,7),(47,'2025-02-20 22:51:10.997388','2025-02-20 22:51:10.997388','태연 콘서트에서 TY 아이러브핀 뱃지 나눔합니다\n※ 수량 : 소량 각 15set/ size 44mm',37.51904385321675,127.12845152085856,'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/sharing/2025/02/20/22/8ad77c03-7ff2-4e7a-9bd8-5ec4dd7f2dea_IMG_4332.jpeg','2025-03-07 13:40:00.000000','UPCOMING','?I?TY 아이러브핀 뱃지 나눔합니다',428,7),(49,'2025-02-21 10:36:55.866549','2025-02-21 10:36:55.866549','선착순 3명 급구',37.52012114587527,127.12580636171218,'https://ssfafy-common-pjt-conkiri.s3.ap-northeast-2.amazonaws.com/sharing/2025/02/21/10/c2411d8b-c7a4-4bfd-99ab-41b9ed556838_E283E5F2-F5E9-4D16-9069-6F66A648228B.jpg','2025-03-07 15:00:00.000000','UPCOMING','포토카드 나눔',428,2);
/*!40000 ALTER TABLE `sharing` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21 11:27:54
