// function aaa(data) {
//   return new Promise(async(resolve) => {
//     let arr = []
//     for (let i = 0; i < data.length; i++) {
//       await arr.push(data[i] * 10)
//     }
//     // await console.log('aaaaaaa:')
//     // await console.log(arr)
//     resolve(arr)
//   })
// }

// // let start = new Date().getTime()
// // console.log('开始时间' + start)
// // aaa().then(() => {
// //   let end = new Date().getTime()
// //   console.log('结束时间' + end)
// //   console.log('总时间' + (end - start).toString())
// // })
// const bbb = function() {
//   return new Promise(async(resolve) => {
//     let scoreArray = []
//     const urlArr = [
//       [1, 2, 3],
//       [1, 2, 3],
//       [1, 2, 3],
//       [1, 2, 3],
//       [1, 2, 3]
//     ]

//     await urlArr.reduce((rs, data) => {
//       return rs.then(() => {
//         return new Promise(async(resolve) => {
//           let temp = await aaa(data)
//             // await console.log(temp)
//           scoreArray = scoreArray.concat(temp)
//             // await console.log('bbbbbbbbb')
//             // await console.log(scoreArray)
//           resolve(scoreArray)
//         })
//       })
//     }, Promise.resolve())

//     resolve(scoreArray)
//   })
// }

// bbb().then((data) => {
//   console.log(data)
// })

let test = '搁浅指弹谱_周杰伦_高度还原_吉他独奏谱'
let flag = test.includes('指弹')
console.log(flag)