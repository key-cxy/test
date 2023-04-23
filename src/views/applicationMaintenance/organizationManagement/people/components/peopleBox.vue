<template>
  <el-dialog
    :title="boxTitle"
    :visible.sync="boxShow"
    width="800px"
    @close="cancel"
  >
    <el-form ref="form" :model="list" :rules="rules" label-width="80px">

      <el-row>
        <el-col :span="12">
          <el-form-item label="人员姓名" prop="name">
            <el-input placeholder="请输入人员姓名" v-model="list.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-input placeholder="请输入性别" v-model="list.sex"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号" prop="mobile">
            <el-input placeholder="请输入手机号" v-model="list.mobile"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="cardNo">
            <el-input placeholder="请输入身份证号" v-model="list.cardNo"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <!-- <el-col :span="12">
          <el-form-item label="所属机构" prop="sex">
            <el-select
              placeholder="请选择所属机构"
              clearable
              style="width: 100%"
            >
              <el-option :key="0" label="男" :value="0" />
              <el-option :key="1" label="女" :value="1" />
            </el-select>
          </el-form-item>
        </el-col> -->
                <el-col :span="12">
          <el-form-item label="所属机构" prop="organizationName">
            <el-input placeholder="请输入所属机构" v-model="list.organizationName" />
          </el-form-item>
        </el-col>
                 <el-col :span="12">
          <el-form-item label="职务" prop="postName">
            <el-input placeholder="请输入职务" v-model="list.postName" />

          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
                <el-col :span="12">
          <el-form-item label="显示排序" prop="sort">
            <el-input placeholder="请输入显示排序" v-model="list.sort"/>
          </el-form-item>
        </el-col>
                <el-col :span="12">
          <el-form-item label="人员状态" prop="status">
            <el-input placeholder="请输入人员状态" v-model="list.status"/>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
                <el-col :span="12">
          <el-form-item label="角色" prop="role">
            <el-input placeholder="请输入角色" v-model="list.role"/>
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
    list:{},
    boxTitle: {
      type: String,
      default: "",
    },
    boxShow: {
      type: Boolean,
      default: false,
    },
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
            this.$emit('remoteData');
          });
        }
        // 现在修改可以了  剩下的 就是刷新列表  你现在这歌是子组件  就没有getuser方法  这方法在副组件写着呢  所以没有办法刷新
        // 添加的提交  
        add(this.list).then((response) => {
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
