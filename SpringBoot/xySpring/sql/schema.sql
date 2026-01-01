CREATE DATABASE IF NOT EXISTS `user` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `user`;

CREATE TABLE IF NOT EXISTS `tb_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `nick_name` varchar(50) NOT NULL COMMENT '用户名/仙号',
  `password` varchar(100) NOT NULL COMMENT '密码',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_nick_name` (`nick_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

INSERT INTO `tb_user` (`nick_name`, `password`) VALUES ('admin', '123456');
