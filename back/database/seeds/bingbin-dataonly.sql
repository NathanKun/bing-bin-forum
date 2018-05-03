-- phpMyAdmin SQL Dump
-- version 4.7.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2018-03-28 17:29:30
-- 服务器版本： 5.5.56-log
-- PHP Version: 7.1.7

--
-- Database: `bingbin`
--

--
-- 转存表中的数据 `TrashesTypes`
--

INSERT INTO `TrashesTypes` (`id`, `name`, `eco_point`, `degradation`) VALUES
('1', 'Plastique', 8, '1000 years'),
('2', 'Metal', 4, '200 years'),
('3', 'Carton', 3, 'about several month'),
('4', 'Papier', 3, 'about several month'),
('5', 'Verre', 10, '4000 years'),
('6', 'Dechet menager', 2, 'about several month'),
('7', 'Ampoules', 2, '5000 years'),
('8', 'Encombrant', 10, '2000 years'),
('9', 'Equipement electronique', 15, '2000 ans'),
('10', 'Piles', 15, '5000 years'),
('11', 'Vetements uses', 3, '100 years'),
('12', 'Medicament', 2, 'about several month'),
('13', 'Cigarette', 2, ''),
('14', 'Human', 1, ''),
('99', 'Other', 1, '');