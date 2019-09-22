import Vue from 'vue'
import App from './App'
import uniRequest from '@/utils/uni-request';

Vue.prototype.serverUrl = "http://172.16.1.112:7001";
Vue.config.productionTip = false
uniRequest.defaults.baseURL = "http://172.16.1.112:7001";
uniRequest.defaults.headers.common['Authorization'] = uni.getStorageSync('token');
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
