<template>
  <div class="app-container">

    <el-row :gutter="24">

      <!-- 左侧菜单栏 -->
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

      <!--查询-->
      <el-col :span="20" :gutter="5" :xs="24">

        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          label-width="90px"
          v-show="showSearch"
        >

          <el-form-item label="所属行政区划" label-width="100px">
            <treeselect
              @select="selChange"
              v-model="orgId"
              :multiple="false"
              :options="divisionOptions"
              :normalizer="normalizer"
              placeholder="请选择所属行政区划"
            />
          </el-form-item>

          <el-form-item label="组织机构全称" prop="fullName" label-width="100px">
            <el-input
              v-model="queryParams.fullName"
              placeholder="请输入组织机构简称"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="组织机构状态" prop="status" label-width="100px">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择人员状态"
              clearable
              style="width: 210px"
            >
              <el-option :key="0" label="开启" :value="0" />
              <el-option :key="1" label="关闭" :value="1" />
            </el-select>
          </el-form-item>

        </el-form>

        <el-row :gutter="10" class="mb8">

          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery"
              >搜索</el-button
            >

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
            label="组织机构简称"
            align="center"
            key="shortName"
            prop="shortName"
            :show-overflow-tooltip="true"
            width="200"
          />

          <el-table-column
            label="所属行政区划"
            key="regionalismName"
            align="center"
            width="200"
            prop="regionalismName"
          >
            <!-- <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value="0" :inactive-value="1"
                @change="handleStatusChange(scope.row)" />
            </template> -->
          </el-table-column>

          <el-table-column
            label="组织人员数"
            align="center"
            key="headcount"
            prop="headcount"
            width="120"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column
            label="上级组织机构"
            align="center"
            key="parentName"
            prop="parentName"
            :show-overflow-tooltip="true"
            width="200"
          >
          </el-table-column>

          <el-table-column
            label="显示排序"
            align="center"
            key="sort"
            prop="sort"
            :show-overflow-tooltip="true"
            width="120"
          >
          </el-table-column>

          <el-table-column
            label="组织机构状态"
            align="center"
            :show-overflow-tooltip="true"
            key="status"
            prop="status"
            width="120"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'">开启</span>
              <span v-else>关闭</span>
            </template>
          </el-table-column>

          <el-table-column
            label="开通账号数"
            align="center"
            :show-overflow-tooltip="true"
            key="accountNum"
            prop="accountNum"
            width="180"
          >
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
                  @click="handleView(scope.row, '1')"
                  v-hasPermi="['system:user:update']"
                  >查看</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleView(scope.row, '2')"
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
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getUser"
        />

      </el-col>

    </el-row>

    <!-- 弹窗 -->
    <el-dialog
      :title="boxTitle"
      :visible.sync="boxShow"
      width="800px"
      @close="cancel"
      append-to-body
    >

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="150px"
        :disabled="formDisabled"
      >

        <el-row>

          <el-col :span="12" >
            <!-- <el-form-item label="上级组织机构" prop="parentId">
              <el-select
                v-model="form.parentId"
                placeholder="请选择所属组织机构"
                clearable
                @change="changedata"
              >
                <el-option
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  v-for="(item, index) in dataSuperior"
                />
              </el-select>
            </el-form-item> -->

          <el-form-item label="上级组织机构" prop="parentId">
            <treeselect
              @select="changVal"
              v-model="form.parentId"
              :multiple="false"
              :options="divisionOptions1"
              :normalizer="normalizer1"
              placeholder="请选择上级组织机构"
              :disabled="formIdDisabled"
            />
          </el-form-item>
          </el-col>

          <el-col :span="12">
            <!-- <el-form-item label="所属行政区划" prop="regionalismId">
              <el-select
                v-model="form.regionalismId"
                placeholder="请选择所属组织机构"
                clearable
              >
                <el-option
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  v-for="(item, index) in secOptions"
                />
              </el-select>
            </el-form-item> -->

          <el-form-item label="所属行政区划" prop="regionalismCode">
            <treeselect
              @select="changeVal1"
              v-model="form.regionalismCode"
              :multiple="false"
              :options="divisionOptions2"
              :normalizer="normalizer"
              placeholder="请选择所属行政区划"
              :disabled="formIdDisabled"
            />
            
          </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="机构组织简称" prop="shortName">
              <el-input
                placeholder="请输入机构组织全称"
                v-model="form.shortName"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="机构组织全称" prop="fullName">
              <el-input
                placeholder="请输入机构组织简称"
                v-model="form.fullName"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input placeholder="请输入联系电话" v-model="form.phone" />
            </el-form-item>
          </el-col>



          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input placeholder="请输入显示排序" v-model="form.sort" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="组织机构状态" prop="status">
              <el-select
                v-model="form.status"
                placeholder="请选择组织机构状态"
                clearable
              >
                <el-option :key="0" label="开启" :value="0" />
                <el-option :key="1" label="关闭" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        
        </el-row>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="!formDisabled"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import {
  getUser,
  regionalization,
  getOrganization,
  deleteContent,
  // mechanismAcquisition,
  division,
  superiorOrganization,
  organization,
  determine,
  add,
  organizationTree,
  divisionData
} from "./api/index";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import {
  handleList,
  addSubSystem,
  updateSubSystem,
  delSubSystem,
  handleTypeList,
  subsystemTreeByRole,
  uploadLogo,
} from "@/api/system/subSystem";

import multBox from "./components/multBox.vue";

export default {
  components: {
    multBox,
    Treeselect,
  },
  data() {
    return {
      boxShow: false, //新增修改弹出框
      boxTitle: "", //新增修改标题 baocun
      total: 0,
      list: [],
      row: {},
      dataOptions: [],
      divisionOptions: [],
      divisionOptions1: [],
      divisionOptions2:[],
      filterText: "",
      treeData: [],
      defaultProps: {
        label: "shortName",
        children: "children",
      },
      showSearch: true,
      queryParams: {
        fullName: "",
        regionalismName: "",
        shortName: "",
        status: "",
        pageNo: 1,
        pageSize: 10,
      },
      // dataSuperior: [],
      options: [],
      defaultProps1: {
        children: "children",
        label: "name",
      },
      treeValue: [],
      form: {
        shortName: "",
        status: "",
        regionalismName: "",
        phone:"",
        fullName: "",
        sort: "",
        regionalismCode: undefined,
        parentId: undefined,
      },
      // secOptions: [],
      rules: {
        parentId: [
          { required: true, message: "上级机构不能为空", trigger: "blur" },
        ],
        fullName: [
          { required: true, message: "机构全称不能为空", trigger: "blur" },
        ],
        shortName: [
          { required: true, message: "组织机构简称", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "显示排序不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "机构状态不能为空", trigger: "blur" },
        ],
      },
      dialogStatus: "add",
      formDisabled: false,
      formIdDisabled:false,
      upOrgName:'',  //上级机构名称
      downOrgName:'', // 下级
      orgId:undefined,
    };
  },
  
  mounted() {
    // this.mechanismAcquisition();  哪里有？  这得是个方法啊  你下面methids里面定义了吗？ 我怎么没找到
    this.division();
    this.divisionData()
  },

  created() {
    this.getUser();
    this.getTreeList();
    this.getOpt();
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },

  methods: {

    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.code,
        label: node.name,
        children: node.children,
      };
    },
    
    //弹窗上级组织机构  部门转换数据
    normalizer1(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.fullName,
        children: node.children,
      };
    },

    //弹窗获取上级组织机构下拉框
    getOpt() {
      const _self = this;
      organizationTree({}).then((response) => {
        console.log(response,'cssaaaa');
        this.divisionOptions1 = [response.data];
      });
      // superiorOrganization({}).then((response) => {
      //   let arr = [];
      //   for (let i in response.data) {
      //     arr.push({
      //       label: response.data[i].parentName,
      //       value: response.data[i].parentId,
      //     });
      //   }
      //   _self.dataSuperior = [].concat(arr);
      //   _self.options = response.data;
      // });
    },

    changVal(val) {
      console.log(val,"val");
      this.upOrgName = val.fullName;
      // const id= val.regionalismId
      divisionData({code:val.regionalismCode})
        .then((response) => {
          console.log(response,"responseresponseresponse");
          if (response.code == 0) {
            this.divisionOptions2 = [response.data];
          } else {
            this.$Message.error(response.msg);
          }
          return;
        })
        .catch(() => {
          this.$Message.error("失败！");
        });

    },

    changeVal1(e) {
      console.log(e,"eeeeeeee");
      this.downOrgName = e.code;
    },

    // 新增按钮弹窗
    handleAdd() {
      this.boxShow = true;
      this.boxTitle = "新增机构";
      this.dialogStatus = "add";
      this.formDisabled = false;
      this.formIdDisabled = false;
      this.divisionOptions2 = [];
      this.$nextTick(() => {
        this.form = {
          shortName: "",
          status: "",
          regionalismName: "",
          phone:"",
          fullName: "",
          sort: "",
          regionalismCode: undefined,
          parentId: undefined,
        }
      });
    },

    // changedata(val) {
    //   let id = "";
    //   console.log(val, this.options);
    //   for (let i = 0; i < this.options.length; i++) {
    //     if (val == this.options[i].parentId) {
    //       id = this.options[i].regionalismId;
    //     }
    //   }
    //   regionalization({ id }).then((response) => {
    //     let arr = [];
    //     for (let i = 0; i < response.data.length; i++) {
    //       arr.push({
    //         label: response.data[i].name,
    //         value: response.data[i].id,
    //       });
    //     }
    //     this.secOptions = [].concat(arr);
    //   });
    // },

    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        let param = {
          ...this.form,
        };
        console.log(this.form,"this.form");
        console.log(param,"param");
        if (this.dialogStatus == "add") {
          param.parentName = this.upOrgName;
          param.regionalismCode = this.downOrgName; 
          delete param.regionalismId
          delete param.regionalismName  
          // param.regionalism_code =  this.regionalismId
          add(param).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.boxShow = false;
            this.getUser();
          });
        } else {
          determine(param).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.boxShow = false;
            this.getUser();
          });
        }
      });
    },

    cancel() {
      this.boxShow = false;
    },

    /** 查询用户列表 */
    getUser() {
      this.loading = true;
      getUser(this.queryParams)
        .then((response) => {
          if (response.code == 0) {
            this.list = response.data.list;
            this.total = response.data.total;
            this.loading = false;
          } else {
            this.$Message.error(response.msg);
          }
        })
        .catch(() => {
          this.$Message.error("失败！");
        });
    },

    selChange(e) {
      console.log(e,"e");
      this.queryParams.regionalismName = e.name;
      // this.queryParams.regionalismCode = e.name
    },

    //所属组织机构下拉框拿数据
    // mechanismAcquisition() {
    //   let _self = this;
    //   mechanismAcquisition({}).then((response) => {
    //     response.data.forEach((item) => {
    //       let arr = {
    //         value: item.id,
    //         label: item.fullName,
    //       };
    //       _self.dataOptions.push(arr);
    //     });
    //     _self.queryParams.fullName = _self.dataOptions.value;
    //     // _self.loadWater();//调用其他方法，需要写在异步请求中   baocun
    //   });
    // },


    //所属行政区划查询获取接口
    division() {
      division()
        .then((response) => {
          console.log(response, "response222222");
          if (response.code == 0) {
            this.divisionOptions = [response.data];
            console.log(this.divisionOptions, "cccc");
          } else {
            this.$Message.error(response.msg);
          }
          return;
        })
        .catch(() => {
          this.$Message.error("失败！");
        });
    },

    /** 查看修改按钮操作 */
    handleView(row, type) {
      // this.reset();
      const id = row.id;
      getOrganization(id).then((response) => {
        this.form = response.data;
        this.boxShow = true;
        if (type == "2") {
          this.boxTitle = "修改数据";
          this.formDisabled = false;
          this.formIdDisabled = true
          this.dialogStatus = 'edit';
          this.$nextTick(() => {
            let param = {
              fullName:response.data.fullName,
              regionalismCode:response.data.regionalismCode
            }
            this.changVal(param);
          });
        } else {
          this.boxTitle = "查看";
          this.formDisabled = true;
          this.formIdDisabled = true
          this.$nextTick(() => {
            let param = {
              fullName:response.data.fullName,
              regionalismCode:response.data.regionalismCode
            }
            this.changVal(param);
          });
        }
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      if(!this.orgId) {
        this.queryParams.regionalismName = '';
        // this.queryParams.fullName =''
      }
      this.getUser();
      // this.getTreeList();
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row,"row");
      // const id = row.parentName;
      this.$modal
        .confirm('是否确认删除机构简称为"' + row.shortName + '"的数据项?')
        .then(function () {
          return deleteContent(row.id);
        })
        .then(() => {
          this.getUser();
          this.getTreeList()
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    //进页面，左侧菜单组织机构接口
    getTreeList() {
      organization().then((res) => {
        if (res.code === 0) {
          this.treeData = [res.data];
        }
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.fullName.indexOf(value) !== -1;
    },

    handleNodeClick(data) {
      console.log(data,"data");
      console.log(this.queryParams,"this.queryParams");
      // this.queryParams.regionalismId = data.regionalismId;
      // this.queryParams.fullName = data.fullName;
      this.queryParams.id = data.id
      this.getUser();
    },

  },
};
</script>

<style lang="less" scoped>
::v-deep.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
::v-deep.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
::v-deep.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

::v-deep .vue-treeselect {
  width: 250px;
}
</style>
