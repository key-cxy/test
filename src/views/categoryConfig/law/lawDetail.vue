<template>
  <div class="container">
    <div class="top">
      <div class="title">
        <div class="divider"></div>
        <div class="txt">{{ nameOuter }}</div>
      </div>
      <div class="content">
        <a-form
          :form="form"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-row>
            <a-col :span="8">
              <a-form-item label="法律/法规名称">
                <a-input
                  disabled
                  v-decorator="['name']"
                  placeholder="请输入法律/法规名称"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="法律/法规类型">
                <a-input
                  disabled
                  v-decorator="['type']"
                  placeholder="请输入法律/法规类型"
                /> </a-form-item
            ></a-col>
            <a-col :span="8">
              <a-form-item label="法律/法规主题">
                <a-input
                  disabled
                  v-decorator="['theme']"
                  placeholder="请输入法律/法规主题"
                /> </a-form-item
            ></a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-item label="法律/法规文号">
                <a-input
                  disabled
                  v-decorator="['docNo']"
                  placeholder="请输入法律/法规文号"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="发布机构">
                <a-input
                  disabled
                  v-decorator="['publishOrgan']"
                  placeholder="请输入发布机构"
                /> </a-form-item
            ></a-col>
            <a-col :span="8">
              <a-form-item label="发布日期">
                <a-input
                  disabled
                  v-decorator="['publishDate']"
                  placeholder="请输入发布日期"
                /> </a-form-item
            ></a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-item label="过期日期">
                <a-input
                  disabled
                  v-decorator="['expirationDate']"
                  placeholder="请输入过期日期"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="当前状态">
                <a-input disabled v-decorator="['status']" /> </a-form-item
            ></a-col>
            <a-col :span="8">
              <a-form-item label="关键词">
                <a-input disabled v-decorator="['tag']" /> </a-form-item
            ></a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-item label="当前版本">
                <a-input disabled v-decorator="['version']" /> </a-form-item
            ></a-col>
          </a-row>
        </a-form>
      </div>
      <div id="the_canvas" style="width: 95%; height: 700px; margin-top: 15px;">
        <iframe
          style="width: 100%; height: 100%"
          ref="iframeDom"
        />
      </div>
    </div>
  </div>
</template>

<script>
import * as PDFJS from "pdfjs-dist/legacy/build/pdf";
PDFJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/legacy/build/pdf.worker.entry.js");
import request from "@/utils/requestDJLD";
export default {
  data() {
    return {
      formLayout: "inline",
      form: this.$form.createForm(this, { name: "coordinated" }),
      nameOuter: "",
      src: "",
      //picUrl: procees.env.VUE_APP_DJLD_API + '/djld-platform/law/content/download?contentId=1541706829501947905&isOnLine=' + true
    };
  },
  mounted() {
    let id = this.$route.query.id;
    this.id = id;
    let formData = new FormData();
    formData.append("id", id);
    let url = "/law/info/detail";
    request({
      url,
      method: "post",
      data: formData,
    }).then((res) => {
      let data = res;
      if (data.code == 200) {
        console.log(process);
        let myData = data.data;
        this.nameOuter = myData.name;
        this.form.setFieldsValue({
          name: myData.name,
          type: myData.typeId,
          theme: myData.themeId,
          area: myData.areaId,
          docNo: myData.docNo,
          publishOrgan: myData.publishOrgan,
          publishDate: myData.publishDate,
          expirationDate: myData.expirationDate,
          status: myData.status == 0 ? "在用" : "作废",
          content: myData.content,
          tag: myData.tag,
          version: myData.version,
        });
        this.contentId = myData.contentId;
        let iframeObj = this.$refs.iframeDom;
        iframeObj.src = 'http://10.1.97.242:9034' +  "/djld-platform/law/content/download?contentId=" +
            myData.contentId +
            "&isOnLine=" + true
      }
    });
  },
};
</script>

<style lang="less" scoped>
.container {
  margin: 15px 28px;
  .top {
    .title {
      display: flex;
      align-items: center;
      .divider {
        width: 3px;
        height: 15px;
        background: #1890ff;
      }
      .txt {
        margin-left: 5px;
        color: #1890ff;
      }
    }
    .content {
      padding: 15px;
      margin-top: 15px;
      background-color: rgb(243, 249, 254);
      width: 95%;
    }
  }
  ::v-deep .ant-input,
  .ant-select {
    color: #1890ff !important;
    font-family: "Microsoft YaHei", sans-serif;
  }
}
</style>
