<template>
  <el-dialog
    :title="boxTitle"
    :visible.sync="boxShow"
    width="800px"
    @close="cancel"
    append-to-body
  >
    <el-form ref="form" :model="list" :rules="rules" label-width="130px" >
      <el-row>

        <el-col :span="12">
          <el-form-item label="上级组织机构" prop="parentName" >
            <!-- <el-input placeholder="请输入上级组织机构" v-model="list.parentName" />baocun -->
            <el-select
              v-model="list.parentName"
              placeholder="请选择所属组织机构"
              clearable
              @change="changedata"
            >

              <el-option
                :key="index"
                :label="item.label"
                :value="item.value"
                v-for="(item,index) in dataSuperior"
                

              />
            </el-select>
          </el-form-item>
        </el-col>

                <el-col :span="12">
          <el-form-item label="机构组织简称" prop="shortName">
            <el-input
              placeholder="请输入机构组织全称"
              v-model="list.shortName"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="机构组织全称" prop="fullName">
            <el-input
              placeholder="请输入机构组织简称"
              v-model="list.fullName"
            />
          </el-form-item>
        </el-col>



        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input
              placeholder="请输入联系电话"
              v-model="list.phone"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所属行政区划" prop="name"   >
            <el-select
              v-model="list.name"
              placeholder="请选择所属组织机构"
              clearable

            >

              <el-option
                :key="index"
                :label="item.label"
                :value="item.value"
                v-for="(item,index) in secOptions"
              />
            </el-select>

          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="显示排序" prop="categoryName">
            <el-input
              placeholder="请输入显示排序"
              v-model="list.categoryName"
            />
          </el-form-item>
          
        </el-col>

        <!-- <el-col :span="12">
          <el-form-item label="组织机构状态" prop="creditCode">
            <el-input
              placeholder="请输入组织机构状态"
              v-model="list.creditCode"
            />
          </el-form-item>
        </el-col> -->

                <el-col :span="12">
          <el-form-item label="组织机构状态" prop="creditCode">
             <el-select
              v-model="list.creditCode"
              placeholder="请选择组织机构状态"
              clearable
            >
              <el-option :key="0" label="正常" :value="0" />
              <el-option :key="1" label="停用" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>

  </el-dialog>
  
</template>

<script>
import { determine } from "../api/index";
import { add } from "../api/index";
import { regionalization } from "../api/index";




export default {
  props: {
    list: {},

    boxTitle: {
      type: String,
      default: "",
    },
    dataSuperior:{
      type:Array,
      // default: "",

    },
    options:{
      type:Array
    },
    // boxShow: {
    //   type: Boolean,  baocun
    //   default: false,
    // },
    boxShow: false,
  },
  data() {
    return {
      //上级组织机构数组
      // dataSuperior:[],

      form: {
        // parentName:"",
        // name:"",
        // shortName:"",
      },

      // 表单校验
      rules: {
        parentName: [
          { required: true, message: "上级机构不能为空", trigger: "blur" },
        ],
        fullName: [
          { required: true, message: "机构全称不能为空", trigger: "blur" },
        ],
        shortName: [
          { required: true, message: "机构简称不能为空", trigger: "blur" },
        ],
        regionalismName: [
          { required: true, message: "所属行政区划不能为空", trigger: "blur" },
        ],
        classifyName: [
          { required: true, message: "机构分类不能为空", trigger: "blur" },
        ],
        categoryName: [
          { required: true, message: "机构类别不能为空", trigger: "blur" },
        ],
        creditCode: [
          {
            required: true,
            message: "统一社会信用代码不能为空",
            trigger: "blur",
          },
        ],
        sort: [
          { required: true, message: "显示排序不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "机构状态不能为空", trigger: "blur" },
        ],
        role: [
          { required: true, message: "系统角色不能为空", trigger: "blur" },
        ],
      },

      rules: {},
      secOptions:[]
    };
  },
  methods: {
    // submitForm(form) {
    //   this.$refs[form].validate((valid) => {
    //     if (valid) {
    //       alert("submit!");
    //       return
    //     } else {
    //       console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // },

    /** 表单重置 */
    reset() {
      console.log(111111111);
      this.$refs.form.resetFields();
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        // 这里写错了  这里就没有row  只有list  row是上个页面传过来的  昨天说了  这个页面list是用来接受row的
        if (this.list.id != null) {
          determine(this.list).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.boxShow = false;
            this.$emit("remoteData");
            this.reset();
          });
        }
        // 现在修改可以了  剩下的 就是刷新列表  你现在这歌是子组件  就没有getuser方法  这方法在副组件写着呢  所以没有办法刷新
        // 添加的提交
        add(this.list).then((response) => {
          this.$modal.msgSuccess("新增成功");
          this.boxShow = false;
          // this.getUser();
          this.$emit("remoteData");
          // this.list=""
          this.reset();
        });
      });
    },

    cancel() {
      this.reset();
      this.$emit("cancel");
      //this.reset();
    },
// regionalism_id
// regionalismId
    changedata(val) {
      console.log(this.options,"this.options")
      console.log(val,"val");
      let id = '';
      for(let i = 0;i<this.options.length;i++) {
        if(val == this.options[i].parentId) {
          id = this.options[i].regionalismId;
        }
      }
  
      regionalization({id}).then((response) =>{
        console.log(response,"121212121");
        let arr = [];
        for(let i = 0;i<response.data.length;i++) {
          arr.push({
            label:response.data[i].name,
            value:response.data[i].id
          });
        }
        this.secOptions = [].concat(arr);
        console.log(this.secOptions,"this.secOptions")
        // kan xinxi
      })

    },

    // changedata(val) {
    //   console.log(this.options,"this.options")
    //   console.log(val,"val");
    //   let level = '';
    //   for(let i = 0;i<this.options.length;i++) {
    //     if(val == this.options[i].parentId) {
    //       level = this.options[i].level;
    //     }
    //   }
    //   regionalization({id:level}).then((response) =>{
    //     console.log(response,"121212121");
    //     let arr = [];
    //     for(let i = 0;i<response.data.length;i++) {
    //       arr.push({
    //         label:response.data[i].name,
    //         value:response.data[i].id
    //       });
    //     }
    //     this.secOptions = [].concat(arr);
    //     console.log(this.secOptions,"this.secOptions")
    //     // kan xinxi
    //   })

    // }


  },

  created() {
      // this.$emit("superiorOrganization")

  },
};
</script>

<style></style>
