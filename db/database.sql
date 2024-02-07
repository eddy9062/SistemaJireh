CREATE DATABASE IF NOT EXISTS jirehdb;

USE  jirehdb;

CREATE TABLE user (
   id INT(11) NOT NULL AUTO_INCREMENT,
   usuario VARCHAR(50),
   nombre VARCHAR(100),
   roles VARCHAR(50),
   PRIMARY KEY (id)
);