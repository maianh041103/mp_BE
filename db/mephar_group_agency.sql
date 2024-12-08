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
-- Table structure for table `group_agency`
--

DROP TABLE IF EXISTS `group_agency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_agency` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `storeId` int unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `description` text,
  `createdBy` int unsigned DEFAULT NULL,
  `updatedBy` int unsigned DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `createdBy` (`createdBy`),
  KEY `updatedBy` (`updatedBy`),
  KEY `group_agency_1` (`storeId`),
  CONSTRAINT `group_agency_1` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`),
  CONSTRAINT `group_agency_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`),
  CONSTRAINT `group_agency_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_agency`
--

LOCK TABLES `group_agency` WRITE;
/*!40000 ALTER TABLE `group_agency` DISABLE KEYS */;
INSERT INTO `group_agency` VALUES (23,169,'a ','...',131,131,'2024-09-23 14:58:55','2024-09-23 15:04:53',NULL),(24,169,'a ','Nhóm đại lý ...',131,NULL,'2024-09-25 10:57:38','2024-09-25 10:57:38',NULL),(25,169,'a ','Nhóm đại lý111 ...',131,NULL,'2024-09-27 17:27:37','2024-09-27 17:27:37',NULL),(26,169,'123','',131,NULL,'2024-09-27 17:29:08','2024-09-27 17:29:08',NULL),(27,169,'nhóm1','',131,NULL,'2024-09-30 11:22:14','2024-09-30 11:22:14',NULL),(28,209,'Đại lý bán điểm','',187,NULL,'2024-10-04 09:19:15','2024-10-04 09:19:15',NULL),(29,194,'nhóm vip','',168,NULL,'2024-10-04 14:28:40','2024-10-04 14:28:40',NULL),(30,194,'Nhóm thường','',168,NULL,'2024-10-04 14:28:58','2024-10-04 14:28:58',NULL),(31,194,'Hehe','Hehehehehe',168,NULL,'2024-10-09 14:47:05','2024-10-09 14:47:05',NULL),(32,194,'Hihi','',168,NULL,'2024-10-10 10:00:03','2024-10-10 10:00:03',NULL),(33,194,'yeye','',168,NULL,'2024-10-10 10:01:33','2024-10-10 10:01:33',NULL),(34,194,'hehe','',168,NULL,'2024-10-10 10:02:13','2024-10-10 10:02:13',NULL),(35,216,'nhóm vip','',192,NULL,'2024-10-10 10:02:30','2024-10-10 10:02:30',NULL),(36,216,'Hehe','',192,NULL,'2024-10-10 10:38:55','2024-10-10 10:38:55',NULL),(37,216,'thường','',192,NULL,'2024-10-17 10:45:28','2024-10-17 10:45:28',NULL),(38,216,'đại lý thuốc viên','bnv hhb hnbb bn c hb',192,NULL,'2024-10-17 11:08:57','2024-10-17 11:08:57',NULL),(39,221,'Nhóm đại lý 1','hihi',196,NULL,'2024-10-19 11:44:44','2024-10-19 11:44:44',NULL),(40,218,'vip','',193,NULL,'2024-10-31 14:31:52','2024-10-31 14:31:52',NULL),(41,218,'thường','',193,NULL,'2024-11-02 13:54:19','2024-11-02 13:54:19',NULL),(42,218,'special','',193,NULL,'2024-11-14 10:45:34','2024-11-14 10:45:34',NULL);
/*!40000 ALTER TABLE `group_agency` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:09:14
