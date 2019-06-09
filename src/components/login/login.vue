<template>
  <div class="login-wrap"> 
    <el-form 
    class="login-form"
    label-position="top" 
    label-width="80px" 
    :model="formdata">
        <h2 class="login-font">用户登录</h2>
        <el-form-item label="用户名">
            <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-button type="primary" class="login-btn" @click.prevent="handleLogin()">登录</el-button>
    </el-form>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                formdata: {
                    password:'',
                    username:''
                }
            }
        },
        methods:{
            // handleLogin(){
            //     this.$http.post('login',this.formdata).then(res=>{
            //         console.log(res)
            //         const{
            //             data,
            //             meta:{msg,status}
            //         }=res.data
            //
            //          //登录成功
            //         if(status==200){
            //
            //             // 跳转home
            //             this.$router.push({name:'home'})
            //                 
            //              //  弹出成功
            //             this.$message.success(msg);
            //         }else{
            //              //  弹出成功  
            //             this.$message.warning(msg)
            //         }
            //     })
            // }

            // 登录 简化登录请求代码  async和await
            // 让异步代码ajax看起来像同步代码
            // 1.找到异步操作有结果的代码   前面加await 同时接口异步操作的结果 res
            // 2.找到距离异步操作有结果的代码最近的方法 前面加async

            async handleLogin(){
                 const res = await this.$http.post('login',this.formdata)
                  console.log(res)
                 const {
                     data,
                     meta:{ msg ,status}
                 }=res.data
                //  登录成功
                 if(status===200){
                    //  保存token 
                    localStorage.setItem('token',data.token)
                    
                    // 跳转home
                     this.$router.push({name:'home'})
                    //  弹出成功
                     this.$message.success(msg);
                 }else{
                    //  弹出失败
                     this.$message.warning(msg)
                 }
            }

        }
    }
</script>
<style scope>
    .login-wrap{
        height: 100%;
        background-color:#324152;

        /* 弹性盒子布局 */
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .login-wrap .login-form{
        width: 400px;
        background-color: #fff;
        border-radius:20px;
        padding:40px;  
    }
    .login-wrap .login-font{
        font-size: 22px;
        font-weight: 800;
        line-height: 80px;
    }
    .login-wrap .login-btn{
        width: 100%;
    }
</style>