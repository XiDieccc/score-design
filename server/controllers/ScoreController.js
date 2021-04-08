const { Score, Sequelize, sequelize } = require('../models')

module.exports = {
  // 前端创建曲谱
  async create(req, res) {
    try {
      const score = await Score.create(req.body)
      res.status(201).send({
        code: 200,
        score: score.toJSON()
      })
    } catch (error) {
      let err = []
      if (error.errors) {
        error.errors.forEach(validateError => {
          err.push(validateError.message)
        })
      } else {
        err.push('数据保存失败，请稍后再试')
      }
      res.status(400).send({
        code: 400,
        error: err.join('<br/>')
      })
    }
  },
  // 更新曲谱
  async update(req, res) {
    try {
      await Score.update(
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

  // 查看曲谱
  async getByid(req, res) {
    try {
      const score = await Score.findByPk(req.params.id)
      if (score) {
        // 每次查看详情页前，将曲谱浏览量更新
        let currentViews = score.views.valueOf()
        currentViews++
        try {
          await Score.update({ views: currentViews.toString() }, {
            where: {
              id: score.id
            }
          })
          res.status(200).send({
            score
          })
        } catch (error) {
          res.status(500).send({
            code: 500,
            error: '浏览量更新失败'
          })
        }
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
  async getAll(req, res) {
    const Op = Sequelize.Op
    const operators = {}
    let orderBy = 'updatedAt'

    // 调号
    if (req.query.keys) {
      const filter = {
        where: {
          keys: {
            [Op.like]: `%${req.query.keys}%`
          }
        }
      }
      Object.assign(operators, filter)
    }
    // 评分
    if (req.query.orderby === 'rating') {
      orderBy = 'rating'
    }
    // 浏览量
    if (req.query.orderby === 'views') {
      orderBy = 'views'
    }
    // 降序 sequelize.cast(sequelize.col('code'), 'SIGNED'),
    Object.assign(operators, {
      order: [
        // [orderBy, 'DESC']
        // 此处将 String字段转化为Float字段进行排序
        [sequelize.cast(sequelize.col(orderBy), 'FLOAT'), 'DESC']
      ]
    })
    try {
      const scores = await Score.findAll(operators)
      res.send({
        code: 200,
        scores: scores
      })
    } catch (error) {
      res.status(400).send({
        code: 400,
        error: '没有找到对应数据'
      })
    }
  },

  // 删除曲谱
  async delete(req, res) {
    try {
      await Score.destroy({
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

  // 爬虫曲谱写入数据库
  writeToDB(score) {
    return new Promise(async(resolve) => {
      try {
        const result = await Score.create(score)
        resolve(result.toJSON())
      } catch (error) {
        console.log(`数据存储失败：${score.name}`)
      }
    })

  }

}