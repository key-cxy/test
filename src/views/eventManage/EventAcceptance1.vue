<template>
    <div class="content">
      <Row>
        <Col :span="16">
          <div class="title">话务信息</div>
          <div>
            <Form
              ref="searchForm"
              :model="searchForm"
              :label-width="150"
              inline
            >
              <FormItem label="来电号码：">
                <Input
                  v-model="searchForm.number"
                  placeholder="请输入来电号码"
                  autocomplete="off"
                ></Input>
              </FormItem>
              <FormItem label="客户姓名：">
                <Input
                  v-model="searchForm.name"
                  placeholder="请输入客户姓名"
                  autocomplete="off"
                ></Input>
              </FormItem>
              <FormItem label="来电事宜：">
                <RadioGroup v-model="searchForm.radio" @on-change="typeChange">
                  <Radio :label="1">咨询</Radio>
                  <Radio :label="2">事件</Radio>
                </RadioGroup>
              </FormItem>
            </Form>
          </div>
          <div class="title">事件信息</div>
          <div v-if="eventType === 2">
            <Form
              ref="searchForm"
              :model="searchForm"
              :label-width="150"
              inline
            >
              <FormItem label="事件来源：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="事件类型：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="事件主题：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="兴趣点：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="具体位置：">
                <Input
                  v-model="searchForm.name"
                  placeholder="请输入具体位置"
                  autocomplete="off"
                  style="width: 396px;"
                ></Input>
              </FormItem>
              <FormItem label="事件描述：">
                <Input v-model="searchForm.textarea" type="textarea"
                       :autosize="{minRows: 4,maxRows: 10}"
                       placeholder="Enter something..."
                       style="width: 800px;"
                ></Input>
              </FormItem>
            </Form>
          </div>
          <div v-if="eventType === 1">
            <Form
              ref="searchForm"
              :model="searchForm"
              :label-width="150"
              inline
            >
              <FormItem label="事件主题：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="兴趣点：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="咨询内容：">
                <Input
                  v-model="searchForm.name"
                  placeholder="请输入咨询内容"
                  autocomplete="off"
                  style="width: 800px;"
                ></Input>
              </FormItem>
              <FormItem label="咨询目的：">
                <Input
                  v-model="searchForm.name"
                  placeholder="请输入咨询目的"
                  autocomplete="off"
                  style="width: 800px;"
                ></Input>
              </FormItem>
              <FormItem label="相关解答：">
                <Input v-model="searchForm.textarea" type="textarea"
                       :autosize="{minRows: 4,maxRows: 10}"
                       placeholder="Enter something..."
                       style="width: 800px;"
                ></Input>
              </FormItem>
            </Form>
          </div>

          <div class="title" v-if="eventType === 2">处置分派</div>
          <div v-if="eventType === 2">
            <Form
              ref="searchForm"
              :model="searchForm"
              :label-width="150"
              inline
            >
              <FormItem label="所属大类：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="所属小类：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="立案名称：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="立案条件：">
                <Input
                  v-model="searchForm.name"
                  placeholder="请输入立案条件"
                  autocomplete="off"
                  style="width: 800px;"
                ></Input>
              </FormItem>
              <FormItem label="考核单位：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="处置期限：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="期限类型：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="所属区域：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="所属网络：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="处置人员：">
                <Select v-model="searchForm.select" label-in-value style="width: 188px;">
                  <Option v-for="item in selectData" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
            </Form>
          </div>
          <div class="title">电话录音</div>
          <div>
            <Form
              ref="searchForm"
              :model="searchForm"
              :label-width="150"
              inline
            >
              <FormItem label="是否回访：">
                <RadioGroup v-model="searchForm.radio1">
                  <Radio label="male">是</Radio>
                  <Radio label="female">否</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="回访号码：">
                <Input
                  v-model="searchForm.name"
                  placeholder="请输入回访号码"
                  autocomplete="off"
                  style="width: 200px;"
                ></Input>
              </FormItem>
              <FormItem>
                <Button type="info">同来电回访</Button>
                <Button type="success" style="margin-left: 20px">话务外拨</Button>
              </FormItem>
            </Form>
            <Table ref="table" :columns="columns" :data="tableData" :height="tableHeight" :loading="tableLoading"></Table>
          </div>
          <div class="title" v-if="eventType === 2">事件材料</div>
          <div v-if="eventType === 2">
            <Table ref="table" :columns="columns" :data="tableData" :height="tableHeight" :loading="tableLoading"></Table>
          </div>
        </Col>
        <Col :span="8">
          <div class="right">
            <div class="title">历史工单</div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="按号码" name="first">
              <el-tabs v-model="activeName1" @tab-click="handleClick">
                <el-tab-pane label="全部" name="first">
                  <div class="card" v-for="item in list">
                    <div class="item">
                      <span >3204002020051800527</span>
                      <span >街面秩序/市容市貌/占道经营</span>
                    </div>
                    <div class="item">
                      <span >联系人：</span>
                      <span >王峰/10000</span>
                      <span >来电时间：</span>
                      <span >2022/6/15 15:00:00</span>
                    </div>
                    <div class="item">
                      <span style="width: 25%">所属区域：</span>
                      <span style="width: 75%">江苏省/南京市/鼓楼区</span>
                    </div>
                    <div class="item">
                      <span style="width: 25%">事件描述：</span>
                      <span style="width: 75%">现代城北面垃圾成堆，城区里还有这样的管理监管空白区，夏天来了，蚊虫周围较多，希望有关部门管一管</span>
                    </div>
                    <div class="item">
                      <span style="width: 25%">处置状态：</span>
                      <span style="width: 75%">处置中</span>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="已办结" name="second">已办结</el-tab-pane>
                <el-tab-pane label="处置中" name="third">处置中</el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="按单位" name="second">按单位</el-tab-pane>
            <el-tab-pane label="按地点" name="third">按地点</el-tab-pane>
          </el-tabs>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="18" offset="6">
        <div>
          <Form
            ref="searchForm"
            :model="searchForm"
            :label-width="150"
            inline
          >
            <FormItem label="流转意见：">
              <Input
                v-model="searchForm.name"
                placeholder="请输入流转意见"
                autocomplete="off"
                style="width: 396px;"
              ></Input>
            </FormItem>
            <FormItem>
              <Button >取消</Button>
              <Button type="error" style="margin-left: 20px">信息重置</Button>
              <Button type="info" style="margin-left: 20px">提交</Button>
            </FormItem>
          </Form>
        </div>
        </Col>
      </Row>
    </div>
</template>

<script>
    export default {
        name: "EventAcceptance",
      data(){
          return{
            activeName: 'first',
            activeName1: 'first',
            searchForm:{},
            demo: 'test',
            selectData: [
              {
                id: 1,
                name: 'test'
              }
            ],
            columns: [
              {
                key: 'key',
                title: '流程节点',
                width: 'auto',
                align: 'center',
                tooltip: true,
              },
              {
                key: 'key1',
                title: '通话人',
                width: 'auto',
                align: 'center',
                tooltip: true,
              },
              {
                key: 'key2',
                title: '开始时间',
                width: 'auto',
                align: 'center',
                tooltip: true,
              },
              {
                key: 'key3',
                title: '结束时间',
                width: 'auto',
                align: 'center',
                tooltip: true,
              },
              {
                key: 'key4',
                title: '时长',
                width: 'auto',
                align: 'center',
                tooltip: true,
              },
              {
                key: 'key5',
                title: '操作',
                width: 'auto',
                align: 'center',
                tooltip: true,
              },
              ],
            tableData:[],
            tableHeight: 'auto',
            tableLoading: false,
            list:[1,2,3,4],
            eventType: 2
          }
      },
      methods: {
        handleClick(tab, event) {
          console.log(tab, event);
        },
        typeChange(value){
          console.log(1111,value)
          this.eventType = value
        }
      }
    }
</script>

<style scoped lang="less">
  .title{
    color: #44A7F6;
    font-size: 20px;
  }
  .card {
    width: 90%;
    margin: 10px auto;
    border-radius: 25px;
    background-color: #f3f9fe;
    .item{
      margin: auto;
      line-height: 34px;
      font-size: 16px;
      width: 90%;
      display: flex;
      justify-content: space-between;
    }
  }
  .right{
    height: 85vh;
    overflow-y: auto;
  }

</style>
