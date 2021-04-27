import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueLazyload from 'vue-lazyload'

Vue.use(Element)
Vue.use(VueLazyload, { loading: require('../assets/loading.jpg') })