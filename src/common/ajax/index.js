import axios from "axios";
import { apiBaseURL } from "../const/env";
import chain from "../../store/chain";
import { Toast } from "antd-mobile";
axios.defaults.baseURL = apiBaseURL;
//添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    if (config.method === "post") {
      // post请求时，处理数据
      // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      //config.data = qs.stringify( {
      //   ...config.data //后台数据接收这块需要以表单形式提交数据，而axios中post默认的提交是json数据,所以这里选用qs模块来处理数据，也有其他处理方式，但个人觉得这个方式最简单好用
      //})
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  function (response) {
    if (response.status === 200) {
      // 请求发送成功
      if (response.data.code === 0) {
        // 请求返回数据异常
        if (response.data.msg === "signuature error") {
          chain.setToken("");
          return Promise.reject("sign expired");
        }
      }
      return response.data;
    }
  },
  function (error) {
    // Toast.fail("network error");
    return Promise.reject(error);
  }
);

export default axios;
