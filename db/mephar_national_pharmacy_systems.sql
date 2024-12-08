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
-- Table structure for table `national_pharmacy_systems`
--

DROP TABLE IF EXISTS `national_pharmacy_systems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `national_pharmacy_systems` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `storeId` int unsigned DEFAULT NULL,
  `branchId` int unsigned DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int unsigned DEFAULT '0',
  `isAutoHandle` int DEFAULT '0',
  `createdBy` int unsigned DEFAULT NULL,
  `updatedBy` int unsigned DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `storeId` (`storeId`),
  KEY `branchId` (`branchId`),
  KEY `createdBy` (`createdBy`),
  KEY `updatedBy` (`updatedBy`),
  CONSTRAINT `national_pharmacy_systems_ibfk_1` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`),
  CONSTRAINT `national_pharmacy_systems_ibfk_2` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`),
  CONSTRAINT `national_pharmacy_systems_ibfk_3` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`),
  CONSTRAINT `national_pharmacy_systems_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `national_pharmacy_systems`
--

LOCK TABLES `national_pharmacy_systems` WRITE;
/*!40000 ALTER TABLE `national_pharmacy_systems` DISABLE KEYS */;
INSERT INTO `national_pharmacy_systems` VALUES (1,3,3,'DcGroup','0981248920','password',NULL,0,0,2,2,'2024-02-27 00:19:45','2024-02-27 00:22:37','2024-02-27 00:35:33'),(2,3,3,'MaCS','username 1','tt@1234',NULL,1,0,2,2,'2024-02-27 18:28:18','2024-02-27 21:15:37','2024-02-27 21:16:05'),(3,3,3,'MaCS','admin','tt@1234',NULL,1,0,2,2,'2024-02-27 21:16:41','2024-02-27 21:19:37','2024-02-27 21:20:21'),(4,3,3,'DcGroup','0981248920','password','Ok',0,1,2,2,'2024-02-27 21:45:01','2024-02-27 22:29:50',NULL),(5,96,86,'79_009009','hcm41w8057272_admin','Ngocphi941',NULL,0,0,84,84,'2024-02-29 11:50:33','2024-02-29 11:53:00',NULL),(6,161,158,'hcm41w8057272_admin','hcm41w8057272_','Captainpi2203',NULL,0,0,121,121,'2024-04-04 15:10:47','2024-04-04 15:10:47',NULL),(7,169,173,'123','sds','123123',NULL,0,0,131,131,'2024-04-09 11:35:20','2024-04-09 11:35:30',NULL);
/*!40000 ALTER TABLE `national_pharmacy_systems` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:09:19
