<template>
  <div class="container">
    <h3>编辑法律/法规</h3>
    <div style="width: 100%">
      <a-form
        :form="form"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 10 }"
        @submit="handleSubmit"
      >
        <a-form-item label="法律/法规名称">
          <a-input
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入法律/法规名称!' }],
              },
            ]"
            placeholder="请输入法律/法规名称"
          />
        </a-form-item>
        <a-form-item label="法律/法规类型">
          <a-tree-select
            v-decorator="[
              'type',
              {
                rules: [{ required: true, message: '请选择法律/法规类型!' }],
              },
            ]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="typeList"
            placeholder="请选择法律/法规类型"
            allow-clear
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item label="法律/法规主题">
          <a-tree-select
            v-decorator="[
              'theme',
              {
                rules: [{ required: true, message: '请选择法律/法规主题!' }],
              },
            ]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="themList"
            placeholder="请选择法律/法规主题"
            allow-clear
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item label="法律/法规地区">
          <a-tree-select
            v-decorator="[
              'area',
              {
                rules: [{ required: true, message: '请选择法律/法规地区!' }],
              },
            ]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="areaList"
            placeholder="请选择法律/法规地区"
            allow-clear
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item label="法律/法规文号">
          <a-input
            disabled
            v-decorator="[
              'docNo',
              {
                rules: [{ required: true, message: '请输入法律/法规文号!' }],
              },
            ]"
            placeholder="请输入法律/法规名称"
          />
        </a-form-item>
        <a-form-item label="发布机构">
          <a-input
            v-decorator="[
              'publishOrgan',
              {
                rules: [{ required: true, message: '请输入发布机构!' }],
              },
            ]"
            placeholder="请输入发布机构"
          />
        </a-form-item>
        <a-form-item label="发布日期">
          <a-locale-provider :locale="locale">
            <a-date-picker
              style="width: 100%"
              v-decorator="[
                'publishDate',
                {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: '请输入发布日期!',
                    },
                  ],
                },
              ]"
            />
          </a-locale-provider>
        </a-form-item>
        <a-form-item label="过期日期" style="position: relative">
          <a-locale-provider :locale="locale">
            <a-date-picker
              style="width: 100%"
              v-decorator="['expirationDate']"
            />
          </a-locale-provider>
          <span style="position: absolute; right: -150px"
            >（若不选，则无期限）</span
          >
        </a-form-item>
        <a-form-item label="当前状态">
          <a-radio-group v-decorator="['status', { initialValue: 0 }]">
            <a-radio :value="0"> 在用 </a-radio>
            <a-radio :value="1"> 作废 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="关键词">
          <a-input
            v-decorator="[
              'tag',
              {
                rules: [{ required: true, message: '请输入关键词!' }],
              },
            ]"
            placeholder="请输入关键词"
          />
        </a-form-item>
        <a-form-item label="当前版本">
          <a-input
            v-decorator="[
              'version',
              {
                rules: [{ required: true, message: '请输入当前版本!' }],
              },
            ]"
            placeholder="请输入当前版本"
          />
        </a-form-item>
        <a-form-item label="上传法律文档">
          <a-upload
            name="file"
            :multiple="false"
            :action="action"
            :headers="headers"
            @change="handleChange"
            :file-list="fileList"
            accept=".doc,.pdf,.docx"
          >
            <a-button> <a-icon type="upload" /> 文件上传</a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
          :wrapper-col="{ span: 12, offset: 5 }"
          style="display: flex; justify-content: center"
        >
          <a-button @click="back" style="margin-right: 50px"> 返回 </a-button>
          <a-button type="primary" html-type="submit"> 修改 </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import locale from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import request from "@/utils/requestDJLD";
export default {
  name: "lawEdit",
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated1" }),
      id: "",
      locale,
      treeData: [],
      themList: [],
      typeList: [],
      areaList: [],
      fileList: [],
      action: "/DjldOnline/djld-platform/law/content/add",
      headers: {},
    };
  },
  methods: {
    handleChange(info) {
      let fileList = [...info.fileList];

      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-1);

      // 2. read from response and show file link
      fileList = fileList.map(file => {
        if (file.response) {
          file.contentId = file.response.data.id
        }
        return file;
      });

      this.fileList = fileList;
    },
    getThemeList() {
      let url = "/law/theme/tree?parentTypeId=0";
      request({
        url,
        method: "get",
      })
        .then((res) => {
          let data = res;
          if (data.code == 200) {
            let list = data.data;
            let themList = this.convertToTreeData(list, 1);
            this.themList = themList;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getTypeList() {
      let url = "/law/type/tree?parentTypeId=0";
      request({
        url,
        method: "get",
      })
        .then((res) => {
          let data = res;
          if (data.code == 200) {
            let list = data.data;
            let typeList = this.convertToTreeData(list, 2);
            this.typeList = typeList;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAreaList() {
      let url = "/law/area/tree?parentTypeId=0";
      request({
        url,
        method: "get",
      })
        .then((res) => {
          let data = res;
          if (data.code == 200) {
            let list = data.data;
            let areaList = this.convertToTreeData(list, 3);
            this.areaList = areaList;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          if (this.fileList.length == 0) {
            this.$message.warning('请上传文件');
            return;
          }
          let form = {
            ...values,
            id: this.id,
            contentId: this.fileList[0].contentId,
            publishDate: values["publishDate"].format("YYYY-MM-DD"),
            expirationDate: values["expirationDate"]
              ? values["expirationDate"].format("YYYY-MM-DD")
              : null,
          };
          let url = "/law/info/edit";
          request({
            url,
            method: "post",
            data: JSON.stringify(form),
          }).then((res) => {
            let data = res;
            if (data.code == 500) {
              this.form.setFields({
                docNo: {
                  errors: [new Error(data.msg)],
                },
              });
              this.$Notice.error({
                title: "修改失败:" + data.msg,
              });
            }
            if (data.code == 200) {
              this.$Notice.success({
                title: "修改成功",
              });
              this.resetForm();
              this.$router.push({
                path: "/categoryConfig/law/lawConfig",
              });
            }
          });
        }
      });
    },
    handleSelectChange(value) {
      console.log(value);
      this.form.setFieldsValue({
        note: `Hi, ${value === "male" ? "man" : "lady"}!`,
      });
    },
    resetForm() {
      this.form.resetFields();
      // this.form.setFieldsValue({
      //   name: "",
      //   type: "",
      //   theme: "",
      //   area: "",
      //   doc_no: "",
      //   publish_organ: "",
      //   publish_date: "",
      //   expiration_date: "",
      //   status: 0,
      //   content: "",
      //   tag: "",
      //   version: "",
      // });
    },
    back() {
      this.$router.push({
        path: "/categoryConfig/law/lawConfig",
      });
    },
    convertToTreeData(data, type) {
      let returnData = [];
      for (let i = 0; i < data.length; i++) {
        let tempObj = {
          title:
            type == 1 ? data[i].theme : type == 2 ? data[i].type : data[i].area,
          value: data[i].id,
          key: data[i].id,
        };
        if ("children" in data[i] && data[i].children.length > 0) {
          tempObj.children = this.convertToTreeData(data[i].children, type);
        }
        returnData.push(tempObj);
      }
      return returnData;
    },
  },
  created() {
    this.getThemeList();
    this.getTypeList();
    this.getAreaList();
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
        let myData = data.data;
        this.form.setFieldsValue({
          name: myData.name,
          type: myData.typeId,
          theme: myData.themeId,
          area: myData.areaId,
          docNo: myData.docNo,
          publishOrgan: myData.publishOrgan,
          publishDate: myData.publishDate ? moment(myData.publishDate) : null,
          expirationDate: myData.expirationDate
            ? moment(myData.expirationDate)
            : null,
          status: myData.status,
          tag: myData.tag,
          version: myData.version,
        });
        this.fileList = [
          {
            uid: myData.contentId,
            name: myData.fileName,
            status: "done",
            url: myData.filePath,
            contentId: myData.contentId,
          },
        ];
      }
    });
    console.log(this.$route.query);
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    font-weight: 800;
  }
}
::v-deep .ant-input,
.ant-select {
  color: #1890ff !important;
  font-family: "Microsoft YaHei", sans-serif;
}
</style>
