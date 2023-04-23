<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
const echarts = require("echarts");
export default {
  props: ["dataArr", "xArr"],
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
        grid: {
          top: "5px",
          left: "-20px",
          right: "5px",
          bottom: "15px",
          containLabel: true,
        },
        tooltip: {
          show: true,
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xArr,
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false
          },
          show: false
        },
        yAxis: {
          show: false,
        },
        series: [
          {
            data: this.dataArr,
            type: "line",
            showSymbol: false,
            smooth: true,
            tooltip: {
              show: true,
            },
            itemStyle: {
              normal: {
                color: "#16D9F0",
              },
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#fff",
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#16D9F0",
                  },
                  {
                    offset: 1,
                    color: "#16D9F0",
                  },
                ]),
              },
            },
          },
        ],
      };
      console.log(echarts);
      this.myChart = echarts.init(this.$refs.chart);
      this.myChart.setOption(option);
      window.onresize = this.myChart.resize;
    },
  },
  watch: {
    dataArr() {
      this.init();
    },
  },
};
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
