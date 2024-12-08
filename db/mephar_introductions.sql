-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 103.75.180.105    Database: mephar
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.20.04.1

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
-- Table structure for table `introductions`
--

DROP TABLE IF EXISTS `introductions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `introductions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` longtext NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `prioritize` tinyint(1) DEFAULT '0',
  `status` tinyint(1) DEFAULT '1',
  `createdBy` int DEFAULT NULL,
  `updatedBy` int DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `introductions`
--

LOCK TABLES `introductions` WRITE;
/*!40000 ALTER TABLE `introductions` DISABLE KEYS */;
INSERT INTO `introductions` VALUES (1,'1000','Update',0,0,NULL,1,'2021-03-20 00:08:38','2021-03-20 00:45:27','2021-04-21 11:11:15'),(2,'1234','',0,1,NULL,NULL,'2021-03-20 00:10:32','2021-03-20 00:10:32',NULL),(3,'1234','',0,1,1,NULL,'2021-03-20 00:20:51','2021-03-20 00:20:51',NULL),(4,'1234','',0,1,1,NULL,'2021-03-20 00:21:43','2021-03-20 00:21:43',NULL),(5,'1234','',0,1,1,NULL,'2021-03-20 00:22:10',NULL,NULL),(6,'<p>T?i các c?a hàng trong h? th?ng Pharmacity, chúng tôi cung c?p ??y ?? nh?ng lo?i thu?c t? Tây y ??n ?ông y, bên c?nh ?ó, Pharmacity còn có nh?ng s?n ph?m ?? b?n ch?m sóc s?c kh?e và s?c ??p cho nh?ng ng??i thân yêu trong gia ?ình. Nh?ng nhóm s?n ph?m chính chúng tôi cung c?p, bao g?m:</p><p><em>• D??c ph?m</em></p><p><em>• ?ông y</em></p><p><em>• Th?c ph?m ch?c n?ng</em></p><p><em>• S?n ph?m ch?m sóc s?c kh?e và làm ??p</em></p><p><em>• Th?c ph?m b? sung Vitamin và khoáng ch?t</em></p><p><em>• S?n ph?m bách hóa gia ?ình</em></p><p>??n v?i m?i c?a hàng c?a Pharmacity, b?n ??u ???c tr?i nghi?m và mua s?m nh?ng s?n ph?m ch?t l??ng cao, uy tín hàng ??u trên th? tr??ng ch?m sóc s?c kh?e.</p><p>M?i m?t khách hàng ??n Pharmacity ??u ???c h? tr? t?n tình, t? v?n t?n tâm nh? kim ch? nam cho ho?t ??ng kinh doanh c?a chúng tôi:&nbsp;<strong>“Ti?t ki?m h?n – S?ng kh?e h?n”</strong>.</p>','<p>???c thành l?p vào tháng 11/2011, Pharmacity là m?t trong nh?ng chu?i nhà thu?c bán l? hi?n ??i ??u tiên t?i th? tr??ng Vi?t Nam, luôn luôn h??ng ??n m?c tiêu nâng cao ch?t l??ng ch?m sóc s?c kh?e cho t?ng khách hàng.</p><p>?i?u này, tr??c ?ây v?n ch? n?m trong ý t??ng c?a ông Chris Blank – nhà sáng l?p công ty, m?t d??c s? ng??i M? làm vi?c nhi?u n?m t?i Vi?t Nam. V?i ni?m ?am mê và s? sáng t?o c?a mình, ông Chris Blank ?ã thành l?p nên Pharmacity và mang ??n nh?ng tr?i nghi?m t?t nh?t cho khách hàng.</p><p>Hi?n nay Pharmacity ?ã có h? th?ng nhà thu?c r?i kh?p các qu?n t?i TP.HCM và nhi?u t?nh, thành ph? l?n Hà N?i, ?à N?ng, C?n Th?, Th?a Thiên Hu?, Bà R?a – V?ng Tàu, Bình D??ng, Long An, ??ng Nai, Ti?n Giang… Chúng tôi h??ng m?c tiêu ??n 2021 ??t ???c 1.000 c?a hàng bán l? thu?c và th?c ph?m ch?c n?ng t?i Vi?t Nam. Cùng v?i ?ó, trong t??ng lai Pharmacity s? m? r?ng h? th?ng c?a mình trên kh?p c? n??c, luôn h??ng ??n m?c tiêu tr? thành nhà thu?c bán l? hi?n ??i, mang ??n tr?i nghi?m t?i ?u cho khách hàng.</p><p>? Pharmacity, m?i d??c s? không ch? có n?ng l?c chuyên môn cao, luôn t?n tâm v?i ngh? mà còn ???c ?ào t?o và hu?n luy?n ?? hoàn thành xu?t s?c nh?ng s? m?nh ???c giao, giúp Pharmacity luôn x?ng ?áng v?i ni?m tin c?a khách hàng, x?ng ?áng v?i ni?m t? hào c?a Vi?t Nam.</p>',1,1,1,2,'2021-03-20 00:22:27','2022-02-13 23:32:06',NULL),(7,'1234','Xin chao',0,1,1,NULL,'2021-03-20 00:28:21',NULL,NULL);
/*!40000 ALTER TABLE `introductions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:09:47
