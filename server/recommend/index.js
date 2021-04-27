const handle = require('./handle')
const UserCF = require('./User-Based')
const ItemCF = require('./Item-Based')
  // const { User } = require('../models')

/**
 * 
 * @param {Object} user 从数据库得到的user对象
 * @returns 推荐曲谱id以及推荐指数对象 数组
 */
exports.recommendIndex = (user) => {
  return new Promise(async(resolve) => {

    // 导入csv文件 转化成对象数组
    const scoresArr = await handle.scoresHandle()
    const ratingsArr = await handle.ratingsHandle()

    // 最大曲谱数
    const scoresMax = scoresArr.length

    // 最大用户数
    // const usersMax = Math.max.apply(Math, ratingsArr.map(rating => { return rating.userId }))
    const usersMax = 2095 // 这里查看csv文件得到的，数据太大，栈溢出了

    // 创建评分矩阵 user-score
    let userScoreRatingMatrix = new Array(usersMax) // 行
    for (let i = 0; i < usersMax; i++) {
      userScoreRatingMatrix[i] = new Array(scoresMax).fill(0) // 列 forEach用法报错，慎用啊
    }

    // 创建 socre-user评分倒置矩阵
    let scoreUserRatingMatrix = new Array(scoresMax) // 行
    for (let i = 0; i < scoresMax; i++) {
      scoreUserRatingMatrix[i] = new Array(usersMax).fill(0) // 列
    }

    for (let i = 0; i < ratingsArr.length; i++) {
      let { userId, rating, scoreId } = ratingsArr[i]

      // user-score评分矩阵
      userScoreRatingMatrix[Number(userId) - 1][Number(scoreId) - 1] = rating

      // score-user评分矩阵
      scoreUserRatingMatrix[Number(scoreId) - 1][Number(userId) - 1] = rating
    }

    // 计算当前用户评分矩阵
    // 为什么不在 user-score评分矩阵章直接 userScoreRatingMatrix[用户id] 来得到，是因为在系统初期用户太少，当前用户以及其评分信息没有计入该矩阵中,但计入了数据库中，在系统后期会将评分信息写入csv评分文件
    let currentUser = new Array(scoresMax).fill(0)

    // 这样分割最后一个为空，所以遍历时最大值-1
    let currentUserRatingArr = user.ratings.split(';')
    for (let i = 0; i < currentUserRatingArr.length - 1; i++) {
      let temp = currentUserRatingArr[i].split(',')
      let scoreId = Number(temp[0])
      let rating = Number(temp[1])
      currentUser[scoreId - 1] = rating
    }

    // // 计算该用户与每个用户的相似度矩阵
    // let similarity = similarUser(currentUser, userScoreRatingMatrix)

    // // 根据相似度矩阵推荐曲谱和相似度矩阵来计算推荐曲谱
    // let res = recommend(currentUser, similarity, userScoreRatingMatrix)

    let resUserCF = UserCF.recommendUser(currentUser, userScoreRatingMatrix)
    let resItemCF = ItemCF.recommendItem(currentUser, scoreUserRatingMatrix)
    let res = { resUserCF, resItemCF }
    resolve(res)

  })
}

// (async() => {
//   const user = await User.findByPk(1)
//   let res = await exports.recommendIndex(user)
//   console.log(res)
// })()