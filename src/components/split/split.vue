<template>
	<div class="split-wrapper">
		<div class="splitAll" @click="showAll">全部<span>{{result[0]}}</span></div>
		<div class="splitGood" @click="showGood">推荐<span>{{result[1]}}</span></div>
		<div class="splitBad" @click="showBad">吐槽<span>{{result[2]}}</span></div>
	</div>
</template>

<script type="ecmascript-6/text">
	export default {
		props: {
			foodRatings:{
				type: [Object,Array]
			}
		},
		data() {
			return {
				result: {
					type: Array
				},
				newRatingArr: {
					type: Array
				}
			}
		},
		methods: {
			_getResult(array) {
				let len = array.length;
				// let SPLITALL = len;
				let SPLITGOOD = [];
				let SPLITBAD = [];

				for(let i = 0;i < len;i++) {
					switch(array[i].rateType) {
						case 0:
							SPLITGOOD.push(array[i]);
							break;
						case 1:
							SPLITBAD.push(array[i]);
							break;
					};
				};
				let splitall = len;
				let splitgood = SPLITGOOD.length;
				let splitbad = SPLITBAD.length;
				this.result = [splitall,splitgood,splitbad];
			  //console.log(this.result);
			},
			showAll() {
				let fooArr = [];
				for(let i=0;i<this.foodRatings.length;i++) {
					this.foodRatings[i]['isShow'] = true;
					fooArr.push(this.foodRatings[i]);
				}
				this.newRatingArr = fooArr;
				this.$root.eventHub.$emit('upDateRating',this.newRatingArr);
				//console.log('all');
			},
			showGood() {
				let fooArr = [];
				for(let i=0;i<this.foodRatings.length;i++) {
					if(!this.foodRatings[i]['rateType']) {
						this.foodRatings[i]['isShow'] = true;
						fooArr.push(this.foodRatings[i]);
					}else{
						this.foodRatings[i]['isShow'] = false;
						fooArr.push(this.foodRatings[i]);
					}
				}
				this.newRatingArr = fooArr;
				this.$root.eventHub.$emit('upDateRating',this.newRatingArr);
			},
			showBad() {
				let fooArr = [];
				for(let i=0;i<this.foodRatings.length;i++) {
					if(this.foodRatings[i]['rateType']) {
						this.foodRatings[i]['isShow'] = true;
						fooArr.push(this.foodRatings[i]);
					}else{
						this.foodRatings[i]['isShow'] = false;
						fooArr.push(this.foodRatings[i]);
					}
				}
				this.newRatingArr = fooArr;
				this.$root.eventHub.$emit('upDateRating',this.newRatingArr);
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin";
	.split-wrapper
		padding:12px 0 18px
		border-1px(rgba(7,17,27,0.1))
		.splitAll,.splitGood,.splitBad
			display:inline-block
			margin-right:8px
			padding:8px 12px
			font-size:12px
			color:rgb(255,255,255)
			line-height:16px
		.splitAll
			background-color:rgb(0,160,220)
		.splitGood
			background-color:rgb(77,85,93)
		.splitBad
			background-color:rgba(77,85,93,0.2)
</style>