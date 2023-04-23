import request from "@/utils/requestDJLD";
import request1 from "@/utils/request";
// 获取审批意见列表
export function getApprovalViewList() {
  return request.get("/comDjldPlatform/approveView/list");
}
// 新增审批意见
export function createView(view) {
  return request({
    url: "/comDjldPlatform/approveView/create",
    method: "post",
    data: {
      type: 1,
      view,
    },
  });
}

// 修改审批意见
export function updateView(view, id) {
  return request({
    url: "/comDjldPlatform/approveView/update",
    method: "post",
    data: {
      type: 1,
      view,
      id: id,
    },
  });
}

// 删除审批意见
export function deleteView(id) {
  return request({
    url: "/comDjldPlatform/approveView/delete?id=" + id,
    method: "post",
  });
}

// 删除上传文件
export function deleteFile(id) {
  return request({
    url: "/comDjldPlatform/register-material/fdfsDelete?fileId=" + id,
    method: "post",
  });
}

// 获取大类
export function getBigClass() {
  return request.get("/comDjldPlatform/bass-class-config/getList");
}

// 获取小类立案名称列表
export function getBigSmallFiling(parentId) {
  return request.get(
    "/comDjldPlatform/bass-class-config/getListFor?parentId=" + parentId
  );
}

// 获取立案名称id获取立案条件
export function getFilingCondition(id) {
  return request.get(
    "/comDjldPlatform/filing-condition/getInfor?filingId=" + id
  );
}

// 字典表 事件类型，主题，兴趣点 question_type 事件类型 topic 事件主题 interest 兴趣点
export function getDictData(type) {
  return request1.get("/system/dict-data/listByType?type=" + type);
}

// 获取立案名称id获取考核单位
export function getUnitByFilingId(id) {
  return request.get(
    "/comDjldPlatform/class-unit/getUnitByClass?classId=" + id
  );
}

// 获取所属区域
export function getAreaTree() {
  return request.get("/comDjldPlatform/dept/queryArea");
}

// 获取处置人员
export function getDeptUser(deptId, problemOrigin) {
  return request.get(
    `/comDjldPlatform/register-info/getDeptDisposer?deptId=${deptId}&problemOrigin=${problemOrigin}`
  );
}

// upload

export function upload(formData) {
  return request.post("/comDjldPlatform/register-material/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function downLoad(fileId) {
  return request.get(
    `/comDjldPlatform/register-material/download?fileId=${fileId}&isOnLine=true`
  );
}

// 获取事件来源

export function problemSourceList() {
  return request.get(`/problemSource/simpleList?bpmFlag=0`);
}

export function problemSourceList1() {
  return request.get(`/problemSource/simpleList`);
}
export function problemSourceList2() {
  return request.get(`/problemSource/simpleList?bpmFlag=2`);
}

// 提交
export function reportProblem(formData) {
  return request({
    url: "/comDjldPlatform/app/reportProblem",
    method: "post",
    data: formData,
  });
}

// 暂存
export function handleTemporarySave(formData) {
  return request({
    url: "/pc/storeReportProblem",
    method: "post",
    data: formData,
  });
}

// 暂存保存
export function handleTemporarySaveInfo(formData) {
  return request({
    url: "/pc/activeStoreProblem",
    method: "post",
    data: formData,
  });
}

//批转 回退
export function handleSave(formData) {
  return request({
    url: "/comDjldPlatform/app/handleSave",
    method: "post",
    data: formData,
  });
}

//根据来电号码获取历史工单
export function getHistoryList(phone, pageNo, pageSize, status) {
  return request({
    url: `/comDjldPlatform/app/historyByPhone?pageNo=${pageNo}&pageSize=${pageSize}&phone=${phone}&status=${status}`,
    method: "get",
  });
}

// 根据问题来源id、节点获得可操作的异常流程操作类型
export function getOperationByPSIdandNode(problemSourceId, eventNode) {
  return request({
    url: `/errorApplyBind/getOperationByPSIdandNode?problemSourceId=${problemSourceId}&eventNode=${eventNode}`,
    method: "get",
  });
}

// 根据caseNo,deptEditPermission获取所属区域下拉列表
export function queryAreaInHandle(caseNo,deptEditPermission) {
  return request({
    url: `/comDjldPlatform/dept/queryAreaInHandle?caseNo=${caseNo}&deptEditPermission=${deptEditPermission}`,
    method: "get",
  });
}

//异常子流程发起
export function errorApply(data) {
  return request({
    url: "/errorApply/start",
    method: "post",
    data,
  });
}
// 获取考核单位
export function getAssessmentUnit() {
  return request({
    url: `/comDjldPlatform/dept/getAssessmentUnit`,
    method: "get",
  });
}

// 根据考核单位获取大小类列表
export function getByAssessmentUnitId(param) {
  return request({
    url: `/comDjldPlatform/bass-class-config/getByAssessmentUnitId`,
    method: "get",
    params: param,
  });
}
