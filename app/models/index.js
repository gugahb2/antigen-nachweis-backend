// const config = require("../config/db.local.config.js");
const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        },
        logging: false,
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admin = require("./admin.model")(sequelize, Sequelize);
db.application = require("./application.model")(sequelize, Sequelize);
db.testCenter = require("./testCenter.model")(sequelize, Sequelize);
db.dateSlot = require("./dateSlot.model")(sequelize, Sequelize);
db.timeSlot = require("./timeSlot.model")(sequelize, Sequelize);
db.confirmation = require("./confirmation.model")(sequelize, Sequelize);

db.testCenter.hasMany(db.admin);
db.admin.belongsTo(db.testCenter);

db.testCenter.hasMany(db.application);
db.application.belongsTo(db.testCenter);

db.testCenter.hasMany(db.confirmation);
db.confirmation.belongsTo(db.testCenter);

db.testCenter.hasMany(db.dateSlot);
db.dateSlot.belongsTo(db.testCenter);
db.dateSlot.hasMany(db.timeSlot);
db.timeSlot.belongsTo(db.dateSlot);



// db.application.hasOne(db.timeSlot, {sourceKey: 'timeSlotId', foreignKey: 'id'});

module.exports = db;
