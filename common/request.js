// common/request.js

// H5版本
// #ifdef H5
import Fly from 'flyio/dist/npm/fly'
// #endif

//微信小程序和APP版本
// #ifndef H5
import Fly from 'flyio/dist/npm/wx'
// #endif

const request = new Fly();

import store from '@/common/store'

request.interceptors.request.use((request) => {


	// request.headers = {
 //        'Content-Type': 'application/json'
 //    };
 
	 request.headers = {
		 'Content-Type': 'application/x-www-form-urlencoded'
	 };
	 
	if(request.url=="https://dwz.cn/admin/v2/create"){
		request.headers = {
		   'Content-Type': 'application/json',
		   'Token':"cf53b4e85350cc5aa58234ce9d759128"
		 };
	}
	
	request.baseURL = 'https://graph.microsoft.com/v1.0/me/drive';
	const token = uni.getStorageSync("access_token");
	request.headers["Authorization"] = token;
	//防止缓存
	if (request.method === 'POST' && request.headers['Content-Type'] !== 'multipart/form-data') {
		// request.body = {
		// 	...request.body,
		// 	_t: Date.parse(new Date()) / 1000
		// }
	} else if (request.method === 'GET') {
		request.params = {
			_t: Date.parse(new Date()) / 1000,
			...request.params
		}
	}
	return request
})

request.interceptors.response.use(function(response) { //不要使用箭头函数，否则调用this.lock()时，this指向不对 
	let errmsg = '';
	const data = response.data;
	if (!data || typeof data !== 'object') {
		errmsg = '服务器响应格式错误';
		uni.showToast({
			title: errmsg,
			icon: 'none'
		})
		
	}
// 	else {
// 		const errno = data.errno;
// 		switch (errno) {
// 			case 1001:
// 				// 数据检验未通过
// 				for (let i in data.data) {
// 					errmsg += data.data[i] + ';'
// 				}
// 				break;
// 			default:
// 				errmsg = data.message;
// 				break
// 		}
// 		if (errmsg !== '' && errno !== 0) {
// 			uni.showToast({
// 				title: errmsg,
// 				icon: 'none'
// 			})
// 		}
// 		if (errmsg !== '' && errno === 0) {
// 			uni.showToast({
// 				title: errmsg,
// 				icon: 'none'
// 			})
// 		}
// 	}
	
//	uni.hideLoading();
	return response.data; //只返回业务数据部分
}, function(err) {
	// console.log("error-interceptor:" + JSON.stringify(err))
	let errmsg = err.message;
	switch (err.status) {
		case 0:
			errmsg = "网络连接错误";
			uni.showToast({
				title: errmsg,
				icon: 'none'
			})
			break;
		case 404:
			return Promise.resolve({
				code:"201",
				message:"找不到文件"
			})
			break;
		case 401:
			return Promise.resolve({
				code:"201",
				message:"token过期"
			})
			break;
		default:
			uni.showToast({
				title: errmsg,
				icon: 'none'
			})
	}
})
export default request
export {
	request
}
