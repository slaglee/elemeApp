<template>
	<div class="cartcontrol">
		<transition name="fade">
			<div class="cart-decrease icon-shopping_cart" v-show="food.count>0" @click="decreaseCart">
			</div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add icon-thumb_down" @click="addCart"></div>
	</div>
</template>

<script type="ecmascript-6/text">
  import Vue from 'vue';// 调用接口增加一个food.count的属性，
	export default {
		props: {
			food: {
				type: Object,
				default () {
					return (() => {

					});
				}
			},
			seller: {
				type: Object
			}
		},
		methods: {
			addCart(event) {
				if(!event._constructed) {
					return;
				};
				if(!this.food.count) {
					Vue.set(this.food, 'count', 1);// 通过Vue.set可以添加一个属性使dom可以观测到属性的变化，不然无法检测
				}else{
					this.food.count++;
				};
				this.$root.eventHub.$emit('cartAdd',event.target);// 每次添加传入dom对象用来做添加购物车小球动画
				event.stopPropagation();
				// console.log(this.seller.id);
			},
			decreaseCart(event) {
				if(!event._constructed) {
					return;
				};
				if(this.food.count) {
					this.food.count--;
				};
				event.stopPropagation();
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	.cartcontrol
		font-size:0
		.cart-decrease
			display:inline-block
			padding:6px
			display:inline-block
			line-height:24px
			font-size:24px
			color:rgb(0,160,220)
			&.fade-enter-active,&.fade-leave-active
				transform:translate3d(0,0,0) rotate(0)
				opacity:1
				transition:all 0.4s linear
			&.fade-enter,&.fade-leave-active
				transform:translate3d(24px,0,0) rotate(180deg)
				opacity:0
		.cart-count
			display:inline-block
			vertical-align:top
			width:12px
			padding-top:6px
			line-height:24px
			text-align:center
			font-size:10px
			color:rgb(147,153,159)
		.cart-add
			display:inline-block
			padding:6px
			line-height:24px
			font-size:24px
			color:rgb(0,160,220)
</style>