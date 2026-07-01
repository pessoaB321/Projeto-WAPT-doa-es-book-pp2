const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const Administrador = require('../models/administrador.Model');

function getFotoValue(body) {
    if (typeof body?.foto === 'string') {
        const foto = body.foto.trim();
        return foto || null;
    }

    return null;
}

async function emailDisponivel(email, idAtual = null) {
    const where = { email };

    if (idAtual) {
        where.id = { [Op.ne]: idAtual };
    }

    const existente = await Administrador.findOne({ where });
    return !existente;
}

router.post('/novo', async (req, res) => {
    const nome = (req.body.nome || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const senha = (req.body.senha || '').trim();
    const cargo = req.body.cargo || 'Administrador';
    const status = req.body.status || 'Ativo';
    const foto = getFotoValue(req.body);

    if (!nome || !email || !senha) {
        return res.status(400).render('livros/configADM', {
            erro: 'Preencha nome, e-mail e senha para cadastrar o administrador.',
            editando: false
        });
    }

    try {
        const disponivel = await emailDisponivel(email);

        if (!disponivel) {
            return res.status(400).render('livros/configADM', {
                erro: 'Este e-mail já está cadastrado para outro administrador.',
                editando: false
            });
        }

        await Administrador.create({ nome, email, senha, cargo, status, foto });
        res.redirect('/admin');
    } catch (erro) {
        console.error('Erro ao cadastrar administrador:', erro);
        res.status(500).render('livros/configADM', {
            erro: 'Não foi possível cadastrar o administrador. Verifique os dados informados.',
            editando: false
        });
    }
});

router.get('/editar/:id', async (req, res) => {
    const { id } = req.params;

    const administrador = await Administrador.findByPk(id, { raw: true });

    if (!administrador) {
        return res.status(404).send('Administrador não encontrado.');
    }

    res.render('livros/configADM', {
        administrador,
        editando: true
    });
});

router.post('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const nome = (req.body.nome || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const senha = (req.body.senha || '').trim();
    const cargo = req.body.cargo || 'Administrador';
    const status = req.body.status || 'Ativo';
    const foto = getFotoValue(req.body);

    if (!nome || !email || !senha) {
        return res.status(400).render('livros/configADM', {
            erro: 'Preencha nome, e-mail e senha para editar o administrador.',
            editando: true,
            administrador: { id, nome, email, senha, cargo, status, foto }
        });
    }

    try {
        const disponivel = await emailDisponivel(email, id);

        if (!disponivel) {
            return res.status(400).render('livros/configADM', {
                erro: 'Este e-mail já está cadastrado para outro administrador.',
                editando: true,
                administrador: { id, nome, email, senha, cargo, status, foto }
            });
        }

        await Administrador.update(
            { nome, email, senha, cargo, status, foto },
            { where: { id } }
        );
        res.redirect('/admin');
    } catch (erro) {
        console.error('Erro ao editar administrador:', erro);
        res.status(500).render('livros/configADM', {
            erro: 'Não foi possível editar o administrador. Verifique os dados informados.',
            editando: true,
            administrador: { id, nome, email, senha, cargo, status, foto }
        });
    }
});

router.get('/', async (req, res) => {
    const termo = (req.query.busca || '').toString().trim();

    let administradores = [];

    if (termo) {
        administradores = await Administrador.findAll({
            raw: true,
            where: {
                [Op.or]: [
                    { nome: { [Op.like]: `%${termo}%` } },
                    { email: { [Op.like]: `%${termo}%` } }
                ]
            }
        });
    } else {
        administradores = await Administrador.findAll({ raw: true });
    }

    res.render('livros/adm', {
        administradores,
        termo
    });
});

router.post('/delete', async (req, res) => {
    const { id } = req.body;

    try {
        await Administrador.destroy({ where: { id } });
        res.redirect('/admin');
    } catch (erro) {
        console.error('Erro ao deletar administrador:', erro);
        res.status(500).send('Não foi possível deletar o administrador.');
    }
});

router.get('/novo', (req, res) => {
    res.render('livros/configADM');
});

module.exports = router;
