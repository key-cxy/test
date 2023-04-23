<template>
  <div>
    <div class="container">
      <div class="leftItem">
        <div class="phoneInfo">
          <div class="title">
            <div class="divider"></div>
            <div class="txt">话务信息</div>
          </div>
          <div class="search" style="padding-top: 16px">
            <div class="searchItem">
              <span>来电号码：</span>
              <div>
                <a-input
                  disabled
                  v-model="phone"
                  placeholder="请输入来电号码"
                ></a-input>
              </div>
            </div>
            <div class="searchItem">
              <span>客户姓名：</span>
              <div>
                <a-input
                  v-model="userName"
                  disabled
                  placeholder="请输入客户姓名"
                ></a-input>
              </div>
            </div>
            <div class="searchItem">
              <span>来电事宜：</span>
              <div>
                <a-radio-group
                  disabled
                  name="radioGroup"
                  :value="phStatus"
                  @change="(e) => (phStatus = e.target.value)"
                >
                  <a-radio :value="0"> 事件 </a-radio>
                  <a-radio :value="1"> 咨询</a-radio>
                </a-radio-group>
              </div>
            </div>
          </div>
        </div>
        <div class="eventInfo" v-if="phStatus == 0">
          <div class="title">
            <div class="divider"></div>
            <div class="txt">事件信息</div>
          </div>
          <div class="search" style="flex-direction: column">
            <div class="searchRow">
              <div class="searchCol">
                <span>事件来源：</span>
                <div>
                  <a-select
                    style="width: 100%"
                    disabled
                    v-model="problemOrigin"
                    placeholder="请选择事件来源"
                  >
                    <a-select-option
                      v-for="item in problemOriginList"
                      :key="item.id"
                      :value="item.id"
                      >{{ item.name }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
              <div class="searchCol">
                <span>事件类型：</span>
                <div>
                  <a-select
                    style="width: 100%"
                    v-model="eventType"
                    disabled
                    placeholder="请选择事件类型"
                  >
                    <a-select-option
                      v-for="item in questionTypeList"
                      :key="item.label"
                      :value="item.label"
                      >{{ item.label }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
              <div class="searchCol">
                <span>事件主题：</span>
                <div>
                  <a-select
                    style="width: 100%"
                    disabled
                    v-model="topic"
                    placeholder="请选择事件主题"
                  >
                    <a-select-option
                      v-for="item in topicList"
                      :key="item.label"
                      :value="item.label"
                      >{{ item.label }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </div>
            <div class="searchRow">
              <div class="searchCol">
                <span>兴趣点：</span>
                <div>
                  <a-select
                    show-search
                    disabled
                    style="width: 100%"
                    v-model="interest"
                    placeholder="请选择兴趣点"
                    :filter-option="filterInterestOption"
                  >
                    <a-select-option
                      v-for="item in interestList"
                      :key="item.label"
                      :value="item.label"
                      >{{ item.label }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
              <div class="searchCol" style="flex: 1">
                <span>受理时间：</span>
                <div>
                  <a-date-picker
                    style="width: 100%; min-width: inherit"
                    disabled
                    format="YYYY-MM-DD HH:mm:ss"
                    v-model="receptionTime"
                    :show-time="showTime"
                  />
                </div>
              </div>
              <div class="searchCol" style="flex: 1">
                <span>具体位置：</span>
                <div>
                  <a-input
                    placeholder="请输入具体位置"
                    disabled
                    v-model="address"
                  />
                </div>
              </div>
            </div>
            <div class="searchRow">
              <div class="searchCol">
                <span>事件描述：</span>
                <div>
                  <a-textarea
                    v-model="question"
                    disabled
                    placeholder="请输入事件描述"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="eventInfo" v-if="phStatus == 1">
          <div class="title">
            <div class="divider"></div>
            <div class="txt">事件信息</div>
          </div>
          <div class="search" style="flex-direction: column">
            <div class="searchRow">
              <div class="searchCol">
                <span>事件主题：</span>
                <div>
                  <a-select style="width: 100%" v-model="topic1" disabled>
                    <a-select-option
                      v-for="item in topicList"
                      :key="item.id"
                      :value="item.id"
                      v-model="topic1"
                      placeholder="请选择事件主题"
                      >{{ item.label }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
              <div class="searchCol">
                <span>兴趣点：</span>
                <div>
                  <a-select style="width: 100%" v-model="interest1" disabled>
                    <a-select-option
                      v-for="item in interestList"
                      :key="item.label"
                      :value="item.label"
                      v-model="interest1"
                      placeholder="请选择兴趣点"
                      >{{ item.label }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
              <div class="searchCol"></div>
            </div>
            <div class="searchRow">
              <div class="searchCol">
                <span>咨询内容：</span>
                <div>
                  <a-input
                    disabled
                    v-model="question1"
                    placeholder="请输入咨询内容"
                  />
                </div>
              </div>
            </div>
            <div class="searchRow">
              <div class="searchCol">
                <span>咨询目的：</span>
                <div>
                  <a-input
                    disabled
                    v-model="purpose"
                    placeholder="请输入咨询目的"
                  />
                </div>
              </div>
            </div>
            <div class="searchRow">
              <div class="searchCol">
                <span>相关解答：</span>
                <div>
                  <a-textarea
                    disabled
                    v-model="answer"
                    placeholder="请输入相关解答"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="eventInfo" v-if="phStatus == 0">
          <div class="title">
            <div class="divider"></div>
            <div class="txt">处置分派</div>
          </div>
          <div class="search" style="flex-direction: column">
            <div class="searchRow">
              <div class="searchCol">
                <span>考核单位：</span>
                <div>
<!--                  <a-input disabled v-model="assessmentUnitTemp"></a-input>-->
                                    <a-select
                                      style="width: 100%"
                                      @change="handleAssessmentUnit"
                                      placeholder="请选择考核单位"
                                      v-model="assessmentUnit"
                                    >
                                      <a-select-option
                                        v-for="item in assessmentUnitList"
                                        :key="item.id"
                                        :value="item.id"
                                      >{{ item.name }}
                                      </a-select-option>
                                    </a-select>
                </div>
              </div>
              <div class="searchCol">
                <span>所属大类：</span>
                <div>
<!--                  <a-input disabled v-model="registerInfo.largeName"></a-input>-->
                    <a-select
                      style="width: 100%"
                      @change="handleBigClass"
                      placeholder="请选择所属大类"
                      v-model="bigClass"
                      @dropdownVisibleChange="getBigClassList"
                    >
                      <a-select-option
                        v-for="item in bigClassList"
                        :key="item.id"
                        :value="item.id"
                        >{{ item.name }}
                      </a-select-option>
                    </a-select>
                </div>
              </div>
              <div class="searchCol">
                <span>所属小类：</span>
                <div>
<!--                  <a-input disabled v-model="registerInfo.smallName"></a-input>-->
                      <a-select
                        disabled
                        placeholder="请选择所属小类"
                        style="width: 100%"
                        v-model="smallClass"
                        @change="handleSmallClass"
                        @dropdownVisibleChange="smallClassDropDown"
                      >
                        <a-select-option
                          v-for="item in smallClassList"
                          :key="item.id"
                          :value="item.id"
                          >{{ item.name }}
                        </a-select-option>
                      </a-select>
                </div>
              </div>
            </div>
            <div class="searchRow">
              <div class="searchCol">
                <span>立案名称：</span>
                <div>
<!--                  <a-input disabled v-model="registerInfo.filingName"></a-input>-->
                                    <a-select
                                      placeholder="请选择立案名称"
                                      style="width: 100%"
                                      v-model="filingName"
                                      @change="getFilingCondition"
                                      @dropdownVisibleChange="filingNameDropDown"
                                    >
                                      <a-select-option
                                        v-for="item in filingNameList"
                                        :key="item.id"
                                        :value="item.id"
                                      >{{ item.name }}
                                      </a-select-option>
                                    </a-select>
                </div>
              </div>

              <div class="searchCol">
                <span>处置期限：</span>
                <div>
                  <a-input v-model="disposalPeriod" disabled></a-input>
                </div>
              </div>
              <div class="searchCol">
                <span>期限类型：</span>
                <div>
                  <a-input v-model="timeType" disabled></a-input>
                </div>
              </div>
            </div>
            <div class="searchRow">
              <div class="searchCol">
                <span>立案条件：</span>
                <div>
                  <a-input
                    disabled
                    v-model="registerInfo.filingCondition"
                  ></a-input>
                </div>
              </div>
            </div>
            <div class="searchRow">
              <div class="searchCol">
                <span>所属区域：</span>
                <div>
                  <el-cascader
                    :disabled="caseStatus == 3"
                    style="width: 100%"
                    :options="areaTreeData"
                    :props="optionProps"
                    clearable
                    v-model="areaVal"
                    @change="areaChange"
                    placeholder="请选择所属区域"
                  ></el-cascader>
                </div>
              </div>
              <div class="searchCol">
                <span>所属网格：</span>
                <div>
                  <a-select style="width: 100%"> </a-select>
                </div>
              </div>
              <div class="searchCol">
                <span>处置人员：</span>
                <div>
                  <a-select
                    style="width: 100%"
                    :disabled="caseStatus == 3"
                    v-model="disposer"
                    allowClear
                    placeholder="请选择处置人员"
                  >
                    <a-select-option
                      v-for="item in disposerList"
                      :key="item.id"
                      :value="item.id"
                      >{{ item.nickname }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="eventInfo">
          <div class="title">
            <div class="divider"></div>
            <div class="txt">电话录音</div>
          </div>
          <div class="search" style="flex-direction: column">
            <div class="searchRow">
              <div class="searchCol">
                <span>是否回访：</span>
                <div>
                  <a-radio-group
                    disabled
                    name="radioGroup"
                    v-model="returnVisit"
                    :default-value="0"
                  >
                    <a-radio :value="0">是</a-radio>
                    <a-radio :value="1">否</a-radio>
                  </a-radio-group>
                </div>
              </div>
              <div class="searchCol">
                <span>回访号码：</span>
                <div>
                  <a-input disabled></a-input>
                </div>
              </div>
              <div
                class="searchCol"
                style="display: flex; justify-content: space-around"
              >
                <a-button>同来电号码</a-button>
                <a-button type="primary">话务外拨</a-button>
              </div>
            </div>
            <div class="searchRow">
              <div class="searchCol">
                <a-table
                  :columns="columns"
                  :data-source="data"
                  class="components-table-demo-nested"
                  :pagination="false"
                >
                </a-table>
              </div>
            </div>
          </div>
        </div>
        <div class="eventInfo" v-if="phStatus == 0">
          <div class="title">
            <div class="divider"></div>
            <div class="txt">事件材料</div>
          </div>
          <div class="search" style="flex-direction: column">
            <div class="searchRow">
              <div class="searchCol">
                <span>附件上传：</span>
                <div>
                  <a-upload
                    :multiple="false"
                    :file-list="fileList"
                    :customRequest="onUpload"
                    :showUploadList="false"
                  >
                    <a-button> <a-icon type="upload" /> 选择文件 </a-button>
                  </a-upload>
                </div>
                <div
                  style="
                    white-space: nowrap;
                    color: rgba(0, 0, 0, 0.5);
                    font-size: 12px;
                  "
                >
                  支持扩展名：.rar .zip .doc .docx .pdf .jpg等
                </div>
              </div>
              <div class="searchCol">
                <span>所属类型：</span>
                <div>
                  <a-select style="width: 100%" v-model="fileType">
                    <a-select-option
                      v-for="item in fileTypeList"
                      :key="item.id"
                      :value="item.id"
                      >{{ item.name }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </div>
            <div class="searchRow">
              <div class="searchCol">
                <a-table
                  :columns="columns2"
                  :data-source="fileTable"
                  class="components-table-demo-nested"
                  :pagination="false"
                >
                  <template slot="url" slot-scope="text">
                    <img :src="text" style="width: 30px; height: 30px" />
                  </template>
                  <template slot="fileOperation" slot-scope="text, record">
                    <div style="display: flex; justify-content: space-around">
                      <a
                        href="javascript:;"
                        @click="downLoad(record.id, record.fileName)"
                        style="color: #1890ff"
                      >
                        下载
                      </a>
                      <a
                        href="javascript:;"
                        @click="remove(record.id, record.disabled)"
                        :disabled="record.disabled"
                        :class="
                          record.disabled ? 'delteDisabled' : 'delteabled'
                        "
                      >
                        删除
                      </a>
                    </div>
                  </template>
                  <template slot="uploadTime" slot-scope="text, record">
                    <span class="tableClass" style="color: #008f4a">
                      {{
                        new Date(record.uploadTime).toLocaleString("chinese", {
                          hour12: false,
                        })
                      }}
                    </span>
                  </template>
                </a-table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightItem">
        <div class="eventInfo">
          <div class="title">
            <div class="divider"></div>
            <div class="txt">事件流转</div>
          </div>
        </div>
        <div style="padding-top: 16px">
          <a-timeline>
            <a-timeline-item
              v-for="(item, index) in processList"
              :key="item.id"
              :color="colors[index]"
            >
              <div>
                <div class="node">{{ item.eventNode }}</div>
                <div class="processItem">
                  收到时间：{{ new Date(item.createTime).toLocaleString() }}
                </div>
                <div class="processItem">
                  处置时间：{{
                    item.startTime
                      ? new Date(item.startTime).toLocaleString()
                      : ""
                  }}
                </div>
                <div class="processItem">处置人员：{{ item.disposerName }}</div>
                <div class="processItem">
                  处置意见：{{ item.processOpinion }}
                </div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
      </div>
    </div>
    <div class="footer" v-if="caseStatus != 3">
      <div class="footerItem">
        <div style="width: 80px">流转意见：</div>
        <a-input style="flex: 1" v-model="processOption"></a-input>

        <a-popover
          title="自定义审批意见"
          ref="popover"
          trigger="click"
          :destroyTooltipOnHide="true"
          @visibleChange="handleVisibleChange"
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          :autoAdjustOverflow="false"
        >
          <template slot="content">
            <div class="viewContainer">
              <div class="operation">
                <a-input
                  style="flex: 1; display: inline-block; margin-right: 5px"
                  placeholder="请输入要添加的处置意见"
                  v-model="createView"
                />
                <a-button type="primary" @click="addView">添加</a-button>
              </div>
              <div class="viewList">
                <div
                  @dblclick="editOrDelete(index, item)"
                  v-for="(item, index) in viewList"
                  :key="item.id"
                  class="viewItem"
                >
                  <div @click="fillOption(item)" v-if="!item.isEdit">
                    {{ item.view }}
                  </div>
                  <div v-else style="display: flex">
                    <a-input
                      v-model="updateViewContent"
                      style="flex: 1; margin-right: 5px"
                    ></a-input>
                    <a-button
                      type="primary"
                      @click="updateOpinion(item.id)"
                      style="margin-right: 5px"
                      >修改</a-button
                    >
                    <a-popconfirm
                      title="是否确认删除"
                      @confirm="() => onDelete(item.id)"
                    >
                      <a-button type="danger">删除</a-button>
                    </a-popconfirm>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <a-button
            style="margin-left: 15px; width: 150px; border: 2px dotted #ccc"
            >自定义审批意见</a-button
          >
        </a-popover>
      </div>
      <div class="footerItem" style="justify-content: end">
        <!-- <a-button style="margin-right: 10px; width: 120px">取消</a-button> -->

        <a-button
          style="
            margin-right: 10px;
            width: 120px;
            color: rgb(245, 34, 45);
            border: 1px solid rgb(245, 34, 45);
          "
          v-if="showYiChang"
          @click="openModal"
          :disabled="mainIsSuspend == 1"
          >异常申请</a-button
        >
        <a-button
          v-for="item in buttonList"
          :key="item.id"
          style="
            margin-right: 10px;
            min-width: 120px;
            color: rgb(245, 34, 45);
            border: 1px solid rgb(245, 34, 45);
          "
          :loading="spinning"
          ref="btnSubmit1"
          @click="handleSave(item)"
          :disabled="mainIsSuspend == 1"
          >{{ item.buttonName }}</a-button
        >

        <!-- <a-button
          type="primary"
          @click="handleSave(0, '批转')"
          style="margin-right: 10px; width: 120px"
          :loading="spinning"
          ref="btnSubmit"
          :transId="0"
          transName="批转"
          >批转</a-button
        > -->
      </div>
    </div>
    <a-modal
      :visible="showYichangModal"
      title="异常操作"
      :destroyOnClose="true"
      @ok="handleYichange"
      @cancel="handleModalCancel"
    >
      <div class="modalItem">
        <div class="item">异常操作:</div>
        <a-select style="flex: 1" v-model="operateType">
          <a-select-option
            v-for="item in unusualList"
            :key="item.value"
            :value="item.value"
            >{{ item.name }}
          </a-select-option>
        </a-select>
      </div>
      <div class="modalItem" v-if="operateType == 'yanqi'">
        <div class="item">延期时间:</div>
        <a-date-picker
          style="flex: 1"
          format="YYYY-MM-DD HH:mm:ss"
          v-model="delayTime"
          :show-time="showTime"
        />
      </div>
      <div class="modalItem">
        <div class="item">操作理由:</div>
        <a-textarea
          v-model="reason"
          style="flex: 1"
          placeholder="请输入操作理由"
          :rows="3"
        />
      </div>
    </a-modal>
    <a-modal
      title="延期"
      :visible="lateShow"
      width="300px"
      centered
      @ok="save"
      @cancel="handleCloseModal"
    >
      <a-date-picker
        style="flex: 1"
        format="YYYY-MM-DD HH:mm:ss"
        v-model="delayTime"
        :show-time="showTime"
      />
    </a-modal>
  </div>
</template>

<script>
import {
  getBigSmallFiling,
  getFilingCondition,
  getDictData,
  getUnitByFilingId,
  getAreaTree,
  upload,
  getDeptUser,
  reportProblem,
  problemSourceList,
  problemSourceList1,
  handleSave,
  getApprovalViewList,
  createView,
  updateView,
  deleteView,
  getOperationByPSIdandNode,
  queryAreaInHandle,
  errorApply,
  getAssessmentUnit,
  getByAssessmentUnitId,
} from "@/api/eventAcceptance.js";

import { handleCaseView } from "@/api/event/disposal";
import moment from "moment";
import getPathById from "@/libs/getPathById.js";
import Cookies from "js-cookie";

const colors = ["green", "red", "gray", "orange", "yellow", "blue", "purple"];
const uploadKey = "uploadKey";
export default {
  data() {
    return {
      operateType: "",
      delayTime: undefined,
      reason: "",
      spinning: false,
      assessmentUnitTemp: "",
      colors,
      columns: [
        {
          title: "流程节点",
          dataIndex: "name",
          key: "name",
          customRender: (text, record) => {
            return <span class="tableClass">{{ text }}</span>;
          },
        },
        {
          title: "通话人",
          dataIndex: "platform",
          key: "platform",
          align: "center",
          customRender: (text, record) => {
            return <span class="tableClass">{{ text }}</span>;
          },
        },
        {
          title: "开始时间",
          dataIndex: "version",
          key: "version",
          align: "center",
          customRender: (text, record) => {
            return (
              <span class="tableClass" style="color: #008F4A">
                {{ text }}
              </span>
            );
          },
        },
        {
          title: "结束时间",
          dataIndex: "upgradeNum",
          key: "upgradeNum",
          align: "center",
          customRender: (text, record) => {
            return (
              <span class="tableClass" style="color: #008F4A">
                {{ text }}
              </span>
            );
          },
        },
        {
          title: "时长",
          dataIndex: "creator",
          key: "creator",
          align: "center",
          customRender: (text, record) => {
            return <span class="tableClass">{{ text }}</span>;
          },
        },
        {
          title: "操作",
          key: "operation",
          align: "center",
          customRender: (text, record) => {
            return (
              <a href="javascript:;" style="color: #1890ff">
                播放
              </a>
            );
          },
        },
      ],
      columns2: [
        {
          title: "缩略图",
          dataIndex: "url",
          width: "150px",
          align: "center",
          scopedSlots: { customRender: "url" },
        },
        {
          title: "流程节点",
          dataIndex: "eventNode",
          key: "eventNode",
          align: "center",
        },
        {
          title: "上传人",
          dataIndex: "uploadName",
          key: "uploadName",
          align: "center",
          customRender: (text, record) => {
            return (
              <span class="tableClass" style="color: #008F4A">
                {{ text }}
              </span>
            );
          },
        },
        {
          title: "上传时间",
          key: "uploadTime",
          align: "center",
          scopedSlots: { customRender: "uploadTime" },
        },
        {
          title: "附件类型",
          dataIndex: "fileType",
          key: "fileType",
          align: "center",
        },
        {
          title: "操作",
          key: "operation",
          align: "center",
          scopedSlots: { customRender: "fileOperation" },
        },
      ],
      data: [
        {
          name: "11",
          platform: "iOS",
          version: "10.3.4.5654",
          upgradeNum: 500,
          creator: "Jack",
          createdAt: "2014-12-24 23:12:00",
        },
      ],
      bigClass: undefined,
      bigClassList: [],
      smallClass: undefined,
      smallClassList: [],
      filingName: undefined,
      filingNameList: [],
      questionTypeList: [],
      topicList: [],
      interestList: [],

      areaTreeData: [], //所属区域树形结构
      areaVal: [],
      optionProps: {
        value: "id",
        label: "name",
        children: "children",
        checkStrictly: true,
        expandTrigger: "hover",
      },
      assessmentUnitOptionProps: {
        value: "id",
        label: "name",
        children: "children",
        checkStrictly: true,
        expandTrigger: "hover",
      },
      filingCondition: undefined, //立案条件
      disposalPeriod: undefined, // 处置期限
      timeType: "", //期限类型
      timeTypeVal: "", // 期限类型值
      periodTypeId: "", //期限类型ID
      assessmentUnit: undefined,
      assessmentUnitList: [],
      disposer: undefined, //处置人
      disposerList: [], //处置人下拉列表
      fileTypeList: [
        { id: "现场照片", name: "现场照片" },
        { id: "处置照片", name: "处置照片" },
      ],
      fileType: "现场照片",
      fileTable: [],

      phone: undefined, //来电号码
      userName: undefined, //客户姓名
      phStatus: 0, // 来电事宜

      receptionTime: undefined, //受理时间
      problemOrigin: undefined, //事件来源
      problemOriginList: [], //事件来源list

      topic: undefined, //事件主题
      topic1: undefined, //事件主题

      interest: undefined, //兴趣点
      interest1: undefined, //兴趣点
      answer: undefined, //解答
      question1: undefined, //咨询内容
      purpose: undefined, //咨询目的

      eventType: undefined, //事件类型
      address: undefined, //具体位置
      question: undefined, //事件描述
      returnVisit: 0, //是否需要回访0-是,1-否
      processOption: "",

      showTime: {
        defaultValue: moment("00:00:00", "HH:mm:ss"),
      },
      // 获取到的参数
      callInfo: {},
      eventProcess: {},
      eventTaskInfo: {},
      materialList: [],
      processList: [],
      recordFileList: [],
      fileList: [],
      registerInfo: {},
      buttonList: [],
      caseStatus: "",
      viewList: [],
      mainIsSuspend: 0, // 主流程是否挂起 0 未挂起 1 挂起
      showYiChang: false, //根据问题来源id、节点获得可操作的异常流程是否展示
      unusualList: [],
      oldAreaVal: [],
      showYichangModal: false,
      isLate: true,
      lateShow: false,
      temp: {},
      createView: "",
      updateViewContent: "",
    };
  },
  methods: {
    handleModalCancel() {
      this.operateType = "";
      this.delayTime = undefined;
      this.reason = "";
      this.showYichangModal = false;
    },
    openModal() {
      this.showYichangModal = !this.showYichangModal;
    },
    getAssessmentUnit() {
      getAssessmentUnit().then((res) => {
        if (res.code === 200) {
          this.assessmentUnitList = res.data;
        }
      });
    },
    handleYichange() {
      if (!this.operateType || this.operateType.length == 0) {
        this.$message.warning("请选择异常操作！");
        return;
      }
      if (this.operateType == "yanqi") {
        if (!this.delayTime || this.delayTime.length == 0) {
          this.$message.warning("请选择延期时间！");
          return;
        }
      }
      if (!this.reason || this.reason.length == 0) {
        this.$message.warning("请选择操作理由！");
        return;
      }
      let eventProcess = this.eventProcess;
      let json = {
        caseNo: this.$route.query.caseNo,
        problemSourceId: this.problemOrigin,
        eventNode: eventProcess.eventNode,
        mainProcessId: eventProcess.id,
        mainProcInstId: eventProcess.procInstId,
        delayTime: moment(this.delayTime).format("YYYY-MM-DD HH:mm:SS"),
        operateType: this.operateType,
        reason: this.reason,
      };
      errorApply(json).then((res) => {
        this.$router.push({
          path: "/event/eventDisposal",
          query: {
            //query是个配置项
          },
        });
      });
    },
    onDelete(id) {
      this.deleteView(id);
    },
    handleVisibleChange(visible) {
      if (visible) {
        this.getApprovalViewList();
      }
    },
    updateOpinion(id) {
      if (this.updateViewContent.length == 0 || !this.updateViewContent) {
        this.$message.warn({
          content: "修改的自定义处置意见不能为空",
          duration: 2,
        });
        return;
      }
      updateView(this.updateViewContent, id).then((res) => {
        this.resetEditModule();
        this.getApprovalViewList();
        this.$message.success({
          content: "自定义处置意见修改成功",
          duration: 2,
        });
      });
    },
    editOrDelete(index, item) {
      this.resetEditModule();
      this.processOption = "";
      this.viewList[index].isEdit = true;
      this.updateViewContent = item.view;
    },
    deleteView(id) {
      deleteView(id)
        .then((res) => {
          this.resetEditModule();
          if (res.code == 200) {
            this.$message.success({
              content: "删除自定义处置意见成功",
              duration: 2,
            });
            this.getApprovalViewList();
          } else {
          }
        })
        .catch((err) => {
          // this.resetEditModule();
          this.$message.error({
            content: "删除自定义处置意见失败",
            duration: 2,
          });
        });
    },
    addView() {
      this.resetEditModule();
      if (this.createView.length == 0 || !this.createView) {
        this.checkInfo("请输入自定义处置意见！");
        return;
      }
      createView(this.createView).then((res) => {
        if (res.code == 200) {
          this.createView = "";
          this.$message.success({
            content: "添加自定义处置意见成功",
            duration: 2,
          });
          this.getApprovalViewList();
        }
      });
    },
    resetEditModule() {
      let viewList = this.viewList;
      viewList.map((item) => {
        item.isEdit = false;
        return item;
      });
      this.viewList = viewList;
    },
    fillOption(item) {
      this.processOption = item.view;
    },
    getApprovalViewList() {
      getApprovalViewList().then((res) => {
        if (res.code == 200) {
          let viewList = res.data.map((item) => {
            item.isEdit = false;
            return item;
          });
          this.viewList = viewList;
        }
      });
    },
    getBigSmallFiling(type, parentId) {
      getBigSmallFiling(parentId).then((res) => {
        if (res.code == 200) {
          if (type == "bigClass") {
            this.bigClassList = res.data;
          } else if (type == "smallClass") {
            this.smallClassList = res.data;
            this.filingNameList = [];
          } else if (type == "filing") {
            this.filingNameList = res.data;
          }
        }
      });
    },
    getFilingCondition(value) {
      this.resetFilingName();
      this.filingNameList.map((item) => {
        if (item.id === value) {
          this.filingCondition = item.filingCondition;
          this.disposalPeriod = item.disposalPeriod;
          this.periodTypeId = item.type;
          this.timeType =
            item.type == 1 ? "工作时" : item.type == 2 ? "紧急工作时" : "";
          this.timeTypeVal = item.type;
        }
      });
      // getUnitByFilingId(this.filingName).then((res) => {
      //   if (res.code == 200) {
      //     let assessmentUnitList = this.filterData(res.data);
      //     this.assessmentUnitList = assessmentUnitList;
      //   }
      // });
    },
    // 字典表 事件类型，主题，兴趣点 question_type 事件类型 topic 事件主题 interest 兴趣点
    getDictData(type) {
      getDictData(type).then((res) => {
        if (res.code == 0) {
          if (type == "interest") {
            this.interestList = res.data;
          }
          if (type == "question_type") {
            this.questionTypeList = res.data;
          }
          if (type == "topic") {
            this.topicList = res.data;
          }
        }
      });
    },
    handleAssessmentUnit(value) {
      console.log(value);
      this.resetAssessmentUnit();
      this.getBigClassList(value);
    },
    handleBigClass(value) {
      const param = {
        assessmentUnitId: value,
      };
      getByAssessmentUnitId(param).then((res) => {
        if (res.code === 200) {
          this.bigClassList = res.data;
        }
      });
    },
    handleSmallClass(value) {
      this.resetSmallClass();
      this.smallClassList.map((item) => {
        if (item.id === value) {
          this.filingNameList = item.children;
        }
      });
    },
    smallClassDropDown() {
      if (!this.bigClass || this.bigClass.length == 0) {
        this.$message.warning("请先选择所属大类！");
        this.return;
      }
    },
    filingNameDropDown() {
      if (!this.smallClass || this.smallClass.length == 0) {
        this.$message.warning("请先选择所属小类！");
        this.return;
      }
    },
    assmentUnitVisaleChange(callback) {
      if (callback) {
        if (!this.filingName || this.filingName.length == 0) {
          this.$message.warning("请先选择立案名称！");
          this.return;
        }
      }
    },
    getBigClassList(value) {
      const param = {
        assessmentUnitId: value,
      };
      getByAssessmentUnitId(param).then((res) => {
        if (res.code === 200) {
          this.bigClassList = res.data;
        }
      });
    },
    getAreaTree() {
      getAreaTree().then((res) => {
        if (res.code == 200) {
          let areaTreeData = this.filterData(res.data.children);
          this.areaTreeData = areaTreeData;
        }
      });
    },
    filterData(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children) {
          if (arr[i].children.length > 0) {
            this.filterData(arr[i].children);
          } else {
            delete arr[i].children;
          }
        }
      }
      return arr;
    },
    onUpload(info) {
      this.$message.loading({
        content: "上传中...",
        duration: 0,
        key: uploadKey,
      });
      let formData = new FormData();
      formData.append("file", info.file);
      formData.append("eventNode", this.eventProcess.eventNode);
      formData.append("caseNo", this.$route.query.caseNo);
      formData.append("fileType", this.fileType);
      upload(formData)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success({
              content: "上传成功",
              key: uploadKey,
              duration: 2,
            });
            this.fileTable.push(res.data);
          }
        })
        .catch((err) => {
          this.$message.error({
            content: "上传失败",
            key: uploadKey,
            duration: 2,
          });
        });
    },
    resetBigClass() {
      this.smallClass = undefined;
      this.smallClassList = [];
      this.resetSmallClass();
    },
    resetSmallClass() {
      this.filingName = undefined;
      this.filingNameList = [];
      this.resetFilingName();
    },
    resetFilingName() {
      this.filingCondition = undefined;
      this.disposalPeriod = undefined;
      this.timeType = "";
    },
    filterInterestOption(input, option) {
      return option.componentOptions.children[0].text.indexOf(input) >= 0;
    },
    areaChange(arr) {
      if (!this.problemOrigin || this.problemOrigin.length == 0) {
        this.checkInfo("请先选择事件来源");
        this.areaVal = [];
        return false;
      }
      this.areaVal = arr;
      this.disposer = undefined;
      this.disposerList = [];
      let id = arr[arr.length - 1];
      getDeptUser(id, this.problemOrigin).then((res) => {
        if (res.code == 200) {
          this.disposerList = res.data;
        }
      });
    },
    downLoad(fileId, fileName) {
      const a = document.createElement("a");
      a.href =
        `/com-djld-platform/djld-platform/comDjldPlatform/register-material/fdfsDownload?fileId=` +
        fileId;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    remove(id, disabled) {
      if (disabled) {
        return;
      }
      let index = -1;
      this.fileTable.forEach((item, index) => {
        if (item.id == id) {
          index = index;
          return;
        }
      });
      this.fileTable.splice(index, 1);
    },
    problemSourceList() {
      problemSourceList1().then((res) => {
        if (res.code == 200) {
          this.problemOriginList = res.data;
        }
      });
    },
    handleSave(button) {
      if (!this.processOption || this.processOption.length == 0) {
        this.checkInfo("请输入处理意见");
        return;
      }
      console.log(button);
      var errorApply = {};
      if (button.operateType === "yanqi") {
        if (this.isLate) {
          this.lateShow = true;
          this.temp = button;
          return;
        } else {
          errorApply = {
            mainOperateType: "shoul",
            delayTime: moment(this.delayTime).format("YYYY-MM-DD HH:mm:SS"),
          };
          this.isLate = true;
        }
      }
      let area = this.areaVal[0];
      let street = this.areaVal[1] || "";
      let community = this.areaVal[2] || "";
      this.registerInfo.processOption = this.processOption;
      this.registerInfo.area = area;
      this.registerInfo.street = street;
      this.registerInfo.community = community;
      this.registerInfo.disposer = this.disposer;
      let saveFormData = {
        callInfo: this.callInfo,
        eventProcess: this.eventProcess,
        eventTaskInfo: this.eventTaskInfo,
        materialList: this.materialList,
        // processList: this.processList,
        recordFileList: this.recordFileList,
        registerInfo: this.registerInfo,
        errorApply: errorApply,
        bpmConfig: button,
      };
      console.log("123", saveFormData);
      handleSave(saveFormData).then((res) => {
        if (res.code === 200) {
          this.spinning = false;
          this.$message.success({
            content: "案件审批成功",
            duration: 2,
          });
          this.$router.push({
            path: "/event/eventDisposal",
            query: {
              //query是个配置项
            },
          });
        }
      });
    },
    reportProblem(e) {
      if (!this.phone || this.phone.length == 0) {
        this.checkInfo("请输入来电号码");
        return;
      }
      if (!this.userName || this.userName.length == 0) {
        this.checkInfo("请输入客户姓名");
        return;
      }
      if (!this.problemOrigin || this.problemOrigin.length == 0) {
        this.checkInfo("请选择事件来源");
        return;
      }
      if (!this.eventType || this.eventType.length == 0) {
        this.checkInfo("请选择事件类型");
        return;
      }
      if (!this.topic || this.topic.length == 0) {
        this.checkInfo("请选择事件主题");
        return;
      }
      if (!this.interest || this.interest.length == 0) {
        this.checkInfo("请选择兴趣点");
        return;
      }
      if (!this.receptionTime || this.receptionTime.length == 0) {
        this.checkInfo("请选择受理时间");
        return;
      }
      if (!this.address || this.address.length == 0) {
        this.checkInfo("请输入具体位置");
        return;
      }
      if (!this.question || this.question.length == 0) {
        this.checkInfo("请输入事件描述");
        return;
      }
      if (!this.bigClass || this.bigClass.length == 0) {
        this.checkInfo("请选择所属大类");
        return;
      }
      if (!this.smallClass || this.smallClass.length == 0) {
        this.checkInfo("请选择所属小类");
        return;
      }
      if (!this.filingName || this.filingName.length == 0) {
        this.checkInfo("请选择立案名称");
        return;
      }
      if (!this.assessmentUnit || this.assessmentUnit.length == 0) {
        this.checkInfo("请选择考核单位");
        return;
      }
      if (!this.areaVal || this.areaVal.length == 0) {
        this.checkInfo("请选择所属区域");
        return;
      }
      if (!this.processOption || this.processOption.length == 0) {
        this.checkInfo("请输入处理意见");
        return;
      }
      let reportData = {};
      if (this.phStatus == 0) {
        let fileIds = [];
        this.fileTable.map((item) => {
          fileIds.push(item.id);
        });
        let area = this.areaVal[0];
        let street = this.areaVal[1] || "";
        let community = this.areaVal[2] || "";
        let assessmentUnit =
          this.assessmentUnit[this.assessmentUnit.length - 1];

        reportData = {
          come: 0, //信息来源 （0-web，1-app）
          receptionTime: this.receptionTime.format("YYYY-MM-DD HH:mm:ss"),
          phone: this.phone,
          phStatus: 0,
          returnVisit: this.returnVisit,
          assessmentUnit: assessmentUnit,
          processOption: this.processOption,
          problemOrigin: this.problemOrigin,
          fileIds,
          recordIds: [],
          userName: this.userName,
          eventType: this.eventType,
          topic: this.topic,
          interest: this.interest,
          address: this.address,
          question: this.question,
          largeName: this.bigClass,
          smallName: this.smallClass,
          filingName: this.filingName,
          filingCondition: this.filingCondition,
          timeType: this.timeTypeVal,
          latitude: "",
          longitude: "",
          disposalPeriod: this.disposalPeriod,
          area,
          street,
          community,
          grid: "",
          disposer: this.disposer,
        };
        this.spinning = true;
        this.$refs.btnSubmit.innerText = "提交中";
        reportProblem(reportData)
          .then((res) => {
            if (res.code == 200) {
              this.spinning = false;

              this.$message.success({
                content: "案件上报成功",
                duration: 2,
              });
              this.$router.push({
                path: "/event/eventDisposal",
                query: {
                  //query是个配置项
                },
              });
            }
          })
          .catch((err) => {});
      }
    },
    checkInfo(content) {
      this.$message.warn({
        content,
        duration: 2,
      });
    },
    save() {
      this.lateShow = false;
      this.isLate = false;
      this.handleSave(this.temp);
    },
    handleCloseModal() {
      this.lateShow = false;
    },
  },

  async created() {
    // this.getBigSmallFiling("bigClass", "");
    this.getAssessmentUnit();
    this.getDictData("interest"); // 兴趣点
    this.getDictData("question_type"); // 事件类型
    this.getDictData("topic"); //事件主题
    //  this.getAreaTree(); //获取所属区域
    this.problemSourceList(); // 获取事件来源
    let deptLevel = Cookies.get("deptLevel");
    // 获取caseNo
    let caseNo = this.$route.query.caseNo;
    let caseStatus = this.$route.query.caseStatus;
    this.caseStatus = caseStatus;
    await handleCaseView({ caseNo }).then((res) => {
      if (res.code == 200) {
        this.phStatus = parseInt(res.data.callInfo.phStatus);
        if (res.data.callInfo.phStatus == 1) {
          let data = res.data;
          this.callInfo = data.callInfo;
          let callInfo = data.callInfo;
          this.phone = callInfo.phone;

          let advisoryInfo = data.advisoryInfo || {};

          this.topic1 = parseInt(advisoryInfo.topic);
          this.interest1 = advisoryInfo.interest;
          this.question1 = advisoryInfo.question;
          this.purpose = advisoryInfo.purpose;
          this.answer = advisoryInfo.answer;

          this.userName = advisoryInfo.userName;
          this.problemOrigin = advisoryInfo.problemOrigin;
          this.eventType = advisoryInfo.eventType;
          this.processOption = advisoryInfo.processOption;
        }
        else  {
          let data = res.data;
          this.callInfo = data.callInfo;
          this.eventProcess = data.eventProcess;
          this.eventTaskInfo = data.eventTaskInfo;

          this.mainIsSuspend = data.eventTaskInfo.mainIsSuspend;

          this.materialList = data.materialIdList;
          this.processList = data.processList;
          this.recordFileList = data.recordFileList;
          this.registerInfo = data.registerInfo;

          let registerInfo = data.registerInfo;
          let callInfo = data.callInfo;
          let materialList = data.materialIdList;

          this.phone = registerInfo.phone;
          this.userName = registerInfo.userName;
          this.phStatus = parseInt(callInfo.phStatus);
          this.problemOrigin = registerInfo.problemOrigin;
          this.eventType = registerInfo.eventType;
          this.topic = registerInfo.topic;
          this.interest = registerInfo.interest;
          this.receptionTime = registerInfo.receptionTime;
          this.address = registerInfo.address;
          this.question = registerInfo.question;
          this.bigClass = registerInfo.largeId;
          this.smallClass = registerInfo.smallId;
          this.filingName = registerInfo.filingId;
          this.filingCondition = registerInfo.filingCondition;
          this.disposalPeriod = registerInfo.disposalPeriod;
          this.disposer = registerInfo.disposer;
          // this.assessmentUnitTemp = registerInfo.assessmentUnit;
          if (data.assessmentUnits) {
            var list = [];
            data.assessmentUnits.forEach((item) => {
              list.push(item.deptName);
            });
            this.assessmentUnitTemp = list.join();
          }
          getFilingCondition(this.filingName).then((res) => {
            if (res.code == 200) {
              this.filingCondition = (res.data || {}).filingCondition;
              this.disposalPeriod = (res.data || {}).disposalPeriod;
              this.periodTypeId = (res.data || {}).type;
              this.timeType =
                (res.data || {}).type == 1
                  ? "工作时"
                  : (res.data || {}).type == 2
                  ? "紧急工作时"
                  : "";
              this.timeTypeVal = (res.data || {}).type;
            }
          });

          this.buttonList = data.buttonList;

          let areaVal = [];
          let area = registerInfo.area;
          areaVal.push(area);
          if (registerInfo.street) {
            areaVal.push(registerInfo.street);
          }
          if (registerInfo.community) {
            areaVal.push(registerInfo.community);
          }
          this.oldAreaVal = areaVal;
          this.areaVal = areaVal;
          if (materialList) {
            let newMaterialList = materialList.map((item) => {
              item.disabled = true;
              return item;
            });
            this.fileTable = newMaterialList;
          }
          getOperationByPSIdandNode(
            registerInfo.problemOrigin,
            data.eventProcess.eventNode
          ).then((res) => {
            if (res.data) {
              this.showYiChang = true;
              let data = res.data;
              let unusualList = [];
              for (let key in data) {
                unusualList.push({
                  name: key,
                  value: data[key],
                });
              }
              this.unusualList = unusualList;
            }
          });
          let id = areaVal[areaVal.length - 1];
          getDeptUser(id, this.problemOrigin).then((res) => {
            if (res.code == 200) {
              this.disposerList = res.data;
            }
          });
          queryAreaInHandle(registerInfo.caseNo,res.data.buttonList[0].deptEditPermission).then((res) => {
            if (res.code == 200) {
              let areaTreeData = res.data;
              // let newAreaTreeData = [];
              // if (areaVal.length == 3) {
              //   areaTreeData = areaTreeData.map((item) => {
              //     return (item.disabled = true);
              //   });
              // }
              if (areaVal.length == 1) {
                areaTreeData.disabled = true;
              }
              if (areaVal.length == 2) {
                areaTreeData.disabled = true;
                areaTreeData.children[0].disabled = true;
              }
              if (areaVal.length == 3) {
                areaTreeData.disabled = true;
                areaTreeData.children[0].disabled = true;
                areaTreeData.children[0].children[0].disabled = true;
              }
              this.areaTreeData = areaTreeData;
            }
          });
        }
      }
    });
    if (this.phStatus == 0) {
      console.log("2333");
      this.getBigSmallFiling("smallClass", this.bigClass);
      this.getBigSmallFiling("filing", this.smallClass);
      this.getFilingCondition();
      // getUnitByFilingId(this.filingName).then((res) => {
      //   if (res.code == 200) {
      //     let assessmentUnitList = this.filterData(res.data);
      //     this.assessmentUnitList = assessmentUnitList;
      //     this.assessmentUnit = getPathById(assessmentUnitList, this.assessmentUnitTemp);
      //   }
      // });
    }
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  margin: 10px 25px;
  display: flex;

  .leftItem,
  .rightItem {
    flex: 8;
    margin-right: 15px;

    .phoneInfo,
    .eventInfo {
      .title {
        display: flex;
        align-items: center;

        .divider {
          width: 3px;
          height: 15px;
          background: #1890ff;
        }

        .txt {
          margin-left: 5px;
          color: #1890ff;
        }
      }

      .search {
        background-color: rgb(243, 249, 254);
        width: 100%;
        display: flex;
        align-items: center;
        padding: 7px 25px 16px;
        justify-content: space-between;
        margin-top: 10px;
        margin-bottom: 10px;

        .searchItem {
          display: flex;
          margin-right: 10px;
          align-items: center;
          flex: 1;

          div {
            flex: 1;
          }

          span {
            text-align: right;
          }
        }

        .searchRow {
          width: 100%;
          display: flex;
          margin-top: 18px;

          .searchCol {
            display: flex;
            margin-right: 10px;
            align-items: center;
            flex: 1;

            span {
              text-align: right;
            }

            div {
              flex: 1;
            }
          }
        }
      }
    }

    .eventInfo {
    }
  }

  .rightItem {
    flex: 4;
    margin-left: 10px;
    margin-right: 30px;

    .card {
      width: 98%;
      margin: 5px auto;
      border-radius: 15px;
      background-color: #f3f9fe;
      padding: 10px;
      margin-bottom: 12px;

      .item {
        margin: auto;
        font-size: 13px;
        font-weight: 400;
        width: 95%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 3px;
        font-family: "PingFang SC ", "PingFang SC", sans-serif;

        div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 2px;
        }
      }
    }
  }
}

.footer {
  margin: 10px 25px;
  box-shadow: #ccc 0 0 10px;
  padding: 20px;
  display: flex;

  .footerItem {
    flex: 1;
    display: flex;
    align-items: center;
    ::v-deep .ant-popover-inner {
      width: 415px;
      height: 180px;
      overflow-y: scroll;
    }
    .viewContainer {
      width: 100%;
      height: 100%;
      .operation {
        display: flex;
      }
    }
    .viewList {
      margin-top: 10px;
      .viewItem {
        margin-top: 7px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}

.tableClass {
  font-size: 14px;
  color: #1890ff;
  font-family: "Microsoft YaHei", sans-serif;
  font-weight: 400;
}
::v-deep .ant-spin-nested-loading > div > .ant-spin .ant-spin-dot {
  top: 80%;
}
.delteDisabled {
  cursor: not-allowed !important;
  color: #ccc !important;
  margin-left: 3px;
  pointer-events: auto;
}
.delteabled {
  color: #d9001b;
  cursor: pointer;
  margin-left: 3px;
}
.node {
  color: #1890ff;
  font-size: 15px;
  font-weight: bold;
}
.processItem {
  margin-top: 7px;
}
.modalItem {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .item {
    margin-right: 15px;
  }
}
::v-deep .ant-calendar-picker {
  min-width: inherit !important;
}
</style>
