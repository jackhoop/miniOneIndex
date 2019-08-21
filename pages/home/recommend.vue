<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="false"><block slot="backText"></block><block slot="content">推荐</block></cu-custom>
		<img-item :list="list" @click="select_image"></img-item>
		<view class="cu-load" :class="!isLoad?'loading':'over'"></view>
	</view>
</template>

<script>
	import imgItem from '@/colorui/components/image-item.vue'
	import homeApi from '@/api/home.js'
	import rootApi from '@/api/root.js'
	export default {
		components: {
			imgItem,
		},
		data() {
			return {
				list:[],
				oldList:[],
				nextLink:'',
				shareItem:{},
				isLoad:false,
			}
		},
		onLoad() {
			this.get_List();
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.cleanDate();
			this.get_List("refresh")
		},
		// 上拉加载
		onReachBottom: function(){
			if(this.nextLink&&this.isLoad){
				this.isLoad = false;
				this.nextPage();
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自页面内分享按钮
			  return;
			}
			return {
			   title: this.shareItem.name.substring(0,this.shareItem.name.lastIndexOf("__")).substring(this.shareItem.name.indexOf("__")+2,this.shareItem.name.length),
			   path:"/pages/home/view_image?imgType="+this.shareItem.type+"&folderName="+this.shareItem.folderName,
			   imageUrl:this.shareItem.thumbnails[0].large.url
			}
		},
		methods: {
			share(e){
				this.shareItem =e.item;
			},
			cleanDate(){
				this.oldList=[];
				this.list=[];
				this.nextLink='';
			},
			select_image(e){
				uni.navigateTo({
					url:"/pages/home/view_image?imgType="+e.item.type+"&folderName="+e.item.folderName
				})
			},
			nextPage(){
				const _this =this;
				rootApi.nextPage(this.nextLink).then(res => {
					this.oldList = _this.oldList.concat(res.value);
					_this.list = this.transformList(this.oldList);
					_this.nextLink = res['@odata.nextLink'];
					this.isLoad = true;
				})
			},
			get_List(type){
				const _this =this;
				this.isLoad = false;
				homeApi.get_new("推荐").then(res => {
					if(res.code=="201"){
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
						_this.isLoad = true;
						return;
					}
					this.oldList = res.value;
					_this.list = _this.list.concat(this.transformList(this.oldList));;
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

</style>

