<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="false"><block slot="backText"></block><block slot="content">最新</block></cu-custom>
		<img-item :list="list" @click.stop="select_image"></img-item>
		<view class="cu-load" :class="!isLoad?'loading':'over'"></view>
		
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-list menu sm-border">
					<view class="cu-item">
						<view class="content">
							<text class="text-grey">复制下载地址</text>
						</view>
					</view>
					<view class="cu-item">
						<view class="content">
							<text class="text-grey">分享</text>
						</view>
					</view>
					<view class="cu-item margin-top-xs" style="min-height:80upx;" @tap="hideModal">
						<view class="content">
							<text class="">取消</text>
						</view>
					</view>
				</view>
			</view>
		</view>
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
		computed: {
		    isToken() {
		        return this.$store.state.token.access_token
		    }
		},
		watch:{
		    isToken(val,oldVal) {
			   if(this.list.length==0){
					this.get_List();
			   }
		    }
		},
		data() {
			return {
				list:[],
				oldList:[],
				nextLink:'',
				shareItem:{},
				modalName: null,
				isLoad:false,
			}
		},
		onLoad() {
			if(this.$store.state.token.access_token){
				this.get_List();
			}
		},
		onShareAppMessage(res) {
			console.log("onShareAppMessage")
			if (res.from === 'menu') {// 来自页面内分享按钮
			  return;
			}
			return {
			   title: this.shareItem.name.substring(0,this.shareItem.name.lastIndexOf("__")).substring(this.shareItem.name.indexOf("__")+2,this.shareItem.name.length),
			   path:"/pages/home/view_image?imgType="+this.shareItem.type+"&folderName="+this.shareItem.folderName,
			   imageUrl:this.shareItem.thumbnails[0].large.url
			}
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
		methods: {
			share(e){
				this.shareItem =e.item;
				this.modalName ="bottomModal";
			},
			hideModal(e) {
				this.modalName = null
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
				homeApi.get_new("最新").then(res => {
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
