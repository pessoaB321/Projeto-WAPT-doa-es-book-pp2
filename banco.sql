-- 1. Criação da tabela de Livros para Doação
CREATE TABLE IF NOT EXISTS Livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    estadoConservacao VARCHAR(255) NOT NULL,
    usuarioId INTEGER DEFAULT 1,
    createdAt DATETIME,
    updatedAt DATETIME
);

-- 2. Exemplo de Inserção (Insert) para popular o banco inicial
INSERT INTO Livros (titulo, autor, estadoConservacao, usuarioId, createdAt, updatedAt) 
VALUES ('O Alquimista', 'Paulo Coelho', 'Muito Bom', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3. Exemplo de Consulta (Select) usada na listagem de doações
SELECT id, titulo, autor, estadoConservacao, usuarioId FROM Livros;

-- 4. Exemplo de Alteração (Update) caso o usuário edite o livro
UPDATE Livros 
SET estadoConservacao = 'Usado' 
WHERE id = 1;

-- 5. Exemplo de Exclusão (Delete) caso o livro seja removido ou doado
DELETE FROM Livros 
WHERE id = 1;
