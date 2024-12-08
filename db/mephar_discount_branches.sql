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
-- Table structure for table `discount_branches`
--

DROP TABLE IF EXISTS `discount_branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_branches` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `discountId` int unsigned NOT NULL,
  `branchId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `branchId` (`branchId`),
  KEY `discountId` (`discountId`),
  CONSTRAINT `discountBranch_ibfk_1` FOREIGN KEY (`discountId`) REFERENCES `discounts` (`id`),
  CONSTRAINT `discountBranch_ibfk_2` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=324 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_branches`
--

LOCK TABLES `discount_branches` WRITE;
/*!40000 ALTER TABLE `discount_branches` DISABLE KEYS */;
INSERT INTO `discount_branches` VALUES (292,430,174),(293,468,174),(294,475,174),(296,470,174),(297,487,198),(300,534,174),(301,470,194),(302,536,195),(303,536,194),(304,538,173),(309,579,226),(311,602,251),(312,602,253),(321,793,260),(322,932,260),(323,932,254);
/*!40000 ALTER TABLE `discount_branches` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:10:01
