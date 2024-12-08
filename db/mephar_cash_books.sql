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
-- Table structure for table `cash_books`
--

DROP TABLE IF EXISTS `cash_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_books` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ballotType` enum('expenses','income') NOT NULL DEFAULT 'expenses',
  `code` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `timeCreate` timestamp NULL DEFAULT NULL,
  `typeId` int unsigned NOT NULL,
  `value` int unsigned NOT NULL,
  `userId` int unsigned NOT NULL,
  `object` enum('customer','other','shipper','supplier','user') NOT NULL DEFAULT 'other',
  `peopleId` int unsigned NOT NULL,
  `note` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `isDebt` tinyint(1) NOT NULL DEFAULT '1',
  `branchOtherId` int unsigned DEFAULT NULL,
  `branchId` int unsigned NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `typeId` (`typeId`),
  KEY `userId` (`userId`),
  KEY `peopleId` (`peopleId`),
  KEY `branchId` (`branchId`),
  KEY `fk_cash_books_5` (`branchOtherId`),
  CONSTRAINT `fk_cash_books_1` FOREIGN KEY (`typeId`) REFERENCES `type_cash_books` (`id`),
  CONSTRAINT `fk_cash_books_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_cash_books_3` FOREIGN KEY (`peopleId`) REFERENCES `user_cash_books` (`id`),
  CONSTRAINT `fk_cash_books_4` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`),
  CONSTRAINT `fk_cash_books_5` FOREIGN KEY (`branchOtherId`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_books`
--

LOCK TABLES `cash_books` WRITE;
/*!40000 ALTER TABLE `cash_books` DISABLE KEYS */;
INSERT INTO `cash_books` VALUES (1,'income','TTM000000001','2024-06-17 04:41:18',639,1000000,147,'other',1,NULL,0,NULL,173,'2024-06-17 04:41:18','2024-06-17 04:41:18',NULL);
/*!40000 ALTER TABLE `cash_books` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:10:04
