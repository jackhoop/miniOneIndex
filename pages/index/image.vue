<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true"><block slot="backText"></block><block slot="content">{{title}}</block></cu-custom>
		<!-- <file-item :list="list" @onClick="onClick"></file-item> -->
		<!-- <waterfall-flow :list="list" :loading="loading" @click="choose"></waterfall-flow> -->
		<imgItem :list="list"></imgItem>
		<view class="cu-load" :class="!isLoad?'loading':'over'"></view>
	</view>
</template>

<script>
	import imgItem from '@/colorui/components/image-item.vue'
	import formatDate from '@/colorui/components/formatDate.vue'
	import rootApi from '@/api/root.js'
	export default {
		components: {
			imgItem,
			formatDate
		},
		data() {
			return {
				list:[],
				oldList:[],
				id:'',
				title:'',
				nextLink:'',
				isLoad:false,
			}
		},
		onLoad(e) {
			this.title = e.name;
			this.id = e.id;
			this.getDrives(this.id)
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.getDrives(this.id,"refresh")
		},
		// 上拉加载
		onReachBottom: function(){
			if(this.nextLink&&this.isLoad){
				this.isLoad = false;
				this.nextPage();
			}
		},
		methods: {
			navigateTo(url){
				uni.navigateTo({
					url:url
				})
			},
			onClick(e){
				let item =  e.item;
				this.item = item;
				let type = this.fileType(item)
				switch(type) {
					 case "folder":
						this.navigateTo("/pages/index/folder?id="+e.item.id+"&name="+item.name);
						break;
					 case "video":
					  	this.showModel();
						return; 
					 	this.$store.commit("setItem",item);
						this.navigateTo("/pages/index/video?id="+item.id+"&name="+item.name);
						break;
					case "image":
						this.previewImage(item);
						break;
					case "pptx":
						//this.file_download("open");
						break;
					 default:
						
				} 
			},
			previewImage(item){
				 // 预览图片
				uni.previewImage({
					urls: [item['@microsoft.graph.downloadUrl']],
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {

						},
						fail: function(err) {

						}
					}
				});
			},
			nextPage(){
				const _this =this;
				rootApi.nextPage(this.nextLink).then(res => {
					this.oldList = _this.oldList.concat(res.value);
					const newList = [].concat(...(Array.from(this.oldList.reduce((total, cur, index) => {
					  total[index % 2].push(cur)
					  return total
					}, { 0: [], 1: [], length: 2 }))))

			
					_this.list = newList;
					_this.nextLink = res['@odata.nextLink'];
					this.isLoad = true;
				})
			},
			getDrives(id,type){
				const _this =this;
				this.isLoad = false;
				if(type=="refresh"){
					_this.list=[];
				}
				rootApi.get_drives(id).then(res => {
					this.oldList = res.value;
					const newList = [].concat(...(Array.from(res.value.reduce((total, cur, index) => {
					  total[index % 2].push(cur)
					  return total
					}, { 0: [], 1: [], length: 2 }))))

					_this.list = newList;
					_this.nextLink = res['@odata.nextLink'];
					this.isLoad = true;
					if(type=="refresh"){
						uni.hideNavigationBarLoading();
						uni.stopPullDownRefresh();//得到数据后停止下拉刷新
					}
				})
			}
		}
	}
</script>

<style>
.cu-avatar {
	font-variant: small-caps;
	margin: 0;
	padding: 0;
	display: inline-flex;
	text-align: center;
	justify-content: center;
	align-items: center;
	background-color: #FFF;
	color: #fff;
	white-space: nowrap;
	position: relative;
	width: 64upx;
	height: 64upx;
	background-size: cover;
	background-position: center;
	vertical-align: middle;
	font-size: 1.5em;
}
</style>