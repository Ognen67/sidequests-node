require("dotenv").config()

module.exports = {
  HOST: "aws-0-eu-central-1.pooler.supabase.com",
  USER: "postgres.wxszcnyyufjfdbplgqqw",
  PASSWORD: "sidequests123!",
  DB: "postgres",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
