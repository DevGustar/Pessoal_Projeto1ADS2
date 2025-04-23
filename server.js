require("dotenv").config(); // para carregar as variáveis

const app = require("./backend/app");
const { sequelize } = require("./backend/utils/db");
const { User, Evento } = require("./backend/models");

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log("✅ Banco sincronizado.");
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Erro ao sincronizar o banco:", err);
});
