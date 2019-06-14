<template>
  <el-card>
        <!-- 面包屑 -->
        <my-bread level1="商品管理" level2="商品列表"></my-bread>
        <!-- 警告框 -->
        <el-alert title="成功提示的文案" type="success"></el-alert>
        <!-- 级联 -->
        <el-form label-position="left" label-width="80px"  style="margin-top:10px">
            <!-- // 级联选择器绑定的数据 -->
            <el-form-item  label="商品分类">                
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
        <!-- tabs -->
        <el-tabs v-model="active" type="card" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="1">
                <!-- 按钮 -->
                <el-button type='danger'>设置动态参数</el-button>
                <!-- 表格 -->
                <el-table
                :data="arrDyarams"
                style="width: 100%">
                    <el-table-column
                    type="expand"
                    label="#"
                    width="80">
                        <template slot-scope="scope">
                                <el-tag
                                :key="tag"
                                v-for="tag in scope.row.attr_vals"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(scope.row,tag)">
                                {{tag}}
                                </el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="inputVisible"
                                v-model="inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="attr_name"
                    label="属性名称"
                    width="100">

                    </el-table-column>
                    <el-table-column
                    label="操作">
                          <el-button type="primary"  size='mini' plain icon="el-icon-edit" @click="edit(scope.row)" circle></el-button>
                          <el-button type="danger"  size='mini' plain icon="el-icon-delete" @click="del(scope.row.id)" circle></el-button>
                    </el-table-column>
                </el-table>

            </el-tab-pane>
            <el-tab-pane label="静态参数" name="2">
                 <!-- 按钮 -->
                <el-button type='danger'>设置静态参数</el-button>
                <!-- 表格 -->
                <el-table
                :data="arrStaticparams"
                style="width: 100%">
                    <el-table-column
                    type="index"
                    label="#"
                    width="80">
                    </el-table-column>
                    <el-table-column
                    prop="attr_name"
                    label="属性名称"
                    width="200">

                    </el-table-column>
                    <el-table-column
                    prop="attr_name"
                    label="属性值"
                    width="200">

                    </el-table-column>
                    <el-table-column
                    label="操作">
                          <el-button type="primary"  size='mini' plain icon="el-icon-edit" @click="edit(scope.row)" circle></el-button>
                          <el-button type="danger"  size='mini' plain icon="el-icon-delete" @click="del(scope.row.id)" circle></el-button>
                    </el-table-column>
                </el-table>

            </el-tab-pane>
            
        </el-tabs>

  </el-card>
</template>
<script>
export default {
    data(){
        return{
            // 级联选择器绑定的数据
            options:[],           //可选项数据源，键名可通过 props 属性配置  
            selectedOptions2:[],  //级联选择器默认数据的值
            defaultProp:{         
                label:'cat_name', //内容
                value:'cat_id',    //id
                chilrdren:'children'  //子分组
            },
            // tabs
            arrDyarams:[], //商品参数 动态后台的数据
            arrStaticparams:[],//商品属性 静态后台的数据
            active:"1",
            // 可移除标签
             inputVisible: false,
             inputValue: ''

        }
    },
    
    methods:{
            // 点击x按钮
            async handleClose(arrDyarams,tag) {
               
               arrDyarams.attr_vals.splice(arrDyarams.attr_vals.indexOf(tag), 1);
                
                let putData= {
                    attr_name:arrDyarams.attr_name,
                    attr_sel:'many',
                    attr_vals:arrDyarams.attr_vals.join(',')
                }
                //  console.log(putData.attr_sel)
                const res = await this.$http.put(`categories/${this.selectedOptions2[2]}/attributes/${arrDyarams.attr_id}`,putData)
                // console.log(res)
            },
            // 点击newTag+按钮;
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            // 回车键 or 失去焦点
            async handleInputConfirm(arrDyarams) {
                let inputValue = this.inputValue;
                if (inputValue) {
                     arrDyarams.attr_vals.push(inputValue);
                    let putData= {
                        attr_name:arrDyarams.attr_name,
                        attr_sel:'many',
                        attr_vals:arrDyarams.attr_vals.join(',')
                    }
                    const res = await this.$http.put(`categories/${this.selectedOptions2[2]}/attributes/${arrDyarams.attr_id}`,putData)
                }
                this.inputVisible = false;
                this.inputValue = '';
            },


          // tabs
            async handleClick(){
               if(this.active==="2"){
                    if(this.selectedOptions2.length===3){
                        //  动态
                         const res = await this.$http.get(`categories/${this.selectedOptions2[2]}/attributes?sel=only`)
                   
                        //动态后台的数据
                        this.arrStaticparams = res.data.data
                        // console.log(this.arrStaticparams)
 
                    }
               }

           },
           // 获取三级分类的信息
            async getGoodCate(){
                const res = await this.$http.get(`categories?type=3`)
                this.options = res.data.data
            },
              // 级联选择器@change触发的方法   商品参数 动态后台的数据
            async handleChange(){
                if(this.selectedOptions2.length===3){
                    //  动态
                    const res = await this.$http.get(`categories/${this.selectedOptions2[2]}/attributes?sel=many`)
            
                    //动态后台的数据
                    this.arrDyarams = res.data.data

                    this.arrDyarams.forEach(item=>{
                        item.attr_vals.length===0?[]:item.attr_vals=item.attr_vals.trim().split(',')
                       
                    })

    
 
                }
              
                
            }
    },
    created(){
        this.getGoodCate()
    }

}
</script>
<style lang="">
    
</style>