<template>
  <el-container class="home-container">
    <el-header class="home-header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple home-logo">
            <img src="../../assets/img/timg.jpg" alt>
          </div>
        </el-col>
        <el-col :span="18" class="home-middle">
          <div class="grid-content bg-purple">
            <h3>电商后台管理系统</h3>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple home-a">
            <a href="#" @click="handleSignout()">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="home-content">
      <el-aside width="200px" class="home-aside" >
            <el-menu :unique-opened='true' :router='true'>
                <!-- 1 -->
                <el-submenu :index='""+item1.order' v-for="(item1,index) in menus" :key="index">
                    <template slot="title">
                         <i class="el-icon-bell"></i>
                        <span>{{item1.authName}}</span>
                    </template>  
                    <el-menu-item :index="item2.path" v-for='(item2,index) in item1.children' :key="index">
                        <i class="el-icon-tickets"></i>
                        <span>{{item2.authName}}</span>
                    </el-menu-item>
                </el-submenu>
          
            </el-menu>
      </el-aside>
      <el-main class="home-main">
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
    export default {
        data(){
          return{
              menus:[]
          }
        },
        // 如果没有登录跳转到login(路由中简化)
        // beforeCreate(){
        //     const token = localStorage.getItem('token')
        //     if(!token){
        //         this.$router.push({
        //             name:'login'
        //         })
        //     }
        // },
        methods:{
            handleSignout(){
                // 清除token
                localStorage.clear()
                // 提示
                this.$message.success('退出成功')
                // 跳转login组件
                this.$router.push({name:'login'})
            },
            // 获取动态列表
            async getMenus(){
                const res = await this.$http.get(`menus`)
               
                this.menus = res.data.data
            }
        },
        created(){
             this.getMenus()
        }
    };
</script>
<style >
.home-container {
  height: 100%;
}
.home-header {
  background-color: #b3c0d1;
}
/* 头部样式 */

.home-header .home-logo img {
  height: 60px;
  width: 180px;
}
.home-header .home-middle {
  text-align: center;
  line-height: 60px;
}
.home-header .home-middle h3 {
  font-size: 22px;
}
.home-header .home-a {
  line-height: 60px;
}

.home-aside {
  background-color: #d3dce6;
}
.home-main {
  background-color: #e9eef3;
}
</style>