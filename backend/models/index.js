const { User } = require("./User");
const { Evento } = require("./Evento");

// Define a associação entre User e Evento
Evento.belongsTo(User, { foreignKey: "created_by" });
User.hasMany(Evento, { foreignKey: "created_by" });

module.exports = {
    User,
    Evento,
};