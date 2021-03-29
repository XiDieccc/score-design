import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import { Notification } from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      name: 'home',
      redirect: { name: 'score-list' }
    },
    {
      path: '/users/login',
      alias: '/login',
      name: 'login',
      component: () =>
        import ('./views/user/login.vue')
    },
    {
      path: '/users/register',
      alias: '/register',
      name: 'register',
      component: () =>
        import ('./views/user/register.vue')
    },
    {
      path: '/scores',
      component: () =>
        import ('./views/layout/score'),
      children: [{
          path: 'create',
          name: 'score-create',
          alias: 'edit',
          component: () =>
            import ('./views/score/create'),
          meta: { auth: true }
        },
        {
          path: 'detail/:id',
          name: 'score-detail',
          component: () =>
            import ('./views/score/detail')
        },
        {
          path: 'list',
          name: 'score-list',
          component: () =>
            import ('./views/score/list')
        },
        {
          path: 'search',
          name: 'score-search',
          component: () =>
            import ('./views/score/search')
        },
        {
          path: 'recommend',
          name: 'score-recommend',
          component: () =>
            import ('./views/score/recommend'),
          meta: { auth: true }
        }
      ]
    },
    { path: '*', redirect: { name: 'score-list' } }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((router) => router.meta.auth)) {
    if (store.state.isUserLogin) {
      next()
    } else {
      Notification({
        title: '提示',
        type: 'warning',
        message: '请登录后再访问该页面'
      })
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
    }
  }
  next()
})

export default router