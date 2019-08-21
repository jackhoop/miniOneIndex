<template>
	<view>
	  <canvas
		class="cropper"
		disable-scroll="true"
		@touchstart="ts"
		@touchmove="tm"
		@pushOrigin="pushOrigin"
		@touchend="te"
		:style="style"
		@error="canvasError"
		canvas-id="cropper">
	  </canvas>
	  <canvas
		class="cropper"
		disable-scroll="true"
		:style="style1"
		canvas-id="targetCropper">
	  </canvas>
	</view>
</template>

<script>
	import WeCropper from 'we-cropper'
	export default {
		data() {
			return {
				$: null,
				id: 'cropper',
				targetId: 'targetCropper'
			};
		},
		name: 'cropper',
		computed: {
			style() {
				var width= this.options.width;
				var height= this.options.height;
				var style = `width:${width}px;height:${height}px;background-color: rgba(0, 0, 0, 0.8)`;
				return style
			},
			style1() {
				var width= this.options.width;
				var height= this.options.height;
				var res = uni.getSystemInfoSync();
				var top = width*res.pixelRatio
				var left = height*res.pixelRatio
				var style = `position: fixed; top: -${top}px; left: -${left}px; width:${top}px;height:${left}px;`;
				console.log(style)
				return style
			}
		},
		props: {
			options: Object
		},
		methods: {
			ts (e) {
				console.log("sasdf")
			  this.$.touchStart(e)
			},
			tm (e) {
			  this.$.touchMove(e)
			},
			te (e) {
			  this.$.touchEnd(e)
			},
			pushOrigin (src) {
			  console.log("pushOrigin",src)
				console.log("$",this)
			  this.$.pushOrign(src)
			},
	  },
		canvasError (e) {
		  console.error(e.detail.errMsg)
		},
		pushOrigin (src) {
		  console.log("pushOrigin",src)
			console.log("$",this)
		  this.$.pushOrign(src)
		},
		updateCanvas () {
		  this.$.updateCanvas()
		},
		getCropperImage () {
		  // we-cropper v1.3.0 之后 getCropperImage 方法返回 Promise 对象
		  return this.$.getCropperImage()
		},
		getCropperBase64 (fn, ev) {
		  this.$.getCropperImage(fn)
		},
	  onLoad () {
			const options = this.options

			options.id = this.id
			options.targetId = this.targetId
			
			this.$ = new WeCropper(options)
			.on('ready', (...args) => {
				this.$emit('ready', ...args) 
			})
			.on('beforeImageLoad', (...args) => {
				console.log('beforeImageLoad')
				this.$emit('beforeImageLoad', ...args)
			})
			.on('imageLoad', (...args) => {
				this.$emit('imageLoad', ...args)
			})
			.on('beforeDraw', (...args) => {
				this.$emit('beforeDraw', ...args)
			})
			console.log("load$",this.$)
	  }
	}
</script>

<style>

</style>
