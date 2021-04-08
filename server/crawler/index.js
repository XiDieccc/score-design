const jitaba = require('./jitaba')



exports.crawler = function() {

  /*
   * 解析 吉他吧 网站 
   */
  const jitabaHost = 'http://www.jitaba.cn'
  const jitabaUrl = '/pic/list_48_1.html'

  // 存储曲谱的集合数组
  const scoreDB = []

  // 存储要爬取的页面url  暂时2页,共605页
  const urlArr = []
  for (let i = 1; i <= 1; i++) {
    urlArr.push(`${jitabaHost}/pic/list_48_${i}.html`)
  }

  // 同步执行 getList 操作，即每页每页的同步处理
  urlArr.reduce((rs, url) => {
    return rs.then(() => {
      return new Promise(async(resolve) => {
        await jitaba.getList(url)
        resolve()
      })
    })
  }, Promise.resolve())
}

exports.crawler()