-- MySQL dump 10.13  Distrib 8.4.13, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: kinemo-platform-wa
-- ------------------------------------------------------
-- Server version	8.4.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `kinemo-platform-wa`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `kinemo-platform-wa` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `kinemo-platform-wa`;

--
-- Table structure for table `configuration_history_entries`
--

DROP TABLE IF EXISTS `configuration_history_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuration_history_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sensory_content_id` int NOT NULL,
  `previous_intensity` varchar(20) NOT NULL,
  `new_intensity` varchar(20) NOT NULL,
  `changed_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_configuration_history_entries_sensory_content_id` (`sensory_content_id`),
  CONSTRAINT `fk_configuration_history_sensory_contents` FOREIGN KEY (`sensory_content_id`) REFERENCES `sensory_contents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuration_history_entries`
--

LOCK TABLES `configuration_history_entries` WRITE;
/*!40000 ALTER TABLE `configuration_history_entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `configuration_history_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboards`
--

DROP TABLE IF EXISTS `dashboards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dashboards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `generated_at` datetime NOT NULL,
  `period_start` datetime NOT NULL,
  `period_end` datetime NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboards`
--

LOCK TABLES `dashboards` WRITE;
/*!40000 ALTER TABLE `dashboards` DISABLE KEYS */;
/*!40000 ALTER TABLE `dashboards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emergency_events`
--

DROP TABLE IF EXISTS `emergency_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emergency_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `execution_id` int NOT NULL,
  `reason` varchar(500) NOT NULL,
  `triggered_at` datetime NOT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_emergency_events_execution_id` (`execution_id`),
  CONSTRAINT `fk_emergency_events_executions` FOREIGN KEY (`execution_id`) REFERENCES `show_executions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_events`
--

LOCK TABLES `emergency_events` WRITE;
/*!40000 ALTER TABLE `emergency_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `emergency_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hardware_execution_logs`
--

DROP TABLE IF EXISTS `hardware_execution_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hardware_execution_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `execution_id` int NOT NULL,
  `occurred_at` datetime NOT NULL,
  `message` varchar(1000) NOT NULL,
  `severity` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_hardware_execution_logs_execution_id` (`execution_id`),
  CONSTRAINT `fk_hardware_logs_executions` FOREIGN KEY (`execution_id`) REFERENCES `show_executions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hardware_execution_logs`
--

LOCK TABLES `hardware_execution_logs` WRITE;
/*!40000 ALTER TABLE `hardware_execution_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `hardware_execution_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_summaries`
--

DROP TABLE IF EXISTS `incident_summaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_summaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dashboard_id` int NOT NULL,
  `total_incidents` int NOT NULL,
  `low_count` int NOT NULL,
  `medium_count` int NOT NULL,
  `high_count` int NOT NULL,
  `critical_count` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_incident_summaries_dashboard_id` (`dashboard_id`),
  CONSTRAINT `fk_incident_sum_dashboards` FOREIGN KEY (`dashboard_id`) REFERENCES `dashboards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_summaries`
--

LOCK TABLES `incident_summaries` WRITE;
/*!40000 ALTER TABLE `incident_summaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `incident_summaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `duration_minutes` int NOT NULL,
  `genre` varchar(30) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `i_x_movies_title` (`title`),
  KEY `i_x_movies_genre` (`genre`),
  KEY `i_x_movies_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES (1,'jj',0,'SciFi','Active','2026-11-11 19:23:02','2026-11-11 19:23:02'),(2,'2erewf',50,'Animation','Active','2026-11-11 20:01:49','2026-11-11 20:01:49');
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operational_metrics`
--

DROP TABLE IF EXISTS `operational_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operational_metrics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dashboard_id` int NOT NULL,
  `metric_type` varchar(30) NOT NULL,
  `metric_value` decimal(18,2) NOT NULL,
  `period_start` datetime NOT NULL,
  `period_end` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_operational_metrics_dashboard_id` (`dashboard_id`),
  CONSTRAINT `fk_metrics_dashboards` FOREIGN KEY (`dashboard_id`) REFERENCES `dashboards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operational_metrics`
--

LOCK TABLES `operational_metrics` WRITE;
/*!40000 ALTER TABLE `operational_metrics` DISABLE KEYS */;
/*!40000 ALTER TABLE `operational_metrics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operational_reports`
--

DROP TABLE IF EXISTS `operational_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operational_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_type` varchar(30) NOT NULL,
  `generated_at` datetime NOT NULL,
  `period_start` datetime NOT NULL,
  `period_end` datetime NOT NULL,
  `export_format` varchar(10) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operational_reports`
--

LOCK TABLES `operational_reports` WRITE;
/*!40000 ALTER TABLE `operational_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `operational_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_transactions`
--

DROP TABLE IF EXISTS `payment_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subscription_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `processed_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_payment_transactions_subscription_id` (`subscription_id`),
  CONSTRAINT `fk_payment_transactions_subscriptions` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_transactions`
--

LOCK TABLES `payment_transactions` WRITE;
/*!40000 ALTER TABLE `payment_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_blocks`
--

DROP TABLE IF EXISTS `room_blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_blocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `reason` varchar(500) NOT NULL,
  `start_date_time` datetime NOT NULL,
  `end_date_time` datetime NOT NULL,
  `active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_room_blocks_room_id` (`room_id`),
  CONSTRAINT `fk_room_blocks_rooms` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_blocks`
--

LOCK TABLES `room_blocks` WRITE;
/*!40000 ALTER TABLE `room_blocks` DISABLE KEYS */;
/*!40000 ALTER TABLE `room_blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_inspections`
--

DROP TABLE IF EXISTS `room_inspections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_inspections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `inspected_at` datetime NOT NULL,
  `observations` varchar(1000) NOT NULL,
  `result` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_room_inspections_room_id` (`room_id`),
  CONSTRAINT `fk_room_inspections_rooms` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_inspections`
--

LOCK TABLES `room_inspections` WRITE;
/*!40000 ALTER TABLE `room_inspections` DISABLE KEYS */;
/*!40000 ALTER TABLE `room_inspections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_performances`
--

DROP TABLE IF EXISTS `room_performances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_performances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dashboard_id` int NOT NULL,
  `room_id` int NOT NULL,
  `operating_hours` decimal(18,2) NOT NULL,
  `total_shows` int NOT NULL,
  `incident_count` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_room_performances_dashboard_id` (`dashboard_id`),
  CONSTRAINT `fk_room_perf_dashboards` FOREIGN KEY (`dashboard_id`) REFERENCES `dashboards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_performances`
--

LOCK TABLES `room_performances` WRITE;
/*!40000 ALTER TABLE `room_performances` DISABLE KEYS */;
/*!40000 ALTER TABLE `room_performances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `capacity` int NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `i_x_rooms_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'ournvbjfdn',1,'Available','2026-11-11 20:02:05','2026-11-11 20:02:05');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule_conflicts`
--

DROP TABLE IF EXISTS `schedule_conflicts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule_conflicts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `show_id` int NOT NULL,
  `conflicting_show_id` int NOT NULL,
  `detected_at` datetime NOT NULL,
  `description` varchar(500) NOT NULL,
  `resolved` tinyint(1) NOT NULL,
  `resolved_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_schedule_conflicts_conflicting_show_id` (`conflicting_show_id`),
  KEY `i_x_schedule_conflicts_show_id` (`show_id`),
  CONSTRAINT `fk_schedule_conflicts_shows_conflicting_id` FOREIGN KEY (`conflicting_show_id`) REFERENCES `shows` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_schedule_conflicts_shows_show_id` FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule_conflicts`
--

LOCK TABLES `schedule_conflicts` WRITE;
/*!40000 ALTER TABLE `schedule_conflicts` DISABLE KEYS */;
/*!40000 ALTER TABLE `schedule_conflicts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensory_contents`
--

DROP TABLE IF EXISTS `sensory_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensory_contents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `movie_id` int NOT NULL,
  `intensity_level` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `i_x_sensory_contents_movie_id` (`movie_id`),
  CONSTRAINT `fk_sensory_contents_movies` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensory_contents`
--

LOCK TABLES `sensory_contents` WRITE;
/*!40000 ALTER TABLE `sensory_contents` DISABLE KEYS */;
INSERT INTO `sensory_contents` VALUES (1,1,'Medium','Draft','2026-11-11 19:23:02','2026-11-11 19:23:02'),(2,2,'Medium','Draft','2026-11-11 20:01:49','2026-11-11 20:01:49');
/*!40000 ALTER TABLE `sensory_contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensory_sequences`
--

DROP TABLE IF EXISTS `sensory_sequences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensory_sequences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `execution_id` int NOT NULL,
  `sensory_track_id` int NOT NULL,
  `current_time_code` bigint NOT NULL,
  `actual_time_code` bigint NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_sensory_sequences_execution_id` (`execution_id`),
  CONSTRAINT `fk_sensory_sequences_executions` FOREIGN KEY (`execution_id`) REFERENCES `show_executions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensory_sequences`
--

LOCK TABLES `sensory_sequences` WRITE;
/*!40000 ALTER TABLE `sensory_sequences` DISABLE KEYS */;
/*!40000 ALTER TABLE `sensory_sequences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensory_tracks`
--

DROP TABLE IF EXISTS `sensory_tracks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensory_tracks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sensory_content_id` int NOT NULL,
  `effect_type` varchar(20) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `duration_seconds` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_sensory_tracks_sensory_content_id` (`sensory_content_id`),
  CONSTRAINT `fk_sensory_tracks_sensory_contents` FOREIGN KEY (`sensory_content_id`) REFERENCES `sensory_contents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensory_tracks`
--

LOCK TABLES `sensory_tracks` WRITE;
/*!40000 ALTER TABLE `sensory_tracks` DISABLE KEYS */;
/*!40000 ALTER TABLE `sensory_tracks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `show_executions`
--

DROP TABLE IF EXISTS `show_executions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `show_executions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `show_id` int NOT NULL,
  `sensory_content_id` int NOT NULL,
  `status` varchar(30) NOT NULL,
  `started_at` datetime NOT NULL,
  `finished_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `show_executions`
--

LOCK TABLES `show_executions` WRITE;
/*!40000 ALTER TABLE `show_executions` DISABLE KEYS */;
/*!40000 ALTER TABLE `show_executions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `show_occupancies`
--

DROP TABLE IF EXISTS `show_occupancies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `show_occupancies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `integration_id` int NOT NULL,
  `show_id` int NOT NULL,
  `total_seats` int NOT NULL,
  `occupied_seats` int NOT NULL,
  `synchronized_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_show_occupancies_integration_id` (`integration_id`),
  CONSTRAINT `fk_show_occupancies_integrations` FOREIGN KEY (`integration_id`) REFERENCES `ticketing_integrations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `show_occupancies`
--

LOCK TABLES `show_occupancies` WRITE;
/*!40000 ALTER TABLE `show_occupancies` DISABLE KEYS */;
/*!40000 ALTER TABLE `show_occupancies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shows`
--

DROP TABLE IF EXISTS `shows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shows` (
  `id` int NOT NULL AUTO_INCREMENT,
  `movie_id` int NOT NULL,
  `room_id` int NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `end_datetime` datetime NOT NULL,
  `start_datetime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shows`
--

LOCK TABLES `shows` WRITE;
/*!40000 ALTER TABLE `shows` DISABLE KEYS */;
/*!40000 ALTER TABLE `shows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_plans`
--

DROP TABLE IF EXISTS `subscription_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription_plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plan_type` varchar(30) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `max_screens` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `i_x_subscription_plans_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_plans`
--

LOCK TABLES `subscription_plans` WRITE;
/*!40000 ALTER TABLE `subscription_plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscription_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_upgrades`
--

DROP TABLE IF EXISTS `subscription_upgrades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription_upgrades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subscription_id` int NOT NULL,
  `old_plan_id` int NOT NULL,
  `new_plan_id` int NOT NULL,
  `changed_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_subscription_upgrades_subscription_id` (`subscription_id`),
  CONSTRAINT `fk_subscription_upgrades_subscriptions` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_upgrades`
--

LOCK TABLES `subscription_upgrades` WRITE;
/*!40000 ALTER TABLE `subscription_upgrades` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscription_upgrades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cinema_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `status` varchar(20) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sync_logs`
--

DROP TABLE IF EXISTS `sync_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sync_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `integration_id` int NOT NULL,
  `show_id` int NOT NULL,
  `executed_at` datetime NOT NULL,
  `status` varchar(20) NOT NULL,
  `error_details` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_sync_logs_integration_id` (`integration_id`),
  CONSTRAINT `fk_sync_logs_integrations` FOREIGN KEY (`integration_id`) REFERENCES `ticketing_integrations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sync_logs`
--

LOCK TABLES `sync_logs` WRITE;
/*!40000 ALTER TABLE `sync_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `sync_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `synchronization_events`
--

DROP TABLE IF EXISTS `synchronization_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `synchronization_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `execution_id` int NOT NULL,
  `expected_time_code` bigint NOT NULL,
  `actual_time_code` bigint NOT NULL,
  `drift_milliseconds` bigint NOT NULL,
  `occurred_at` datetime NOT NULL,
  `event_type` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_x_synchronization_events_execution_id` (`execution_id`),
  CONSTRAINT `fk_sync_events_executions` FOREIGN KEY (`execution_id`) REFERENCES `show_executions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `synchronization_events`
--

LOCK TABLES `synchronization_events` WRITE;
/*!40000 ALTER TABLE `synchronization_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `synchronization_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticketing_integrations`
--

DROP TABLE IF EXISTS `ticketing_integrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticketing_integrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cinema_id` int NOT NULL,
  `provider_name` varchar(150) NOT NULL,
  `status` varchar(20) NOT NULL,
  `last_connection_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticketing_integrations`
--

LOCK TABLES `ticketing_integrations` WRITE;
/*!40000 ALTER TABLE `ticketing_integrations` DISABLE KEYS */;
INSERT INTO `ticketing_integrations` VALUES (1,1,'coca','Connected','2026-11-11 20:02:29','2026-11-11 20:02:30','2026-11-11 20:02:30');
/*!40000 ALTER TABLE `ticketing_integrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-11 19:30:20
