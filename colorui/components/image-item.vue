<template>
	<view class="margin-xs">
		<view class="root">
			<view  class="item padding-xs radius bg-white shadow"  v-for="(item,index) in list" :key="index">
				<image :data-index="index" @tap.stop="select_image" :src="item.thumbnails[0].large.url"
				 mode="widthFix" ></image>
				 <view class="flex flex-wrap" v-if="type=='home'||type=='class'" :data-index="index">
				 	<view class="basis-xl">
						{{item.name.substring(0,item.name.lastIndexOf("__")).substring(item.name.indexOf("__")+2,item.name.length)}}
					</view>
				 	<!-- <view class="basis-xs text-right">
							<button  class="text-right margin-right-xs">
									<text class="iconfont icon-fenxiang4 text-orange text-right"></text>
							</button>
					</view> -->
				 </view>
			</view>
		</view>
	</view>
</template>

<script>
	import formatDate from '@/colorui/components/formatDate.vue'
	export default {
		components: {
			formatDate
		},
		name: 'ImageItem',
		props: {
			list: {
				default: []
			},
			type:{
				default:'home'
			}
		},
		data() {
			return {
				inputValue: 0
			}
		},
		created() {
		},
		methods: {
			// share(e){
			// 	this.index = e.currentTarget.dataset.index;
			// 	let item = this.list[this.index];
			// 	const type = item.name.substring(item.name.lastIndexOf("__")+2,item.name.indexOf("."));
			// 	const folderName = item.name.substring(0,item.name.indexOf("."));
			// 	item.type = type;
			// 	item.folderName = folderName;
			// 	this.$emit('share', {
			// 		item: item
			// 	})	
			// },
			select_image(e){
				this.index = e.currentTarget.dataset.index;
				let item = this.list[this.index];
				const type = item.name.substring(item.name.lastIndexOf("__")+2,item.name.indexOf("."));
				const folderName = item.name.substring(0,item.name.indexOf("."));
				item.type = type;
				item.folderName = folderName;
				this.$emit('click', {
					item: item
				})
			}
		}
	}
</script>

<style lang="scss">
button::after {
  border: none;
}
button {
 line-height:1 !important;
  padding-left: 0px !important;
  padding-right: 0px !important;
  background-color: #fff;
}
	.root {
	    // margin: 0 auto;
	     width: 100%;
	     column-count: 2;
	     column-width: 10upx;
	     column-gap: 20upx;
	}
	.itemContainer{
		margin-right: 10px;
		flex-direction: column;
		width: 240px;
	}
	.item {
     margin-bottom: 10upx;
     /* 防止多列布局，分页媒体和多区域上下文中的意外中断 */
     break-inside: avoid;
     background: #fff;
	}
</style>
