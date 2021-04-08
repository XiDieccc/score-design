const { requestPromise } = require('./request')
const cheerio = require('cheerio')
const { jitabaHandle, fileHandle } = require('./handle')
const { doubanDetail } = require('./douban')
const ScoreController = require('../controllers/ScoreController')


/**
 * 获取页面的全部列表的地址，及具体信息的地址
 * @param {String} url
 */
const getList = async function(url) {
  const html = await requestPromise(url)
  const $ = cheerio.load(html)

  const detailUrlArr = []
    // 为方便数据处理，通过 标题名 过滤掉指弹吉他谱，只保留 弹唱吉他谱
  if ($('body > div.main.newslist > div.listl.list2 > ul > li:nth-child(1) > h3 > a > b').text().includes('吉他谱')) {
    $('body .main .list2 ul li .viewimg .preview').each((index, item) => {
      // 详情页地址的信息
      // await getDetail($(item).attr('href'))
      // poster 地址
      // let e = cheerio.load([].concat(item))
      // console.log(e('img').attr('src'))

      //TODO: 改进版 同步操作 先存放数组
      detailUrlArr.push($(item).attr('href'))
    })
  }

  detailUrlArr.reduce((rs, detailUrl) => {
    return rs.then(() => {
      return new Promise(async(resolve) => {
        await getDetail(detailUrl)
        resolve()
      })
    })
  }, Promise.resolve())

}



/**
 * 爬取吉他吧详情页的信息，比如曲谱标题，歌曲名称等
 * @param {String} detailUrl 详情页地址
 */
const getDetail = async function(detailUrl) {
  const html = await requestPromise(detailUrl)
  const $ = cheerio.load(html)
  let scoreMid = await jitabaHandle($)
  let score = await doubanDetail(scoreMid)

  // 写入数据库 TODO: 可以转存为数组批量异步存入数据库，详情见Readme
  let res = await ScoreController.writeToDB(score)
  console.log(res)
}

module.exports = {
  getList,
  getDetail
}