const path = require('path')
const Csv = require('csvtojson')

// 读取csv文件

const scoresHandle = () => {
  return new Promise((resolve) => {
    const scoreTrain = []
    const csvToJson = new Csv()
    csvToJson.fromFile(path.resolve(__dirname, './csv/douban_music.csv'))
      .then((data) => {
        data.forEach((score, index) => {
          scoreTrain[index] = {
            scoreId: index + 1,
            name: score.title,
            singer: score.artist,
            rating: score.star,
            category: score.tags
          }
        })
        resolve(scoreTrain)
      })
  })
}

const ratingsHandle = () => {
  return new Promise((resolve) => {
    const ratingTrain = []
    const csvToJson = new Csv()
    csvToJson.fromFile(path.resolve(__dirname, './csv/ratings.csv'))
      .then((data) => {
        data.forEach((rating, index) => {
          ratingTrain[index] = {
            userId: rating.userId,
            rating: Number(rating.rating),
            scoreId: rating.scoreId
          }
        })
        resolve(ratingTrain)
      })
  })
}

/**
 * 计算两个用户的皮尔逊系数（相比于余弦相似度，先将向量所有纬度数值中心化处理，皮尔逊相关系数是余弦相似度在维度值缺失情况下的一种改进）
 * 可以理解为 在同一坐标轴内，x轴为曲谱id，y轴为评分大小，用户1和用户2都能作出一条连续的曲线，若两条曲线越接近甚至重合，则两个用户相似度越高，皮尔逊系数就越接近1。
 * https://blog.csdn.net/qq_30142403/article/details/82350628 公式4
 * https://blog.csdn.net/ruthywei/article/details/82527400?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control&dist_request_id=1331988.12766.16188256693478135&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control
 * @param {*} user1 一维矩阵 索引为scoreId，值为评分
 * @param {*} user2 一维矩阵 索引为scoreId，值为评分
 * @returns 相似度系数，浮点型
 */
const pearson = (user1, user2) => {
  let commonNumber = user1.length // 为公式中的 N 值，为变量取值个数，即曲谱个数，数组长度
  let sum12 = 0.0 // user1 user2 每一项评分乘积的总和
  let sum1 = 0.0 // user1 评分和
  let sum2 = 0.0 // user2 评分和
  let sum1Square = 0.0 // user1 每项评分平方的累加
  let sum2Square = 0.0 // user2 每项评分平方的累加

  for (let i = 0; i < user1.length; i++) {
    sum1 += user1[i]
    sum2 += user2[i]
    sum12 += user1[i] * user2[i]
    sum1Square += Math.pow(user1[i], 2)
    sum2Square += Math.pow(user2[i], 2)
  }

  // 分子
  let molecule = sum12 - (sum1 * sum2) / commonNumber

  // 分母
  let denominator = Math.sqrt((sum1Square - Math.pow(sum1, 2) / commonNumber) * (sum2Square - Math.pow(sum2, 2) / commonNumber))
  if (denominator === 0) {
    return 0
  }

  // 结果系数
  let pearsonNum = molecule / denominator

  // 等于1有两种情况，及本人与本人比较，或者两个人的喜好相同，这两种情况都无法推荐新的曲谱，化-1排除掉
  if (pearsonNum === 1) {
    pearsonNum = -1
  }

  return pearsonNum
}

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
    similarity[i] = pearson(userScoreRatingMatrix[i], currentUser)
  }
  return similarity
}

/**
 * 
 * @param {Array} arr 需要排序的数组
 * @param {Number} n 最大的n个值
 * @returns 最大n个值以及下标对象数组
 */
const sortArray = (arr, n) => {
  let res = []
  let arrTemp = new Array(...arr)
  arrTemp.sort((a, b) => b - a)
  for (let i = 0; i < n; i++) {
    let max = arrTemp.shift()

    // 这里BUG，若两两个数字相同，则返回第一个index
    let maxIndex = arr.indexOf(max)

    // 这里将 max 改一下方便下一个index
    arr[maxIndex] = -1
    res.push({ id: maxIndex + 1, num: max })
  }
  return res
}

/**
 * 
 * @param {*} currentUser 前用户的评分一维数组
 * @param {*} userScoreRatingMatrix user-score所有用户的评分矩阵
 * @returns 返回推荐的曲谱id和推荐指数对象数组
 */
const recommend = (currentUser, userScoreRatingMatrix) => {

  // 计算用户相似度数组
  let similarity = similarUser(currentUser, userScoreRatingMatrix)

  const mostSimilarNum = 5

  // 返回最相近的5个用户：
  let mostSimilarUser = sortArray(similarity, mostSimilarNum)

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
  let recommendFinal = sortArray(recommendStar, recommendNum)
  return recommendFinal
}

module.exports = {
  scoresHandle,
  ratingsHandle,
  recommend
}