CREATE DATABASE IF NOT EXISTS patrick2dsb2;
USE patrick2dsb2;

DROP TABLE IF EXISTS horario_aula;
DROP TABLE IF EXISTS aula;

CREATE TABLE aula
(
 id INT PRIMARY KEY AUTO_INCREMENT,  
 serie CHAR(2) NOT NULL,  
 turma VARCHAR(6) NOT NULL,  
 componente VARCHAR(100) NOT NULL,  
 professor VARCHAR(100) NOT NULL
);

CREATE TABLE horario_aula
(
 id INT PRIMARY KEY AUTO_INCREMENT,  
 idaula INT NOT NULL,  
 dia_semana VARCHAR(7) NOT NULL,  
 ordem INT NOT NULL 
);

ALTER TABLE horario_aula ADD FOREIGN KEY(idaula) REFERENCES aula (id);

INSERT INTO aula (serie, turma, componente, professor) VALUES
("2º", "DSB", "Programação Back End", "Ronaldo");
