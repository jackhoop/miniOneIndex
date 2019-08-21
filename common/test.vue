<template name="test">
	<view @testThods="testThods">
	   测试12122
	</view>
</template>
<script>
export default {
	name: "test",
	//属性
	props: {
		属性名称: {
			type: String,//属性类型
			value: "值"
		},
	},
	//组件生命周期
	created:function(e){
	
	},
	methods: {
		testThods:function(obj){
		},
	},
	testThods(){
	}
}
</script>
<style>

</style>