-- 1. Criação da Tabela (CREATE)
CREATE TABLE Livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    estadoConservacao VARCHAR(255) NOT NULL,
    nomeDoador VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

-- 2. Inserção de Dados (INSERT / C do CRUD)
INSERT INTO Livros (titulo, autor, estadoConservacao, nomeDoador, createdAt, updatedAt)
VALUES ('O Alquimista', 'Paulo Coelho', 'Novo', 'Maria Silva', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO Livros (titulo, autor, estadoConservacao, nomeDoador, createdAt, updatedAt)
VALUES ('1984', 'George Orwell', 'Usado / Marcas de Uso', 'João Pedro', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3. Consulta (SELECT / R do CRUD)
-- Traz todos os livros cadastrados
SELECT * FROM Livros;

-- Traz apenas os livros doados por um usuário específico
SELECT titulo, estadoConservacao FROM Livros WHERE nomeDoador = 'Maria Silva';

-- 4. Alteração (UPDATE / U do CRUD)
-- Atualiza o estado de conservação do livro de ID 1
UPDATE Livros 
SET estadoConservacao = 'Muito Bom', updatedAt = CURRENT_TIMESTAMP 
WHERE id = 1;

-- 5. Exclusão (DELETE / D do CRUD)
-- Deleta o livro de ID 2 (caso o usuário desista da doação)
DELETE FROM Livros WHERE id = 2;