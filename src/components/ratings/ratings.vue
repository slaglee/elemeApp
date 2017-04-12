<template>
  <div ref="ratingsInfo" class="ratings">
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="title">综合评分</div>
					<div class="rank">高于周边商家{{seller.rankRate}}</div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="score-wrapper">
						<span class="title">商品评分</span>
						<star class="star" :size="36" :score="seller.foodScore"></star>
						<span class="score">{{seller.foodScore}}</span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="text">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<div class="lines"></div>
			<div class="ratings-info">
				<splitModo ref="split" :foodRatings="ratings"></splitModo>
				<selectModo ref="select" :foodRatings="ratings" :hasContent="hasContent"></selectModo>
			</div>
			<div class="ratingInfo">
				<ul>
					<li v-show="isItemShow(item)" v-for="item in ratings" class="ratingItem">
						<div class="userAvatar">
							<img :src="item.avatar"/>
						</div>
						<span class="name">{{item.username}}</span>
						<div class="score">
							<star class="star" :size="24" :score="item.score"></star>
							<div class="time">{{item.deliveryTime}}分钟送达</div>
						</div>
						<p class="text">{{item.text}}</p>
						<div class="desc">
							<span class="icon " :class="ifSupport(item)"></span>
							<div class="recommends">
								<span class="recommend" v-for="recom in item.recommend">{{recom}}</span>
							</div>
						</div>
						<span class="Nowtime">{{getTime(item.rateTime)}}</span>
					</li>
				</ul>
			</div>
		</div>
  </div>
</template>

<script type="ecmascript-6/text">
	import BScroll from 'better-scroll';
	import star from '../../components/star/star';
	import splitModo from '../../components/split/split';
	import selectModo from '../../components/select/select';

  export default{
  	props: {
  		seller: {
  			type: Object
  		}
  	},
  	data() {
  		return {
  			ratings: {
  				type: Array
  			},
  			hasContent: {
  				type: Boolean
  			}
  		}
  	},
  	components: {
  		star,
  		splitModo,
  		selectModo
  	},
  	methods: {
  		updateRat(newRatingArr) {
				this.ratings = newRatingArr;
				this.$nextTick(()=>{
					if(!this.scroll){
	          this.scroll = new BScroll(this.$refs.ratingsInfo,{
	            click:true
	          });
	        }else {
	          this.scroll.refresh();
	        }
				});
			},
			fashDom() {
				if(!this.scroll){
					//this.$refs.ratingsInfo.style.height = this.$refs.ratingsInfo.offsetHeight +'px';
          this.scroll = new BScroll(this.$refs.ratingsInfo,{
            click:true
          });
        }else {
          this.scroll.refresh();
        }
			},
			itemShow(ratings) {
				let fooArr = [];
				for(let i=0;i<ratings.length;i++) {
						ratings[i]['isShow'] = true;
						ratings[i]['hasText'] = true;
						fooArr.push(ratings[i]);
				}
				this.ratings = fooArr;
				//console.log(this.ratings[1].isShow)
			},
			isItemShow(item) {
				return item.isShow&&item.hasText?true:false;
			},
			ifSupport(item) {
				return item.rateType?'icon-check_circle':'icon-arrow_lift';
			},
			getTime(time) {
				let date = new Date(time);
				let seperator1 = '-';
				let seperator2 = ':';
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if(month >= 1 && month <= 9) {
					month = '0' + month;
				};
				if(strDate >= 0 && strDate <= 9) {
					strDate = '0' + strDate;
				};
				let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
				return currentdate;
			},
			getInfo(selectInfo) {
				this.selectFoods = selectInfo;
				console.log(this.selectFoods);
			}
  	},
  	created() {
  		const ERR_OK = 0;
  		this.$http.get('/api/ratings').then((response) => {
  			response = response.body;
  			if (response.errno === ERR_OK) {
  				this.ratings = response.data;
  				//console.log(this.ratings);
  				this.$nextTick(() => {// 作用：可以在dom更新时候触发
  					this.fashDom();
  					/*if(!this.scroll){
		          this.scroll = new BScroll(this.$refs.ratingsInfo,{
		            click:true
		          });
		        }else {
		          this.scroll.refresh();
		        }*/
		        this.$refs.split._getResult(this.ratings);
		        this.itemShow(this.ratings);
		        this.$root.eventHub.$on('upDateRating',(newRatingArr) => {
							this.updateRat(newRatingArr);
						});
						this.$root.eventHub.$on('getSelectInfo',(selectInfo) => {
							this.getInfo(selectInfo);
						});
  				});
  			}
  		});
  	},
  	updated() {// dom已经更新并且加载组件之后刷新BSroll的状态
			this.$nextTick(()=>{
				this.fashDom();
			});
		},
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin";

	.ratings
		position:absolute
		top:174px
		bottom:0px
		left:0
		width:100%
		overflow:hidden
		.overview
			display:flex
			padding:18px 0
			.overview-left
				flex:0 0 137px
				width:137px
				border-right:1px solid rgba(7,17,27.0.2)
				text-align:center
				@media only screen and (max-width:320px)
					flex:0 0 110px
					width:110px
				.score
					margin-bottom:6px
					font-size:24px
					line-height:28px
					color:rgb(255,153,0)
				.title
					margin-bottom:8px
					font-size:12px
					line-height:12px
					color:rgb(7,17,27)
				.rank
					font-size:10px
					line-height:10px
					color:rgb(147,153,159)
			.overview-right
				flex:1
				padding-left:24px
				@media only screen and (max-width:320px)
					padding-left:14px
				.score-wrapper
					margin-bottom:8px
					font-size:0px
					.title
						display:inline-block
						line-height:18px
						vertical-align:top
						font-size:12px
						color:rgb(7,17,27)
					.star
						display:inline-block
						vertical-align:top
						margin:0 12px
					.score
						display:inline-block
						line-height:18px
						font-size:12px
						line-height:18px
						color:rgb(255,153,0)
				.delivery-wrapper
					font-size:0px
					.title
						display:inline-block
						line-height:18px
						vertical-align:top
						font-size:12px
						color:rgb(7,17,27)
					.text
						display:inline-block
						margin-left:12px
						line-height:18px
						font-size:12px
						color:rgb(147,153,159)
		.lines
			width:100%
			height:16px
			background-color:#f3f5f7
			border-top:1px solid rgba(7,17,27,0.1)
			border-bottom:1px solid rgba(7,17,27,0.1)
		.ratings-info
			padding:0px 18px 18px
			width:100%
			box-sizing:border-box
			background-color:rgb(255,255,255)
			border-bottom:2px solid rgba(147,153,159,0.2)
		.ratingInfo
			box-sizing:border-box
			padding:0 18px
			width:100%
			font-size:0
			.ratingItem
				padding:18px 0
				position:relative
				border-1px(rgba(147,153,159,0.2))
				.userAvatar
					height:28px
					width:28px
					border-radius:50%
					overflow:hidden
					position:absolute
					left:0px
					top:18px
					img
						width:100%
						height:100%
				.name
					margin-left:40px
					font-size:10px
					color:rgb(7,17,27)
					line-height:12px
					margin-bottom:4px
				.score
					margin-left:40px
					margin-bottom:6px
					.star
						display:inline-block
						vertical-align:top
						margin-right:6px
						line-height:12px
					.time
						display:inline-block
						line-height:12px
						font-size:10px
						font-weight:200
						color:rgb(147,153,159)
				.text
					margin-left:40px
					margin-bottom:8px
					font-size:12px
					color:rgb(7,17,27)
					line-height:18px
				.desc
					margin-left:40px
					.icon
						display:inline-block
						font-size:12px
						color:rgb(147,153,159)
						line-height:24px
						&.icon-arrow_lift
							color:rgb(0,160,220)
					.recommends
						display:inline-block
						.recommend
							margin-left:8px
							padding:4 6px
							border:1px solid
							border-color:rgba(7,17,27,0.1)
							border-radius:2px
							background-color:rgb(255,255,255)
							font-size:9px
							color:rgb(147,153,159)
							line-height:16px
				.Nowtime
					position:absolute
					top:18px
					right:18px
					font-size:10px
					line-height:12px
					font-weight:200
					color:rgb(147,153,159)
</style>
