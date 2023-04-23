<template>
  <el-dialog
    :title="boxTitle"
    :visible.sync="boxShow"
    width="800px"
    @close="cancel"
    append-to-body
  >
    <el-form ref="form" :model="list" :rules="rules" label-width="130px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="信息类型" prop="type">
            <el-select
              v-model="list.type"
              placeholder="请选择信息类型"
              clearable
              @change="changedata"
            >
              <el-option :key="0" label="应用类别" :value="0" />
              <el-option :key="1" label="具体类别" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="list.type !== 1">
          <el-form-item label="类别名称" prop="name">
            <el-input placeholder="请输入类别名称" v-model="list.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="list.type == 1">
          <el-form-item label="所在类别" prop="category">
            <el-select
              v-model="list.category"
              placeholder=""
              @change="changedata3"
              clearable
            >
              <el-option
                :key="index"
                :label="item.label"
                :value="item.value"
                v-for="(item, index) in dataSuperior2"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="list.type == 1">
          <el-form-item label="应用名称" prop="appName">
            <el-input placeholder="请输入应用名称" v-model="list.appName" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="list.type == 1">
          <el-form-item label="应用类型" prop="applyType">
            <el-select
              v-model="list.applyType"
              placeholder="请输入应用类型"
              clearable
              @change="changedata2"
            >
              <el-option :key="0" label="已有系统菜单（应用）" :value="0" />
              <el-option :key="1" label="自定义应用" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="list.type == 1 && list.applyType == 0">
          <el-form-item label="所属系统" prop="subsystemName">
            <el-select
              v-model="list.subsystemName"
              placeholder="请输入所属系统"
              @change="change"
              clearable
            >
              <el-option
                :key="index"
                :label="item.label"
                :value="item.value"
                v-for="(item, index) in dataSuperior3"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="list.type == 1 && list.applyType == 0">
          <el-form-item label="菜单应用" prop="menuName">
            <el-cascader
              ref="cascader"
              v-model="list.menuName"
              placeholder="请输入菜单应用"
              :options="dataSuperior4"
              clearable
              :props="{ checkStrictly: true }"
              @change="change2"
              @expand-change="expandchange"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="list.type == 1">
          <el-form-item label="访问路径" prop="accessPath">
            <el-input
              placeholder=""
              v-model="list.accessPath"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12" v-if="itemshow == 1">
          <el-form-item label="自定义应用" prop="ziyingyongName">
            <el-input placeholder="" v-model="list.ziyingyongName" />
          </el-form-item>
        </el-col> -->

        <el-col :span="12">
          <el-form-item label="显示排序" prop="sort">
            <el-input placeholder="请输入显示排序" v-model="list.sort" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否展示" prop="isShow">
            <el-select v-model="list.isShow" placeholder="" clearable>
              <el-option :key="0" label="是" :value="0" />
              <el-option :key="1" label="否" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="系统logo">
            <el-popover
              placement="bottom-start"
              width="460"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input
                slot="reference"
                v-model="list.systemLogo"
                placeholder="点击选择图标"
                readonly
              >
                <svg-icon
                  v-if="list.systemLogo"
                  slot="prefix"
                  :icon-class="list.systemLogo"
                  class="el-input__icon"
                  style="height: 32px; width: 16px"
                />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
            <el-upload
              class="avatar-uploader"
              :http-request="UploadImage"
              action="#"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imgPath" class="avatar" />
              <span class="el-icon-circle-plus-outline"></span>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      <el-button @click="querycancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  upload,
  selectList,
  getSystemType,
  getmenus,
} from "@/api/doorManage/doorManage.js";
import IconSelect from "@/components/IconSelect";
export default {
  name: "multBox",
  components: {
    IconSelect,
  },

  props: {
    dialogShow: {
      type: Boolean,
      default: false,
    },
    boxTitle: {
      type: String,
    },
    rowData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  mounted() {
    this.boxTitle = this.boxTitle;
    this.list = this.rowData;
    this.getSelectList();
    // this.getSystemType();
    // this.getmenusType();
  },
  watch: {
    dialogShow() {
      this.boxShow = this.dialogShow;
    },
    boxTitle() {
      this.boxTitle = this.boxTitle;
    },
    rowData() {
      this.list = this.rowData;
    },
  },

  data() {
    return {
      subsystemlds: [],
      imgPath: "",
      dialogVisible: false,
      disabled: true, //false为可用
      list: {
        type: "",
        appName: "",
        systemLogo: "",
        isShow: "",
        category: "",
        sort: "",
        applyType: "",
        accessPath: "",
        subsystemName: "",
        subsystemId: "",
        menuName: "",
        menuId: "",
        name: "",
      },
      optionProps: [],
      dataSuperior2: [],
      dataSuperior3: [],
      dataSuperior4: [],
      boxShow: this.dialogShow,
      imageUrl: "",
      rules: {
        type: [
          { required: true, message: "信息类型不能为空", trigger: "blur" },
        ],
        shortName: [
          { required: true, message: "类别名称不能为空", trigger: "blur" },
        ],
        isShow: [
          { required: true, message: "是否展示不能为空", trigger: "blur" },
        ],
        category: [
          { required: true, message: "所在类别不能为空", trigger: "blur" },
        ],
        sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        appName: [
          { required: true, message: "应用名称不能为空", trigger: "blur" },
        ],
        applyType: [
          { required: true, message: "应用类型不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "类别名称不能为空", trigger: "blur" },
        ],
        subsystemName: [
          { required: true, message: "所属系统不能为空", trigger: "blur" },
        ],
        menuName: [
          { required: true, message: "菜单应用不能为空", trigger: "blur" },
        ],
        //  accessPath: [
        //   { required: true, message: "访问路径不能为空", trigger: "blur" },
        // ],
      },
    };
  },
  methods: {
    //关闭弹窗
    cancel() {
      this.$refs["form"].clearValidate();
      this.$emit("cancel");
    },
    //取消
    querycancel() {
      this.boxShow = !this.dialogShow;
      this.$refs["form"].clearValidate();
      this.$emit("querycancel");
    },
    changedata(data) {
      console.log("选择下拉框", data);
    },
    //点击应用类型
    changedata2(data) {
      console.log("应用类型======>", data);
      if (data == 0) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
      this.getSystemType();
      this.dataSuperior3 = [];
    },
    //点击改变所在类别下拉框
    changedata3(data) {
      console.log("所在类别======>", data);
      let typeName = this.dataSuperior2.filter((item) => {
        return item.value === data;
      });
      this.list.category = typeName[0].label;
    },
    //确定按钮
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.boxShow = !this.dialogShow;
          this.$emit("quarycheck", this.list);
        }
      });
    },
    //点击上传图片
    UploadImage(item) {
      console.log("aaaaa=====>", item);
      const fd = new FormData();
      fd.append("file", item.file);
      upload(fd).then((res) => {
        if (res && res.code === 0) {
          this.imgPath = res.data;
          this.list.systemLogo = res.data;
        }
      });
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 选择图标
    selected(name) {
      console.log(name, "name");
      this.$set(this.list, "systemLogo", name);
    },
    handleAvatarSuccess(file) {
      console.log(file);
      // 使图片显示
      this.imgPath = URL.createObjectURL(file);
      this.dialogVisible = true;
      return false;
    },
    reset() {
      console.log(111111111);
      this.list = {};
      this.resetForm("form");
    },
    //所在类别下拉框
    getSelectList() {
      selectList().then((res) => {
        if (res && res.code === 0) {
          this.dataSuperior2 = res.data.map((item) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
        }
      });
    },
    //点击所属系统
    change(data, val) {
      console.log("所属系统", data);
      console.log(this.dataSuperior3, "pppppppppppppppp");
      let supName = this.dataSuperior3?.filter((item) => item.value == data);
      console.log("所属系统=====》", supName[0]);
      this.list.subsystemName = supName[0]?.label;
      this.subsystemlds = data;
      this.list.subsystemId = data;
      this.dataSuperior4 = [];
      this.getmenusType();
    },
    expandchange(data) {},
    //点击菜单应用
    change2(data) {
      console.log(this.dataSuperior4, "AAAAAAAAAAAA");
      let muenName1 = this.dataSuperior4.filter((item) => {
        return item.value == data[0];
      });
      console.log(muenName1, "muenName1");
      let arr = this.$refs["cascader"].getCheckedNodes();
      console.log("arr=============>", arr[0].data.label);
      this.list.menuName = arr[0].data.label;
      console.log("菜单应用", data);
      this.list.menuId = data[1];
    },
    //所属系统
    getSystemType() {
      getSystemType().then((res) => {
        if (res && res.code === 0) {
          this.dataSuperior3 = res.data.map((item) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
        }
      });
    },
    //所属菜单
    getmenusType() {
      let params = {
        subsystemIds: this.subsystemlds,
      };
      getmenus(params).then((res) => {
        if (res && res.code === 0) {
          res.data.map((item, index) => {
            item.value = item.id;
            item.label = item.name;
            delete item.name;
            delete item.id;
            if (item.children && item.children.length !== 0) {
              item.children.map((item2) => {
                item2.value = item2.id;
                item2.label = item2.name;
                delete item2.id;
                delete item2.name;
              });
            }
          });
          this.dataSuperior4 = res.data;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-input--medium {
  width: 230px;
}
.el-upload {
}
.el-icon-circle-plus-outline {
  font-size: 28px;
  position: absolute;
  left: 70%;
  top: 5%;
  transform: translate(-70% -5%);
}
</style>
