const { Score, User, Sequelize } = require('../models')
const config = require('../config')
const Jwt = require('jsonwebtoken')
const { recommendIndex } = require('../recommend/index')

function tokenSign({ id, email }) {
  try {
    return Jwt.sign({ id, email }, config.token.secretOrPrivateKey, config.token.options)
  } catch (error) {
    throw (error)
  }
}

module.exports = {

  // 创建用户，注册
  async register(req, res) {
    try {
      const user = await User.create(req.body)
      res.status(201).send({
        code: 200,
        user: {
          email: user.email,
          id: user.id
        },
        token: tokenSign(user)
      })
    } catch (error) {
      let err = []
      if (error.errors) {
        error.errors.forEach(validateError => {
          err.push(validateError.message)
        })
      }
      res.status(400).send({
        code: 400,
        error: err.join('<br/>')
      })
    }
  },

  // 用户登录
  async login(req, res) {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email
        }
      })
      let isValidPassword = user.comparePassword(req.body.password)
      if (isValidPassword) {
        res.send({
          code: 200,
          user,
          token: tokenSign(user)
        })
      } else {
        res.status(403).send({
          code: 403,
          error: '用户名或密码错误'
        })
      }
    } catch (error) {
      res.status(403).send({
        code: 403,
        error: '用户名或密码错误'
      })
    }
  },

  // 用户查询
  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id)
      if (user) {
        res.status(200).send({
          user
        })
      } else {
        res.status(400).send({
          code: 400,
          error: '没有找到对应数据'
        })
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败'
      })
    }
  },

  // 用户更新信息
  async update(req, res) {
    try {
      await User.update(
        req.body, {
          where: {
            id: req.params.id
          }
        }
      )
      res.status(200).send({
        message: '数据更新成功'
      })
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据更新失败'
      })
    }
  },

  // 删除用户
  async delete(req, res) {
    try {
      await User.destroy({
        where: {
          id: req.params.id
        }
      })
      res.status(200).send({
        message: '数据删除成功'
      })
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据删除失败'
      })
    }
  },

  // 用户评分
  async updateRating(req, res) {
    try {
      const user = await User.findByPk(req.params.userId)

      // 若有相同的曲谱评分会向后叠加，但不影响计算评分矩阵，因为后面的评分会覆盖
      await User.update({ ratings: `${user.ratings}${req.params.scoreId},${req.body.rating};` }, {
        where: {
          id: req.params.userId
        }
      })
      const newUser = await User.findByPk(req.params.userId)
      res.status(200).send({
        message: '评分数据更新成功',
        user: newUser
      })
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '评分数据更新失败'
      })
    }

  },

  // 返回用户推荐内容
  async recommend(req, res) {
    try {
      const user = await User.findByPk(req.params.userId)
      const recommendArr = await recommendIndex(user)

      let recommendScoreId = []
      for (let i = 0; i < recommendArr.length; i++) {
        recommendScoreId.push(recommendArr[i].id)
      }

      const Op = Sequelize.Op
      const recommendList = await Score.findAll({
        where: {
          id: {
            [Op.or]: recommendScoreId
          }
        }
      })

      res.status(200).send({
        message: '推荐数据返回成功',

        // 推荐曲谱
        scores: recommendList,

        // 推荐指数
        recommendStarArr: recommendArr
      })
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '推荐失败'
      })
    }

  }

}