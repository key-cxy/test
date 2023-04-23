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
        >

          <el-form-item label="所属组织机构">
            <treeselect
              :multiple="false"
              @select="selChange"
              :options="divisionOptions"
              :normalizer="normalizer"
              placeholder="请选择组织机构"
              v-model="statrtData"
            />
          </el-form-item>

          <el-form-item label="工作岗位" prop="postName">
            <el-input
              v-model="queryParams.postName"
              placeholder="请输入工作岗位"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="人员姓名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入人员姓名"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model="queryParams.mobile"
              placeholder="请输入手机号"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="身份证号" prop="cardNo">
            <el-input
              v-model="queryParams.cardNo"
              placeholder="请输入身份证号"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="人员状态" prop="status" label-width="100px">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择人员状态"
              clearable
              style="width: 210px"
            >
              <el-option :key="0" label="开启" :value="0"/>
              <el-option :key="1" label="关闭" :value="1"/>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery"
            >搜索
            </el-button
            >

            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:create']"
            >新增
            </el-button
            >
          </el-form-item>
        </el-form>

        <el-table :data="userList" style="margin-top: 6px">

          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="60"
          />

          <el-table-column
            label="人员姓名"
            align="center"
            key="name"
            prop="name"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="性别"
            align="center"
            key="sex"
            prop="sex"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.sex == '1'">男</span>
              <span v-else>女</span>
            </template>
          </el-table-column>

          <el-table-column
            label="手机号"
            align="center"
            key="mobile"
            prop="mobile"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column
            label="身份证号"
            align="center"
            key="cardNo"
            prop="cardNo"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column
            label="显示排序"
            align="center"
            key="sort"
            prop="sort"
            :show-overflow-tooltip="true"
          >
          </el-table-column>

          <el-table-column
            label="所属机构"
            align="center"
            key="organizationPostMsg"
            prop="organizationPostMsg"
            :show-overflow-tooltip="true"
          >
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
                >查看
                </el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleView(scope.row,'2')"
                  v-hasPermi="['system:user:update']"
                >修改
                </el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:user:delete']"
                >删除
                </el-button
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
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" :disabled="formDisabled">

        <el-row>

          <el-col :span="12">
            <el-form-item label="人员姓名" prop="name">
              <el-input placeholder="请输入人员姓名" v-model="form.name"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select
                v-model="form.sex"
                placeholder="请选择性别"
                clearable
                style="width: 210px"
              >
                <el-option :key="1" label="男" :value="1"/>
                <el-option :key="2" label="女" :value="2"/>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>

          <el-col :span="12">
            <el-form-item label="手机号" prop="mobile">
              <el-input placeholder="请输入手机号" v-model="form.mobile"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="身份证号" prop="cardNo">
              <el-input placeholder="请输入身份证号" v-model="form.cardNo"/>
            </el-form-item>
          </el-col>

        </el-row>


        <el-row>

          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input placeholder="请输入显示排序" v-model="form.sort"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="人员状态" prop="status">
              <el-select
                v-model="form.status"
                placeholder="请选择人员状态"
                clearable
              >
                <el-option :key="0" label="开启" :value="0"/>
                <el-option :key="1" label="关闭" :value="1"/>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <!--        /** 测试循环添加数据 */-->
        <el-row>
          <!--        <div v-for="(item,index) in form.gather" :key="index">-->
          <!--          <el-row>·-->
          <!--            <el-col :span="12">-->
          <!--            <el-form-item label="所属组织机构">-->
          <!--              <treeselect-->
          <!--                :multiple="false"-->
          <!--                @select="selChange"-->
          <!--                :options="divisionOptions"-->
          <!--                :normalizer="normalizer"-->
          <!--                placeholder="请选择所属组织机构"-->
          <!--                :disabled="formDisabled"-->
          <!--                v-model="item.organizationId"-->
          <!--              />-->
          <!--            </el-form-item>-->
          <!--            </el-col>-->

          <!--            <el-col :span="12">-->
          <!--            <el-form-item label="岗位" prop="postName">-->
          <!--              <treeselect-->
          <!--                :multiple="false"-->
          <!--                @select="changePosition"-->
          <!--                :options="divisionOptions1"-->
          <!--                :normalizer="normalizer1"-->
          <!--                placeholder="请选择岗位"-->
          <!--                :disabled="formDisabled"-->
          <!--                v-model="item.postId"-->
          <!--              />-->
          <!--            </el-form-item>-->
          <!--            </el-col>-->

          <!--          </el-row>-->

          <!--          <el-row>-->

          <!--            <el-col :span="12">-->
          <!--              <el-form-item label="办公地点" prop="officeLocation">-->
          <!--                <el-input placeholder="请输入办公地点" v-model="item.officeLocation" />-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->

          <!--            <el-col :span="12">-->
          <!--              <el-form-item label="备注" prop="remark">-->
          <!--                <el-input placeholder="请输入备注" v-model="item.remark" />-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
          <!--          <el-form-item>-->
          <!--            <el-button v-if="index+1 == form.gather.length" type="primary" size="mini" @click="addItem(form.gather.length)">+</el-button>-->
          <!--            <el-button v-if="index !== 0" type="danger" size="mini" @click="deleteItem(item, index)">-</el-button>-->
          <!--          </el-form-item>-->
          <!--        </div>-->
        </el-row>
        <!--        <el-row>·-->
        <!--          <el-col :span="12">-->
        <!--          <el-form-item label="所属组织机构">-->
        <!--            <treeselect-->
        <!--              :multiple="false"-->
        <!--              @select="selChange"-->
        <!--              :options="divisionOptions"-->
        <!--              :normalizer="normalizer"-->
        <!--              placeholder="请选择所属组织机构"-->
        <!--              :disabled="formDisabled"-->
        <!--              v-model="form.organizationId"-->
        <!--            />-->
        <!--          </el-form-item>-->
        <!--          </el-col>-->

        <!--          <el-col :span="12">-->
        <!--          <el-form-item label="岗位" prop="postName">-->
        <!--            <treeselect-->
        <!--              :multiple="false"-->
        <!--              @select="changePosition"-->
        <!--              :options="divisionOptions1"-->
        <!--              :normalizer="normalizer1"-->
        <!--              placeholder="请选择岗位"-->
        <!--              :disabled="formDisabled"-->
        <!--              v-model="form.postId"-->
        <!--            />-->
        <!--          </el-form-item>-->
        <!--          </el-col>-->

        <!--        </el-row>-->

        <!--        <el-row>-->

        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="办公地点" prop="officeLocation">-->
        <!--              <el-input placeholder="请输入办公地点" v-model="form.officeLocation" />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->

        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="备注" prop="remark">-->
        <!--              <el-input placeholder="请输入备注" v-model="form.remark" />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->

        <!--        </el-row>-->

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="!formDisabled">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>

    </el-dialog>


  </div>
</template>

<script>
import { getPersonnel, deleteContent } from './api/index'
import { getModify } from './api/index'
import { organization } from './api/index'
import { determine } from './api/index'
import { add } from './api/index'
import { positionSelect } from './api/index'

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: {
    Treeselect
  },
  data() {
    return {
      loading: false,
      boxShow: false, //新增修改弹出框
      boxTitle: '', //新增修改标题
      total: 0,
      userList: [],
      row: {},
      divisionOptions: [],
      divisionOptions1: [],
      addForm: {},
      rules: {},
      formDisabled: false,
      statrtData: undefined,
      queryParams: {
        organizationName: '',
        postName: '',
        name: '',
        mobile: '',
        cardNo: '',
        status: '',
        pageNo: 1,
        pageSize: 10
      },
      form: {
        name: '',
        sex: '',
        mobile: '',
        cardNo: '',
        officeLocation: '',
        remark: '',
        sort: '',
        status: '',
        organizationId: undefined,
        postId: undefined,
        list: [
          {}
        ],
        gather: [{
          organizationId: '',
          postId: '',
          officeLocation: '',
          remark: ''
        }],
      },

      organizationName: ''
    }
  },
  mounted() {
  },
  created() {
    this.getList(),
      this.organization()
    this.positionSelect()
  },
  methods: {
    //新增方法
    addItem(length) {
      if (length >= 10) {
        this.$modal.msgWarning('最多可新增10条数据')
      } else {
        this.form.gather.push({
          organizationId: undefined,
          postId: undefined,
          officeLocation: '',
          remark: ''
        })
      }
    },
    //删除方法
    deleteItem(item, index) {
      this.form.gather.splice(index, 1)
    },

    /** 弹窗组织机构  转换部门数据结构 */
    // normalizer(node) {
    //   if (node.children && !node.children.length) {
    //     delete node.children;
    //   }
    //   return {
    //     id: node.id,
    //     label: node.fullName,
    //     children: node.children,
    //   };
    // },

    /** 弹窗职务 转换部门数据结构 */
    normalizer1(node) {
      if (node && !node.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },

    //弹窗所属组织机构拿值
    selChange(e) {
      console.log(e, 'e')
      this.queryParams.organizationName = e.id
      // this.queryParams.deptId = this.queryParams.organizationName
      delete this.queryParams.organizationName
      this.queryParams.organizationName = e.fullName
    },

    //弹窗职务拿值
    changePosition(e) {
      console.log(e, 'e')
      this.queryParams.organizationName = e.id
      this.queryParams.deptId = this.queryParams.organizationName
      delete this.queryParams.organizationName
    },

    //  获取弹窗页面组织机构数据接口
    organization() {
      organization()
        .then((response) => {
          console.log(response, '组织机构数据')
          if (response.code == 0) {
            this.divisionOptions = [response.data]
            console.log(this.divisionOptions, 'cccc')
          } else {
            this.$Message.error(response.msg)
          }
          return
        })
        .catch(() => {
          this.$Message.error('失败！')
        })
    },

    //获取弹窗页面职务下拉框数据接口
    positionSelect() {
      positionSelect()
        .then((response) => {
          console.log(response, '职务数据')
          if (response.code == 0) {
            this.divisionOptions1 = response.data
            this.divisionOptions1.postName = response.data
          } else {
            this.$Message.error(response.msg)
          }
          return
        })
        .catch(() => {
          this.$Message.error('失败！')
        })
    },

    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.fullName,
        children: node.children
      }
    },

    handleAdd() {
      this.boxShow = true
      this.formDisabled = false
      this.boxTitle = '新增'
      this.$nextTick(() => {
        this.form = {
          sort: '',
          status: '',
          organizationId: undefined,
          postId: undefined,
          name: '',
          gather: [{
            organizationId: undefined,
            postId: undefined,
            officeLocation: '',
            remark: ''
          }]
        }
      })
    },

    cancel() {
      this.boxShow = false
    },

    /** 查询用户列表 */
    getList() {
      this.loading = true
      getPersonnel(this.queryParams)
        .then((response) => {
          console.log(response, 'response')
          if (response.code == 0) {
            let list = [].concat(response.data.list)
            for (let i in list) {
              list[i].organizationName = list[i].organizationPostList[0].organizationName
            }
            this.userList = [].concat(list)
            this.total = response.data.total
            this.loading = false
          } else {
            this.$Message.error(response.msg)
          }
        })
        .catch(() => {
          this.$Message.error('失败！')
        })
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      if (!this.statrtData) {
        this.queryParams.organizationName = ''
      }
      this.getList()
    },

    /** 修改按钮操作 */
    // handleUpdate(row) {
    //   // this.reset();
    //   const id = row.id;
    //   getModify(id).then((response) => {
    //     this.from = response.data;
    //     this.boxShow = true;
    //     this.title = "修改数据";
    //   });
    // },

    /** 查看按钮操作 */
    handleView(row, type) {
      // this.reset();
      const id = row.id
      getModify(id).then((response) => {
        console.log(response, '查看response')
        // this.form = response.data;
        this.form = {
          ...response.data,
          ...response.data.organizationPostList[0]
        }
        console.log(this.form, 'sssss')
        // this.form.officeLocation = response.data.organizationPostList[0].officeLocation
        // this.form.remark = response.data.organizationPostList[0].remark
        // this.form.postName = response.data.organizationPostList[0].postName
        this.boxShow = true
        if (type == '2') {
          this.boxTitle = '修改'
          this.formDisabled = false
        } else {
          this.boxTitle = '查看'
          this.formDisabled = true
        }
        // this.title = "修改数据";
        // this.isShow = false;
      })
    },

    remoteData() {
      this.getList() //baocun  yemian  baocun   haole
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row, 'ccccsss')

      this.$modal
        .confirm('是否确认删除人员姓名为"' + row.name + '"的数据项?')
        .then(function() {
          return deleteContent(row.id)
          // console.log("1111");   这个额删除的接口呢 方法呢
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {
        })
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return
        }
        console.log(this.form)
        let param = {
          ...this.form,
          organizationPostList: []
        }
        let postName
        for (let i in this.divisionOptions1) {
          if (this.form.postId == this.divisionOptions1[i].id) {
            postName = this.divisionOptions1[i].name
          }
        }
        param.organizationPostList.push({
          organizationId: this.form.organizationId,
          remark: this.form.remark,
          postId: this.form.postId,
          officeLocation: this.form.officeLocation,
          postName: postName,
          organizationName: this.organizationName
        })

        console.log(param)
        if (this.form.id) {
          determine(param).then((response) => {
            this.$modal.msgSuccess('修改成功')
            this.boxShow = false
            this.getList()
          })
        } else {
          // 添加的提交

          console.log('添加的提交')
          add(param).then((response) => {

            this.$modal.msgSuccess('新增成功')
            this.boxShow = false
            this.getList()
          })
        }
      })
    }

    // cancel() {
    //   this.$emit("cancel");
    // },
  }
}
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

.el-col-12 {
  width: 49%;
}
</style>
