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
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `phone` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `wardId` smallint unsigned NOT NULL,
  `districtId` smallint unsigned NOT NULL,
  `provinceId` tinyint unsigned NOT NULL,
  `address` text NOT NULL,
  `storeId` int unsigned NOT NULL,
  `isDefaultAddress` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `fullName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `customerId` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `addresses_1` (`wardId`),
  KEY `addresses_2` (`districtId`),
  KEY `addresses_3` (`provinceId`),
  KEY `addresses_4` (`storeId`),
  CONSTRAINT `addresses_1` FOREIGN KEY (`wardId`) REFERENCES `wards` (`id`),
  CONSTRAINT `addresses_2` FOREIGN KEY (`districtId`) REFERENCES `districts` (`id`),
  CONSTRAINT `addresses_3` FOREIGN KEY (`provinceId`) REFERENCES `provinces` (`id`),
  CONSTRAINT `addresses_4` FOREIGN KEY (`storeId`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,'0934343422',10428,99,1,'kim giang 628',173,0,'2024-08-10 14:13:18','2024-10-22 11:33:51',NULL,NULL,NULL),(2,'0934343423',4887,406,43,'thon 2',173,0,'2024-08-10 14:35:53','2024-10-22 11:33:51',NULL,NULL,NULL),(3,'0934343499',162,179,24,'12',173,0,'2024-08-12 10:00:19','2024-10-22 11:33:51',NULL,NULL,NULL),(4,'0934343423',990,421,4,'...',173,0,'2024-08-12 10:07:22','2024-10-22 11:33:51',NULL,'Phạm A',NULL),(5,'0337200129',2872,318,3,'1234214',225,0,'2024-08-12 14:50:19','2024-08-20 10:10:00',NULL,NULL,NULL),(6,'0932332333',2,15,24,'123',183,0,'2024-08-14 10:58:02','2024-08-22 15:20:39',NULL,NULL,NULL),(7,'0919698167',3,15,24,'21 ngõ 71',158,0,'2024-08-14 11:02:15','2024-08-14 16:58:22',NULL,NULL,NULL),(8,'0919698168',3,15,24,'21 ngõ 71',158,1,'2024-08-14 11:02:17','2024-08-14 11:02:17',NULL,NULL,NULL),(9,'0932314343',58,96,24,'114 Trần Vỹ',173,0,'2024-08-14 13:47:45','2024-10-22 11:33:51',NULL,'Phạm A',NULL),(10,'0919698126',121,572,24,'71',239,1,'2024-08-15 08:39:46','2024-08-15 08:39:46',NULL,NULL,NULL),(11,'0373940581',2,15,24,'Xuân Phương Hà Nội',225,0,'2024-08-19 16:48:52','2024-08-20 10:10:00',NULL,'Nguyễn Văn Q',NULL),(12,'0373940582',2,15,24,'Xuân Phương Hà Nội',215,1,'2024-08-19 17:07:12','2024-08-19 17:07:12',NULL,'acd1',NULL),(13,'0373940582',2,15,24,'Xuân Phương Hà Nội',217,0,'2024-08-19 17:09:03','2024-08-21 16:18:32','2024-08-21 17:02:05','acd1',NULL),(14,'0385161417',2,15,24,'Xuân Phương Hà Nội',217,0,'2024-08-19 17:10:35','2024-08-21 16:18:32','2024-08-21 17:01:59','acd1',NULL),(15,'0931254623',2,15,24,'Xuân Phương Hà Nội',225,0,'2024-08-19 17:14:14','2024-08-20 10:10:00','2024-08-21 17:01:31','Nguyễn Văn Q',NULL),(18,'0385161417',2,15,24,'Xuân Phương Hà Nội',217,1,'2024-08-20 09:33:51','2024-08-20 09:33:51','2024-08-20 10:12:00','acd1',NULL),(19,'0931254623',2,15,24,'Xuân Phương Hà Nội',225,0,'2024-08-20 09:38:06','2024-08-20 10:10:00',NULL,'Nguyễn Văn Q',NULL),(20,'0373945712',5,16,24,'Thanh Xuân Hà Nội',225,1,'2024-08-20 09:40:25','2024-08-20 10:10:00','2024-08-20 10:13:24','Nguyễn Văn Q',NULL),(21,'0903403941',2,15,24,'555 Xuân Phương Hà Nội',225,0,'2024-08-20 09:47:16','2024-08-20 10:03:00','2024-08-20 10:05:51','Nguyễn Văn Q',NULL),(22,'0325879561',209,636,24,'Số 3 ngõ 123 đường cầu diễn, Minh Khai, Bắc Từ Liêm, Hà Nội',198,1,'2024-08-20 17:37:42','2024-08-20 17:37:42',NULL,'Vũ Thanh Lan',NULL),(23,'0325689564',298,18,24,'Số 3 Đường Xuân Thủy, Cầu Giấy, Hà Nội',198,0,'2024-08-21 14:11:49','2024-08-21 14:11:49',NULL,'Vũ Thanh Lan',NULL),(24,'0385161417',2,15,24,'Xuân Phương Hà Nội',217,0,'2024-08-21 15:38:15','2024-09-12 13:57:03',NULL,'acd1',NULL),(25,'0385161417',2,96,24,'Cầu giấy Hà Nội',217,0,'2024-08-21 15:49:05','2024-09-12 13:57:03',NULL,'acd1',NULL),(26,'0385161417',2,193,24,'Đống Đa Hà Nội',217,0,'2024-08-21 15:50:00','2024-08-21 16:18:32','2024-08-21 17:00:45','acd1',NULL),(27,'0373945712',5,206,24,'Gia Lâm Hà Nội',217,1,'2024-08-21 15:50:19','2024-09-12 13:57:03',NULL,'abcd',NULL),(28,'0912312312',220,571,24,'628 Kim Giang',183,0,'2024-08-22 15:20:39','2024-09-13 17:21:05',NULL,'test08',NULL),(29,'0958695432',2814,33,3,'Hà Nội',174,1,'2024-08-23 17:28:28','2024-09-11 10:35:08',NULL,'Phạm A',NULL),(30,'0931254623',8913,429,8,'Tân Hiệp',225,0,'2024-08-30 10:29:23','2024-11-15 14:12:02',NULL,'Chi nhánh mặc định',NULL),(31,'0932432444',10440,9,1,'dsfdsf',173,0,'2024-09-04 14:22:17','2024-10-22 11:33:51',NULL,'Phạm A',NULL),(32,'0325478954',9162,100,2,'Bình Giã, Châu Đức, Bà Rịa Vũng tàu',199,1,'2024-09-06 10:26:48','2024-09-06 10:54:31',NULL,'Vũ Thanh Lan',NULL),(33,'0325874562',3527,637,6,'Đồng Kỵ, Từ Sơn Bắc Ninh',199,0,'2024-09-06 10:27:28','2024-09-06 10:54:31',NULL,'Vũ Thanh Lan',NULL),(34,'0325874635',215,2316,24,'Mễ Trì, Quận Nam Từ Liêm, Hà Nội',233,0,'2024-09-06 14:10:18','2024-11-20 17:13:40',NULL,'test20',NULL),(35,'0943245455',9179,681,2,'123',173,0,'2024-09-11 10:42:38','2024-10-22 11:33:51',NULL,'Phạm A',NULL),(36,'0325684541',6868,233,15,'Thuận Tây-Hải Châu-Đà Nẵng',233,0,'2024-09-11 11:51:58','2024-09-11 11:51:58',NULL,'Vũ Thanh Lan',NULL),(37,'0934343423',990,421,4,'...',194,0,'2024-09-11 17:21:37','2024-09-27 15:15:02',NULL,'HHIIHII',NULL),(38,'0325876958',291,18,24,'Phong Vân-Ba Vì-Hà Nội',217,0,'2024-09-12 13:57:37','2024-09-12 13:57:37',NULL,'hsdj',NULL),(39,'0325894514',62,96,24,'Yên hòa, Cầu giấy ,Hà Nội',201,1,'2024-09-12 14:05:55','2024-09-12 14:05:55',NULL,'Hoa',NULL),(40,'0987654321',10439,9,1,'hà nội',195,1,'2024-09-13 16:18:56','2024-09-13 16:18:56',NULL,'Chi nhánh 4',NULL),(41,'0987654321',10439,9,1,'hà nội',195,1,'2024-09-13 16:18:56','2024-09-13 16:18:56',NULL,'Chi nhánh 4',NULL),(42,'0931254623',8913,429,8,'Hà Nội',226,0,'2024-09-13 16:21:55','2024-11-15 14:12:09',NULL,'chi nhánh 1',NULL),(43,'0931254623',8913,429,8,'Hà Nội',226,0,'2024-09-13 16:21:55','2024-11-15 14:12:09',NULL,'chi nhánh 1',NULL),(44,'0325685412',9161,100,2,'nn khi',183,1,'2024-09-13 17:21:05','2024-09-13 17:21:05',NULL,'tes',NULL),(45,'0325874525',10440,9,1,'Phú Hội-An Phú-An Giang',233,0,'2024-09-20 10:09:11','2024-09-20 10:09:11',NULL,'ghh',NULL),(46,'0919698168',4803,212,41,'21',178,1,'2024-09-20 11:38:35','2024-09-20 11:38:35',NULL,'Nguyễn Văn A',NULL),(48,'0912228064',6868,233,15,'Địa chỉ duy nhất thôiii',171,0,'2024-09-23 18:03:18','2024-09-24 10:04:09',NULL,'MAI ANHHHH',NULL),(49,'0934343423',990,421,4,'...',169,0,'2024-09-23 18:04:07','2024-09-24 10:04:10','2024-09-24 10:05:08','HHIIHII',NULL),(50,'0987364782',2925,342,3,'Hà Nội 1',169,0,'2024-09-24 10:05:28','2024-10-04 09:29:02',NULL,'Cừa hàng 821',NULL),(51,'0912228064',6868,233,15,'Địa chỉ cửa hàng 171',171,1,'2024-09-24 14:51:15','2024-09-24 14:51:15',NULL,'Store171',NULL),(52,'0325895668',10427,99,1,'Châu Phú A, Châu Đốc, An Giang',203,0,'2024-09-26 18:03:56','2024-09-30 11:23:45',NULL,'kkkkk',NULL),(53,'0325874626',215,2316,24,'Mễ Trì, Quận Nam Từ Liêm, Hà Nội',203,0,'2024-09-26 18:03:56','2024-09-30 11:23:45',NULL,'gdhjj',NULL),(54,'0325689125',9986,49,7,'Châu Hưng, Bình Đại, Bên Tre',203,0,'2024-09-27 14:58:15','2024-10-01 14:59:28',NULL,'abc',NULL),(55,'0321596485',291,18,24,'Phong Vân, Ba Vì Hà Nội',194,1,'2024-09-27 15:15:02','2024-09-27 15:15:02',NULL,'qưewr',NULL),(56,'0325895656',3020,244,3,'Ngọc Sơn, Hiệp Hòa, Bắc Giang',203,0,'2024-09-30 09:43:59','2024-09-30 11:23:45',NULL,'abcd123',NULL),(57,'0987654321',9145,19,2,'Bà Rịa Vũng Tàu',194,0,'2024-09-30 09:58:38','2024-09-30 09:58:38',NULL,'acd1',NULL),(58,'0912228064',6868,233,15,'Địa chỉ duy nhất thôiii',173,0,'2024-09-30 11:37:09','2024-10-22 11:33:51',NULL,'-----',NULL),(59,'0924234324',63,96,24,'123 Cầu GIấy',169,0,'2024-09-30 15:35:38','2024-10-04 09:29:02',NULL,'Phạm A 123',NULL),(60,'0943243244',187,206,24,'123',169,0,'2024-09-30 15:40:47','2024-10-04 09:29:02',NULL,'test 1',NULL),(61,'0912228064',6868,233,15,'Địa chỉ duy nhất thôiii',173,0,'2024-09-30 16:46:54','2024-10-22 11:33:51',NULL,'-----',NULL),(62,'0932132133',4883,406,43,'11 3',169,0,'2024-10-01 14:54:10','2024-10-04 09:29:02',NULL,'Hải 123',NULL),(63,'0931231233',63,96,24,'123',203,0,'2024-10-01 14:59:28','2024-10-02 17:23:56',NULL,'Add địa chỉ',NULL),(64,'0325689256',10440,9,1,'Phú Hội, An Phú, An Giang',169,0,'2024-10-02 09:51:04','2024-10-04 09:29:02',NULL,'acd1',NULL),(65,'0942342344',2850,544,3,'zzz',203,1,'2024-10-02 17:23:56','2024-10-02 17:23:56',NULL,'New1',NULL),(66,'0911368876',121,572,24,'71 Hoàng Văn Thái',209,1,'2024-10-03 10:27:36','2024-10-03 10:27:36',NULL,'QT Pharma',NULL),(67,'0911368876',121,572,24,'71 Hoàng Văn Thái',209,1,'2024-10-03 10:27:36','2024-10-03 10:27:36',NULL,'QT Pharma',NULL),(68,'0325896582',9259,221,30,'Phường 6 Quận Gò Vấp TP.Hồ Chí Minh',216,0,'2024-10-03 11:00:48','2024-10-22 10:30:02',NULL,'test22',NULL),(69,'0384521235',290,18,24,'Châu sơn, Ba vì, Hà Nội',216,0,'2024-10-03 11:00:48','2024-10-22 10:30:02',NULL,'uuuu',NULL),(70,'0919596783',9206,539,2,'3',161,1,'2024-10-04 09:24:36','2024-10-04 09:24:36',NULL,'Nhà Thuốc An Khang',NULL),(71,'0919596783',9206,539,2,'3',161,1,'2024-10-04 09:24:36','2024-10-04 09:24:36',NULL,'Nhà Thuốc An Khang',NULL),(72,'0325871259',156,179,24,'Thị trấn Đông Anh, Đông Anh, Hà Nội',218,0,'2024-10-04 09:37:29','2024-10-08 14:07:02',NULL,'test23',NULL),(73,'0325871259',156,179,24,'Thị trấn Đông Anh, Đông Anh, Hà Nội',218,0,'2024-10-04 09:37:29','2024-10-08 14:06:56',NULL,'test23',NULL),(74,'0987364782',2925,342,3,'Hà Nội 1',169,0,'2024-10-04 09:51:16','2024-10-04 09:51:16',NULL,'Cừa hàng 821',NULL),(75,'0987364782',2925,342,3,'Hà Nội 1',169,0,'2024-10-04 09:51:16','2024-10-04 09:51:16',NULL,'Cừa hàng 821',NULL),(76,'0987364782',2925,342,3,'Hà Nội 1',169,0,'2024-10-04 09:54:16','2024-10-08 15:27:25',NULL,'Cừa hàng 821',NULL),(77,'0987364782',2925,342,3,'Hà Nội 1',169,0,'2024-10-04 09:54:16','2024-10-04 09:54:16',NULL,'Cừa hàng 821',NULL),(78,'0325798562',9261,221,30,'Phường 12, Gò Vấp, tp Hồ Chí Minh',220,0,'2024-10-04 10:22:10','2024-10-17 17:59:48',NULL,'Nhà thuốc Hạnh Phúc',NULL),(79,'0325876541',10007,17,7,'Bến Tre, Ba Trí, Mỹ Thạnh',220,0,'2024-10-04 10:46:35','2024-10-17 17:59:48',NULL,'abc',NULL),(82,'0912228064',6868,233,15,'Địa chỉ cửa hàng 11',171,1,'2024-10-04 15:30:22','2024-10-04 16:54:21',NULL,'Store171',300),(83,'0999999999',36,547,24,'233456788h',173,0,'2024-10-04 15:54:08','2024-10-22 11:33:51',NULL,'mộng chi',NULL),(84,'0987654321',41,547,24,'nha em o canh cay da',173,0,'2024-10-04 16:22:03','2024-10-22 11:33:51',NULL,'elsa',NULL),(85,'0325896523',291,18,24,'Phong vân Ba Vì hà nội',218,1,'2024-10-05 10:53:17','2024-10-09 09:29:52',NULL,'đffffggh',NULL),(86,'0987654321',10434,9,1,'ee',173,0,'2024-10-05 16:12:51','2024-10-22 11:33:51',NULL,'hhg',NULL),(87,'0999999999',3574,345,6,'fgg',173,0,'2024-10-05 17:44:08','2024-10-22 11:33:51',NULL,'ffff',NULL),(88,'0888888888',93,231,24,'',173,0,'2024-10-05 17:51:33','2024-10-22 11:33:51',NULL,'r',NULL),(89,'0945345551',1500,171,18,'abc123',220,0,'2024-10-08 11:41:45','2024-10-17 17:59:48',NULL,'Hải 22222',NULL),(90,'0934234445',6859,565,15,'zzz',220,0,'2024-10-08 11:43:42','2024-10-17 17:59:48',NULL,'Hải 3',NULL),(91,'0943243251',9524,405,30,'12',169,1,'2024-10-08 15:27:25','2024-10-08 15:27:25',NULL,'HHai',NULL),(92,'09896',8912,429,8,'bcjkck',200,0,'2024-10-09 09:46:19','2024-10-21 15:24:03',NULL,'hhh',NULL),(93,'0923442113',4674,675,41,'12343',169,1,'2024-10-09 09:56:59','2024-10-09 09:57:07',NULL,'Hải zzz',5145),(94,'0325874525',10440,9,1,'Phú Hội, An Phú, A Giang',218,0,'2024-10-09 10:10:30','2024-10-09 10:10:30',NULL,'ddđ',NULL),(95,'0325865655',4183,293,32,'Số 2 Thọ Vinh ,Kim Động, Hưng Yên',218,0,'2024-10-10 13:50:02','2024-10-10 13:50:02',NULL,'www',NULL),(96,'0356586521',6253,77,26,'Thường Nga, Can Lộc, Hà Tĩnh',200,0,'2024-10-11 16:06:17','2024-10-21 15:24:03',NULL,'hhm',NULL),(97,'0986861236',9149,19,2,'',200,0,'2024-10-15 14:12:52','2024-10-21 15:24:03',NULL,'hjfj',NULL),(98,'0325845895',3557,205,6,'ff ff',216,0,'2024-10-15 15:16:16','2024-10-22 10:30:02',NULL,'ttt',NULL),(99,'03257841568039',9986,49,7,'tti ghgh',220,0,'2024-10-15 16:11:48','2024-10-17 17:59:48',NULL,'orchid',NULL),(100,'0325864178',8941,140,8,'dgfh yu',220,0,'2024-10-15 16:14:18','2024-10-17 17:59:48',NULL,'sdf',NULL),(101,'9850866',8941,140,8,'cgf gh',220,0,'2024-10-15 16:14:58','2024-10-17 17:59:48',NULL,'bhbv',NULL),(102,'0324589562',9151,19,2,'g c cvgf',216,0,'2024-10-15 16:15:41','2024-10-22 10:30:02',NULL,'gdd',NULL),(103,'0325874112',10434,9,1,'',173,0,'2024-10-15 16:37:53','2024-10-22 11:33:51',NULL,'55556',NULL),(104,'0995',8941,140,8,'',220,0,'2024-10-15 16:38:03','2024-10-17 17:59:48',NULL,'gg',NULL),(105,'05556',8941,140,8,'',220,0,'2024-10-15 16:58:01','2024-10-17 17:59:48',NULL,'d',NULL),(106,'03258865',8941,140,8,'đ',220,0,'2024-10-15 16:58:25','2024-10-17 17:59:48',NULL,'rs',NULL),(107,'08996',8941,140,8,'',220,0,'2024-10-15 16:58:47','2024-10-17 17:59:48',NULL,'ghh',NULL),(108,'0325874598',8941,140,8,'số 2',220,0,'2024-10-15 16:59:09','2024-10-17 17:59:48',NULL,'ttf',NULL),(109,'0325874565',10990,22,5,'Vĩnh Trạch hehe',173,0,'2024-10-15 17:09:57','2024-10-22 11:33:51',NULL,'rrrrr',NULL),(110,'0325874565',10990,22,5,'Vĩnh Trạch',173,0,'2024-10-15 17:13:18','2024-10-22 11:33:51',NULL,'rrrrrff',NULL),(111,'0898989898',1027,24,4,'',173,0,'2024-10-15 17:23:52','2024-10-22 11:33:51',NULL,'',NULL),(112,'0888888888',9987,49,7,'dot oi',173,0,'2024-10-15 17:34:49','2024-10-22 11:33:51',NULL,'le van linhhh',NULL),(113,'0325681472',11035,182,5,'an trạch',220,0,'2024-10-15 17:41:08','2024-10-17 17:59:48',NULL,'yến',NULL),(114,'0987654321',8883,138,8,'',173,0,'2024-10-15 18:02:11','2024-10-22 11:33:51',NULL,'rtgryhryr',NULL),(115,'0325895254',3461,37,6,'ninh xá',220,0,'2024-10-16 11:33:32','2024-10-17 17:59:48',NULL,'thoa',NULL),(116,'0987654112',9914,103,7,'Xuân phương Hà Nội',221,1,'2024-10-16 14:04:35','2024-10-16 14:04:35',NULL,'cửa hàng 25',NULL),(117,'0912228064',6868,233,15,'Địa chỉ cửa hàng 220',173,1,'2024-10-17 17:31:23','2024-10-17 17:31:23',NULL,'Store220',300),(118,'0912228064',6868,233,15,'Địa chỉ cửa hàng 220',173,0,'2024-10-17 17:32:21','2024-10-22 11:33:51',NULL,'Store220',NULL),(119,'0912228064',6868,233,15,'Địa chỉ cửa hàng 220',220,1,'2024-10-17 17:32:46','2024-10-17 17:59:48',NULL,'Store220',NULL),(120,'0912228064',6868,233,15,'Địa chỉ cửa hàng 220',220,0,'2024-10-17 17:33:03','2024-10-17 17:59:48',NULL,'Store220',NULL),(121,'0356865566',10440,9,1,'ghfh',220,0,'2024-10-17 17:34:05','2024-10-17 17:59:48',NULL,'ffhf',NULL),(122,'0987654221',3460,37,6,'hà nội',221,0,'2024-10-17 17:44:57','2024-10-17 17:44:57',NULL,'hhh',NULL),(123,'0987644555',9156,100,2,'ghrhvg',221,0,'2024-10-18 17:19:17','2024-10-18 17:27:57',NULL,'nfnfn',NULL),(124,'0999999976',7912,198,10,'',216,1,'2024-10-18 17:19:51','2024-10-22 10:30:02',NULL,'hrhreh',NULL),(125,'0987655555',9129,677,2,'4',221,0,'2024-10-18 17:31:44','2024-10-18 17:38:56',NULL,'linh van le',NULL),(126,'0987654322',8910,429,8,'6777',221,0,'2024-10-18 17:32:46','2024-10-18 17:32:46',NULL,'rr',NULL),(127,'0987654321',11031,182,5,'gggy',200,0,'2024-10-21 15:23:07','2024-10-21 15:24:03',NULL,'jjjyt',NULL),(128,'0987654321',8884,138,8,'fgg',200,1,'2024-10-21 15:23:40','2024-10-21 15:24:03',NULL,'jji',NULL),(129,'0987668877',11030,182,5,'ddg',216,0,'2024-10-22 10:28:27','2024-10-22 10:30:02',NULL,'hytjtyjtyjtyj',NULL),(130,'0852369874',7888,240,10,'rrr',216,0,'2024-10-22 10:29:08','2024-10-22 10:30:02',NULL,'cggh',NULL),(131,'0326757283',3557,205,6,'ACD ÂSSSSSS',173,1,'2024-10-22 11:33:34','2024-10-22 11:33:51',NULL,'Linh',NULL),(132,'0983723322',9162,100,2,'gbrdhr',216,1,'2024-10-29 13:30:17','2024-10-29 13:55:14',NULL,'fgf fgg',5202),(133,'0977765565',173,179,24,'sfnfđ',216,0,'2024-10-29 13:46:22','2024-10-29 13:49:14',NULL,'dfg fghj',5198),(134,'0896523659',9900,45,7,'egtegegt',216,0,'2024-10-29 16:46:17','2024-10-29 16:46:17',NULL,'DeliveryAddressPage',NULL),(135,'0987636532',9145,19,2,'32323',216,0,'2024-10-29 16:47:36','2024-10-29 16:47:36',NULL,'trhrs',5202),(136,'0987634333',8885,138,8,'frfrff',216,0,'2024-10-29 16:48:56','2024-10-29 16:48:56',NULL,'DeliveryAddressPage',NULL),(137,'0987866654',7815,423,10,'ffgg',216,0,'2024-10-29 16:52:03','2024-10-29 16:52:18',NULL,'gpp',5202),(138,'0325489575',58,96,24,'Số 3 Mai Dịch',222,1,'2024-11-07 14:32:08','2024-11-07 14:32:08',NULL,'Nhà thuốc Đông Y',NULL),(139,'0325489575',58,96,24,'Số 3 Mai Dịch',223,1,'2024-11-07 14:32:30','2024-11-07 14:32:30',NULL,'Nhà thuốc Đông Y',NULL),(140,'0932423432',10432,99,1,'1321',169,1,'2024-11-13 10:32:55','2024-11-13 10:32:55',NULL,'hải',248),(141,'0924343421',10468,437,1,'123',216,1,'2024-11-13 10:35:04','2024-11-13 10:35:04',NULL,'hai',5128),(142,'0987798877',8929,542,8,'ggg',224,1,'2024-11-15 14:11:54','2024-11-15 14:11:54',NULL,'Cửa hàng của Mai',NULL),(143,'0987798877',8929,542,8,'ggg',225,1,'2024-11-15 14:12:02','2024-11-15 14:12:02',NULL,'Cửa hàng của Mai',NULL),(144,'0987798877',8929,542,8,'ggg',226,1,'2024-11-15 14:12:09','2024-11-15 14:12:09',NULL,'Cửa hàng của Mai',NULL),(145,'0987798877',8929,542,8,'ggg',227,0,'2024-11-15 14:12:20','2024-11-15 17:35:03',NULL,'Cửa hàng của Mai',NULL),(146,'0912228064',6868,233,15,'Địa chỉ cửa hàng 220',227,1,'2024-11-15 17:35:03','2024-11-15 17:35:03',NULL,'Store220',NULL),(147,'0976787667',3528,637,6,'hihihi',228,1,'2024-11-18 11:53:04','2024-11-18 11:53:04',NULL,'cuahang30',NULL),(148,'0976787667',3528,637,6,'hihihi',229,1,'2024-11-18 11:53:16','2024-11-18 11:53:16',NULL,'cuahang30',NULL),(149,'0976787667',3528,637,6,'hihihi',230,1,'2024-11-18 11:53:30','2024-11-18 11:53:30',NULL,'cuahang30',NULL),(150,'0865446634',10048,357,7,'Hà Nam',231,1,'2024-11-20 15:56:15','2024-11-20 15:56:15',NULL,'cuahangclonesp',NULL),(151,'0975445445',10047,357,7,'ftftftft',232,1,'2024-11-20 17:13:36','2024-11-20 17:13:36',NULL,'clone',NULL),(152,'0975445445',10047,357,7,'ftftftft',233,1,'2024-11-20 17:13:40','2024-11-20 17:13:40',NULL,'clone',NULL),(153,'0987274219',113,255,24,'Kim Đồng Giáp Bát Hoàng Mai Hà Nội',234,1,'2024-11-22 20:43:59','2024-11-22 20:43:59',NULL,'Cửa hàng 1',NULL),(154,'0325878944',9261,221,30,'Phường 12, Gò Vấp, tp HCM',235,1,'2024-11-26 14:38:11','2024-11-26 14:38:11',NULL,'Nhà thuốc ý học cổ truyền',NULL),(155,'0326653752',2874,318,3,'fsdgfdfg',236,1,'2024-11-28 16:44:34','2024-11-28 16:44:34',NULL,'asdasdas',NULL),(156,'0326658723',2872,318,3,'dâsfasf',237,1,'2024-11-28 16:48:53','2024-11-28 16:48:53',NULL,'zxczxc',NULL);
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:09:43