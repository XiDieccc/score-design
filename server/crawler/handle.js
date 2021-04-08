const fs = require('fs')
const { Score, Sequelize, sequelize } = require('../models')

/**
 * 具体的信息处理
 * @param {*} $ 
 * @returns score曲谱对象
 */
exports.jitabaHandle = function($) {
  return new Promise((resolve) => {
    let score = {
      title: '',
      name: '',
      keys: '',
      singer: '',
      poster: '',
      tags: '',
      rating: '',
      views: '',
      spectrum: '',
      description: ''
    }

    let header = $('body > div.main.newslist > div.listl > div > div.listlcon > div.listltitle > h1').text()
      // 转换下分隔符 有的是 ',' 有的是 '_'
    header = header.replace(/\,/g, '_')

    //【标题 title】
    score.title = header

    // 【歌曲名称】 + 【演唱歌手】
    // '周华健《其实不想走》吉他谱_C调指法_弹唱六线谱' '爱就一个字吉他谱_张信哲_C调_弹唱六线谱'
    // '是云白吉他谱_秦霄贤_G调弹唱谱_电影《白蛇情劫》主题曲' '形容吉他谱_沈以诚《形容》六线谱_G调弹唱谱'
    // '我们的纪念吉他谱_李雅微_《放羊的星星》_C调简单版' '萱草花吉他谱_张小斐《你好李焕英》插曲_弹唱演示视频'
    let headerArr = header.split('_')
    if (headerArr[0].includes('《')) {
      let tempArr = headerArr[0].split(/\《|\》/g)
      score.singer = tempArr[0]
      score.name = tempArr[1]
    } else {
      score.name = headerArr[0].split('吉他谱')[0]
      if (!headerArr[1].includes('调')) {
        if (headerArr[1].includes('《')) {
          score.singer = headerArr[1].split(/\《|\》/g)[0]
        } else {
          score.singer = headerArr[1]
        }
      }
    }
    // 若标题没有歌手，则演唱歌手为群星（根据观察得到的规律）
    score.singer = (score.singer === '') ? '群星' : score.singer

    // 【调号】
    let indexOfKeys = header.indexOf('调') - 1
    if (indexOfKeys !== -1 && header.charCodeAt(indexOfKeys) >= 65 && header.charCodeAt(indexOfKeys) <= 90) {
      score.keys = header.charAt(indexOfKeys)
    }
    // 若标题无调号，则默认为C调。（比较基础的简易指法）
    score.keys = (score.keys === '') ? 'C' : score.keys

    // 吉他吧有多种不同结构的详情页，以下处理方法不会报错

    let tabzoneStr = $('#tabzone').toString()

    // 读取所有图片的地址
    let tabzoneArr = tabzoneStr.split(/src="/g)
    let imgArr = []
    tabzoneArr.forEach((str, index) => {
      // BUG 有的有视频，也有src
      if (str.startsWith('http://www.jitaba.cn')) {
        imgArr.push(str.slice(0, str.indexOf('"')))
      }
    })

    // 【海报】 根据曲谱地址，第一张图片为海报地址
    if (imgArr.length) {
      score.poster = imgArr[0]
    }

    // 【图片曲谱】 拼接操作 使用 '; ' 分隔
    imgArr.forEach((str, index) => {
      if (index === 0) {
        score.spectrum = str + '; '
      } else if (index === imgArr.length - 1) {
        score.spectrum = score.spectrum + str
      } else {
        score.spectrum = score.spectrum + str + '; '
      }
    })

    // 【曲谱简介】读取 该div中的所有中文字符（不包括img的alt属性）
    while (true) {
      tabzoneStr = tabzoneStr.slice(tabzoneStr.indexOf('<') + 1)
      if (tabzoneStr === '/div>') {
        break
      }
      if (!score.description) {
        score.description = tabzoneStr.slice(tabzoneStr.indexOf('>') + 1, tabzoneStr.indexOf('<')).trim()
      } else {
        score.description += tabzoneStr.slice(tabzoneStr.indexOf('>') + 1, tabzoneStr.indexOf('<')).trim()
      }
      tabzoneStr = tabzoneStr.slice(tabzoneStr.indexOf('>') + 1)
    }

    // 根据曲谱简介 也可得到歌曲名称 
    score.name = (score.name === '') ? score.description.split('吉他谱')[0] : score.name

    resolve(score)

  })
}