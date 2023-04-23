<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
const echarts = require("echarts")
export default {
  props: ['dataArr', 'xArr'],
  data() {
    return {
      myChart: null,
    };
  },
  async mounted() {
    this.init();
  },
  methods: {
    init() {
      var option = {
        tooltip: {
          //   trigger: "item", //默认效果
          //柱状图加阴影
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            label: {
              show: true,
            },
          },
        },
        grid: {
          top: "10%",
          left: "2%",
          right: "5%",
          bottom: "6%",
          containLabel: true,
        },
        color: ["rgba(24, 144, 255, 0.8470588235294118)"],
        xAxis: {
          type: "category",
          data: this.xArr,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: "系统案件",
            data: this.dataArr,
            barWidth: 22,
            type: "bar",
          },
        ],
      };
      console.log(echarts)
      this.myChart = echarts.init(this.$refs.chart);
      this.myChart.setOption(option)
      window.onresize = this.myChart.resize;
    },

  },
  watch: {
    dataArr() {
      this.init();
    }
  }
};
</script>

<style scoped>
 .chart {
    width: 100%;
    height: 100%;
 }
</style>
