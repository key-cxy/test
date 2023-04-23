<template>
  <div class="root">
    <div style="width: 100%;height: 100%;max-height: 100vh;">
      <div class="portal">
        <div class="pHeader">
          <Row>
            <Col :span="8">
              <img src="./image/title@2x.png" class="title">
            </Col>
            <Col :span="16">
              <!--                <div class="info">【<span class="back" @click="logout">退出</span>】</div>-->
              <div class="time-wea">
                <div class="item">{{ nowTime }}</div>
                <div class="item">{{ weekTime }}</div>
                <div class="item"><img src="./image/icon.png" class="wea">{{ wea }}</div>
                <div class="item">{{ tem }} ℃</div>
                <div class="item">
                  <span class ='el-icon-menu'></span>
                  <el-select v-model="value" placeholder="请选择" value-key @change="changeData">
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="item" @click="logout">【<span class="back">退出</span>】</div>
              </div>
            </Col>
          </Row>
        </div>
        <div class="pBody">
          <div class="pb-collapses">
            <div class="long collapse-item" :class="{open: index === 0 && openFlag,small: index !==0 && openFlag}" id="collapse_item0">
              <div class="cil-main">
                <div class="cil-header">
                  <div style="text-align: center">
                    <img src="./image/icon_cockpit@2x.png" class="cilh-icon">
                  </div>
                  <div class="cilh-title-area">
                    <div class="divider left"></div>
                    <span class="cilh-title cilh-title-h">驾驶舱</span>
                    <div class="divider right"></div>
                  </div>
                  <div class="cilh-subtitle">Cockpit</div>
                  <button @click="changeOpen(0)">
                    <span v-if="index===-1 && openshow">点击展开</span>
                    <span v-if="index=== 0 && !openshow">点击收起</span>
                    <img src="./image/right.png">
                  </button>
                </div>
                <div class="cil-body">
                  <el-row :gutter="24">
                    <el-col :span="6" v-for="item in list1" class="ant-col">
                      <div class="sub-menu">
                        <div>
                          <img :src="item.iconPath">
                          <!--                            <img src="./portal/icon_流程管理平台@2x.png">-->
                        </div>
                        <p>{{item.name}}</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <div class="long collapse-item" :class="{open: index === 1 && openFlag,small: index !==1 && openFlag}" id="collapse_item1">
              <div class="cil-main">
                <div class="cil-header">
                  <div style="text-align: center">
                    <img src="./image/icon_ApplicationCompartment@2x.png" class="cilh-icon">
                  </div>
                  <div class="cilh-title-area">
                    <div class="divider left"></div>
                    <span class="cilh-title cilh-title-h">应用舱</span>
                    <div class="divider right"></div>
                  </div>
                  <div class="cilh-subtitle">Application compartment</div>
                  <button @click="changeOpen(1)">
                    <span v-if="index===-1 && openshow">点击展开</span>
                    <span v-if="index=== 1 && !openshow">点击收起</span>
                    <img src="./image/right.png">
                  </button>
                </div>
                <div class="cil-body">
                  <el-row :gutter="24">
                    <el-col :span="6" v-for="item in list2" class="ant-col">
                      <div class="sub-menu" @click="toUrl(item)">
                        <div>
                          <img :src="item.iconPath">
                        </div>
                        <p>{{item.name}}</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <div class="long collapse-item " :class="{open: index === 2 && openFlag,small: index !==2 && openFlag}" id="collapse_item2">
              <div class="cil-main">
                <div class="cil-header">
                  <div style="text-align: center">
                    <img src="./image/icon_DataCompartment@2x.png" class="cilh-icon">
                  </div>
                  <div class="cilh-title-area">
                    <div class="divider left"></div>
                    <span class="cilh-title cilh-title-h">数据舱</span>
                    <div class="divider right"></div>
                  </div>
                  <div class="cilh-subtitle">Data Compartment</div>
                  <button @click="changeOpen(2)">
                    <span v-if="index===-1 && openshow">点击展开</span>
                    <span v-if="index=== 2 && !openshow">点击收起</span>
                    <img src="./image/right.png">
                  </button>
                </div>
                <div class="cil-body">
                  <el-row :gutter="24">
                    <el-col :span="6" v-for="item in list3" class="ant-col">
                      <div class="sub-menu">
                        <div>
                          <img :src="item.iconPath">
                          <!--                            <img src="./portal/icon_流程管理平台@2x.png">-->
                        </div>
                        <p>{{item.name}}</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <div class="long collapse-item " :class="{open: index === 3 && openFlag,small: index !==3 && openFlag}" id="collapse_item3">
              <div class="cil-main">
                <div class="cil-header">
                  <div style="text-align: center">
                    <img src="./image/icon_ToolCompartment@2x.png" class="cilh-icon">
                  </div>
                  <div class="cilh-title-area">
                    <div class="divider left"></div>
                    <span class="cilh-title cilh-title-h">工具舱</span>
                    <div class="divider right"></div>
                  </div>
                  <div class="cilh-subtitle">Tool Compartment</div>
                  <button @click="changeOpen(3)">
                    <span v-if="index===-1 && openshow">点击展开</span>
                    <span v-if="index=== 3 && !openshow">点击收起</span>
                    <img src="./image/right.png">
                  </button>
                </div>
                <div class="cil-body">
                  <el-row :gutter="24">
                    <el-col :span="6" v-for="item in list4" class="ant-col">
                      <div class="sub-menu" @click="toUrl(item)">
                        <div>
                          <img :src="item.iconPath">
                        </div>
                        <p>{{item.name}}</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>
          <div class="pb-collapses">
            <div class="flat collapse-item" :class="{open: index1 === 4 && openFlag1,small: index1 !==4 && openFlag1}" id="collapse_item4">
              <div class="cil-main">
                <div class="cil-header">
                  <div class="cilh-left">
                    <img src="./image/icon_TestChamber@2x.png">
                  </div>
                  <div class="cilh-right">
                    <div class="cilh-title-area">
                      <div class="divider left"></div>
                      <span class="cilh-title cilh-title-h">一网统管</span>
                      <div class="divider right"></div>
                    </div>
                    <div class="cilh-subtitle">Test Chamber</div>
                    <button @click="changeOpen1(4)">
                      <span v-if="index1===-1 && openshow1">点击展开</span>
                      <span v-if="index1=== 4 && !openshow1">点击收起</span>
                      <img src="./image/right.png">
                    </button>
                  </div>
                </div>
                <div class="cil-body">
                  <el-row :gutter="24">
                    <el-col :span="12" v-for="item in list5" class="ant-col">
                      <div class="sub-menu">
                        <div>
                          <img :src="item.iconPath">
                        </div>
                        <p>{{item.name}}</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <div class="flat collapse-item" :class="{open: index1 === 5 && openFlag1,small: index1 !==5 && openFlag1}" id="collapse_item5">
              <div class="cil-main">
                <div class="cil-header">
                  <div class="cilh-left">
                    <img src="./image/icon_VideoCenter@2x.png">
                  </div>
                  <div class="cilh-right">
                    <div class="cilh-title-area">
                      <div class="divider left"></div>
                      <span class="cilh-title cilh-title-h">试验舱</span>
                      <div class="divider right"></div>
                    </div>
                    <div class="cilh-subtitle">Video Center</div>
                    <button @click="changeOpen1(5)">
                      <span v-if="index1===-1 && openshow1">点击展开</span>
                      <span v-if="index1=== 5 && !openshow1">点击收起</span>
                      <img src="./image/right.png">
                    </button>
                  </div>
                </div>
                <div class="cil-body">
                  <el-row :gutter="24">
                    <el-col :span="12" v-for="item in list6" class="ant-col">
                      <div class="sub-menu">
                        <div>
                          <img :src="item.iconPath">
                        </div>
                        <p>{{item.name}}</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <div class="flat collapse-item" :class="{open: index1 === 6 && openFlag1,small: index1 !==6 && openFlag1}" id="collapse_item6">
              <div class="cil-main">
                <div class="cil-header">
                  <div class="cilh-left">
                    <img src="./image/icon_SynergyCenter@2x.png">
                  </div>
                  <div class="cilh-right">
                    <div class="cilh-title-area">
                      <div class="divider left"></div>
                      <span class="cilh-title cilh-title-h">协同智理</span>
                      <div class="divider right"></div>
                    </div>
                    <div class="cilh-subtitle">Synergy center</div>
                    <button @click="changeOpen1(6)">
                      <span v-if="index1===-1 && openshow1">点击展开</span>
                      <span v-if="index1=== 6 && !openshow1">点击收起</span>
                      <img src="./image/right.png">
                    </button>
                  </div>
                </div>
                <div class="cil-body">
                  <el-row :gutter="24">
                    <el-col :span="12" v-for="item in list7" class="ant-col">
                      <div class="sub-menu">
                        <div>
                          <img :src="item.iconPath">
                        </div>
                        <p>{{item.name}}</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <el-dialog
        title="修改密码"
        :visible="resetPWD"
        :modal="false"
        @close="close()"
        width="500px"
        center
      >
        <el-form ref="form" :model="user" :rules="rules" label-width="80px">
          <el-form-item label="账号名称" prop="">
            <el-input v-model="user.name" placeholder="" type="text" :disabled="true" />
          </el-form-item>
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" show-password />
          </el-form-item>
          <el-form-item label="手机号码" prop="">
            <el-input v-model="user.mobile" placeholder="" type="text" :disabled="true" />
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
              <el-button type="primary" style="margin-left: 10px" size="mini" @click="getCode">发送短信验证码</el-button>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { subsystemTreeByRole } from "@/api/system/subSystem"
import { encrypt1, decrypt } from '@/libs/encrypt.js'
import { encryptDJLD } from "@/utils/jsencrypt";
import { setSystem } from "@/utils/auth";
import router from '@/router'
import { getToken, setToken } from "@/utils/auth";
import { getPath } from "@/utils/ruoyi";
import store from '../../store'
import {MessageBox} from "element-ui";
import {isRelogin} from "../../utils/requestDJLD";
import { sendSmsCode, updateUserPwd,sendSmsApi } from '@/api/system/user'
import Cookies from "js-cookie";
import{changeSubsystem} from '@/api/doorManage/doorManage'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    //这里存放数据
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      value:'',
      options: [],
      urlList:[],//子系统的路由
      index: -1,
      index1: -1,
      openFlag: false,
      openFlag1: false,
      openshow: true,
      openshow1: true,
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      timer: '', //定义一个定时器
      nowTime: '', // 当前日期时间
      weekTime: '', // 当前日期
      wea: '',
      tem: '',
      ip: '',
      resetPWD:false,
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        code: undefined,
        mobile: undefined,
        confirmPassword: undefined,
        name:undefined
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
    }
  },
  //监听属性 类似于data概念
  computed: {
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    //获得所有子系统数据
    getChangeSubsystem(){
      changeSubsystem().then(res=>{
        if(res && res.code===0){
          console.log("wwwwwww=====>",res.data);
          // let list = res.data
          this.options = res.data
          // this.options= list.map(item=>{
          //   return{
          //     id: item.id,
          //     name:item.name,
          //     url:item.url,
          //     parentSystemId: item.parentSystemId,
          //     iconPath:item.iconPath,
          //     type:item.type
          //   }
          // })

        }
      })
      //  this.urlList= this.options.filter(item=>{
      //     return item.url
      //   })
    },
    //点击子系统下拉框跳转
    changeData(data){
      let obj=  this.options.filter(item=>item.id === data)
      console.log('aaaaaaaaaaaaa===>',obj);
      console.log('aaaaaaaaaaaaa/this',  this.$bus.$emit)
      this.$bus.$emit('title',obj.name)
      // console.log('data',data);
      // this.$router.push(obj[0].url)
      this.toUrl (obj[0])
    },

    getCode(){
      if(this.user.mobile){
        var param = {
          mobile: this.user.mobile,
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
    changeOpen (index) {
      this.openFlag1 = false
      this.openshow1 = true
      this.index1 = -1
      if (this.index === index) {
        this.openFlag = false
        this.openshow = true
        this.index = -1
        return
      } else {
        this.index = index
      }
      if (this.index === -1) {
        this.openFlag = false
        this.openshow = true
      } else {
        this.openFlag = true
        this.openshow = false
      }
    },
    changeOpen1 (index) {
      this.openFlag = false
      this.openshow = true
      this.index = -1
      if (this.index1 === index) {
        this.openFlag1 = false
        this.openshow1 = true
        this.index1 = -1
        return
      } else {
        this.index1 = index
      }
      if (this.index1 === -1) {
        this.openFlag1 = false
        this.openshow1 = true
      } else {
        this.openFlag1 = true
        this.openshow1 = false
      }
    },
    subsystemTreeByRole () {
      subsystemTreeByRole().then(res => {
        if (res.code === 0) {
          res.data.forEach(item => {
            if (item.name === '驾驶舱') {
              this.list1 = item.children
            } else if (item.name === '应用舱') {
              this.list2 = item.children
            } else if (item.name === '数据舱') {
              this.list3 = item.children
            } else if (item.name === '工具舱') {
              this.list4 = item.children
            } else if (item.name === '一网统管') {
              this.list5 = item.children
            } else if (item.name === '试验舱') {
              this.list6 = item.children
            } else if (item.name === '协同智理') {
              this.list7 = item.children
            }
          })
        }
      })
    },
    toUrl (item) {
      console.log('tourl.item',item)

      if (item.type !== 0) {
        console.log('item.type1',item.type,item)
        window.open(item.url, '_blank');
      } else {
        setSystem(encrypt1(item.id.toString()))
        store.dispatch('GetInfo').then(res => {
          this.$store.dispatch("GenerateRoutes",item.id)
            .then((res) => {
              router.addRoutes(res)
              // this.$router.push(item.url)
              let routeUrl = this.$router.resolve({
                path: item.url,
                // query: { id: 96 }
              });
              window.open(routeUrl.href, '_blank');
            })
        })
      }
    },
    async logout () {
      this.$modal.confirm('确定注销并退出系统吗？', '提示').then(() => {
        this.$store.dispatch('LogOut').then(res => {
          // location.href = getPath('/comys');
          console.log(res)
          window.open(res, '_self');
          // console.log('222222')
        })
      }).catch(() => { });
    },
    getTime () {
      this.timer = setInterval(() => {
        let timeDate = new Date()
        let year = timeDate.getFullYear()
        let mounth = timeDate.getMonth() + 1
        let day = timeDate.getDate()
        let hours = timeDate.getHours()
        hours = hours >= 10 ? hours : '0' + hours
        let minutes = timeDate.getMinutes()
        minutes = minutes >= 10 ? minutes : '0' + minutes
        let seconds = timeDate.getSeconds()
        seconds = seconds >= 10 ? seconds : '0' + seconds
        let week = timeDate.getDay()
        let weekArr = [
          '星期日',
          '星期一',
          '星期二',
          '星期三',
          '星期四',
          '星期五',
          '星期六'
        ]

        this.nowTime = `${year}-${mounth}-${day} ${hours}:${minutes}:${seconds}`
        this.weekTime = `${weekArr[week]}`
      }, 1000)
    },
    getWeaAndTem () {
      this.$axios({
        methods: 'get',
        url: 'https://tianqiapi.com/free/day',
        headers: {},
        params: {
          appid: '25944483', // 账号ID
          appsecret: 'dlMY4WTa', // 账号密钥
          // cityid: '101210113', // 城市编号,不要带CN, 以下参数3选1，当前以西湖区举例
          city: null, // 城市名称,不要带市和区
          ip: this.ip, // IP地址
          callback: 0 // jsonp方式
        }
      })
        .then((res) => {
          const date = res.data.date
          const week = res.data.week
          this.dateAndWeek = date + week
          this.wea = res.data.wea
          this.tem = res.data.tem
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getUserIP (onNewIP) {
      let MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
      let pc = new MyPeerConnection({
        iceServers: []
      })
      let noop = () => { }
      let localIPs = {}
      let ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
      let iterateIP = (ip) => {
        if (!localIPs[ip]) onNewIP(ip)
        localIPs[ip] = true
      }
      pc.createDataChannel('')
      pc.createOffer().then((sdp) => {
        sdp.sdp.split('\n').forEach(function (line) {
          if (line.indexOf('candidate') < 0) return
          line.match(ipRegex).forEach(iterateIP)
        })
        pc.setLocalDescription(sdp, noop, noop)
      }).catch((reason) => {c
      })
      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
      }
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword,this.user.code,this.user.mobile).then(
            response => {
              this.$modal.msgSuccess("修改成功");
              this.resetPWD = false
            }
          );
        }
      });
    },
    close() {
      this.init()
    },
    init(){
      this.$axios({
        method: 'get',
        // url: process.env.VUE_APP_BASE_API+'/admin-api/system/user/getUser',
        // url: 'http://10.2.14.169:8080/admin-api/system/user/getUser',
        url: 'http://10.1.141.156:48080/admin-api/system/user/getUser',
        headers: {
          'Authorization': 'Bearer ' + getToken()
        }
      }).then((res) => {

        this.user.name = res.data.data.name
        this.user.mobile = res.data.data.mobile

        console.log('登录状态判断返回的',res)
        Cookies.set("userId", res.data.data.id, {
          expires: 30,
        });
        Cookies.set("mobile", res.data.data.mobile, {
          expires: 30,
        });
        if(res.data.data.pwdStatus == 1){
          MessageBox.confirm('您的密码为默认密码，请修改！', '系统提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            this.resetPWD =true
          }).catch(() => {
            this.resetPWD =true
          });
        } else if(res.data.data.pwdStatus == -1){
          MessageBox.confirm('您的密码已过期，请修改！', '系统提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            this.resetPWD =true
          }).catch(() => {
            this.resetPWD =true
          });
        }
        this.$axios
          .post('/proxy' + '/czslpt/casLoginYgf', { 'token': encryptDJLD(res.data.data.userId) })
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  created () {
    var url = window.location.href; //获取当前url
    var token_url = url.split("?")[1];
    if (token_url) {
      var token = token_url.split("=")[1];
      if (token) {
        setToken(token);
      }
    }
    else {
      window.open(process.env.VUE_APP_DJLD_API + '/cas/login?service=' +
        process.env.VUE_APP_BASE_API + '/admin-api/system/auth/login/ssologin?redirectUrl=' +
        process.env.VUE_APP_SELF_API + '/comys/#/cashome', '_self')
    }
    this.init()
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.getUserIP((ip) => {
      this.ip = ip;
    });
    this.getTime()
    this.getWeaAndTem()
    this.subsystemTreeByRole()
    this.getChangeSubsystem()
  },
  beforeCreate () {
  }, //生命周期 - 创建之前
  beforeMount () {
  }, //生命周期 - 挂载之前
  beforeUpdate () {
  }, //生命周期 - 更新之前
  updated () {
  }, //生命周期 - 更新之后
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  destroyed () {
  }, //生命周期 - 销毁完成
  activated () {
  } //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped lang="less">
.el-select{
  width: 140px;
  padding-left: 10px;
  padding-top: 2px;
}
.el-icon-menu{
  font-size: 30px;
}
.transform(@transform) {
  -webkit-transform: @transform;
  /*为Chrome/Safari*/
  -moz-transform: @transform;
  /*为Firefox*/
  -ms-transform: @transform;
  /*为IE*/
  -o-transform: @transform;
  /*为Opera*/
  transform: @transform;
}

.transition(@transition) {
  -webkit-transition: @transition;
  -moz-transition: @transition;
  -o-transition: @transition;
  transition: @transition;
}

.animation(@animation) {
  -webkit-animation: @animation;
  -moz-animation: @animation;
  animation: @animation;
}

.boxShadow(@shadow) {
  -webkit-box-shadow: @shadow;
  -moz-box-shadow: @shadow;
  box-shadow: @shadow;
}
.root {
  min-width: 1366px;
  min-height: 700px;
  width: 100%;
  height: 100%;
  cursor: default;
  .portal {
    width: 100%;
    height: 100%;
    overflow: auto;
    background: url('./image/bg@2x.png') no-repeat;
    background-size: cover;

    .pHeader {
      .title {
        margin: 0.25rem;
        vertical-align: middle;
        border-style: none;
        width: 90%;
        /*height: 60%;*/
      }
      .info {
        width: 80%;
        height: 100%;
        color: #ffffff;
        font-size: 0.1rem;
        line-height: 1rem;
        text-align: right;
        justify-content: center;
        .back:hover {
          color: #00ddff;
        }
      }
      .time-wea {
        width: 100%;
        position: relative;
        display: flex;
        font-size: 0.12rem;
        font-family: 'DINAlternate-Bold', 'DINAlternate';
        color: #ffffff;
        line-height: 0.1rem;
        text-align: center;
        justify-content: right;
        top: 0.4rem;
        right: 0.5rem;
        .item {
          margin: 0.08rem;
          justify-content: center;
          .wea {
            width: 24px;
            height: 23px;
          }
          .back:hover {
            color: #00ddff;
          }
        }
      }
    }
    .pBody {
      margin: 0 auto;
      max-width: 7.2rem;
      max-height: 3.2rem;
      width: 7.2rem;
      height: 3.2rem;
      .pb-collapses {
        display: flex;
        align-content: space-around;
        justify-content: space-around;
        .collapse-item {
          height: 2.2rem;
          flex: 1 1 0%;
          flex-wrap: wrap;
          margin: 0.05rem;
          border-radius: 0.06rem;
          transition: flex 1s ease 0s;
          &.long {
            flex: 5;
            &.open {
              flex: 29;
              .cil-main {
                width: 100%;
                height: 100%;

                .cil-body {
                  display: block;
                  .animation(fadeInRight 0.2s 0.3s ease both);
                  .animation(fadeInRight 0.2s 0.3s cubic-bezier(0.61, -0.19, 0.7, -0.11) both);

                  .ant-col {
                    margin: 0.05rem auto;

                    .sub-menu {
                      width: 0.53rem;
                      height: 0.53rem;
                      padding: 0.06rem 0 0;

                      &:hover {
                        background: #0038775c;
                      }

                      p {
                        width: 0.45rem;
                        text-align: center;
                        margin: 0.06rem auto 0;
                      }
                    }
                  }
                }
              }
            }

            &.small {
              .cil-main {
                .cil-header {
                  & > div {
                    & > img {
                      width: 0.8rem;
                    }
                  }

                  .cilh-title-area {
                    top: -0.4rem;

                    .cilh-title {
                      display: inline-block;
                      width: 0.15rem;
                    }
                  }
                }
              }
            }
            .cil-main {
              .cil-header {
                flex: 2;
                position: relative;

                .cilh-icon {
                  margin-top: 0.32rem;
                  width: 0.8rem;
                }

                button {
                  bottom: 0.15rem;
                }
              }

              .cil-body {
                padding: 0.1rem 0.15rem;
                flex: 3;
              }
            }
          }
          &#collapse_item0 {
            .cil-main {
              .cil-header {
                border-radius: 0.03rem;
                background: linear-gradient(
                  135deg,
                  rgba(3, 228, 255, 0.86),
                  rgba(52, 129, 255, 0.86)
                );

                &:hover {
                  background: linear-gradient(135deg, #03e4ff, #3481ff);
                }
              }

              .cil-body {
                background: #0071c080;
              }
            }
          }

          &#collapse_item1 {
            .cil-main {
              .cil-header {
                border-radius: 0.03rem;
                background: linear-gradient(
                  135deg,
                  rgba(255, 166, 86, 0.86),
                  rgba(255, 66, 118, 0.86)
                );

                &:hover {
                  background: linear-gradient(
                    135deg,
                    rgba(255, 166, 86, 100%),
                    rgba(255, 66, 118, 100%)
                  );
                }
              }

              .cil-body {
                background: #ca454580;

                /*.ant-col {*/
                /*  .sub-menu {*/
                /*    &:hover {*/
                /*      background: #4403155c;*/
                /*    }*/
                /*  }*/
                /*}*/
              }
            }
          }

          &#collapse_item2 {
            .cil-main {
              .cil-header {
                border-radius: 0.03rem;
                background: linear-gradient(
                  135deg,
                  rgba(54, 241, 111, 0.86),
                  rgba(0, 184, 134, 0.86)
                );

                &:hover {
                  background: linear-gradient(
                    135deg,
                    rgba(54, 241, 111, 100%),
                    rgba(0, 184, 134, 100%)
                  );
                }
              }

              .cil-body {
                background: #009b6580;

                .ant-col {
                  .sub-menu {
                    &:hover {
                      background: #00352a5c;
                    }
                  }
                }
              }
            }
          }

          &#collapse_item3 {
            .cil-main {
              .cil-header {
                border-radius: 0.03rem;
                background: linear-gradient(
                  135deg,
                  rgba(70, 186, 255, 0.86),
                  rgba(74, 143, 255, 0.86)
                );

                &:hover {
                  background: linear-gradient(
                    135deg,
                    rgba(70, 186, 255, 100%),
                    rgba(74, 143, 255, 100%)
                  );
                }
              }

              .cil-body {
                background: #0071c080;
              }
            }
          }
          &.flat {
            height: 1.26rem;
            flex: 1;

            &.open {
              flex: 4;

              .cil-main {
                width: 100%;
                height: 100%;

                .cil-header {
                  .cilh-left {
                    img {
                      margin-left: 0.05rem;
                    }
                  }

                  .cilh-right {
                    // .animation(flatRight1 .1s .3s ease both);
                    .animation(flatRight1 0.1s 0.3s cubic-bezier(0.61, -0.19, 0.7, -0.11)both);
                  }
                }

                .cil-body {
                  display: block;
                  // .animation(fadeInRight .1s .3s ease both);
                  .animation(fadeInRight 0.1s 0.3s cubic-bezier(0.61, -0.19, 0.7, -0.11) both);

                  .ant-col {
                    margin: 0 auto;

                    .sub-menu {
                      width: 0.8rem;
                      height: 0.49rem;
                      padding: 0.095rem 0 0;

                      &:hover {
                        background: #0038775c;
                      }

                      p {
                        text-align: center;
                        margin: 0.055rem auto 0;
                      }
                    }
                  }
                }
              }
            }

            &.small {
              .cil-main {
                .cil-header {
                  position: relative;

                  .cilh-left {
                    display: block;
                    height: unset;
                    text-align: center;

                    img {
                      margin: 0 auto;
                      width: 0.8rem;
                    }
                  }

                  .cilh-right {
                    display: block;
                    padding-top: 0;
                    position: relative;
                    text-align: center;
                    top: -0.3rem;
                    height: 0.61rem;
                    .animation(flatRight2 0.1s 0.3s ease both);

                    button {
                      bottom: 0.1rem;
                      margin-right: 0;

                      span {
                        display: none;
                      }
                    }
                  }
                }
              }
            }

            &#collapse_item4 {
              .cil-main {
                .cil-header {
                  background: linear-gradient(
                    135deg,
                    rgba(54, 241, 111, 0.86),
                    rgba(0, 184, 134, 0.86)
                  );

                  &:hover {
                    background: linear-gradient(
                      135deg,
                      rgba(54, 241, 111, 100%),
                      rgba(0, 184, 134, 100%)
                    );
                  }
                }

                .cil-body {
                  background: #009b6580;

                  .ant-col {
                    .sub-menu {
                      &:hover {
                        background: #00352a5c;
                      }
                    }
                  }
                }
              }
            }

            &#collapse_item5 {
              .cil-main {
                .cil-header {
                  background: linear-gradient(
                    135deg,
                    rgba(43, 233, 255, 0.86),
                    rgba(52, 129, 255, 0.86)
                  );

                  &:hover {
                    background: linear-gradient(
                      135deg,
                      rgba(43, 233, 255, 100%),
                      rgba(52, 129, 255, 100%)
                    );
                  }
                }

                .cil-body {
                  background: #0071c080;
                }
              }
            }

            &#collapse_item6 {
              .cil-main {
                .cil-header {
                  background: linear-gradient(
                    135deg,
                    rgba(142, 59, 255, 0.86),
                    rgba(76, 12, 239, 0.86)
                  );

                  &:hover {
                    background: linear-gradient(
                      135deg,
                      rgba(142, 59, 255, 100%),
                      rgba(76, 12, 239, 100%)
                    );
                  }
                }

                .cil-body {
                  background: #6d45be80;

                  .ant-col {
                    .sub-menu {
                      &:hover {
                        background: #200b4c5c;
                      }
                    }
                  }
                }
              }
            }

            .cil-main {
              .cil-header {
                text-align: left;
                flex-grow: 12;

                .cilh-left {
                  display: inline-block;
                  vertical-align: bottom;
                  height: 100%;

                  img {
                    margin-top: 0.25rem;
                    margin-right: 0.11rem;
                    margin-left: 0.15rem;
                    width: 0.8rem;
                  }
                }

                .cilh-right {
                  position: relative;
                  display: inline-block;
                  vertical-align: bottom;
                  height: 100%;
                  padding-top: 0.46rem;
                  // .animation(flatRight .1s .5s ease both);
                  .animation(flatRight 0.1s 0.1s cubic-bezier(0.61, -0.19, 0.7, -0.11) both);

                  .cilh-subtitle {
                    text-align: center;
                  }

                  button {
                    /*bottom: 0.21rem;*/
                  }
                }
              }

              .cil-body {
                flex: 13;
                padding: 0.05rem 0.15rem;
              }
            }
          }

          &.open {
            .cil-main {
              .cil-header {
                button {
                  img {
                    left: 0.09rem;
                    .transform(rotateY(135deg));
                  }
                }
              }
            }
          }

          &.small {
            .cil-main {
              .cil-header {
                button {
                  width: 0.24rem;
                  height: 0.24rem;
                  border-radius: 50%;

                  img {
                    position: unset;
                  }
                }
                .cilh-icon {
                  margin-top: 0.32rem;
                  width: 0.8rem;
                }

                .divider {
                  display: none;
                }

                .cilh-subtitle {
                  display: none;
                }
              }
            }
          }

          &.disabled {
            opacity: 0.86;

            & > * {
              opacity: 0.36;
            }
          }
          .cil-main {
            display: flex;
            width: 100%;
            height: 100%;

            .cil-header {
              flex: 1 0;
              text-align: center;
              border-radius: 0.06rem;

              &:hover {
                .boxShadow(0px 0px 0.56rem 0px rgba(0, 0, 0, 0.32));
              }

              .cilh-title {
                font-size: 0.15rem;
                font-family: Source Han Sans CN;
                font-weight: bold;
                color: #ffffff;
                text-shadow: 0px 0.04rem 0.07rem #00000033;
              }

              .cilh-subtitle {
                font-size: 0.1rem;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: #ffffff4d;
              }

              .cilh-title-area {
                position: relative;
                width: 0.8rem;
                text-align: center;
                margin: 0 auto;
              }

              .divider {
                margin: 0;
                padding: 0;
                font-size: 0.14rem;
                font-variant: tabular-nums;
                line-height: 0.15rem;
                list-style: none;
                font-feature-settings: 'tnum';
                background: #ffffff5c;
                position: absolute;
                top: 0.05rem;
                display: inline-block;
                width: 2px;
                height: 0.14rem;
                vertical-align: middle;
                border-radius: 0.02rem;

                &.left {
                  left: 0;
                }

                &.right {
                  right: 0;
                }
              }

              button {
                position: absolute;
                height: 0.16rem;
                left: 50%;
                transform: translateX(-50%);
                background: #0000001a;
                border: 0.01rem solid #ffffff1a;
                border-radius: 0.45rem;
                font-size: 0.08rem;
                font-family: Source Han Sans CN;
                font-weight: 400;
                width: 0.86rem;
                cursor: pointer;

                &:hover {
                  span {
                    color: #fff;
                  }
                }

                span {
                  color: #fffefe99;
                }

                img {
                  width: 0.13rem;
                  position: absolute;
                  right: 0.09rem;
                }
              }
            }

            .cil-body {
              display: none;
              background: chocolate;
              overflow-y: auto;
              border-top-right-radius: 0.06rem;
              border-bottom-right-radius: 0.06rem;

              .sub-menu {
                text-align: center;
                font-size: 0.07rem;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: #ffffff;
                line-height: 0.12rem;
                margin: 0 auto;

                &:hover {
                  background: #0038775c;
                }

                img {
                  width: 0.19rem;
                }

                p {
                  text-align: center;
                  margin: 0.055rem auto 0;
                }
              }
            }
          }
        }
      }
    }
  }
}
@keyframes fadeInRight {
  0% {
    opacity: 0;
    .transform(translateX(-0.2rem));
  }

  100% {
    opacity: 1;
    .transform(translateX(0));
  }
}

@-moz-keyframes fadeInRight {
  0% {
    opacity: 0;
    .transform(translateX(-0.2rem));
  }

  100% {
    opacity: 1;
    .transform(translateX(0));
  }
}

@keyframes flatRight {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes flatRight1 {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes flatRight2 {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
