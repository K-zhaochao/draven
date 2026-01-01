USE `user`;

-- 修改 id 字段为自增
ALTER TABLE `tb_user` MODIFY COLUMN `id` int(11) NOT NULL AUTO_INCREMENT;
