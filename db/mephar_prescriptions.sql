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
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescriptions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `storeId` int unsigned DEFAULT NULL,
  `branchId` int unsigned DEFAULT NULL,
  `doctorId` int unsigned DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `gender` enum('male','female','other') DEFAULT 'other',
  `age` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `identificationCard` varchar(255) DEFAULT NULL,
  `healthInsuranceCard` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `supervisor` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `diagnostic` varchar(255) DEFAULT NULL,
  `healthFacilityId` int unsigned DEFAULT NULL,
  `createdBy` int unsigned DEFAULT NULL,
  `updatedBy` int unsigned DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `storeId` (`storeId`),
  KEY `branchId` (`branchId`),
  KEY `doctorId` (`doctorId`),
  KEY `healthyFacilityId` (`healthFacilityId`),
  CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`storeId`) REFERENCES `stores` (`id`),
  CONSTRAINT `prescriptions_ibfk_2` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`),
  CONSTRAINT `prescriptions_ibfk_3` FOREIGN KEY (`doctorId`) REFERENCES `doctors` (`id`),
  CONSTRAINT `prescriptions_ibfk_4` FOREIGN KEY (`healthFacilityId`) REFERENCES `prescriptions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescriptions`
--

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;
INSERT INTO `prescriptions` VALUES (1,3,3,1,'','Bệnh nhân A 1','other','401 tuổi','801 kg','21111111','12222222','Tuyên Quang 1','Nguyễn Quang B 1','0330009993','Ngộ độc thực phẩm 1',NULL,2,2,'2024-01-18 15:26:33','2024-01-18 15:32:50','2024-01-18 15:32:50'),(2,3,3,14,'','Bệnh nhân A','male','40 tuổi','80 kg','1111111','2222222','Tuyên Quang','Nguyễn Quang B','0330009990','Ngộ độc thực phẩm',2,2,NULL,'2024-01-18 15:33:02','2024-01-19 00:45:16',NULL),(3,3,3,1,'','Bệnh nhân A 1','other','401 tuổi','801 kg','21111111','12222222','Tuyên Quang 1','Nguyễn Quang B 1','0330009993','Ngộ độc thực phẩm 1',2,2,2,'2024-01-18 19:32:32','2024-01-19 00:26:14',NULL),(4,3,3,NULL,'','Benh nhan a','male','','','','','','','','',NULL,2,NULL,'2024-01-18 19:34:06','2024-01-18 19:34:06',NULL),(5,3,3,NULL,'','Benh nhan a','male','','','','','','','','',NULL,2,NULL,'2024-01-18 19:37:02','2024-01-18 19:37:02',NULL),(6,3,3,NULL,'','test','male','','','','','','','','',NULL,2,NULL,'2024-01-18 19:41:54','2024-01-18 19:41:54',NULL),(7,3,3,NULL,'','test','male','','','','','','','','',NULL,2,NULL,'2024-01-18 21:26:28','2024-01-18 21:26:28',NULL),(8,3,3,1,'','Bệnh nhân A','male','40 tuổi','80 kg','1111111','2222222','Tuyên Quang','Nguyễn Quang B','0330009990','Ngộ độc thực phẩm',NULL,2,NULL,'2024-01-19 00:23:42','2024-01-19 00:23:42',NULL),(9,3,3,1,'','Bệnh nhân A','male','40 tuổi','80 kg','1111111','2222222','Tuyên Quang','Nguyễn Quang B','0330009990','Ngộ độc thực phẩm',1,2,NULL,'2024-01-19 00:25:02','2024-01-19 00:25:02',NULL),(10,31,11,NULL,'','benh nhan 1','male','10','30 kg','1010010101','10101010','test','test','091919911','bệnh',6,50,NULL,'2024-01-21 04:18:43','2024-01-21 04:18:43',NULL),(11,31,11,NULL,'','benh nhan 1','male','10','30 kg','1010010101','10101010','test','test','091919911','bệnh',6,50,NULL,'2024-01-21 04:19:26','2024-01-21 04:19:26',NULL),(12,29,10,17,'','Bệnh nhân A','male','30 tuổi','50kg','','','','','0321212323','Đau bụng do thờ tiết',8,49,NULL,'2024-01-21 14:45:48','2024-01-21 14:45:48',NULL),(13,29,10,17,'','Bệnh nhân A','male','30 tuổi','50kg','','','','','0321212323','Đau bụng do thờ tiết',8,49,NULL,'2024-01-21 14:46:40','2024-01-21 14:46:40',NULL),(14,29,10,17,'','dasdasdasd','male','212','2121','2121212','3232323','21','212','212','21',8,49,NULL,'2024-01-21 18:56:44','2024-01-21 18:56:44',NULL),(15,31,11,18,'','Benh nhan 1','male','18','68','010101010','MA0111991','test','test','0912345658','hiem ngheo',6,50,NULL,'2024-01-21 18:56:45','2024-01-21 18:56:45',NULL),(16,31,11,18,'','test','male','','','','','','','','',6,50,NULL,'2024-01-21 19:00:31','2024-01-21 19:00:31',NULL),(17,31,11,18,'','test','male','','','','','','','','',6,50,NULL,'2024-01-21 19:09:33','2024-01-21 19:09:33',NULL),(18,29,10,17,'','sasa','male','','','21212121212','','','','','',8,49,NULL,'2024-01-22 00:17:11','2024-01-22 00:17:11',NULL),(19,29,10,17,'123213','23123','male','21','fsdfsdf','','','','','','',8,49,NULL,'2024-01-22 13:46:31','2024-01-22 13:46:31',NULL),(20,42,25,NULL,'','Thu','female','','160kg','','','','','094','sốt',NULL,59,NULL,'2024-01-23 09:35:42','2024-01-23 09:35:42',NULL),(21,42,25,20,'','Thu','male','','','','','','','','',9,59,NULL,'2024-01-23 09:52:18','2024-01-23 09:52:18',NULL),(22,42,25,20,'','Thu','female','','45','','','','','','',9,59,NULL,'2024-02-19 05:07:52','2024-02-19 05:07:52',NULL),(23,42,25,NULL,'','Ánh','male','','','aaaaaaaaaaaaaaaaaaaaaaaaa','','','','','',NULL,59,NULL,'2024-02-19 08:24:04','2024-02-19 08:24:04',NULL),(24,42,25,NULL,'','Ánh','male','','','12345678901111111111111111','','','','','',NULL,59,NULL,'2024-02-19 08:29:00','2024-02-19 08:29:00',NULL),(25,42,25,NULL,'','Ánh','male','','','12345678901111111111111111','FFFFFFFFFFFFFFFFFFFFFFFFF','','','','',NULL,59,NULL,'2024-02-19 08:51:27','2024-02-19 08:51:27',NULL),(26,42,25,NULL,'','Ánh','male','','','12345678901111111111111111','FFFFFFFFFFF@FFFFFFFFFFFFF','','','','',NULL,59,NULL,'2024-02-19 09:14:46','2024-02-19 09:14:46',NULL),(27,42,25,NULL,'','Hà@','male','','','','','                                   ','','','',NULL,59,NULL,'2024-02-20 04:59:27','2024-02-20 04:59:27',NULL),(28,42,25,NULL,'','Sơn','male','','','aaaaaaaaaaaaaaaaaaaa','','','','','',NULL,59,NULL,'2024-02-26 02:26:06','2024-02-26 02:26:06',NULL),(29,42,25,NULL,'','b','male','','','123456781212','','','','0987653712','',NULL,59,NULL,'2024-02-27 02:26:55','2024-02-27 02:26:55',NULL),(30,42,25,21,'','Minh','female','','','','','','','','',9,59,NULL,'2024-03-12 06:54:02','2024-03-12 06:54:02',NULL),(31,126,120,34,'','abc','male','','','','','','','','',NULL,104,NULL,'2024-03-22 07:51:21','2024-03-22 07:51:21',NULL),(32,126,120,34,'','i','male','','','','','','','','',NULL,104,NULL,'2024-03-23 03:55:56','2024-03-23 03:55:56',NULL),(33,126,120,34,'','Hải','male','','','1231233','','','','0912323233','',NULL,104,NULL,'2024-03-26 10:47:24','2024-03-26 10:47:24',NULL),(34,126,120,34,'','kjdhskad sads','male','','','','','','','0912323233','',NULL,104,NULL,'2024-03-26 10:53:34','2024-03-26 10:53:34',NULL),(35,126,120,34,'','hj','female','','','','','','','','',NULL,104,NULL,'2024-03-26 11:00:23','2024-03-26 11:00:23',NULL),(36,126,120,34,'','mmmmm','male','','','','','','','','',12,104,NULL,'2024-03-26 11:03:16','2024-03-26 11:03:16',NULL),(37,126,120,39,'','aa','male','','','','','','','','',NULL,104,NULL,'2024-03-28 04:12:05','2024-03-28 04:12:05',NULL),(38,126,120,38,'','abc','male','','','','','','','','',14,104,NULL,'2024-03-28 08:50:15','2024-03-28 08:50:15',NULL),(39,126,120,39,'','Nguyen','male','123','123','123','123','123','123','0912321312','123',13,104,NULL,'2024-03-28 19:58:02','2024-03-28 19:58:02',NULL),(40,162,159,44,'','Thu','male','','','','','','','','',NULL,122,NULL,'2024-03-30 07:44:49','2024-03-30 07:44:49',NULL),(41,126,120,45,'','Hà','female','','','','','','','','',NULL,104,NULL,'2024-04-04 02:11:36','2024-04-04 02:11:36',NULL),(42,126,120,39,'','ha','male','','','','','','','','',13,104,NULL,'2024-04-05 04:56:31','2024-04-05 04:56:31',NULL),(43,126,120,39,'','hien','male','','','','','','','','',14,104,NULL,'2024-04-05 04:57:05','2024-04-05 04:57:05',NULL),(44,126,120,42,'','bn1','male','','','','','','','','',13,104,NULL,'2024-04-05 07:56:07','2024-04-05 07:56:07',NULL),(45,126,120,42,'','BN2','female','','','','','','','','',13,104,NULL,'2024-04-05 07:57:11','2024-04-05 07:57:11',NULL),(46,161,158,NULL,'51006a150858-c','Tr','male','','','','','','','','',NULL,142,NULL,'2024-04-23 02:12:26','2024-04-23 02:12:26',NULL);
/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:09:57
