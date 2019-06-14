<template>
    <el-card>
       <my-bread level1='权限管理' level2='角色列表'></my-bread>
       <el-row>
           <el-col class="addrolebtn">
               <el-button type="info" @click="roleAddbtn">添加按钮</el-button>
           </el-col>
       </el-row>
        <el-table
             :data="rolelist"
             style="width: 100%">
             <el-table-column type="expand"  width="60"> 
                  <template slot-scope="scope">
                    
                        <el-row v-for="(item1,i) in scope.row.children" :key='i'>
                            <el-col :span="4">
                                <el-tag closable type='success' @close='roleClear(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                                <i class="el-icon-arrow-right"></i>
                            </el-col>
                            <el-col :span='20'>
                                <el-row v-for="(item2,i) in item1.children" :key="i">
                                    <el-col :span='4' >
                                        <el-tag closable type='info' @close='roleClear(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                                        <i class="el-icon-arrow-right"></i>
                                    </el-col>
                                    <el-col :span='20'>
                                         <el-tag  v-for="(item3,i) in item2.children" :key="i" closable type='warning' @close='roleClear(scope.row,item3.id)'>{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <span v-if="scope.row.children.length===0" >未分配权限</span>
                  </template>
             </el-table-column>

            <el-table-column type="index" label="#" width="100"> </el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="180"> </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
           
            <el-table-column  label="操作">
                   <template slot-scope="scope">            
                        <el-button type="primary"  size='mini' plain icon="el-icon-edit" @click="roleEditbtn(scope.row)" circle></el-button>
                        <el-button type="danger"  size='mini' plain icon="el-icon-delete" @click="roleDelbtn(scope.row.id)" circle></el-button>
                        <el-button type="success" size='mini' plain icon="el-icon-check" @click="rolePower(scope.row)" circle></el-button>
                        <!-- rolepowerbtn -->
                   </template>
            </el-table-column>
        </el-table> 

            <!-- 添加角色 -->
            <el-dialog title="添加角色" :visible.sync="dialogFormRoleleAdd">
                <el-form :model="form">
                    <el-form-item label="角色名称" label-width="100px">
                        <el-input v-model="form.roleName" auto-complete="off"></el-input>
                    </el-form-item>
                     <el-form-item label="角色描述" label-width="100px">
                        <el-input v-model="form.roleDesc" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormRoleleAdd = false">取 消</el-button>
                    <el-button type="primary" @click="RoleleAdd ">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 编辑角色 -->
             <el-dialog title="编辑角色" :visible.sync="dialogFormRoleleEdit">
                <el-form :model="form">
                    <el-form-item label="角色名称" label-width="100px">
                        <el-input v-model="form.roleName" auto-complete="off"></el-input>
                    </el-form-item>
                     <el-form-item label="角色描述" label-width="100px">
                        <el-input v-model="form.roleDesc" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="RoleleEdits">取 消</el-button>
                    <el-button type="primary"  @click="RoleleEdit">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 添加权限 -->
           <el-dialog title="增加权限" :visible.sync="dialogFormRolelePower">
        
                <el-tree
                ref="tree"
                :data="treelist"
                show-checkbox
                node-key="id"
                default-expand-all 
                :default-checked-keys="arrcheck"
                :props="defaultProps">
              
                </el-tree>
        
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormRolelePower = false">取 消</el-button>
                    <el-button type="primary" @click="RolelePower">确 定</el-button>
                </div>
            </el-dialog>

    </el-card>
</template>
<script>
export default {
    data(){
        return{
            // 表格绑定的数据
            rolelist:[],
            // 添加表单显示
            dialogFormRoleleAdd:false,
            form:{
                roleName:'',
                roleDesc:''
            },
            // 编辑表单显示
            dialogFormRoleleEdit:false,
            userId:'',
            // 添加权限表单显示
            dialogFormRolelePower:false,

            defaultProps: {
                children: 'children',
                label: 'authName'
            },

            // 储存从后台获取树状添加权限列表的数据
            treelist:[],

            // 储存每一项权限的id
            arrcheck:[],
            // 角色id 
            currRoleId:-1
        }
    },
    created(){
        this.getRolelist()
    },
    methods:{
        async getRolelist(){
            const res = await this.$http.get(`roles`)
            
            this.rolelist= res.data.data
          
        },
        // 显示添加角色表单
        roleAddbtn(){
              this.dialogFormRoleleAdd=true
        },
        // 确定添加
        async RoleleAdd(){
            // oleName	角色名称	不能为空
            // oleDesc	角色描述	可以为空
            const res = await this.$http.post("roles",this.form)
            this.dialogFormRoleleAdd=false

            //  console.log(res)
            const{meta:{msg,status},data}=res.data
            if(status==201){
                this.$message.success(msg)
                this.getRolelist();
                this.form={}
            }else{
                this.$message.warning(msg)
                this.getRolelist()
            }
        },
        // 删除角色
        async roleDelbtn(userId){
            const res = await this.$http.delete(`roles/${userId}`)
            const {meta:{msg,status}}=res.data
            // console.log(msg)
            if(status===200){
                this.$message.success(msg)
                this.getRolelist()
            }else{
                 this.$message.warning(msg)
                 this.getRolelist()
            }
        },
        // 角色 编辑 显示
        roleEditbtn(user){
             this.userId=user.id
             this.form=user
             this.dialogFormRoleleEdit=true
        },
        //编辑 取消
        RoleleEdits(){
          
            this.dialogFormRoleleEdit=false
            this.getRolelist()
            this.form={}
        },
        //编辑 确定
        async RoleleEdit(){
           
            const res = await this.$http.put(`roles/${this.userId}`,this.form)
            const{meta:{msg,status},data}=res.data

            this.dialogFormRoleleEdit=false
            if(status===200){
                this.$message.success(msg)

                this.getRolelist()
                
            }else{
                this.$message.warning(msg)
                this.getRolelist()
            }
            this.form={}
        },
        // 取消权限
        async roleClear(role,rightId){
            //  roles/:roleId/rights/:rightId
            // :roleId	角色 ID	不能为空携带在url中
            // :rightId	权限 ID	不能为空携带在url中
         
            const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            // console.log(res.data.data)
           role.children=res.data.data
            const{meta:{msg,status},data}=res.data
            if(status==200){
                this.$message.success(msg) 
          
            }else{
                this.$message.success(msg)
            }
        },
        // 显示增加权限 
        async rolePower(role){
            // 把角色id复制给currRoleId
            this.currRoleId=role.id

            // 从后台获取树状列表的数据
            const res = await this.$http.get(`rights/tree`)
            this.treelist = res.data.data

            // 获取每一项权限的id
            let arrtemp2=[]
            role.children.forEach(item1=>{
                arrtemp2.push(item1.id)
                item1.children.forEach(item2=>{
                    arrtemp2.push(item2.id)
                    item2.children.forEach(item3=>{
                        arrtemp2.push(item3.id)
                    })
                })
            })
            this.arrcheck = arrtemp2

            this.dialogFormRolelePower=true
        },
        // 设置权限
        async RolelePower(){
             let arr1= this.$refs.tree.getCheckedKeys()
             let arr2=this.$refs.tree.getHalfCheckedKeys()
             let arr=[...arr1,...arr2]
             
             const res = await this.$http.post (`roles/${this.currRoleId}/rights`,{rids:arr.join(',')})
             this.getRolelist() 
             this.dialogFormRolelePower=false
        }
       

    }
   
}
</script>
<style >
    .addrolebtn{
       margin-top: 20px; 
    }

</style>