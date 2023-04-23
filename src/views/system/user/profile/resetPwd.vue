<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="联系电话" prop="mobile">
      <el-input v-model="mobile" type="number"   :disabled="true"/>
    </el-form-item>
    <el-form-item label="验证码" prop="code" >
      <div style="display: flex">
        <el-input
          v-model="user.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <el-button type="primary" style="margin-left: 10px" size="mini" @click="getCode">发送短信</el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
      <el-button type="danger" size="mini" @click="jump">跳转登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd ,sendSmsCode} from "@/api/system/user";

export default {
  props:['mobile'],
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      test: "1test",
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
        code:undefined,
        mobile:undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(
            response => {
              this.$modal.msgSuccess("修改成功");
            }
          );
        }
      });
    },
    jump(){
      // console.log("this.$router",this.$router)
      this.$router.push({path:'/authorityManagement/subsystem'})
      // this.$router.push('/')
    },
    getCode(){
      if(this.mobile){
        let param = {
          mobile: this.mobile,
          scene: 22
        }
        sendSmsCode(param).then(res =>{
          if(res.code == 0){
            this.$modal.msgSuccess("发送成功");
          } else {
            this.$modal.msgError(res.message)
          }
        })
      }
    },
    close() {
      this.$tab.closePage();
    }
  }
};
</script>
