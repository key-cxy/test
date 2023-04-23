<template>
    <div>
        <el-button type="primary" @click="haha()">主要按钮</el-button>
        <MapModel :visible="showMapModel" :pathArrMap="pathArr" @okModel="handleMapConfirm" @closeModal="
            () => {
                showMapModel = false;
            }
        " />
    </div>
</template>

<script>
import MapModel from "@/components/GdMap/Amap.vue";
export default {
    components: {
        MapModel
    },
    data() {
        return {
            showMapModel: false,
            pathArr: [],

        }
    },
    methods: {
        haha() {
            this.showMapModel = "dragArr";
        },
        handleMapConfirm(data) {
            this.showMapModel = false;
        },
    }

}
</script>

<style></style>