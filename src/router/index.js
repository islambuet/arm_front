import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: () => import('@/components/home/Home.vue') },
  { path: '/login', name: 'Login', component: () => import('@/components/login/Login.vue') },
  // { path: '/transfer_product', name: 'TransferProduct', component: () => import('@/components/transfer/TransferProduct.vue') },
  {
    path: '/transfer',component: function () {return import('@/components/transfer/TransferProduct.vue')},
    children: [
      {path: 'add'},      
      {path: 'edit/:row_id'},      
      {path: 'details/:row_id'},      
    ]
  },
  { path: '*',name:'NotFound',component: function () {return import('@/components/not_found/NotFound.vue')}},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
