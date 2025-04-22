// IMPORTA O EXPRESS PARA USAR O OBJETO ROUTER
const express = require("express");

// IMPORTA O CONTROLADOR QUE TERÁ A LÓGICA DAS OPERAÇÕES (VAMOS CRIAR JÁ JÁ)
const eventosController = require("../controllers/eventosController");

// IMPORTA O MIDDLEWARE MULTER PARA TRATAR O UPLOAD DE IMAGENS
const multer = require("multer");

// CONFIGURA O ARMAZENAMENTO DAS IMAGENS USANDO MULTER
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // DIRETÓRIO ONDE AS IMAGENS SERÃO SALVAS
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName); // NOME DA IMAGEM SERÁ COMPOSTO POR TIMESTAMP + NOME ORIGINAL
  },
});

// CRIA O UPLOADER USANDO A CONFIGURAÇÃO DEFINIDA
const upload = multer({ storage: storage });

// CRIA O OBJETO DE ROTAS
const router = express.Router();

// ROTA: LISTAR TODOS OS EVENTOS
router.get("/", eventosController.listarEventos);

// ROTA: CRIAR NOVO EVENTO COM UPLOAD DE IMAGEM
router.post("/", upload.single("imagem"), eventosController.criarEvento);

// ROTA: ATUALIZAR UM EVENTO PELO ID (OPCIONALMENTE COM NOVA IMAGEM)
router.put("/:id", upload.single("imagem"), eventosController.atualizarEvento);

// ROTA: EXCLUIR UM EVENTO PELO ID
router.delete("/:id", eventosController.deletarEvento);

const { body } = require("express-validator");

// Validações para criação e atualização de eventos
const validarEvento = [
  body("title").notEmpty().withMessage("O título é obrigatório."),
  body("description").notEmpty().withMessage("A descrição é obrigatória."),
  body("date").isISO8601().withMessage("A data deve estar no formato ISO 8601."),
  body("location").notEmpty().withMessage("A localização é obrigatória."),
  body("created_by").isInt().withMessage("O ID do criador deve ser um número inteiro."),
];

// ROTA: CRIAR NOVO EVENTO COM UPLOAD DE IMAGEM
router.post("/", upload.single("imagem"), validarEvento, eventosController.criarEvento);

// ROTA: ATUALIZAR UM EVENTO PELO ID (OPCIONALMENTE COM NOVA IMAGEM)
router.put("/:id", upload.single("imagem"), validarEvento, eventosController.atualizarEvento);

// EXPORTA AS ROTAS PARA SEREM USADAS NO APP PRINCIPAL
module.exports = router;