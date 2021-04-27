const handle = require('./handle')

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
    for (let i = 0; i < ratingsArr.length; i++) {
      let { userId, rating, scoreId } = ratingsArr[i]
      userScoreRatingMatrix[Number(userId) - 1][Number(scoreId) - 1] = rating
    }

    // 计算当前用户评分矩阵
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

    let res = handle.recommend(currentUser, userScoreRatingMatrix)
    resolve(res)

  })
}