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
          <el-form-item label="系统名称" prop="name">
            <el-input placeholder="请输入上级机构" v-model="userList.name" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="系统类型" prop="type">
            <el-select
              v-model="userList.type"
              placeholder="请选择系统类型"
              clearable
              style="width: 210px"
            >
              <el-option :key="0" label="内部" :value="0" />
              <el-option :key="1" label="外部" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="初始访问路径" prop="url">
            <el-input placeholder="请输入初始访问路径" v-model="userList.url" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="系统联系电话" prop="phone">
            <el-input
              placeholder="请输入系统联系电话"
              v-model="userList.phone"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="显示排序" prop="sort">
            <el-input placeholder="请输入显示排序" v-model="userList.sort" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="系统状态" prop="status">
            <!-- <el-input placeholder="请输入备注" v-model="userList.categoryName" /> -->

            <el-select
              v-model="userList.status"
              placeholder="请选择系统状态"
              clearable
              style="width: 210px"
            >
              <el-option :key="0" label="开启" :value="0" />
              <el-option :key="1" label="关闭" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-form-item label="系统logo">
          <!--          <el-input v-model="form.iconPath" placeholder="请输入系统logo路径" />-->
          <el-upload
            class="avatar-uploader"
            :http-request="UploadImage"
            :action="abc"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.iconPath" :src="imgPath" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

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
import { add } from "../api/index";

export default {
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

    options: {
      type: Array,
    },

    dataPost: {
      type: Array,
    },

    // boxShow: false,
  },

  data() {
    return {
      abc: "",

      form: {},

      secOptions: [],

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
    /** 表单重置 */
    reset() {
      console.log(111111111);
      //   this.list = {
      //     id: undefined,
      //     parentName: undefined,
      //     fullName: undefined,
      //     shortName: undefined,
      //     regionalismName: undefined,
      //     classifyName: undefined,
      //     categoryName: undefined,
      //     creditCode: undefined,
      //     sort: undefined,
      //     status: undefined,
      //     role: undefined,

      //   };
      this.resetForm("form");
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        // 这里写错了  这里就没有row  只有list  row是上个页面传过来的  昨天说了  这个页面list是用来接受row的
        if (this.userList.id != null) {
          update(this.userList).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.boxShow = false;
            this.$emit("remoteData");
            this.reset();
          });
        }
        // 现在修改可以了  剩下的 就是刷新列表  你现在这歌是子组件  就没有getuser方法  这方法在副组件写着呢  所以没有办法刷新
        // 添加的提交
        add(this.userList).then((response) => {
          this.$modal.msgSuccess("新增成功");
          this.boxShow = false;
          // this.getUser();
          this.$emit("remoteData");
          // this.list=""
          this.reset();
        });
      });
    },

    cancel() {
      this.$emit("cancel");
      //   this.reset()
    },

    UploadImage(item) {
      const fd = new FormData();
      fd.append("file", item.file);
      uploadLogo(fd).then((res) => {
        if (res.code === 200) {
          this.$message.success("上传成功");
          this.form.iconPath = res.data;
          this.imgPath = res.data;
        }
      });
    },

    handleAvatarSuccess(res, file) {
      // this.form.iconPath = URL.createObjectURL(file.raw);
      console.log(file);
      // 使图片显示
      this.imgPath = URL.createObjectURL(file);
      return false;
    },

    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },

  },

  created() {
    console.log(this.userList);
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
</style>
