import Vue from "vue";

import Cookies from "js-cookie";
import 'lib-flexible'
import Element from "element-ui";
import "./assets/styles/element-variables.scss";

import iView from "view-design";
import "view-design/dist/styles/iview.css";

import "@/assets/styles/index.scss"; // global css
import "@/assets/styles/ruoyi.scss"; // ruoyi css
import App from "./app";
import store from "./store";
import router from "./router";
import directive from "./directive"; // directive
import plugins from "./plugins"; // plugins

import "./assets/icons"; // icon
import "./permission"; // permission control
import "./tongji"; // 百度统计
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/infra/config";
import {
  parseTime,
  resetForm,
  addDateRange,
  addBeginAndEndTime,
  handleTree,
} from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
// 自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar";
// 代码高亮插件
// import hljs from 'highlight.js'
// import 'highlight.js/styles/github-gist.css'
import {
  DICT_TYPE,
  getDictDataLabel,
  getDictDatas,
  getDictDatas2,
} from "@/utils/dict";
import less from "less";
import AFTableColumn from "af-table-column";

import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
Vue.prototype.$zhCN = zhCN;

Vue.use(AFTableColumn);

window._AMapSecurityConfig = {
  securityJsCode: "4eae032197233a4ce51c21a3a0f737ba", // 输入你的jscode
};

// 全局方法挂载
Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.addBeginAndEndTime = addBeginAndEndTime;
Vue.prototype.getDictDatas = getDictDatas;
Vue.prototype.getDictDatas2 = getDictDatas2;
Vue.prototype.getDictDataLabel = getDictDataLabel;
Vue.prototype.DICT_TYPE = DICT_TYPE;
Vue.prototype.handleTree = handleTree;

// 全局组件挂载
Vue.component("DictTag", DictTag);
Vue.component("DocAlert", DocAlert);
Vue.component("Pagination", Pagination);
Vue.component("RightToolbar", RightToolbar);
// 字典标签组件
import DictTag from "@/components/DictTag";
import DocAlert from "@/components/DocAlert";
// 头部标签插件
import VueMeta from "vue-meta";

Vue.use(directive);
Vue.use(plugins);
Vue.use(VueMeta);
Vue.use(less);
// Vue.use(hljs.vuePlugin);

// bpmnProcessDesigner 需要引入
import MyPD from "@/components/bpmnProcessDesigner/package/index.js";
Vue.use(MyPD);
import "@/components/bpmnProcessDesigner/package/theme/index.scss";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

// Form Generator 组件需要使用到 tinymce
import Tinymce from "@/components/tinymce/index.vue";
import "ant-design-vue/dist/antd.css";
import Antd from "ant-design-vue";

Vue.component("tinymce", Tinymce);
import "@/icons";
import axios from "axios";
Vue.prototype.$axios = axios;
import "@/styles/index.scss";

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
Vue.use(iView);
Vue.use(Element, {
  size: Cookies.get("size") || "medium", // set element-ui default size
});
Vue.use(Antd);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  router,
  store,
  render: (h) => h(App),

});
