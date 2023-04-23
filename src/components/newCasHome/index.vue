<template>
  <div class="home-container">
    <div class="time-wea">
      <div class="item">{{ nowTime }}</div>
      <div class="item">{{ weekTime }}</div>
      <div class="item"><img src="./image/icon.png">{{ wea }}</div>
      <div class="item">{{ tem }} ℃</div>
      <div class="item" @click="logout">【<span class="back">退出</span>】</div>
    </div>
    <div class="title">
      <div>城市运行管理平台</div>
    </div>
    <div class="info">
      <div class="alarm">
        <div class="alarm-title">
          <div>实时告警</div>
          <div>正在运行</div>
        </div>
        <div class="alarm-info">
          <div class="label"><div class="icon1"></div>告警总量</div>
          <div class="value">8821</div>
        </div>
        <div class="alarm-info">
          <div class="label"><div class="icon2"></div>告警总量</div>
          <div class="value">6749</div>
        </div>
        <div class="alarm-info">
          <div class="label"><div class="icon3"></div>告警总量</div>
          <div class="value">3133</div>
        </div>
      </div>
      <div class="line">
        <div class="col-line"></div>
      </div>
      <div class="today">
        <div class="today-item">
          <div class="icon1"><img src="./image/icon24.png"></div>
          <div class="today-info">
            <div class="label">今日告警</div>
            <div class="value">120</div>
          </div>
        </div>
        <div class="today-item">
          <div class="icon1"><img src="./image/icon25.png"></div>
          <div class="today-info">
            <div class="label">今日新增</div>
            <div class="value">120</div>
          </div>
        </div>
        <div class="today-item">
          <div class="icon1"><img src="./image/icon26.png"></div>
          <div class="today-info">
            <div class="label">今日解除</div>
            <div class="value">120</div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-box">
      <div class="card bk1">
        <div class="icon"><img src="./image/icon15.png"></div>
        <div class="card-title">城管智脑</div>
      </div>
      <div class="card bk2">
        <div class="icon"><img src="./image/icon16.png"></div>
        <div class="card-title">行业应用</div>
        <div class="list">
          <div class="line" v-for="item in list5">
            <div class="tips"><div class="trangle"></div></div>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===0" @click="toPath(item.id)">{{item.name}}</p>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===1" @click="toUrl(item.id)">{{item.name}}</p>
          </div>
        </div>
      </div>
      <div class="card bk3">
        <div class="icon"><img src="./image/icon17.png"></div>
        <div class="card-title">监管平台</div>
        <div class="list">
          <div class="line" v-for="item in list6">
            <div class="tips"><div class="trangle"></div></div>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===0" @click="toPath(item.id)">{{item.name}}</p>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===1" @click="toUrl(item.id)">{{item.name}}</p>
          </div>
        </div>
      </div>
      <div class="card bk4">
        <div class="icon"><img src="./image/icon18.png"></div>
        <div class="card-title">公众服务</div>
        <div class="list">
          <div class="line" v-for="item in list3">
            <div class="tips"><div class="trangle"></div></div>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===0" @click="toPath(item.id)">{{item.name}}</p>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===1" @click="toUrl(item.id)">{{item.name}}</p>
          </div>
        </div>
      </div>
      <div class="card bk5">
        <div class="icon"><img src="./image/icon19.png"></div>
        <div class="card-title">决策建议</div>
        <div class="list">
          <div class="line" v-for="item in list7">
            <div class="tips"><div class="trangle"></div></div>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===0" @click="toPath(item.id)">{{item.name}}</p>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===1" @click="toUrl(item.id)">{{item.name}}</p>
          </div>
        </div>
      </div>
      <div class="card bk6">
        <div class="icon"><img src="./image/icon20.png"></div>
        <div class="card-title">数据中台</div>
        <div class="list">
          <div class="line" v-for="item in list8">
            <div class="tips"><div class="trangle"></div></div>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===0" @click="toPath(item.id)">{{item.name}}</p>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===1" @click="toUrl(item.id)">{{item.name}}</p>
          </div>
        </div>
      </div>
      <div class="card bk7">
        <div class="icon"><img src="./image/icon21.png"></div>
        <div class="card-title">应用维护</div>
        <div class="list">
          <div class="line" v-for="item in list2">
            <div class="tips"><div class="trangle"></div></div>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===0" @click="toPath(item.id)">{{item.name}}</p>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===1" @click="toUrl(item.id)">{{item.name}}</p>
          </div>
        </div>
      </div>
      <div class="card bk8">
        <div class="icon"><img src="./image/icon22.png"></div>
        <div class="card-title">指挥协调</div>
        <div class="list">
          <div class="line" v-for="item in list1">
            <div class="tips"><div class="trangle"></div></div>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===0" @click="toPath(item.id)">{{item.name}}</p>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===1" @click="toUrl(item.id)">{{item.name}}</p>
          </div>
        </div>
      </div>
      <div class="card bk9">
        <div class="icon"><img src="./image/icon23.png"></div>
        <div class="card-title">专项应用</div>
        <div class="list">
          <div class="line" v-for="item in list9">
            <div class="tips"><div class="trangle"></div></div>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===0" @click="toPath(item.id)">{{item.name}}</p>
            <p class="line-info" :class="item.status ? '': 'disable'" v-if="item.type===1" @click="toUrl(item.id)">{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import 'swiper/css/swiper.css'
  import {encrypt,decrypt} from '@/libs/encrypt.js'
  import { setSystem } from "@/utils/auth";
  import { getUserSubSystem,getUrl } from "@/api/system/subSystem";
  import router from '@/router'
  import {getPath} from "@/utils/ruoyi";
  export default {
    name: 'index',
    data() {
      return {
        timer: '', //定义一个定时器
        nowTime: '', // 当前日期时间
        weekTime: '', // 当前日期
        wea: '',
        tem: '',
        ip: '',
        list1:[],
        list2:[],
        list3:[],
        list4:[],
        list5:[],
        list6:[],
        list7:[],
        list8:[],
        list9:[],
        value1: 0,
      }
    },
    mounted() {
      this.getUserIP((ip) => {
        this.ip = ip;
      });
      this.getTime()
      this.getWeaAndTem()
      this.getUserSubSystem()
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
    methods: {
      getTime() {
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
      getWeaAndTem() {
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
      getUserIP(onNewIP) {
        let MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
        let pc = new MyPeerConnection({
          iceServers: []
        })
        let noop = () => {}
        let localIPs = {}
        let ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
        let iterateIP = (ip) => {
          if (!localIPs[ip]) onNewIP(ip)
          localIPs[ip] = true
        }
        pc.createDataChannel('')
        pc.createOffer().then((sdp) => {
          sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return
            line.match(ipRegex).forEach(iterateIP)
          })
          pc.setLocalDescription(sdp, noop, noop)
        }).catch((reason) => {

        })
        pc.onicecandidate = (ice) => {
          if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
          ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
        }
      },
      getUserSubSystem(){
        getUserSubSystem().then(res =>{
          if(res.code === 0){
            res.data.forEach(item =>{
              switch (item.category) {
                case "指挥协调":
                  this.list1.push(item)
                  break;
                case "应用维护":
                  this.list2.push(item)
                  break;
                case "公众服务":
                  this.list3.push(item)
                  break;
                case "城管智脑":
                  this.list4.push(item)
                  break;
                case "行业应用":
                  this.list5.push(item)
                  break;
                case "监管平台":
                  this.list6.push(item)
                  break;
                case "决策建议":
                  this.list7.push(item)
                  break;
                case "数据中台":
                  this.list8.push(item)
                  break;
                case "专项应用":
                  this.list9.push(item)
                  break;
                default:
                  console.log("I don't own a pet");
                  break;
              }
            })
          }
        })
      },
      toUrl(id){
        getUrl(id).then(res =>{
          window.open(res.data, '_blank');
        })
      },
      toPath(value){
        setSystem(encrypt(value.toString()))
        this.$store.dispatch("GenerateRoutes")
          .then((res) => {
            router.addRoutes(res)
            this.$router.push("/index/index")
          })
      },
      async logout() {
        this.$modal.confirm('确定注销并退出系统吗？', '提示').then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = getPath('/comys');
          })
        }).catch(() => {});
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-container {
    width: 1920px;
    height: 960px;
    background: url("./image/bg.png") no-repeat;
    background-size: 100% 100%;
    cursor: default;
  }
  .time-wea {
    position: relative;
    display: flex;
    font-size: 20px;
    font-family: "DINAlternate-Bold", "DINAlternate";
    color: #FFFFFF;
    line-height: 24px;
    text-align: center;
    justify-content: center;
    top: 80px;
    .item {
      margin: 16px;
      justify-content: center;
      img {
        width: 24px;
        height: 23px;
      }
      .back:hover {
        color: #00DDFF;
      }
    }
  }
  .title{
    position: relative;
    display: flex;
    font-size: 68px;
    font-family: "zihun143-zhengkuchaojihei", "zihun143";
    font-weight: bold;
    color: #FFFFFF;
    line-height: 82px;
    text-shadow: 0px 2px 7px #70BDED;
    text-align: center;
    justify-content: center;
    top: 80px;
  }
  .info {
    width: 1130px;
    height: 119px;
    margin: auto;
    position: relative;
    display: flex;
    /*text-align: center;*/
    /*justify-content: center;*/
    background: url("./image/icon27.png")no-repeat;
    background-size: 100% 100%;
    top: 100px;
    .alarm {
      display: flex;
      .alarm-title{
        width: 119px;
        height: 119px;
        font-size: 18px;
        font-family: "PingFangSC-Semibold", "PingFang SC";
        font-weight: 500;
        color: #FFFFFF;
        line-height: 20px;
        display: flex;
        flex-direction: column; /* 子元素排列 */
        justify-content: center; /* 相对父元素水平居中 */
        align-items: center;
      }
      .alarm-info {
        width: 119px;
        height: 119px;
        display: flex;
        flex-direction: column; /* 子元素横向排列 */
        justify-content: center; /* 相对父元素水平居中 */
        align-items: center;
        .label {
          font-size: 12px;
          font-family: "SourceHanSansSC-Bold", "SourceHanSansSC";
          font-weight: bold;
          color: #FFFFFF;
          line-height: 18px;
          display: flex;
          .icon1{
            margin-top: 6px;
            width: 14px;
            height: 6px;
            background: #FA6400;
            border-radius: 4px;
          }
          .icon2{
            margin-top: 6px;
            width: 14px;
            height: 6px;
            background: #FBBB4A;
            border-radius: 4px;
          }
          .icon3{
            margin-top: 6px;
            width: 14px;
            height: 6px;
            background: #47FBBA;
            border-radius: 4px;
          }
        }
        .value {
          font-size: 30px;
          font-family: "DINAlternate-Bold", "DINAlternate";
          font-weight: 500;
          color: #FFFFFF;
          line-height: 35px;
        }
      }
    }
    .line{
      display: flex;
      flex-direction: column; /* 子元素排列 */
      justify-content: center; /* 相对父元素水平居中 */
      align-items: center;
      .col-line{
        width: 1px;
        height: 41px;
        border: 1px solid #EEEEEE;
      }
    }
    .today{
      display: flex;
      .today-item {
        margin: 0 30px;
        display: flex;
        justify-content: center; /* 相对父元素水平居中 */
        align-items: center;
        img {
          width: 51px;
          height: 50px;
        }
        .today-info{
          margin: 0 10px;
          .label{
            font-size: 10px;
            font-family: "SourceHanSansSC-Bold", "SourceHanSansSC";
            font-weight: bold;
            color: #FFFFFF;
            line-height: 15px;
            text-shadow: 0px 1px 4px rgba(250,100,0,0.7);
          }
          .value{
            font-size: 22px;
            font-family: "PingFangSC-Semibold", "PingFang SC";
            font-weight: 600;
            color: #FFFFFF;
            line-height: 30px;
          }
        }
      }
    }
  }
  .card-box{
    width: 100%;
    position: relative;
    display: flex;
    top: 80px;
    .card:hover {
      width: 228px;
      height: 565px;
      margin: 0 5px;
      margin-top: -45px;
      display: flex;
      flex-direction: column; /* 子元素排列 */
      /*justify-content: center; !* 相对父元素水平居中 *!*/
      align-items: center;
    }
    .card {
      width: 188px;
      height: 505px;
      margin: 0 15px;
      display: flex;
      flex-direction: column; /* 子元素排列 */
      /*justify-content: center; !* 相对父元素水平居中 *!*/
      align-items: center;
      .icon {
        margin-top: 109px;
        width: 72px;
        height: 72px;
        img{
          width: 72px;
          height: 72px;
        }
      }
      .iconTemp {
        margin-top: 36px;
        width: 72px;
        height: 72px;
      }
      .card-title {
        margin-top: 11px;
        font-size: 20px;
        font-family: "PingFangSC-Semibold", "PingFang SC";
        font-weight: 600;
        color: #FFFFFF;
        line-height: 28px;
        text-shadow: 0px 2px 8px #00CDFF;
      }
      .list {
        margin-top: 30px;
        font-size: 17px;
        font-family: "PingFangSC-Regular", "PingFang SC";
        font-weight: 400;
        color: #FFFFFF;
        line-height: 22px;
        text-shadow: 0px 2px 8px #00CDFF;
        .line{
          display: flex;
          .disable{
            pointer-events: none;
            color: #999999;
          }
          .line-info:hover{
            color: #00DDFF;
          }
          .tips{
            margin-top: 5px;
            width: 10px;
            height: 10px;
            /*background: #FFFFFF;*/
            /*box-shadow: 0px 1px 6px 0px #00CDFF;*/
            .trangle{
              width: 0px;
              height: 0px;
              border: 6px solid #000;
              border-top-color: transparent;
              border-bottom-color: transparent;
              border-left-color: #FFFFFF;
              border-right-color: transparent;
              box-shadow: 0px 1px 6px 0px #00CDFF;
            }
          }
        }
      }
    }
    .bk1 {
      background: url("./image/card1.png")no-repeat;
      background-size: 100% 100%;
    }
    .bk2 {
      background: url("./image/card2.png")no-repeat;
      background-size: 100% 100%;
    }
    .bk3 {
      background: url("./image/card3.png")no-repeat;
      background-size: 100% 100%;
    }
    .bk4 {
      background: url("./image/card4.png")no-repeat;
      background-size: 100% 100%;
    }
    .bk5 {
      background: url("./image/card5.png")no-repeat;
      background-size: 100% 100%;
    }
    .bk6 {
      background: url("./image/card6.png")no-repeat;
      background-size: 100% 100%;
    }
    .bk7 {
      background: url("./image/card7.png")no-repeat;
      background-size: 100% 100%;
    }
    .bk8 {
      background: url("./image/icon28.png")no-repeat;
      background-size: 100% 100%;
    }
    .bk9 {
      background: url("./image/card9.png")no-repeat;
      background-size: 100% 100%;
    }
  }
</style>
