<template>
	<div class="select-wrapper">
		<div class="select-button">
			<span class="icon icon-keyboard_arrow_right" :class="colorControl()" @click="showHasText"></span>
			<span class="text">只看内容的评价</span>
		</div>
	</div>
</template>

<script type="ecmascript-6/text">
	export default {
		props: {
			hasContent: {
				type: [Boolean,Object]
			},
			foodRatings: {
				type: [Array,Object]
			}
		},
		data() {
			return {
				newRatingArr: {
					type: Array
				},
				onOff: 0
			}
		},
		methods: {
			selectRating(hasContent) {
				let DomIcon = querySelector('.icon');
				if(hasContent) {
					DomIcon.style.color = 'rgb(147,153,159)';
				}else{
					DomIcon.style.color = '#00a0dc';
				}
			},
			showHasText() {
				let fooArr = [];
				this.onOff = !this.onOff;
				if(this.onOff) {
					for(let i=0;i<this.foodRatings.length;i++) {
						if(this.foodRatings[i]['text'] == '') {
							this.foodRatings[i]['hasText'] = false;
							fooArr.push(this.foodRatings[i]);
						}else{
							this.foodRatings[i]['hasText'] = true;
							fooArr.push(this.foodRatings[i]);
						}
					};
				}else{
					for(let i=0;i<this.foodRatings.length;i++) {
							this.foodRatings[i]['hasText'] = true;
							fooArr.push(this.foodRatings[i]);
					};
				};
				this.newRatingArr = fooArr;
				this.$root.eventHub.$emit('upDateRating',this.newRatingArr);
				
			},
			colorControl() {
				if(this.onOff) {
					return 'lightColor';
				}else{
					return;
				}
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	.select-wrapper
		width:100%
		padding:12px 0 0
		.select-button
			font-size:0
			.icon
				vertical-align:top
				font-size:24px
				line-height:24px
				color:rgb(147,153,159)
				margin-right:4px
				&.lightColor
					color:rgb(0,170,220)
			.text
				vertical-align:top
				font-size:12px
				color:rgb(147,153,159)
				line-height:24px
</style>