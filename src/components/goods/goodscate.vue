<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <!-- 添加分类 -->
    <el-button type="danger" @click="addGoodsCate">添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="goodsSortList" stripe style="width: 100%">
      
      <!-- 表格树状图 -->
      <el-tree-grid
        prop='cat_name'
        label='分类名称'
        treeKey='cat_id'
        parentKey='cat_pid'
        levelKey='cat_level'
        childKey='children'
        folderIcon
      >

      </el-tree-grid>
      <el-table-column prop="cat_level" label="级别" width="180">
           <template slot-scope="scope">
                <span v-if="scope.row.cat_level==0">一级</span>
                <span v-if="scope.row.cat_level==1">二级</span>
                <span v-if="scope.row.cat_level==2">三级</span>
           </template>
      </el-table-column>
      <el-table-column prop="name" label="是否有效" width="180">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_deleted==false">有效</span>
                <span v-if="scope.row.cat_deleted==true">无效</span>
            
           </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
            <template slot-scope="scope">            
                <el-button type="primary"  size='mini' plain icon="el-icon-edit" @click="edit(scope.row)" circle></el-button>
                <el-button type="danger"  size='mini' plain icon="el-icon-delete" @click="del(scope.row.id)" circle></el-button>
            </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[4,6,8,10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>


    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleADD">
        <el-form :model="form">
            <el-form-item label="商品名称" label-width="100px">
                <el-input v-model="form.cat_name" auto-complete="off"></el-input>
            </el-form-item>
          
            <!-- // 级联选择器绑定的数据 -->
            <el-form-item  label="商品分类" label-width="100px">                
                <el-cascader
                expand-trigger="hover"
                :show-all-levels='true'
                change-on-select
                :options="options"
                :props='defaultProp'
                v-model="selectedOptions2"
                clearable
                @change="handleChange">
                </el-cascader>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleADD">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </div>
    </el-dialog>

      


  </el-card>
</template>
<script>
var ElTreeGrid= require('element-tree-grid')
export default {
  data() {
    return {
      //  表格数据
      goodsSortList:[],//数据数组
      pagesize: 6,  //每页几行
      total: -1, //总条数
      pagenum: 1, //当前页数
     //  添加分类
      dialogFormVisibleADD:false ,
      
      form:{
        cat_pid:-1,	      //分类父 ID	不能为空
        cat_name:""	,     //分类名称	不能为空
        cat_level:-1      //分类层级	不能为空
      },

      selectedOptions2:[], //级联默认选择值
      options:[] ,          //级联的所以数据
      defaultProp:{         
            label:'cat_name', //内容
            value:'cat_id',    //id
            chilrdren:'children'  //子分组
      },
    }
  },
  components:{
      ElTreeGrid
  },
  created() {
    this.goodsSort();
  },
  methods: {
    // 添加分类-发送请求
    async addCate(){ 
        if(this.selectedOptions2.length===0){
            this.form.cat_pid=0;
            this.form.cat_level=0;
        }else if(this.selectedOptions2.length===1){
            this.form.cat_pid=this.selectedOptions2[0]
            this.form.cat_level=1;
        }else if(this.selectedOptions2.length===2){
            this.form.cat_pid=this.selectedOptions2[1];
            this.form.cat_level=2;
        }
        const res= await this.$http.post(`categories`,this.form)
        this.form={}
        this.goodsSort();
        this.dialogFormVisibleADD=false;
    },
    handleChange(){},
    
    //   添加分类   显示对话框
    async addGoodsCate(){
        const res = await this.$http.get(`categories?type=2`);
        this.options=res.data.data
        this.dialogFormVisibleADD=true;
    },

    //   表格数据
    async goodsSort() {
      const res = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      console.log(res)
      this.goodsSortList = res.data.data.result;
      this.total= res.data.data.total
    },

    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.goodsSort();
    },

    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val;

       this.goodsSort();
    }
  }
};
</script>