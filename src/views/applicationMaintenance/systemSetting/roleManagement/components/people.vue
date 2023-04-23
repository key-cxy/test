<template>
    <el-dialog :title="boxTitle" :visible.sync="boxShow" width="800px" @close="cancel">
        <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="超级管理员" prop="name">
                        <el-input placeholder="请输入超级管理员" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="管理员" prop="username">
                        <el-input placeholder="请输入管理员" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="分级管理员" prop="sex">
                        <el-select placeholder="请选择分级管理员" clearable style="width:100%">
                            <el-option :key="0" label="男" :value="0" />
                            <el-option :key="1" label="女" :value="1" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="运维人员" prop="username">
                        <el-input placeholder="请输入运维人员" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="第三方临时人员" prop="sex">
                        <el-select placeholder="请选择第三方临时人员" clearable style="width:100%">
                            <el-option :key="0" label="男" :value="0" />
                            <el-option :key="1" label="女" :value="1" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        boxTitle: {
            type: String,
            default: ""
        },
        boxShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            addForm: {

            },
            rules: {

            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        cancel() {
            this.$emit("cancel")
        }
    }
}
</script>

<style></style>