<template>
	<div>
		<div class="shopcart">
			<div class="content">
				<div class="content-left">
					<div class="logo-warpper" @click="toggleList">
						<div class="logo" :class="{'highLight':totalCount>0}">
							<i class="icon-close" :class="{'highLight':totalCount>0}"></i>
						</div>
						<div class="number" v-show="totalCount>0">{{totalCount}}</div>
					</div>
					<div class="price" :class="{'highLight':totalCount>0}">￥{{totalPrice}}</div>
					<div class="descrition">另需配送费￥{{deliveryPrice}}元</div>
				</div>
				<div class="content-right">
					<div class="pay" :class="payClass">{{payDesc}}</div>
				</div>
			</div>
			<div class="ball-container">
				<transition v-for="(ball,index) in balls" key="index" name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
					<div v-show="ball.show" class="ball">
						<div class="inner"></div>
					</div>
				</transition>
			</div>
			<transition name="fold">
				<div class="shopcart-list fold-transition" v-show="listShow">
					<div class="listHeader">
						<h1 class="title">购物车</h1>
						<span class="empty" @click="empty">清空</span>
					</div>
					<div class="listContent" ref="listContent">
						<ul>
							<li class="food" v-for="food in selectFoods">
								<span class="name">{{food.name}}</span>
								<div class="price">
									<span>￥{{food.price*food.count}}</span>
								</div>
								<div class="cartcontrol-warpper">
									<cartcontrol :seller="seller" :food="food"></cartcontrol>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<transition name="mask">
			<div class="list-mask mask-transition" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>
</template>

<script type="ecmascript-6/text">
	import BScroll from 'better-scroll';
	import cartcontrol from '../../components/cartcontrol/cartcontrol';

	export default {
		props: {
			selectFoods: {
				type: Array,
				default() {
					return [
						{
							'price':0,
							'count':0
						}
					];
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			},
			seller: {
				type: Object
			}
		},
		data() {
			return {
				balls: [
					{show: false},
					{show: false},
					{show: false},
					{show: false},
					{show: false}
				],
				dropBalls: [],
				fold: true
			}
		},
		computed: {
			totalPrice: function(){
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price*food.count;
				});
				return total;
			},
			totalCount: function() {
				let count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count;
				});
				return count;
			},
			payDesc: function() {
				if (this.totalPrice === 0) {
					return `￥${this.minPrice}元起送`;
				}else if(this.totalPrice<this.minPrice) {
					let diff = this.minPrice - this.totalPrice;
					return `还差￥${diff}元`;
				}else{
					return '去结算';
				}
			},
			payClass: function() {
				if(this.totalPrice<this.minPrice) {
					return 'no-enough';
				}else{
					return 'enough';
				}
			},
			listShow: function() {
				if(!this.totalCount) {
					this.fold = true;
					return false;
				}
				let show = !this.fold;
				/*列表初始化*/
				if (show) {
					this.$nextTick(() => {
						if(!this.scroll){
							this.scroll = new BScroll(this.$refs.listContent,{
								click:true
							});
						}else {
							this.scroll.refresh();
						}
					});
				}
				return show;
			}
		},
		methods: {
			drop (el) {
				// console.log(el);
				for(let i=0;i<this.balls.length;i++) {
					let ball = this.balls[i];
					if(!ball.show) {
						ball.show = true;
						ball.el = el;
						this.dropBalls.push(ball);
						return;
					}
				}
			},
			beforeEnter (el) {
				// 小球动画确定位置
				for (let i = 0;i < this.balls.length; i++) {
					let ball = this.balls[i];
					if (ball.show) {
						let rect = ball.el.getBoundingClientRect();
						let x = (rect.left - 46) + 'px';
						let y = -(window.innerHeight - rect.top - 46) + 'px';
						let inner = el.querySelector('.inner');
						el.style.transform = `translate3d(0, ${y}, 0)`;
						el.style.webkitTransform = `translate3d(0, ${y}, 0)`;
						inner.style.transform = `translate3d(${x}, 0, 0)`;
						inner.style.webkitTransform = `translate3d(${x}, 0, 0)`;
					};
				};
			},
			enter (el) {
				/* eslint-disable no-unused-vars */
				let rf= el.offsetHeight;
				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0,0,0)';
					el.style.transform = 'translate3d(0,0,0)';
					el.style.transition = 'all .4s cubic-bezier(.32,-0.59,.85,.57)';
					el.style.webkitTransition = 'all .4s cubic-bezier(.32,-0.59,.85,.57)';
					let inner = el.querySelector('.inner');
					inner.style.webkitTransform = 'translate3d(0,0,0)';
					inner.style.transform = 'translate3d(0,0,0)';
					inner.style.transition = 'all .4s linear';
					inner.style.webkitTransition = 'all .4s linear';
				});
			},
			afterEnter (el) {
				let ball = this.dropBalls.shift();
				if (ball) {
					ball.show = false;
					// el.style.display = 'none';
				};
				el.style.transition = '';
				el.style.webkitTransition = '';
				let inner = el.querySelector('.inner');
				inner.style.transition = '';
				inner.style.webkitTransition = '';
			},
			toggleList () {
				if (!this.totalCount) {
					return;
				}
				this.fold = !this.fold;
			},
			empty () {// 清空购物车
				this.selectFoods.forEach((food) => {
					food.count = 0;
				});
			},
			hideList () {
				this.fold = true;
			}
		},
		components: {
			cartcontrol
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin";

	.shopcart
		position:fixed
		left:0
		bottom:0
		z-index:50
		width:100%
		height:48px
		.content
			display:flex
			background:#141d27
			font-size:0
			.content-left
				flex:1
				.logo-warpper
					display:inline-block
					vertical-align:top
					position:relative
					top:-10px
					margin:0 12px
					padding:6px
					width:56px
					height:56px
					box-sizing:border-box
					border-radius:50%
					background:#141d27
					.logo
						width:100%
						height:100%
						text-align:center
						border-radius:50%
						background:#2b343c
						&.highLight
							background:rgb(0,160,220)
						.icon-close
							line-height:44px
							font-size:24px
							color:#80858a
							&.highLight
								color:rgb(255,255,255)
					.number
						position:absolute
						top:0
						right:0
						width:24px
						height:16px
						line-height:16px
						text-align:center
						border-radius:16px
						font-size:9px
						font-weight:700
						color:rgb(255,255,255)
						background:rgb(240,20,20)
						box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
				.price
					display:inline-block
					vertical-align:top
					margin-top:12px
					line-height:24px
					box-sizing:border-box
					padding-right:12px
					border-right:1px solid rgba(255,255,255,0.1)
					font-size:16px
					font-weight:700
					color:rgba(255,255,255,0.4)
					&.highLight
						color:rgb(255,255,255)
				.descrition
					display:inline-block
					vertical-align:top
					margin:12px 0 0 12px
					line-height:24px
					font-size:10px
					color:rgba(255,255,255,0.4)
					font-weight:200
			.content-right
				flex:0 0 105px
				width:105px
				.pay
					height:48px
					line-height:48px
					text-align:center
					font-size:12px
					font-weight:700
					color:rgba(255,255,255,0.4)
					&.no-enough
						background:#2b343c
					&.enough
						background:#00b43c
						color:#fff
		.ball-container
			.ball
				position:fixed
				left:32px
				bottom:22px
				z-index:200
				.inner
					width:16px
					height:16px
					border-radius:50%
					background:rgb(0,160,200)
		.shopcart-list
			position:absolute
			top:0
			left:0
			z-index:-1
			width:100%
			&.fold-transition
				transition:all 0.5s
				transform:translate3d(0,-100%,0)
			&.fold-enter,&.fold-leave-active
				transform:translate3d(0,0,0)
			.listHeader
				height:48px
				line-height:48px
				padding:0 18px
				background:#f3f5f7
				border-bottom:1px solid rgba(7,17,27,0.1)
				.title
					float:left
					font-size:14px
					color:rgb(7,17,27)
				.empty
					float:right
					font-size:12px
					color:rgb(0,160,220)
			.listContent
				padding:0 18px
				max-height:217px
				overflow:hidden
				background:rgb(255,255,255)
				.food
					position:relative
					padding:12px 0
					box-sizing:border-box
					border-1px(rgba(7,17,27,0.1))
					.name
						line-height:24px
						font-size:14px
						color:rgb(7,17,27)
					.price
						position:absolute
						right:90px
						bottom:12px
						line-height:24px
						font-size:14px
						font-weight:700
						color:rgb(240,20,20)
					.cartcontrol-warpper
						position:absolute
						bottom:6px
						right:0px
	.list-mask
		position:fixed
		top:0
		left:0
		width:100%
		height:100%
		z-index:40
		backdrop-filter:blur(10px)
		&.mask-transition
			transition:all 0.5s
			opacity:1
			background:rgba(7,17,27,0.6)
		&.mask-enter,&.mask-leave-active
			opacity:0
			background:rgba(7,17,27,0)
</style>
