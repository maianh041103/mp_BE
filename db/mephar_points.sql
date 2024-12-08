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
-- Table structure for table `points`
--

DROP TABLE IF EXISTS `points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `points` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('order','product') NOT NULL DEFAULT 'order',
  `isConvertDefault` tinyint(1) DEFAULT '0',
  `convertMoneyBuy` int NOT NULL DEFAULT '0',
  `isPointPayment` tinyint(1) NOT NULL DEFAULT '0',
  `convertPoint` int DEFAULT '0',
  `convertMoneyPayment` int DEFAULT '0',
  `afterByTime` int DEFAULT '0',
  `isDiscountProduct` tinyint(1) NOT NULL DEFAULT '0',
  `isDiscountOrder` tinyint(1) NOT NULL DEFAULT '0',
  `isPointBuy` tinyint(1) NOT NULL DEFAULT '0',
  `isAllCustomer` tinyint(1) DEFAULT '0',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `storeId` int unsigned NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `storeId` (`storeId`),
  CONSTRAINT `fk_points_stores` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `points`
--

LOCK TABLES `points` WRITE;
/*!40000 ALTER TABLE `points` DISABLE KEYS */;
INSERT INTO `points` VALUES (3,'order',1,1000,1,1,2000,2,1,1,1,1,'active',169,'2024-06-06 07:28:08','2024-12-05 03:50:49',NULL),(12,'product',1,1000,1,2000,1000,1,1,0,1,1,'inactive',169,'2024-06-13 07:35:20','2024-12-05 03:50:49',NULL),(13,'order',0,1000,1,0,0,5,0,0,0,1,'active',173,'2024-06-15 02:46:20','2024-11-01 08:45:13',NULL),(14,'product',1,1000,1,2,3,4,1,0,0,1,'inactive',173,'2024-06-15 02:47:33','2024-11-01 08:45:13',NULL),(15,'product',1,1000,1,1,10000,0,0,0,0,1,'active',161,'2024-06-15 04:27:11','2024-07-29 04:37:15',NULL),(16,'order',0,1,1,1,1,1,0,0,0,1,'active',174,'2024-06-18 07:13:53','2024-06-18 07:13:53',NULL),(17,'order',0,1,0,1,1,1,0,0,0,1,'inactive',180,'2024-06-18 10:01:38','2024-06-18 10:01:55',NULL),(18,'product',0,1,0,1,1,1,0,0,0,1,'active',180,'2024-06-18 10:01:55','2024-06-18 10:01:55',NULL),(19,'product',1,10000,0,0,0,0,0,0,0,1,'inactive',183,'2024-07-02 07:48:28','2024-07-05 02:57:57',NULL),(20,'order',0,10000,1,1,100,1,1,1,1,1,'active',183,'2024-07-02 07:49:19','2024-07-05 02:57:57',NULL),(21,'order',0,1000,0,0,0,0,1,1,1,1,'active',182,'2024-07-03 04:00:09','2024-07-04 10:23:04',NULL),(22,'order',0,10000,1,1,1000,0,1,1,1,0,'active',194,'2024-07-08 10:30:01','2024-09-25 03:01:17',NULL),(23,'product',1,10000,1,1,1000,1,0,0,0,1,'inactive',194,'2024-07-10 09:48:54','2024-09-25 03:01:17',NULL),(24,'product',1,1000,1,100,1000,0,0,0,0,0,'inactive',200,'2024-07-26 04:35:26','2024-10-09 07:38:05',NULL),(25,'order',0,1000,1,1,1000,0,0,0,0,0,'active',200,'2024-07-26 05:07:01','2024-10-09 07:38:05',NULL),(26,'product',1,100,1,1,1000,0,0,0,0,0,'active',190,'2024-07-27 04:22:02','2024-07-29 02:34:35',NULL),(27,'product',0,2000,0,0,0,0,0,0,0,1,'inactive',209,'2024-08-19 04:43:54','2024-12-06 11:45:08',NULL),(28,'product',NULL,0,0,NULL,NULL,NULL,0,0,0,1,'active',206,'2024-08-22 08:27:29','2024-08-22 08:27:29',NULL),(29,'order',1,10000,1,1000,1000,0,1,0,1,0,'active',216,'2024-10-18 08:38:50','2024-12-06 03:18:02',NULL),(30,'order',0,10000,0,0,0,0,1,1,1,1,'active',221,'2024-10-19 03:35:53','2024-11-19 08:50:39',NULL),(31,'product',1,10000,1,1000,1000,22,1,0,1,0,'inactive',216,'2024-11-01 07:21:20','2024-12-06 03:18:02',NULL),(32,'product',1,10000,1,1,1000,NULL,1,1,1,1,'inactive',221,'2024-11-01 09:53:42','2024-11-19 08:50:39',NULL),(33,'product',1,10000,0,0,0,0,0,0,0,1,'inactive',218,'2024-11-04 03:59:28','2024-11-26 08:01:32',NULL),(34,'order',0,10000,1,1,1000,0,1,1,1,1,'active',218,'2024-11-06 04:02:34','2024-11-26 08:01:32',NULL),(35,'order',0,0,0,0,0,0,0,0,0,1,'inactive',209,'2024-12-06 11:11:38','2024-12-06 11:45:08',NULL);
/*!40000 ALTER TABLE `points` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:10:27
