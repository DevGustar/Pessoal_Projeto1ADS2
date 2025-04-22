// PONTO DE ENTRADA PRINCIPAL
const app = require("./backend/app");

// PORTA DEFINIDA NO .env OU PADRÃO 3000
const PORT = process.env.PORT || 3000;

// INICIA O SERVIDOR
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});