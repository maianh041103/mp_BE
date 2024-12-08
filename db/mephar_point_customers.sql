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
-- Table structure for table `point_customers`
--

DROP TABLE IF EXISTS `point_customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `point_customers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pointId` int unsigned NOT NULL,
  `groupCustomerId` int unsigned NOT NULL,
  `type` enum('order','product') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customerId` (`groupCustomerId`),
  KEY `pointId` (`pointId`),
  CONSTRAINT `pointCustomer_ibfk_1` FOREIGN KEY (`pointId`) REFERENCES `points` (`id`),
  CONSTRAINT `pointGroupCustomer_ibfk_2` FOREIGN KEY (`groupCustomerId`) REFERENCES `group_customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `point_customers`
--

LOCK TABLES `point_customers` WRITE;
/*!40000 ALTER TABLE `point_customers` DISABLE KEYS */;
INSERT INTO `point_customers` VALUES (112,26,153,'product'),(115,24,123,'product'),(118,22,152,'order'),(119,22,118,'order'),(120,25,680,'order'),(127,31,1060,'product'),(129,29,1065,'order'),(130,29,1060,'order'),(131,31,1065,'product');
/*!40000 ALTER TABLE `point_customers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:09:27
