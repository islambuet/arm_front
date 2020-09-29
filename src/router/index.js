import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: () => import('@/components/home/Home.vue') },
  { path: '/login', name: 'Login', component: () => import('@/components/login/Login.vue') },
  { path: '/sys_module_task',component: function () {return import('@/components/sys_module_task/SysMouduleTask.vue')},
    children: [
      {path: 'add'},      
      {path: 'edit/:item_id'}      
    ]
  },  
  { path: '/sys_user_group',component: function () {return import('@/components/sys_user_group/SysUserGroup.vue')},
    children: [
      {path: 'add'},      
      {path: 'edit/:item_id'} ,     
      {path: 'role/:item_id'} ,     
    ]
  },  
  { path: '/setup_system_configuration',component: function () {return import('@/components/setup_system_configuration/SetupSystemConfiguration.vue')},
    children: [
      {path: 'add'},      
      {path: 'edit/:item_id'} ,     
      {path: 'role/:item_id'} ,     
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
