<template>
  <div>


    <el-form ref="form" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="user.nickname" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="user.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="身份证号" prop="certNo">
        <el-input v-model="user.certNo" maxlength="18" />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="user.mobile" maxlength="11"  :disabled="true"/>
      </el-form-item>
      <!--    <el-form-item label="验证码" prop="code" v-if="codeShow">-->
      <!--      <div style="display: flex">-->
      <!--      <el-input-->
      <!--        v-model="user.code"-->
      <!--        auto-complete="off"-->
      <!--        placeholder="验证码"-->
      <!--        style="width: 63%"-->
      <!--      >-->
      <!--        <svg-icon-->
      <!--          slot="prefix"-->
      <!--          icon-class="validCode"-->
      <!--          class="el-input__icon input-icon"-->
      <!--        />-->
      <!--      </el-input>-->
      <!--        <el-button type="primary" style="margin-left: 10px" size="mini" @click="getCode">发送短信</el-button>-->
      <!--      </div>-->
      <!--    </el-form-item>-->
      <!--    <el-form-item label="性别">-->
      <!--      <el-radio-group v-model="user.sex">-->
      <!--        <el-radio :label="1">男</el-radio>-->
      <!--        <el-radio :label="2">女</el-radio>-->
      <!--      </el-radio-group>-->
      <!--    </el-form-item>-->
      <el-form-item>
        <el-button type="primary" size="mini" @click="submit">保存</el-button>
        <el-button type="danger" size="mini" @click="close">关闭</el-button>
        <el-button type="danger" size="mini" @click="mobileDialogVisible = true">更换手机号码</el-button>
      </el-form-item>
    </el-form>

    <!--  手机号码更改弹窗-->
    <el-dialog

      title="修改手机号码"
      :show-close="false"
      :visible.sync="mobileDialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="mobileDialogObj" :rules="dialogRule" label-width="80px" ref="mobileDialog">
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="mobileDialogObj.mobile" maxlength="11"  clearable />
        </el-form-item>
        <el-form-item label="验证码" prop="code" >
          <div style="display: flex">
            <el-input
              v-model="mobileDialogObj.code"
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
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="mobileDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="sendSmsFn">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateUserProfile,sendSmsCode,sendSmsApi } from "@/api/system/user";
import Cookies from "js-cookie";
export default {
  props: {
    user: {
      type: Object
    }
  },
  // watch:{
  //   'user.mobile':{
  //     handler(){
  //       if(Cookies.get('mobile') != this.user.mobile){
  //         this.codeShow = true
  //       } else {
  //         this.codeShow = false
  //       }
  //     }
  //   }
  // },
  data() {
    // 身份证验证
    var validatorIdCard = (rule, value, callback) => {
      // 地区
      var aCity={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
        21:"辽宁",22:"吉林",23:"黑龙江",
        31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
        41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",
        51:"四川",52:"贵州",53:"云南",54:"西藏",
        61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",
        71:"台湾",81:"香港",82:"澳门",91:"国外"};
      // 验证长度
      if(!/^\d{17}(\d|x)$/i.test(value)){
        callback(new Error('您输入的身份证号长度或格式错误，请输入正确的身份证号'));
        return;
      }
      // 验证前两位是否为省份代码
      value=value.replace(/x$/i,"a");
      if(aCity[parseInt(value.substr(0,2))]==null){
        callback(new Error('您输入的身份证号长度或格式错误，请输入正确的身份证号'));
        return;
      }
      // 身份证上的出生年月校验
      var sBirthday=value.substr(6,4)+"-"+Number(value.substr(10,2))+"-"+Number(value.substr(12,2));
      var d=new Date(sBirthday.replace(/-/g,"/")) ;
      if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
        callback(new Error('您输入的身份证号不合法，请输入正确的身份证号'));
        return;
      }
      // 身份证校验位判断
      var iSum=0 ;
      for(var i=17;i>=0;i--) {
        iSum += (Math.pow(2,i) % 11) * parseInt(value.charAt(17 - i),11) ;
      }
      if(iSum%11!=1){
        callback(new Error('您输入的身份证号不合法，请输入正确的身份证号'));
        return;
      }
      callback()
    };
    return {
      mobileDialogObj:{
        code:'',
        mobile:'',
      },

      mobileDialogVisible:false,
      codeShow: false,
      // 表单校验
      rules: {
        nickname: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        sex:[{ required: false, message: '请选择性别', }],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        // certNo: [
        //   { required: true, validator: validatorIdCard, trigger: 'blur' },
        // ],
        // code: [
        //   { required: true, message: "验证码不能为空", trigger: 'blur' },
        // ],
        mobile: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      dialogRule: {

        // certNo: [
        //   { required: true, validator: validatorIdCard, trigger: 'blur' },
        // ],
        // code: [
        //   { required: true, message: "验证码不能为空", trigger: 'blur' },
        // ],
        mobile: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      oldMobile:''
    };
  },
  created() {
    this.oldMobile = this.user.mobile
  },
  methods: {
    async sendSmsFn(){
      await this.$refs.mobileDialog.validate((valid)=>{
        if(valid){
          sendSmsApi(this.mobileDialogObj).then((res)=>{
              console.log('验证码返回结果',res)
              console.log('res.data.result',res.data.result)
              if(res.data.result){
                console.log(1111)
                this.$modal.msgSuccess('修改成功请点击保存按钮')
                this.$emit('setUserValue',res)
                // user.mobile = res.data.mobile
                this.mobileDialogVisible = false
              }
            }
          )
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            console.log('response保存后的',response)
            this.$modal.msgSuccess("修改成功");
            this.$emit('getUser')
          });
        }
      });
    },
    close() {
      this.$tab.closePage();
    },
    getCode(){
      if(this.mobileDialogObj.mobile){
        let param = {
          mobile: this.mobileDialogObj.mobile,
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
    }
  },
};
</script>
