<template>
  <div class="container">
    <div class="topContent">
      <div class="title">
        <div class="divider"></div>
        <div class="txt">查询条件</div>
      </div>
      <div class="search">
        <div class="searchItem">
          <span>法律/法规名称：</span>
          <div>
            <a-input v-model="name"></a-input>
          </div>
        </div>
        <div class="searchItem">
          <span>法律/法规类型：</span>
          <div>
            <a-tree-select
              v-model="typeId"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="typeList"
              placeholder="请选择法律/法规类型"
              allow-clear
              tree-default-expand-all
            >
            </a-tree-select>
          </div>
        </div>
        <div class="searchItem">
          <span>法律/法规主题：</span>
          <div>
          <a-tree-select
            v-model="themeId"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="themList"
            placeholder="请选择法律/法规主题"
            allow-clear
            tree-default-expand-all
          >
          </a-tree-select>
          </div>
        </div>
        <div class="searchItem" style="justify-content: center">
          <a-button @click="inquery" style="margin-right: 20px">查询</a-button>
          <a-button @click="add" type="primary">新增</a-button>
        </div>
      </div>
    </div>
    <div class="bottomContent">
      <div class="title">
        <div class="divider"></div>
        <div class="txt">查询结果</div>
      </div>
      <div class="content">
        <a-table
          :columns="columns"
          :data-source="records"
          :pagination="pagination"
        >
          <span slot="idAction" slot-scope="text, record">
            <a
              @click="editInfo(record.id)"
              style="cursor: pointer; color: #1890ff"
              >{{ record.id }}</a
            >
          </span>
          <span slot="action" slot-scope="text, record">
            <a @click="edit(record.id)" style="cursor: pointer">编辑</a>
            <a-popconfirm
              v-if="records.length"
              title="是否确认删除?"
              @confirm="() => onDelete(record.id)"
            >
              <a style="cursor: pointer; margin-left: 8px">删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/requestDJLD";
const columns = [
  {
    title: "编号",
    key: "id",
    scopedSlots: { customRender: "idAction" },
    ellipsis: true,
  },
  {
    title: "法律/法规名称",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
  },
  {
    title: "类型",
    key: "type",
    dataIndex: "type",
  },
  {
    title: "主题",
    key: "theme",
    dataIndex: "theme",
    ellipsis: true,
  },
  {
    title: "法律/法规文号",
    key: "docNo",
    dataIndex: "docNo",
    ellipsis: true,
  },
  {
    title: "发布机构",
    key: "publishOrgan",
    dataIndex: "publishOrgan",
    ellipsis: true,
  },
  {
    title: "发布日期",
    key: "publishDate",
    dataIndex: "publishDate",
  },
  {
    title: "版本",
    key: "version",
    dataIndex: "version",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  data() {
    return {
      columns,
      records: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      pagination: {
        total: 0,
        current: 1,
        showTotal: (total) => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ["10"],
        onChange: (current, pageSize) => {
          this.pageNo = current;
          this.pagination.current = current;
          this.getRecords();
        },
      },
      themList: [],
      typeList: [],
      themeId: '',
      typeId: '',
      name: ''
    };
  },
  mounted() {
    this.getRecords();
    this.getThemeList();
    this.getTypeList();
  },
  methods: {
    inquery() {
      this.getRecords()
    },
    getThemeList() {
      request({
        url: '/law/theme/tree?parentTypeId=0',
        method: 'get'
      }).then((res) => {
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
      let url = '/law/type/tree?parentTypeId=0';
      request({
        url,
        method: 'get'
      }).then((res) => {
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
    editInfo(id) {
      this.$router.push({
        path: "/categoryConfig/law/lawDetail",
        query: {
          id: id,
        },
      });
    },
    rowClick(record, index) {
      return {
        on: {
          // 事件
          click: (event) => {
            this.$router.push({
              name: "lawDetail",
              query: {
                id: record.id,
              },
            });
          }, // 点击行
        },
      };
    },
    add() {
      this.$router.push({
        path: "/categoryConfig/law/lawAdd",
      });
    },
    edit(id) {
      this.$router.push({
        path: "/categoryConfig/law/lawEdit",
        query: {
          id,
        },
      });
    },
    getRecords() {
      let url = "/law/info/listPage";
      let form = {
        pageNo: parseInt(this.pageNo),
        pageSize: parseInt(this.pageSize),
        name: this.name,
        themeId: this.themeId,
        typeId: this.typeId
      };
      // this.$http.post(url, form, httpConfig).then((res) => {
      //   if (res.data.code == 200) {
      //     let data = res.data.data;
      //     this.total = data.total;
      //     this.pagination.total = data.total;
      //     this.records = data.records;
      //   }
      // });
      request({
        url,
        method: "POST",
        data: JSON.stringify(form),
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data || {};
          this.total = data.total || 0;
          this.pagination.total = data.total || 0;
          this.records = data.records || [];
        }
      });
    },
    onDelete(id) {
      const totalPage = Math.ceil((this.total - 1) / this.pageSize);
      this.pageNo = this.pageNo > totalPage ? totalPage : this.pageNo;
      this.pageNo = this.pageNo < 1 ? 1 : this.pageNo;
      this.pagination.current = this.pageNo;
      let url = "/law/info/delete/" + id;
      request({
        url,
        method: "get",
      })
        .then((res) => {
          if (res.code == 200) {
            this.$Notice.success({
              title: res.msg,
            });
            this.getRecords();
          } else {
            this.$Notice.error({
              title: res.msg,
            });
          }
        })
        .catch((err) => {
          this.$Notice.error({
            title: "删除失败",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  margin: 10px 25px;
  display: flex;
  flex-direction: column;
  height: 95%;
  .topContent,
  .bottomContent {
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
    .search {
      background-color: rgb(243, 249, 254);
      width: 95%;
      height: 75px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      padding: 0 25px;
      .searchItem {
        display: flex;
        margin-right: 10px;
        align-items: center;
        flex: 1;
        div {
          flex: 1
        }
      }
    }
  }
  .bottomContent {
    margin-top: 18px;
    flex: 1;
    display: flex;
    flex-direction: column;
    .content {
      // background-color: rgb(243, 249, 254);
      width: 95%;
      margin-top: 10px;
      flex: 1;
    }
  }
}
</style>
