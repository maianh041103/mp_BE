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
-- Table structure for table `promotion_programs`
--

DROP TABLE IF EXISTS `promotion_programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(512) DEFAULT NULL,
  `slug` varchar(512) DEFAULT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `imageId` int NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `sponsor` varchar(255) DEFAULT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `status` tinyint DEFAULT '1',
  `createdAt` datetime DEFAULT NULL,
  `createdBy` int DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `updatedBy` int DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_programs`
--

LOCK TABLES `promotion_programs` WRITE;
/*!40000 ALTER TABLE `promotion_programs` DISABLE KEYS */;
INSERT INTO `promotion_programs` VALUES (1,'Black friday sale s?p sàn','123','qc',1,'https://google.com','description','sponsor','2021-11-20 00:00:00','2022-12-20 00:00:00',1,'2021-12-02 17:10:57',2,NULL,NULL,'2021-12-02 17:15:55'),(2,'Black friday sale s?p sàn','friday-1','qc',185,'https://www.pharmacity.vn/','https://www.pharmacity.vn/','sponsor','2021-11-21 18:00:00','2022-12-21 18:00:00',1,'2021-12-02 17:13:10',2,'2022-01-18 01:04:52',2,NULL),(3,'Black friday sale s?p sàn','friday-2','qc',186,'https://www.pharmacity.vn/','https://www.pharmacity.vn/','sponsor','2021-11-21 11:00:00','2022-12-21 11:00:00',1,'2021-12-04 23:12:01',2,'2022-01-18 01:01:41',2,NULL),(4,'Black friday sale s?p sàn','friday-3','qc',187,'https://www.pharmacity.vn/','https://www.pharmacity.vn/','sponsor','2021-11-21 11:00:00','2022-12-21 11:00:00',1,'2021-12-05 01:07:52',2,'2022-01-18 01:02:09',2,NULL),(5,'Black friday sale s?p sàn','friday-11','qc',151,'https://www.pharmacity.vn/','https://www.pharmacity.vn/','sponsor','2021-11-22 01:00:00','2022-12-27 01:00:00',1,'2021-12-05 01:26:34',2,'2022-01-18 01:04:15',2,NULL),(6,'fsfsaf','fsfsaf','fsfsdf',95,'fsfa','fsfsf','fsfs','2021-12-31 14:40:00','2022-01-08 23:52:00',1,'2021-12-31 00:34:49',2,'2021-12-31 13:45:10',2,'2022-01-13 23:41:22'),(7,'Black friday sale s?p sàn','black-friday-sale-sap-san','Black friday sale s?p sàn',188,'Black friday sale s?p sàn','Black friday sale s?p sàn','Black friday sale s?p sàn','2022-01-03 00:00:00','2022-01-24 00:00:00',1,'2022-01-17 22:25:20',2,NULL,NULL,'2022-01-17 22:25:30'),(8,'1111121','1111121','1111',541,'1111','1111','1111','2022-03-01 00:00:00','2022-03-18 00:01:00',1,'2022-03-05 11:53:24',2,'2022-03-05 11:56:30',2,'2022-03-05 11:56:53'),(9,'black saturday sale s?p sàn','black-saturday-sale-sap-san','black saturday sale s?p sàn',938,'','hihi','shopee','2022-03-06 15:20:00','2022-03-31 16:20:00',1,'2022-03-16 15:44:35',2,'2022-03-18 21:46:42',2,NULL),(10,'asasasasas','asasasasassasas','sasasasas',944,'sasasas','sasasas','sasasas','2022-03-02 00:01:00','2022-03-10 00:00:00',1,'2022-03-16 21:21:27',2,NULL,NULL,'2022-03-17 00:46:01'),(11,'1222222222222 dadasdasd','1222222222222-dadasdasd','1222222222222 dadasdasd',947,'1222222222222 dadasdasd','1222222222222 dadasdasd','1222222222222 dadasdasd','2022-03-01 07:00:00','2022-03-17 07:15:00',1,'2022-03-17 00:17:25',2,NULL,NULL,'2022-03-17 00:46:04'),(12,'this.details.products','thisdetailsproducts','this.details.products',949,'this.details.products','this.details.products','this.details.products','2022-03-09 00:01:00','2022-03-30 01:14:00',1,'2022-03-17 00:23:53',2,NULL,NULL,'2022-03-17 00:46:08'),(13,'http://localhost:8080/promotions/create-promotions','httplocalhost8080promotionscreate-promotions','http://localhost:8080/promotions/create-promotions',951,'http://localhost:8080/promotions/create-promotions','http://localhost:8080/promotions/create-promotions','http://localhost:8080/promotions/create-promotions','2022-03-01 00:00:00','2022-03-17 00:00:00',1,'2022-03-17 00:27:40',2,NULL,NULL,'2022-03-17 00:46:11'),(14,'Thông ch??ng trình khuy?n mãi','thong-chuong-trinh-khuyen-mai','Thông ch??ng trình khuy?n mãi',954,'Thông ch??ng trình khuy?n mãi','Thông ch??ng trình khuy?n mãi','Thông ch??ng trình khuy?n mãi','2022-03-08 00:00:00','2022-03-16 00:01:00',1,'2022-03-17 00:39:51',2,NULL,NULL,'2022-03-17 00:46:17'),(15,'Thông ch??ng trình khuy?n mãi Thông ch??ng trình khuy?n mãi','thong-chuong-trinh-khuyen-mai-thong-chuong-trinh-khuyen-mai','Thông ch??ng trình khuy?n mãi',955,'Thông ch??ng trình khuy?n mãi','Thông ch??ng trình khuy?n mãi','Thông ch??ng trình khuy?n mãi','2022-03-11 00:01:00','2022-03-18 00:00:00',1,'2022-03-17 00:40:59',2,NULL,NULL,'2022-03-17 00:46:24'),(16,' T?o ch??ng trình khuy?n mãi 1','tao-chuong-trinh-khuyen-mai-1',' T?o ch??ng trình khuy?n mãi',948,' T?o ch??ng trình khuy?n mãi',' T?o ch??ng trình khuy?n mãi',' T?o ch??ng trình khuy?n mãi','2022-03-10 21:00:00','2022-03-18 21:00:00',1,'2022-03-17 00:45:07',2,'2022-03-17 01:16:36',2,'2022-03-17 01:34:23'),(17,'?o ch??ng trình kh','ao-chuong-trinh-kh','?o ch??ng trình kh',958,'?o ch??ng trình kh','?o ch??ng trình kh','?o ch??ng trình kh','2022-03-02 07:00:00','2022-03-09 07:00:00',1,'2022-03-17 01:03:35',2,NULL,NULL,'2022-03-17 01:16:09'),(18,'?o ch??ng trình kh','ao-chuong-tri','?o ch??ng trình kh',958,'?o ch??ng trình kh','?o ch??ng trình kh','?o ch??ng trình kh','2022-03-02 07:00:00','2022-03-09 07:00:00',1,'2022-03-17 01:06:15',2,NULL,NULL,'2022-03-17 01:16:13'),(19,'https://devpharmacy.online/','httpsdevpharmacyonline','https://devpharmacy.online/',959,'https://devpharmacy.online/','https://devpharmacy.online/','https://devpharmacy.online/','2022-03-02 14:00:00','2022-03-02 14:00:00',1,'2022-03-17 01:17:15',2,'2022-03-17 01:17:45',2,'2022-03-17 01:34:15'),(20,'aa234214d21','aa234214d2112','aa234214d21',960,'aa234214d21','aa234214d21','aa234214d21','2022-03-10 03:15:00','2022-03-31 06:45:00',1,'2022-03-17 10:44:58',2,NULL,NULL,'2022-03-17 10:45:07'),(21,'hihi','hihi','hihi',964,'','','hihi','2022-03-18 14:35:00','2022-03-21 04:23:00',1,'2022-03-18 14:35:47',2,NULL,NULL,'2022-03-18 14:36:37'),(22,'1234556666','1234556666','1234556666',965,'1234556666','1234556666','1234556666','2022-03-09 00:05:00','2022-04-09 03:04:00',1,'2022-03-18 23:24:37',2,NULL,NULL,'2022-03-18 23:25:37'),(23,'http://localhost:8080/promotions/create-promotions','httplocalhost8080promotionscreate-promotions','http://localhost:8080/promotions/create-promotions',966,'http://localhost:8080/promotions/create-promotions','http://localhost:8080/promotions/create-promotions','http://localhost:8080/promotions/create-promotions','2022-03-01 00:00:00','2022-03-02 02:10:00',1,'2022-03-19 00:54:16',2,NULL,NULL,'2022-03-19 00:54:28');
/*!40000 ALTER TABLE `promotion_programs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:10:47
