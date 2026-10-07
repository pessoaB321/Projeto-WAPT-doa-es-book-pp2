const express = require('express');
const router = express.Router();

// Array na memória que simula o banco de dados
let listadeLivros = [
    { id: 1, titulo: "Exemplo de Livro", autor: "Autor Exemplo", estadoConservacao: "Muito Bom" }
];

// Exibir formulário e listagem
router.get('/doar', (req, res) => {
    res.render('livros/doar', { livros: listadeLivros });
});

// Exibir recibo de uma doação
router.get('/doar/recibo/:id', (req, res) => {
    const id = Number(req.params.id);
    const livro = listadeLivros.find(item => item.id === id);

    if (!livro) {
        return res.status(404).send('Doação não encontrada.');
    }

    const recibo = {
        ...livro,
        dataDoacao: livro.dataDoacao
            ? new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'long',
                timeStyle: 'short'
            }).format(new Date(livro.dataDoacao))
            : 'Não registrada'
    };

    res.render('livros/recibo', { livro: recibo });
});

// Cadastrar nova doação
router.post('/doar/add', (req, res) => {
    const { titulo, autor, estadoConservacao } = req.body;
    
    const novoLivro = {
        id: Date.now(), // Gera um ID único simples usando o timestamp
        titulo,
        autor,
        estadoConservacao,
        dataDoacao: new Date().toISOString()
    };

    listadeLivros.push(novoLivro);
    res.redirect(`/livros/doar/recibo/${novoLivro.id}`);
});

// Remover doação
router.post('/doar/remove', (req, res) => {
    const { id } = req.body;
    // Filtra a lista removendo o livro com o ID enviado
    listadeLivros = listadeLivros.filter(livro => livro.id !== parseInt(id));
    res.redirect('/livros/doar');
});

module.exports = router;
