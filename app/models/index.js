const dbConfig = require("../config/db.config.js");
const pg = require("pg")

const Sequelize = require("sequelize");
const sequelize = new Sequelize("postgres://postgres.wxszcnyyufjfdbplgqqw:sidequests123!@aws-0-eu-central-1.pooler.supabase.com:5432/postgres", {
  dialectModule: pg,  
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.locations = require("./location.model.js")(sequelize, Sequelize);

// Define associations
db.users.hasMany(db.locations);
db.locations.belongsTo(db.users);

module.exports = db;