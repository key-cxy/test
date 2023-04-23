<template>
  <div class="container">
    
    <el-row :gutter="25">
      <el-col :span="17">
        <div class="left">
          <div class="left1">
            <div class="title">系统实时数据统计</div>
            <div class="content">
              <div class="item" v-for="item in systemData" :key="item.text">
                <div class="itemTop">{{ item.text }}</div>
                <div class="itemBottom">{{ item.val + "条" }}</div>
              </div>
            </div>
          </div>
          <div class="left2">
            <div class="title">
              系统案件趋势
              <div class="timeSelect">
                <div
                  class="period"
                  v-for="item in periodList"
                  :key="item"
                  :class="{ active: selectedPeriod == item }"
                  @click="changePeriod(item)"
                >
                  {{ item }}
                </div>
                <a-locale-provider :locale="locale">
                  <a-range-picker
                    @change="onChange"
                    :locale="locale"
                    :placeholder="['开始日期', '结束日期']"
                  />
                </a-locale-provider>
              </div>
            </div>
            <div class="left2Contet">
              <my-chart1 :dataArr="dataArr" :xArr="xArr"></my-chart1>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="right">
          <div class="right1">
            <div class="title">系统访问量统计</div>
            <div class="rContent" style="height: 195px">
              <div class="rContentTitle">系统访问量</div>
              <div class="rNum">{{ pageViewNum }}</div>
              <div style="flex: 1">
                <my-chart2 :dataArr="dataArr2" :xArr="xData2"></my-chart2>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="right1">
            <div class="title">案件量</div>
            <div class="rContent" style="height: 110px; margin-top: 10px">
              <div class="rNum">{{ caseNum }}</div>
              <div style="flex: 1">
                <my-chart4 :dataArr="dataArr2" :xArr="xData2"></my-chart4>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="secondPart">
      <div class="left">
        <div class="title">问题来源量排名</div>
        <div class="content"  style="height: 260px">
          <div
            class="item"
            v-for="(item, index) in problemOriginList"
            :key="index"
          >
            <div class="axis">{{ index + 1 }}</div>
            <div class="type">{{ item.dept }}</div>
            <div class="num">{{ item.val }}</div>
          </div>
        </div>
      </div>
      <div class="center">
        <div class="title">案件处置量排名</div>
                <div class="content" style="height: 260px">
          <div
            class="item"
            v-for="(item, index) in caseList"
            :key="index"
          >
            <div class="axis">{{ index + 1 }}</div>
            <div class="type">{{ item.dept }}</div>
            <div class="num">{{ item.val }}</div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">问题来源案件占比</div>
        <div style="height: 300px;">
          <my-chart3 :orginEchartData="orginEchartData" ></my-chart3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import "moment/locale/zh-cn";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import MyChart1 from "../components/echartModule/MyChart1.vue";
import MyChart2 from "../components/echartModule/MyChart2.vue";
import MyChart3 from "../components/echartModule/MyChart3.vue";
import MyChart4 from "../components/echartModule/MyChart4.vue";

moment.locale("zh-cn");

export default {
  data() {
    return {
      locale: zhCN,
      systemData: [
        {
          text: "系统案件总量",
          val: thousands(54323),
        },
        {
          text: "今日上报案件",
          val: thousands(1323),
        },
        {
          text: "今日办结案件",
          val: thousands(323),
        },
        {
          text: "异常案件",
          val: thousands(52),
        },
      ],
      periodList: ["今日", "本周", "本月", "全年"],
      selectedPeriod: "全年",
      inqueryDate: "",
      dataArr: [38, 42, 50, 157, 40, 45, 60, 140, 36, 47, 54, 143],
      xArr: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
      pageViewNum: thousands(8846),
      caseNum: thousands(3252685),
      xData2: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
      ],
      dataArr2: [
        36, 5, 65, 50, 10, 15, 3, 85, 23, 15, 18, 35, 40, 54, 8, 17, 22, 26, 39,
        22, 15, 25, 87, 69, 47, 32, 39, 8, 66, 75,
      ],
      problemOriginList: [
        {
          dept: "日常巡查",
          val: thousands(323234),
        },
        {
          dept: "长效考评",
          val: thousands(323234),
        },
        {
          dept: "12319",
          val: thousands(323234),
        },
        {
          dept: "市域治理",
          val: thousands(323234),
        },
        {
          dept: "路长制",
          val: thousands(323234),
        },

        {
          dept: "环卫专项",
          val: thousands(323234),
        },
        {
          dept: "渣土专项",
          val: thousands(323234),
        },
      ],
      caseList: [
        {
          dept: "部门1",
          val: thousands(323234),
        },
        {
          dept: "部门2",
          val: thousands(323234),
        },
        {
          dept: "部门3",
          val: thousands(323234),
        },
        {
          dept: "部门1",
          val: thousands(323234),
        },
        {
          dept: "部门1",
          val: thousands(323234),
        },

        {
          dept: "部门1",
          val: thousands(323234),
        },
        {
          dept: "部门1",
          val: thousands(323234),
        },
      ],
      orginEchartData: [
        {
          name: "来源1",
          value: "3720",
          percent: "10%",
        },
        {
          name: "来源2",
          value: "2920",
          percent: "10%",
        },
        {
          name: "来源3",
          value: "2200",
          percent: "10%",
        },
        {
          name: "来源4",
          value: "1520",
          percent: "10%",
        },
        {
          name: "来源5",
          value: "1820",
          percent: "10%",
        },
        {
          name: "来源6",
          value: "1620",
          percent: "10%",
        },
        {
          name: "来源7",
          value: "1420",
          percent: "10%",
        },
      ]
    };
  },
  methods: {
    changePeriod(val) {
      this.selectedPeriod = val;
    },
    onChange() {

    }
  },
  components: {
    MyChart1,
    MyChart2,
    MyChart3,
    MyChart4
  },
};
function thousands(num) {
  var str = num.toString();
  var reg =
    str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
  return str.replace(reg, "$1,");
}
</script>

<style lang="less" scoped>
.container {
  padding: 15px;
  .left,
  .right {
    .left1,
    .right1,
    .left2 {
      .title {
        padding-bottom: 15px;
        padding-left: 25px;
        border-bottom: 1px solid rgba(235, 235, 235, 1);
        font-family: "Microsoft Tai Le Bold", "Microsoft Tai Le Regular",
          "Microsoft Tai Le", sans-serif;
        font-weight: 600;
        font-style: normal;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.8470588235294118);
      }
      .content {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        padding-left: 25px;
        margin-top: 20px;
        height: 80px;
        .item {
          flex: 1;
          .itemTop {
            font-family: "PingFang SC ", "PingFang SC", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.4);
            margin-bottom: 5px;
          }
          .itemBottom {
            font-size: 24px;
            color: rgba(0, 0, 0, 0.8);
            text-align: left;
          }
        }
      }
    }
    .left2 {
      margin-top: 30px;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .timeSelect {
          font-family: "Microsoft YaHei", sans-serif;
          font-weight: 400;
          font-style: normal;
          color: rgba(0, 0, 0, 0.6);
          font-size: 14px;
          display: flex;
          align-items: center;
          .period {
            margin-right: 20px;
            cursor: pointer;
          }
          .active {
            color: rgba(24, 144, 255, 0.847);
          }
        }
      }
      .left2Contet {
        height: 215px;
      }
    }
  }
  .right {
    .right1 {
      .rContent {
        margin-left: 25px;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        .rContentTitle {
          font-family: "PingFang SC ", "PingFang SC", sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.4);
          margin-bottom: 5px;
        }
        .rNum {
          font-size: 30px;
          color: rgba(0, 0, 0, 0.8);
          line-height: 38px;
          font-family: "Arial Normal", "Arial", sans-serif;
          font-weight: 400;
          font-style: normal;
        }
      }
    }
  }
  .secondPart {
    display: flex;
    margin-top: 10px;
    .left,
    .center,
    .right {
      flex: 5;
      margin-right: 15px;
      .title {
        padding-bottom: 15px;
        padding-left: 25px;
        border-bottom: 1px solid rgba(235, 235, 235, 1);
        font-family: "Microsoft Tai Le Bold", "Microsoft Tai Le Regular",
          "Microsoft Tai Le", sans-serif;
        font-weight: 600;
        font-style: normal;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.8470588235294118);
      }
      .content {
        padding-left: 25px;
        margin-top: 20px;
        .item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          .axis {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            text-align: center;
            line-height: 18px;
            background: #f0f2f5;
            font-family: "Arial Normal", "Arial", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 13px;
            color: rgba(0, 0, 0, 0.65);
            margin-right: 15px;
          }
          .type {
          }
          .num {
            margin-right: 20px;
            text-align: right;
            flex: 1;
            font-family: "Arial Normal", "Arial", sans-serif;
            color: rgba(0, 0, 0, 0.65);
          }
        }
        .item:nth-child(1),
        .item:nth-child(2),
        .item:nth-child(3) {
          .axis {
            background: #314659;
            color: #fff;
          }
        }
      }
    }
    .right {
      flex: 6;
    }
  }
}
</style>
