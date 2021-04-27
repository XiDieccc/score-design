const handle = require('./handle')

/**
 * 计算与当前用户的距离，获得最邻近的用户
 * @param {*} currentUser 当前用户的评分一维数组
 * @param {*} userScoreRatingMatrix user-score所有用户的评分矩阵
 * @returns 返回数组,与每个用户的相似度
 */
const similarUser = (currentUser, userScoreRatingMatrix) => {
  const usersMax = 2095 //最大用户数
  const similarity = new Array(usersMax).fill(0)
  for (let i = 0; i < userScoreRatingMatrix.length; i++) {
    similarity[i] = handle.pearson(userScoreRatingMatrix[i], currentUser)
  }
  return similarity
}

/**
 * 
 * @param {*} currentUser 前用户的评分一维数组
 * @param {*} userScoreRatingMatrix user-score所有用户的评分矩阵
 * @returns 返回推荐的曲谱id和推荐指数对象数组
 */
const recommendUser = (currentUser, userScoreRatingMatrix) => {

  // 计算用户相似度数组
  let similarity = similarUser(currentUser, userScoreRatingMatrix)

  const mostSimilarNum = 5

  // 返回最相近的5个用户：
  let mostSimilarUser = handle.sortArray(similarity, mostSimilarNum)

  // 创建曲谱推荐指数数组，初始都为0
  const recommendStar = new Array(currentUser.length).fill(0)

  // 根据所以用户的评分矩阵提取这5个用户的评分数据并计算推荐曲谱指数
  for (let i = 0; i < mostSimilarNum; i++) {
    let userId = mostSimilarUser[i].id
    let pearsonNum = mostSimilarUser[i].num
    for (let j = 0; j < recommendStar.length; j++) {
      // 推荐当前用户没评分且相似用户已评分的曲谱
      if (currentUser[j] === 0 && userScoreRatingMatrix[userId - 1][j] !== 0) {
        // 计算指数
        let star = userScoreRatingMatrix[userId - 1][j] * pearsonNum

        // 这里累加是因为有可能多个用户都推荐同一个曲谱
        recommendStar[j] += star
      }
    }
  }

  // 根据曲谱推荐指数数组 来求得 最终推荐的 曲谱
  // 这里推荐 12 个曲谱
  const recommendNum = 12
  let recommendFinal = handle.sortArray(recommendStar, recommendNum)
  return recommendFinal
}

module.exports = {
  recommendUser
}