// 插件模块

import axios from 'axios'
const MyHttpServer={}

MyHttpServer.install =  (Vue)=> {

    axios.defaults.baseURL='http://47.97.214.102:8888/api/private/v1'

    // 添加一个请求拦截器
    axios.interceptors.request.use(function (config) {
    
        if(config.url !=='login'){
             //  给全局设置 需要授权的Api，必须在请求头中使用Authorization 字段提供token令牌
            const AUTH_TOKEN=localStorage.getItem('token');
            config.headers['Authorization'] = AUTH_TOKEN;
        }
        return config;
        
    }, function (error) {
        
        return Promise.reject(error);
    });

    // 添加一个响应拦截器
    axios.interceptors.response.use(function (response) {
    
        return response;
    }, function (error) {
     
        return Promise.reject(error);
    });


    // 添加实例方法
    Vue.prototype.$http = axios
    
}
export default  MyHttpServer