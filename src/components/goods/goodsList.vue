<template>
    <el-card>
        <!-- 面包屑 -->
        <my-bread level1='商品管理' level2='商品列表'></my-bread>
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
                    <el-button type="success" 
                     @click="$router.push({name:'goodsadd'})"
                    >添加用户</el-button>`
            </el-col>
        </el-row>
            <!-- 表格 -->
        <el-table
            :data="goodslist"
             style="width: 100%">
            <el-table-column type="index" label="#" width="100"> </el-table-column>
            <el-table-column prop="goods_name" label="商品姓名" width="250"> </el-table-column>
            <el-table-column prop="goods_price" label="商品价格" width="130"></el-table-column>
            <el-table-column prop="goods_weight" label="商品重量" width="130"></el-table-column>
            <el-table-column prop="goods_number" label="商品数量" width="130"></el-table-column>
            <el-table-column prop="add_time" label="创建时间">
                <!-- 如果单元格内显示的内容不是字符串（文本），
                    需要给被显示的内容外层包裹一个template
                 -->
                 <!-- template内部要用数据 设置slot-scope属性
                     该属性的值是要用数据create_time的数据源userlist
                  -->
                  <!-- slot-scope的值userlist 其实就是el-table 绑定的数据userlist
                      userlist.row ->数组中的每个对象
                   -->
                   <template slot-scope="goodslist">
                       {{goodslist.row.create_time|fmtdate}}
                   </template> 
            </el-table-column>
            <el-table-column  label="操作">
                   <template slot-scope="scope">            
                        <el-button type="primary"  size='mini' plain icon="el-icon-edit" @click="editGoodsbtn(scope.row)" circle></el-button>
                        <el-button type="danger"  size='mini' plain icon="el-icon-delete" @click="delGoodbtn(scope.row)" circle></el-button>
                   </template>
            </el-table-column>

        </el-table>  
        <!-- 分页 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[4, 6, 8,10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        
        </el-pagination>

        <!-- 编辑 -->
        <el-dialog title="更改商品" :visible.sync="dialogFormVisibleEditGoods">
            <el-form :model="form">
                <el-form-item label="商品名称" label-width="100px">
                    <el-input v-model="form.goods_name" auto-complete="off"></el-input>
                </el-form-item>
               <el-form-item label="商品价格" label-width="100px">
                    <el-input v-model="form.goods_price" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" label-width="100px">
                    <el-input v-model="form.goods_weight" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label="商品数量" label-width="100px">
                    <el-input v-model="form.goods_number" auto-complete="off"></el-input>
                </el-form-item>
               <!-- // 级联选择器绑定的数据 -->
                <el-form-item  label="商品分类" label-width="100px">                
                    <el-cascader
                    expand-trigger="hover"
                    :show-all-levels="false"
                    :options="options"
                    :props='defaultProp'
                    v-model="selectedOptions2"
                    @change="handleChange">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="EditGoodsN">取 消</el-button>
                <el-button type="primary" @click="EditGoods">确 定</el-button>
            </div>
        </el-dialog>

    </el-card>
</template>
<script>
    export default {
         data(){
            return{
                query:'', 
                goodslist:[],
                // 当前页码为1
                pagenum:1,
                // 每页的条数
                pagesize:6,
                //总条目数
                total:-1,

                // 表单
               dialogFormVisibleEditGoods:false,
               form:{
                  goods_name:'',
                  goods_price:'',
                  goods_weight:'',
                  goods_number:"",
                  cat_id:''
               },
               //商品id
               goodslistId:'',

                // 级联选择器绑定的数据
                options:[],           //可选项数据源，键名可通过 props 属性配置  
                selectedOptions2:[1,3,6],  //级联选择器默认数据的值
                defaultProp:{         
                    label:'cat_name', //内容
                    value:'cat_id',    //id
                    chilrdren:'children'  //子分组
                },
            }
        },
        methods:{
            // 级联选择器@change触发的方法
            handleChange(){
            },
           
            // 表格列表
            async getGoodsList(){
                const res = await  this.$http.get(`goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)

                const{meta:{status,msg},data} = res.data
                 if(status===200){
                     this.$message.success(msg);
                    //  总条数
                     this.total=res.data.data.total
                    //  商品列表
                     this.goodslist=res.data.data.goods 
                      
                 }else{
                     this.$message.warning(msg)
                 }
                //  console.log(res )
              
            },
            // 每页条数
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pagenum=1,
                this.pagesize=val,
                this.getGoodsList()
            },
            // 当前页数
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.pagenum=val
                this.getGoodsList()
            },
            // 搜索
            search(){
               this.getGoodsList()
            },
            // 清空搜索框
            loadUserList(){   
               this.getGoodsList()
            },
            // 删除商品
            async delGoodbtn(goodslist){
               
                const res = await this.$http.delete(`goods/${goodslist.goods_id}`)
                    // console.log(res)
                const{meta:{status,msg},data}=res.data
                if(status===200){
                    this.$message.success(msg)
                    this.getGoodsList()
                }else{
                    this.$message.warning(msg)
                    this.getGoodsList()
                }
            },
            // 编辑表单显示
            async editGoodsbtn(goodslist){

                // 将商品id储存起来
                this.goodslistId=goodslist.goods_id
      
                // 后台的的数据给form
                this.form = goodslist

                  // 获取三级分类的信息
                const res = await this.$http.get(`categories?type=3`)
                this.options = res.data.data
         

                this.dialogFormVisibleEditGoods=true
            },
             // 编辑表单确定
            async EditGoods(){
                // 对分类数据进行处理
                this.form.goods_cat=this.selectedOptions2.join(',')


                const res = await this.$http.put(`goods/${this.goodslistId}`,this.form)
              
                const{meta:{status,msg},data}=res.data
                this.dialogFormVisibleEditGoods=false
                if(status==200){
                     
                
                    this.$message.success('修改成功')
                    this.getGoodsList()
                }else{
                   
                     this.$message.warning(msg)
                     this.getGoodsList()

                }
            },
            EditGoodsN(){
                this.getGoodsList()
                this.dialogFormVisibleEditGoods=false
            },

        },
        created(){   
            this.getGoodsList()
        }

    }
</script>
<style scope>

   .inputSearch{
        width: 300px;
   }
   .searchRow{
       margin:20px 0; 
   }
</style>