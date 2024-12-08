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
-- Table structure for table `discount_configs`
--

DROP TABLE IF EXISTS `discount_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_configs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `isMergeDiscount` tinyint(1) NOT NULL DEFAULT '0',
  `isApplyOrder` tinyint(1) NOT NULL DEFAULT '0',
  `isAutoApply` tinyint(1) NOT NULL DEFAULT '0',
  `storeId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `storeId` (`storeId`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_configs`
--

LOCK TABLES `discount_configs` WRITE;
/*!40000 ALTER TABLE `discount_configs` DISABLE KEYS */;
INSERT INTO `discount_configs` VALUES (1,1,0,0,169),(2,1,0,0,161),(3,0,0,0,183),(4,0,0,0,195),(5,0,0,0,194),(6,0,0,0,200),(7,0,0,0,171),(8,0,0,0,173),(9,0,0,0,190),(10,0,0,0,209),(11,0,0,0,206),(12,0,0,0,203),(13,0,0,0,162),(14,0,0,0,219),(15,0,0,0,220),(16,1,0,0,216),(17,1,0,0,221),(18,1,0,0,218),(19,1,0,0,223),(20,0,0,0,227),(21,0,0,0,230),(22,1,0,0,235);
/*!40000 ALTER TABLE `discount_configs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:09:29
