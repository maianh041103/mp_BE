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
-- Table structure for table `discount_channels`
--

DROP TABLE IF EXISTS `discount_channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_channels` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `discountId` int unsigned NOT NULL,
  `channel` enum('online','offline') DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_discount_channel_1` (`discountId`),
  CONSTRAINT `fk_discount_channel_1` FOREIGN KEY (`discountId`) REFERENCES `discounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_channels`
--

LOCK TABLES `discount_channels` WRITE;
/*!40000 ALTER TABLE `discount_channels` DISABLE KEYS */;
INSERT INTO `discount_channels` VALUES (1,760,'online','2024-11-13 10:23:36','2024-11-13 10:23:36',NULL),(2,661,'offline','2024-11-13 10:23:36','2024-11-13 10:23:36',NULL),(3,756,'online','2024-11-13 10:23:36','2024-11-13 10:23:36',NULL),(4,764,'offline','2024-11-15 03:34:40','2024-11-15 03:34:40',NULL),(5,764,'online','2024-11-15 03:34:40','2024-11-15 03:34:40',NULL),(6,775,'online','2024-11-15 07:16:26','2024-11-15 07:16:26',NULL),(7,806,'offline','2024-11-18 08:49:33','2024-11-18 08:49:33',NULL),(8,806,'online','2024-11-18 08:49:33','2024-11-18 08:49:33',NULL),(9,837,'offline','2024-11-20 03:27:38','2024-11-20 03:27:38',NULL),(10,865,'online','2024-11-24 06:15:49','2024-11-24 06:15:49',NULL),(11,866,'offline','2024-11-25 02:33:37','2024-11-25 02:33:37',NULL),(12,867,'online','2024-11-25 02:41:12','2024-11-25 02:41:12',NULL),(13,872,'offline','2024-11-25 10:28:03','2024-11-25 10:28:03',NULL),(14,932,'offline','2024-12-06 03:35:19','2024-12-06 03:35:19',NULL),(15,932,'online','2024-12-06 03:35:19','2024-12-06 03:35:19',NULL);
/*!40000 ALTER TABLE `discount_channels` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:10:23
