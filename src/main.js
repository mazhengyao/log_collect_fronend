import Vue from 'vue'
import App from './App.vue'
import log_form from "./components/log_form";
import transform_div from "./components/transform_div";
import VueRouter from "vue-router"; // 引入路由
import axios from 'axios'
import echarts from 'echarts'
import mammoth from 'mammoth'
import EditChart from "./EditChart";
import DragChart from "./DragChart";
import LogCollect from "./LogCollect";

Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
Vue.prototype.$mammoth = mammoth

Vue.use(VueRouter) // 使用中间件使用路由

Vue.component('transform_div',transform_div)
Vue.component('log_form',log_form)

const router = new VueRouter({
  routes: [
    {
      path: '/log_form',
      component: log_form
    },
    {
      path: '/transform_div',
      component: transform_div
    },
    {
      path: '/editchart',
      name: 'EditChart',
      component: EditChart,
    },
    {
      path: '/dragchart',
      name: 'DragChart',
      component: DragChart,
    },
    {
      path: '/logcollect',
      name: 'LogCollect',
      component: LogCollect,
    },
  ]
})

new Vue({
  el: '#app',
  router, // 将定义好的路由router应用到全局
  render: h => h(App)
})
