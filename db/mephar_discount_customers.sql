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
-- Table structure for table `discount_customers`
--

DROP TABLE IF EXISTS `discount_customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_customers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `discountId` int unsigned NOT NULL,
  `groupCustomerId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `customerId` (`groupCustomerId`),
  KEY `discountId` (`discountId`),
  CONSTRAINT `discountCustomer_ibfk_1` FOREIGN KEY (`discountId`) REFERENCES `discounts` (`id`),
  CONSTRAINT `discountGroupCustomer_ibfk_2` FOREIGN KEY (`groupCustomerId`) REFERENCES `group_customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_customers`
--

LOCK TABLES `discount_customers` WRITE;
/*!40000 ALTER TABLE `discount_customers` DISABLE KEYS */;
INSERT INTO `discount_customers` VALUES (6,434,104),(7,468,107),(8,475,107),(9,475,105),(10,475,95),(12,487,115),(13,535,107),(14,535,105),(15,536,95),(16,536,100),(24,617,1049),(25,642,174),(27,602,1049),(28,602,1050),(33,634,1050),(34,701,1050),(38,708,1065),(42,807,1087),(43,932,1056),(44,932,1052),(45,932,1077);
/*!40000 ALTER TABLE `discount_customers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:09:17
