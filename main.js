import Vue from 'vue'
import App from './App'

import store from '@/common/store'
import tokenApi from '@/api/token.js'

Vue.prototype.$store = store;

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)



Vue.prototype.refreshToken = async function(){
	const _this =this;
	tokenApi.get_token().then(res => {
		let token = {
			access_token:res.result.access_token,
			access_token:res.result.access_token,
		} 
		uni.setStorageSync("access_token",res.result.access_token);
		this.$store.commit("setToken",token);
		setTimeout(function(){
		  _this.refreshToken();
		},res.result.expires_in*1000)
	})
}

Vue.prototype.transformList = function(list){
	const newList = [].concat(...(Array.from(list.reduce((total, cur, index) => {
	  total[index % 2].push(cur)
	  return total
	}, { 0: [], 1: [], length: 2 }))))
	return newList;
}

Vue.prototype.fileType = function(item){
	if(item.folder){
		return 'folder';
	}else if(item.file.mimeType.startsWith('video')){
		return 'video'
	}else if(item.file.mimeType.startsWith('image')){
		return 'image'
	}else if(item.file.mimeType=='application/msword'||item.file.mimeType=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
		return 'word'
	}else if(item.file.mimeType=='application/vnd.ms-powerpoint'||item.file.mimeType=='application/vnd.openxmlformats-officedocument.presentationml.presentation'){
		return 'pptx'
	}else if(item.file.mimeType=='application/vnd.ms-excel'||item.file.mimeType=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
		return 'xlsx'
	}else if(item.file.mimeType=='application/zip'){
		return 'zip'
	}else if(item.file.mimeType=='audio/mpeg'){
		return 'mp3'
	}else if(item.file.mimeType=='application/pdf'){
		return 'pdf'
	}else if(item.file.mimeType=='text/plain'){
		return 'txt'
	}
	return 'other'
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
