<template>
  <el-dialog
    :title="boxTitle"
    :visible.sync="boxShow"
    width="800px"
    @close="cancel"
    append-to-body
  >

    <el-form ref="form" :model="userList" :rules="rules" label-width="130px">

      <el-row>

        <el-col :span="12">
          <el-form-item label="岗位类型" prop="postType">
             <el-select
              v-model="userList.postType"
              placeholder="请选择岗位类型"
              clearable
              style="width: 210px"
            >
              <el-option :key="0" label="公用类型" :value="0" />
              <el-option :key="1" label="组织机构专用" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所属组织机构" prop="fullName">
              <el-select
              v-model="userList.fullName"
              placeholder="请选择所属组织机构"
              clearable
            >
              <el-option
                :key="index"
                :label="item.label"
                :value="item.value"
                v-for="(item,index) in dataPost"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="岗位名称" prop="name">
            <el-input placeholder="请输入岗位名称" v-model="userList.name" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="显示排序" prop="sort">
            <el-input
              placeholder="请输入显示排序"
              v-model="userList.sort"
            />
          </el-form-item>
        </el-col>

        <!-- <el-col :span="12">
          <el-form-item label="岗位状态" prop="status">
            <el-input placeholder="请输入岗位状态" v-model="userList.status" />
          </el-form-item>
        </el-col> -->

        <el-col :span="12">
          <el-form-item label="岗位状态" prop="status">
             <el-select
              v-model="userList.status"
              placeholder="请选择岗位状态"
              clearable
            >
              <el-option :key="0" label="正常" :value="0" />
              <el-option :key="1" label="停用" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="备注" prop="categoryName">
            <el-input placeholder="请输入备注" v-model="userList.categoryName" />
          </el-form-item>
        </el-col>

        <!-- <el-col :span="12">
          <el-form-item label="岗位图标" prop="creditCode">
            <el-input placeholder="请输入岗位图标" v-model="userList.creditCode" />
          </el-form-item>
        </el-col> -->

          <el-col :span="24">
            <el-form-item v-if="userList.type !== 3" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input
                  slot="reference"
                  v-model="userList.icon"
                  placeholder="点击选择图标"
                  readonly
                >
                  <svg-icon
                    v-if="userList.icon"
                    slot="prefix"
                    :icon-class="userList.icon"
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
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>
 import { update } from "../api/index";
 import { add} from"../api/index"
import IconSelect from "@/components/IconSelect";


export default {
  components:{
    IconSelect
  },
  props: {
    userList: {},

    boxTitle: {
      type: String,
      default: "",
    },
    boxShow: {
      type: Boolean,
      default: false,
    },
    options:{
      type:Array
    },
    dataPost:{
      type:Array
    },
    // boxShow: false,
  },
  created(){
  },
  data() {
    return {
      form: {},
      secOptions:[],
      // 表单校验
      //   rules: {
      //     parentName: [{ required: true, message: "上级机构不能为空", trigger: "blur" }
      //     ],
      //     fullName: [
      //       { required: true, message: "机构全称不能为空", trigger: "blur" },
      //     ],
      //     shortName: [
      //       { required: true, message: "机构简称不能为空", trigger: "blur" },
      //     ],
      //     regionalismName: [
      //       { required: true, message: "所属行政区划不能为空", trigger: "blur" },
      //     ],
      //     classifyName: [
      //       { required: true, message: "机构分类不能为空", trigger: "blur" },
      //     ],
      //     categoryName: [
      //       { required: true, message: "机构类别不能为空", trigger: "blur" },
      //     ],
      //     creditCode: [
      //       { required: true, message: "统一社会信用代码不能为空", trigger: "blur" },
      //     ],
      //     sort: [
      //       { required: true, message: "显示排序不能为空", trigger: "blur" },
      //     ],
      //     status: [
      //       { required: true, message: "机构状态不能为空", trigger: "blur" },
      //     ],
      //     role: [
      //       { required: true, message: "系统角色不能为空", trigger: "blur" },
      //     ],
      //   },

      rules: {},
    };
  },
  methods: {
    // 选择图标
    selected(name) {
      console.log(name,"name");
      this.$set(this.userList,'icon',name);
    },

    /** 表单重置 */
    reset() {
      console.log(111111111);
        this.list = {
          // id: undefined,
          // parentName: undefined,
          // fullName: undefined,
          // shortName: undefined,
          // regionalismName: undefined,
          // classifyName: undefined,
          // categoryName: undefined,
          // creditCode: undefined,
          // sort: undefined,
          // status: undefined,
          // role: undefined,
          icon: undefined,

        };
      this.resetForm("form");
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        // conlose.log(this.userList)
        // 这里写错了  这里就没有row  只有list  row是上个页面传过来的  昨天说了  这个页面list是用来接受row的
        if (this.userList.id != null) {
          update(this.userList).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.boxShow = false;
            this.$emit('remoteData');
            this.reset()
          });
        }
          console.log(this.userList,'ccccc')

          // this.userList.id = this.userList.fullName;
          this.userList.organizationId = this.userList.fullName
          // delete 
          delete this.userList.fullName;
        // 现在修改可以了  剩下的 就是刷新列表  你现在这歌是子组件  就没有getuser方法  这方法在副组件写着呢  所以没有办法刷新
        // 添加的提交
        add(this.userList).then((response) => {
          this.$modal.msgSuccess("新增成功");
          // this.getUser();
            this.$emit('remoteData');
            // this.list=""
            this.reset();
            this.boxShow = false;
        });
      });
    },

    cancel() {
      this.$emit("cancel");
      //   this.reset()
    },
  },
  created() {
  },
};
</script>

<style></style>
