-- phpMyAdmin SQL Dump
-- version 4.0.4.2
-- http://www.phpmyadmin.net
--
-- Máquina: localhost
-- Data de Criação: 25-Out-2026 às 22:46
-- Versão do servidor: 5.6.13
-- versão do PHP: 5.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de Dados: `cadastro_produtos`
--
CREATE DATABASE IF NOT EXISTS `cadastro_produtos` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `cadastro_produtos`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `cad_produtos`
--

CREATE TABLE IF NOT EXISTS `cad_produtos` (
  `id_prod` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `prod_desc` varchar(150) NOT NULL,
  `prod_cat` varchar(80) NOT NULL,
  `prod_compra` decimal(10,2) NOT NULL DEFAULT '0.00',
  `prod_venda` decimal(10,2) NOT NULL DEFAULT '0.00',
  `prod_qnt_est` int(10) unsigned NOT NULL DEFAULT '0',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_prod`),
  UNIQUE KEY `uq_prod_desc` (`prod_desc`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Extraindo dados da tabela `cad_produtos`
--

INSERT INTO `cad_produtos` (`id_prod`, `prod_desc`, `prod_cat`, `prod_compra`, `prod_venda`, `prod_qnt_est`, `criado_em`) VALUES
(1, 'Teclado USB', 'Informática', '45.00', '69.90', 20, '2026-10-25 21:53:04'),
(2, 'Mouse USB', 'Informática', '20.00', '35.90', 30, '2026-10-25 22:07:33');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios`
--

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) NOT NULL,
  `login` varchar(190) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `perfil` enum('cliente','admin') NOT NULL DEFAULT 'cliente',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uk_usuarios_login` (`login`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nome`, `login`, `senha`, `perfil`, `criado_em`) VALUES
(1, 'Administrador', 'admin2000@gmail.com', '2000univ', 'admin', '2026-10-25 21:38:15'),
(2, 'Ana Universitária', 'ana.teste@exemplo.com', 'teste123', 'cliente', '2026-10-25 22:10:01');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
