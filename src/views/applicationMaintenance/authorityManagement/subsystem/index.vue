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

          <el-form-item label="系统类型" prop="type" label-width="100px">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择系统类型"
              clearable
              style="width: 210px"
            >
              <el-option :key="0" label="内部" :value="0" />
              <el-option :key="1" label="外部" :value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="系统名称" prop="name" label-width="100px">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入系统名称"
              clearable
              style="width: 210px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="系统状态" prop="status" label-width="100px">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择系统状态"
              clearable
              style="width: 210px"
            >
              <el-option :key="1" label="开启" :value="1" />
              <el-option :key="0" label="关闭" :value="0" />
            </el-select>
          </el-form-item>

          <el-form-item>
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

          <el-table-column
            label="系统logo"
            align="center"
            key="iconPath"
            prop="iconPath"

            :show-overflow-tooltip="true"
          >
            　<template slot-scope="scope">
            　　　　<img :src="scope.row.iconPath" width="40" height="40" class="head_pic"/>
            　　</template>
          </el-table-column>

          <el-table-column
            label="系统名称"
            align="center"
            key="name"
            prop="name"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="系统类型"
            align="center"
            key="type"
            prop="type"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type === 0">内部</span>
              <span v-if="scope.row.type === 1">外部</span>
            </template>
          </el-table-column>


          <el-table-column
            label="显示排序"
            align="center"
            key="sort"
            prop="sort"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="系统状态"
            align="center"
            key="status"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">关闭</span>
              <span v-if="scope.row.status == 1">开启</span>
            </template>
          </el-table-column>

          <!--          <el-table-column prop="status" label="菜单状态" width="100">-->
          <!--            <template slot-scope="scope">-->
          <!--              <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status"/>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
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
                  @click="handleView(scope.row, '1')"
                  v-hasPermi="['system:user:update']"
                >查看</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleView(scope.row, '2')"
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

      <el-form ref="form" :model="form" :rules="rules" label-width="130px" :disabled="formDisabled">

        <el-row>
          <el-col :span="12">
            <el-form-item label="系统类型" prop="type">
              <el-select
                v-model="form.type"
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
            <el-form-item label="系统名称" prop="name">
              <el-input placeholder="请输入系统名称" v-model="form.name" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="初始访问路径" prop="url">
              <el-input
                placeholder="请输入初始访问路径"
                v-model="form.url"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="系统联系电话" prop="phone">
              <el-input
                placeholder="请输入系统联系电话"
                v-model="form.phone"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="系统状态" prop="status">
              <el-select
                v-model="form.status"
                placeholder="请选择系统状态"
                clearable
                style="width: 210px"
              >
                <el-option :key="1" label="开启" value="1" />
                <el-option :key="0" label="关闭" value="0" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number
                v-model="form.sort"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
            <!--            <el-form-item label="显示排序" prop="sort">-->
            <!--              <el-input placeholder="请输入显示排序" v-model.number="form.sort" />-->
            <!--            </el-form-item>-->
          </el-col>



          <el-col :span="12">
            <el-form-item label="系统logo" >
              <el-upload
                class="avatar-uploader"
                :http-request="UploadLogo"
                action="abc"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePictureCardPreview"
                :disabled="formDisabled"
              >
                <img v-if="form.iconPath" :src="imgPath" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>


          <el-col :span = "24">
            <el-form-item label="系统界面">
              <el-upload
                ref="uploadImage"
                :http-request="UploadImage"
                :on-success="handleAvatarSuccess"
                action="abc"
                multiple
                :file-list="fileList"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">

                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="!formDisabled">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- <childBox
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
import { getData } from "./api/index";
import { view } from "./api/index";
import { update,DeleteImage } from "./api/index";
import { add,singleUpload } from "./api/index";
import { deleteData,deleteImgApi} from "./api/index";
import {uploadLogoApi,uploadImageApi} from "@/api/system/subSystem";

import {} from "./api/index";


export default {
  components: {
  },

  data() {
    return {
      deletePathId:'',
      fileList:[],
      picPath: [],
      entrance:"",
      isUpdate:"",
      imgFiles:[],
      dialogImageUrl: '',
      dialogVisible: false,
      imageUrl: '',
      boxShow: false, //新增修改弹出框
      open: false, // 是否显示弹出层
      boxTitle: "", //新增修改标题
      total: 0,
      userList: [],
      row: {},
      rules: {
        name: [
          { required: true, message: "系统名称不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "系统类型不能为空", trigger: "multiple" },
        ],
        url: [{ required: false, message: "访问路径不能为空", trigger: "blur" }],
        secret: [
          { required: true, message: "登录密钥不能为空", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "显示排序不能为空且需为数值型", trigger: "blur" },
          // { type: 'number', message: '年龄必须为数字值'}
        ],
        status: [
          { required: true, message: "系统状态不能为空", trigger: "multiple" },
        ],
        phone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      imgPath:"",
      options: [],
      dataPost: [],
      abc: "",
      form: {
        type:'',
        status:'',
        picPath: []
      },
      secOptions: [],
      formDisabled:false,
      queryParams: {
        type: "",
        name: "",
        status: undefined,
        pageNo: 1,
        pageSize: 10,
      },

    };
  },

  mounted() {
    this.getList();
  },
  methods: {
    handleRemove(file, fileList) {
      let deletePath ={
        id:this.deletePathId,
        path : file.url
      }
      // let path = {path:file.url}
      // deleteImgApi(path).then( async (res)=>{
      //   console.log(  "第一次请求结果",res)
      //
      //  await DeleteImage(deletePath)
      //  //   .then(res=> {
      //  //   // this.form.picPath = res.data
      //  //   console.log("第二次请求结果",res)
      //  // })
      // })
      const str = file.url
      for(let i = 0; i<this.form.picPath.length; i++){
        if(this.form.picPath[i] == str){
          this.form.picPath.splice(i,1)
        }
      }
      console.log('删除后的this.form.picPath',this.form.picPath)
      this.imgFiles = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    //上传图片 请求数据
    singleUpload(param){
      let fileObj = param.file;
      singleUpload({file:fileObj}).then(res => {
        console.log("singleUpload",res)
      })

    },

    remoteData() {
      this.getList(); //baocun  yemian  baocun   haole
    },

    handleAdd() {
      const _self = this;
      // allOrganization({}).then((response) =>{
      //   console.log(response,"这是response");
      //   let arr = []
      //   for( let i in response.data) {
      //     arr.push({
      //       lable:response.data[i].id,
      //       value:response.data[i].fullName
      //     })
      //     _self.options = response.data
      //     _self.dataPost = [].concat(arr)
      //     console.log(_self.dataPost,"这是_self.dataPost");
      //   }
      // })
      this.boxShow = true;
      this.boxTitle = "新增";
      this.formDisabled = false;
      //入口判断
      this.entrance = "add"

      this.$nextTick(() => {
        this.form = {
          name:'',
          type:"",
          url:'',
          phone:'',
          sort:'',
          status:'',
          picPath:[]
        }
      });
    },

    //弹窗 组织机构接口
    // allOrganization() {
    //   let  _self = this;
    // },

    cancel() {
      this.$refs.uploadImage.clearFiles()
      this.fileList = []
      this.boxShow = false;
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },

    //** 查询角色列表 */
    getList() {
      this.loading = true;
      console.log('this.queryParams',)
      getData(this.queryParams)
        .then((response) => {
          console.log(response, "response");
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

    /** 修改按钮操作 */
  async  handleView(row,type) {
    this.$bus.$emit("title",11111)
      this.entrance = "revise"
      // this.$refs.from.reset();
      const id = row.id;
      this.deletePathId = row.id
      await view(id).then((response) => {
        this.form = response.data;
        this.imgPath = this.form.iconPath;
        if(this.form.picPath){
          this.form.picPath = this.form.picPath.split(',')
          this.form.picPath.forEach( item => {
            this.fileList.push({url:item})
          } )
        }
        this.boxShow = true;
        this.title = "修改数据";
        if(type =="2") {
          this.boxTitle = "修改";
          this.formDisabled = false
          this.isUpdate = row.id
          // this.formItemDisabled = true;
        }else {
          this.boxTitle = "查看";
          this.formDisabled = true
        }
      });
      console.log(  22222)
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row,"row");
      // const id = row.id;
      this.$modal
        .confirm('是否确认删除系统名称为"' + row.name + '"的数据项?')
        .then(function () {
          return deleteData(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {
        });
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        // 这里写错了  这里就没有row  只有list  row是上个页面传过来的  昨天说了  这个页面list是用来接受row的
        if (this.entrance == "revise") {
          let newUserList = this.userList.filter( item =>{
            return item.id == this.isUpdate
          } )
          this.form.picPath = this.form.picPath.join(',')
          update(this.form).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.$refs.uploadImage.clearFiles()
            this.boxShow = false;
            this.getList()
            this.reset();

          })
        }else if(this.entrance == "add"){
          this.form.picPath = this.form.picPath.join(',')
          add(this.form).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.getList()
            this.$refs.uploadImage.clearFiles()
            this.boxShow = false;
            // this.getUser();
            // this.$emit("remoteData");
            this.reset();

          });
        }
        // 现在修改可以了  剩下的 就是刷新列表  你现在这歌是子组件  就没有getuser方法  这方法在副组件写着呢  所以没有办法刷新
        // 添加的提交

      });
    },

    // 单张图片上传
    UploadLogo(item) {
      const fd = new FormData();
      fd.append("file", item.file);
      uploadLogoApi(fd).then((res) => {
        console.log("uploadLogoApi",res)
        if (res.code === 0) {
          this.$message.success("上传成功");
          this.form.iconPath = res.data;
          this.imgPath = res.data;
          console.log("this.imgPath",this.imgPath)
          this.getList()
        }
      });
    },

    //多图片上传
    UploadImage(raw) {
      this.imgFiles.push(raw.file)
      console.log("this.imgFiles",this.imgFiles)
      // this.$refs.upload.submit() // 这里是执行文件上传的函数，其实也就是获取我们要上传的文件
      this.getimgs()

    },

    getimgs(){
      this.$nextTick(()=>{
        const fd = new FormData()
        this.imgFiles.forEach( (file) => {
          fd.append("files",file)
        })
        uploadImageApi(fd).then((res) => {
          console.log("uploadImageApi",res)
          if (res.code == 0) {
            this.$message.success("上传成功");
            console.log( ' 看属性',typeof this.form.picPath)
            // this.form.picPath = res.data;
            this.form.picPath.push(res.data);

            // this.imgPath = res.data;
          }
        });
      })
    },

    handleAvatarSuccess(res, file) {
      // this.form.iconPath = URL.createObjectURL(file.raw);
      // 使图片显示
      this.imgPath = URL.createObjectURL(file);
      return false;
    },
    //
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },

  },
};
</script>

<style lang="less" scoped>
::v-deep.uploadCss{
  background:green;
  display: flex;

}
::v-deep.el-upload--picture-card{
  background:red;
  display: flex;
}
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

::v-deep.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
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


