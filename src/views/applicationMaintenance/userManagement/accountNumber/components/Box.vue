<template>

  <el-dialog
    :title="boxTitle"
    :visible.sync="boxShow"
    width="800px"
    @close="cancel"
  >
    <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">

      <el-row>

        <el-col :span="12">
          <el-form-item label="登录账号" prop="name">
            <el-input placeholder="请输入登录账号" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名" prop="username">
            <el-input placeholder="请输入姓名" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机号" prop="username">
            <el-input placeholder="请输入手机号" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="账号类型" prop="sex">
            <el-select placeholder="请选择" clearable style="width: 100%">
              <el-option :key="0" label="组织账号" :value="0" />
              <el-option :key="1" label="人员账号" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="账号系统" prop="sex">
            <el-select placeholder="请选择" clearable style="width: 100%">
              <el-option :key="0" label="内部系统" :value="0" />
              <el-option :key="1" label="外部注册人员" :value="1" />
              <el-option :key="1" label="外部系统" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="账号状态" prop="username">
            <el-input placeholder="请输入账号状态" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所属行政区划" prop="username">
            <el-input placeholder="请输入所属行政区划"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所属机构" prop="username">
            <el-input placeholder="请输入所属机构" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="职务" prop="sex">
            <el-select placeholder="请选择职务" clearable style="width: 100%">
              <el-option :key="0" label="系统字典管理" :value="0" />
              <el-option :key="1" label="加入选项" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="账号有效期" prop="username">
            <el-input placeholder="请输入账号有效期" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="系统角色" prop="username">
            <el-input placeholder="请输入系统角色" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="身份证号" prop="username">
            <el-input placeholder="请输入身份证号" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="性别" prop="username">
            <el-input placeholder="请输入性别" />
          </el-form-item>
        </el-col>

      </el-row>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>
export default {
  props: {
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style></style>
