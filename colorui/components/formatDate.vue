<template>
	<text>{{dateStr}} {{sizeStr}}</text>
</template>

<script>
	import moment from 'moment/moment'
	
	export default {
		name: 'FormatDate',
		props: {
			date: {
				type: [String],
				default:new Date().toString()
			},
			size: {
				type: [Number],
			},
			fmt: {
				type: [String],
				default: 'YYYY-MM-DD HH:mm:ss'
			}
		},
		data() {
			return {
				dateStr: '',
				sizeStr: ''
			}
		},
		created() {
			this.dateStr = moment(this.date).format(this.fmt);
			if(this.size!=0){
				this.sizeStr=" • "+this.readablizeBytes(this.size);
			}
			
		},
		methods: {
		   readablizeBytes(bytes) {
				var s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
				var e = Math.floor(Math.log(bytes)/Math.log(1024));
				return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
		   },
		  formatDate(date, fmt){
			   date = new Date(date);
			   if (/(y+)/.test(fmt)) {
			      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
			  }
			  let o = {
			      'M+': date.getMonth() + 1,
			      'd+': date.getDate(),
			      'h+': date.getHours(),
			      'm+': date.getMinutes(),
			      's+': date.getSeconds()
			  };
			  for (let k in o) {
			      if (new RegExp(`(${k})`).test(fmt)) {
			          let str = o[k] + '';
			          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
			      }
			  }
			  return fmt;
		  },
		  padLeftZero(str){
			 return ('00' + str).substr(str.length); 
		  }
		}
	}
</script>

<style>
</style>
