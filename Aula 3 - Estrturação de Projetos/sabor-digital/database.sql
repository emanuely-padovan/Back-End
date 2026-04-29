CREATE DATABASE IF NOT EXISTS sabordigital;
-- drop database sabordigital;
USE sabordigital;

CREATE TABLE IF NOT EXISTS produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    disponivel BOOLEAN NOT NULL
);

INSERT INTO produto (nome, descricao, preco, disponivel) 
VALUES 
		("Torta de Limão", "Torta de Limão refrescante, para adoçar a sua vida", 15.00, true), 
		("Nhoque ao Molho Pesto", "Nhoque ao Molho Pesto fresquinho!", 20.00, true),
        ("Pudim de Leite", "Pudim feito com a receita da vovó!", 20.00, true);

SELECT * FROM produto;