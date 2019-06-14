import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Right from '@/components/rights/right.vue'
import Role from '@/components/rights/role.vue'
import Goods from '@/components/goods/goodsList.vue'
import Goodsadd from '@/components/goods/goodsadd.vue'
import Cateparams from '@/components/goods/cateparams.vue'
import Goodscate from '@/components/goods/goodscate.vue'

Vue.use(Router)

import {Message} from 'element-ui'
const router = new Router({
  routes: [
    {
      name:'login',
      path: '/login',
      component:Login
    },
    {
      name:'home',
      path: '/',
      component:Home,
      children:[
          {name:'users',path:'users',component:Users},
          {name:'right',path:'rights',component:Right},
          {name:'role',path:'roles',component:Role},
          {name:'goods',path:'goods',component:Goods},
          {name:'goodsadd',path:'goodsadd',component:Goodsadd},
          {name:'params',path:'params',component:Cateparams},
          {name:'goodscate',path:'categories',component:Goodscate},
          

      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
    if(to.path==='/login'){
      next()
    }else{
       const token= localStorage.getItem('token')
       if(!token){
           Message.warning('请先登录')
           router.push({

              name:'login'
           })
           return
       }
       next()
    }
})
export default router