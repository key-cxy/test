<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
const echarts = require("echarts");
export default {
  props: ["orginEchartData"],
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
      let option = {
        grid: {
          top: "10%",
          left: "0",
          right: "5%",
          bottom: "6%",
          containLabel: true,
        },
        legend: {
          icon: "circle",
          bottom: "0%",
          left: "0",
          itemWidth: 7,
          itemHeight: 7,
          itemGap: 40,
          textStyle: {
            color: "#89A7AF",
          },
          data: [
            {
              name: "待处理",
            },
            {
              name: "进行中",
            },
            {
              name: "已完成",
            },
          ],
        },
        xAxis: [
          { 
            show: false,
            type: "value",
          },
        ],
        yAxis: [
          {
            //type: 'category',
            data: [""],
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#fff",
              },
            },
          },
        ],
        series: [
          {
            name: "待处理",
            type: "bar",
            barWidth: 16,
            stack: "案件占比",
            // label: {
            //   normal: {
            //     borderWidth: 10,
            //     distance: 20,
            //     align: "center",
            //     verticalAlign: "middle",
            //     borderRadius: 1,
            //     borderColor: "#E8A61F",
            //     backgroundColor: "#E8A61F",
            //     show: true,
            //     position: "top",
            //     formatter: "{c}%",
            //     color: "#000",
            //   },
            // },
            itemStyle: {
              color: "#E8A61F",
            },
            data: [
              {
                value: 53.1,
                itemStyle: {
                  normal: {
                    color: {
                      type: "bar",
                      colorStops: [
                        {
                          offset: 0,
                          color: "#E8A61F", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#E8A61F", // 100% 处的颜色
                        },
                      ],
                      globalCoord: false, // 缺省为 false
                    },
                  },
                },
              },
            ],
          },

          {
            name: "进行中",
            type: "bar",
            barWidth: 16,
            stack: "案件占比",
            itemStyle: {
              color: "#E67C26",
            },
            // label: {
            //   normal: {
            //     borderWidth: 10,
            //     distance: 20,
            //     align: "center",
            //     verticalAlign: "middle",
            //     borderRadius: 1,
            //     borderColor: "#E67C26",
            //     backgroundColor: "#E67C26",
            //     show: true,
            //     position: "top",
            //     formatter: "{c}%",
            //     color: "#000",
            //   },
            // },
            data: [
              {
                value: 23,
                itemStyle: {
                  normal: {
                    color: {
                      type: "bar",
                      colorStops: [
                        {
                          offset: 0,
                          color: "#E67C26", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#E67C26", // 100% 处的颜色
                        },
                      ],
                      globalCoord: false, // 缺省为 false
                    },
                  },
                },
              },
            ],
          },
          {
            name: "已完成",
            type: "bar",
            barWidth: 16,
            stack: "案件占比",
            itemStyle: {
              color: "#0CD8A7",
            },
            // label: {
            //   normal: {
            //     borderWidth: 10,
            //     distance: 20,
            //     align: "center",
            //     verticalAlign: "middle",
            //     borderRadius: 1,
            //     borderColor: "#0CD8A7",
            //     backgroundColor: "#0CD8A7",
            //     show: true,
            //     position: "top",
            //     formatter: "{c}%",
            //     color: "#000",
            //   },
            // },
            data: [
              {
                value: 45,
                itemStyle: {
                  normal: {
                    color: {
                      type: "bar",
                      colorStops: [
                        {
                          offset: 0,
                          color: "#0CD8A7", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#0CD8A7", // 100% 处的颜色
                        },
                      ],
                      globalCoord: false, // 缺省为 false
                    },
                  },
                },
              },
            ],
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
