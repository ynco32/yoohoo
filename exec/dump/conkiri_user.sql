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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `level` varchar(100) DEFAULT NULL,
  `nickname` varchar(100) DEFAULT NULL,
  `profile_url` varchar(255) DEFAULT NULL,
  `tier` varchar(100) DEFAULT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `review_count` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'janguk95@naver.com','4','기피가이트','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'장욱',53),(2,'gksmfthsus35@naver.com','3','럭77ㅣ','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'임강호',20),(3,'i1qopora@naver.com','1','미나리','http://k.kakaocdn.net/dn/bxiuVE/btsLCGBtcLf/dPjs4TYz6ENnATJwmrPNi0/img_640x640.jpg',NULL,'김미나',9),(4,'tty363@naver.com','1','반디집','http://k.kakaocdn.net/dn/BjGNo/btsLn5CtBE7/X8RYmWSRvubYOk4E960XqK/img_640x640.jpg',NULL,'최윤지(Yunji)',9),(5,'vvireason@icloud.com','4','영수','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'김수영',143),(6,'choikkbonv@naver.com','1','코끼리','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'최봉준',0),(7,'sozzykim@naver.com','1','탱그리','http://k.kakaocdn.net/dn/j3ilV/btsJuVugcoU/xTJnoKd95nLeM6IwH5tK1K/img_640x640.jpg',NULL,'소운',0),(8,'kub938@naver.com','1','kub938','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'김윤배',3),(9,'eddy152@nate.com','1','냐옹','http://k.kakaocdn.net/dn/hBBJ9/btssgJDJFOt/0E9sIHbZuak7KM0O6rfxJK/img_640x640.jpg',NULL,'이대현',0),(10,'gene1996@naver.com','1','선진','http://k.kakaocdn.net/dn/bFuZvg/btsL4HzM9BL/vhTYkPCPqLYs2GQKDagkhK/img_640x640.jpg',NULL,'선진',0),(11,'k2sc2000@nate.com','1','이대현은돼지다','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'김경환',0),(12,'hjw9265@naver.com','1','닉네임','http://k.kakaocdn.net/dn/2llcp/btsLbUm8v2T/sJc44n0r9O38AVRrwGY351/img_640x640.jpg',NULL,'황지원',0),(13,'ktylp0728@gmail.com','1','테스트','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'김태영',0),(14,'fpower_yoyng@naver.com','1','공쥬','http://k.kakaocdn.net/dn/AYLmI/btsLbTa2H2W/7jNPbwZNEnAgRsnCO72021/img_640x640.jpg',NULL,'이주영',8),(15,'tngoc@naver.com','1','해쑤','http://k.kakaocdn.net/dn/bGt4QR/btsLzXKs5ln/72PnDHMVSjNN9XPTNGaJQK/img_640x640.jpg',NULL,'이해수',1),(16,'pnlkc@naver.com','1','test','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'최지찬',0),(17,'khg3666@naver.com','1','김현지','http://k.kakaocdn.net/dn/bbFHnz/btsLgnVMyAy/ritrARYg4i6MYcTnER6jdK/img_640x640.jpg',NULL,'김현지',1),(18,'sam_wl@naver.com','1','누가','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'.',0),(19,'jungyew2@gmail.com','1','떼떼','http://k.kakaocdn.net/dn/u2b5G/btsLEYinqS4/mws0q3sP19WgYkh1LBCtJ0/img_640x640.jpg',NULL,'정예원',1),(20,'asd136479@naver.com','1','박프로','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'박상원',0),(21,'galaxy0_0@naver.com','1','안뇽안녕','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'장유진',0),(22,'2010gunz@naver.com','1','테스트1','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'김재현',0),(23,'gksgur1023@naver.com','1','박상희','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'박상희',1),(24,'mingung0402@naver.com','1',NULL,'http://k.kakaocdn.net/dn/ivMBL/btsMd9icXKP/w9QkSxmYRPtQhrPbfqvUc0/img_640x640.jpg',NULL,'김민경',0),(25,'zz262zz@naver.com','1','광주의간판','http://k.kakaocdn.net/dn/cmRNda/btsH5PO9Z7M/TAg6sd8rE2BDyLdru71uQ1/img_640x640.jpg',NULL,'이준익',0),(26,'wsbk5397@naver.com','1','안뇽','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'이경석',0),(27,'se_jung95@naver.com','1','asd','http://k.kakaocdn.net/dn/boGFY5/btsHSxuN3Pn/tmZbtxHiyFyEtT3oCzyP01/img_640x640.jpg',NULL,'세중',0),(28,'beauifuluk@hanmail.net','1','유곡','http://k.kakaocdn.net/dn/CGDcP/btq0BJwX6Lw/SOsOf6xxOFrVpsV7skcxZk/img_640x640.jpg',NULL,'장병현',0),(29,'lotus1343@naver.com','1','와우','http://k.kakaocdn.net/dn/h8KjR/btsAmEu6xvG/rlurtYG8stKITo6aphNxdK/img_640x640.jpg',NULL,'박영애',0),(30,'tkdgh6427@naver.com','1','심규비니시우스주니어','http://k.kakaocdn.net/dn/pYnYR/btsLiNaBGMj/6jA6gi0Y4OyRPAaDSfA5v0/img_640x640.jpg',NULL,'이상호',0),(31,'dalim00@naver.com','1','몽가','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'백하영',0),(32,'skb0516@naver.com','1','죽것슈','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'심규빈',0),(33,'hhy1620@korea.kr','1','나요','http://k.kakaocdn.net/dn/sd22q/btsLQiUWLvC/WtYAaNZEGat2gHXilVYC11/img_640x640.jpg',NULL,'황혜연',0),(34,'rnjsgy21@naver.com','1','효댕구','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'권효정',0),(35,'gory0330@naver.com','1','비커','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'전유경',0),(36,'ari0630200@gmail.com','1','머장햄','http://k.kakaocdn.net/dn/epbqnb/btsJfb4DQ75/7OVkWKYUvYkdLpkJLNk7p0/img_640x640.jpg',NULL,'정재연',0),(37,'yhc9595@naver.com','1','왈라b','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'유해찬',0),(38,'khjlmy0421@naver.com','1',NULL,'http://k.kakaocdn.net/dn/bNv1Oj/btsKCeNGF0L/xZPbGqO7T9fGSf9vpwzkMk/m1.jpg',NULL,'김호정',0),(39,'boun00@naver.com','1','yb','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'윤보은',0),(40,'z920414@naver.com','1','고소운','http://k.kakaocdn.net/dn/nCRra/btsKFmb8MQ0/26oXNTYhQlFxEEbyb0JktK/img_640x640.jpg',NULL,'박태정',0),(41,'himinwoo7@gmail.com','1','모시모시','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'이민우',0),(42,'yechan0319@naver.com','1','예찬','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'신예찬',0),(43,'junhakjh@naver.com','1','이든','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'김준하',0),(44,'rmsckd12@nate.com','1','두더지','http://k.kakaocdn.net/dn/bFDT1I/btsLUIfjY3z/pz73OfKbOOeEe4kt1HsKD1/img_640x640.jpg',NULL,'서윤',0),(45,'glow3278@gmail.com','1','병조와진형이','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'asdsa',0),(46,'syd01022@naver.com','1','뚜부칩','http://k.kakaocdn.net/dn/j0CR2/btsL19wOHum/zxkjYRpj2EMEycim6YI1FK/img_640x640.jpg',NULL,'편정웅',0),(47,'rmsgnl11@nate.com','1','250221','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'김근휘',0),(48,'bae990504@nate.com','1','우리민족끼리','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'배한진',0),(49,'mdsoo55828@naver.com','1','간장게장','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'찬우',0),(50,'big9810@naver.com','1','선을보면넘고싶음','http://k.kakaocdn.net/dn/qTOk5/btsL2JETYGZ/UwmZHd8Kxnrpzu6MkXnMDK/img_640x640.jpg',NULL,'편민준',0),(51,'tlsehd5454@naver.com','1','운동신','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'신동운',0),(52,'zettocean@naver.com','1','B209','http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'조기흠',0),(53,'dydtns9815@gmail.com','1','순글','http://k.kakaocdn.net/dn/9vQ4R/btsLjERnDYr/cXDNYvkkxiDcXNfTAPUtX1/img_640x640.jpg',NULL,'용순',0),(54,'hyemin3699@kakao.com','1','혜미닝','http://k.kakaocdn.net/dn/bGHBM8/btsLa8LS2lI/ykQ8ne8mMYksq9zU80FYJ0/img_640x640.jpg',NULL,'혜민',0),(55,'enderstream00@kakao.com','1','겨울나루','http://k.kakaocdn.net/dn/bBn29C/btsKAhXcGVm/6vgBLrukkB6zP9LqxtIU50/img_640x640.jpg',NULL,'권동환',0),(56,'shine8648@naver.com','1','호이이','http://k.kakaocdn.net/dn/sRCTI/btsL3rQQTpa/F0bAw8XHKBTYxKQhKeAqR0/img_640x640.jpg',NULL,'최현정',0),(57,'47rhdwn@naver.com','1','안뇽하세욧','http://k.kakaocdn.net/dn/y8PrE/btsLhwFfxkM/YB6zWuZFf2rkWtulYG0Pzk/img_640x640.jpg',NULL,'이유리',0),(58,'rlatjdals369@naver.com','1','잎새주','http://k.kakaocdn.net/dn/L4oBI/btsLxMhvEFk/I9RPJbIZCRMhcaY44FcGAk/img_640x640.jpg',NULL,'김성민',0),(59,'konzo321@naver.com','1','dkdk','http://k.kakaocdn.net/dn/saipK/btsIRnTdFFF/Qm4lViCTSV3Fl1qnBcyOK0/img_640x640.jpg',NULL,'고대권',0),(60,'chansoon7651@gmail.com','1',NULL,'http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg',NULL,'정찬호',0),(61,'99minj0731@naver.com','1','민뚱','http://k.kakaocdn.net/dn/n8PEO/btsKOAvFtm8/Er7qt5YWQQQfubxbIFZr91/img_640x640.jpg',NULL,'김민정',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21 11:27:53
