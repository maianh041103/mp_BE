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
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `order` int DEFAULT '0',
  `imageId` varchar(45) DEFAULT NULL,
  `createdBy` int DEFAULT NULL,
  `updatedBy` int DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `storeId` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `storeId` (`storeId`),
  CONSTRAINT `product_categories_ibfk_1` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
INSERT INTO `product_categories` VALUES (1,'V?n hóa Hà N?i 2222','V?n hóa thành ph? HN 2222','van-hoa-ha-noi-2222',3,NULL,2,2,'2021-04-25 11:05:35','2024-01-09 23:13:37',NULL,NULL),(2,'Du l?ch Hà N?i','Du l?ch thành ph? HN','du-lch-h-ni',9,NULL,2,NULL,'2021-04-25 11:06:17',NULL,NULL,NULL),(3,'Th? thao Hà N?i','Th? thao thành ph? HN','the thao ha noi',9,NULL,2,NULL,'2021-04-25 11:09:10',NULL,'2021-04-25 11:45:21',NULL),(4,'Th? thao Hà N?i','Th? thao thành ph? HN','the-thao-ha-noi',9,NULL,2,NULL,'2021-04-25 11:09:41',NULL,'2021-04-25 11:45:15',NULL),(5,'V?n hóa Hà N?i','V?n hóa thành ph? HN','van-hoa-ha-noi',1,NULL,2,NULL,'2021-04-25 11:11:38',NULL,NULL,NULL),(6,'V?n hóa Hà N?i','V?n hóa thành ph? HN','van-hoa-ha-noi',1,NULL,2,NULL,'2021-04-25 11:51:17',NULL,NULL,NULL),(7,'V?n hóa Hà N?i','V?n hóa thành ph? HN','van-hoa-ha-noi',1,NULL,2,NULL,'2021-04-25 11:51:22',NULL,NULL,NULL),(8,'V?n hóa Hà N?i','V?n hóa thành ph? HN','van-hoa-ha-noi',1,NULL,2,NULL,'2021-04-25 11:51:43',NULL,NULL,NULL),(9,'V?n hóa Hà N?i','V?n hóa thành ph? HN','van-hoa-ha-noi',1,NULL,2,NULL,'2021-04-25 11:52:44',NULL,NULL,NULL),(10,'Th? thao Hà N?i','Th? thao thành ph? HN','the-thao-ha-noi',9,NULL,2,NULL,'2021-04-25 12:24:24',NULL,NULL,NULL),(11,'Th? thao Hà N?i','Th? thao thành ph? HN','the-thao-ha-noi',9,NULL,2,NULL,'2021-04-25 12:37:26',NULL,NULL,NULL),(12,'Th? thao Hà N?i','Th? thao thành ph? HN','the-thao-ha-noi',9,NULL,2,NULL,'2021-04-25 12:38:05',NULL,NULL,NULL),(13,'Th? thao Hà N?i','Th? thao thành ph? HN','the-thao-ha-noi',9,NULL,2,NULL,'2021-04-25 12:39:06',NULL,NULL,NULL),(14,'Th? thao Hà N?i','Th? thao thành ph? HN','the-thao-ha-noi',9,NULL,2,NULL,'2021-04-25 12:39:51',NULL,NULL,NULL),(15,'Danh m?c thu?c 111','Danh m?c thu?c 111 th? thao thành ph? HN','danh-muc-thuoc-111',111,NULL,2,NULL,'2024-01-09 23:15:32',NULL,'2024-01-09 23:20:01',NULL),(16,'Hoàng Thi?n Danh m?c thu?c thienhd','Danh m?c thu?c c?a Hoàng Thi?n','hoang-thien-danh-muc-thuoc-thienhd',2,NULL,2,NULL,'2024-01-09 23:30:09',NULL,NULL,3),(17,'Nhoms sp 1','','nhoms-sp-1',0,NULL,41,NULL,'2024-01-14 00:33:54',NULL,NULL,3),(18,'Nhoms sp 2','','nhoms-sp-2',0,NULL,41,NULL,'2024-01-14 00:34:19',NULL,NULL,3),(19,'Nhom sp 3','','nhom-sp-3',0,NULL,41,NULL,'2024-01-14 00:35:04',NULL,NULL,3),(20,'Nhom sp 4','','nhom-sp-4',0,NULL,41,NULL,'2024-01-14 00:35:40',NULL,NULL,3),(21,'Thực phẩm chức năng','','thuc-pham-chuc-nang',0,NULL,48,NULL,'2024-01-17 10:02:44',NULL,NULL,24),(22,'Thực phẩm chức năng','','thuc-pham-chuc-nang',0,NULL,48,NULL,'2024-01-17 10:48:27',NULL,NULL,24),(23,'Thực phẩm chức năng','','thuc-pham-chuc-nang',0,NULL,48,NULL,'2024-01-17 16:59:25',NULL,NULL,24),(24,'Thực phẩm chức năng','','thuc-pham-chuc-nang',0,NULL,48,NULL,'2024-01-17 17:01:05',NULL,NULL,24),(25,'Thực Phẩm chức năng','','thuc-pham-chuc-nang',0,NULL,48,NULL,'2024-01-19 08:52:20',NULL,NULL,24),(26,'Nhóm sản phẩm 1','','nhom-san-pham-1',0,NULL,2,NULL,'2024-01-19 09:12:59',NULL,NULL,3),(27,'Nhom san pham 2','','nhom-san-pham-2',0,NULL,2,NULL,'2024-01-19 09:14:43',NULL,NULL,3),(28,'Nhom san pham 1','','nhom-san-pham-1',0,NULL,2,NULL,'2024-01-19 09:41:39',NULL,NULL,3);
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:09:51
