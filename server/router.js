const UserController = require('./controllers/UserController')
const ScoreController = require('./controllers/ScoreController')
const AuthenticatePolicy = require('./policies/AuthenticatePolicy')

module.exports = (app) => {
  // 用户注册
  app.post('/users', UserController.register)

  // 用户登录
  app.post('/users/login', UserController.login)

  // 用户查询
  app.get('/users/:id',
    // AuthenticatePolicy.isValidToken,
    UserController.getUserById
  )

  // 用户更改信息
  app.put('/users/:id', UserController.update)

  // 删除用户
  app.delete('/users/:id', UserController.delete)

  // 新增曲谱
  app.post('/scores',
    AuthenticatePolicy.isValidToken,
    ScoreController.create
  )

  // 修改曲谱
  app.put('/scores/:id',
    AuthenticatePolicy.isValidToken,
    ScoreController.update
  )

  // 查看曲谱
  app.get('/scores/:id', ScoreController.getByid)
  app.get('/scores', ScoreController.getAll)

  // 删除曲谱
  app.delete('/scores/:id', ScoreController.delete)
}