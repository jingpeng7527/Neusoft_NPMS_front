// Imports
import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Test from '../views/TransferReport.vue'
import { trailingSlash } from '@/util/helpers'
import MQ from '../views/mqtttest.vue'
import MQ2 from '../views/mqtttest2.vue'
import {
  layout,
  route,
} from '@/util/routes'

Vue.use(Router)

const router = new Router({
  //mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/mqtt1',
      name: 'MQ',
      component: MQ,
    },
    {
      path: '/mqtt2',
      name: 'MQ2',
      component: MQ2,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path: '/mytest1',
      name: 'Test',
      component: Test,
    },
   
    layout('Default', [
      route('Dashboard'),

      // Pages
      route('ClientManagement', null, 'components/clientManagement'),

      route('Login', null, 'test/login'),
      route('ChanceApproval', null, '/aprroval/chance'),

      route('Notifications', null, 'components/notifications'),
      route('ReportManagement', null, 'components/reportManagement'),
      route('SalesLog', null, 'components/salesLog'),

      // Tables
      route('ChanceMaintain', null, 'tables/chanceMaintain'),

      route('ClientTransfer', null, '/client/transfer/'),
    ]),
  ],
})

router.beforeEach((to, from, next) => {
  return to.path.endsWith('/') ? next() : next(trailingSlash(to.path))
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
      //如果需要就执行下面的代码
      
      var num=localStorage.getItem("isLogin");
      if (num) {  
          //如果登录了，就跳转到'/index'路径
          next();
      }
  else {
          next({
              path: '/login',//返回登录界面
          })
      }
  }
  else {
      //如果不需要登录权限就直接跳转到该路由
      next();
  }
})

export default router
