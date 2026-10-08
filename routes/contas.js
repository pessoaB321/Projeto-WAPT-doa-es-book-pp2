const crypto = require('crypto');
const { promisify } = require('util');
const express = require('express');
const { Op } = require('sequelize');
const Conta = require('../models/conta.Model');

const router = express.Router();
const scrypt = promisify(crypto.scrypt);

async function hashSenha(senha) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await scrypt(senha, salt, 64);
    return `${salt}:${hash.toString('hex')}`;
}

router.get('/', async (req, res) => {
    const termo = (req.query.busca || '').toString().trim();
    const where = termo
        ? {
            [Op.or]: [
                { nome: { [Op.like]: `%${termo}%` } },
                { email: { [Op.like]: `%${termo}%` } }
            ]
        }
        : undefined;

    const contas = await Conta.findAll({
        raw: true,
        attributes: ['id', 'nome', 'email', 'createdAt'],
        where
    });

    res.render('livros/contas', { contas, termo });
});

router.get('/novo', (req, res) => {
    res.render('livros/configConta');
});

router.post('/novo', async (req, res) => {
    const nome = (req.body.nome || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const senha = req.body.senha || '';

    if (!nome || !email || !senha) {
        return res.status(400).render('livros/configConta', {
            erro: 'Preencha nome, e-mail e senha para cadastrar a conta.',
            conta: { nome, email }
        });
    }

    if (senha.length < 6) {
        return res.status(400).render('livros/configConta', {
            erro: 'A senha deve ter pelo menos 6 caracteres.',
            conta: { nome, email }
        });
    }

    try {
        const existente = await Conta.findOne({ where: { email } });
        if (existente) {
            return res.status(400).render('livros/configConta', {
                erro: 'Este e-mail já está cadastrado.',
                conta: { nome, email }
            });
        }

        await Conta.create({ nome, email, senha: await hashSenha(senha) });
        res.redirect('/contas');
    } catch (erro) {
        console.error('Erro ao cadastrar conta:', erro);
        res.status(500).render('livros/configConta', {
            erro: 'Não foi possível cadastrar a conta. Verifique os dados informados.',
            conta: { nome, email }
        });
    }
});

router.get('/editar/:id', async (req, res) => {
    const conta = await Conta.findByPk(req.params.id, {
        raw: true,
        attributes: ['id', 'nome', 'email']
    });

    if (!conta) {
        return res.status(404).send('Conta não encontrada.');
    }

    res.render('livros/configConta', { conta, editando: true });
});

router.post('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const nome = (req.body.nome || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const senha = req.body.senha || '';
    const conta = { id, nome, email };

    if (!nome || !email || (senha && senha.length < 6)) {
        return res.status(400).render('livros/configConta', {
            erro: !nome || !email
                ? 'Preencha nome e e-mail para editar a conta.'
                : 'A nova senha deve ter pelo menos 6 caracteres.',
            conta,
            editando: true
        });
    }

    try {
        const existente = await Conta.findOne({
            where: { email, id: { [Op.ne]: id } }
        });
        if (existente) {
            return res.status(400).render('livros/configConta', {
                erro: 'Este e-mail já está cadastrado para outra conta.',
                conta,
                editando: true
            });
        }

        const dados = { nome, email };
        if (senha) {
            dados.senha = await hashSenha(senha);
        }

        const [atualizadas] = await Conta.update(dados, { where: { id } });
        if (!atualizadas) {
            return res.status(404).send('Conta não encontrada.');
        }
        res.redirect('/contas');
    } catch (erro) {
        console.error('Erro ao editar conta:', erro);
        res.status(500).render('livros/configConta', {
            erro: 'Não foi possível editar a conta. Verifique os dados informados.',
            conta,
            editando: true
        });
    }
});

router.post('/delete', async (req, res) => {
    try {
        await Conta.destroy({ where: { id: req.body.id } });
        res.redirect('/contas');
    } catch (erro) {
        console.error('Erro ao excluir conta:', erro);
        res.status(500).send('Não foi possível excluir a conta.');
    }
});

module.exports = router;
