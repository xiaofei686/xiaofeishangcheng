<template>
  <el-card>
        <!-- 面包屑 -->
        <my-bread level1="商品管理" level2="商品列表"></my-bread>

        <!-- 添加提示 -->
        <el-alert
        title="添加商品信息"
        type="success"
        center
        show-icon>
        </el-alert>

        <!-- 步骤条 -->
       <el-steps :active="1*active" align-center class="step" finish-status="success">
            <el-step title="基本信息" description=""></el-step>
            <el-step title="商品参数" description=""></el-step>
            <el-step title="商品属性" description=""></el-step>
            <el-step title="商品图片" description=""></el-step>
            <el-step title="商品内容" description=""></el-step>
        </el-steps>
        <!-- 表单 -->
        <el-form  label-position="top" label-width="80px" :model="form" style="height:340px;overflow:auto">
            <el-tabs  @tab-click='tabChange()' v-model='active' tab-position="left">
                <!-- 基本信息 -->
                <el-tab-pane name='0' label="基本信息">
                    <el-form-item label="商品名称">
                        <el-input v-model="form.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="form.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="form.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="form.goods_number"></el-input>
                    </el-form-item>
                     <!-- // 级联选择器绑定的数据 -->
                    <el-form-item  label="商品分类">                
                         <el-cascader
                            expand-trigger="hover"
                            :options="options"
                            :props='defaultProp'
                            v-model="selectedOptions2"
                            @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>

                 <!-- 商品参数 -->
                <el-tab-pane name='1' label="商品参数">
                       <!-- 复选框组 -->
                     <el-form-item  v-for='(item,i) in arrDyarams' :key='i' :label="item.attr_name">
                         <el-checkbox-group   v-model="item.attr_vals">
                            <el-checkbox :label="item2" border v-for="(item2,j) in item.attr_vals" :key='j'></el-checkbox>  
                              
                        </el-checkbox-group>
                     </el-form-item>
                  
                </el-tab-pane>
                <!-- 商品属性 -->
                <el-tab-pane name='2' label="商品属性">
                    <el-form-item :label="item.attr_name" v-for="(item,i) in arrStaticparams" :key="i">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item> 
                </el-tab-pane>
                <!-- 商品图片 -->
                <el-tab-pane name='3' label="商品图片">
                    <el-form-item label="商品名称">
                        <el-upload
                        action="http://47.97.214.102:8888/api/private/v1/upload"
                        :headers="headers"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                </el-tab-pane>
                <!-- 商品内容 -->
                <el-tab-pane name='4' label="商品内容">
                    <el-form-item  style="height:300px">
                        <el-button type="primary" @click="addGoods">添加商品 </el-button>
                        <quill-editor style="height:180px"></quill-editor>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
   </el-card>
</template>
<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    
    import { quillEditor } from 'vue-quill-editor'
 
    export default {
        data(){
            return{
                active:'0',
                // 添加商品的表单数据
                form:{
                        // goods_name	商品名称	不能为空
                        // goods_cat	以为','分割的分类列表	不能为空
                        // goods_price	价格	不能为空
                        // goods_number	数量	不能为空
                        // goods_weight	重量	不能为空
                        // goods_introduce	介绍	可以为空
                        // pics	上传的图片临时路径（对象）	可以为空
                        // attrs	商品的参数（数组）	可以为空
                    goods_name:'',
                    goods_cat:'',
                    goods_price:"",
                    goods_number:"",
                    goods_weight:"",
                    goods_introduce:"",
                    pics:[],
                    attrs:[],  
                },
                // 级联选择器绑定的数据
                options:[],           //可选项数据源，键名可通过 props 属性配置  
                selectedOptions2:[1,3,6],  //级联选择器默认数据的值
                defaultProp:{         
                    label:'cat_name', //内容
                    value:'cat_id',    //id
                    chilrdren:'children'  //子分组
                },
                // 复选框组
                arrDyarams:[], //商品参数后台的数据
                arrStaticparams:[],//商品属性后台的数据
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            }
            
        },
        created(){
            this.getGoodCate()
        },
        components: {
            quillEditor
        },
        methods:{
            // 添加图片
            async addGoods(){
                  // 对分类数据进行处理
                this.form.goods_cat=this.selectedOptions2.join(',')
                
                //商品参数后台的数据进行处理
                let arr1 = this.arrDyarams.map((item)=>{
                    return {attr_id:item.attr_id,attr_value:item.attr_vals}
                })
                //商品属性后台的数据进行处理
                let arr2 = this.arrStaticparams.map((item)=>{
                    return {attr_id:item.attr_id,attr_value:item.attr_vals}
                })

                this.form.attrs=[...arr1,...arr2]

                const res = await this.$http.post(`goods`,this.form)

                this.$router.push({name:'goods'})

               
            },

            // 图片上传时的相关方法
            // file形参里面是当前操作的图片的相关信息
            handlePreview(file){},

            //图片移出时触发
            handleRemove(file){ 
                
                // 从this.form.pics 移除当前x掉的图片
                let Index=this.form.pics.findIndex((item)=>{
                    return item.pic===file.response.data.tmp_path                 
                })
                this.form.pics.splice(Index,1)

            },
            //成功时触发
            handleSuccess(file){    

                this.form.pics.push({
                    pic:file.data.tmp_path   //图片临时上传的路径
                })
            },



            // 点击不同的tab时
            async tabChange(){
                
                if(this.active==='1'){
                    if(this.selectedOptions2.length!==3){
                        this.$message.warning('请先选择商品的三级分类')
                        return
                    }
                    // 获取数据
                    const res = await this.$http.get(`categories/${this.selectedOptions2[2]}/attributes?sel=many`)
                    // console.log(res)
                    //后台的数据数据
                    this.arrDyarams = res.data.data
                    // console.log( this.arrDyarams)
                    this.arrDyarams.forEach(item=>{
                        item.attr_vals.length===0?[]:item.attr_vals=item.attr_vals.trim().split(',')
                       
                    })
                  
                }else if(this.active==='2'){
                    if(this.selectedOptions2.length!==3){
                        this.$message.warning('请先选择商品的三级分类')
                        return
                    }
                    const res = await this.$http.get(`categories/${this.selectedOptions2[2]}/attributes?sel=only`)
                    this.arrStaticparams = res.data.data
                   
                }
            },
            // 获取三级分类的信息
            async getGoodCate(){
                const res = await this.$http.get(`categories?type=3`)
                this.options = res.data.data
            },
              // 级联选择器@change触发的方法
            handleChange(){

            }

        }
    }
</script>
<style >
    .step{
        margin:10px 0px 10px;
    }
</style>