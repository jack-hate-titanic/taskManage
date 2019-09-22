import Vue from 'vue'
import App from './App'
import uniRequest from '@/utils/uni-request';

const baseURL='http://192.168.43.36:7001'
Vue.prototype.serverUrl = baseURL;
Vue.config.productionTip = false
uniRequest.defaults.baseURL = baseURL;
uniRequest.defaults.headers.common['Authorization'] = uni.getStorageSync('token');
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
