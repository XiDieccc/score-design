# 项目开发记录



### 一、起步

#### 1 项目介绍

**爬取**一些弹唱吉他谱，将资源进行分类和展示，并实现基于 `关键词搜索` 或 `上下文搜索` 的**智能搜索引擎**，进一步可以实现基于 `协同过滤算法` 的**智能推荐系统**，项目整体采取**B/S架构**，浏览器前端负责吉他谱展示，后端负责吉他谱资源的爬取和 搜索与推荐系统的实现。



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

#### 1 注册登录界面

- 前端注册界面，`views/user/register.vue`和`/login.vue`

  ```javascript
  @click.prevent="register"//这里是在按钮
  @submit.native.prevent=""//根据标准在整个表单标签
  ```

- 配置前端路由，以及前端网络请求处理

- `main.js`引入 normalize.css 



#### 2 使用Vuex完善注册登陆页面

- `vue add vuex ` / `npm i -S vuex`

- vuex.store有 state,mutations,actions三个属性 

- 在登陆或注册成功后，向全局store里添加信息

  ```javascript
  this.$store.dispatch('setToken', response.data.token)
  this.$store.dispatch('setUser', response.data.user)
  ```

- 使用了`vuex-persistedstate`，让vuex数据存储到 `localStorage`，使页面刷新但用户数据不丢失



#### 3 axios拦截器

两种方式让登陆注册点击前实现 loading 效果

- nprogress					进度条效果
- elementUI loading     转圈效果

在 axios request请求前添加判定，headers 里的 **showloading** 是否为true，若是则 `NProgress.start()`启动进度条效果以及按钮不可点击效果，然后删除请求头的showloading属性

在response 响应后 `NProgress.done()`，关闭动画





### 六、信息展示页面

#### 1 全局组件自动加载注册

- 在很多页面上要用到盒子组件，所以全局注册加载盒子组件：

  ```javascript
  const requireContext = require.context(
    './global',
    true,
    /\.vue$/
  )
  
  // 全局组件注册
  requireContext.keys().forEach(fileName => {
    const componentConfig = requireContext(fileName)
    Vue.component(
      componentConfig.default.name || componentConfig.name,
      componentConfig.default || componentConfig
    )
  })
  ```

- 以上是递归注册 `/components/global`文件下的所有组件



#### 2 信息编辑和查看界面



#### 3 信息列表界面



#### 4 详情页面

​	实现了自动滚屏效果



### 七、前端曲谱信息的增删查改

#### 1 使用 路由导航首位实现前端访问控制



#### 2 曲谱信息后端接口设计

- ​	`Score`模型
- ​	`ScoreController.js` 增删查改
- ​	`router.js` 后端接口
- ​	Postman接口测试



#### 3 曲谱信息的新增和编辑

- 完善了前端接口的曲谱信息增删改查请求 `scoreService.js`

- 完成了 新增页面以及编辑页面 的逻辑，新增页面像数据库添加曲谱，编辑界面先根据 query.id 信息查询曲谱信息，最后提交更新PUT请求

  

#### 4 列表页面逻辑

- 像后端请求，查询所有信息



#### 5 详情页面

- 根据id向后端数据库查询到对应曲谱信息，将部分数据转化格式，同时 只要点击详情页就会发出请求使得浏览量+1

【遇到问题】：

前端更新曲谱浏览量发出put请求，需要验证token，这就使用户没有登陆时不能查看曲谱详情，所以改变策略，在后端 `getById`接口查看曲谱时候，直接在后端向数据库更新浏览量。



#### 6 搜索页面逻辑



### 八、爬虫

#### 1 吉他谱网站逻辑



- 首先爬取列表页的url 
- 进入详情页，爬取 **title** 根据标题得到 **name singer keys**
- 根据 `$('#tabzone') ` 里面有无文字来判断是否用简介得到 **description** , 若没有则爬取豆瓣的简介
- 将所有`$('#tabzone')`里面的所有 img 元素 作为 **spectrum**曲谱，把第一张作为 **poster ** 海报地址，再爬取豆瓣页的海报，若有则替换
- 豆瓣页稳定爬取 **rating views tags**



#### 2 写入数据库

​	

#### 3 爬虫可视化分析

- 首先添加前后端接口，用来传输一些数据，比如 爬取页面页数，以及爬虫时间等
- 根据这些信息来利用图表展示



### 九、推荐系统



ALS 推荐： uer-item-rating 评分

LR排序: user-item-views 浏览次数





<img src="E:\毕设\论文\论文图片\推荐系统架构.png" style="zoom:60%;" />

#### 0 协同过滤算法原理：

##### 基于用户的协同过滤算法

实际就是 通过分析用户行为数据，对原始 user-item稀疏矩阵进行 填充

- 计算用户之间的相似度：用过用户向量，计算 **余弦相似度**

$$
cosine\_sim(u,v) = {r_u . r_v \over |r_u||r_v|}
$$

- 得到 用户-用户 **余弦相似度矩阵** 

- 推荐物品时：

  - 选取与目标用户最相似的前K个用户

  - 选取目标用户没有进行过评分的物品n

  - 将K个相似用户对n个物品的评分进行加权，认为该评分为目标用户对n个物品的预测评分
    $$
    \overline{r_{ui}} = {{\sum sim(u,v)\cdot r_{vi}}\over{\sum sim(u,v)}}
    $$
  
- 对n个物品预测评分进行倒排，优先推荐





##### 基于物品的协同过滤算法

计算物品与物品的相似度



##### 基于模型的协同过滤算法：

- SVD矩阵分解
- LFM隐含语义
- ALS交替最小二乘法

###### ALS原理

- 构建 user-item 评分矩阵

- 将 user-item矩阵分解为 两个 矩阵

  - User-Embedding_K 矩阵
  - Embedding_K-Item 矩阵

  两个矩阵相乘（点积） 得到 User-Item矩阵， Embedding_K 为自定义系数

- 将User-Item稀疏矩阵中蓝色的值作为训练集，User-Embedding_K，Embedding_K-Item矩阵为稠密矩阵

- 稠密矩阵中所有的值都在机器学习任务中当作参数，需要通过机器学习训练得出

- **损失函数** 由User-Embedding_K，Embedding_K-Item矩阵的 点积 和训练集的值求 **RMSE** (均方根误差 Root Mean Squared Error)得出

- **优化方法** 使用 ALS交替最小二乘法进行 损失函数优化

- 最终得到User-Embedding_K，Embedding_K-Item矩阵，就可求得稠密的User-Item矩阵

  





#### 1 新建模型： 

- 用户收藏曲谱 User_Score_Collection： user_id,  score_id

- 曲谱标签模型 Tags：name（所有标签都会载入）

- 用户评分 User_Score_Ratings：user_id,  score_id,  ratings

- 用户选择标签 User_Tags：user_id,  tags ,  ratings（这个根据用户评分来添加tags）// score: real 字段还没搞清楚




#### 2 冷启动

- 全局热播召回（浏览量/评分） +  用户分群召回（在数据库中将用户分群，选取每个群体中的热门歌曲 / **可否直接爬取流派，根据流派将曲谱分类，然后推荐每类中 浏览量**）
- 随机选取



#### 3 推荐：

- 用户分群召回(在数据库中将用户分群) + ALS 召回（**基于ALS的模型推荐**）



#### 3 基于用户推荐

流程：

<img src="E:\毕设\论文\论文图片\基于用户的系统过滤推荐.png" style="zoom:80%;" />

#### 4 基于物品推荐



#### 5 排序阶段

##### LR逻辑回归算法

​	常用于二分类问题：非0即1 垃圾邮件分类等



### PS、遇到的问题

- sequelize版本过高，不支持import导入操作，换成低版本
- 项目无法加载 scss文件，发现 sass-loader版本过高，换成低版本，成功加载

<img src="E:\毕设\毕设进度截图\error1.png" style="zoom: 67%;" />

- 前端项目启动报错： ValidationError: webpack Dev Server Invalid Options

  options should NOT have additional properties

  注意是 `vue.config.js `文件

- eslint 报错，应该是版本问题，没有解决，重新创建项目，这次使用git推送 保存分支。

- 当在当前页但是又 router.push() 到该页面，就会产生NavigationDuplicated错误

  原因和解决方法：https://blog.csdn.net/qq_34295211/article/details/102371714

- 导航页进行高分和热门排序时，是直接使用的字段字符串排序，无法将数据准确排序，更改：

  ```javascript
  Object.assign(operators, {
        order: [
          // [orderBy, 'DESC']
          // 此处将 String字段转化为Float字段进行排序
          [sequelize.cast(sequelize.col(orderBy), 'FLOAT'), 'DESC']
        ]
  })
  ```

- 如果 后端Promise没有resolve，就会一直停留在回调中，导致前端点击发出请求得不到后端的处理

- 



#### 爬虫问题：

- 豆瓣网站的海报很多时候都访问不到，有防盗链处理，所以将海报改为以前的海报，即为从吉他吧网站爬取来的海报
- 关于速度问题，因为我是同步操作，根据链接爬取信息，然后写入数据库，一个一个操作。这样其实很影响存入文档的速度，而且如果后续有相关的“查重”处理，还需要像数据库查询，所以应该将爬虫操作和写入数据库操作分开。爬虫操作要同步进行，但写入操作可以异步进行，可以将同步操作的结果存入数组，再根据数组分别写入文件或存入数据库。（目前还没有实现）





TODO：

1. 列表页添加评分与接口
2. 用户推荐页