const path = require('path')

module.exports = {
  db: {
    database: process.env.DATABASE || 'score',
    username: 'root',
    password: '923533706',
    options: {
      host: 'localhost',
      dialect: 'sqlite',
      storage: path.resolve(__dirname, '../db/score.sqlite'),
      define: {
        underscored: true,
        paranoid: true
      }
    }
  },
  token: {
    secretOrPrivateKey: 'score',
    options: {
      expiresIn: '24h'
    }
  }
}