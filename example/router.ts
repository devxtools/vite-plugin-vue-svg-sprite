// router.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 路由表
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@pages/Home.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@pages/About.vue'),
  },
  // {
  //   path: '/user',
  //   name: 'user',
  //   component: () => import('@pages/User/index.vue'),
  //   children: [
  //     {
  //       path: ':id',
  //       name: 'user-detail',
  //       component: () => import('@pages/User/Detail.vue'),
  //       props: true, // 自动将路由参数作为 props 传入
  //     },
  //     {
  //       path: ':id/settings',
  //       name: 'user-settings',
  //       component: () => import('@pages/User/Settings.vue'),
  //     },
  //   ],
  // },
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import('@pages/Login.vue'),
  // },
  {
    path: '/:pathMatch(.*)*', // 404 匹配规则
    name: 'not-found',
    component: () => import('@pages/NotFound.vue'),
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 也可以改成 createWebHashHistory()
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
