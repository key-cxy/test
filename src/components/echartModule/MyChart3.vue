<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
const echarts = require("echarts");
export default {
  props: ['orginEchartData'],
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
      let bgColor = "#fff";
      let title = "总量";
      let color = [
        "#0E7CE2",
        "#FF8352",
        "#E271DE",
        "#F8456B",
        "#00FFFF",
        "#4AEAB0",
        "#975fe4",
        "#32bdbd",
        "#ffb666",
      ];
      let echartData = this.orginEchartData;

      let formatNumber = function (num) {
        let reg = /(?=(\B)(\d{3})+$)/g;
        return num.toString().replace(reg, ",");
      };
      let total = echartData.reduce((a, b) => {
        return a + b.value * 1;
      }, 0);

      let option = {
        backgroundColor: bgColor,
        color: color,
        // tooltip: {
        //     trigger: 'item'
        // },
        // title: [
        //   {
        //     text: "{name|" + title + "}\n{val|" + formatNumber(total) + "}",
        //     top: "center",
        //     left: "center",
        //     textStyle: {
        //       rich: {
        //         name: {
        //           fontSize: 14,
        //           fontWeight: "normal",
        //           color: "#666666",
        //           padding: [10, 0],
        //         },
        //         val: {
        //           fontSize: 32,
        //           fontWeight: "bold",
        //           color: "#333333",
        //         },
        //       },
        //     },
        //   },
        //   {
        //     text: "单位：个",
        //     top: 20,
        //     left: 20,
        //     textStyle: {
        //       fontSize: 14,
        //       color: "#666666",
        //       fontWeight: 400,
        //     },
        //   },
        // ],
        legend: {
          // orient: "vertical",
          // icon: "rect",
          // x: "center",
          // y: "bottom",
          // itemWidth: 12,
          // itemHeight: 12,
          align: "left",
          left: "center",
          icon: "circle",
          right: 0,
          bottom: 0,
          textStyle: {
            rich: {
              name: {
                fontSize: 12,
              },
              value: {
                fontSize: 12,
                padding: [0, 5, 0, 15],
              },
              unit: {
                fontSize: 13,
              },
            },
          },
          formatter: function (name) {
            let res = echartData.filter((v) => v.name === name);
            res = res[0] || {};
            let percent = res.percent || "";
            return (
              "{name|" +
              res.name +
              "}  {value|" +
              res.value +
              "  |" +
              "}{percent|" +
              percent +
              "}"
            );
          },
          // data: legendName
        },
        series: [
          {
            type: "pie",
            radius: ["45%", "60%"],
            center: ["50%", "40%"],
            data: echartData,
            hoverAnimation: true,
            itemStyle: {
              normal: {
                borderColor: bgColor,
                borderWidth: 2,
              },
            },
            labelLine: {
              normal: {
                length: 10,
                length2: 100,
                lineStyle: {
                  color: "#e6e6e6",
                },
              },
            },
            label: {
              normal: {
                formatter: (params) => {
                  return (
                    "{icon|●}{name|" +
                    params.name +
                    "}{value|" +
                    formatNumber(params.value) +
                    "}"
                  );
                },
                padding: [0, -100, 0, -100],
                rich: {
                  icon: {
                    fontSize: 16,
                  },
                  name: {
                    fontSize: 14,
                    padding: [0, 10, 0, 4],
                    color: "#666666",
                  },
                  value: {
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#333333",
                  },
                },
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
