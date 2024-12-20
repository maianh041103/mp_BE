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
-- Table structure for table `market_images`
--

DROP TABLE IF EXISTS `market_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market_images` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `storeId` int unsigned NOT NULL,
  `imageBannerId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `imageTopId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `imageBottomId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `market_images_1` (`storeId`),
  CONSTRAINT `market_images_1` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_images`
--

LOCK TABLES `market_images` WRITE;
/*!40000 ALTER TABLE `market_images` DISABLE KEYS */;
INSERT INTO `market_images` VALUES (1,200,'1649/2/3','4','1','2024-08-15 12:00:48','2024-08-15 13:50:51','2024-08-15 14:30:02'),(2,200,'1649/1653/3','4','1','2024-08-15 14:48:08','2024-08-15 14:48:08','2024-08-15 14:51:54'),(3,200,'1711/1712/1713','1713','','2024-08-15 14:53:34','2024-08-22 10:41:08',NULL),(4,194,'1659/2/3','4','1','2024-08-15 15:28:20','2024-08-16 09:31:47','2024-08-16 09:37:28'),(5,194,'9999','9999','','2024-08-16 09:48:50','2024-08-19 14:37:02','2024-08-19 14:39:20'),(6,194,'1694/1/2','2','3/4','2024-08-19 14:41:27','2024-08-19 14:45:08','2024-08-19 14:46:05'),(7,194,'1695/1/2','2','3/4','2024-08-19 14:57:05','2024-08-19 14:57:05','2024-08-19 14:57:43'),(8,194,'1694/1/2','2','3/4','2024-08-19 14:58:58','2024-08-19 15:00:07','2024-08-19 15:01:56'),(9,194,'1865','2','3/4','2024-08-19 15:07:42','2024-09-12 17:10:35',NULL);
/*!40000 ALTER TABLE `market_images` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:10:02
