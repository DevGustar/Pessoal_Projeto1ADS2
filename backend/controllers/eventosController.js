// IMPORTA O MODELO DE EVENTO (VAMOS CRIAR ISSO EM 'models/Evento.js')
const { Evento } = require("../models");

// IMPORTA O MÓDULO 'fs' PARA MANIPULAR ARQUIVOS (EX: EXCLUIR IMAGEM ANTIGA)
const fs = require("fs");
const path = require("path");

// LISTA TODOS OS EVENTOS CADASTRADOS NO BANCO
exports.listarEventos = async (req, res) => {
    try {
        const eventos = await Evento.findAll(); // BUSCA TODOS OS EVENTOS
        res.json(eventos); // RETORNA COMO JSON
    } catch (err) {
        console.error("Erro ao listar eventos:", err);
        res.status(500).json({ message: "Erro ao buscar eventos." });
    }
};

// CRIA UM NOVO EVENTO COM OU SEM IMAGEM
exports.criarEvento = async (req, res) => {
    try {
        const { title, description, date, location, created_by } = req.body; // CAMPOS VINDOS DO FORMULÁRIO

        // PEGA O CAMINHO DA IMAGEM SE EXISTIR
        const image_url = req.file ? req.file.filename : null;

        // CRIA O EVENTO NO BANCO
        const novoEvento = await Evento.create({
            title,
            description,
            date,
            location,
            image_url,
            created_by,
        });

        res.status(201).json(novoEvento); // RETORNA O EVENTO CRIADO
    } catch (err) {
        console.error("Erro ao criar evento:", err);
        res.status(500).json({ message: "Erro ao criar evento." });
    }
};

// ATUALIZA UM EVENTO EXISTENTE
exports.atualizarEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, location, created_by } = req.body;

        const evento = await Evento.findByPk(id); // BUSCA O EVENTO PELO ID

        if (!evento) {
            return res.status(404).json({ message: "Evento não encontrado." });
        }

        // REMOVE IMAGEM ANTIGA SE UMA NOVA FOI ENVIADA
        if (req.file && evento.image_url) {
            const caminhoAntigo = path.join(__dirname, "../uploads", evento.image_url);
            fs.unlink(caminhoAntigo, (err) => {
                if (err && err.code !== "ENOENT") { // Ignora erro se o arquivo não existir
                    console.error("Erro ao excluir imagem antiga:", err);
                }
            });
        }

        // ATUALIZA OS CAMPOS
        await evento.update({
            title,
            description,
            date,
            location,
            image_url: req.file ? req.file.filename : evento.image_url,
            created_by,
        });

        res.json(evento);
    } catch (err) {
        console.error("Erro ao atualizar evento:", err);
        res.status(500).json({ message: "Erro ao atualizar evento." });
    }
};

// EXCLUI UM EVENTO PELO ID
exports.deletarEvento = async (req, res) => {
    try {
        const { id } = req.params;

        const evento = await Evento.findByPk(id); // BUSCA EVENTO

        if (!evento) {
            return res.status(404).json({ message: "Evento não encontrado." });
        }

        // REMOVE A IMAGEM DO DISCO SE EXISTIR
        if (evento.image_url) {
            const caminhoImagem = path.join(__dirname, "../uploads", evento.image_url);
            fs.unlink(caminhoImagem, (err) => {
                if (err) console.warn("Erro ao excluir imagem:", err);
            });
        }

        // EXCLUI O REGISTRO DO BANCO
        await evento.destroy();

        res.json({ message: "Evento excluído com sucesso." });
    } catch (err) {
        console.error("Erro ao excluir evento:", err);
        res.status(500).json({ message: "Erro ao excluir evento." });
    }
};