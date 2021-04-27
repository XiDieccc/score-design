const puppeteer = require('puppeteer')
const simplify = require('hanzi-tools').simplify

/**
 * 通过 puppeteer 动态爬取曲谱剩余的信息
 * @param {*} score 传入的曲谱对象
 */
exports.doubanDetail = async(score) => {
  return new Promise(async(resolve) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const doubanHost = 'https://www.douban.com/'
    try {
      await page.goto(doubanHost)

      // 搜索框输入 歌曲名
      // await page.type('#anony-nav > div.anony-srh > form > span.inp > input[type=text]', '当年情')
      await page.type('#anony-nav > div.anony-srh > form > span.inp > input[type=text]', score.name)
      await page.keyboard.press('Enter')
      await page.waitForSelector('#content > div > div.article > div.search-cate > ul > li:nth-child(4) > a')

      // BUG li.on BUG
      // await page.click('#content > div > div.article > div.search-cate > ul > li.on > a')
      await page.click('#content > div > div.article > div.search-cate > ul > li:nth-child(4) > a')

      // #content > div > div.article > div.search-result > p class = 'no-result' 没有找到
      // #content > div > div.article > div.search-result > h2 相关音乐 找到了
      // #content > div > div.article > div.search-result > h2 相关豆瓣内容
      await page.waitForSelector('#content > div > div.article > div.search-result > h2')
      let searchStr = await page.$eval('#content > div > div.article > div.search-result > h2', h2 => h2.innerText)
      if (searchStr.includes('相关音乐')) {
        await page.waitForSelector('#content > div > div.article > div.search-result > div.result-list')

        // 繁体字转化为简体
        const scoreName = simplify(await page.$eval('#content > div > div.article > div.search-result > div.result-list > div:nth-child(1) > div.content > div > h3 > a', a => a.innerText)).trim()
        if (score.name === scoreName) {
          const doubanDetailUrl = await page.$eval('#content > div > div.article > div.search-result > div.result-list > div:nth-child(1) > div.content > div > h3 > a', a => a.href)
            // console.log('豆瓣' + scoreName + doubanDetailUrl)

          // 此处 click貌似不起作用了，直接使用 goto 跳转
          // await page.click('#content > div > div.article > div.search-result > div.result-list > div:nth-child(1) > div.content > div > h3 > a')
          await page.goto(doubanDetailUrl)
          await page.waitForSelector('#mainpic > span > a > img')

          // 【豆瓣的海报】
          // let posterUrl = await page.$eval('#mainpic > span > a > img', img => img.src)
          //   // 这个是默认海报
          // if (posterUrl !== 'https://img3.doubanio.com/f/music/11496305e2cd99415ec541326b236b6b8d61175c/pics/music/default_cover/lpic/music-default.gif') {
          //   score.poster = posterUrl
          // }

          // 【评分】没有评分 strong.innerText为空
          let ratingStr = await page.$eval('#interest_sectl > div > div.rating_self.clearfix > strong', strong => strong.innerText)
          if (ratingStr) {
            score.rating = Number(ratingStr) / 2
          } else {
            score.rating = 0
          }
          // 【浏览量】
          // 评价人数不足 #interest_sectl > div > div.rating_self.clearfix > div > div.rating_sum > a
          let viewsHtml = await page.$eval('#interest_sectl > div > div.rating_self.clearfix > div > div.rating_sum', div => div.innerHTML)
          if (viewsHtml.toString().includes('span')) {
            score.views = await page.$eval('#interest_sectl > div > div.rating_self.clearfix > div > div.rating_sum > a > span', span => span.innerText)
          } else {
            score.views = '0'
          }

          // 【标签】
          let tagsStr = await page.$eval('#db-tags-section > h2', h2 => h2.innerText)
          if (!tagsStr.includes('共0个')) {
            // 标签数组
            const tagsArr = await page.evaluate(() => {
              const tags = document.querySelectorAll('#db-tags-section > div > a.music-tags')
              return Array.prototype.map.call(tags, a => a.innerText)
            })

            // 拼接标签，使用'; '
            tagsArr.forEach((tag, index) => {
              // BUG
              // score.tags = score.tags + tag + (index === tagsArr.length - 1) ? '' : '; '
              if (index === 0) {
                score.tags = tag + '; '
              } else if (index === tagsArr.length - 1) {
                score.tags = score.tags + tag
              } else {
                score.tags = score.tags + tag + '; '
              }
            })
          }
        }
        // console.log(score)
      } else {
        console.log(`没有找到对应歌曲：《${score.name}》`)
      }
      resolve(score)
    } catch (error) {
      console.log(`网络连接错误，操作失败：《${score.name}》`)
    } finally {
      await browser.close()
    }
  })
}

// exports.doubanDetail({ name: '无用清净梦' })

// #mainpic > span > a > img
// #mainpic > span > a > img
// #mainpic > span > a > img

// https://img3.doubanio.com/f/music/11496305e2cd99415ec541326b236b6b8d61175c/pics/music/default_cover/lpic/music-default.gif