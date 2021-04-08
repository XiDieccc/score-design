const request = require('request')
const iconv = require('iconv-lite')

/**
 * promise 封装 请求服务器及下载页面，专门对 gb2312 编码的网站进行封装的请求
 * @param {*} url
 * @returns
 */
exports.requestPromise = (url) => {
  return new Promise((resolve, reject) => {
    request(url, { encoding: null }, function(error, response, body) {
      if (response.statusCode === 200) {
        const bufs = iconv.decode(body, 'gb2312')
        const html = bufs.toString('utf8')
        resolve(html)
      } else {
        reject(error)
      }
    })
  })
}