<template>
    <view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true"><block slot="backText"></block><block slot="content">{{item.name}}</block></cu-custom>
       <!-- <view class="uni-padding-wrap uni-common-mt">
            <view v-if="src">
               <video class="videoCss" id="myVideo" :src="src" custom-cache="false"
                    @error="videoErrorCallback"  enable-danmu danmu-btn controls></video>
					<view class="padding text-orange text-sm">如果文件太加载不了请复制播放地址到浏览器中打开</view>
					<view class="padding flex flex-direction">
						<button class="cu-btn bg-blue" @tap="copyAddress()">复制地址</button>
					</view>
            </view>
        </view> -->
    </view>
</template>

<script>
	import tokenApi from '@/api/token.js'
	export default {
    data() {
        return {
            item: {},
			src:'',
            danmuValue: ''
        }
    },
	onLoad(e) {
		this.item = this.$store.state.item
		this.src = this.item['@microsoft.graph.downloadUrl'];
	},
    onReady: function(res) {
        // #ifndef MP-ALIPAY
        this.videoContext = uni.createVideoContext('myVideo')
        // #endif
    },
    methods: {
		copyAddress(){
			const _this = this;
			tokenApi.urlCreate({
				Url:_this.src,
			}).then(res => {
				let url = _this.src;
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
        sendDanmu: function() {
            this.videoContext.sendDanmu({
                text: this.danmuValue,
                color: this.getRandomColor()
            });
            this.danmuValue = '';
        },
        videoErrorCallback: function(e) {
            uni.showModal({
                content: e.target.errMsg,
                showCancel: false
            })
        },
        getRandomColor: function() {
            const rgb = []
            for (let i = 0; i < 3; ++i) {
                let color = Math.floor(Math.random() * 256).toString(16)
                color = color.length == 1 ? '0' + color : color
                rgb.push(color)
            }
            return '#' + rgb.join('')
        }
    }
}
</script>

<style>
.videoCss{
  width: 100%;
}
</style>
