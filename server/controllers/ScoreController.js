const { Score, Sequelize } = require('../models')

module.exports = {
  // 创建曲谱
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
        res.status(200).send({
          score
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
  async getAll(req, res) {
    const Op = Sequelize.Op
    const operators = {}
    let orderBy = 'updatedAt'
    if (req.query.genre) {
      const filter = {
        where: {
          genre: {
            [Op.like]: `%${req.query.genre}%`
          }
        }
      }
      Object.assign(operators, filter)
    }
    if (req.query.orderby === 'rating') {
      orderBy = 'rating'
    }
    Object.assign(operators, {
      order: [
        [orderBy, 'DESC']
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
  }
}