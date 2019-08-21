import request from '@/common/request'
var tokenUrl="https://login.microsoftonline.com/common/oauth2/v2.0/token"
const token="cf53b4e85350cc5aa58234ce9d759128";
export default {
  refresh_token(map = {}) {
    return new Promise((resolve, reject) => {
      request.post(tokenUrl, map).then(response => {
        resolve(response)
      })
    })
  },
  get_token(map = {}){
	  return new Promise((resolve, reject) => {
	    wx.cloud.callFunction({
			name:"token",
			data: {
				type: "getType",
			},
		}).then(res => {
			resolve(res);
	    }).catch(err => {
		  console.log(err)
	      resolve(err);
	    })
	  })
  },
  urlCreate(map = {}) {
    return new Promise((resolve, reject) => {
      request.post("https://dwz.cn/admin/v2/create", map).then(response => {
        resolve(response)
      })
    })
  }
}