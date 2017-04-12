<template>
	<div ref="foodDescription" class="food-description-wrapper">
		<div>
			<transition name="showInfo">
				<div v-show="isShow" class="showWrapper" ref="showWrapper">
					<div class="image">
						<div class="close icon-add_circle" @click="selectFoodHide"></div>
						<img :src="selectFood.image"/>
					</div>
					<div class="foodInfo">
						<h2 class="name">{{selectFood.name}}</h2>
						<p class="descrition">{{selectFood.descrition}}</p>
						<div class="extra">
							<span class="count">月售{{selectFood.sellCount}}份</span>
							<span>好评率{{selectFood.rating}}%</span>
						</div>
						<div class="price">
							<span class="now">￥<span>{{selectFood.price}}</span></span>
							<span v-show="selectFood.oldPrice" class="old">￥{{selectFood.oldPrice}}</span>
						</div>
						<div class="addCart" @click="addToCart">加入购物车</div>
					</div>
					<div class="lines"></div>
					<div class="foodDescription">
						<h2 class="title">商品介绍</h2>
						<p class="description">{{selectFood.info}}</p>
					</div>
					<div class="lines"></div>
					<div class="ratings-wrapper">
						<div class="selectCom">
							<h2 class="title">商品评价</h2>
							<splitModo ref="split" :foodRatings="ratings"></splitModo>
							<selectModo ref="select" :foodRatings="ratings" :hasContent="hasContent"></selectModo>
						</div>
						<div class="ratings-info">
							<ul ref="ratingList">
								<li v-show="isItemShow(item)" v-for="item in ratings" class="rating-box">
									<div class="time">{{item.rateTime}}</div>
									<div class="rating">
										<span class="icon " :class="ifSupport(item)"></span>
										<span class="text">{{item.text}}</span>
									</div>
									<div class="user">
										<div class="username">{{item.username}}</div>
										<div class="avatar">
											<img :src="item.avatar"/>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script type="ecmascript-6/text">
	import Vue from 'vue';
	import BScroll from 'better-scroll';
	import splitModo from '../../components/split/split';
	import selectModo from '../../components/select/select';

	export default {
		props: {
			selectFood: {
				type: Object
			},
			isShow: {
				type: Boolean
			}
		},
		data() {
			return {
				ratings: {
					type: Array
				},
				hasContent: {
					type: Boolean,
					value: true
				}
			}
		},
		methods: {
			_selectFoodShow(isShow) {
				if (isShow) {
          this.$nextTick(() => {
          	this.ratings = this.selectFood['ratings'];
          	this.$refs.split._getResult(this.ratings);
						this.itemShow(this.ratings);
          	// console.log(this.ratings);
            this.fashDom();
          });
        }
			},
			fashDom() {
      	if(!this.scroll){
        	//this.$refs.foodDescription.style.height = this.$refs.foodDescription.offsetHeight + this.$refs.ratingList.offsetHeight + 'px';
          this.scroll = new BScroll(this.$refs.foodDescription,{
            click:true
          });
        }else {
          this.scroll.refresh();
        }
      },
			selectFoodHide() {
				this.$root.eventHub.$emit('hideSelectFood',false);
			},
			addToCart() {
				if(!event._constructed) {
					return;
				};
				if(!this.selectFood.count) {
					Vue.set(this.selectFood, 'count', 1);// 通过Vue.set可以添加一个属性使dom可以观测到属性的变化，不然无法检测
				}else{
					this.selectFood.count++;
				};
				this.$root.eventHub.$emit('cartAdd',event.target);
			},
			ifSupport(item) {
				return item.rateType?'icon-check_circle':'icon-arrow_lift';
			},
			updateRat(newRatingArr) {
				this.ratings = newRatingArr;
				this.$nextTick(()=>{
					this.fashDom();
				});
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
			}
		},
		created() {
			this.$nextTick(()=>{
				if(this.isShow){
					this.$root.eventHub.$on('upDateRating',(newRatingArr) => {
					this.updateRat(newRatingArr);
				});
				this.$refs.split._getResult(this.ratings);
				};
			});
		},
		updated() {
			this.$nextTick(()=>{
				this.fashDom();
			});
		},
		components: {
			splitModo,
			selectModo
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin";
	.food-description-wrapper
		position:fixed
		top:0
		bottom:48px
		z-index:30
		width:100%
		.showWrapper
			background-color:rgb(255,255,255)
			&.showInfo-enter-active,&.showInfo-leave-active
				transition:all .4s ease
				transform:translateX(0)
				//opacity:1
			&.showInfo-enter,&.showInfo-leave-active
				transform:translateX(100%)
				//opacity:0
		.image
			position:relative
			width:100%
			height:375px
			overflow:hidden
			img
				height:100%
				width:100%
			.close
				padding:10px
				position:absolute
				top:10px
				left:10px
				color:rgba(255,255,255,0.7)
				font-size:16px
				font-weight:400
				text-shadow:0px 0px 10px rgb(255,255,255)
		.foodInfo
			box-sizing:border-box
			padding:18px
			width:100%
			position:relative
			background-color:rgb(255,255,255)
			.name
				margin-bottom:8px
				line-height:14px
				font-size:14px
				font-weight:700
				color:rgb(7,17,27)
			.descrition
				font-size:10px
				line-height:12px
				color:rgb(147,153,159)
			.extra
				margin-bottom:18px
				line-height:12px
				font-size:10px
				color:rgb(147,153,159)
				.count
					margin-right:12px
			.price
				font-weight:700
				line-height:24px
				.now
					margin-right:8px
					line-height:24px
					font-size:10px
					color:rgb(240,20,20)
					font-weight:normal
					span
						font-size:14px
						font-weight:700
				.old
					line-height:24px
					font-weight:700
					text-decoration:line-through
					font-size:10px
					color:rgb(147,153,159)
			.addCart
				position:absolute
				right:18px
				bottom:18px
				box-sizing:border-box
				border-radius:12px
				background-color:rgb(0,160,220)
				width:74px
				height:24px
				padding:6px 12px
				text-align:center
				line-height:12px
				font-size:10px
				color:rgb(255,255,255)
		.lines
			width:100%
			height:16px
			background-color:#f3f5f7
			border-top:1px solid rgba(7,17,27,0.1)
			border-bottom:1px solid rgba(7,17,27,0.1)
		.foodDescription
			box-sizing:border-box
			padding:18px
			background-color:rgb(255,255,255)
			.title
				margin-bottom:6px
				font-size:14px
				line-height:14px
				color:rgb(7,17,27)
			.description
				padding:0px 6px
				line-height:24px
				font-size:12px
				font-weight:200
				color:rgb(77,85,93)
		.ratings-wrapper
			width:100%
			.selectCom
				width:100%
				box-sizing:border-box
				padding:18px 18px
				background-color:rgb(255,255,255)
				border-bottom:2px solid rgba(147,153,159,0.2)
				.title
					margin-bottom:18px
					font-size:14px
					line-height:14px
					color:rgb(7,17,27)
			.ratings-info
				box-sizing:border-box
				width:100%
				padding:0 18px
				.rating-box
					padding:16px 0
					font-size:0px
					position:relative
					border-1px(rgba(147,153,159,0.3))
					.time
						font-size:10px
						color:rgb(147,153,159)
						line-height:12px
					.rating
						.icon
							display:inline-block
							margin-right:4px
							font-size:12px
							color:rgb(147,153,159)
							line-height:24px
							&.icon-arrow_lift
								color:rgb(0,160,220)
						.text
							font-size:12px
							line-height:16px
							color:rgb(7,17,27)
					.user
						position:absolute
						top:16px
						right:18px
						font-size:0px
						.username
							display:inline-block
							font-size:10px
							color:rgb(147,153,159)
							line-height:12px
						.avatar
							vertical-align:top
							display:inline-block
							margin-left:6px
							width:12px
							height:12px
							border-radius:50%
							overflow:hidden
							img
								width:100%
								height:100%
</style>