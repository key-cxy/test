<template>
    <el-dialog :title="boxTitle" :visible.sync="boxShow" width="400px" @close="cancel">
        <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="姓名" prop="name">
                        <el-input placeholder="请输入姓名" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="手机号" prop="name">
                        <el-input placeholder="请输入手机号" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="注册时间" prop="name">
                        <el-date-picker v-model="value1" type="datetime" value-format="yyyy-MM-dd HH:MM:SS"
                            placeholder="选择注册时间" style="width: 100%">
                        </el-date-picker>
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