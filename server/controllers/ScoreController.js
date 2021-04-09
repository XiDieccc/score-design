const { Score, Sequelize, sequelize } = require('../models')
const { crawler } = require('../crawler')

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

  // 爬虫页数接收接口
  async crawlerBegin(req, res) {
    try {
      const pageNumber = Number(req.body.pageNumber)
      let maxId = await Score.max('id')
      let maxPage = Math.ceil((maxId / 12) + 1)
      if (maxPage + pageNumber > 500) {
        res.status(501).send({
          code: 501,
          error: '请求页数超过网站页数'
        })
      } else {
        let start = new Date().getTime()
        let scoreArr = await crawler(maxPage, pageNumber)
        let end = new Date().getTime()
        let time = Number(end - start)
        await res.status(201).send({
          code: 200,
          message: `所有曲谱数量：${maxId}；爬虫开始页数为：${maxPage}；爬取页面数量：${pageNumber}; 爬虫总时间时间为：${time}`,
          time,
          maxId,
          pageNumber,
          scoreArr: scoreArr
        })
      }
    } catch (error) {
      res.status(400).send({
        code: 400,
        error: '爬虫失败'
      })
    }
  }

}