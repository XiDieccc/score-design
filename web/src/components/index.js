import Vue from 'vue'

const requireContext = require.context(
  './global',
  true,
  /\.vue$/
)

// 全局组件注册
requireContext.keys().forEach(fileName => {
  const componentConfig = requireContext(fileName)
  Vue.component(
    componentConfig.default.name || componentConfig.name,
    componentConfig.default || componentConfig
  )
})