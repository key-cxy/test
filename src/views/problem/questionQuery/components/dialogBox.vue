<template>
  <div class="action-box" ref="action-box">
    <my-dialog
      title="问题详情"
      width="100%"
      :visible.sync="isShowWarehouse"
      :modal="false"
    >
      <a-form-model :model="checkItem" ref="ruleForm">
        <a-row :gutter="24">
          <a-col :span="16">
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item
                  label="单号"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.caseNo" readonly></Input>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="时间"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.feedbackTime" readonly></Input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item
                  label="反馈人"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.feedbackName" readonly></Input>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="岗位"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.postNames" readonly></Input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item
                  label="部门"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.deptName" readonly></Input>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="问题模块"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.problemModuleName" readonly></Input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item
                  label="问题类型"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.problemType" readonly></Input>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="工单节点"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.caseNode" readonly></Input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item
                  label="工单编号"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.caseNo" readonly></Input>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="节点处置人密码"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.disposerPassword" readonly></Input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item
                  label="节点处置人账号"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.disposerId" readonly></Input>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="评估解决时间"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.planTime" readonly></Input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item
                  label="期望解决时间"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.expectTime" readonly></Input>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  label="是否同意软件公司操作"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.agreest" readonly></Input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item
                  label="实际解决时间"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                >
                  <Input v-model="checkItem.actualTime" readonly></Input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item
                  label="问题描述"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                >
                  <Input
                    type="textarea"
                    v-model="checkItem.question"
                    readonly
                  ></Input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item
                  label="希望如何解决"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                >
                  <Input
                    type="textarea"
                    v-model="checkItem.hopeSolve"
                    readonly
                  ></Input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item
                  label="解决方案"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                >
                  <Input
                    type="textarea"
                    v-model="checkItem.solveProject"
                    readonly
                  ></Input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-model-item
                  label="影响域分析"
                  prop="storageName"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                >
                  <Input
                    type="textarea"
                    v-model="checkItem.yxyAnalysis"
                    readonly
                  ></Input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item
                  label="附件材料"
                  prop="storageName"
                  :label-col="{ span: 4 }"
                  :wrapper-col="{ span: 20 }"
                >
                  <a-table
                    :columns="columns"
                    :data-source="fileTable"
                    class="components-table-demo-nested"
                    :pagination="false"
                  >
                    <template slot="url" slot-scope="text">
                      <img
                        @click="changeImg(text)"
                        :src="text"
                        style="width: 30px; height: 30px"
                      />
                    </template>

                    <template slot="uploadTime" slot-scope="text, record">
                      <span class="tableClass" style="color: #008f4a">
                        {{
                          new Date(record.uploadTime).toLocaleString(
                            'chinese',
                            {
                              hour12: false
                            }
                          )
                        }}
                      </span>
                    </template>
                  </a-table>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <div class="eventInfo">
              <div class="title">
                <div class="divider"></div>
                <div
                  class="txt"
                  style="font-size: 24px; font-weight: 700; color: #1890ff"
                >
                  反馈进度
                </div>
              </div>
            </div>
            <div style="padding-top: 16px">
              <a-timeline>
                <a-timeline-item
                  v-for="(item, index) in processList"
                  :key="item.id"
                  :color="colors[index]"
                >
                  <div>
                    <div
                      class="node"
                      style="font-size: 16px; font-weight: 600; color: #1890ff"
                    >
                      {{ item.eventNode }}
                    </div>
                    <div class="processItem">
                      收到时间：{{ new Date(item.createTime).toLocaleString() }}
                    </div>
                    <div class="processItem">
                      处置时间：{{
                        item.startTime
                          ? new Date(item.startTime).toLocaleString()
                          : ''
                      }}
                    </div>
                    <div class="processItem">
                      处置人员：{{ item.disposerName }}
                    </div>
                    <div class="processItem">
                      处置意见：{{ item.processOpinion }}
                    </div>
                  </div>
                </a-timeline-item>
              </a-timeline>
            </div>
          </a-col>
        </a-row>
      </a-form-model>
    </my-dialog>
  </div>
</template>

<script>
import myDialog from '@/views/eventManage/cpns/my-dialog'

import { mapActions } from 'vuex'
import { message } from 'ant-design-vue'

export default {
  name: 'dialogBox',
  components: {
    myDialog
  },
  data() {
    return {
      form: this.$form.createForm(this),
      isShowWarehouse: false,
      checkItem: {},
      processList: [],
      columns: [
        {
          title: '缩略图',
          dataIndex: 'url',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'url' }
        },
        {
          title: '流程节点',
          dataIndex: 'eventNode',
          key: 'eventNode',
          align: 'center'
        },
        {
          title: '上传人',
          dataIndex: 'uploadName',
          key: 'uploadName',
          align: 'center',
          customRender: (text, record) => {
            return (
              <span class="tableClass" style="color: #008F4A">
                {{ text }}
              </span>
            )
          }
        },
        {
          title: '上传时间',
          key: 'uploadTime',
          align: 'center',
          scopedSlots: { customRender: 'uploadTime' }
        },
        {
          title: '附件类型',
          dataIndex: 'fileType',
          key: 'fileType',
          align: 'center'
        }
      ],
      fileTable: [],
      colors: ['green', 'red', 'gray', 'orange', 'yellow', 'blue', 'purple']
    }
  },

  methods: {
    ...mapActions({
      handleGetDetail: 'questionQuery/handleGetDetail'
    }),
    showBox(isShow, val) {
      this.isShowWarehouse = isShow
      this.handleGetDetail({
        taskNo: val.taskNo,
        processInstanceId: val.processInstanceId
      }).then((res) => {
        console.log(res)
        this.checkItem = res.data.feedbackProblemInfo
        this.processList = res.data.processList
        if (res.data.materialIdList) {
          let newMaterialList = res.data.materialIdList.map((item) => {
            item.disabled = true
            return item
          })
          this.fileTable = newMaterialList || []
        }
      })
    },
    changeImg(text) {
      this.imgVisible = true
      this.imgSrc = text
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-modal-footer {
  display: flex !important;
  justify-content: center !important;
}
.archive {
  position: absolute;
  left: 20px;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.rules {
  font-size: 13px;
  flex-direction: column-reverse;
  display: flex;
}
/deep/ .ant-radio-button-wrapper {
  margin: 8px !important;
}
/deep/ .ant-modal-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  .el-dialog {
    margin-top: 0px !important;
  }
}
.action-box {
  /deep/ .ant-modal {
    top: 0px;
    overflow: auto;
    padding-bottom: 0px;
    .ant-modal-body {
      padding: 24px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
      height: 70vh;
      overflow: auto;
      .ant-form input[type='file'] {
        display: none !important;
      }
      .el-dialog {
        top: 20vh;
        .el-dialog__body {
          display: flex;
          justify-content: center;
          img {
            width: 400px;
            height: 400px;
          }
        }
      }
    }
    .ant-modal-centered:before {
      height: 0px !important;
    }
  }
}
</style>
