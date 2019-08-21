<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :pagesLength="pagesLength" :isBack="true"><block slot="backText"><text class="lg text-gray cuIcon-home"></text></block><block slot="content">{{title}}</block></cu-custom>
		<imgItem :list="list" type="viewImg" @click="select_image"></imgItem>
		<view class="cu-load" :class="!isLoad?'loading':'over'"></view>
		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction" @trigger="trigger" />
	</view>
</template>

<script>
	import imgItem from '@/colorui/components/image-item.vue'
	import uniFab from '@/colorui/components/uni-fab.vue'
	import rootApi from '@/api/root.js'
	import homeApi from '@/api/home.js'
	export default {
		components: {
			imgItem,
			uniFab
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
		onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自页面内分享按钮
			  return;
			}
			return {
			   title:this.title,
			}
		},
		data() {
			return {
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'vertical',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF'
				},
				content: [{
						iconPath: '/static/share.png',
						selectedIconPath: '/static/share.png',
						text: '分享',
						type:'share',
						active: false
					},
					{
						iconPath: '/static/home.png',
						selectedIconPath: '/static/home.png',
						text: '主页',
						active: false
					}
				],
				list:[],
				oldList:[],
				nextLink:'',
				imgType:'',
				title:'',
				folderName:'',
				isLoad:false,
				pagesLength:0,
				imgList:[],
			}
		},
		onLoad(e) {
			this.pagesLength = getCurrentPages().length;
			this.imgType = e.imgType;
			this.folderName = e.folderName;
			this.title = this.folderName.substring(this.folderName.indexOf("__")+2,this.folderName.lastIndexOf("__"))
			if(this.$store.state.token.access_token){
				this.get_List();
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.cleanDate();
			this.get_List("refresh");
		},
		// 上拉加载
		onReachBottom: function(){
			if(this.nextLink&&this.isLoad){
				this.isLoad = false;
				this.nextPage();
			}
		},
		methods: {
			trigger(e) {
				this.content[e.index].active = !e.item.active
				console.log(e)
				if(e.item.text=='表扬'){
					uni.navigateTo({
						url:"selectStudent"
					})
				}else if(e.item.text=='主页'){
					uni.switchTab({
						url:"/pages/home/home"
					})
				}
				this.$refs.fab.close()
			},
			cleanDate(){
				this.oldList=[];
				this.list=[];
				this.imgList=[];
				this.nextLink='';
			},
			select_image(e){
				this.previewImage(e.item)
			},
			previewImage(item){
			 // 预览图片
				uni.previewImage({
					current:item['@microsoft.graph.downloadUrl'],
					urls: this.imgList,
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
					res.value.forEach(item =>{
						_this.imgList.push(item['@microsoft.graph.downloadUrl'])
					});
					_this.list = this.transformList(this.oldList);
					_this.nextLink = res['@odata.nextLink'];
					this.isLoad = true;
				})
			},
			get_List(type){
				const _this =this;
				_this.isLoad = false;
				homeApi.get_children(_this.imgType,_this.folderName).then(res => {
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
					res.value.forEach(item =>{
						_this.imgList.push(item['@microsoft.graph.downloadUrl'])
					});
				})
			}
		}
	}
</script>

<style>
</style>
