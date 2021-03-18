### 一、起步

#### 1 项目介绍

​	**爬取**一些弹唱吉他谱，将资源进行分类和展示，并实现基于 `关键词搜索` 或 `上下文搜索` 的**智能搜索引擎**，进一步可以实现基于 `协同过滤算法` 的**智能推荐系统**，项目整体采取**B/S架构**，浏览器前端负责吉他谱展示，后端负责吉他谱资源的爬取和 搜索与推荐系统的实现。



#### 2 工具与环境

##### 	前端：

​		Vue + ElementUI + Echarts + axios

##### 	后端：

​		nodejs + express + sequelize

##### 	数据库：

​		sqlite3



#### 3 智能搜索与推荐系统

##### 	智能搜索：

- 吉他谱关键词搜索，比如名称，歌手等

- 基于吉他谱简介的上下文内容搜索，根据词向量余弦匹配推荐系统

  

  ##### 推荐系统:

- **协同过滤算法**



### 二、 项目整体框架搭建

#### 1 前端

​	基于前端项目web

- 添加路由`vue add router`

- 添加element插件`vue add element`

- 配置前端实现跨域请求：

  新建`vue.config.js`文件

  ```javascript
  module.exports={
    devServer:{
      proxy:"http://localhost:3000/"
    }
  };
  ```

- 前端配置如图

  <img src="E:\毕设\毕设进度截图\2.1.png" style="zoom: 67%;" />

  

#### 2 服务端

​	server

- 配置服务端入口文件`server.js`，用express建立后台服务器，配置地址接口，以及用sequelize连接sqlite数据库

- 配置数据库：

  连接数据库，加入配置

  创建数据模型User和Score，并导出与创建本地数据库

- 服务端配置如图：

  <img src="E:\毕设\毕设进度截图\2.2.png" style="zoom:67%;" />



### 三、后端数据接口服务

#### 1 后端数据model层的CURD

- 对应用户的增删改查，对应的操作都封装在控制层`/controllers/UserController.js`：

  ```javascript
  async register(req, res){}
  async getUserById(req, res){}
  async updateUser(req, res){}
  async deleteUser(req, res){}
  ```

- 路由层负责协议接口 `/router.js`：

  ```javascript
   app.get('/users/:id', UserController.getUserById)
   app.post('/users', UserController.register)
   app.put('/users/:id', UserController.updateUser)
   app.delete('/users/:id',UserController.deleteUser)
  ```

- 在入口处调用 `/server.js`

  ```javascript
  require('./router')(app)
  ```

  

#### 2 密码加密存储

- ​	在用户模型处 `/models/User.js`，添加钩子用MD5给密码加密，并且创建密码校验函数

  - 钩子函数：

  ```javascript
  function hashPassword(user, options) {
    if (user.changed('password')) {
      user.password = MD5(user.password).toString()
    }
  }
  hooks: {
        afterValidate: hashPassword
  },
  ```

  - 密码校验函数：

  ```javascript
    class Model extends Sequelize.Model {
      comparePassword(password) {
        return this.password === MD5(password).toString()
      }
    }
  ```

- 控制层 `/controllers/UserController.js` 创建用户登录操作

  ```javascript
  async login(req, res){...}
  ```

- 路由层添加接口 `/router.js`

  ```javascript
  // 登录
  app.post('/users/login', UserController.login)
  ```

  

#### 3 基于JWT的用户认证

​	HTTP 是无状态的，可用 `cookie/session` 认证方式保存浏览器和服务端的会话信息

​	cookie 与 token 详情：https://www.cnblogs.com/moyand/p/9047978.html

​	本项目使用 **JWT`jsonwebtoken`**

- 配置文件 `/config/index.js` 中加入 token字段的配置，其中私钥设置为 `score`

  ```javascript
  token: {
      secretOrPrivateKey: 'score',
      options: {
        expiresIn: '24h'
      }
    }
  ```

- 在操作表结构时 `controllers/UserController.js` 为注册与查询功能添加 token 字段，将客户端发送的请求头的用户信息和服务端私钥进行签名，并将签名返回给客户端

  ```javascript
  function tokenSign({ id, email }) {
    try {
      return Jwt.sign({ id, email }, config.token.secretOrPrivateKey, config.token.options)
    } catch (error) {
      return null
    }
  }
  
  res.status(201).send({
          user,
          token: tokenSign(user)
  })
  ```

- 单独抽出一个认证层 中间件 `policies/AutenticatePolicy`

  实现对 **请求头token的抽取与验证** 

  ```javascript
  const token = req.headers.authorization.split(' ').pop()
  Jwt.verify(token, config.token.secretOrPrivateKey)
  ```

- 在路由 `router.js` 对 查询用户功能添加 token验证的中间件

  ```javascript
  // 查询
  app.get('/users/:id', AutenticatePolicy.isValidToken, UserController.getUserById)
  ```



### 四、 Mock服务

- 利用 postman工具来搭建 mock 服务，后端可以提前确定好数据格式以及接口，提供给前端，就不需要等待后端搭建好所有接口后前端才能访问到数据。

  本次项目后端接口地址：https://4bf54f56-3941-4f98-9fbe-f38612d31042.mock.pstmn.io

- 注意在前端vue项目中配置好开发时的axios请求接口地址： `vue.config.js` 以及 `.env.decelopment`文件

- 配置服务层，及 axios 的配置 和 UserServices 的创建

​	

### 五、用户界面

#### 1 注册界面



#### 2 登陆页面



#### 3 使用Vuex完善注册登陆页面



#### 4 axios拦截器







### PS、遇到的问题

- sequelize版本过高，不支持import导入操作，换成低版本
- 项目无法加载 scss文件，发现 sass-loader版本过高，换成低版本，成功加载

<img src="E:\毕设\毕设进度截图\error1.png" style="zoom: 67%;" />

- 前端项目启动报错： ValidationError: webpack Dev Server Invalid Options

  options should NOT have additional properties

  注意是 `vue.config.js `文件

- eslint 报错，应该是版本问题，没有解决，重新创建项目，这次使用git推送 保存分支。

