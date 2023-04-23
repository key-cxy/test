<!-- 地图打点弹窗 lpc 2023-02-24 -->
<template>
  <div>
    <el-dialog :title="title" :visible="isShow" width="80vw" append-to-body @close="closeModel">
      <template slot="footer">
        <el-button type="danger" v-if="visible == 'dragArr'" @click="clearMarkedList">
          清除坐标
        </el-button>
        <el-button type="primary" @click="okModel"> 确定 </el-button>
      </template>
      <div class="m-map">
        <div class="search">
          <el-input placeholder="请输入关键字" v-model="searchKey" clearable />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <div id="js-result" v-show="searchKey" class="result"></div>
        </div>
        <div ref="mapContainer" class="map">正在加载数据 ...</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
let myMap = null; //地图实例
export default {
  name: "",
  data() {
    return {
      markedList: [], //缓存打点数据
      markerArr: [], //缓存点标记实例，用于清除点标记

      placeSearch: null, //搜索控件
      searchKey: null, //搜索值
    };
  },
  props: {
    title: {
      type: String,
      default: "地图打点",
    },
    visible: {
      type: [Boolean, String], //dragPoint 打点  dragArr 范围打点  false 关闭
      default: false,
      validator: (val) => ["dragPoint", "dragArr", false].includes(val),
    },
    pathArrMap: {
      //传入得打点数据
      type: [Array, null],
      default: () => {
        return [];
      },
    },
    //地图中心点
    center: {
      type: [Array, null],
      default: null,
    },
  },
  computed: {
    isShow() {
      return this.visible == "dragPoint" || this.visible == "dragArr";
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.searchKey = null;
        this.initMap();
      }
    },
  },
  methods: {
    okModel() {
      if (this.markedList.length > 0) {
        this.$emit("okModel", this.markedList);
      } else {
        this.$message.warning("请点击地图选择");
      }
    },
    closeModel() {
      this.$emit("closeModal");
    },
    initMap() {
      console.log("初始化地图");
      window._AMapSecurityConfig = {
        securityJsCode: "5c3b987422852e346152ddbc04c92cac",
      };
      AMapLoader.load({
        key: "00087fb56ab65b6721d4cdbc8528c727", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.PlaceSearch"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          myMap = new AMap.Map(this.$refs.mapContainer, {
            resizeEnable: true,
            zoom: 13,
            center: [120.980795, 31.385476],
          });
          document.querySelector("#js-result").innerHTML = "";
          this.placeSearch = new AMap.PlaceSearch({
            pageSize: 5,
            pageIndex: 1,
            citylimit: true,
            city: "",
            map: myMap,
            panel: "js-result",
          });
          this.clearMarkedList();

          if (this.center && this.center.length == 2) {
            let position = new AMap.LngLat(this.center[0], this.center[1]);
            myMap.setCenter(position);
          } else if (
            this.pathArrMap &&
            this.pathArrMap != null &&
            this.pathArrMap.length > 0
          ) {
            //将传入的第一个坐标点设置为地图中心点
            let position = new AMap.LngLat(this.pathArrMap[0][0], this.pathArrMap[0][1]);
            myMap.setCenter(position);
          }
          //打点
          if (this.pathArrMap && this.pathArrMap != null && this.pathArrMap.length > 0) {
            this.pathArrMap.forEach((ele) => {
              this.addPoint(ele);
            });
          } else {
            this.markedList = [];
            this.markerArr = [];
          }
          myMap.on("click", (e) => {
            if (this.visible == "dragPoint") {
              this.clearMarkedList();
            }
            let point = [e.lnglat.getLng(), e.lnglat.getLat()];
            this.addPoint(point);
          });
          myMap.on("complete", function () {
            console.log("地图加载完成！");
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //打点
    addPoint(posion) {
      let marker = new AMap.Marker({
        position: posion,
        offset: new AMap.Pixel(-13, -30),
      });
      myMap.add(marker);
      this.markerArr.push(marker);
      this.markedList.push(posion);
    },
    //清除打点
    clearMarkedList() {
      this.markerArr.forEach((ele) => {
        myMap.remove(ele);
      });

      this.markedList = [];
      this.markerArr = [];
    },
    //搜索
    handleSearch() {
      if (this.searchKey) {
        this.placeSearch.search(this.searchKey);
      }
    },
    async init() {
      try {
        window.AMap = await loadMapJs();
        window.AMapUI = await loadMainJs();
        console.log("加载完成");
      } catch (e) {
        console.log("加载失败", e);
      }
    },
  },
  created() {
    this.init();
  },
};
</script>
<style scoped lang="css">
.m-map {
  width: 100%;
  height: 70vh;
  position: relative;
}

.m-map .map {
  width: 100%;
  height: calc(70vh - 60px);
}

.m-map .search {
  width: 400px;
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 1;
  position: relative;
}

.m-map .result {
  max-height: 300px;
  overflow: auto;
  width: 350px;
  position: absolute;
  left: 0;
  top: 50px;
}

.amap-ui-misc-positionpicker {
  display: none;
}
</style>
