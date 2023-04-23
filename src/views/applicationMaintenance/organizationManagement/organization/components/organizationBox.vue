<template>
  <el-dialog
    :title="boxTitle"
    :visible.sync="boxShow"
    width="800px"
    @close="cancel"
  >
    <el-form ref="form" :model="getList" :rules="rules" label-width="100px">

      <el-row>
        <el-col :span="12">
          <el-form-item label="多维组织简称" prop="shortName">
            <el-input placeholder="请输入多维组织简称"  v-model="getList.shortName"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="多维组织全称" prop="fullName">
            <el-input placeholder="请输入多维组织全称" v-model="getList.fullName"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
         <el-col :span="12">
          <el-form-item label="上级组织机构" prop="parentName">
            <el-input placeholder="请输入上级组织机构" v-model="getList.parentName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属行政区划" prop="regionalismName">
            <el-input placeholder="请输入所属行政区划" v-model="getList.regionalismName"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="创建时间" prop="count">
            <el-input placeholder="请输入创建时间" v-model="getList.count" />
          </el-form-item>
        </el-col>
               <el-col :span="12">
          <el-form-item label="显示排序" prop="sort">
            <el-input placeholder="请输入显示排序" v-model="getList.sort"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
         <el-col :span="12">
          <el-form-item label="多维组织状态" prop="status">
            <el-input placeholder="请输入多维组织状态" v-model="getList.status"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="系统角色" prop="role">
            <el-input placeholder="请输入系统角色" v-model="getList.role"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>

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
    getList:{},
    boxTitle: {
      type: String,
      default: "",
    },
    // boxShow: {
    //   type: Boolean,
    //   default: false,
    // },
    boxShow:false,
  },

  data() {

    return {
      addForm: {},
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
    cancel() {
      this.$emit("cancel");
    },

    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        // 这里写错了  这里就没有row  只有list  row是上个页面传过来的  昨天说了  这个页面list是用来接受row的
        if (this.getList.id != null) {
          determine(this.getList).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.boxShow = false;
            this.$emit('remoteData');
          });
        }
        // 现在修改可以了  剩下的 就是刷新列表  你现在这歌是子组件  就没有getuser方法  这方法在副组件写着呢  所以没有办法刷新
        // 添加的提交  
        add(this.getList).then((response) => {
          this.$modal.msgSuccess("新增成功");
          this.boxShow = false;
          // this.getUser();
            this.$emit('remoteData');
        });
      });
    },
  },
  
};
</script>

<style></style>
