<script>
	import Vue from 'vue'
	import tokenApi from '@/api/token.js'
	export default {
		onLaunch: function() {
			this.init();
			this.refreshToken();
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
			
					// #ifdef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif
				}
			})
		},
		onShow: function() {

		},
		onHide: function() {

		},
		methods: {
			init(){
				if (!wx.cloud) {
				  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
				} 
				else {
				 wx.cloud.init({
				   env: this.$store.state.env,
				   traceUser:true
				 })
				}
				
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "colorui/oneindex.css";
</style>
