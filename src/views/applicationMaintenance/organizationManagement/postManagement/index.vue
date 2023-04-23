<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--查询-->
      <el-col :span="24" :gutter="5" :xs="24">

        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          label-width="90px"
          v-show="showSearch"
        >

          <el-form-item label="岗位类型" prop="postType" label-width="100px">
            <el-select
              v-model="queryParams.postType"
              placeholder="请选择岗位类型"
              clearable
              style="width: 210px"
            >
              <el-option :key="0" label="公用类型" :value="0" />
              <el-option :key="1" label="组织机构专用" :value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="所属组织机构" label-width="150px">
            <treeselect
              :multiple="false"
              @select="selChange"
              :options="divisionOptions"
              :normalizer="normalizer"
              placeholder="请选择组织机构"
              v-model="clearData"
            />
          </el-form-item>
          <!-- <el-form-item label="所属组织机构" prop="organizationName" label-width="100px">
            <el-input
              v-model="queryParams.organizationName"
              placeholder="请输入所属组织机构"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"

            />
          </el-form-item> -->

          <el-form-item label="岗位名称" prop="name" label-width="100px">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入岗位名称"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="岗位状态" prop="status" label-width="100px">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择岗位状态"
              clearable
              style="width: 210px"
            >
              <el-option :key="0" label="开启" :value="0" />
              <el-option :key="1" label="关闭" :value="1" />
            </el-select>
          </el-form-item>

          <el-form-item >
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
          </el-form-item>
        </el-form>

        <el-table :data="userList" style="margin-top: 6px">

          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="100px"
          />

          <el-table-column prop="icon" label="图标" align="center" width="100">
            <template slot-scope="scope">
              <svg-icon :icon-class="scope.row.icon" />
            </template>
          </el-table-column>

          <el-table-column
            label="岗位名称"
            align="center"
            key="name"
            prop="name"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="岗位类型"
            align="center"
            key="postType"
            prop="postType"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.postType == '0'">公用</span>
              <span v-else>专用</span>
            </template>
          </el-table-column>

          <el-table-column
            label="所属组织机构"
            align="center"
            key="organizationName"
            prop="organizationName"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="岗位人员数"
            align="center"
            key="count"
            prop="count"
            :show-overflow-tooltip="true"
          />



          <el-table-column
            label="显示排序"
            align="center"
            key="sort"
            prop="sort"
            :show-overflow-tooltip="true"
            width="160"
          />

          <el-table-column
            label="岗位状态"
            align="center"
            key="status"
            prop="status"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'">开启</span>
              <span v-else>关闭</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-row>
                  <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleView(scope.row,'1')"
                  v-hasPermi="['system:user:update']"
                  >查看</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleView(scope.row,'2')"
                  v-hasPermi="['system:user:update']"
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
          @pagination="getList"
        />
      </el-col>
    </el-row>

  <el-dialog
    :title="boxTitle"
    :visible.sync="boxShow"
    width="800px"
    @close="cancel"
    append-to-body
  >

    <el-form ref="form" :model="form" :rules="rules" label-width="130px" :disabled="formDisabled" >

      <el-row>

        <el-col :span="12">
          <el-form-item label="岗位类型" prop="postType">
             <el-select
              v-model="form.postType"
              placeholder="请选择岗位类型"
              clearable
              style="width: 210px"
              :disabled="formItemDisabled"
            >
              <el-option :key="0" label="公用类型" :value="0" />
              <el-option :key="1" label="组织机构专用" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <!-- <el-form-item label="所属组织机构" prop="organizationId" v-if="form.postType == '1'">
              <el-select
              v-model="form.organizationId"
              placeholder="请选择所属组织机构"
              clearable
              :disabled="formItemDisabled"
            >
              <el-option
                :key="index"
                :label="item.label"
                :value="item.value"
                v-for="(item,index) in dataPost"
              />
            </el-select>
          </el-form-item> -->

          <el-form-item label="所属组织机构" label-width="150px" v-if="form.postType == '1'">
            <treeselect
              :multiple="false"
              @select="selChange"
              :options="divisionOptions"
              :normalizer="normalizer"
              placeholder="请选择组织机构"
              v-model="clearData"
              :disabled="formItemDisabled"

            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="岗位名称" prop="name">
            <el-input placeholder="请输入岗位名称" v-model="form.name" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="显示排序" prop="sort">
            <el-input
              placeholder="请输入显示排序"
              v-model="form.sort"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="岗位状态" prop="status">
             <el-select
              v-model="form.status"
              placeholder="请选择岗位状态"
              clearable
            >
              <el-option :key="0" label="开启" :value="0" />
              <el-option :key="1" label="关闭" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col >
          <el-form-item label="备注" prop="remark">
            <el-input placeholder="请输入备注" v-model="form.remark" />
          </el-form-item>
        </el-col>

          <el-col :span="24">
            <el-form-item v-if="form.type !== 3" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
                :disabled="formDisabled"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input
                  slot="reference"
                  v-model="form.icon"
                  placeholder="点击选择图标"
                  readonly
                >
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px; width: 16px"
                  />
                  <i
                    v-else
                    slot="prefix"
                    class="el-icon-search el-input__icon"
                  />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>



      </el-row>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" v-if="!formDisabled">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>

  </el-dialog>
    <!-- <postBox
      :boxShow="boxShow"
      :boxTitle="boxTitle"
      @cancel="cancel"
      :userList="row"
      :options="options"
      :dataPost="dataPost"
      @remoteData="remoteData"
    /> -->
  </div>
</template>

<script>
import { getPostList } from "./api/index";
import { modify } from "./api/index";
import { deletedata } from "./api/index";
import { allOrganization } from "./api/index";
import { organization } from "./api/index";

 import { update } from "./api/index";
 import { add} from"./api/index"
import IconSelect from "@/components/IconSelect";


import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import postBox from "./components/postBox.vue";

export default {
  components: {
    postBox,
    Treeselect,
    IconSelect
  },

  data() {
    return {
      boxShow: false, //新增修改弹出框
      open: false, // 是否显示弹出层
      boxTitle: "", //新增修改标题
      total: 0,
      rules: {
          postType: [
          { required: true, message: "上级机构不能为空", trigger: "blur" },
        ],
        organizationId: [
          { required: true, message: "机构全称不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "组织机构简称", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "显示排序不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "机构状态不能为空", trigger: "blur" },
        ],
      },
      showSearch: true,
      formDisabled: false,
      clearData:undefined,
      form:{
        sort:'',
        status:"",
        organizationId:'',
        icon:'',
        postType:'',
        name:'',
        remark:'',
      },

      // 判断是新增还是修改
      // addOrUpdat
      userList: [],
      row: {
        icon:''
      },
      options: [],
      dataPost: [],
      divisionOptions: [],

      queryParams: {
        postType: "",
        organizationName: "",
        name: "",
        status: "",
        pageNo: 1,
        pageSize: 10,
      },
      formItemDisabled:false
    };
  },

  mounted() {
    this.getList();
    this.organization();
  },

  created() {
    this.getOpt();
  },

  methods: {

    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.fullName,
        children: node.children,
      };
    },


    //获取组织机构树接口
    organization() {
      organization()
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

    remoteData() {
      this.getList(); //baocun  yemian  baocun   haole
    },

    //点击新增按钮
    handleAdd() {
      this.boxShow = true;
      this.boxTitle = "新增";
      this.formDisabled = false;
      this.formItemDisabled = false;
      this.$nextTick(() => {
        this.form = {
          sort:'',
          status:"",
          organizationId:'',
          icon:'',
          postType:'',
          name:'',
          remark:'',
        }
      });
    },

    getOpt() {
      const _self = this;
      //获取全部组织机构
      allOrganization({}).then((response) => {
        let arr = [];
        for (let i in response.data) {
          arr.push({
            //fullName
            label: response.data[i].fullName,
            value: response.data[i].id,
          });
        }
        _self.options = response.data;
        _self.dataPost = [].concat(arr);
      });
    },

    //弹窗 组织机构接口
    allOrganization() {
      let _self = this;
    },

    cancel() {
      this.boxShow = false;
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      if(!this.clearData) {
      this.queryParams.deptId= '';
      }
      this.getList();
    },

    selChange(e) {
      console.log(e, "e");
      this.queryParams.organizationName = e.id;
      this.queryParams.deptId = this.queryParams.organizationName
      delete this.queryParams.organizationName
    },

    //** 查询角色列表 */
    getList() {
      this.loading = true;
      getPostList(this.queryParams)
        .then((response) => {
          console.log(response,"response");
          if (response.code == 0) {
            this.userList = response.data.records;
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

    reset() {

    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row,"rowrow");
      const name = row.name;
      const id = row.id;
      this.$modal
        .confirm('是否确认删除岗位为"' + name + '"的数据项?')
        .then(function () {
          return deletedata(id);
          // console.log("1111");
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    /** 查看按钮操作 */
    handleView(row,type) {
      // this.reset();
      const id = row.id;
      modify(id).then((response) => {
        this.form = response.data;
        this.boxShow = true;
        // this.title = "修改数据";
        // this.isShow = false;
        if(type =="2") {
          this.boxTitle = "修改";
          this.formDisabled = false
          this.formItemDisabled = true;
        }else {
          this.boxTitle = "查看";
          this.formDisabled = true
        }
      });
    },

    // 选择图标
    selected(name) {
      console.log(name,"name");
      this.$set(this.form,'icon',name);
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        // conlose.log(this.userList)
        // 这里写错了  这里就没有row  只有list  row是上个页面传过来的  昨天说了  这个页面list是用来接受row的
        if (this.form.id != null) {
          update(this.form).then((response) => {
            console.log(this.form,"this.form");
            this.$modal.msgSuccess("修改成功");
            this.boxShow = false;
            this.getList();
          });
        }else {
           this.userList.organizationId = this.userList.fullName
          // delete
            delete this.userList.fullName;
          // 现在修改可以了  剩下的 就是刷新列表  你现在这歌是子组件  就没有getuser方法  这方法在副组件写着呢  所以没有办法刷新
          // 添加的提交
          add(this.form).then((response) => {
            this.$modal.msgSuccess("新增成功");
              this.boxShow = false;
              this.getList();
          });
        }
      });
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
