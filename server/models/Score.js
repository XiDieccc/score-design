const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}

  Model.init({
    // 曲谱名称
    name: {
      type: DataTypes.STRING
    },
    // 曲谱调号
    keys: {
      type: DataTypes.STRING
    },
    // 演唱歌手
    singer: {
      type: DataTypes.STRING
    },
    // 海报
    poster: {
      type: DataTypes.STRING
    },
    // 简介
    description: {
      type: DataTypes.TEXT
    },
    // 标签 用; 分割 分号＋空格
    tags: {
      type: DataTypes.TEXT
    },
    // 评分
    rating: {
      type: DataTypes.STRING
    },
    // 浏览量
    views: {
      type: DataTypes.STRING
    },
    // 谱子图片 url地址 用; 分割 分号＋空格
    spectrum: {
      type: DataTypes.TEXT
    }

  }, {
    sequelize,
    modelName: 'Score'
  })
  return Model
}