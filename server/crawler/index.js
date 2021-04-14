const jitaba = require('./jitaba')

/**
 * 解析 吉他吧 网站
 * @param {*} pageNumber
 * @returns
 */
exports.crawler = function(startPage, pageNumber) {
  return new Promise(async(resolve) => {
    const jitabaHost = 'http://www.jitaba.cn'

    // 存储要爬取的页面url  共605页
    const urlArr = []
    for (let i = startPage; i < startPage + pageNumber; i++) {
      urlArr.push(`${jitabaHost}/pic/list_48_${i}.html`)
    }

    // 全部页面存储曲谱的集合数组
    let scoreArray = []

    // 同步执行 getList 操作，即每页每页的同步处理
    await urlArr.reduce((rs, url) => {
      return rs.then(() => {
        return new Promise(async(resolve) => {
          let temp = await jitaba.getList(url)
          scoreArray = scoreArray.concat(temp)
          resolve(scoreArray)
        })
      })
    }, Promise.resolve())

    // BUG (没有resolve会一直停留在这个页面)
    resolve(scoreArray)
  })
}

// exports.crawler(1, 1)