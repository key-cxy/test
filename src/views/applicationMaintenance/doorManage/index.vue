<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="4">
        <div
          style="
            width: 90%;
            margin-left: 5%;
            height: 89vh;
            background-color: #f8f8f9;
            overflow-y: auto;
          "
        >
          <el-input
            prefix-icon="el-icon-search"
            style="margin-top: 10px; width: 90%; margin-left: 5%"
            placeholder="输入关键字进行过滤"
            v-model="filterText"
          >
          </el-input>
          <el-tree
            style="margin-top: 15px; background-color: #f8f8f9"
            class="filter-tree"
            :data="treeData"
            :props="defaultProps"
            :highlight-current="true"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            ref="tree"
          >
          </el-tree>
        </div>
      </el-col>

      <el-col :span="20" :gutter="5" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
        >
          <el-form-item label="应用名称" prop="name" label-width="100px">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入应用名称"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"
            />
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleQuery"
                >搜索
              </el-button>
              <el-button icon="el-icon-refresh" @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:create']"
              >新增</el-button
            >
          </el-col>

          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getUser"
          ></right-toolbar>
        </el-row>
        <!-- table展示表格-->
        <el-table :data="list" v-loading="loading" style="margin-top: 6px">
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="50px"
          />

          <el-table-column
            label="信息名称"
            align="center"
            key="messageName"
            prop="messageName"
            :show-overflow-tooltip="true"
            width="200"
          />

          <el-table-column
            label="信息类型"
            key="type"
            align="center"
            width="200"
            prop="type"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type == 0">应用类别</span>
              <span v-else>具体类别</span>
            </template>
          </el-table-column>

          <el-table-column
            label="访问路径"
            align="center"
            key="accessPath"
            prop="accessPath"
            width="120"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column
            label="是否展示"
            align="center"
            key="isShow"
            prop="isShow"
            :show-overflow-tooltip="true"
            width="200"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isShow == '0'">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="200"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-row>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleView(scope.row)"
                  v-hasPermi="['system:tenant:update']"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:user:delete']"
                  >删除</el-button
                >
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :page.sync="pageNo"
          :limit.sync="pageSize"
          @pagination="getUser"
        />
      </el-col>
    </el-row>
    <mult-box
      ref="multbox"
      :boxTitle="boxTitle"
      :dialogShow="dialogShow"
      :rowData="rowData"
      @cancel="cancel"
      @quarycheck="quarycheck"
      @querycancel="querycancel"
    ></mult-box>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import multBox from "./compoents/multBox.vue";
import {
  createForm,
  getData,
  deleteList,
  updateList,
  treeData,
} from "@/api/doorManage/doorManage.js";
export default {
  name: "doorManage",
  components: {
    Treeselect,
    multBox,
  },
  data() {
    return {
      filterText: "",
      treeData: [], //树
      defaultProps: {
        label: "name",
        children: "children",
      },
      queryParams: {
        name: "",
      },
      showSearch: true,
      list: [], // 表格初始化数据
      total: 0,
      pageNo: 1,
      pageSize: 10,
      loading: true, // 遮罩层
      dialogShow: false, //是否显示弹窗
      boxTitle: "", //弹窗标题
      add: 1, // 1是新增确定按钮
      rowData: {}, //当前行所有数据
    };
  },
  mounted() {
    this.getUser();
    this.getTreeList();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    //旁边树
    handleNodeClick(data) {
      this.systemId = data.id;
      this.getUser();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.fullName.indexOf(value) !== -1;
    },
    //获得树数据
    getTreeList() {
      treeData().then((res) => {
        if (res && res.code === 0) {
          this.treeData = res.data;
        }
      });
    },

    //数据回显
    getUser() {
      this.loading = true;
      let params = JSON.parse(JSON.stringify(this.queryParams));
      params.pageNo = this.pageNo;
      params.pageSize = this.pageSize;
      getData(params).then((res) => {
        if (res && res.code === 0) {
          this.list = res.data.records || [];
          console.log("数据==============》", res.data.records);
          this.total = res.data.total;
          this.loading = false;
        } else {
          this.$message.warning("请求失败！");
        }
      });
    },
    //新增
    handleAdd() {
      this.boxTitle = "新增数据";
      this.dialogShow = true;
      this.add = 1;
      this.$nextTick(() => {
        this.$refs.multbox.getSelectList();
        //  this.$refs.multbox.getSystemType()
        this.$refs.multbox.selected();
        this.$refs.multbox.list = {};
      });
    },
    //确定按钮
    quarycheck(val) {
      console.log("子传父=====>", val);
      let params = JSON.parse(JSON.stringify(val));
      //新增确定按钮
      if (this.add === 1) {
        createForm(params).then((res) => {
          if (res.code === 0) {
            this.$message.success("新增成功");
            this.getUser();
            this.$refs.multbox.list = {};
          }
        });
      } else {
        updateList(params).then((res) => {
          if (res.code === 0) {
            this.$message.success("修改成功");
            this.getUser();
          }
        });
      }
    },
    querycancel() {
      this.dialogShow = false;
      if (this.add === 1) {
        this.$refs.multbox.list = {};
      }
    },
    //搜索按钮
    handleQuery() {
      this.getUser();
    },
    //重置按钮
    resetQuery() {
      this.queryParams = {};
      this.getUser();
    },
    //修改
    handleView(row) {
      console.log("点击修改=======》", row);
      this.add = 2;
      this.dialogShow = true;
      this.$refs.multbox.getSelectList();
      //  this.$refs.multbox.getSystemType()
      //  this.$refs.multbox.getmenusType()
      this.rowData = row;
      this.boxTitle = "修改数据";
    },
    //删除
    handleDelete(row) {
      console.log(row);
      let params = {
        id: row.id,
      };
      this.$modal
        .confirm('是否确认删除名称为"' + row.name + '"的数据项?')
        .then(function () {
          return deleteList(params);
        })
        .then(() => {
          this.getUser();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    //关闭弹窗
    cancel() {
      this.dialogShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .vue-treeselect {
  width: 250px;
}
.el-form-item--small {
  margin-left: 10px;
}
</style>
