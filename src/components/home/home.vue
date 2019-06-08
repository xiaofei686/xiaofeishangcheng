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
      <el-aside width="200px" class="home-aside">
            <el-menu :unique-opened='true'>
                <!-- 1 -->
                <el-submenu index="1">
                    <template slot="title">
                         <i class="el-icon-bell"></i>
                        <span>用户管理</span>
                    </template>  
                    <el-menu-item index="1-1">
                        <i class="el-icon-tickets"></i>
                        <span>用户列表</span>
                    </el-menu-item>
                </el-submenu>
                 <!-- 2 -->
                <el-submenu index="2">
                    <template slot="title">
                         <i class="el-icon-edit-outline"></i>
                        <span>权限管理</span>
                    </template>  
                    <el-menu-item index="2-1">
                        <i class="el-icon-view"></i>
                        <span>角色列表</span>
                    </el-menu-item>
                    <el-menu-item index="2-2">
                        <i class="el-icon-star-off"></i>
                        <span>权限列表</span>
                    </el-menu-item>
                </el-submenu>
                 <!-- 3 -->
                <el-submenu index="3">
                    <template slot="title">
                         <i class="el-icon-location-outline"></i>
                        <span>商品管理</span>
                    </template>  
                    <el-menu-item index="3-1">
                        <i class="el-icon-goods"></i>
                        <span>商品列表</span>
                    </el-menu-item>
                     <el-menu-item index="3-2">
                        <i class="el-icon-circle-plus-outline"></i>
                        <span>分类参数</span>
                    </el-menu-item>
                     <el-menu-item index="3-3">
                        <i class="el-icon-sold-out"></i>
                        <span>商品分类</span>
                    </el-menu-item>
                </el-submenu>
                 <!-- 4 -->
                <el-submenu index="4">
                    <template slot="title">
                         <i class="el-icon-setting"></i>
                        <span>订单管理</span>
                    </template>  
                    <el-menu-item index="4-1">
                        <i class="el-icon-document"></i>
                        <span>订单列表</span>
                    </el-menu-item>
                </el-submenu>
                 <!-- 5 -->
                <el-submenu index="5">
                    <template slot="title">
                         <i class="el-icon-menu"></i>
                        <span>数据统计</span>
                    </template>  
                    <el-menu-item index="5-1">
                        <i class="el-icon-news"></i>
                        <span>数据报表</span>
                    </el-menu-item>
                </el-submenu>
          
            </el-menu>
      </el-aside>
      <el-main class="home-main">Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
    export default {
        beforeCreate(){
            const token = localStorage.getItem('token')
            if(!token){
                this.$router.push({
                    name:'login'
                })
            }
        },
        methods:{
            handleSignout(){
                localStorage.clear()
                this.$message.success('退出成功')
                this.$router.push({name:'login'})
            }
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
  width: 200px;
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