<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true"><block slot="backText"></block><block slot="content">{{title}}</block></cu-custom>
		<!-- <img-item :list="list" @onClick="onClick"></img-item> -->
		<!-- <file-item :list="list" @onClick="onClick"></file-item> -->
		<view class="cu-list menu-avatar sm-border">
			<view class="cu-item solid-bottom" @tap="onClick" :data-index="index" v-for="(item,index) in list" :key="index">
					<view  class="cu-avatar lg folder" v-if="item.folder" />
					<view  class="cu-avatar lg" v-else-if="fileType(item)=='image'"  :style="'background-image:url('+item.thumbnails[0].small.url+')'"/>
					<view  class="cu-avatar lg" v-else-if="fileType(item)=='video'"  :style="'background-image:url('+item.thumbnails[0].small.url+')'">
						<view class="cu-tag video cuIcon-playfill iconfont icon-bofang2 text-cyan"></view>
					</view>
					<view class="cu-avatar lg docx" v-else-if="fileType(item)=='word'"/>
				    <view class="cu-avatar lg docx" v-else-if="fileType(item)=='word'"/>
				    <view  class="cu-avatar lg pptx" v-else-if="fileType(item)=='pptx'"/>
				    <view  class="cu-avatar lg xlsx" v-else-if="fileType(item)=='xlsx'"/>
				    <view  class="cu-avatar lg zip" v-else-if="fileType(item)=='zip'"/>
				    <view class="cu-avatar lg mp3" v-else-if="fileType(item)=='mp3'"/>
				    <view  class="cu-avatar lg pdf" v-else-if="fileType(item)=='pdf'"/>
					<view  class="cu-avatar lg txt" v-else-if="fileType(item)=='txt'"/>
					<view  class="cu-avatar lg other" v-else/>
				<view class="content" >
					<view class="text-df text-cut">{{item.name}}</view>
					<view class="text-grey text-sm flex">
						<view class="text-cut">
							<text class="cuIcon-infofill text-red  "></text>
							<formatDate :size="item.size" :date="item.lastModifiedDateTime" :fmt="'YYYY-MM-DD'"/>
						</view> </view>
				</view>
				<view class="action"  v-if="!item.folder" @click.stop="more" :data-index="index">
					<text class="iconfont icon-gengduo10 text-grey text-right"></text>
				</view>
			</view>
		</view>
	
		<view class="cu-load" :class="!isLoad?'loading':'over'"></view>
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">音乐播放</view>
					<view class="action" @tap="hideModal">
						<text class="iconfont icon-guanbi6 text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<imt-audio :src="src" :duration="duration"></imt-audio>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-list menu sm-border">
					<view class="cu-item" @tap="copyAddress">
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
	import formatDate from '@/colorui/components/formatDate.vue'
	import imtAudio from '@/colorui/components/imt-audio.vue'
	import rootApi from '@/api/root.js'
	import tokenApi from '@/api/token.js'
	export default {
		components: {
			imgItem,
			imtAudio,
			formatDate
		},
		data() {
			return {
				list:[],
				id:'',
				index:null,
				item:{},
				title:'',
				nextLink:'',
				isLoad:false,
				modalName: null,
				src:'',
				duration:null
			}
		},
		onLoad(e) {
			this.title = e.name;
			this.id = e.id;
			this.getDrives(this.id)
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.cleanDate();
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
			cleanDate(){
				this.list=[];
				this.nextLink='';
			},
			copyAddress(){
				let item = this.list[this.index];
				tokenApi.urlCreate({
					Url:item['@microsoft.graph.downloadUrl'],
				}).then(res => {
					let url = item['@microsoft.graph.downloadUrl'];
					if(res.Code==0){
						url = res.ShortUrl;
					}
					uni.setClipboardData({
						data: url,
						success: function () {}
					});
					this.modalName =null;
						uni.showToast({
						title: "复制成功",
						icon: 'none'
					})
				})
			},
			downButton(){
				downloadFile(this.item);
			},
			openDocument(item){
				uni.openDocument({
				  filePath: item.filePath,
				  success: function (res) {
					
				  },
				  complete(){
						uni.hideLoading();
				  }
				});
			},
			downloadFile(item){
				this.modalName =null;
				const downloadTask = uni.downloadFile({
					url: item['@microsoft.graph.downloadUrl'],
					success: (res) => {
						if (res.statusCode === 200) {
							var filePath = res.tempFilePath;
							item.filePath = filePath;
							uni.openDocument({
							  filePath: filePath,
							  success: function (res) {
								
							  }
							});
						}
					},fail(){
						uni.showToast({
							title: "下载失败",
							icon: 'none'
						})
					},complete(){
						uni.hideLoading();
					}
				});
			
				downloadTask.onProgressUpdate((res) => {
					item.progress = res.progress;
				});
			},
			hideModal(e) {
				this.modalName = null
			},
			more(e){
				this.modalName="bottomModal";
				this.index = e.currentTarget.dataset.index;
				let index = this.index
				let item = this.list[index];
				this.item = e.item;
			},
			navigateTo(url){
				uni.navigateTo({
					url:url
				})
			},
			mp3Play(item){
				if(item['@microsoft.graph.downloadUrl']==this.src){
					  this.modalName="Modal";
					  return;
				}
				uni.showLoading({
					mask:true,
					title: '正在打开...'
				});
				  // 创建一个audio
				this.innerAudioContext = wx.createInnerAudioContext();
				// 设置audio的资源地址
				this.innerAudioContext.src = item['@microsoft.graph.downloadUrl']  
				// 监听音频进入可以播放状态的事件
				this.innerAudioContext.onCanplay(()=> {
				  // 必须。可以当做是初始化时长
				  this.innerAudioContext.duration;
				  // 必须。不然也获取不到时长
				  setTimeout(() => {
					  this.src= item['@microsoft.graph.downloadUrl'];
					  this.duration = this.innerAudioContext.duration;
					  this.modalName="Modal";
					  uni.hideLoading();
				  }, 200)
				})  
			},
			onClick(e){
				this.index = e.currentTarget.dataset.index;
				let index = this.index
				let item = this.list[index];
				let type = this.fileType(item)
				if(type=='pptx'||type=='xlsx'||type=='word'||type=='pdf'){
					type ="office";
				}
				switch(type) {
					 case "folder":
						this.navigateTo("/pages/index/folder?id="+item.id+"&name="+item.name);
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
					case "mp3":
						this.mp3Play(item);
						break;
					case "office":
						uni.showLoading({
							mask:true,
							title: '正在打开...'
						});
						if(item.filePath){
							this.openDocument(item);
						}else{
							this.downloadFile(item);
						}
						break;
					 default:
						this.showModel();
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
					_this.list =_this.list.concat(res.value);
					_this.nextLink = res['@odata.nextLink'];
					this.isLoad = true;
				})
			},
			showModel(){
				uni.showModal({
					title: '提示',
					showCancel:false,
					content: '目前仅支持PPT,Word,Excel,Pdf,图片.',
					success: function (res) {
						if (res.confirm) {

						}
					}
				});
			},
			getDrives(id,type){
				const _this =this;
				this.isLoad = false;
				rootApi.get_drives(id).then(res => {
					_this.list = _this.list.concat(res.value);
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
.cu-tag.badge {
		border-radius: 200upx;
		position: static;
		top: 0upx;
		right: 0upx;
		font-size: 20upx;
		padding: 0upx 10upx;
		height: 28upx;
		color: #fff;
	}
	.cu-tag.video{
		font-size: 50upx;
		border-radius:30upx;
		top: 0upx;
		right: 0upx;
	}
	// .cu-tag[class*="cuIcon-"] {
	// 	width: 32upx;
	// 	height: 32upx;
	// 	top: 0upx;
	// 	right: 0upx;
	// }
	.cu-list.menu-avatar.sm-border>.cu-item:after {
		left: 30upx;
		width: calc(200% - 120upx)
	}
	.cu-list.menu-avatar>.cu-item .action {
		width: 60upx;
		justify-content: center; 
		align-items: center;
		display: flex;
		height: 90%;
		text-align: center
	}
</style>
