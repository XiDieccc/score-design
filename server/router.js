const UserController = require('./controllers/UserController')
  // const MovieController = require('./controllers/MovieController')
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


  // app.post('/movies',
  //   AuthenticatePolicy.isValidToken,
  //   MovieController.create
  // )
  // app.put('/movies/:id',
  //   AuthenticatePolicy.isValidToken,
  //   MovieController.update
  // )
  // app.get('/movies/:id', MovieController.getByid)
  // app.get('/movies', MovieController.getAll)
}