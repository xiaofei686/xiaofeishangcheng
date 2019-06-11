// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import MyServerHttp from '@/plugins/http.js'
import moment from 'moment'

// 自定义组件面包屑
import Bread from '@/components/cuscom/myBread.vue'

import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'

Vue.config.productionTip = false


Vue.use(ElementUI);
Vue.use(MyServerHttp);


// 全局过滤器---处理日期
// npm i moment  安装
Vue.filter('fmtdate',(v)=>{
  return  moment(v).format('YYYY--MM--DD')
})

// 自定义组件面包屑
Vue.component(Bread.name,Bread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
