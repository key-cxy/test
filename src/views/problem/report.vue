<template>
  <div class="body">
    <div class="content">
      <el-form ref="form" label-position="left" :model="form" :rules="rule" label-width="150px">
        <el-row :gutter="72">
          <el-col :span="12">
            <el-form-item label="反馈人:" prop="feedbackName">
              <el-input readonly v-model="form.feedbackName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间:" prop="feedbackTime">
              <el-date-picker readonly v-model="form.feedbackTime" style="width: 100%"
                              format="yyyy-MM-dd HH:mm:ss"
                              type="datetime">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门:" prop="deptName">
              <el-input readonly v-model="form.deptName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位:" prop="postNames">
              <el-input v-model="form.postNames"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题类型:" prop="problemType">
              <el-select v-model="form.problemType" style="width: 100%" clearable placeholder="请选择">
                <el-option
                  v-for="item in problemTypeList"
                  :key="item.code"
                  :label="item.text"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题模块:" prop="problemModule">
              <el-select v-model="form.problemModule" style="width: 100%" @change="typeChange" clearable
                         placeholder="请选择">
                <el-option
                  v-for="item in belongSystemList"
                  :key="item.code"
                  :label="item.text"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单编号:" prop="caseNo">
              <el-input v-model="form.caseNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单节点:" prop="caseNode">
              <el-input v-model="form.caseNode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节点处置人账号:" prop="disposerId">
              <el-input v-model="form.disposerId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节点处置人密码:" prop="disposerPassword">
              <el-input v-model="form.disposerPassword"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期望解决时间:" prop="expectTime">
              <el-date-picker v-model="form.expectTime" style="width: 100%"
                              format="yyyy-MM-dd HH:mm:ss"
                              type="datetime">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评估解决时间:">
              <el-date-picker readonly v-model="form.hopeTime" style="width: 100%"
                              type="datetime">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际解决时间:">
              <el-date-picker readonly v-model="form.saveTime" style="width: 100%"
                              type="datetime">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否同意软件公司操作:" label-width="170px" prop="agreest">
              <el-radio v-model="form.agreest" label="是">是</el-radio>
              <el-radio v-model="form.agreest" label="否">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="问题描述:" prop="question">
              <el-input type="textarea" v-model="form.question"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="希望如何解决:" prop="hopeSolve">
              <el-input type="textarea" v-model="form.hopeSolve"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="解决方案:">
              <el-input readonly type="textarea" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="影响域分析:">
              <el-input readonly type="textarea" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="search" style="flex-direction: column">
        <div class="searchRow">
          <div class="searchCol">
            <span style="width: 90px">附件上传：</span>
            <div>
              <a-upload
                :multiple="false"
                :file-list="fileList"
                :customRequest="onUpload"
                :showUploadList="false"
              >
                <a-button>
                  <a-icon type="upload"/>
                  选择文件
                </a-button>
              </a-upload>
            </div>
            <div
              style="
                    white-space: nowrap;
                    color: rgba(0, 0, 0, 0.5);
                    font-size: 12px;
                  "
            >
              支持扩展名：.jpg等
            </div>
          </div>
          <div class="searchCol"></div>
        </div>
        <div class="searchRow">
          <div class="searchCol">
            <a-table
              :columns="columns2"
              :data-source="fileTable"
              class="components-table-demo-nested"
              :pagination="false"
            >
              <template slot="url" slot-scope="text">
                <img :src="text" style="width: 30px; height: 30px"/>
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
                    style="color: #d9001b"
                    @click="remove(record.id)"
                  >
                    删除
                  </a>
                </div>
              </template>
              <template slot="uploadTime" slot-scope="text, record">
                    <span class="tableClass" style="color: #008f4a">
                      {{
                        new Date(record.uploadTime).toLocaleString("chinese", {
                          hour12: false,
                        })
                      }}
                    </span>
              </template>
            </a-table>
          </div>
        </div>
      </div>
      <el-row type="flex" justify="space-around">
        <el-col :span="12" style="display: flex">
          <div style="align-items: center;line-height: 30px;font-size: 14px;font-weight: bolder">处置意见:</div>
          <div style="padding-left: 20px;width: 80%">
            <el-input v-model="form.opinion"></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="float: right">
            <el-button type="primary" @click="submitForm">提交</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="height: 30px"></div>
  </div>
</template>

<script>
  //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
  //例如：import 《组件名称》 from '《组件路径》';
  import {deleteFile, upload} from "@/api/eventAcceptance.js";
  import {getUserSimple} from "@/api/system/user.js";
  import {handleGetList, handleSubmit} from "@/api/problem/report.js";
  import moment from "moment";

  const uploadKey = "uploadKey";
  export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
      //这里存放数据
      return {
        rule: {
          feedbackName: [
            {required: true, message: "反馈人不能为空", trigger: "blur"}
          ],
          feedbackTime: [
            {required: true, message: "时间不能为空", trigger: "blur"}
          ],
          deptName: [
            {required: true, message: "部门不能为空", trigger: "blur"}
          ],
          postNames: [
            {required: true, message: "部门岗位不能为空", trigger: "blur"}
          ],
          problemType: [
            {required: true, message: "问题类型不能为空", trigger: "change"}
          ],
          problemModule: [
            {required: true, message: "问题模块不能为空", trigger: "change"}
          ],
          caseNo: [
            {required: true, message: "工单编号不能为空", trigger: "blur"}
          ],
          caseNode: [
            {required: true, message: "工单节点不能为空", trigger: "blur"}
          ],
          disposerId: [
            {required: true, message: "节点处置人账号不能为空", trigger: "blur"}
          ],
          disposerPassword: [
            {required: true, message: "节点处置人密码不能为空", trigger: "blur"}
          ],
          expectTime: [
            {required: true, message: "期望解决时间不能为空", trigger: "blur"}
          ],
          agreest: [
            {required: true, message: "不能为空", trigger: "change"}
          ],
          question: [
            {required: true, message: "问题描述不能为空", trigger: "blur"}
          ],
          hopeSolve: [
            {required: true, message: "希望如何解决不能为空", trigger: "blur"}
          ],
        },
        form: {
          // feedbackTime: moment(new Date()).format('YYYY-MM-DD HH:mm:SS'),
          feedbackTime: new Date(),
          feedbackId: '',
          feedbackName: '',
          deptName: '',
          agreest: '是'
        },
        columns2: [
          {
            title: "缩略图",
            dataIndex: "url",
            width: "150px",
            align: "center",
            scopedSlots: {customRender: "url"},
          },
          {
            title: "流程节点",
            dataIndex: "eventNode",
            key: "eventNode",
            align: "center",
          },
          {
            title: "上传人",
            dataIndex: "uploadName",
            key: "uploadName",
            align: "center",
            customRender: (text, record) => {
              return (
                < span
            class
              = "tableClass"
              style = "color: #008F4A" >
                {
              {
                text
              }
            }
            <
              /span>
            )
              ;
            },
          },
          {
            title: "上传时间",
            key: "uploadTime",
            align: "center",
            scopedSlots: {customRender: "uploadTime"},
          },
          {
            title: "附件类型",
            dataIndex: "fileType",
            key: "fileType",
            align: "center",
          },
          {
            title: "操作",
            key: "operation",
            align: "center",
            scopedSlots: {customRender: "fileOperation"},
          },
        ],
        fileTable: [],
        fileList: [],
        problemTypeList: [],
        belongSystemList: [],
        fileType: "现场照片",
      };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
      getUserProfile() {
        getUserSimple().then(res => {
          this.form.feedbackId = res.data.userId
          this.form.feedbackName = res.data.name
          this.form.deptId = res.data.deptId
          this.form.deptName = res.data.deptName
        })
      },
      handleGetList() {
        const data = {
          "dictTable": "DataDictionary",
          "dictCode": "FeedBackProblemType"
        }
        const data1 = {
          "dictTable": "DataDictionary",
          "dictCode": "belongSystem"
        }
        handleGetList(data).then(res => {
          this.problemTypeList = res.list
        })
        handleGetList(data1).then(res => {
          this.belongSystemList = res.list
        })
      },
      typeChange(e) {
        if (e) {
          const list = this.belongSystemList.filter(item => {
            if (item.code == e) {
              return item
            }
          })
          this.form.problemModuleName = list[0].text
          console.log(this.form.problemModuleName)
        }
      },
      onUpload(info) {
        this.$message.loading({
          content: "上传中...",
          duration: 0,
          key: uploadKey,
        });
        let formData = new FormData();
        formData.append("file", info.file);
        formData.append("eventNode", "受理");
        formData.append("caseNo", "");
        formData.append("fileType", this.fileType);
        upload(formData)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success({
                content: "上传成功",
                key: uploadKey,
                duration: 2,
              });
              this.fileTable.push(res.data);
            }
          })
          .catch((err) => {
            this.$message.error({
              content: "上传失败",
              key: uploadKey,
              duration: 2,
            });
          });
      },
      downLoad(fileId, fileName) {
        console.log(fileId, fileName);
        const a = document.createElement("a");
        a.href =
          `/com-djld-platform/djld-platform/comDjldPlatform/register-material/fdfsDownload?fileId=` +
          fileId;
        a.download = fileName;
        console.log(a.href);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      remove(id) {
        deleteFile(id).then((res) => {
          if (res.code == 200) {
            this.$message.success({
              content: "附件删除成功",
              duration: 2,
            });
            let index = -1;
            this.fileTable.forEach((item, i) => {
              if (item.id == id) {
                index = i;
                return;
              }
            });
            this.fileTable.splice(index, 1);
          }
        });
      },
      submitForm: function () {
        if(!this.form.opinion){
          this.$modal.msgError("处置意见不能为空！");
          return
        }
        this.$refs["form"].validate(valid => {
          if (valid) {
            let fileIds = [];
            this.fileTable.map((item) => {
              fileIds.push(item.id);
            });
            this.form.feedbackTime = moment(this.form.feedbackTime).format('YYYY-MM-DD HH:mm:SS')
            this.form.expectTime = moment(this.form.expectTime).format('YYYY-MM-DD HH:mm:SS')
            const data = {
              "feedbackProblemInfo":{
                ...this.form,
                fileIds
              }
            }
            handleSubmit(data).then(res => {
              this.$modal.msgSuccess("反馈成功");
              this.form = {
                // feedbackTime: moment(new Date()).format('YYYY-MM-DD HH:mm:SS'),
                feedbackTime: new Date(),
                  feedbackId: '',
                  feedbackName: '',
                  deptName: '',
                  agreest: '是'
              }
              this.getUserProfile()
            })
          }
        })
      }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.handleGetList()
      this.getUserProfile()
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
    },
    beforeCreate() {
    }, //生命周期 - 创建之前
    beforeMount() {
    }, //生命周期 - 挂载之前
    beforeUpdate() {
    }, //生命周期 - 更新之前
    updated() {
    }, //生命周期 - 更新之后
    beforeDestroy() {
    }, //生命周期 - 销毁之前
    destroyed() {
    }, //生命周期 - 销毁完成
    activated() {
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  };
</script>
<style lang="less" scoped>
  .content {
    padding-top: 30px;
    margin: auto;
    width: 90%;

    .search {
      /*background-color: rgb(243, 249, 254);*/
      width: 100%;
      display: flex;
      align-items: center;
      /*padding: 7px 25px 16px;*/
      justify-content: space-between;
      /*margin-top: 10px;*/
      margin-bottom: 10px;

      .searchItem {
        display: flex;
        margin-right: 10px;
        align-items: center;
        flex: 1;

        div {
          flex: 1;
        }

        span {
          /*width: 85px;*/
          text-align: right;
        }
      }

      .searchRow {
        width: 100%;
        display: flex;
        margin-top: 18px;

        .searchCol {
          display: flex;
          /*margin-right: 30px;*/
          align-items: center;
          flex: 1;

          span {
            /*width: 85px;*/
            text-align: right;
          }

          div {
            flex: 1;
          }
        }
      }
    }

  }
</style>
