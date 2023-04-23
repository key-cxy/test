<template>
  <div style="margin-top: 20px">
    <Row>
      <Col :span="24">
        <div>
          <Form
            ref="searchForm"
            :model="searchForm"
            :label-width="110"
            inline
            style="padding: 10px 0 0 0"
          >
            <FormItem label="问题来源：">
              <Input
                v-model="searchForm.name"
                placeholder="请输入问题来源"
                autocomplete="off"
              ></Input>
            </FormItem>
            <FormItem label="添加时间：">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </FormItem>
            <FormItem label="状态：">
              <Select v-model="searchForm.status" style="width: 188px">
                <Option :value="1">关闭</Option>
                <Option :value="0">启用</Option>
              </Select>
            </FormItem>
            <FormItem label="所属部门：">
              <el-cascader
                :options="data"
                :props="optionProps"
                v-model="searchForm.deptIdT"
                :show-all-levels="false"
                @change="getCheckedNodes"
                clearable
              >
              </el-cascader>
            </FormItem>
            <FormItem>
              <Button @click="search" type="primary" icon="md-search"
              >搜 索</Button
              >
              <Button
                @click="reset('searchForm', true)"
                type="default"
                icon="md-refresh"
                style="margin-left: 10px"
              >重 置
              </Button>
              <Button
                @click="add"
                type="primary"
                icon="md-add"
                style="margin-left: 10px"
              >新增</Button
              >
            </FormItem>
          </Form>
          <Row>
            <Col span="24">
              <Table
                ref="table"
                :columns="columns"
                :data="tableData"
                :height="tableHeight"
                :loading="tableLoading"
              ></Table>
            </Col>
          </Row>
          <Row
            type="flex"
            justify="start"
            align="middle"
            style="padding: 20px 0 100px 0"
          >
            <Col span="24" style="text-align: center">
              <Page
                ref="page"
                show-total
                showSizer
                show-elevator
                :total="dataTotal"
                :current="currentPageNum"
                :page-size="pageSize"
                :page-size-opts="pageSizeArr"
                @on-change="handlePageChange"
                @on-page-size-change="handlePageSizeChange"
              ></Page>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
    <Modal
      v-model="showModal"
      :title="modalTitle"
      width="750"
      footer-hide
      @on-cancel="handleCloseModal"
    >
      <Form
        ref="refModalForm"
        :model="modalForm"
        :rules="rules"
        :label-width="130"
      >
        <FormItem label="问题来源：" prop="name">
          <Input v-model="modalForm.name" placeholder="问题来源" />
        </FormItem>
        <FormItem label="流程定义编号：" prop="processDefinitionId">
          <Select v-model="modalForm.processDefinitionId">
            <Option
              v-for="(item,index) in simpleList"
              :value="item.procDefKey"
              :key="index"
            >{{ item.procDefName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="组织层级：" prop="level">
          <Select v-model="modalForm.level">
            <Option
              v-for="item in levelList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="标签：" prop="label">
          <Select multiple  v-model="modalForm.labelTemp">
            <Option
              v-for="item in labelList"
              :label="item.label"
              :value="item.value"
              :key="item.id"
            >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="当前状态：" prop="status">
          <RadioGroup v-model="modalForm.status">
            <Radio label="0">开启</Radio>
            <Radio label="1">关闭</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="">
          <Button type="default" @click="handleCloseModal">取 消</Button>
          <Button type="primary" @click="handleSubmit" style="margin-left: 20px"
          >确 定
          </Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="showModal1"
      :title="modalTitle"
      width="750"
      footer-hide
      @on-cancel="handleCloseModal1"
    >
      <Form
        ref="refModalForm"
        :model="modalForm"
        :rules="rules"
        :label-width="130"
      >
        <Row>
          <FormItem label="问题来源：" prop="name">
            <Input v-model="modalForm.name" placeholder="问题来源" />
          </FormItem>
        </Row>
        <Row :gutter="24" style="max-height: 450px;overflow-y: auto">
          <Col :span="12">
            <FormItem label="绑定部门：">
              <el-tree
                ref="DeptTree"
                v-if="treeShow"
                class="filter-tree"
                :data="dataTemp"
                :props="defaultProps"
                :highlight-current="true"
                node-key="code"
                :expand-on-click-node="false"
                :current-node-key="searchForm.deptId"
                :filter-node-method="filterNode"
                @node-click="handleNodeClickTemp"
              >
                <span slot-scope="{ node, data }">
                  <span>{{ data.name }}</span>
                  <span v-if="data.number" style="color: red">{{
                    "(" + data.number + ")"
                  }}</span>
                </span>
              </el-tree>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="绑定角色：" prop="role">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="checkAllChange"
              >全部选择
              </el-checkbox>
              <el-tree
                ref="channelTree"
                :key="num"
                :data="smallList"
                show-checkbox
                node-key="id"
                :default-checked-keys="checkList"
                :props="defaultProps"
                @check-change="roleClick"
              >
              </el-tree>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="">
          <Button type="default" @click="handleCloseModal1">取 消</Button>
          <Button type="primary" @click="handleSubmit1" style="margin-left: 20px"
          >确 定
          </Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="showModal2"
      :title="modalTitle"
      width="750"
      footer-hide
      @on-cancel="handleCloseModal2"
    >
      <Form
        ref="refModalForm"
        :model="modalForm"
        :rules="rules"
        :label-width="130"
      >
        <Row>
          <FormItem label="问题来源：" prop="name">
            <Input v-model="modalForm.name" placeholder="问题来源" />
          </FormItem>
        </Row>
        <Row :gutter="24">
          <Col :span="12">
            <FormItem label="绑定部门：">
              <el-tree
                v-if="treeShow"
                class="filter-tree"
                :data="dataTemp"
                :props="defaultProps"
                :highlight-current="true"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                :current-node-key="searchForm.deptId"
                :filter-node-method="filterNode"
                @node-click="handleNodeClickTemp"
                ref="treeTemp"
              >
                <span slot-scope="{ node, data }">
                  <span>{{ data.name }}</span>
                  <span v-if="data.number" style="color: red">{{
                    "(" + data.number + ")"
                  }}</span>
                </span>
              </el-tree>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="绑定角色：" prop="role">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="checkAllChange"
              >全部选择
              </el-checkbox>
              <el-tree
                ref="channelTree1"
                :key="num"
                :data="smallList"
                show-checkbox
                node-key="id"
                :default-checked-keys="checkList"
                :props="defaultProps"
                @check-change="roleClick"
              >
              </el-tree>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="">
          <Button type="default" @click="handleCloseModal2">取 消</Button>
          <Button type="primary" @click="handleSubmit2" style="margin-left: 20px"
          >确 定
          </Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import dateFmt from "@/libs/dateFmt.js";
  import { getDeptTreeList } from "@/api/sizeclass/large";
  import {
    handleList,
    handleAdd,
    handleDelete,
    handleUpdate,
    handleUpdateStatus,
  } from "@/api/question/question";
  import {
    handleProcDefKeyList,
    handleLabelList
  } from "@/api/question/bpm";
  import { listByDept } from "@/api/system/role";

  export default {
    name: "filingConditions",
    watch: {
      filterText(val) {
        console.log('val',val)
        this.$refs.tree.filter(val);
      },
      visibleExcel(newVal) {
        //在弹框打开时默认执行全选方法，
        if (newVal) {
          this.checkAllChange();
        }
      },
    },
    mounted() {
      this.getTreeList();
      this.getLabelList();
      this.search();
      this.getSimpleList(2);
    },

    methods: {
      getSimpleList(value) {
        const param = {
          scope: value,
        };
        handleProcDefKeyList(param).then((response) => {
          this.simpleList = response.data;
        });
      },
      getLabelList(){
        handleLabelList().then((response) => {
          this.labelList = response.data;
        });
      },
      checkAllChange() {
        if (this.checkAll) {
          this.$nextTick(() => {
            //这个如果要默认全选就必须加，否则会报错“setCheckedNodes”未定义
            this.$refs.channelTree.setCheckedNodes(this.smallList);
          });
        } else {
          this.$nextTick(() => {
            //这个如果要默认全选就必须加，否则会报错“setCheckedNodes”未定义
            // this.$refs.channelTree.setCheckedNodes(this.smallList)
            // this.checkList = []
            this.$refs.channelTree.setCheckedNodes([]);
          });
        }
      },
      filterNode(value, data) {
        console.log('data',data)
        console.log('value',value)
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      getCheckedNodes(value) {
        this.searchForm.deptId = value[value.length - 1];
      },
      handleNodeClickTemp(data) {
        debugger
        this.num += 1
        this.deptId = data.id;
        let i = 0;
        this.deptList.forEach((item) => {
          if (item.deptId === this.deptId) {
            i = 1;
            this.checkList = []
            this.checkList.push(...item.roleIds)
          }
        });
        if (i === 0) {
          this.deptList.push({ deptId: this.deptId, roleIds: [],roleInfo:[] });
          this.checkList = []
        }
        listByDept({ deptId: data.id }).then((res) => {
          this.smallList = res.data;
        });
      },
      roleClick(data, checked, indeterminate) {
        console.log("11111",this.deptList)
        console.log('调用roleClick')
        if (checked) {
          console.log('checked')
          if (this.checkList.indexOf(data.id) === -1) {
            console.log('indexOf')
            this.checkList.push(data.id);
            console.log("this.deptListrrrrrr",this.deptList)
            this.deptList.forEach((item) => {
              if (item.deptId === this.deptId) {
                if (item.roleIds.indexOf(data.id) === -1) {
                  item.roleIds.push(data.id);
                }
              }
            });
          }
          console.log('checkedList',this.checkList)
        } else {
          console.log("data.id",data.id)
          console.log("this.checkList",this.checkList)
          console.log("this.deptId",this.deptId)
          console.log("this.checkList.indexOf(data.id)",this.checkList.indexOf(data.id))
          // 这里不知道为什么，取消勾选的时候deptList里的roleids会变成空，所以重新遍历roleInfo把原本的roleIds加上
          // this.deptList.forEach((item) => {
          //   item.roleInfo.forEach(i =>{
          //     if(i.roleId){
          //       item.roleIds.push(i.roleId)
          //     }
          //   })
          // })
          console.log('uuuu',this.deptList)
          this.deptList.forEach((item) => {
            if (item.deptId === this.deptId) {
              console.log('内部',item.roleIds.indexOf(data.id))
              console.log('内部1',data.id)
              console.log('内部2',item)
              item.roleIds.splice(item.roleIds.indexOf(data.id), 1);
            }
          });
          console.log("this.deptList",this.deptList)
          this.checkList.splice(this.checkList.indexOf(data.id), 1);
          console.log('checkedList',this.checkList)
        }
      },
      getTreeList() {
        getDeptTreeList()
          .then((response) => {
            if (response.code == 200) {
              this.data = [response.data];
            } else {
              this.$Message.error(response.msg);
            }
          })
          .catch(() => {
            this.$Message.error("失败！");
          });
      },
      handleSearch() {
        this.tableLoading = true;
        const params = {
          ...this.searchForm,
          pageNo: this.currentPageNum,
          pageSize: this.pageSize,
        };
        if (this.searchForm.dateRange) {
          params.beginCreateTime = this.searchForm.dateRange[0];
          params.endCreateTime = this.searchForm.dateRange[1];
        }
        this.tableData = []
        this.dataTotal = 0
        handleList(params)
          .then((res) => {
            if (res.code == 200) {
              this.tableData = res.data.records || [];
              this.dataTotal = res.data.total || 0;
            } else {
              this.$Message.error({
                content: res.data.msg,
                duration: 2,
              });
            }
            this.tableLoading = false;
          })
          .catch((error) => {
            console.log(error);
            this.tableLoading = false;
            // this.$Message.error({
            //   content: '获取数据失败!',
            //   duration: 2
            // })
          });
      },
      reset(name, flag) {
        // this.$refs[name].resetFields();
        if (flag) {
          this.searchForm = {};
          this.search();
        }
      },
      clearRules() {
        this.$refs["refModalForm"].resetFields();
      },
      search() {
        this.currentPageNum = 1;
        this.pageSize = 10;
        this.handleSearch();
      },
      handlePageChange(pageNum) {
        this.currentPageNum = pageNum;
        this.handleSearch();
      },
      handlePageSizeChange(size) {
        this.currentPageNum = 1;
        this.pageSize = size;
        this.handleSearch();
      },
      add() {
        this.modalTitle = "新增";
        this.formType = 1;
        this.modalForm = {};
        this.dataTemp = this.data;
        this.modalForm.status = "0";
        listByDept({ deptId: this.data[0].id }).then((res) => {
          this.smallList = res.data;
        });
        this.showModal = true;
      },
      handleEditRow(row) {
        this.clearRules();
        this.formType = 2;
        this.checkList = [];
        this.modalTitle = "编辑";
        this.modalForm = { ...row };
        this.modalForm.status = this.modalForm.status.toString();
        this.modalForm.labelTemp = this.modalForm.label.split(',');
        this.deptList = row.deptInfo;
        this.dataTemp = [];
        this.treeShow = false;
        var list = JSON.parse(JSON.stringify(this.data));
        row.deptInfo.forEach((item) => {
          item.roleIds = [];
          if(item.roleInfo){
            this.putNumberLabel(list, item.deptId, item.roleInfo.length);
            item.roleInfo.forEach((i) => {
              item.roleIds.push(i.roleId);
            });
          }
        });
        row.deptInfoSms.forEach((item) => {
          item.roleIds = [];
          if(item.roleInfo){
            // this.putNumberLabel(list, item.deptId, item.roleInfo.length);
            item.roleInfo.forEach((i) => {
              item.roleIds.push(i.roleId);
            });
          }
        });
        this.$nextTick(() => {
          this.dataTemp = list;
          this.treeShow = true;
        });
        this.showModal = true;
      },
      handleEditRow1(row){
        this.clearRules();
        this.formType = 2;
        this.checkList = [];
        this.modalTitle = "编辑";
        this.modalForm = { ...row };
        this.modalForm.status = this.modalForm.status.toString();
        this.modalForm.labelTemp = this.modalForm.label.split(',');
        this.deptList = row.deptInfo;
        this.dataTemp = [];
        this.treeShow = false;
        var list = JSON.parse(JSON.stringify(this.data));
        row.deptInfo.forEach((item) => {
          item.roleIds = [];
          if(item.roleInfo){
            this.putNumberLabel(list, item.deptId, item.roleInfo.length);
            item.roleInfo.forEach((i) => {
              item.roleIds.push(i.roleId);
            });
          }
        });
        row.deptInfoSms.forEach((item) => {
          item.roleIds = [];
          if(item.roleInfo){
            item.roleInfo.forEach((i) => {
              item.roleIds.push(i.roleId);
            });
          }
        });
        console.log("dataTree", this.data);
        this.$nextTick(() => {
          this.dataTemp = list;
          this.treeShow = true;
        });
        this.showModal1 = true;
      },
      handleEditRow2(row){
        this.clearRules();
        this.formType = 2;
        this.checkList = [];
        this.modalTitle = "编辑";
        this.modalForm = { ...row };
        this.modalForm.status = this.modalForm.status.toString();
        this.modalForm.labelTemp = this.modalForm.label.split(',');
        this.deptList = row.deptInfoSms;
        this.dataTemp = [];
        this.treeShow = false;
        var list = JSON.parse(JSON.stringify(this.data));
        row.deptInfo.forEach((item) => {
          item.roleIds = [];
          if(item.roleInfo){
            item.roleInfo.forEach((i) => {
              item.roleIds.push(i.roleId);
            });
          }
        });
        row.deptInfoSms.forEach((item) => {
          item.roleIds = [];
          if(item.roleInfo){
            this.putNumberLabel(list, item.deptId, item.roleInfo.length);
            item.roleInfo.forEach((i) => {
              item.roleIds.push(i.roleId);
            });
          }
        });
        console.log("dataTree", this.data);
        this.$nextTick(() => {
          this.dataTemp = list;
          this.treeShow = true;
        });
        this.showModal2 = true;
      },
      putNumberLabel(tree, id, number) {
        if (tree.length > 0) {
          for (let i = 0; i < tree.length; i++) {
            if (tree[i].id === id) {
              tree[i].number = number;
            } else {
              if (tree[i].children) {
                this.putNumberLabel(tree[i].children, id, number);
              }
            }
          }
        }
      },
      handleCloseModal() {
        this.reset("refModalForm");
        this.modalForm = {};
        this.checkList = [];
        this.smallList = [];
        this.showModal = false;
        this.checkAll = false;
      },
      handleCloseModal1(){
        this.reset("refModalForm");
        this.modalForm = {};
        this.checkList = [];
        this.smallList = [];
        this.showModal1 = false;
        this.checkAll = false;
      },
      handleCloseModal2(){
        this.reset("refModalForm");
        this.modalForm = {};
        this.checkList = [];
        this.smallList = [];
        this.showModal2 = false;
        this.checkAll = false;
      },
      handleSubmit() {
        this.$refs["refModalForm"].validate((valid) => {
          if (valid) {
            if (this.formType === 1) {
              this.modalForm.status = parseInt(this.modalForm.status);
              this.modalForm.label = this.modalForm.labelTemp.join()
              const param = {
                ...this.modalForm,
              };
              handleAdd(param)
                .then((response) => {
                  if (response.code === 200) {
                    this.$Message.success("新增成功!");
                    this.handleCloseModal();
                    this.search();
                    this.getTreeList();
                  } else {
                    this.$Message.error(response.message);
                  }
                })
                .catch((error) => {
                  this.$Message.error("新增失败!");
                  console.log(error);
                });
            } else {
              console.log("b", this.deptList);
              const list = [];
              const list1 = [];
              this.deptList.forEach((item, index) => {
                if (item.roleIds.length > 0) {
                  list.push(index);
                }
              });
              list.forEach((i) => {
                list1.push(this.deptList[i]);
              });
              this.modalForm.status = parseInt(this.modalForm.status);
              this.modalForm.label = this.modalForm.labelTemp.join()
              const param = {
                ...this.modalForm,
                deptInfo: list1,
              };
              console.log("a", list1);
              handleUpdate(param)
                .then((response) => {
                  if (response.code === 200) {
                    this.$Message.success("更新成功!");
                    this.handleCloseModal();
                    this.search();
                    this.getTreeList();
                  } else {
                    this.$Message.error(response.data.message);
                  }
                })
                .catch((error) => {
                  this.$Message.error("更新失败!");
                  console.log(error);
                });
            }
          }
        });
      },
      handleSubmit1(){
        this.$refs["refModalForm"].validate((valid) => {
          if (valid) {
              console.log("b", this.deptList);
              const list = [];
              const list1 = [];
              this.deptList.forEach((item, index) => {
                if (item.roleIds.length > 0) {
                  list.push(index);
                }
              });
              list.forEach((i) => {
                list1.push(this.deptList[i]);
              });
              this.modalForm.status = parseInt(this.modalForm.status);
              const param = {
                ...this.modalForm,
                deptInfo: list1,
              };
              console.log("a", list1);
              handleUpdate(param)
                .then((response) => {
                  if (response.code === 200) {
                    this.$Message.success("更新成功!");
                    this.handleCloseModal1();
                    this.search();
                    this.getTreeList();
                  } else {
                    this.$Message.error(response.data.message);
                  }
                })
                .catch((error) => {
                  this.$Message.error("更新失败!");
                  console.log(error);
                });
          }
        });

      },
      handleSubmit2(){
        this.$refs["refModalForm"].validate((valid) => {
          if (valid) {
            console.log("b", this.deptList);
            const list = [];
            const list1 = [];
            this.deptList.forEach((item, index) => {
              if (item.roleIds.length > 0) {
                list.push(index);
              }
            });
            list.forEach((i) => {
              list1.push(this.deptList[i]);
            });
            this.modalForm.status = parseInt(this.modalForm.status);
            const param = {
              ...this.modalForm,
              deptInfoSms: list1,
            };
            console.log("a", list1);
            handleUpdate(param)
              .then((response) => {
                if (response.code === 200) {
                  this.$Message.success("更新成功!");
                  this.handleCloseModal2();
                  this.search();
                  this.getTreeList();
                } else {
                  this.$Message.error(response.data.message);
                }
              })
              .catch((error) => {
                this.$Message.error("更新失败!");
                console.log(error);
              });
          }
        });

      },
      handleDelRow(row) {
        const param = {
          ids: row.id,
        };
        handleDelete(param)
          .then((response) => {
            if (response.code == 200) {
              this.$Message.success("删除成功！");
              this.handleSearch();
            } else {
              this.$Message.error(response.data.msg);
            }
          })
          .catch(() => {
            this.$Message.error("删除失败！");
          });
      },
      handleChangeStatus(row) {
        const param = {
          ids: row.id,
          status: row.status === 1 ? 0 : 1,
        };
        handleUpdateStatus(param)
          .then((response) => {
            if (response.code == 200) {
              this.$Message.success(response.msg);
              this.handleSearch();
            } else {
              this.$Message.error(response.msg);
            }
          })
          .catch(() => {
            this.$Message.error("修改状态失败！");
          });
      },
    },

    data() {
      return {
        checkAll: false,
        isIndeterminate: true,
        filterText: "",
        data: [],
        dataTemp: [],
        treeShow: true,
        defaultProps: {
          children: "children",
          label: "name",
        },
        optionProps: {
          value: "id",
          label: "name",
          children: "children",
          checkStrictly: true,
        },
        columns: [
          {
            title: "问题来源",
            align: "center",
            key: "name",
            width: 150,
          },
          {
            title: "组织层级",
            align: "center",
            key: "level",
            width: 100,
            render: (h, params) => {
              let level = "";
              if (params.row.level === 1) {
                level = "市级";
              } else if (params.row.level === 2) {
                level = "区级";
              } else if (params.row.level === 3) {
                level = "社区";
              } else if (params.row.level === 4) {
                level = "街道";
              } else if (params.row.level === 5) {
                level = "网格";
              }
              return h("div", level);
            },
          },
          {
            title: "更新人",
            align: "center",
            key: "updater",
            width: 150,
          },

          {
            title: "添加时间",
            align: "center",
            key: "createTime",
            width: 200,
            render: (h, params) => {
              if (params.row.createTime) {
                return h(
                  "div",
                  dateFmt("YYYY-mm-dd HH:MM:SS", new Date(params.row.createTime))
                );
              }
            },
          },
          {
            key: "status",
            title: "状态",
            width: 150,
            align: "center",
            tooltip: true,
            render: (h, params) => {
              let deviceStatus = "";
              if (params.row.status === 0) {
                deviceStatus = "启用";
              } else {
                deviceStatus = "关闭";
              }
              return h("div", [
                h("i-switch", {
                  //数据库1是已处理，0是未处理
                  props: {
                    type: "primary",
                    value: params.row.status === 0, //控制开关的打开或关闭状态，官网文档属性是value
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    "on-change": (value) => {
                      //触发事件是on-change,用双引号括起来，
                      //参数value是回调值，并没有使用到
                      this.handleChangeStatus(params.row); //params.index是拿到table的行序列，可以取到对应的表格值
                    },
                  },
                }),
                h(
                  "span",
                  {
                    style: {
                      marginLeft: "5px",
                    },
                  },
                  deviceStatus
                ),
              ]);
            },
          },
          {
            key: "processDefinitionName",
            title: "绑定流程",
            align: "center",
            tooltip: true
          },
          // {
          //   key: "roleInfo",
          //   title: "绑定部门角色",
          //   align: "center",
          //   tooltip: true,
          //   render: (h, params) => {
          //     let deviceStatus = "";
          //     params.row.deptInfo.forEach((i) => {
          //       if (i.roleInfo || i.roleInfo.length > 0) {
          //         deviceStatus = deviceStatus + i.deptName + "：";
          //         if (i.roleInfo[0].roleId === 0) {
          //           deviceStatus = deviceStatus + "所有角色";
          //         } else {
          //           i.roleInfo.forEach((item) => {
          //             if (item.roleName) {
          //               deviceStatus = deviceStatus + item.roleName + " ";
          //             }
          //           });
          //         }
          //       }
          //       deviceStatus += "<br>";
          //     });
          //     let value = deviceStatus
          //     if (typeof value === 'undefined' || value === null || value === '') {
          //       value = '--'
          //     }else if(value && value.length > 20) {
          //       value = value.slice(0, 20) + ' ' + '...'
          //     }
          //     return h('div', [
          //       h('span', {
          //         style: {
          //           display: 'inline-block',
          //           width: '100%'
          //         },
          //         domProps: {
          //           title: deviceStatus
          //         }
          //       }, value)
          //     ])
          //   },
          // },
          {
            key: "handle",
            title: "操作",
            align: "center",
            width: 400,
            fixed: "right",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small",
                    },
                    style: {
                      margin: "0 5px",
                    },
                    on: {
                      click: () => {
                        this.handleEditRow(params.row);
                      },
                    },
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "warning",
                      size: "small",
                    },
                    style: {
                      margin: "0 5px",
                      type: "text"
                    },
                    on: {
                      click: () => {
                        this.handleEditRow1(params.row);
                      },
                    },
                  },
                  "上报策略"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small",
                    },
                    style: {
                      margin: "0 5px",
                    },
                    on: {
                      click: () => {
                        this.handleEditRow2(params.row);
                      },
                    },
                  },
                  "短信策略"
                ),
                h(
                  "Poptip",
                  {
                    props: {
                      confirm: true,
                      title: "确定删除该条数据？",
                      transfer: true,
                    },

                    on: {
                      "on-ok": () => {
                        this.handleDelRow(params.row);
                      },
                    },
                  },
                  [
                    h(
                      "Button",
                      {
                        style: {
                          margin: "0 5px",
                        },
                        props: {
                          type: "error",
                          size: "small",
                          placement: "top",
                        },
                      },
                      "删除"
                    ),
                  ]
                ),
              ]);
            },
          },
        ],
        tableData: [],
        tableHeight: "auto",
        tableLoading: false,
        dataTotal: 0,
        pageSizeArr: [10, 20],
        pageSize: 10,
        currentPageNum: 1,
        searchForm: {
          name: null,
          key: null,
        },
        num:1,
        rules: {
          name: [
            {
              required: true,
              message: "流程名称不可为空",
              trigger: "blur",
              type: "string",
            },
          ],
          processDefinitionId: [
            {
              required: true,
              message: "流程定义不可为空",
              trigger: "blur",
              type: "string",
            },
          ],
          level: [
            {
              required: true,
              message: "组织层级不可为空",
              trigger: "change",
              type: "number",
            },
          ],
          status: [
            {
              required: true,
              type: "string",
              message: "状态不能为空",
              trigger: "change",
            },
          ],
        },
        selectId: '',
        showModal: false,
        showModal1: false,
        showModal2: false,
        modalTitle: "",
        modalForm: {
          name: "",
        },
        // 1.新增 2.编辑 3.查看
        formType: 1,
        rowData: {},
        deptList: [],
        deptId: null,
        smallList: [],
        checkList: [],
        simpleList: [],
        labelList: [],
        levelList: [
          {
            id: 1,
            name: "市级",
          },
          {
            id: 2,
            name: "区级",
          },
          {
            id: 3,
            name: "社区",
          },
          {
            id: 4,
            name: "街道",
          },
          {
            id: 5,
            name: "网格",
          },
        ],
      };
    },
  };
</script>

<style scoped>
  /deep/ .el-table .cell {
    white-space: pre-line;
  }
</style>
