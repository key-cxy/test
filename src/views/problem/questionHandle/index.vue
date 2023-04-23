<template>
  <div class="container">
    <a-spin :spinning="loading">
      <Card :dis-hover="true">
        <search-box />
      </Card>
      <Card :dis-hover="true" style="margin-top: 10px">
        <table-box @showDetail="showDetail" />
      </Card>
      <dialog-box
        :key="randomEdit"
        @freshEdit="freshEdit"
        @closeHandle="closeHandle"
        @handleBtns="handleBtns"
        ref="dialogBox"
      />
      <div class="footerHandle" v-if="isShowHandle && btnList.length">
        <div class="handleInput" v-if="btnList[0].condition == 'dafen'">
          <div style="width: 120px">打分：</div>
          <InputNumber :max="100" :min="0" v-model="grade" />
        </div>
        <div class="handleInput" v-else>
          <div style="width: 120px">处理意见：</div>
          <el-input
            placeholder="请输入内容"
            v-model="opinion"
            clearable
          ></el-input>
        </div>

        <div class="handleButton">
          <el-button
            size="small"
            type="primary"
            v-for="item in btnList"
            :key="item.id"
            @click="handleProblem(item)"
          >
            {{ item.buttonName }}
          </el-button>
          <!-- <el-button size="small" type="success" @click="downLoadAll">
            提交
          </el-button> -->
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import searchBox from './components/searchBox.vue'
import tableBox from './components/tableBox.vue'
import dialogBox from './components/dialogBox.vue'

import { mapState, mapActions } from 'vuex'
export default {
  name: 'index',
  components: {
    searchBox,
    tableBox,
    dialogBox
  },
  data() {
    return {
      randomEdit: Math.random(),
      isShowHandle: false,
      btnList: [],
      opinion: '',
      grade: null
    }
  },
  computed: {
    ...mapState({
      loading: (state) => state.questionHandle.loading,
      total: (state) => state.questionHandle.total
    })
  },
  mounted() {},
  methods: {
    ...mapActions({
      handleDownLoad: 'questionHandle/handleDownLoad',
      handleDownLoadAll: 'questionHandle/handleDownLoadAll'
    }),
    showDetail(record, isShowHandle) {
      this.$refs.dialogBox.showBox(true, record)
      isShowHandle && (this.isShowHandle = isShowHandle)
    },
    handleBtns(list) {
      this.btnList = list
    },
    closeHandle() {
      console.log(111)
      this.isShowHandle = false
      this.btnList = []
      this.opinion = ''
    },
    downLoad() {
      this.handleDownLoad()
    },
    downLoadAll() {
      this.handleDownLoadAll()
    },
    freshEdit(module) {
      this[module] = Math.random()
    },
    handleProblem(btnInfo) {
      if (
        this.btnList[0].condition == 'dafen' &&
        (this.grade == null || this.grade == undefined)
      ) {
        return this.$notify({
          position: 'top-left',
          type: 'warning',
          title: '提示',
          message: '请先打分'
        })
      } else if (!this.opinion) {
        return this.$notify({
          position: 'top-left',
          type: 'warning',
          title: '提示',
          message: '请填写处理意见~'
        })
      }

      this.$refs.dialogBox.handleOk(btnInfo, this.opinion)
    }
  }
}
</script>

<style lang="less" scoped>
.footerHandle {
  height: 60px;

  z-index: 9999999999;
  position: fixed;
  bottom: 10px;
  right: 60px;
  left: 220px;

  display: flex;
  align-items: center;
  justify-content: space-around;

  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 20px;

  .handleInput {
    display: flex;
    align-items: center;
  }
}
.container {
  position: relative;
  padding: 16px 24px;
  background-color: #f0f2f5;

  // height: calc(100vh - 0.26042rem - 0.17708rem);
  overflow-y: auto;
  overflow-x: hidden;
}
.footer {
  z-index: 9999999999;
  position: fixed;
  bottom: 0;
  right: 0;

  left: 200px;
  padding: 12px 0;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #eaeaea;
  background-color: white;
  button {
    color: #ffffff;
    margin-right: 15px;
  }
  .downLoadAll {
    cursor: pointer;
  }
}
</style>
