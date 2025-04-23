require("./utils/db");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

// Verifica se a pasta /uploads existe
const fs = require("fs");
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}

// Rotas
const authRoutes = require("./routes/authRoutes");
const eventosRoutes = require("./routes/eventosRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

app.use("/auth", authRoutes);
app.use("/eventos", authMiddleware, eventosRoutes);

app.get("/", (req, res) => {
    res.send("API DO INSTITUTO CRIATIVO FUNCIONANDO ✅");
});

module.exports = app;