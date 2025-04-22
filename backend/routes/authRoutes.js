const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// ROTA DE REGISTRO
router.post("/register", authController.register); // Certifique-se de que `register` é um array de middlewares

// ROTA DE LOGIN
router.post("/login", authController.login);

module.exports = router;