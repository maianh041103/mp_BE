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
-- Table structure for table `provinces`
--

DROP TABLE IF EXISTS `provinces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provinces` (
  `id` tinyint unsigned NOT NULL,
  `vemisId` varchar(5) DEFAULT NULL,
  `vemisName` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `name2` varchar(50) DEFAULT NULL,
  `sname` varchar(50) DEFAULT NULL,
  `dataArea` tinyint DEFAULT NULL COMMENT 'Vùng dữ liệu',
  `economicZone` tinyint DEFAULT NULL COMMENT 'Vùng kinh tế',
  `keyword` varchar(250) DEFAULT NULL,
  `order` tinyint DEFAULT NULL,
  `masterId` bigint unsigned DEFAULT '0',
  `name3` varchar(50) DEFAULT NULL,
  `regionId` tinyint DEFAULT '0',
  `mainEthnicGroup` varchar(250) NOT NULL DEFAULT '1' COMMENT 'Dân tộc chính',
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provinces`
--

LOCK TABLES `provinces` WRITE;
/*!40000 ALTER TABLE `provinces` DISABLE KEYS */;
INSERT INTO `provinces` VALUES (1,'89','An Giang','An Giang','An Giang','AGG',1,8,'-An Giang-An Giang-An Giang-89-AGG-',1,0,'angiang',3,'1',NULL),(2,'77','Bà Rịa - Vũng Tàu','Bà Rịa Vũng Tàu','Ba Ria - Vung Tau','BVT',1,7,'-Bà Rịa Vũng Tàu-Ba Ria Vung Tau-Ba Ria - Vung Tau-Bà Rịa - Vũng Tàu-Vung Tau-Vũng Tàu-77-BVT-',2,0,'bariavungtau',3,'1',NULL),(3,'24','Bắc Giang','Bắc Giang','Bac Giang','BGG',2,2,'-Bắc Giang-Bac Giang-Bắc Giang-24-BGG-',3,0,'bacgiang',1,'1',NULL),(4,'06','Bắc Kạn','Bắc Kạn','Bac Kan','BKN',2,2,'-Bắc Kạn-Bac Kan-Bắc Kạn-6-BKN-',4,0,'backan',1,'1',NULL),(5,'95','Bạc Liêu','Bạc Liêu','Bac Lieu','BLU',1,8,'-Bạc Liêu-Bac Lieu-Bạc Liêu-95-BLU-',5,0,'baclieu',3,'1',NULL),(6,'27','Bắc Ninh','Bắc Ninh','Bac Ninh','BNH',1,1,'-Bắc Ninh-Bac Ninh-Bắc Ninh-27-BNH-',6,0,'bacninh',1,'1',NULL),(7,'83','Bến Tre','Bến Tre','Ben Tre','BTE',1,8,'-Bến Tre-Ben Tre-Bến Tre-83-BTE-',7,0,'bentre',3,'1',NULL),(8,'74','Bình Dương','Bình Dương','Binh Duong','BDG',1,7,'-Bình Dương-Binh Duong-Bình Dương-74-BDG-',8,0,'binhduong',3,'1',NULL),(9,'70','Bình Phước','Bình Phước','Binh Phuoc','BPC',1,7,'-Bình Phước-Binh Phuoc-Bình Phước-70-BPC-',9,0,'binhphuoc',3,'1',NULL),(10,'60','Bình Thuận','Bình Thuận','Binh Thuan','BTN',5,5,'-Bình Thuận-Binh Thuan-Bình Thuận-60-BTN-',10,0,'binhthuan',2,'1',NULL),(11,'52','Bình Định','Bình Định','Binh Dinh','BDH',5,5,'-Bình Định-Binh Dinh-Bình Định-52-BDH-',11,0,'binhdinh',2,'1',NULL),(12,'96','Cà Mau','Cà Mau','Ca Mau','CMU',1,8,'-Cà Mau-Ca Mau-Cà Mau-96-CMU-',12,0,'camau',3,'1',NULL),(13,'92','Thành phố Cần Thơ','Cần Thơ','Can Tho','CTO',1,8,'-Cần Thơ-Can Tho-Thành phố Cần Thơ-92-CTO-',13,0,'cantho',3,'1',NULL),(14,'04','Cao Bằng','Cao Bằng','Cao Bang','CBG',2,2,'-Cao Bằng-Cao Bang-Cao Bằng-4-CBG-',14,0,'caobang',1,'1',NULL),(15,'48','Thành phố Đà Nẵng','Đà Nẵng','Da Nang','ĐNG',5,5,'-Đà Nẵng-Da Nang-Thành phố Đà Nẵng-48-ĐNG-',15,0,'danang',2,'1',NULL),(16,'66','Đắk Lắk','Đăk Lăk','Dak Lak','ĐLK',6,6,'-Đăk Lăk-Dak Lak-Đắk Lắk-66-ĐLK-',16,0,'daklak',2,'1',NULL),(17,'67','Đắk Nông','Đăk Nông','Dak Nong','DKG',6,6,'-Đăk Nông-Dak Nong-Đắk Nông-67-ĐNG-',17,0,'daknong',2,'1',NULL),(18,'11','Điện Biên','Điện Biên','Dien Bien','ĐBN',3,3,'-Điện Biên-Dien Bien-Điện Biên-11-ĐBN-',18,0,'dienbien',1,'1',NULL),(19,'75','Đồng Nai','Đồng Nai','Dong Nai','ĐNI',1,7,'-Đồng Nai-Dong Nai-Đồng Nai-75-ĐNI-',19,0,'dongnai',3,'1',NULL),(20,'87','Đồng Tháp','Đồng Tháp','Dong Thap','ĐTP',1,8,'-Đồng Tháp-Dong Thap-Đồng Tháp-87-ĐTP-',20,0,'dongthap',3,'1',NULL),(21,'64','Gia Lai','Gia Lai','Gia Lai','GLI',6,6,'-Gia Lai-Gia Lai-Gia Lai-64-GLI-',21,0,'gialai',2,'1',NULL),(22,'02','Hà Giang','Hà Giang','Ha Giang','HAG',2,2,'-Hà Giang-Ha Giang-Hà Giang-2-HAG-',22,0,'hagiang',1,'1',NULL),(23,'35','Hà Nam','Hà Nam','Ha Nam','HNM',1,1,'-Hà Nam-Ha Nam-Hà Nam-35-HNM-',23,0,'hanam',1,'1',NULL),(24,'01','Thành phố Hà Nội','TP. Hà Nội','TP. Ha Noi','HNI',1,1,'-TP. Hà Nội-TP. Ha Noi-Thành phố Hà Nội-1-HNI-',24,0,'hanoi',1,'1',NULL),(26,'42','Hà Tĩnh','Hà Tĩnh','Ha Tinh','HTH',4,4,'-Hà Tĩnh-Ha Tinh-Hà Tĩnh-42-HTH-',26,0,'hatinh',2,'1',NULL),(27,'30','Hải Dương','Hải Dương','Hai Duong','HDG',1,1,'-Hải Dương-Hai Duong-Hải Dương-30-HDG-',27,0,'haiduong',1,'1',NULL),(28,'31','Thành phố Hải Phòng','Hải Phòng','Hai Phong','HPG',1,1,'-Hải Phòng-Hai Phong-Thành phố Hải Phòng-31-HPG-',28,0,'haiphong',1,'1',NULL),(29,'93','Hậu Giang','Hậu Giang','Hau Giang','HGG',1,8,'-Hậu Giang-Hau Giang-Hậu Giang-93-HGG-',29,0,'haugiang',3,'1',NULL),(30,'79','Thành phố Hồ Chí Minh','TP. Hồ Chí Minh','TP. Ho Chi Minh','HCM',1,7,'-TP. Hồ Chí Minh-TP. Ho Chi Minh-Thành phố Hồ Chí Minh-Ho Chi Minh-Hồ Chí Minh-79-HCM-',30,0,'tphochiminh',3,'1',NULL),(31,'17','Hòa Bình','Hòa Bình','Hoa Binh','HBH',3,3,'-Hòa Bình-Hoa Binh-Hòa Bình-17-HBH-',31,0,'hoabinh',1,'1',NULL),(32,'33','Hưng Yên','Hưng Yên','Hung Yen','HYN',1,1,'-Hưng Yên-Hung Yen-Hưng Yên-33-HYN-',32,0,'hungyen',1,'1',NULL),(33,'56','Khánh Hoà','Khánh Hoà','Khanh Hoa','KHA',5,5,'-Khánh Hoà-Khanh Hoa-Khánh Hoà-56-KHA-',33,0,'khanhhoa',2,'1',NULL),(34,'91','Kiên Giang','Kiên Giang','Kien Giang','KGG',1,8,'-Kiên Giang-Kien Giang-Kiên Giang-91-KGG-',34,0,'kiengiang',3,'1',NULL),(35,'62','Kon Tum','Kon Tum','Kon Tum','KTM',6,6,'-Kon Tum-Kon Tum-Kon Tum-62-KTM-',35,0,'kontum',2,'1',NULL),(36,'12','Lai Châu','Lai Châu','Lai Chau','LCU',3,3,'-Lai Châu-Lai Chau-Lai Châu-12-LCU-',36,0,'laichau',1,'1',NULL),(37,'68','Lâm Đồng','Lâm Đồng','Lam Dong','LĐG',6,6,'-Lâm Đồng-Lam Dong-Lâm Đồng-68-LĐG-',37,0,'lamdong',2,'1',NULL),(38,'20','Lạng Sơn','Lạng Sơn','Lang Son','LSN',2,2,'-Lạng Sơn-Lang Son-Lạng Sơn-20-LSN-',38,0,'langson',1,'1',NULL),(39,'10','Lào Cai','Lào Cai','Lao Cai','LCI',3,3,'-Lào Cai-Lao Cai-Lào Cai-10-LCI-',39,0,'laocai',1,'1',NULL),(40,'80','Long An','Long An','Long An','VT',1,7,'-Long An-Long An-Long An-80-VT-',40,0,'longan',3,'1',NULL),(41,'36','Nam Định','Nam Định','Nam Dinh','NĐH',1,1,'-Nam Định-Nam Dinh-Nam Định-36-NĐH-',41,0,'namdinh',1,'1',NULL),(42,'40','Nghệ An','Nghệ An','Nghe An','NAN',4,4,'-Nghệ An-Nghe An-Nghệ An-40-NAN-',42,415861723,'nghean',2,'1',NULL),(43,'37','Ninh Bình','Ninh Bình','Ninh Binh','NBH',1,1,'-Ninh Bình-Ninh Binh-Ninh Bình-37-NBH-',43,0,'ninhbinh',1,'1',NULL),(44,'58','Ninh Thuận','Ninh Thuận','Ninh Thuan','NTN',5,5,'-Ninh Thuận-Ninh Thuan-Ninh Thuận-58-NTN-',44,0,'ninhthuan',2,'1',NULL),(45,'25','Phú Thọ','Phú Thọ','Phu Tho','PTO',2,2,'-Phú Thọ-Phu Tho-Phú Thọ-25-PTO-',45,0,'phutho',1,'1',NULL),(46,'54','Phú Yên','Phú Yên','Phu Yen','PYN',5,5,'-Phú Yên-Phu Yen-Phú Yên-54-PYN-',46,0,'phuyen',2,'1',NULL),(47,'44','Quảng Bình','Quảng Bình','Quang Binh','QBH',4,4,'-Quảng Bình-Quang Binh-Quảng Bình-44-QBH-',47,0,'quangbinh',2,'1',NULL),(48,'49','Quảng Nam','Quảng Nam','Quang Nam','QNM',5,5,'-Quảng Nam-Quang Nam-Quảng Nam-49-QNM-',48,0,'quangnam',2,'1',NULL),(49,'51','Quảng Ngãi','Quảng Ngãi','Quang Ngai','QNI',5,5,'-Quảng Ngãi-Quang Ngai-Quảng Ngãi-51-QNI-',49,0,'quangngai',2,'1',NULL),(50,'22','Quảng Ninh','Quảng Ninh','Quang Ninh','QNH',2,2,'-Quảng Ninh-Quang Ninh-Quảng Ninh-22-QNH-',50,0,'quangninh',1,'1',NULL),(51,'45','Quảng Trị','Quảng Trị','Quang Tri','QTR',4,4,'-Quảng Trị-Quang Tri-Quảng Trị-45-QTR-',51,0,'quangtri',2,'1',NULL),(52,'94','Sóc Trăng','Sóc Trăng','Soc Trang','STG',1,8,'-Sóc Trăng-Soc Trang-Sóc Trăng-94-STG-',52,0,'soctrang',3,'1',NULL),(53,'14','Sơn La','Sơn La','Son La','SLA',3,3,'-Sơn La-Son La-Sơn La-14-SLA-',53,0,'sonla',1,'1',NULL),(54,'72','Tây Ninh','Tây Ninh','Tay Ninh','TNH',1,7,'-Tây Ninh-Tay Ninh-Tây Ninh-72-TNH-',54,0,'tayninh',3,'1',NULL),(55,'34','Thái Bình','Thái Bình','Thai Binh','TBH',1,1,'-Thái Bình-Thai Binh-Thái Bình-34-TBH-',55,0,'thaibinh',1,'1',NULL),(56,'19','Thái Nguyên','Thái Nguyên','Thai Nguyen','TNN',2,2,'-Thái Nguyên-Thai Nguyen-Thái Nguyên-19-TNN-',56,0,'thainguyen',1,'1',NULL),(57,'38','Thanh Hoá','Thanh Hóa','Thanh Hoa','THA',4,4,'-Thanh Hóa-Thanh Hoa-Thanh Hoá-38-THA-',57,415861723,'thanhhoa',2,'1',NULL),(58,'46','Thừa Thiên - Huế','Thừa Thiên Huế','Thua Thien Hue','TTH',4,4,'-Thừa Thiên Huế-Thua Thien Hue-Thừa Thiên - Huế-hue-46-TTH-',58,0,'thuathienhue',2,'1',NULL),(59,'82','Tiền Giang','Tiền Giang','Tien Giang','TGG',1,8,'-Tiền Giang-Tien Giang-Tiền Giang-82-TGG-',59,0,'tiengiang',3,'1',NULL),(60,'84','Trà Vinh','Trà Vinh','Tra Vinh','TVH',1,8,'-Trà Vinh-Tra Vinh-Trà Vinh-84-TVH-',60,0,'travinh',3,'1',NULL),(61,'08','Tuyên Quang','Tuyên Quang','Tuyen Quang','TQG',2,2,'-Tuyên Quang-Tuyen Quang-Tuyên Quang-8-TQG-',61,0,'tuyenquang',1,'1',NULL),(62,'86','Vĩnh Long','Vĩnh Long','Vinh Long','VLG',1,8,'-Vĩnh Long-Vinh Long-Vĩnh Long-86-VLG-',62,0,'vinhlong',3,'1',NULL),(63,'26','Vĩnh Phúc','Vĩnh Phúc','Vinh Phuc','VPC',1,1,'-Vĩnh Phúc-Vinh Phuc-Vĩnh Phúc-26-VPC-',63,0,'vinhphuc',1,'1',NULL),(64,'15','Yên Bái','Yên Bái','Yen Bai','YBI',3,3,'-Yên Bái-Yen Bai-Yên Bái-15-YBI-',64,0,'yenbai',1,'1',NULL);
/*!40000 ALTER TABLE `provinces` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 14:09:49
