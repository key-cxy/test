<template>
  <div class="searchBox">
    <a-form
      :form="form"
      @submit="handleSubmit"
      @keyup.enter.native="handleSubmit"
    >
      <a-row :gutter="12">
        <a-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
          <a-form-item
            label="问题类型"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 15 }"
          >
            <a-select
              allowClear
              style="width: 100%"
              placeholder="请选择"
              v-decorator="['problemType']"
            >
              <a-select-option
                v-for="(item, index) in problemTypeList"
                :value="item.code"
                :key="index"
                >{{ item.text }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
          <a-form-item
            label="关键字"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-input
              v-decorator="[
                'keywords',
                {
                  rules: [
                    {
                      pattern: /^[^\s]{0,20}$/,
                      message: '仅限20位以内且不能存在空格！'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
          <a-form-item
            label="功能模块"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-select
              allowClear
              style="width: 100%"
              placeholder="请选择"
              v-decorator="['problemModule']"
            >
              <a-select-option
                v-for="(item, index) in problemModuleList"
                :value="item.code"
                :key="index"
                >{{ item.text }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
          <a-form-item
            label="时间范围"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-range-picker
              :key="resetEnd"
              :popupStyle="{ 'border-radius': '4px' }"
              format="YYYY/MM/DD"
              @change="(timeRange) => resetTime(timeRange, 'resetEnd')"
              v-decorator="['searchDates']"
            ></a-range-picker>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="12">
        <a-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
          <a-form-item
            label="问题提出人"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 15 }"
          >
            <a-input
              v-decorator="[
                'feedbackName',
                {
                  rules: [
                    {
                      pattern: /^[^\s]{0,20}$/,
                      message: '仅限20位以内且不能存在空格！'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="submit">
        <a-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
          <a-form-item>
            <div class="btn-area">
              <a-button class="btn" type="primary" html-type="submit"
                >查询</a-button
              >
              <a-button class="btn" @click="handleReset">重置</a-button>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'searchBox',
  data() {
    return {
      form: this.$form.createForm(this),
      problemModuleList: [],
      problemTypeList: [],
      resetEnd: Math.random()
    }
  },
  mounted() {
    this.handleProblemList({
      dictTable: 'DataDictionary',
      dictCode: 'FeedBackProblemType'
    }).then((res) => {
      this.problemTypeList = res.list || []
    })
    this.handleProblemList({
      dictTable: 'DataDictionary',
      dictCode: 'belongSystem'
    }).then((res) => {
      this.problemModuleList = res.list || []
    })
  },
  methods: {
    ...mapActions({
      handleSearchInfo: 'questionQuery/handleSearchInfo',
      handlePageData: 'questionQuery/handlePageData',
      handleProblemList: 'questionQuery/handleProblemList'
    }),
    handleReset() {
      this.form.resetFields()
      this.handleSearchInfo({}).then(() => {
        this.handlePageData()
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values['searchDates']) {
            values['startDate'] = moment(values.searchDates[0]).format(
              'YYYY-MM-DD'
            )
            values['endDate'] = moment(values.searchDates[1]).format(
              'YYYY-MM-DD'
            )
          }
          delete values.searchDates
          for (const key in values) {
            values[key] === undefined && delete values[key]
          }
          this.handleSearchInfo(values).then(() => {
            this.handlePageData()
          })
        }
      })
    },
    // 删除时间段时清空时间入参
    resetTime(timeRange, type) {
      !timeRange.length && (this[type] = Math.random())
    }
  }
}
</script>

<style lang="scss" scoped>
.searchBox {
  background: #fff;
  padding-top: 12px;

  .btn-area {
    text-align: center;

    .btn {
      margin: 0 6px;
    }
  }
}

.submit {
  display: flex;
  justify-content: center;

  .ant-btn-primary {
  }
}
</style>
