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
-- Table structure for table `discount_times`
--

DROP TABLE IF EXISTS `discount_times`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_times` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `discountId` int unsigned DEFAULT NULL,
  `dateFrom` datetime DEFAULT NULL,
  `dateTo` datetime DEFAULT NULL,
  `byDay` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `byMonth` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `byHour` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `byWeekDay` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `isWarning` tinyint(1) DEFAULT '0',
  `isBirthday` tinyint(1) DEFAULT '0',
  `birthdayType` enum('day','week','month') DEFAULT 'day',
  PRIMARY KEY (`id`),
  KEY `discountId` (`discountId`),
  CONSTRAINT `discountTime_ibfk_1` FOREIGN KEY (`discountId`) REFERENCES `discounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=872 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_times`
--

LOCK TABLES `discount_times` WRITE;
/*!40000 ALTER TABLE `discount_times` DISABLE KEYS */;
INSERT INTO `discount_times` VALUES (321,384,'2024-06-10 00:00:00','2024-12-10 00:00:00','','','','',0,0,'day'),(322,385,'2024-06-10 00:00:00','2024-12-10 00:00:00','','','','',0,0,'day'),(324,387,'2024-06-10 00:00:00','2024-12-10 00:00:00','','','','',0,0,'day'),(325,388,'2024-06-10 00:00:00','2024-12-10 00:00:00','','','','',0,0,'day'),(326,389,'2024-06-10 00:00:00','2024-12-10 00:00:00','','','','',0,0,'day'),(328,391,'2024-06-10 00:00:00','2024-12-10 00:00:00','','','','',0,0,'day'),(331,394,'2024-06-10 00:00:00','2024-12-10 00:00:00','','','','',0,0,'day'),(333,396,'2024-06-09 00:00:00','2024-12-10 00:00:00','//3//','//4//','//5//','//6//',0,0,'day'),(334,397,'2024-06-10 00:00:00','2024-12-10 00:00:00','','','','',0,0,'day'),(335,398,'2024-06-10 00:00:00','2024-12-10 00:00:00','','','','',1,0,'day'),(336,399,'2024-06-10 00:00:00','2024-12-10 00:00:00','','','','',0,0,'day'),(337,400,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(338,401,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(340,403,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(343,406,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(344,407,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(345,408,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(346,409,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(347,410,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(348,411,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(349,412,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(350,413,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(351,414,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(352,415,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(353,416,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(354,417,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(355,418,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(356,419,'2024-06-11 00:00:00','2024-12-11 00:00:00','','','','',0,0,'day'),(367,430,'2024-06-12 00:00:00','2024-12-12 00:00:00','','','','',0,0,'day'),(371,434,'2024-06-12 00:00:00','2024-12-12 00:00:00','','','','',0,0,'day'),(373,436,'2024-06-12 00:00:00','2024-12-12 00:00:00','','','','',0,0,'day'),(375,438,'2024-06-12 00:00:00','2024-12-12 00:00:00','','','','',0,1,'day'),(376,439,'2024-06-12 00:00:00','2024-12-12 00:00:00','','','','',0,0,'day'),(377,440,'2024-06-13 00:00:00','2024-12-13 00:00:00','','','','',0,0,'day'),(378,441,'2024-06-13 00:00:00','2024-12-13 00:00:00','','','','',0,0,'day'),(379,442,'2024-06-13 00:00:00','2024-12-13 00:00:00','','','','',0,0,'day'),(380,443,'2024-06-13 00:00:00','2024-12-13 00:00:00','','','','',0,0,'day'),(381,444,'2024-06-13 00:00:00','2024-12-13 00:00:00','','','','',0,0,'day'),(382,445,'2024-06-13 00:00:00','2024-12-13 00:00:00','','','','',0,0,'day'),(383,446,'2024-06-14 00:00:00','2024-12-14 00:00:00','','','','',0,0,'day'),(384,447,'2024-06-14 00:00:00','2024-12-14 00:00:00','','','','',0,0,'day'),(385,448,'2024-06-14 00:00:00','2024-12-14 00:00:00','','','','',0,0,'day'),(386,449,'2024-06-14 00:00:00','2024-12-14 00:00:00','','','','',0,0,'day'),(395,458,'2024-06-15 00:00:00','2024-12-15 00:00:00','','','','',0,0,'day'),(396,459,'2024-06-15 00:00:00','2024-12-15 00:00:00','','','','',0,0,'day'),(401,464,'2024-06-18 00:00:00','2024-12-18 00:00:00','','','','',0,0,'day'),(402,465,'2024-06-18 00:00:00','2024-12-18 00:00:00','','','','',0,0,'day'),(403,466,'2024-06-18 00:00:00','2024-12-18 00:00:00','','','','',0,0,'day'),(405,468,'2024-06-21 00:00:00','2024-12-21 00:00:00','//7//','//7//','//6//','//2//',0,1,'day'),(406,469,'2024-06-24 00:00:00','2024-12-24 00:00:00','','','','',0,0,'day'),(407,470,'2024-06-24 00:00:00','2024-12-24 00:00:00','','','','',0,0,'day'),(408,471,'2024-06-24 00:00:00','2024-12-24 00:00:00','','','','',0,0,'day'),(410,473,'2024-06-24 00:00:00','2024-12-24 00:00:00','','','','',0,0,'day'),(412,475,'2024-06-24 00:00:00','2024-12-24 00:00:00','','','','',0,1,'day'),(414,477,'2024-06-24 00:00:00','2024-12-24 00:00:00','','','','',0,0,'day'),(417,480,'2024-07-02 00:00:00','2025-01-02 00:00:00','','','','',0,0,'day'),(418,481,'2024-07-02 00:00:00','2025-01-02 00:00:00','','','','',0,0,'day'),(422,485,'2024-07-05 00:00:00','2025-01-05 00:00:00','','','','',0,0,'day'),(423,486,'2024-07-05 00:00:00','2025-01-05 00:00:00','','','','',0,1,'day'),(424,487,'2024-07-05 00:00:00','2025-01-05 00:00:00','','','','',0,0,'day'),(425,488,'2024-07-09 00:00:00','2025-01-09 00:00:00','','','','',0,0,'day'),(426,489,'2024-07-09 00:00:00','2025-01-09 00:00:00','','','','',0,0,'day'),(427,490,'2024-07-09 00:00:00','2025-01-09 00:00:00','','','','',0,0,'day'),(428,491,'2024-07-09 00:00:00','2025-01-09 00:00:00','','','','',0,0,'day'),(430,493,'2024-07-11 00:00:00','2025-01-11 00:00:00','','','','',0,0,'day'),(431,494,'2024-07-11 00:00:00','2025-01-11 00:00:00','','','','',0,0,'day'),(432,495,'2024-07-11 00:00:00','2025-01-11 00:00:00','','','','',0,0,'day'),(433,496,'2024-07-11 00:00:00','2025-01-11 00:00:00','','','','',0,0,'day'),(434,497,'2024-07-11 00:00:00','2025-01-11 00:00:00','','','','',0,0,'day'),(435,498,'2024-07-11 00:00:00','2025-01-11 00:00:00','','','','',0,0,'day'),(438,501,'2024-07-12 00:00:00','2025-01-12 00:00:00','','','','',0,0,'day'),(439,502,'2024-07-12 00:00:00','2025-01-12 00:00:00','','','','',0,0,'day'),(440,503,'2024-07-13 00:00:00','2025-01-13 00:00:00','','','','',0,0,'day'),(441,504,'2024-01-01 00:00:00','2024-01-01 00:00:00','//1//2//','//1//2//','//1//2//3//4//5//6//7//8//9//10//','//1//2//3//4//',0,0,'day'),(453,516,'2024-07-16 00:00:00','2025-01-16 00:00:00','','','','',0,0,'day'),(462,525,'2024-07-31 00:00:00','2025-02-01 00:00:00','','','','',0,0,'day'),(463,526,'2024-07-28 00:00:00','2024-07-29 00:00:00','','','','',0,1,'day'),(471,534,'2024-07-18 00:00:00','2025-01-18 00:00:00','','','','',0,0,'day'),(472,535,'2024-07-18 00:00:00','2025-01-18 00:00:00','','','','',0,0,'day'),(473,536,'2024-07-18 00:00:00','2025-01-18 00:00:00','','','','',0,1,'day'),(474,537,'2024-07-18 00:00:00','2025-01-18 00:00:00','','','','',0,1,'day'),(475,538,'2024-07-18 00:00:00','2025-01-18 00:00:00','','','','',0,0,'day'),(476,539,'2024-07-18 00:00:00','2025-01-18 00:00:00','','','','',0,0,'day'),(477,540,'2024-07-18 00:00:00','2025-01-18 00:00:00','','','','',0,1,'day'),(478,541,'2024-07-25 00:00:00','2025-01-25 00:00:00','','','','',0,0,'day'),(479,542,'2024-07-27 00:00:00','2025-01-27 00:00:00','','','','',0,0,'day'),(480,543,'2024-07-29 00:00:00','2025-01-29 00:00:00','','','','',0,0,'day'),(498,561,'2024-07-29 00:00:00','2024-06-29 00:00:00','','','','',0,0,'day'),(499,562,'2024-07-31 00:00:00','2025-02-01 00:00:00','','','','',0,0,'day'),(507,570,'2024-08-16 00:00:00','2025-02-16 00:00:00','','','','',0,0,'day'),(516,579,'2024-08-24 00:00:00','2025-02-24 00:00:00','','','','',0,0,'day'),(517,580,'2024-08-24 00:00:00','2025-02-24 00:00:00','','','','',0,0,'day'),(530,593,'2024-10-10 00:00:00','2025-04-10 00:00:00','','','','',0,0,'day'),(531,594,'2024-10-10 00:00:00','2025-04-10 00:00:00','','','','',0,0,'day'),(532,595,'2024-10-11 00:00:00','2025-04-11 00:00:00','','','','',0,0,'day'),(533,596,'2024-10-18 00:00:00','2025-04-18 00:00:00','','','','',1,0,'day'),(534,597,'2024-10-26 00:00:00','2025-04-19 00:00:00','','','','',0,0,'day'),(535,598,'2024-10-18 00:00:00','2025-04-18 00:00:00','','','','',0,0,'day'),(538,601,'2024-10-19 00:00:00','2025-04-19 00:00:00','','','','',0,0,'day'),(539,602,'2024-10-19 00:00:00','2025-04-19 00:00:00','','','','',0,0,'day'),(540,603,'2024-10-21 00:00:00','2025-04-21 00:00:00','','','','',0,0,'day'),(543,606,'2024-10-21 00:00:00','2025-04-21 00:00:00','','','','',0,0,'day'),(544,607,'2024-10-22 00:00:00','2025-04-22 00:00:00','','','','',0,0,'day'),(545,608,'2024-10-22 00:00:00','2025-04-22 00:00:00','','','','',0,0,'day'),(546,609,'2024-10-23 00:00:00','2025-04-23 00:00:00','','','','',0,0,'day'),(547,610,'2024-10-23 00:00:00','2025-04-23 00:00:00','','','','',0,0,'day'),(548,611,'2024-10-23 00:00:00','2025-04-23 00:00:00','','','','',0,0,'day'),(549,612,'2024-10-24 00:00:00','2025-04-24 00:00:00','','','','',0,1,'day'),(550,613,'2024-10-24 00:00:00','2025-04-24 00:00:00','','','','',0,0,'day'),(551,614,'2024-10-24 00:00:00','2025-04-24 00:00:00','','','','',0,0,'day'),(553,616,'2024-10-24 00:00:00','2025-04-24 00:00:00','','','','',0,0,'day'),(554,617,'2024-10-24 00:00:00','2025-04-24 00:00:00','','','','',0,0,'day'),(555,618,'2024-10-24 00:00:00','2025-04-24 00:00:00','','','','',0,0,'day'),(556,619,'2024-10-24 00:00:00','2025-04-24 00:00:00','','','','',0,0,'day'),(557,620,'2024-10-24 00:00:00','2025-04-24 00:00:00','','','','',0,0,'day'),(561,624,'2024-10-25 00:00:00','2025-04-25 00:00:00','','','','',0,0,'day'),(562,625,'2024-10-25 00:00:00','2025-04-25 00:00:00','','','','',0,0,'day'),(563,626,'2024-10-25 00:00:00','2025-04-25 00:00:00','','','','',0,0,'day'),(564,627,'2024-10-25 00:00:00','2025-04-25 00:00:00','','','','',0,0,'day'),(566,629,'2024-06-04 00:00:00','2024-12-04 00:00:00','','','','',0,1,'day'),(568,631,'2024-10-25 00:00:00','2025-04-25 00:00:00','','','','',0,0,'day'),(569,632,'2024-10-25 00:00:00','2025-04-25 00:00:00','','','','',0,0,'day'),(571,634,'2024-11-01 15:42:00','2025-05-01 00:00:00','','','','',0,0,'day'),(572,635,'2024-10-25 00:00:00','2025-04-25 00:00:00','','','','',0,0,'day'),(576,639,'2024-10-28 00:00:00','2025-04-28 00:00:00','','','','',0,0,'day'),(577,640,'2024-10-28 00:00:00','2025-04-28 00:00:00','','','','',0,0,'day'),(578,641,'2024-10-28 16:26:23','2025-04-28 16:26:23','','//2//','','',0,0,'day'),(579,642,'2024-10-28 16:28:33','2025-04-28 16:28:33','','','','',0,1,'day'),(582,645,'2024-10-30 11:21:45','2025-04-30 11:21:45','','','','',0,0,'day'),(583,646,'2024-10-30 15:07:00','2025-04-30 00:00:00','','','','',0,0,'day'),(586,649,'2024-10-30 16:57:58','2025-04-30 16:57:58','','','','',0,0,'day'),(588,651,'2024-10-30 17:38:41','2025-04-30 17:38:41','','','','',0,0,'day'),(591,654,'2024-10-31 15:12:14','2025-04-30 15:12:14','','','','',0,0,'day'),(592,655,'2024-10-31 15:11:00','2025-05-01 00:00:00','','','','',0,0,'day'),(594,657,'2024-10-31 15:14:00','2025-05-01 00:00:00','','','','',0,0,'day'),(595,658,'2024-10-31 16:03:04','2025-04-30 16:03:04','','','','',0,0,'day'),(596,659,'2024-10-31 16:11:00','2025-05-01 00:00:00','','','','',0,0,'day'),(597,660,'2024-10-31 16:12:00','2025-05-01 00:00:00','','','','',0,0,'day'),(598,661,'2024-10-31 16:23:55','2025-04-30 16:23:55','','','','',0,0,'day'),(600,663,'2024-11-01 09:37:09','2025-05-01 09:37:09','','','','',0,0,'day'),(601,664,'2024-11-01 09:35:00','2025-05-01 00:00:00','','','','',0,0,'day'),(602,665,'2024-11-01 09:38:00','2025-05-01 00:00:00','//23//','//11//','//10//','//4//',0,0,'day'),(603,666,'2024-11-01 10:06:00','2025-05-01 00:00:00','','','','',0,0,'day'),(606,669,'2024-11-01 10:17:52','2025-05-01 10:17:52','','','','',0,0,'day'),(607,670,'2024-11-01 10:15:00','2025-05-01 00:00:00','','//12//','','',0,0,'day'),(608,671,'2024-11-01 10:54:00','2025-05-01 00:00:00','','//12//','','',0,0,'day'),(609,672,'2024-11-01 11:01:00','2025-05-01 00:00:00','','','','',0,0,'day'),(620,683,'2024-11-05 17:36:00','2024-11-05 17:42:00','','','','',0,0,'day'),(629,692,'2024-11-02 10:34:00','2025-05-02 00:00:00','','','','',1,0,'day'),(636,699,'2024-11-06 10:27:00','2025-05-06 00:00:00','','','','',0,0,'day'),(638,701,'2024-11-02 16:58:38','2025-05-02 16:58:38','','','','',0,0,'day'),(639,702,'2024-11-04 09:49:24','2025-05-04 09:49:24','','','','',0,0,'day'),(640,703,'2024-11-04 11:19:04','2025-05-04 11:19:04','','','','',0,0,'day'),(641,704,'2024-11-04 11:27:56','2025-05-04 11:27:56','','','','',0,0,'day'),(644,707,'2024-11-04 16:52:47','2025-05-04 16:52:47','','','','',0,0,'day'),(645,708,'2024-11-05 16:53:00','2025-05-04 16:53:00','','','','',0,0,'day'),(668,731,'2024-01-01 12:00:00','2024-01-01 12:00:00','','//1//2//11//','//1//2//3//4//5//6//7//8//9//10//14//','//1//2//3//4//6//',0,0,'day'),(670,733,'2024-11-06 13:57:53','2025-05-06 13:57:53','','','','',0,0,'day'),(676,739,'2024-11-06 18:02:40','2025-05-06 18:02:40','','','','',0,0,'day'),(678,741,'2024-11-12 14:16:22','2025-05-12 14:16:22','','','','',1,0,'day'),(679,742,'2024-11-10 17:30:00','2025-11-13 00:00:00','','','','',0,0,'day'),(680,743,'2024-11-12 03:50:00','2025-05-12 00:00:00','','','','',0,0,'day'),(682,745,'2024-11-12 04:05:00','2025-05-12 00:00:00','//12//13//','//1//11//12//','//16//17//','//3//4//5//',0,0,'day'),(683,746,'2024-11-12 04:06:00','2025-05-12 00:00:00','','','','',0,0,'day'),(688,751,'2024-11-12 04:55:00','2025-05-12 00:00:00','','','','',0,0,'day'),(693,756,'2024-11-13 11:42:37','2025-05-13 11:42:37','','','','',0,0,'day'),(696,759,'2024-06-04 15:34:31','2024-12-04 15:34:31','','','','',0,1,'day'),(697,760,'2024-06-04 15:34:31','2024-12-04 15:34:31','','','','',0,1,'day'),(698,761,'2024-06-04 15:34:31','2024-12-04 15:34:31','','','','',0,1,'day'),(699,762,'2024-06-04 15:34:31','2024-12-04 15:34:31','','','','',0,1,'day'),(700,763,'2024-06-04 15:34:31','2024-12-04 15:34:31','','','','',0,0,'day'),(701,764,'2024-11-15 10:16:20','2025-05-15 10:16:20','','','','',1,0,'day'),(702,765,'2024-11-15 10:44:32','2025-05-15 10:44:32','','','','',0,0,'day'),(703,766,'2024-11-15 11:20:24','2025-05-15 11:20:24','','','','',0,0,'day'),(704,767,'2024-11-15 11:23:27','2025-05-15 11:23:27','','','','',0,0,'day'),(705,768,'2024-11-15 11:29:04','2025-05-15 11:29:04','','','','',0,0,'day'),(706,769,'2024-11-15 11:31:35','2025-05-15 11:31:35','','','','',0,0,'day'),(707,770,'2024-11-15 11:31:56','2025-05-15 11:31:56','','','','',0,0,'day'),(708,771,'2024-11-15 11:57:39','2025-05-15 11:57:39','','','','',0,0,'day'),(710,773,'2024-11-15 14:10:37','2025-05-15 14:10:37','','','','',0,0,'day'),(711,774,'2024-11-15 14:13:24','2025-05-15 14:13:24','','','','',0,0,'day'),(712,775,'2024-11-15 14:15:07','2025-05-15 14:15:07','','','','',0,0,'day'),(714,777,'2024-11-15 15:20:09','2025-05-15 15:20:09','','','','',0,0,'day'),(716,779,'2024-11-15 15:20:57','2025-05-15 15:20:57','','','','',0,0,'day'),(717,780,'2024-11-15 15:21:00','2025-05-15 00:00:00','','','','',0,0,'day'),(718,781,'2024-11-15 15:35:33','2025-05-15 15:35:33','','','','',0,0,'day'),(720,783,'2024-11-15 15:37:25','2025-05-15 15:37:25','','','','',0,0,'day'),(722,785,'2024-11-15 16:17:00','2025-05-15 00:00:00','','','','',0,0,'day'),(723,786,'2024-11-15 16:47:00','2025-05-15 00:00:00','','','','',1,0,'day'),(724,787,'2024-11-15 16:48:00','2025-05-15 00:00:00','//15//','','','',0,1,'day'),(725,788,'2024-11-15 17:04:00','2025-05-15 00:00:00','','','','',0,0,'day'),(726,789,'2024-11-15 17:19:13','2025-05-15 17:19:13','','','','',0,0,'day'),(727,790,'2024-11-15 17:22:08','2025-05-15 17:22:08','','','','',0,0,'day'),(728,791,'2024-11-15 17:33:00','2025-05-15 00:00:00','','','','',0,0,'day'),(729,792,'2024-11-15 17:53:00','2025-05-15 17:53:00','','','','',0,0,'day'),(730,793,'2024-11-16 09:36:00','2025-05-16 09:36:00','','','','',0,0,'day'),(731,794,'2024-11-16 10:12:00','2025-05-16 00:00:00','','','','',0,0,'day'),(732,795,'2024-11-16 11:14:00','2025-05-16 00:00:00','','','','',0,0,'day'),(733,796,'2024-11-16 11:33:00','2025-05-16 00:00:00','','','','',0,0,'day'),(734,797,'2024-11-16 11:41:01','2025-05-16 11:41:01','','','','',0,0,'day'),(735,798,'2024-11-16 11:58:16','2025-05-16 11:58:16','','','','',0,0,'day'),(736,799,'2024-11-16 14:12:09','2025-05-16 14:12:09','','','','',0,0,'day'),(737,800,'2024-11-16 14:15:28','2025-05-16 14:15:28','','','','',0,0,'day'),(739,802,'2024-11-16 17:58:18','2025-05-16 17:58:18','','','','',0,0,'day'),(740,803,'2024-11-18 11:48:01','2025-05-18 11:48:01','','','','',0,0,'day'),(741,804,'2024-11-18 15:09:06','2025-05-18 15:09:06','','','','',0,0,'day'),(742,805,'2024-11-18 15:18:32','2025-05-18 15:18:32','','','','',0,0,'day'),(743,806,'2024-11-18 15:42:00','2025-05-18 15:42:00','','','','',0,0,'day'),(744,807,'2024-11-18 17:22:00','2025-05-18 00:00:00','','','','',1,0,'day'),(745,808,'2024-11-18 17:47:50','2025-05-18 17:47:50','','','','',0,0,'day'),(746,809,'2024-11-19 10:36:54','2025-05-19 10:36:54','','','','',0,0,'day'),(747,810,'2024-11-19 10:45:23','2025-05-19 10:45:23','','','','',0,0,'day'),(748,811,'2024-11-19 13:57:53','2025-05-19 13:57:53','','','','',0,0,'day'),(749,812,'2024-11-19 14:00:10','2025-05-19 14:00:10','','','','',0,0,'day'),(751,814,'2024-11-19 14:06:29','2025-05-19 14:06:29','','','','',0,0,'day'),(752,815,'2024-11-19 14:11:35','2025-05-19 14:11:35','','','','',0,0,'day'),(754,817,'2024-11-19 14:50:34','2025-05-19 14:50:34','','','','',0,0,'day'),(755,818,'2024-11-19 15:41:00','2025-05-19 15:41:00','','','','',0,0,'day'),(756,819,'2024-11-19 15:42:00','2025-05-19 15:42:00','','','','',0,0,'day'),(757,820,'2024-11-19 15:47:27','2025-05-19 15:47:27','','','','',0,0,'day'),(758,821,'2024-11-19 15:51:43','2025-05-19 15:51:43','','','','',0,0,'day'),(759,822,'2024-11-19 16:09:30','2025-05-19 16:09:30','','','','',0,0,'day'),(760,823,'2024-11-19 16:09:49','2025-05-19 16:09:49','','','','',0,0,'day'),(761,824,'2024-11-19 16:14:58','2025-05-19 16:14:58','','','','',0,0,'day'),(762,825,'2024-11-19 16:16:20','2025-05-19 16:16:20','','','','',0,0,'day'),(763,826,'2024-11-19 16:14:00','2025-05-19 00:00:00','','','','',0,0,'day'),(764,827,'2024-11-19 17:01:00','2025-05-19 00:00:00','','','','',0,0,'day'),(765,828,'2024-11-19 17:17:14','2025-05-19 17:17:14','','','','',0,0,'day'),(766,829,'2024-11-19 02:37:00','2025-05-19 00:00:00','','','','',0,0,'day'),(767,830,'2024-11-19 17:27:00','2025-05-19 00:00:00','','','','',0,0,'day'),(768,831,'2024-11-19 17:34:33','2025-05-19 17:34:33','','','','',1,0,'day'),(769,832,'2024-11-19 02:58:00','2025-05-19 00:00:00','','','','',0,0,'day'),(770,833,'2024-11-19 03:14:00','2025-05-19 00:00:00','','','','',0,0,'day'),(771,834,'2024-11-20 09:50:26','2025-05-20 09:50:26','','','','',0,0,'day'),(772,835,'2024-11-20 10:00:00','2025-05-20 00:00:00','','','','',0,0,'day'),(773,836,'2024-11-20 10:12:19','2025-05-20 10:12:19','','','','',0,0,'day'),(774,837,'2024-11-20 10:27:18','2025-05-20 10:27:18','','','','',0,0,'day'),(775,838,'2024-11-20 10:31:02','2025-05-20 10:31:02','','','','',0,0,'day'),(776,839,'2024-11-20 10:53:58','2025-05-20 10:53:58','','','','',0,0,'day'),(777,840,'2024-11-20 10:54:48','2025-05-20 10:54:48','','','','',1,0,'day'),(778,841,'2024-11-20 10:55:35','2025-05-20 10:55:35','','','','',0,0,'day'),(779,842,'2024-11-20 10:57:38','2025-05-20 10:57:38','','','','',0,0,'day'),(780,843,'2024-11-20 11:15:14','2025-05-20 11:15:14','','','','',0,0,'day'),(781,844,'2024-11-20 11:29:33','2025-05-20 11:29:33','','','','',0,0,'day'),(782,845,'2024-11-20 11:34:25','2025-05-20 11:34:25','','','','',0,0,'day'),(783,846,'2024-11-20 11:50:00','2025-05-20 00:00:00','','','','',0,1,'day'),(784,847,'2024-11-21 09:39:34','2025-05-21 09:39:34','','','','',0,0,'day'),(785,848,'2024-11-21 09:57:43','2025-05-21 09:57:43','','','','',1,0,'day'),(789,852,'2024-11-21 11:58:48','2025-05-21 11:58:48','','','','',0,0,'day'),(790,853,'2024-11-21 15:12:18','2025-05-21 15:12:18','','','','//5//1//2//',0,0,'day'),(791,854,'2024-11-21 16:19:00','2025-05-21 00:00:00','','','','',0,0,'day'),(793,856,'2024-11-21 16:35:31','2025-05-21 16:35:31','','','','',0,0,'day'),(794,857,'2024-11-21 17:20:00','2025-05-21 00:00:00','','','','',0,1,'day'),(795,858,'2024-11-22 10:01:16','2025-05-22 10:01:16','','','','',0,0,'day'),(796,859,'2024-11-22 10:51:47','2025-05-22 10:51:47','','','','',0,0,'day'),(797,860,'2024-11-22 10:53:07','2025-05-22 10:53:07','','','','',0,0,'day'),(799,862,'2024-11-22 11:35:00','2025-05-24 00:00:00','','','','',0,0,'day'),(800,863,'2024-11-22 15:24:00','2025-05-22 00:00:00','','','','',0,0,'day'),(801,864,'2024-11-23 14:19:19','2025-05-23 14:19:19','','','','',0,0,'day'),(802,865,'2024-11-24 13:15:27','2025-05-24 13:15:27','','','','',0,0,'day'),(803,866,'2024-11-25 09:33:03','2025-05-25 09:33:03','','','','',0,0,'day'),(806,869,'2024-11-25 09:47:00','2025-05-25 00:00:00','','','','',0,0,'day'),(808,871,'2024-11-25 11:39:00','2025-05-25 00:00:00','','','','',0,0,'day'),(809,872,'2024-11-25 17:27:27','2025-05-25 17:27:27','','','','',1,0,'day'),(814,877,'2024-11-26 15:27:53','2025-05-26 15:27:53','','','','',0,0,'day'),(815,878,'2024-11-27 09:34:54','2025-05-27 09:34:54','','','','',0,0,'day'),(816,879,'2024-11-27 11:51:42','2025-05-27 11:51:42','','','','',0,0,'day'),(817,880,'2024-11-27 13:57:43','2025-05-27 13:57:43','','','','',0,0,'day'),(818,881,'2024-11-27 17:11:43','2025-05-27 17:11:43','','','','',0,0,'day'),(819,882,'2024-11-27 17:50:14','2025-05-27 17:50:14','','','','',0,0,'day'),(820,883,'2024-11-28 11:04:35','2025-05-28 11:04:35','','','','',1,0,'day'),(821,884,'2024-11-28 11:07:10','2025-05-28 11:07:10','','','','',1,0,'day'),(822,885,'2024-11-28 22:43:12','2025-05-28 22:43:12','','','','',0,0,'day'),(823,886,'2024-11-28 22:57:00','2025-05-28 00:00:00','','','','',0,0,'day'),(827,890,'2024-11-30 11:21:00','2025-05-30 00:00:00','','','','',0,0,'day'),(828,891,'2024-11-30 11:41:00','2025-05-30 00:00:00','','','','',0,0,'day'),(829,892,'2024-11-30 11:44:00','2025-05-30 00:00:00','','','','',1,0,'day'),(830,893,'2024-11-30 11:49:00','2025-05-30 00:00:00','','','','',0,0,'day'),(831,894,'2024-11-30 11:50:00','2025-05-30 00:00:00','','','','',0,0,'day'),(832,895,'2024-11-30 13:54:00','2025-05-30 00:00:00','','','','',0,0,'day'),(833,896,'2024-11-30 13:59:00','2025-05-30 00:00:00','','','','',0,0,'day'),(834,897,'2024-11-30 14:18:00','2025-05-30 00:00:00','','','','',1,0,'day'),(836,899,'2024-11-30 15:26:00','2025-05-30 00:00:00','','','','',0,0,'day'),(837,900,'2024-11-30 15:33:00','2025-05-30 00:00:00','','','','',0,0,'day'),(838,901,'2024-11-30 15:43:00','2025-05-30 00:00:00','','','','',0,0,'day'),(839,902,'2024-11-30 15:45:00','2025-05-30 00:00:00','','','','',0,0,'day'),(840,903,'2024-11-30 16:35:00','2025-05-30 00:00:00','','','','',0,0,'day'),(841,904,'2024-11-30 16:43:50','2025-05-30 16:43:50','','','','',0,0,'day'),(842,905,'2024-11-30 16:44:00','2025-05-30 00:00:00','','','','',0,0,'day'),(843,906,'2024-11-30 16:49:00','2025-05-30 00:00:00','','','','',0,0,'day'),(844,907,'2024-11-30 17:03:00','2025-05-30 00:00:00','','','','',0,0,'day'),(845,908,'2024-11-30 17:07:00','2025-05-30 00:00:00','','','','',0,0,'day'),(846,909,'2024-11-30 17:12:00','2025-05-30 00:00:00','','','','',0,0,'day'),(847,910,'2024-11-30 17:14:00','2025-05-30 00:00:00','','','','',0,0,'day'),(848,911,'2024-11-30 17:15:00','2025-05-30 00:00:00','','','','',0,0,'day'),(849,912,'2024-11-30 17:24:26','2025-05-30 17:24:26','','','','',0,0,'day'),(851,914,'2024-11-30 17:30:00','2025-05-30 00:00:00','','','','',0,0,'day'),(852,915,'2024-11-30 17:30:00','2025-05-30 00:00:00','','','','',0,0,'day'),(853,916,'2024-11-30 17:41:00','2025-05-30 00:00:00','','','','',0,0,'day'),(854,917,'2024-11-30 17:42:00','2025-05-30 00:00:00','','','','',0,0,'day'),(855,918,'2024-11-30 17:45:00','2025-05-30 00:00:00','','','','',0,0,'day'),(856,919,'2024-11-30 17:47:00','2025-05-30 00:00:00','','','','',0,0,'day'),(857,920,'2024-11-30 17:48:00','2025-05-30 00:00:00','','','','',0,0,'day'),(858,921,'2024-11-30 17:51:57','2025-05-30 17:51:57','','','','',0,0,'day'),(859,922,'2024-11-30 17:58:00','2025-05-30 00:00:00','','','','',0,0,'day'),(860,923,'2024-12-03 17:57:00','2025-06-03 00:00:00','','','','',0,0,'day'),(861,924,'2024-12-03 18:01:39','2025-06-03 18:01:39','','','','',0,0,'day'),(863,926,'2024-12-05 11:21:09','2025-06-05 11:21:09','','','','',0,0,'day'),(864,927,'2024-12-05 11:21:30','2025-06-05 11:21:30','','','','',0,0,'day'),(865,928,'2024-12-05 11:26:49','2025-06-05 11:26:49','','','','',0,0,'day'),(866,929,'2024-12-05 11:31:43','2025-06-05 11:31:43','','','','',0,0,'day'),(867,930,'2024-12-05 11:34:05','2025-06-05 11:34:05','','','','',0,0,'day'),(868,931,'2024-12-05 11:55:12','2025-06-05 11:55:12','','','','',0,0,'day'),(869,932,'2024-12-06 10:22:47','2025-06-06 10:22:47','//1//2//3//4//5//6//7//8//','//3//4//','//0//1//7//8//9//10//11//12//13//14//15//16//17//18//22//23//','//7//1//2//6//',1,1,'day'),(870,933,'2024-12-06 17:50:00','2025-06-06 00:00:00','','','','',0,0,'month'),(871,934,'2024-12-06 17:58:13','2025-06-06 17:58:13','','','','',0,1,'day');
/*!40000 ALTER TABLE `discount_times` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:10:09