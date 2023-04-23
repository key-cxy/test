<template>
  <div>
    <a-spin :spinning="isloading">
      <div
        class="container"
        :style="{
          height: phStatus == 0 ? '1020px' : '650px',
          'overflow-y': 'auto',
          'overflow-x': 'hidden'
        }"
      >
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
                    @change="handlePhone"
                    v-model="phone"
                    placeholder="请输入来电号码"
                    ref="mobile"
                  ></a-input>
                </div>
              </div>
              <div class="searchItem">
                <span>客户姓名：</span>
                <div>
                  <a-input
                    v-model="userName"
                    placeholder="请输入客户姓名"
                  ></a-input>
                </div>
              </div>
              <div class="searchItem">
                <span>来电事宜：</span>
                <div>
                  <a-radio-group
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
                    <Select
                      style="width: 100%"
                      v-model="problemOrigin"
                      placeholder="请选择事件来源"
                    >
                      <Option
                        v-for="item in problemOriginList"
                        :key="item.id"
                        :value="item.id"
                        >{{ item.name }}
                      </Option>
                    </Select>
                  </div>
                </div>
                <div class="searchCol">
                  <span>事件类型：</span>
                  <div>
                    <Select
                      style="width: 100%"
                      v-model="eventType"
                      placeholder="请选择事件类型"
                    >
                      <Option
                        v-for="item in questionTypeList"
                        :key="item.id"
                        :value="item.label"
                        >{{ item.label }}
                      </Option>
                    </Select>
                  </div>
                </div>
                <div class="searchCol">
                  <span>事件主题：</span>
                  <div>
                    <Select
                      style="width: 100%"
                      v-model="topic"
                      placeholder="请选择事件主题"
                    >
                      <Option
                        v-for="item in topicList"
                        :key="item.id"
                        :value="item.label"
                        >{{ item.label }}
                      </Option>
                    </Select>
                  </div>
                </div>
              </div>
              <div class="searchRow">
                <div class="searchCol">
                  <span
                    >兴&nbsp;&nbsp;&nbsp;&nbsp;趣&nbsp;&nbsp;&nbsp;&nbsp;点：</span
                  >
                  <div>
                    <Select
                      filterable
                      style="width: 100%"
                      v-model="interest"
                      placeholder="请选择兴趣点"
                    >
                      <Option
                        v-for="item in interestList"
                        :key="item.id"
                        :value="item.label"
                        >{{ item.label }}
                      </Option>
                    </Select>
                  </div>
                </div>
                <div class="searchCol" style="flex: 1; display: flex">
                  <span>受理时间：</span>
                  <div style="flex: 1">
                    <DatePicker
                      style="width: 100%; min-width: inherit"
                      format="yyyy-MM-dd HH:mm:ss"
                      v-model="receptionTime"
                      :disabledDate="disabledDate1"
                    />
                  </div>
                </div>
                <div class="searchCol" style="flex: 1; position: relative">
                  <span>具体位置：</span>
                  <div>
                    <a-input placeholder="请输入具体位置" v-model="address" />
                  </div>
                  <div style="position: absolute; right: -23px">
                    <mymap :fill="fill"></mymap>
                  </div>
                </div>
              </div>
              <div class="searchRow">
                <div class="searchCol">
                  <span>事件描述：</span>
                  <div>
                    <a-textarea
                      v-model="question"
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
                    <Select
                      style="width: 100%"
                      v-model="topic1"
                      placeholder="请选择事件主题"
                    >
                      <Option
                        v-for="item in topicList"
                        :key="item.id"
                        :value="item.id"
                        >{{ item.label }}
                      </Option>
                    </Select>
                  </div>
                </div>
                <div class="searchCol">
                  <span>兴趣点：</span>
                  <div>
                    <Select
                      style="width: 100%"
                      v-model="interest1"
                      placeholder="请选择兴趣点"
                    >
                      <Option
                        v-for="(item, index) in interestList"
                        :key="index"
                        :value="item.label"
                        >{{ item.label }}
                      </Option>
                    </Select>
                  </div>
                </div>
                <div class="searchCol"></div>
              </div>
              <div class="searchRow">
                <div class="searchCol">
                  <span>咨询内容：</span>
                  <div>
                    <a-input v-model="question1" placeholder="请输入咨询内容" />
                  </div>
                </div>
              </div>
              <div class="searchRow">
                <div class="searchCol">
                  <span>咨询目的：</span>
                  <div>
                    <a-input v-model="purpose" placeholder="请输入咨询目的" />
                  </div>
                </div>
              </div>
              <div class="searchRow">
                <div class="searchCol">
                  <span>相关解答：</span>
                  <div>
                    <a-textarea
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
                    <el-cascader
                      style="width: 100%"
                      placeholder="请选择考核单位"
                      v-model="assessmentUnit"
                      :options="assessmentUnitList"
                      :props="optionProps"
                      :show-all-levels="false"
                      @change="handleAssessmentUnit"
                      clearable
                    ></el-cascader>
                  </div>
                </div>
                <div class="searchCol">
                  <span>所属大类：</span>
                  <div>
                    <Select
                      style="width: 100%"
                      @on-change="handleBigClass"
                      placeholder="请选择所属大类"
                      v-model="bigClass"
                    >
                      <Option
                        v-for="item in bigClassList"
                        :key="item.id"
                        :value="item.id"
                        >{{ item.name }}
                      </Option>
                    </Select>
                  </div>
                </div>
                <div class="searchCol">
                  <span>所属小类：</span>
                  <div>
                    <Select
                      placeholder="请选择所属小类"
                      style="width: 100%"
                      v-model="smallClass"
                      @on-change="handleSmallClass"
                      @on-open-change="smallClassDropDown"
                    >
                      <Option
                        v-for="item in smallClassList"
                        :key="item.id"
                        :value="item.id"
                        >{{ item.name }}
                      </Option>
                    </Select>
                  </div>
                </div>
              </div>
              <div class="searchRow">
                <div class="searchCol">
                  <span>立案名称：</span>
                  <div>
                    <Select
                      placeholder="请选择立案名称"
                      style="width: 100%"
                      v-model="filingName"
                      @on-change="getFilingCondition"
                      @on-open-change="filingNameDropDown"
                    >
                      <Option
                        v-for="item in filingNameList"
                        :key="item.id"
                        :value="item.id"
                        >{{ item.name }}
                      </Option>
                    </Select>
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
                    <a-input v-model="filingCondition" disabled></a-input>
                  </div>
                </div>
              </div>
              <div class="searchRow">
                <div class="searchCol">
                  <span>所属区域：</span>
                  <div>
                    <el-cascader
                      style="width: 100%"
                      :options="areaTreeData"
                      :props="optionProps"
                      clearable
                      v-model="areaVal"
                      @change="areaChange"
                      placeholder="请选择所属区域"
                      @visible-change="handleCascaderChange"
                    ></el-cascader>
                  </div>
                </div>
                <div class="searchCol">
                  <span>所属网格：</span>
                  <div>
                    <Select style="width: 100%"> </Select>
                  </div>
                </div>
                <div class="searchCol">
                  <span>处置人员：</span>
                  <div>
                    <el-select
                      style="width: 100%"
                      v-model="disposer"
                      clearable
                      placeholder="请选择处置人员"
                    >
                      <el-option
                        v-for="item in disposerList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.nickname"
                      >
                      </el-option>
                    </el-select>
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
                    <a-input></a-input>
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
                  <span style="width: 90px">附件上传：</span>
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
                    支持扩展名：.jpg等
                  </div>
                </div>
                <div class="searchCol">
                  <span>所属类型：</span>
                  <div>
                    <Select style="width: 100%" v-model="fileType">
                      <Option
                        v-for="item in fileTypeList"
                        :key="item.id"
                        :value="item.id"
                        >{{ item.name }}
                      </Option>
                    </Select>
                  </div>
                </div>
                <div class="searchCol"></div>
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
                          style="color: #d9001b"
                          @click="remove(record.id)"
                        >
                          删除
                        </a>
                      </div>
                    </template>
                    <template slot="uploadTime" slot-scope="text, record">
                      <span class="tableClass" style="color: #008f4a">
                        {{
                          new Date(record.uploadTime).toLocaleString(
                            'chinese',
                            {
                              hour12: false
                            }
                          )
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
              <div class="txt">历史工单</div>
            </div>
          </div>
          <div v-if="phStatus == 0">
            <a-tabs default-active-key="1">
              <a-tab-pane key="1" tab="按号码（356）"></a-tab-pane>
              <a-tab-pane key="2" tab="按单位（24）" force-render> </a-tab-pane>
              <a-tab-pane key="3" tab="按地点（24）" force-render> </a-tab-pane>
            </a-tabs>
            <div style="text-align: right; margin-right: 15px">
              <a-radio-group
                v-model="status"
                style="margin-bottom: 16px"
                @change="changeStatus"
              >
                <a-radio-button value=""> 全部 </a-radio-button>
                <a-radio-button value="0">处置中</a-radio-button>
                <a-radio-button value="1">已办结</a-radio-button>
              </a-radio-group>
            </div>
            <div class="card" v-for="(item, index) in historyList" :key="index">
              <div class="item" style="color: rgb(24, 144, 255)">
                <div style="width: 50%">{{ item.caseNo }}</div>
                <div style="width: 50%">{{ item.classConfig }}</div>
              </div>
              <div class="item">
                <div style="width: 20%">联系人：</div>
                <div style="width: 30%">{{ item.contact }}</div>
                <div style="width: 20%"></div>
                <div style="width: 30%"></div>
              </div>
              <div class="item">
                <div style="width: 20%">所属区域：</div>
                <div style="width: 80%; color: rgba(245, 154, 35, 0.82)">
                  {{ item.areaInfo }}
                </div>
              </div>
              <div class="item">
                <span style="width: 20%">事件描述：</span>
                <span style="width: 80%; font-family: PingFang SC">{{
                  item.question
                }}</span>
              </div>
              <div class="item">
                <div style="width: 20%">处置状态：</div>
                <div style="width: 80%; color: rgb(0, 143, 74)">
                  {{ item.status == 0 ? '处置中' : '已办结' }}
                </div>
              </div>
            </div>
            <div class="more" v-if="showMore">
              <a-button size="large" :loading="loading" @click="getMore"
                >加载更多...</a-button
              >
            </div>
          </div>
          <div v-if="phStatus == 1">
            <a-tabs default-active-key="1">
              <a-tab-pane key="1" tab="按号码（356）"></a-tab-pane>
              <a-tab-pane key="2" tab="按地点（24）" force-render> </a-tab-pane>
            </a-tabs>
            <div style="text-align: right">
              <a-radio-group v-model="size" style="margin-bottom: 16px">
                <a-radio-button value="small"> 全部 </a-radio-button>
                <a-radio-button value="default">已答复</a-radio-button>
                <a-radio-button value="large">未答复</a-radio-button>
              </a-radio-group>
            </div>
            <div class="card" v-for="(item, index) in historyList" :key="index">
              <div class="item" style="color: rgb(24, 144, 255)">
                <div style="width: 50%">3204002020051800527</div>
                <div style="width: 50%">街面秩序/市容市貌/占道经营</div>
              </div>
              <div class="item">
                <div style="width: 20%">联系人：</div>
                <div style="width: 30%">王峰/10000</div>
                <div style="width: 20%">来电时间：</div>
                <div style="width: 30%">2022/6/15 15:00:00</div>
              </div>
              <div class="item">
                <div style="width: 20%">所属区域：</div>
                <div style="width: 80%; color: rgba(245, 154, 35, 0.82)">
                  江苏省/南京市/鼓楼区
                </div>
              </div>
              <div class="item">
                <span style="width: 20%">事件描述：</span>
                <span style="width: 80%; font-family: PingFang SC"
                  >现代城北面垃圾成堆，城区里还有这样的管理监管空白区，夏天来了，蚊虫周围较多，希望有关部门管一管</span
                >
              </div>
              <div class="item">
                <div style="width: 20%">处置状态：</div>
                <div style="width: 80%; color: rgb(0, 143, 74)">处置中</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a-spin :spinning="temSaveLoading">
        <div class="footer">
          <div class="footerItem">
            <div style="width: 80px">处理意见：</div>
            <a-input style="flex: 1" v-model="processOption"></a-input>
            <a-popover
              title="自定义审批意见"
              placement="topRight"
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
            <el-button
              style="margin-right: 10px; width: 120px"
              type="info"
              size="mini"
              plain
              @click="handleTemporarySave"
              >暂 存</el-button
            >
            <!-- <a-button style="margin-right: 10px; width: 120px">取消</a-button> -->
            <!-- <a-button style="
            margin-right: 10px;
            width: 120px;
            color: rgb(245, 34, 45);
            border: 1px solid rgb(245, 34, 45);
          " @click="resetAll">信息重置</a-button> -->
            <a-button
              type="primary"
              @click="handleTemporarySaveInfo($event)"
              style="margin-right: 10px; width: 120px"
              :loading="spinning"
              ref="btnSubmit"
              >激活</a-button
            >
            <!-- <a-button v-if="problemOrigin === 20" type="primary" @click="handleTemporarySaveInfo($event)"
            style="margin-right: 10px; width: 120px" :loading="spinning" ref="btnSubmit">直接办结</a-button> -->
          </div>
        </div>
      </a-spin>
    </a-spin>
  </div>
</template>

<script>
import {
  getBigClass,
  getBigSmallFiling,
  getFilingCondition,
  getDictData,
  getUnitByFilingId,
  getAreaTree,
  upload,
  getDeptUser,
  handleTemporarySaveInfo,
  handleTemporarySave, //暂存
  problemSourceList,
  getApprovalViewList,
  createView,
  updateView,
  deleteView,
  deleteFile,
  getHistoryList,
  queryAreaInHandle,
  getAssessmentUnit,
  getByAssessmentUnitId
} from '@/api/eventAcceptance.js'

import { getTemporarySaveDetail } from '@/api/event/search.js'

import getPathById from '@/libs/getPathById.js'
import moment from 'moment'
import mymap from './map.vue'
import Treeselect from '@riophae/vue-treeselect'
import index from 'watch-size'
import { debug } from 'util'

const uploadKey = 'uploadKey'

const mobileReg =
  /^((19[0-9])|(13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/

export default {
  name: 'temporaryDetail',
  components: {
    mymap,
    Treeselect
  },
  data() {
    return {
      spinning: false,
      temSaveLoading: false,
      columns: [
        {
          title: '流程节点',
          dataIndex: 'name',
          key: 'name',
          customRender: (text, record) => {
            return <span class="tableClass">{{ text }}</span>
          }
        },
        {
          title: '通话人',
          dataIndex: 'platform',
          key: 'platform',
          align: 'center',
          customRender: (text, record) => {
            return <span class="tableClass">{{ text }}</span>
          }
        },
        {
          title: '开始时间',
          dataIndex: 'version',
          key: 'version',
          align: 'center',
          customRender: (text, record) => {
            return (
              <span class="tableClass" style="color: #008F4A">
                {{ text }}
              </span>
            )
          }
        },
        {
          title: '结束时间',
          dataIndex: 'upgradeNum',
          key: 'upgradeNum',
          align: 'center',
          customRender: (text, record) => {
            return (
              <span class="tableClass" style="color: #008F4A">
                {{ text }}
              </span>
            )
          }
        },
        {
          title: '时长',
          dataIndex: 'creator',
          key: 'creator',
          align: 'center',
          customRender: (text, record) => {
            return <span class="tableClass">{{ text }}</span>
          }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          customRender: (text, record) => {
            return (
              <a href="javascript:;" style="color: #1890ff">
                播放
              </a>
            )
          }
        }
      ],
      columns2: [
        {
          title: '缩略图',
          dataIndex: 'url',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'url' }
        },
        {
          title: '流程节点',
          dataIndex: 'eventNode',
          key: 'eventNode',
          align: 'center'
        },
        {
          title: '上传人',
          dataIndex: 'uploadName',
          key: 'uploadName',
          align: 'center',
          customRender: (text, record) => {
            return (
              <span class="tableClass" style="color: #008F4A">
                {{ text }}
              </span>
            )
          }
        },
        {
          title: '上传时间',
          key: 'uploadTime',
          align: 'center',
          scopedSlots: { customRender: 'uploadTime' }
        },
        {
          title: '附件类型',
          dataIndex: 'fileType',
          key: 'fileType',
          align: 'center'
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'fileOperation' }
        }
      ],
      data: [
        {
          name: '11',
          platform: 'iOS',
          version: '10.3.4.5654',
          upgradeNum: 500,
          creator: 'Jack',
          createdAt: '2014-12-24 23:12:00'
        }
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
        value: 'id',
        label: 'name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      assessmentUnitOptionProps: {
        value: 'id',
        label: 'name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      filingCondition: undefined, //立案条件
      disposalPeriod: undefined, // 处置期限
      timeType: '', //期限类型
      timeTypeVal: '', // 期限类型值
      periodTypeId: '', //期限类型ID
      assessmentUnit: undefined,
      assessmentUnitList: [],
      disposer: undefined, //处置人
      disposerList: [], //处置人下拉列表
      fileTypeList: [
        { id: '现场照片', name: '现场照片' },
        { id: '处置照片', name: '处置照片' }
      ],
      fileType: '现场照片',
      fileTable: [],
      fileList: [],

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
      processOption: '',
      latitude: this.latitude,
      longitude: this.longitude,
      viewList: [],

      showTime: {
        defaultValue: moment('00:00:00', 'HH:mm:ss')
      },
      createView: '',
      updateViewContent: '',
      status: '',
      page: 1,
      size: 3,
      historyList: [],
      loading: false,
      showMore: false,
      isloading: false,
      registerInfo: {}
    }
  },
  props: {
    caseStatus: Number,
    caseNo: String,
    rowId: Number
  },
  watch: {
    caseNo: {
      handler() {
        this.handleInit()
      },
      immediate: true
    }
  },
  mounted() {
    this.problemSourceList() // 获取事件来源
  },
  methods: {
    async handleInit() {
      console.log('调用了事件详情~~~~~~~~~~~~')
      this.isloading = true
      // this.getBigSmallFiling("bigClass", "");
      this.getAssessmentUnit()
      this.getDictData('interest') // 兴趣点
      this.getDictData('question_type') // 事件类型
      this.getDictData('topic') //事件主题
      this.getAreaTree() //获取所属区域

      // 获取caseNo
      // let caseNo = this.$route.query.caseNo;
      let caseNo = this.caseNo
      // let caseStatus = this.$route.query.caseStatus;
      // this.caseStatus = caseStatus;
      await getTemporarySaveDetail({ caseNo }).then((res) => {
        if (res.code == 200) {
          this.phStatus = parseInt(res.data.caseType)
          if (this.phStatus == 1) {
            let data = res.data
            this.callInfo = data.callInfo
            let callInfo = data.callInfo
            this.phone = callInfo.phone

            let advisoryInfo = data.advisoryInfo || {}

            this.topic1 = parseInt(advisoryInfo.topic)
            this.interest1 = advisoryInfo.interest
            this.question1 = advisoryInfo.question
            this.purpose = advisoryInfo.purpose
            this.answer = advisoryInfo.answer

            this.userName = advisoryInfo.userName
            this.problemOrigin = advisoryInfo.problemOrigin
            this.eventType = advisoryInfo.eventType
            this.processOption = advisoryInfo.processOption
          } else {
            let data = res.data
            this.callInfo = data.callInfo
            this.eventProcess = data.eventProcess

            // this.eventTaskInfo = data.eventTaskInfo;
            // this.mainIsSuspend = data.eventTaskInfo.mainIsSuspend;

            this.materialList = data.materialIdList
            this.processList = data.processList
            this.recordFileList = data.recordFileList
            this.registerInfo = data.registerInfo

            let registerInfo = data.registerInfo
            let callInfo = data.callInfo
            let materialList = data.materialIdList

            this.phone = registerInfo.phone
            this.userName = registerInfo.userName
            // this.phStatus = parseInt(callInfo.phStatus);
            this.problemOrigin = registerInfo.problemOrigin
            this.eventType = registerInfo.eventType
            this.topic = registerInfo.topic
            this.interest = registerInfo.interest
            this.receptionTime = registerInfo.receptionTime
            this.address = registerInfo.address
            this.question = registerInfo.question
            this.bigClass = registerInfo.largeId
            this.smallClass = registerInfo.smallId
            this.filingName = registerInfo.filingId
            this.filingCondition = registerInfo.filingCondition
            this.disposalPeriod = registerInfo.disposalPeriod
            this.disposer = registerInfo.disposer
            this.assessmentUnit = registerInfo.assessmentUnit
            this.assessmentUnitTemp = getPathById(
              this.assessmentUnitList,
              this.assessmentUnit
            )
            // if (data.assessmentUnits) {
            //   var list = [];
            //   data.assessmentUnits.forEach((item) => {
            //     list.push(item.deptName);
            //   });
            //   this.assessmentUnitTemp = list.join();
            // }
            getFilingCondition(this.filingName).then((res) => {
              if (res.code == 200) {
                this.filingCondition = (res.data || {}).filingCondition
                this.disposalPeriod = (res.data || {}).disposalPeriod
                this.periodTypeId = (res.data || {}).type
                this.timeType =
                  (res.data || {}).type == 1
                    ? '工作时'
                    : (res.data || {}).type == 2
                    ? '紧急工作时'
                    : ''
                this.timeTypeVal = (res.data || {}).type
              }
            })

            // this.buttonList = data.buttonList;

            let areaVal = []
            let area = registerInfo.area
            areaVal.push(area)
            if (registerInfo.street) {
              areaVal.push(registerInfo.street)
            }
            if (registerInfo.community) {
              areaVal.push(registerInfo.community)
            }
            this.oldAreaVal = areaVal
            this.areaVal = areaVal
            if (materialList) {
              let newMaterialList = materialList.map((item) => {
                item.disabled = true
                return item
              })
              this.fileTable = newMaterialList
            }
            let id = areaVal[areaVal.length - 1]
            getDeptUser(id, this.problemOrigin).then((res) => {
              if (res.code == 200) {
                this.disposerList = res.data
              }
            })
            queryAreaInHandle(registerInfo.caseNo).then((res) => {
              if (res.code == 200) {
                let areaTreeData = res.data
                // let newAreaTreeData = [];
                // if (areaVal.length == 3) {
                //   areaTreeData = areaTreeData.map((item) => {
                //     return (item.disabled = true);
                //   });
                // }
                if (areaVal.length == 1) {
                  areaTreeData.disabled = true
                }
                if (areaVal.length == 2) {
                  areaTreeData.disabled = true
                  areaTreeData.children[0].disabled = true
                }
                if (areaVal.length == 3) {
                  areaTreeData.disabled = true
                  areaTreeData.children[0].disabled = true
                  areaTreeData.children[0].children[0].disabled = true
                }
                this.areaTreeData = [...areaTreeData]
              }
            })
            this.phone && this.handlePhone()
          }
        }
      })
      if (this.phStatus == 0) {
        console.log('2333')
        this.getBigClassList(this.assessmentUnit)
        this.bigClass && this.getBigSmallFiling('smallClass', this.bigClass)
        this.smallClass && this.getBigSmallFiling('filing', this.smallClass)
        this.getFilingCondition()
        // getUnitByFilingId(this.filingName).then((res) => {
        //   if (res.code == 200) {
        //     let assessmentUnitList = this.filterData(res.data);
        //     this.assessmentUnitList = assessmentUnitList;
        //     this.assessmentUnit = getPathById(assessmentUnitList, this.assessmentUnitTemp);
        //   }
        // });
      }
      this.isloading = false
    },
    // 暂存接口
    handleTemporarySave() {
      if (!mobileReg.test(this.phone)) {
        this.checkInfo('请输入正确的手机格式')
        return
      }
      if (!this.phone || this.phone.length == 0) {
        this.checkInfo('请输入来电号码')
        return
      }
      if (!this.userName || this.userName.length == 0) {
        this.checkInfo('请输入客户姓名')
        return
      }

      if (this.phStatus == 0) {
        if (!this.problemOrigin || this.problemOrigin.length == 0) {
          this.checkInfo('请选择事件来源')
          return
        }
        var isFinishend = ''
        if (this.problemOrigin === 20) {
          isFinishend = 1
        }
        if (!this.eventType || this.eventType.length == 0) {
          this.checkInfo('请选择事件类型')
          return
        }
        if (!this.topic || this.topic.length == 0) {
          this.checkInfo('请选择事件主题')
          return
        }
        if (!this.interest || this.interest.length == 0) {
          this.checkInfo('请选择兴趣点')
          return
        }
        if (!this.receptionTime || this.receptionTime.length == 0) {
          this.checkInfo('请选择受理时间')
          return
        }
        if (!this.address || this.address.length == 0) {
          this.checkInfo('请输入具体位置')
          return
        }
        if (!this.question || this.question.length == 0) {
          this.checkInfo('请输入事件描述')
          return
        }
        if (!this.bigClass || this.bigClass.length == 0) {
          this.checkInfo('请选择所属大类')
          return
        }
        if (!this.smallClass || this.smallClass.length == 0) {
          this.checkInfo('请选择所属小类')
          return
        }
        if (!this.filingName || this.filingName.length == 0) {
          this.checkInfo('请选择立案名称')
          return
        }
        if (!this.assessmentUnit) {
          this.checkInfo('请选择考核单位')
          return
        }
        if (!this.areaVal || this.areaVal.length == 0) {
          this.checkInfo('请选择所属区域')
          return
        }
        if (!this.processOption || this.processOption.length == 0) {
          this.checkInfo('请输入处理意见')
          return
        }
        let reportData = {}

        let fileIds = []
        this.fileTable.map((item) => {
          fileIds.push(item.id)
        })
        let area = this.areaVal[0]
        let street = this.areaVal[1] || ''
        let community = this.areaVal[2] || ''
        this.temSaveLoading = true
        reportData = {
          caseNo: this.caseNo,
          come: 0, //信息来源 （0-web，1-app）
          receptionTime: moment(this.receptionTime).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          phone: this.phone,
          phStatus: 0,
          returnVisit: this.returnVisit,
          assessmentUnit: this.assessmentUnit,
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
          largeId: this.bigClass,
          smallId: this.smallClass,
          filingId: this.filingName,
          filingCondition: this.filingCondition,
          timeType: this.timeTypeVal,
          latitude: '',
          longitude: '',
          disposalPeriod: this.disposalPeriod,
          area,
          street,
          community,
          grid: '',
          disposer: this.disposer,
          isFinishend: isFinishend
        }

        handleTemporarySave(reportData)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success({
                content: '案件暂存成功',
                duration: 2
              })
              this.$emit('handleCloseTemDetal')
              // this.$router.push({
              //   path: "/event/eventDisposal",
              //   query: {
              //     //query是个配置项
              //   },
              // });
            }
          })
          .catch((err) => {})
          .finally(() => {
            this.temSaveLoading = false
          })
      }
      if (this.phStatus == 1) {
        if (!this.topic1 || this.topic1.length == 0) {
          this.checkInfo('请选择事件主题')
          return
        }
        if (!this.interest1 || this.interest1.length == 0) {
          this.checkInfo('请选择兴趣点')
          return
        }
        if (!this.question1 || this.question1.length == 0) {
          this.checkInfo('请填写咨询内容')
          return
        }
        if (!this.purpose || this.purpose.length == 0) {
          this.checkInfo('请填写咨询目的')
          return
        }
        if (!this.answer || this.answer.length == 0) {
          this.checkInfo('请填写相关解答')
          return
        }
        let reportData = {}
        this.temSaveLoading = true
        reportData = {
          caseNo: this.caseNo,
          come: 0, //信息来源 （0-web，1-app）
          phStatus: 1,
          returnVisit: this.returnVisit,
          processOption: this.processOption,
          recordIds: [],
          phone: this.phone,
          userName: this.userName,
          topic: this.topic1,
          interest: this.interest1,
          question: this.question1,
          purpose: this.purpose,
          answer: this.answer
        }
        handleTemporarySave(reportData)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success({
                content: '咨询案件暂存成功',
                duration: 2
              })
              this.$emit('handleCloseTemDetal')
              // this.$router.push({
              //   path: "/event/eventDisposal",
              //   query: {
              //     //query是个配置项
              //   },
              // });
            }
          })
          .catch((err) => {})
          .finally(() => {
            this.temSaveLoading = false
          })
      }
    },
    handlePhone() {
      this.$refs.mobile.$el.classList.add('danger')

      if (mobileReg.test(parseInt(this.phone))) {
        this.$refs.mobile.$el.classList.remove('danger')
        this.historyList = []
        this.page = 1
        this.getList()
      } else {
        this.$refs.mobile.$el.classList.add('danger')
        this.historyList = []
        this.page = 1
        this.showMore = false
      }
    },
    getMore() {
      this.loading = true
      this.page = this.page + 1
      this.getList()
    },
    getList() {
      getHistoryList(this.phone, this.page, this.size, this.status).then(
        (res) => {
          if (res.code == 200) {
            this.loading = false
            res.data.records.map((item) => {
              this.historyList.push(item)
              if (this.size > res.data.records.length) {
                this.showMore = false
              } else {
                this.showMore = true
              }
            })
            console.log(this.historyList)
          }
        }
      )
    },
    changeStatus(e) {
      this.status = e.target.value
      this.historyList = []
      this.page = 1
      this.getList()
    },
    fill(address, latitude, longitude) {
      debugger
      this.address = address
      this.latitude = latitude
      this.longitude = longitude
    },
    resetAll() {
      let _this = this
      this.$confirm({
        title: '是否确认重置信息',
        content: '是否确认重置信息',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          return new Promise((resolve, reject) => {
            _this.phone = undefined
            _this.userName = undefined
            _this.receptionTime = undefined
            _this.problemOrigin = undefined
            _this.topic = undefined
            _this.topic1 = undefined
            _this.interest = undefined
            _this.interest1 = undefined
            _this.answer = undefined
            _this.question1 = undefined
            _this.purpose = undefined
            _this.eventType = undefined
            _this.address = undefined
            _this.question = undefined
            _this.returnVisit = 0
            _this.processOption = undefined
            _this.areaVal = []
            _this.fileTable = []
            _this.disposer = undefined
            _this.assessmentUnit = undefined
            _this.bigClass = undefined
            _this.resetAssessmentUnit()
            resolve()
          })
        }
      })
    },
    onDelete(id) {
      this.deleteView(id)
    },
    updateOpinion(id) {
      if (this.updateViewContent.length == 0 || !this.updateViewContent) {
        this.$message.warn({
          content: '修改的自定义处置意见不能为空',
          duration: 2
        })
        return
      }
      updateView(this.updateViewContent, id).then((res) => {
        this.resetEditModule()
        this.getApprovalViewList()
        this.$message.success({
          content: '自定义处置意见修改成功',
          duration: 2
        })
      })
    },
    deleteView(id) {
      deleteView(id)
        .then((res) => {
          this.resetEditModule()
          if (res.code == 200) {
            this.$message.success({
              content: '删除自定义处置意见成功',
              duration: 2
            })
            this.getApprovalViewList()
          } else {
          }
        })
        .catch((err) => {
          // this.resetEditModule();
          this.$message.error({
            content: '删除自定义处置意见失败',
            duration: 2
          })
        })
    },
    addView() {
      this.resetEditModule()
      if (this.createView.length == 0 || !this.createView) {
        this.checkInfo('请输入自定义处置意见！')
        return
      }
      createView(this.createView).then((res) => {
        if (res.code == 200) {
          this.createView = ''
          this.$message.success({
            content: '添加自定义处置意见成功',
            duration: 2
          })
          this.getApprovalViewList()
        }
      })
    },
    fillOption(item) {
      this.processOption = item.view
    },
    resetEditModule() {
      let viewList = this.viewList
      viewList.map((item) => {
        item.isEdit = false
        return item
      })
      this.viewList = viewList
    },
    editOrDelete(index, item) {
      this.resetEditModule()
      this.processOption = ''
      this.viewList[index].isEdit = true
      this.updateViewContent = item.view
    },
    getAssessmentUnit() {
      getAssessmentUnit().then((res) => {
        if (res.code === 200) {
          this.assessmentUnitList = this.filterData(res.data)
        }
      })
    },
    getBigSmallFiling(type, parentId) {
      getBigSmallFiling(parentId).then((res) => {
        if (res.code == 200) {
          if (type == 'bigClass') {
            this.bigClassList = res.data
          } else if (type == 'smallClass') {
            this.smallClassList = res.data
            this.filingNameList = []
          } else if (type == 'filing') {
            this.filingNameList = res.data
          }
        }
      })
    },
    getFilingCondition(value) {
      this.resetFilingName()
      this.filingNameList.map((item) => {
        if (item.id === value) {
          this.filingCondition = item.filingCondition
          this.disposalPeriod = item.disposalPeriod
          this.periodTypeId = item.type
          this.timeType =
            item.type == 1 ? '工作时' : item.type == 2 ? '紧急工作时' : ''
          this.timeTypeVal = item.type
        }
      })
    },
    // 字典表 事件类型，主题，兴趣点 question_type 事件类型 topic 事件主题 interest 兴趣点
    getDictData(type) {
      getDictData(type).then((res) => {
        if (res.code == 0) {
          if (type == 'interest') {
            this.interestList = res.data
          }
          if (type == 'question_type') {
            this.questionTypeList = res.data
          }
          if (type == 'topic') {
            this.topicList = res.data
          }
        }
      })
    },
    handleAssessmentUnit(value) {
      console.log(value)
      this.assessmentUnit = value[value.length - 1]
      this.resetAssessmentUnit()
      this.getBigClassList(value[value.length - 1])
    },
    handleBigClass(value) {
      console.log(111111111111, value)
      this.resetBigClass()
      this.bigClassList.map((item) => {
        if (item.id === value) {
          this.smallClassList = item.children
        }
      })
      console.log('small', this.smallClassList)
    },
    handleSmallClass(value) {
      this.resetSmallClass()
      this.smallClassList.map((item) => {
        if (item.id === value) {
          this.filingNameList = item.children
        }
      })
      // this.getBigSmallFiling("filing", this.smallClass);
    },
    smallClassDropDown() {
      if (!this.bigClass || this.bigClass.length == 0) {
        this.$message.warning('请先选择所属大类！')
        this.return
      }
    },
    filingNameDropDown() {
      if (!this.smallClass || this.smallClass.length == 0) {
        this.$message.warning('请先选择所属小类！')
        this.return
      }
    },
    assmentUnitVisaleChange(callback) {
      if (callback) {
        if (!this.filingName || this.filingName.length == 0) {
          this.$message.warning('请先选择立案名称！')
          this.return
        }
      }
    },
    getBigClassList(value) {
      const param = {
        assessmentUnitId: value
      }
      getByAssessmentUnitId(param).then((res) => {
        if (res.code === 200) {
          this.bigClassList = res.data
        }
      })
    },
    getAreaTree() {
      getAreaTree().then((res) => {
        if (res.code == 200) {
          let areaTreeData = this.filterData(res.data.children)
          this.areaTreeData = areaTreeData
        }
      })
    },
    filterData(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children) {
          if (arr[i].children.length > 0) {
            this.filterData(arr[i].children)
          } else {
            delete arr[i].children
          }
        }
      }
      return arr
    },
    onUpload(info) {
      this.$message.loading({
        content: '上传中...',
        duration: 0,
        key: uploadKey
      })
      let formData = new FormData()
      formData.append('file', info.file)
      formData.append('eventNode', '受理')
      formData.append('caseNo', '')
      formData.append('fileType', this.fileType)
      upload(formData)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success({
              content: '上传成功',
              key: uploadKey,
              duration: 2
            })
            this.fileTable.push(res.data)
          }
        })
        .catch((err) => {
          this.$message.error({
            content: '上传失败',
            key: uploadKey,
            duration: 2
          })
        })
    },
    resetAssessmentUnit() {
      this.bigClass = null
      this.bigClassList = []
      this.resetBigClass()
    },
    resetBigClass() {
      this.smallClass = null
      this.smallClassList = []
      this.resetSmallClass()
    },
    resetSmallClass() {
      this.filingName = null
      this.filingNameList = []
      this.resetFilingName()
    },
    resetFilingName() {
      this.filingCondition = null
      this.disposalPeriod = null
      this.timeType = ''
    },

    handleCascaderChange(visible) {
      if (visible) {
        if (!this.problemOrigin || this.problemOrigin.length == 0) {
          this.checkInfo('请先选择事件来源')
          this.areaVal = []
          return false
        }
      }
      return visible
    },
    areaChange(arr) {
      if (!this.problemOrigin || this.problemOrigin.length == 0) {
        this.checkInfo('请先选择事件来源')
        this.areaVal = []
        return false
      }
      // debugger;
      this.areaVal = arr
      this.disposer = undefined
      this.disposerList = []

      if (arr.length > 0) {
        let id = arr[arr.length - 1]
        getDeptUser(id, this.problemOrigin).then((res) => {
          if (res.code == 200) {
            this.disposerList = res.data
          }
        })
      }
    },
    downLoad(fileId, fileName) {
      console.log(fileId, fileName)
      const a = document.createElement('a')
      a.href =
        `/com-djld-platform/djld-platform/comDjldPlatform/register-material/fdfsDownload?fileId=` +
        fileId
      a.download = fileName
      console.log(a.href)
      a.click()
      window.URL.revokeObjectURL(url)
    },
    remove(id) {
      deleteFile(id).then((res) => {
        if (res.code == 200) {
          this.$message.success({
            content: '附件删除成功',
            duration: 2
          })
          let index = -1
          this.fileTable.forEach((item, i) => {
            if (item.id == id) {
              index = i
              return
            }
          })
          this.fileTable.splice(index, 1)
        }
      })
      // let index = -1;
      // this.fileTable.forEach((item, i) => {
      //   if (item.id == id) {
      //     index = i;
      //     return;
      //   }
      // });
      // this.fileTable.splice(index, 1);
    },
    problemSourceList() {
      problemSourceList().then((res) => {
        if (res.code == 200) {
          this.problemOriginList = res.data
        }
      })
    },
    handleTemporarySaveInfo(e) {
      if (!mobileReg.test(this.phone)) {
        this.checkInfo('请输入正确的手机格式')
        return
      }
      if (!this.phone || this.phone.length == 0) {
        this.checkInfo('请输入来电号码')
        return
      }
      if (!this.userName || this.userName.length == 0) {
        this.checkInfo('请输入客户姓名')
        return
      }
      if (this.phStatus == 0) {
        if (!this.problemOrigin || this.problemOrigin.length == 0) {
          this.checkInfo('请选择事件来源')
          return
        }
        var isFinishend = ''
        if (this.problemOrigin === 20) {
          isFinishend = 1
        }
        if (!this.eventType || this.eventType.length == 0) {
          this.checkInfo('请选择事件类型')
          return
        }
        if (!this.topic || this.topic.length == 0) {
          this.checkInfo('请选择事件主题')
          return
        }
        if (!this.interest || this.interest.length == 0) {
          this.checkInfo('请选择兴趣点')
          return
        }
        if (!this.receptionTime || this.receptionTime.length == 0) {
          this.checkInfo('请选择受理时间')
          return
        }
        if (!this.address || this.address.length == 0) {
          this.checkInfo('请输入具体位置')
          return
        }
        if (!this.question || this.question.length == 0) {
          this.checkInfo('请输入事件描述')
          return
        }
        if (!this.bigClass || this.bigClass.length == 0) {
          this.checkInfo('请选择所属大类')
          return
        }
        if (!this.smallClass || this.smallClass.length == 0) {
          this.checkInfo('请选择所属小类')
          return
        }
        if (!this.filingName || this.filingName.length == 0) {
          this.checkInfo('请选择立案名称')
          return
        }
        if (!this.assessmentUnit) {
          this.checkInfo('请选择考核单位')
          return
        }
        if (!this.areaVal || this.areaVal.length == 0) {
          this.checkInfo('请选择所属区域')
          return
        }
        if (!this.processOption || this.processOption.length == 0) {
          this.checkInfo('请输入处理意见')
          return
        }
        let reportData = {}

        let fileIds = []
        this.fileTable.map((item) => {
          fileIds.push(item.id)
        })
        let area = this.areaVal[0]
        let street = this.areaVal[1] || ''
        let community = this.areaVal[2] || ''

        reportData = {
          ...this.registerInfo,
          id: this.rowId,
          caseNo: this.caseNo,
          come: 0, //信息来源 （0-web，1-app）
          receptionTime: moment(this.receptionTime).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          phone: this.phone,
          phStatus: 0,
          returnVisit: this.returnVisit,
          assessmentUnit: this.assessmentUnit,
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
          largeId: this.bigClass,
          smallId: this.smallClass,
          filingId: this.filingName,
          filingCondition: this.filingCondition,
          timeType: this.timeTypeVal,
          latitude: '',
          longitude: '',
          disposalPeriod: this.disposalPeriod,
          area,
          street,
          community,
          grid: '',
          disposer: this.disposer,
          isFinishend: isFinishend
        }
        this.spinning = true
        this.$refs.btnSubmit.innerText = '提交中'
        handleTemporarySaveInfo(reportData)
          .then((res) => {
            debugger
            if (res.code == 200) {
              this.spinning = false

              this.$message.success({
                content: '案件上报成功',
                duration: 2
              })
              this.$router.push({
                path: '/event/eventDisposal',
                query: {
                  //query是个配置项
                }
              })
            }
          })
          .catch((err) => {})
      }
      if (this.phStatus == 1) {
        if (!this.topic1 || this.topic1.length == 0) {
          this.checkInfo('请选择事件主题')
          return
        }
        if (!this.interest1 || this.interest1.length == 0) {
          this.checkInfo('请选择兴趣点')
          return
        }
        if (!this.question1 || this.question1.length == 0) {
          this.checkInfo('请填写咨询内容')
          return
        }
        if (!this.purpose || this.purpose.length == 0) {
          this.checkInfo('请填写咨询目的')
          return
        }
        if (!this.answer || this.answer.length == 0) {
          this.checkInfo('请填写相关解答')
          return
        }
        let reportData = {}
        reportData = {
          ...this.registerInfo,
          id: this.rowId,
          caseNo: this.caseNo,
          come: 0, //信息来源 （0-web，1-app）
          phStatus: 1,
          returnVisit: this.returnVisit,
          processOption: this.processOption,
          recordIds: [],
          phone: this.phone,
          userName: this.userName,
          topic: this.topic1,
          interest: this.interest1,
          question: this.question1,
          purpose: this.purpose,
          answer: this.answer
        }
        this.spinning = true
        this.$refs.btnSubmit.innerText = '提交中'
        handleTemporarySaveInfo(reportData)
          .then((res) => {
            if (res.code == 200) {
              this.spinning = false

              this.$message.success({
                content: '咨询案件上报成功',
                duration: 2
              })
              this.$router.push({
                path: '/event/eventDisposal',
                query: {
                  //query是个配置项
                }
              })
            }
          })
          .catch((err) => {})
      }
    },
    handleVisibleChange(visible) {
      if (visible) {
        this.getApprovalViewList()
      }
    },
    getApprovalViewList() {
      getApprovalViewList().then((res) => {
        if (res.code == 200) {
          let viewList = res.data.map((item) => {
            item.isEdit = false
            return item
          })
          this.viewList = viewList
        }
      })
    },
    checkInfo(content) {
      this.$message.warn({
        content,
        duration: 2
      })
    },
    // 格式化部门的下拉框
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    // 限制日期不可选
    disabledDate1(current) {
      return false
      // return current > new Date(); // 大于当前日期不能选
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  margin: 10px 25px;
  display: flex;

  .leftItem,
  .rightItem {
    flex: 8;
    margin-right: 10px;

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
            /*width: 85px;*/
            text-align: right;
          }
        }

        .searchRow {
          width: 100%;
          display: flex;
          margin-top: 18px;

          .searchCol {
            display: flex;
            margin-right: 30px;
            align-items: center;
            flex: 1;

            span {
              /*width: 85px;*/
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
    overflow-y: auto;
    overflow-x: hidden;

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
        font-family: 'PingFang SC ', 'PingFang SC', sans-serif;

        div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 2px;
        }
      }
    }

    .more {
      display: flex;
      align-items: center;
      justify-content: center;
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
  font-family: 'Microsoft YaHei', sans-serif;
  font-weight: 400;
}

::v-deep .ant-spin-nested-loading > div > .ant-spin .ant-spin-dot {
  top: 80%;
}

.danger {
  border-color: red;
  box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.2) !important;
}

::v-deep .ant-calendar-picker {
  min-width: inherit !important;
}
</style>
