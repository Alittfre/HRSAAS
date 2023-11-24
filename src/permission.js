import router from '@/router'
import store from '@/store'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/404']

router.beforeEach(async(to, from, next) => {
  nProgress.start()
  if (store.getters.token) { // todo:后端校验token
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo')
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  nProgress.done()
})

router.afterEach((to, from, next) => {
  nProgress.done()
})
