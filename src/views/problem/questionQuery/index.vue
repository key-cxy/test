<template>
  <div class="container">
    <a-spin :spinning="loading">
      <Card :dis-hover="true">
        <search-box />
      </Card>
      <Card :dis-hover="true" style="margin-top: 10px">
        <table-box @showDetail="showDetail" />
      </Card>
      <dialog-box :key="randomEdit" @freshEdit="freshEdit" ref="dialogBox" />
      <!-- <div class="footer">
      <a-button size="small" type="primary" @click="downLoad">
        导出当前页
      </a-button>
      <a-button size="small" type="primary" @click="downLoadAll">
        {{ `导出全部（${total}）` }}
      </a-button>
    </div> -->
    </a-spin>
  </div>
</template>

<script>
import searchBox from './components/searchBox.vue'
import tableBox from './components/tableBox.vue'
import dialogBox from '@/views/problem/questionQuery/components/dialogBox'

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
      randomEdit: Math.random()
    }
  },
  computed: {
    ...mapState({
      loading: (state) => state.questionQuery.loading,
      total: (state) => state.questionQuery.total
    })
  },
  mounted() {},
  methods: {
    ...mapActions({
      handleDownLoad: 'questionQuery/handleDownLoad',
      handleDownLoadAll: 'questionQuery/handleDownLoadAll'
    }),
    showDetail(record) {
      this.$refs.dialogBox.showBox(true, record)
    },
    downLoad() {
      this.handleDownLoad()
    },
    downLoadAll() {
      this.handleDownLoadAll()
    },
    freshEdit(module) {
      this[module] = Math.random()
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  padding: 16px 24px;
  background-color: #f0f2f5;
  // height: calc(100vh - 0.26042rem - 0.17708rem);
  overflow-y: auto;
  overflow-x: hidden;
}
.footer {
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
