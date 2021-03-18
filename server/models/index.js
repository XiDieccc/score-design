const path = require('path')
const fs = require('fs')
const config = require('../config')
const Sequelize = require('sequelize')
const db = {}

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  config.db.options
)

// const User = sequelize.import('./User.js')
// const User = require('./User.js')(sequelize, Sequelize.DataTypes)
// 将该路径下的所有模型导入
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

db.Sequelize = Sequelize
db.sequelize = sequelize
  // db.User = User

module.exports = db