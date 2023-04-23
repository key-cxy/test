<template>
  <div class="action-box" ref="action-box">
    <my-dialog
      title="问题详情"
      width="100%"
      :visible.sync="isShowWarehouse"
      :modal="false"
      @close="handleClose"
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
                  <DatePicker
                    type="date"
                    v-model="checkItem.planTime"
                    :format="'yyyy-MM-dd HH:mm:ss'"
                    @on-change="checkItem.planTime = $event"
                    placeholder="评估解决时间"
                    style="width: 100%"
                  ></DatePicker>
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
                  ></Input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item
                  label="附件上传"
                  prop="storageName"
                  :label-col="{ span: 4 }"
                  :wrapper-col="{ span: 20 }"
                >
                  <div>
                    <a-upload
                      :multiple="false"
                      :file-list="fileList"
                      :customRequest="onUpload"
                      :showUploadList="false"
                    >
                      <a-button> <a-icon type="upload" /> 选择文件 </a-button>
                    </a-upload>
                  </div>
                  <div
                    style="
                      white-space: nowrap;
                      color: rgba(0, 0, 0, 0.5);
                      font-size: 12px;
                    "
                  >
                    支持扩展名：.rar .zip .doc .docx .pdf .jpg等
                  </div>
                </a-form-model-item>

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
                    <template slot="fileOperation" slot-scope="text, record">
                      <div style="display: flex; justify-content: space-around">
                        <a
                          href="javascript:;"
                          @click="downLoad(record.id, record.fileName)"
                          style="color: #1890ff"
                        >
                          下载
                        </a>
                        <a
                          href="javascript:;"
                          @click="remove(record.id, record.disabled)"
                          :disabled="record.disabled"
                          :class="
                            record.disabled ? 'delteDisabled' : 'delteabled'
                          "
                        >
                          删除
                        </a>
                      </div>
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
import { upload } from '@/api/eventAcceptance.js'

import { mapActions } from 'vuex'
import { message } from 'ant-design-vue'
const uploadKey = 'uploadKey'
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
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'fileOperation' }
        }
      ],
      fileTable: [],
      colors: ['green', 'red', 'gray', 'orange', 'yellow', 'blue', 'purple'],
      fileList: [],
      resetEnd: Math.random()
    }
  },

  methods: {
    ...mapActions({
      handleGetDetail: 'questionHandle/handleGetDetail',
      handleQuestion: 'questionHandle/handleQuestion',
      handlePageData: 'questionHandle/handlePageData'
    }),
    async showBox(isShow, { taskNo, processInstanceId }) {
      this.isShowWarehouse = isShow
      const { data: res } = await this.handleGetDetail({
        taskNo,
        processInstanceId
      })
      this.checkItem = res.feedbackProblemInfo
      this.processList = res.processList
      this.$emit('handleBtns', res.buttonList)
      if (res.materialIdList) {
        let newMaterialList = res.materialIdList.map((item) => {
          item.disabled = true
          return item
        })
        this.fileTable = newMaterialList || []
      }
    },
    handleOk(btnInfo, opinion) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            feedbackProblemInfo: {
              processInstanceId: this.checkItem.processInstanceId,
              caseNo: this.checkItem.caseNo,
              opinion,
              yxyAnalysis: this.checkItem.yxyAnalysis,
              solveProject: this.checkItem.solveProject,
              planTime: this.checkItem.planTime
            },

            bpmConfig: btnInfo
          }
          this.handleQuestion(params)
            .then((res) => {
              this.isShowWarehouse = false
              this.handlePageData()

              this.$emit('closeHandle')
              if (res.code === 200) {
                message.success('问题处置成功~')
              } else {
                message.error('问题处置失败~')
              }

              this.$emit('freshEdit', 'randomEdit')
            })
            .catch((err) => {
              this.isShowWarehouse = false

              this.$emit('closeHandle')
              this.$emit('freshEdit', 'randomEdit')
              message.error('问题处置失败~')
            })
            .finally(() => {
              this.isShowWarehouse = false
            })
        }
      })
    },
    changeImg(text) {
      this.imgVisible = true
      this.imgSrc = text
    },
    handleClose() {
      this.$emit('closeHandle')
    },
    onUpload(info) {
      this.$message.loading({
        content: '上传中...',
        duration: 0,
        key: uploadKey
      })
      let formData = new FormData()
      formData.append('file', info.file)
      formData.append('eventNode', '上报')
      // formData.append("caseNo", this.$route.query.caseNo);
      formData.append('caseNo', this.checkItem.caseNo)
      formData.append('fileType', 2)
      upload(formData)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success({
              content: '上传成功',
              key: uploadKey,
              duration: 2
            })
            this.fileTable.push(res.data)
          }
        })
        .catch((err) => {
          this.$message.error({
            content: '上传失败',
            key: uploadKey,
            duration: 2
          })
        })
    },
    downLoad(fileId, fileName) {
      const a = document.createElement('a')
      // a.href = `/DjldOnline/djld-platform/comDjldPlatform/register-material/download?fileId=${fileId}&isOnLine=true`;
      a.href =
        `/com-djld-platform/djld-platform/comDjldPlatform/register-material/fdfsDownload?fileId=` +
        fileId
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)
    },
    remove(id, disabled) {
      if (disabled) {
        return
      }
      let index = -1
      this.fileTable.forEach((item, index) => {
        if (item.id == id) {
          index = index
          return
        }
      })
      this.fileTable.splice(index, 1)
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
