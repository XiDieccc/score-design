const handle = require('./handle')

/**
 * 计算与当前曲谱的距离，获得最邻近的曲谱
 * @param {*} scoreUserRatingMatrix score-user评分矩阵 是user-score的倒排矩阵
 * @returns 返回二维数组,每两个不同曲谱的相似度
 */
const similarScore = (scoreUserRatingMatrix) => {
  const scoresMax = scoreUserRatingMatrix.length // 最大曲谱数

  // 构建 曲谱-曲谱相似度矩阵 R(n,n) n为scoresMax
  const similarity = new Array(scoresMax).fill(0)
  for (let i = 0; i < scoresMax; i++) {
    similarity[i] = new Array(scoresMax).fill(0)
  }

  for (let i = 0; i < scoresMax; i++) {
    for (let j = 0; j < scoresMax; j++) {
      // 曲谱i与曲谱j的皮尔逊系数
      similarity[i][j] = handle.pearson(scoreUserRatingMatrix[i], scoreUserRatingMatrix[j])
    }

  }
  return similarity
}

/**
 * 
 * @param {*} currentUser 当前用户的所有曲谱评分一维数组
 * @param {*} scoreUserRatingMatrix score-user评分矩阵 是user-score的倒排矩阵
 * @returns 返回推荐的曲谱id和推荐指数对象数组
 */
const recommendItem = (currentUser, scoreUserRatingMatrix) => {

  // 计算得到曲谱相似度数组
  let similarity = similarScore(scoreUserRatingMatrix)

  // 计算该用户的所有曲谱推荐指数集合

  let recommendStar = currentUser.slice()
  for (let j = 0; j < recommendStar.length; j++) {
    // 若评分不为0，即用户已经评分，则不计算推荐指数; 对用户没评分过的曲谱计算推荐指数
    if (recommendStar[j] === 0) {
      for (let i = 0; i < recommendStar.length; i++) {
        // j为待计算推荐指数的曲谱
        // i为与j相似的曲谱，相似度为：similarity[j][i]
        // 用户对曲谱i的评分为 recommendStar[i]
        recommendStar[j] += similarity[j][i] * recommendStar[i]
      }
    }
  }
  // 对推荐指数集合做处理，将之前已经评分过的曲谱过滤掉
  for (let i = 0; i < recommendStar.length; i++) {
    if (currentUser[i] !== 0) {
      recommendStar[i] = -999
    }
  }

  // 根据曲谱推荐指数数组 来求得 最终推荐的 曲谱
  // 这里推荐 12 个曲谱
  const recommendNum = 12
  let recommendFinal = handle.sortArray(recommendStar, recommendNum)
  return recommendFinal
}

module.exports = {
  recommendItem
}