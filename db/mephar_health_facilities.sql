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
-- Table structure for table `health_facilities`
--

DROP TABLE IF EXISTS `health_facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `health_facilities` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `storeId` int unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` int unsigned DEFAULT NULL,
  `updatedBy` int unsigned DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `storeId` (`storeId`),
  CONSTRAINT `health_facilities_ibfk_1` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_facilities`
--

LOCK TABLES `health_facilities` WRITE;
/*!40000 ALTER TABLE `health_facilities` DISABLE KEYS */;
INSERT INTO `health_facilities` VALUES (1,3,'Cơ sở khám chữa bệnh Đống Đa 4',2,2,'2024-01-18 22:10:45','2024-01-18 22:15:47',NULL),(2,3,'Cơ sở khám chữa bệnh Đống Đa 1',2,2,'2024-01-18 22:13:24','2024-01-18 22:13:24',NULL),(3,4,'Cơ sở khám chữa bệnh Đống Đa 2',2,2,'2024-01-18 22:14:31','2024-01-18 22:14:31',NULL),(5,3,'Cơ sở khám chữa bệnh Đống Đa 2',2,2,'2024-01-18 22:18:58','2024-01-18 22:18:58',NULL),(6,31,'Co so kham benh 1',50,50,'2024-01-21 11:13:55','2024-01-21 11:13:55',NULL),(7,29,'Cơ sở khám bệnh 1',49,49,'2024-01-21 18:15:49','2024-01-21 18:15:49',NULL),(8,29,'Cơ sở khám bệnh 2',49,49,'2024-01-21 21:44:42','2024-01-21 21:44:42',NULL),(9,42,'CS1',59,59,'2024-01-23 16:52:09','2024-01-23 16:52:09',NULL),(10,42,'Cơ sở 2',59,59,'2024-02-19 16:40:34','2024-02-19 16:40:34',NULL),(11,42,'   ',59,59,'2024-02-19 16:46:14','2024-02-19 16:46:14',NULL),(12,126,'ggg',104,104,'2024-03-26 18:03:11','2024-03-26 18:03:11',NULL),(13,126,'Nam  Định',104,104,'2024-03-27 09:43:42','2024-03-27 09:43:42',NULL),(14,126,'Hà Nội',104,104,'2024-03-27 10:09:14','2024-03-27 10:09:14',NULL),(15,126,'Hà Nam',104,104,'2024-04-05 16:21:57','2024-04-05 16:21:57',NULL),(16,194,'Phạm Thị A',168,168,'2024-07-24 15:15:26','2024-07-24 15:15:26',NULL),(17,194,'Minh Khai',168,168,'2024-07-24 15:15:44','2024-07-24 15:15:44',NULL);
/*!40000 ALTER TABLE `health_facilities` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:09:08
