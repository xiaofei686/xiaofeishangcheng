<template>
   <el-card class="box-card">

       <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 搜索 -->
        <el-row class="searchRow">
            <el-col>
                  <el-input placeholder="请输入内容"
                   v-model="query" 
                   class="inputSearch"
                   clearable
                   @clear="loadUserList()"
                   >
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                  </el-input>
                  <el-button type="success" @click="showAddUserDia">添加用户</el-button>`
            </el-col>
        </el-row>

        <!-- 表格 -->
        <el-table
             :data="userlist"
             style="width: 100%">
            <el-table-column type="index" label="#" width="60"> </el-table-column>
            <el-table-column prop="username" label="姓名" width="80"> </el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="create_time " label="创建时间">
                <!-- 如果单元格内显示的内容不是字符串（文本），
                    需要给被显示的内容外层包裹一个template
                 -->
                 <!-- template内部要用数据 设置slot-scope属性
                     该属性的值是要用数据create_time的数据源userlist
                  -->
                  <!-- slot-scope的值userlist 其实就是el-table 绑定的数据userlist
                      userlist.row ->数组中的每个对象
                   -->
                   <template slot-scope="userlist">
                       {{userlist.row.create_time|fmtdate}}
                   </template>
            </el-table-column>
            <el-table-column label="用户状态">
                 <template slot-scope="scope">
                       <el-switch
                            @change='changMsgState(scope.row)'
                            v-model="scope.row.mg_state"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                       </el-switch>  
                 </template>
            </el-table-column>
            <el-table-column  label="操作">
                   <template slot-scope="scope">            
                        <el-button type="primary"  size='mini' plain icon="el-icon-edit" @click="edit(scope.row)" circle></el-button>
                        <el-button type="danger"  size='mini' plain icon="el-icon-delete" @click="del(scope.row.id)" circle></el-button>
                        <el-button type="success" size='mini' plain icon="el-icon-check" @click="role(scope.row)" circle></el-button>
                   </template>
            </el-table-column>
        </el-table> 

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[2, 4, 6, 8]"
            :page-size="6"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
            <el-form :model="form">
                <el-form-item label="用户名" label-width="100px">
                     <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密  码" label-width="100px">
                     <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮  箱" label-width="100px">
                     <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电  话" label-width="100px">
                     <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleEdit">
            <el-form :model="form">
                <el-form-item label="用户名" label-width="100px" >
                     <el-input v-model="form.username" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮  箱" label-width="100px">
                     <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电  话" label-width="100px">
                     <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </div>
        </el-dialog>
   

        <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
            <el-form :model="form">
                <el-form-item label="用户名" label-width="100px">
                    {{currusername}}
                </el-form-item>
                <el-form-item label="角色" label-width="100px">
                <el-select v-model="currRoleId">
                    <el-option label="请选择" :value="-1"></el-option>
                    <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in RoleNames" :key='i'></el-option>
                  
                </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
                <el-button type="primary" @click="setRole ">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>

</template> 
<script> 
    export default {
        data(){
            return{
        
                // 表格绑定的数据
                userlist:[],
                // 分页相关数据
                total:-1,
                query:'',
                pagenum:1,
                pagesize:6,
                // 添加对话框属性
                dialogFormVisibleAdd:false,
                // 编辑对话框属性
                dialogFormVisibleEdit:false,
                // 添加用户的表单数据
                form:{
                    username:'',
                    password:"",
                    email:"",
                    mobile:""
                },
                // 分配用户表单显示
                dialogFormVisibleRole:false,
                currRoleId:-1,
                currUserId:-1,
                currusername:'',
                RoleNames:[]
            }
        },
        
        created(){
            this.getUserList()
        },
        methods:{
            async getUserList(){
               
               //  需要授权的Api，必须在请求头中使用Authorization 字段提供token令牌
               const AUTH_TOKEN=localStorage.getItem('token');
               this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN;

               //  给后台传递参数
               const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
               
               const {meta:{msg,status},data:{users,total}}=res.data
               if(status===200){
                    //  1.给表格数据赋值
                    this.userlist=users
                    //  2.给total 赋值
                    this.total=total
                    //  3.提示
                    this.$message.success(msg)

               }else{
                    // 提示
                    this.$message.warning(msg)

               }
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                  this.pagesize=val
                //   回到第一页
                  this.pagenum=1
                  this.getUserList()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                   this.pagenum=val
                  this.getUserList()
            },
            search(){
               this.getUserList()
            },
            loadUserList(){
               this.getUserList()

            },
            // 添加用户信息
            showAddUserDia(){
                this.form={}
                this.dialogFormVisibleAdd=true
            },
            // 添加用户--显示对话框
            async addUser(){
                // username	用户名	不能为空
                // password	用户密码	不能为空
                // email	邮箱	可以为空
                // mobile	手机号	可以为空
                
                
                 // 2.关闭对话框
                this.dialogFormVisibleAdd= false

                const res = await this.$http.post('users',this.form)
                console.log(res)
                const {meta:{status,msg},data}=res.data
                if(status===201){
                    // 1.提示成功
                    this.$message.success(msg)

                    // 3.更新视图
                    this.getUserList()
                    // 4.清空文本框
                    this.form={}
                }else{
                     this.$message.warning(msg)
                }
             },
            //  删除用户信息
            del(userId) {
                this.$confirm('是否删除用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                     
                    const res = await this.$http.delete(`users/${userId}`)
                     console.log(res)
                    if(res.data.meta.status==200){
                        this.pagenum=1;
                       //更新视图
                        this.getUserList()
                        this.$message({
                            type: 'success',
                            message: res.data.meta.msg
                        });
                    }
                
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            // 编辑用户--显示对话框
            edit(user){
                this.form=user
                this.dialogFormVisibleEdit=true
            },
            // 编辑用户，发送请求
            async editUser(){
                const res =await this.$http.put(`users/${this.form.id}`,this.form)
                this.dialogFormVisibleEdit=false
                this.getUserList()   
            },
            // 修改用户状态接口
            async changMsgState(user){  
                const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
                console.log(res)
            },
            // 分配角色  -显示对话框
            async role(user){
                // console.log(user)
                this.currusername=user.username
                this.currUserId=user.id

                // 获取所有角色信息
                const res1=await this.$http.get(`roles`)
                this.RoleNames=res1.data.data

                // 获取当前用户的角色id
                const res = await this.$http.get(`users/${user.id}`)
                // console.log(res)
                this.currRoleId=res.data.data.rid

                this.dialogFormVisibleRole=true
            },
            async setRole(){

                const res = await this.$http.put(`users/${this.currUserId}/role`,{
                    rid:this.currRoleId
                })
                 this.dialogFormVisibleRole=false
            }
        }
    }
</script>
<style scope>
    .inputSearch{
        width: 300px;
    }
    .searchRow{
        margin-top:20px; 
    }
  
</style>