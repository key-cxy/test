<template>
  <div class="app-container">
    <doc-alert title="工作流" url="https://doc.iocoder.cn/bpm" />

    <!-- 搜索工作栏 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="流程标识" prop="key">
        <el-input
          v-model="queryParams.key"
          placeholder="请输入流程标识"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="流程名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入流程名称"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="流程分类" prop="category">
        <el-select
          v-model="queryParams.category"
          placeholder="流程分类"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in categoryDictDatas"
            :key="parseInt(dict.value)"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['bpm:model:create']"
          >新建流程</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['bpm:model:import']"
          >导入流程</el-button
        >
      </el-col>

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="流程标识" align="center" prop="key" />
      <el-table-column label="流程名称" align="center" prop="name" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="handleBpmnDetail(scope.row)">
            <span>{{ scope.row.name }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="流程分类"
        align="center"
        prop="category"
        width="100"
      >
        <template slot-scope="scope">
          <dict-tag
            :type="DICT_TYPE.BPM_MODEL_CATEGORY"
            :value="scope.row.category"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="表单信息"
        align="center"
        prop="formType"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.formId"
            type="text"
            @click="handleFormDetail(scope.row)"
          >
            <span>{{ scope.row.formName }}</span>
          </el-button>
          <el-button
            v-else-if="scope.row.formCustomCreatePath"
            type="text"
            @click="handleFormDetail(scope.row)"
          >
            <span>{{ scope.row.formCustomCreatePath }}</span>
          </el-button>
          <label v-else>暂无表单</label>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最新部署的流程定义" align="center">
        <el-table-column
          label="流程版本"
          align="center"
          prop="processDefinition.version"
          width="80"
        >
          <template slot-scope="scope">
            <el-tag size="medium" v-if="scope.row.processDefinition"
              >v{{ scope.row.processDefinition.version }}</el-tag
            >
            <el-tag size="medium" type="warning" v-else>未部署</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="激活状态"
          align="center"
          prop="processDefinition.version"
          width="80"
        >
          <template slot-scope="scope">
            <el-switch
              v-if="scope.row.processDefinition"
              v-model="scope.row.processDefinition.suspensionState"
              :active-value="1"
              :inactive-value="2"
              @change="handleChangeState(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="部署时间"
          align="center"
          prop="deploymentTime"
          width="180"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.processDefinition">{{
              parseTime(scope.row.processDefinition.deploymentTime)
            }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center" width="350" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bpm:model:update']"
            >修改流程</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleDesign(scope.row)"
            v-hasPermi="['bpm:model:update']"
            >设计流程</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-custom"
            @click="handleAssignRule(scope.row)"
            v-hasPermi="['bpm:task-assign-rule:query']"
            >分配规则</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-thumb"
            @click="handleDeploy(scope.row)"
            v-hasPermi="['bpm:model:deploy']"
            >发布流程</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-ice-cream-round"
            @click="handleDefinitionList(scope.row)"
            v-hasPermi="['bpm:process-definition:query']"
            >流程定义</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-ice-cream-round"
            @click="handleOpenModal(scope.row)"
            >任务配置</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bpm:model:delete']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 流程表单配置详情 -->
    <el-dialog
      title="表单详情"
      :visible.sync="detailOpen"
      width="50%"
      append-to-body
    >
      <parser :key="new Date().getTime()" :form-conf="detailForm" />
    </el-dialog>

    <!-- 流程模型图的预览 -->
    <el-dialog
      title="流程图"
      :visible.sync="showBpmnOpen"
      width="80%"
      append-to-body
    >
      <my-process-viewer
        key="designer"
        v-model="bpmnXML"
        v-bind="bpmnControlForm"
      />
    </el-dialog>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="流程标识" prop="key">
          <el-input
            v-model="form.key"
            placeholder="请输入流标标识"
            style="width: 330px"
            :disabled="form.id"
          />
          <el-tooltip
            v-if="!form.id"
            class="item"
            effect="light"
            content="新建后，流程标识不可修改！"
            placement="top"
          >
            <i style="padding-left: 5px" class="el-icon-question" />
          </el-tooltip>
          <el-tooltip
            v-else
            class="item"
            effect="light"
            content="流程标识不可修改！"
            placement="top"
          >
            <i style="padding-left: 5px" class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="流程名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入流程名称"
            :disabled="form.id"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="form.id" label="流程分类" prop="category">
          <el-select
            v-model="form.category"
            placeholder="请选择流程分类"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="dict in categoryDictDatas"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流程描述" prop="description">
          <el-input type="textarea" v-model="form.description" clearable />
        </el-form-item>
        <div v-if="form.id">
          <el-form-item label="表单类型" prop="formType">
            <el-radio-group v-model="form.formType">
              <el-radio
                v-for="dict in modelFormTypeDictDatas"
                :key="parseInt(dict.value)"
                :label="parseInt(dict.value)"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="form.formType === 10"
            label="流程表单"
            prop="formId"
          >
            <el-select v-model="form.formId" clearable style="width: 100%">
              <el-option
                v-for="form in forms"
                :key="form.id"
                :label="form.name"
                :value="form.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="form.formType === 20"
            label="表单提交路由"
            prop="formCustomCreatePath"
          >
            <el-input
              v-model="form.formCustomCreatePath"
              placeholder="请输入表单提交路由"
              style="width: 330px"
            />
            <el-tooltip
              class="item"
              effect="light"
              content="自定义表单的提交路径，使用 Vue 的路由地址，例如说：bpm/oa/leave/create"
              placement="top"
            >
              <i style="padding-left: 5px" class="el-icon-question" />
            </el-tooltip>
          </el-form-item>
          <el-form-item
            v-if="form.formType === 20"
            label="表单查看路由"
            prop="formCustomViewPath"
          >
            <el-input
              v-model="form.formCustomViewPath"
              placeholder="请输入表单查看路由"
              style="width: 330px"
            />
            <el-tooltip
              class="item"
              effect="light"
              content="自定义表单的查看路径，使用 Vue 的路由地址，例如说：bpm/oa/leave/view"
              placement="top"
            >
              <i style="padding-left: 5px" class="el-icon-question" />
            </el-tooltip>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      title="导入流程"
      :visible.sync="upload.open"
      width="530px"
      append-to-body
    >
      <div class="el-upload__tip">
        <el-form
          ref="uploadForm"
          size="mini"
          label-width="110px"
          :model="upload.form"
          :rules="upload.rules"
          @submit.native.prevent
        >
          <el-form-item label="bpmn文件">
            <el-upload
              ref="upload"
              :limit="1"
              accept=".bpmn, .xml"
              :headers="upload.headers"
              :action="upload.url"
              :disabled="upload.isUploading"
              :on-progress="handleFileUploadProgress"
              :on-success="handleFileSuccess"
              :on-change="handleChange"
              :auto-upload="false"
              name="bpmnFile"
              :data="upload.form"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" style="color: red" slot="tip">
                提示：仅允许导入“bpm”或“xml”格式文件！
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="分配规则文件">
            <el-upload
              ref="upload1"
              :limit="1"
              accept=".xlsx, .xls"
              :headers="upload.headers"
              :action="upload.url"
              :disabled="upload.isUploading"
              :on-progress="handleFileUploadProgress"
              :on-success="handleFileSuccess"
              :auto-upload="false"
              :on-change="handleChange1"
              name="ruleFile"
              :data="upload.form"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" style="color: red" slot="tip">
                提示：仅允许导入“xlsx”或“xls”格式文件！
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="任务配置文件">
            <el-upload
              ref="upload2"
              :limit="1"
              accept=".xlsx, .xls"
              :headers="upload.headers"
              :action="upload.url"
              :disabled="upload.isUploading"
              :on-progress="handleFileUploadProgress"
              :on-success="handleFileSuccess"
              :auto-upload="false"
              :on-change="handleChange2"
              name="configFile"
              :data="upload.form"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" style="color: red" slot="tip">
                提示：仅允许导入“xlsx”或“xls”格式文件！
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="流程标识" prop="key">
            <el-input
              v-model="upload.form.key"
              placeholder="请输入流标标识"
              style="width: 250px"
            />
            <el-tooltip
              class="item"
              effect="light"
              content="新建后，流程标识不可修改！"
              placement="top"
            >
              <i style="padding-left: 5px" class="el-icon-question" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="流程名称" prop="name">
            <el-input
              v-model="upload.form.name"
              placeholder="请输入流程名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="流程描述" prop="description">
            <el-input
              type="textarea"
              v-model="upload.form.description"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="uploadClose">取 消</el-button>
      </div>
    </el-dialog>

    <!--    任务配置对话框-->
    <el-dialog
      title="任务配置"
      :visible.sync="modalOpen"
      width="800px"
      append-to-body
    >
      <el-button
        @click="handleDownLoadProcess"
        size="small"
        type="primary"
        style="margin-bottom: 10px"
        ><i class="el-icon-download el-icon--right"></i>导出配置</el-button
      >
      <div class="tabHeader">
        <div class="th">任务名称</div>
        <div class="th">标识</div>
        <div class="th">Java类</div>
        <div class="th">操作</div>
      </div>
      <div class="tabItem" v-for="(item, index) in tableData" :key="index">
        <div class="item" @click="changeIndex(index)">
          <span v-if="colIndex === index && infoOpen"
            ><i class="el-icon-arrow-down"></i
          ></span>
          <span v-else><i class="el-icon-arrow-right"></i></span>
          {{ item.nodeName }}
        </div>
        <div class="item">{{ item.nodeId }}</div>
        <div class="item">{{ item.executionClass }}</div>
        <div class="item">
          <el-button size="mini" type="text" @click="addButton(item)"
            >新增操作</el-button
          >
          <el-button size="mini" type="text" @click="updateNode(item)"
            >编辑</el-button
          >
        </div>
        <div class="buttonInfo" v-if="colIndex === index && infoOpen">
          <div class="buttonTabHeader">
            <div class="th">操作名称</div>
            <div class="th">操作来源</div>
            <div class="th">操作类型</div>
            <div class="th">绑定流程</div>
            <div class="th">操作可见性</div>
            <div class="th">可见性匹配</div>
            <div class="th">操作</div>
          </div>
          <div
            class="buttonTabItem"
            v-for="(i, index) in item.children"
            :key="index"
          >
            <div class="item">{{ i.buttonName }}</div>
            <div class="item">
              <span v-if="i.buttonType === '0'">绘制</span>
              <span v-if="i.buttonType === '1'">手动添加</span>
            </div>
            <div class="item">{{ i.operateType || "" }}</div>
            <div class="item">{{ i.subProcDefName || "" }}</div>
            <div class="item">
              <span v-if="i.permissionStatus === 0">全部可见</span>
              <span v-else>部分可见</span>
            </div>
            <div class="item">
              <span v-if="i.permission === '0'"></span>
              <span v-else>{{ i.permission }}</span>
            </div>
            <div class="item">
              <el-button size="mini" type="text" @click="updateButton(i)"
                >编辑</el-button
              >
              <el-button
                style="color: red"
                v-if="i.buttonType === '1'"
                size="mini"
                type="text"
                @click="handleButtonDelete(i)"
                >删除</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--    编辑任务-->
    <el-dialog
      :title="modalTitle"
      :visible.sync="modalOpen3"
      width="600px"
      append-to-body
    >
      <el-form
        ref="buttonForm1"
        :model="buttonForm1"
        :rules="buttonRules1"
        label-width="110px"
      >
        <el-form-item label="任务名称：" prop="nodeName">
          <el-input
            v-model="buttonForm1.nodeName"
            disabled
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="任务标识：" prop="procDefKey">
          <el-input
            v-model="buttonForm1.procDefKey"
            disabled
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="监听Java类：" prop="executionClass">
          <el-input v-model="buttonForm1.executionClass" style="width: 100%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitButtonForm1">确 定</el-button>
        <el-button @click="cancelButtonForm1">取 消</el-button>
      </div>
    </el-dialog>
    <!--    新增编辑操作-->
    <el-dialog
      :title="modalTitle"
      :visible.sync="modalOpen2"
      width="600px"
      append-to-body
    >
      <el-form
        ref="buttonForm"
        :model="buttonForm"
        :rules="buttonRules"
        label-width="110px"
      >
        <el-form-item label="任务名称：" prop="nodeName">
          <el-input
            v-model="buttonForm.nodeName"
            disabled
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="任务标识：" prop="procDefKey">
          <el-input
            v-model="buttonForm.procDefKey"
            disabled
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="操作名称：" prop="buttonName">
          <el-input
            v-model="buttonForm.buttonName"
            :disabled="isUpdate"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="outLineName：">
          <el-input
            v-model="buttonForm.outLineName"
            disabled
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="操作来源：" prop="buttonType">
          <el-select
            v-model="buttonForm.buttonType"
            placeholder="请选择操作来源"
            disabled
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="dict in buttonTypeList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型：" prop="operateType">
          <el-select
            v-model="buttonForm.operateType"
            placeholder="请选择操作类型"
            @change="changeType"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="dict in operateTypeList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流转条件：" prop="condition">
          <el-input
            v-model="buttonForm.condition"
            :disabled="isUpdate"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="监听Java类：" prop="executionClass">
          <el-input v-model="buttonForm.executionClass" style="width: 100%" />
        </el-form-item>
        <el-form-item label="绑定流程：" prop="subProcDefKey">
          <el-select
            v-model="buttonForm.subProcDefKey"
            placeholder="请选择绑定流程"
            clearable
            @change="changePro"
            style="width: 100%"
          >
            <el-option
              v-for="dict in subProcDefNameList"
              :key="dict.procDefKey"
              :label="dict.procDefName"
              :value="dict.procDefKey"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="挂起主流程：" prop="suspensionFlag">
          <el-radio-group v-model="buttonForm.suspensionFlag">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="可见性：" prop="permissionStatus">
          <el-radio-group v-model="buttonForm.permissionStatus">
            <el-radio :label="0">全部可见</el-radio>
            <el-radio :label="1">部分可见</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="匹配规则：" prop="permission">
          <el-input
            v-model="buttonForm.permission"
            placeholder="多个请用,隔开"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model="buttonForm.sort" style="width: 100%" />
        </el-form-item>
        <el-form-item label="部门编辑权限：">
          <Select v-model="buttonForm.deptEditPermission">
            <Option
              v-for="item in deptEditPermissionList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitButtonForm">确 定</el-button>
        <el-button @click="cancelButtonForm">取 消</el-button>
      </div>
    </el-dialog>

    <!-- ========== 流程任务分配规则 ========== -->
    <taskAssignRuleDialog ref="taskAssignRuleDialog" />
  </div>
</template>

<script>
import {
  deleteModel,
  deployModel,
  getModelPage,
  getModel,
  updateModelState,
  createModel,
  updateModel,
  getBpmFlowTree,
  getListByType,
  getBpmByType,
  handleButtonCreate,
  handleButtonDelete,
  handleButtonUpdate,
  handleImportProcess,
  handleDownLoadProcess,
} from "@/api/bpm/model";
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import { getForm, getSimpleForms } from "@/api/bpm/form";
import { decodeFields } from "@/utils/formGenerator";
import Parser from "@/components/parser/Parser";
import { getBaseHeader } from "@/utils/request";
import taskAssignRuleDialog from "../taskAssignRule/taskAssignRuleDialog";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { constants } from "fs";
import { async } from "q";

export default {
  name: "model",
  components: {
    Parser,
    Treeselect,
    taskAssignRuleDialog,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },

      // BPMN 数据
      showBpmnOpen: false,
      bpmnXML: null,
      bpmnControlForm: {
        prefix: "activiti",
      },

      // 流程表单详情
      detailOpen: false,
      detailForm: {
        fields: [],
      },

      // 流程表单
      title: "",
      open: false,
      modalOpen: false,
      modalOpen2: false,
      modalOpen3: false,
      form: {},
      // 表单校验
      rules: {
        key: [{ required: true, message: "流程标识不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "流程名称不能为空", trigger: "blur" },
        ],
        formType: [
          { required: true, message: "流程名称不能为空", trigger: "blur" },
        ],
        formId: [
          { required: true, message: "业务表单不能为空", trigger: "blur" },
        ],
        category: [
          { required: true, message: "流程分类不能为空", trigger: "blur" },
        ],
        formCustomCreatePath: [
          { required: true, message: "表单提交路由不能为空", trigger: "blur" },
        ],
        formCustomViewPath: [
          { required: true, message: "表单查看路由不能为空", trigger: "blur" },
        ],
      },
      buttonRules: {},
      buttonRules1: {},

      // 流程导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/admin-api" + "/bpm/model/import",
        // 表单
        form: {},
        // 校验规则
        rules: {
          key: [
            { required: true, message: "流程标识不能为空", trigger: "blur" },
          ],
          name: [
            { required: true, message: "流程名称不能为空", trigger: "blur" },
          ],
        },
      },
      // 流程表单的下拉框的数据
      forms: [],
      buttonForm: [],
      buttonForm1: [],
      buttonTypeList: [
        {
          value: "0",
          label: "绘制",
        },
        {
          value: "1",
          label: "手动添加",
        },
      ],
      deptEditPermissionList: [
        {
          value: 0,
          label: "禁止",
        },
        {
          value: 1,
          label: "全部可编辑",
        },
        {
          value: 2,
          label: "部门",
        },
        {
          value: 3,
          label: "考核单位",
        },
      ],
      operateTypeList: [],
      subProcDefNameList: [],

      // 数据字典
      categoryDictDatas: getDictDatas(DICT_TYPE.BPM_MODEL_CATEGORY),
      modelFormTypeDictDatas: getDictDatas(DICT_TYPE.BPM_MODEL_FORM_TYPE),
      taskAssignRuleDictDatas: getDictDatas(
        DICT_TYPE.BPM_TASK_ASSIGN_RULE_TYPE
      ),

      tableData: [],
      colIndex: null,
      infoOpen: false,
      procDefKey: "",
      modalTitle: "",
      localFile: null,
      isUpdate: false,
    };
  },
  created() {
    this.getList();
    // 获得流程表单的下拉框的数据
    getSimpleForms().then((response) => {
      this.forms = response.data;
    });
  },
  methods: {
    handleChange(event) {
      // 选取图片后自动回调，里面可以获取到文件imgSaveToUrl(event或file)
      // 也可以用file或者 this.localFile=file.raw
      this.localFile = event.raw;
      this.upload.form.bpmnFile = event.raw;
      // 转换操作可以不放到这个函数里面，
      // 因为这个函数会被多次触发，上传时触发，上传成功也触发
      // let reader = new FileReader();
      // reader.readAsDataURL(this.localFile);
      // reader.onload = () => {
      //   console.log(reader.result);
      // };
    },
    handleChange1(event) {
      // 选取图片后自动回调，里面可以获取到文件imgSaveToUrl(event或file)
      // 也可以用file或者 this.localFile=file.raw
      this.localFile = event.raw;
      this.upload.form.ruleFile = event.raw;
      // 转换操作可以不放到这个函数里面，
      // 因为这个函数会被多次触发，上传时触发，上传成功也触发
      // let reader = new FileReader();
      // reader.readAsDataURL(this.localFile);
      // reader.onload = () => {
      //   console.log(reader.result);
      // };
    },
    handleChange2(event) {
      // 选取图片后自动回调，里面可以获取到文件imgSaveToUrl(event或file)
      // 也可以用file或者 this.localFile=file.raw
      this.localFile = event.raw;
      this.upload.form.configFile = event.raw;
      // 转换操作可以不放到这个函数里面，
      // 因为这个函数会被多次触发，上传时触发，上传成功也触发
      // let reader = new FileReader();
      // reader.readAsDataURL(this.localFile);
      // reader.onload = () => {
      //   console.log(reader.result);
      // };
    },
    // 导出任务配置
    handleDownLoadProcess() {
      const param = {
        procDefKey: this.procDefKey,
      };
      handleDownLoadProcess(param).then((data) => {
        // downloadFile (data, name)
        if (!data) {
          this.$message.error("下载失败，配置为空或者不存在！");
          return;
        }
        // 创建一个新的url，此url指向新建的Blob对象
        let blob = new Blob([data], {
          type: "application/vnd.ms-excel",
        });
        let url = window.URL.createObjectURL(blob);
        // 创建a标签，并隐藏改a标签
        let link = document.createElement("a");
        link.style.display = "none";
        // a标签的href属性指定下载链接
        link.href = url;
        // setAttribute() 方法添加指定的属性，并为其赋指定的值。
        let fileName = "任务配置" + ".xls";
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blob);
      });
    },
    /** 查询流程模型列表 */
    getList() {
      this.loading = true;
      getModelPage(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        key: undefined,
        name: undefined,
        description: undefined,
        category: undefined,
        formType: undefined,
        formId: undefined,
        formCustomCreatePath: undefined,
        formCustomViewPath: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.title = "新建模型";
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.title = "修改模型";
      this.open = true;
      // 设置 form
      this.form = {
        ...row,
      };
      // 触发一次校验
      // this.$refs["form"].validate();
    },
    /** 设计按钮操作 */
    handleDesign(row) {
      this.$router.push({
        path: "/bpm/manager/model/design",
        query: {
          modelId: row.id,
        },
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        // 更新
        if (this.form.id) {
          updateModel({
            ...this.form,
            formId: this.form.formType === 10 ? this.form.formId : undefined,
            formCustomCreatePath:
              this.form.formType === 20
                ? this.form.formCustomCreatePath
                : undefined,
            formCustomViewPath:
              this.form.formType === 20
                ? this.form.formCustomViewPath
                : undefined,
          }).then((response) => {
            this.$modal.msgSuccess("修改模型成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 创建
        createModel(this.form).then((response) => {
          this.open = false;
          this.getList();
          this.$alert(
            "<strong>新建模型成功！</strong>后续需要执行如下 4 个步骤：" +
              "<div>1. 点击【修改流程】按钮，配置流程的分类、表单信息</div>" +
              "<div>2. 点击【设计流程】按钮，绘制流程图</div>" +
              "<div>3. 点击【分配规则】按钮，设置每个用户任务的审批人</div>" +
              "<div>4. 点击【发布流程】按钮，完成流程的最终发布</div>" +
              "另外，每次流程修改后，都需要点击【发布流程】按钮，才能正式生效！！！",
            "重要提示",
            {
              dangerouslyUseHTMLString: true,
              type: "success",
            }
          );
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const that = this;
      this.$modal
        .confirm("是否删除该流程！！")
        .then(function () {
          deleteModel(row.id).then((response) => {
            that.getList();
            that.msgSuccess("删除成功");
          });
        })
        .catch(() => {});
    },
    /** 部署按钮操作 */
    handleDeploy(row) {
      const that = this;
      this.$modal
        .confirm("是否部署该流程！！")
        .then(function () {
          deployModel(row.id).then((response) => {
            that.getList();
            that.msgSuccess("部署成功");
          });
        })
        .catch(() => {});
    },
    /** 流程表单的详情按钮操作 */
    handleFormDetail(row) {
      // 流程表单
      if (row.formId) {
        getForm(row.formId).then((response) => {
          // 设置值
          const data = response.data;
          this.detailForm = {
            ...JSON.parse(data.conf),
            fields: decodeFields(data.fields),
          };
          // 弹窗打开
          this.detailOpen = true;
        });
        // 业务表单
      } else if (row.formCustomCreatePath) {
        this.$router.push({ path: row.formCustomCreatePath });
      }
    },
    /** 流程图的详情按钮操作 */
    handleBpmnDetail(row) {
      getModel(row.id).then((response) => {
        this.bpmnXML = response.data.bpmnXml;
        // 弹窗打开
        this.showBpmnOpen = true;
      });
    },
    /** 跳转流程定义的列表 */
    handleDefinitionList(row) {
      this.$router.push({
        path: "/bpm/manager/definition",
        query: {
          key: row.key,
        },
      });
    },
    /** 更新状态操作 */
    handleChangeState(row) {
      const id = row.id;
      let state = row.processDefinition.suspensionState;
      let statusState = state === 1 ? "激活" : "挂起";
      this.$modal
        .confirm(
          "是否确认" + statusState + '流程名字为"' + row.name + '"的数据项?'
        )
        .then(function () {
          return updateModelState(id, state);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(statusState + "成功");
        })
        .catch(() => {});
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError(response.msg);
        return;
      }
      // 重置表单
      this.uploadClose();
      // 提示，并刷新
      this.$modal.msgSuccess(
        "导入流程成功！请点击【设计流程】按钮，进行编辑保存后，才可以进行【发布流程】"
      );
      this.getList();
    },
    uploadClose() {
      // 关闭弹窗
      this.upload.open = false;
      // 重置上传状态和文件
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      // 重置表单
      this.upload.form = {};
      this.resetForm("uploadForm");
    },
    /** 提交上传文件 */
    submitFileForm() {
      this.$refs["uploadForm"].validate(async (valid) => {
        if (!valid) {
          return;
        }
        // if (
        //   this.upload.form.bpmnFile &&
        //   this.upload.form.ruleFile &&
        //   this.upload.form.configFile
        // ) {
        const formDate = new FormData();
        for (let key in this.upload.form) {
          formDate.append(key, this.upload.form[key]);
        }

        const res = await handleImportProcess(formDate);
        if (res.code == 0) {
          this.upload.open = false;
          this.$message.success("导入成功~");
          this.getList();
        }
        // } else {
        //   this.$modal.msgError("需上传三份文件~");
        // }
      });
    },
    /** 处理任务分配规则列表的按钮操作 */
    handleAssignRule(row) {
      this.$refs["taskAssignRuleDialog"].initModel(row.id);
    },
    /** 任务配置打开*/
    handleOpenModal(row) {
      this.colIndex = null;
      this.infoOpen = false;
      this.procDefKey = row.key;
      const param = {
        procDefKey: row.key,
      };
      getBpmFlowTree(param).then((res) => {
        if (res.code === 0) {
          this.modalOpen = true;
          this.tableData = res.data.children;
        }
      });
      getListByType().then((res) => {
        if (res.code === 0) {
          this.operateTypeList = res.data;
        }
      });
    },
    changeIndex(index) {
      if (this.colIndex === index) {
        this.infoOpen = !this.infoOpen;
      } else {
        this.colIndex = index;
        this.infoOpen = true;
      }
    },
    changeType(e) {
      getBpmByType(e).then((res) => {
        if (res.code === 0) {
          this.subProcDefNameList = res.data;
        }
      });
    },
    changePro(e) {
      this.operateTypeList.forEach((item) => {
        if (item.procDefKey === e) {
          this.buttonForm.subProcDefName = item.procDefName;
        }
      });
    },
    addButton(item) {
      this.buttonForm = item;
      this.isUpdate = false;
      this.buttonForm.buttonType = "1";
      this.buttonForm.permission = "";
      this.buttonForm.deptEditPermission = 0;
      this.modalOpen2 = true;
      this.modalTitle = "新增操作";
      this.subProcDefNameList = [];
    },
    updateNode(item) {
      this.buttonForm1 = item;
      this.modalTitle = "编辑任务";
      this.modalOpen3 = true;
    },
    updateButton(item) {
      this.buttonForm = item;
      this.isUpdate = true;
      this.modalOpen2 = true;
      this.modalTitle = "编辑操作";
      getBpmByType(item.operateType).then((res) => {
        if (res.code === 0) {
          this.subProcDefNameList = res.data;
        }
      });
    },
    cancelButtonForm1() {
      this.reModal();
      this.modalOpen3 = false;
    },
    cancelButtonForm() {
      this.modalOpen2 = false;
    },
    submitButtonForm1() {
      handleButtonUpdate(this.buttonForm1).then((res) => {
        if (res.code === 0) {
          this.$message.success("修改成功！");
          this.reModal();
          this.modalOpen3 = false;
        }
      });
    },
    submitButtonForm() {
      this.$refs["buttonForm"].validate((valid) => {
        if (!valid) {
          return;
        }
        if (this.modalTitle === "新增操作") {
          delete this.buttonForm.id;
          delete this.buttonForm.children;
          handleButtonCreate(this.buttonForm).then((res) => {
            if (res.code === 0) {
              this.$message.success("新增成功！");
              this.reModal();
              this.modalOpen2 = false;
            }
          });
        } else {
          handleButtonUpdate(this.buttonForm).then((res) => {
            if (res.code === 0) {
              this.$message.success("修改成功！");
              this.reModal();
              this.modalOpen2 = false;
            }
          });
        }
      });
    },
    reModal() {
      getBpmFlowTree({ procDefKey: this.procDefKey }).then((res) => {
        if (res.code === 0) {
          this.tableData = res.data.children;
        }
      });
    },
    /** 删除按钮操作 */
    handleButtonDelete(row) {
      const data = {
        id: row.id,
      };
      this.$modal
        .confirm("是否确认删除名称为" + row.buttonName + '"的数据项?')
        .then(function () {
          return handleButtonDelete(data);
        })
        .then(() => {
          this.reModal();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.my-process-designer {
  height: calc(100vh - 200px);
}
.tabHeader {
  width: 100%;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  height: 40px;
  line-height: 40px;
  /*color: #909399;*/
  background-color: #f5f7fa;
  .th {
    flex: 1 1 0;
    border: #ebeef5 1px solid;
  }
}
.tabItem {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  min-height: 40px;
  line-height: 40px;
  .item {
    flex: 1 1 0;
    border: #ebeef5 1px solid;
  }
  .buttonInfo {
    width: 100%;
    .buttonTabHeader {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      height: 40px;
      line-height: 40px;
      /*color: #909399;*/
      background-color: #f5f7fa;
      .th {
        flex: 1 1 0;
        border: #ebeef5 1px solid;
      }
    }
    .buttonTabItem {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      text-align: center;
      min-height: 40px;
      line-height: 40px;

      .item {
        flex: 1 1 0;
        border: #ebeef5 1px solid;
      }
    }
  }
}
</style>
