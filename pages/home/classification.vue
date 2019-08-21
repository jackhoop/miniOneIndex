<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="false"><block slot="backText"></block><block slot="content">分类</block></cu-custom>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==TabCur?'text-orange cur':''" v-for="(item,index) in tabs" :key="index" @tap="tab_select" :data-id="index">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<img-item :list="list" type="class" @click="select_image"></img-item>
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
				TabCur: 0,
				scrollLeft: 0,
				tabs:[],
				list:[],
				oldList:[],
				shareItem:{},
				nextLink:'',
				isLoad:false,
			}
		},
		onLoad() {
			this.get_type();
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.cleanDate();
			this.get_type("refresh");
			// this.get_List("refresh")
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
				//this.shareItem =e.item;
				console.log("aaaaaa")
			},
			cleanDate(){
				this.oldList=[];
				this.list=[];
				this.nextLink='';
			},
			tab_select(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.cleanDate();
				this.get_List();
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
			get_type(type){
				const _this =this;
				this.isLoad = false;
				_this.tabs=[];
				homeApi.get_type().then(res => {
					res.value.forEach(item =>{
						if(!item.name.endsWith("-隐藏")){
							let arr = item.name.split('-');
							let tab={
								name:arr[1],
								id:item.id,
							}
							_this.tabs.push(tab)
						}
					});
					this.get_List(type);
				})
			},
			get_List(type){
				const _this =this;
				_this.isLoad = false;
				if(!this.tabs[this.TabCur].id){
					this.TabCur=0;
				}
				homeApi.get_images(this.tabs[this.TabCur].id).then(res => {
					if(res.code=="201"){
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
						_this.isLoad = true;
						return;
					}
					_this.oldList = res.value;
					_this.list = _this.list.concat(_this.transformList(_this.oldList));;
					_this.nextLink = res['@odata.nextLink'];
					_this.isLoad = true;
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

