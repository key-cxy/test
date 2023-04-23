<template>
  <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal='closeOnClickModal'>
    <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="账号类型" prop="type">
            <el-select
              v-model="addForm.type"
              placeholdel="请选择账号类型"
              clearable
              style="width: 210px"
            >
              <el-option :value="0" label="组织账号" :key="0"/>
              <el-option :value="1" label="人员账号" :key="1"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号名称" prop="username">
            <el-input
              v-model="addForm.username"
              placeholder="请输入账号名称"
              :disabled="formDisabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">

          <el-form-item v-show="addForm.type == 0" label="用户姓名" prop="nickname">
            <el-input
              v-model="addForm.nickname"
              placeholder="请输入姓名"
              :disabled="formDisabled || formDisabled"
            />
          </el-form-item>
          <el-form-item v-show="addForm.type == 1" label="账号描述" prop="nickname">
            <el-input
              v-model="addForm.nickname"
              placeholder="请输入账号描述"
              :disabled="formDisabled || formDisabled"
            />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属组织机构" prop="deptId">
            <!--              <treeselect-->
            <!--                v-model="addForm.deptId"-->
            <!--                @select="changeDept"-->
            <!--                :options="deptOptions"-->
            <!--                :show-count="true"-->
            <!--                placeholder="请选择用户部门"-->
            <!--                :normalizer="normalizer"-->
            <!--                :clearable="false"-->
            <!--              />-->
            <el-cascader
              style="width: 100%"
              v-model="addForm.deptIdList"
              :options="deptOptions2"
              :props="optionProps"
              :show-all-levels="true"
              @change="changeDept"
              clearable
              :disabled="formDisabled"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工作岗位" props="postIds">
            <el-select
              multiple
              v-model="addForm.postIds"
              placeholder="请选择工作岗位"
              @change="handleChange"
              :disabled="formDisabled"
            >
              <el-option
                v-for="dict in workList"
                :key="parseInt(dict.id)"
                :label="dict.name"
                :value="parseInt(dict.id)"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="可访问系统角色" prop="roleIds">
<!--                          <Treeselect-->
<!--                            :multiple="true"-->
<!--                            :options="roleList"-->
<!--                            v-model="addForm.roleIds"-->
<!--                            :normalizer="normalizer"-->
<!--                            placeholder="请选择可访问系统角色"-->
<!--                          />-->
            <el-cascader
              style="width: 100%"
              :show-all-levels="false"
              v-model="addForm.roleIdsList"
              :options="roleList"
              :props="props"
              clearable
              @change="changeRoleIds"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="mobile">
            <el-input
              v-model="addForm.mobile"
              placeholder="请输入手机号码"
              maxlength="11"
              :disabled="formDisabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" prop="certNo">
          <el-form-item label="账号状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="addForm.type==1">
        <el-col :span="12">
          <el-form-item label="身份证号">
            <el-input
              v-model="addForm.certNo"
              placeholder="请输入身份证号"
              maxlength="18"
              :disabled="formDisabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="addForm.sex" :disabled="formDisabled">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
              <el-radio :label="0">保密</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addUser, getWorkByDept, updateUser } from '@/api/system/user'
import {
  getDiglogworkApi,
  getUserApi,
  postAddUserApi
} from '@/views/applicationMaintenance/userManagement/accountNumber/api'
import Treeselect from "@riophae/vue-treeselect";
import getPathById from '@/libs/getPathById.js'
export default {
  name: 'OrgDialog',
  components:{Treeselect},
  watch:{

  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean,
      default: false
    },
    deptOptions2: {
      type: Array
    },
    // postList:{
    //   type : Array
    // },
    roleList: {
      type: Array
    },
    entrance: {
      type: String,
      required: true
    },
    getUserForm: {
      type: Object
    },
    formDisabled: {
      type: Boolean
    },


  },
  data() {
    return {
      workList:[],
      closeOnClickModal:false,
      postList: [],
      // 弹框数据
      addForm: {
        // subsystemIds: []
        type: 0,
        roleIds: ""
      },
      props: {
        value: 'id',
        label: 'name',
        children: 'children',
        multiple: true,
        checkStrictly: true
      },
      optionProps: {
        value: 'id',
        label: 'fullName',
        children: 'children',
        checkStrictly: true
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: '用户账号不能为空', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' }
        ],
        certNo: [
          { required: false, message: '身份证号不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择用户部门', trigger: 'change' }
        ],
        mobile: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        sex: [{ required: false, message: '请选择性别', trigger: 'change' }],
        status: [
          { required: true, message: '请选择当前状态', trigger: 'change' }
        ],
        subsystemIds: [
          { required: true, message: '请选择子系统', trigger: 'blur', type: 'array' }
        ],
        type: [
          { required: true, message: '请选择账号类型', trigger: 'change' }
        ],
        sort: [
          {
            required: true,
            pattern: /^[0-9]*$/,
            message: '排序号只能为数字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    // console.log()
    // this.addForm = JSON.parse(JSON.stringify(this.getUserForm))
    // console.log('修改窗口this.addForm', this.addForm)
    // if (this.entrance == 'revise') {
    //
    // }
    this.getDialogWork()

  },
  methods: {
    //获取弹框数据
    getUserFn(row){
      console.log('弹簧的ID',row)
      getUserApi({id:row.id}).then(res=>{
        this.addForm = res.data
          console.log('this.addForm',this.addForm)
        this.addForm.deptIdList = []
        this.addForm.deptIdList = getPathById(this.deptOptions2,res.data.deptId)
        this.addForm.postIds= res.data.postIdsStr
        }
      )
    },


    // 格式化部门的下拉框
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    //获取工作岗位
   async getDialogWork(){
   const  {data} = await getDiglogworkApi()
    this.workList = data
    },
    // 取消按钮
    cancel() {
      this.$emit('cancel')
      // this.open = false;
      this.reset()
    },
    // 表单重置
    reset() {
      this.addForm = {
        id: undefined,
        nickname: undefined,
        username: undefined,
        // deptId: undefined,
        mobile: undefined,
        sex: undefined,
        roleIds: undefined,
        roleIdsTemp: undefined,
        postIds: undefined,
        telPlatformStatus: undefined,
        telPlatformExt: undefined,
        telPlatformGroup: undefined,
        sort: undefined,
        workGroupIds: undefined,
        status: undefined,
        subsystemIds: [],
        deptIdList: []
      }
      this.userGroupList = []
      this.postList = []
      this.resetForm('addForm')
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log('entrance??', this.entrance)
      console.log('提交addForm', this.addForm)

      console.log('aww', this.addForm.subsystemIds)
      this.$refs.addForm.validate((valid) => {
        // const arr = []
        // if (this.addForm.roleIdsTemp.length) {
        //   this.addForm.roleIdsTemp.forEach(item => {
        //     arr.push(item[item.length - 1])
        //   })
        // }
        // this.addForm.roleIds = arr
        if (valid) {
          if (this.entrance == 'revise') {
            updateUser(this.addForm).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.$emit('cancel')
              this.$emit('getList')
            })
          } else {

            postAddUserApi(this.addForm).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.$emit('cancel')

              this.$emit('getList')

            })
          }
        }
      })
    },
    //部门切换
    changeDept(obj1) {
      console.log('obj1', obj1)
      let id = obj1[obj1.length - 1]
      this.addForm.deptId = id
      this.getWorkByDept(id)
      // this.getUserGroupByDept(id);
      // this.getRoleListByDept(id);
      // this.$emit('changeDept',obj1)

    },
    //可访问系统切换
    changeRoleIds(obj1) {
      console.log('obj1', obj1)
      let id = obj1[obj1.length - 1]
      this.addForm.roleIds = id
      // this.getWorkByDept(id)
      // this.getUserGroupByDept(id);
      // this.getRoleListByDept(id);
      // this.$emit('changeDept',obj1)

    },
    async getWorkByDept(id) {
      // await getWorkByDept(id).then((res) => {
      //   if (res.code == 0) {
      //     this.postList = (res.data[0] || {}).postDOS || [];
      //     this.addForm.postIds = undefined;
      //   }
      // });
      this.$emit('getWorkByDept', id)
      // console.log(' this.postList', this.postList)
    },
    handleChange(value) {
      console.log('value', value)

      this.addForm = { ...this.addForm }

    }
  }
}
</script>

<style scoped>

</style>
