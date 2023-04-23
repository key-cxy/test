<template>
  <el-dialog
    :title="boxTitle"
    :visible.sync="boxShow"
    width="800px"
    @close="cancel"
    append-to-body

  >
    <el-form ref="form" :model="departmentList" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属机构" prop="parentName">
            <el-input
              placeholder="请输入所属机构"
              v-model="departmentList.parentName"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="科室全称" prop="fullName">
            <el-input
              placeholder="请输入科室全称"
              v-model="departmentList.fullName"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="科室简称" prop="shortName">
            <el-input
              placeholder="请输入科室简称"
              v-model="departmentList.shortName"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="科室分类" prop="classifyName">
            <el-input
              placeholder="请输入科室分类"
              v-model="departmentList.classifyName"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="科室类别" prop="categoryName">
            <el-input
              placeholder="请输入科室类别"
              v-model="departmentList.categoryName"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属行政区划" prop="regionalismName">
            <el-input
              placeholder="请输入所属行政区划"
              v-model="departmentList.regionalismName"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="sort">
            <el-input
              placeholder="请输入显示排序"
              v-model="departmentList.sort"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="科室状态" prop="status">
            <el-input
              placeholder="请输入科室状态"
              v-model="departmentList.status"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="系统角色" prop="role">
            <el-input
              placeholder="请输入系统角色"
              v-model="departmentList.role"
            />
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
 import { add } from"../api/index"

export default {
  props: {
    departmentList:{},
    boxTitle: {
      type: String,
      default: "",
    },
    // boxShow: {
    // //   type: Boolean,
    //   default: false,
    // },
    boxShow:false
  },
  data() {
    return {
      form: {},
      rules: {},
    };
  },
  methods: {


    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       alert("submit!");
    //     } else {
    //       console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // },


        /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        // 这里写错了  这里就没有row  只有list  row是上个页面传过来的  昨天说了  这个页面list是用来接受row的
        if (this.departmentList.id != null) {
          determine(this.departmentList).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.boxShow = false;
            console.log(this.boxShow,"this.boxShow");
            this.$emit('remoteData');
          });
        }
        // 现在修改可以了  剩下的 就是刷新列表  你现在这歌是子组件  就没有getuser方法  这方法在副组件写着呢  所以没有办法刷新
        // 添加的提交  
        add(this.departmentList).then((response) => {
          this.$modal.msgSuccess("新增成功");
          this.boxShow = false;
          // this.getUser();
            this.$emit('remoteData');
        });
      });
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style></style>
