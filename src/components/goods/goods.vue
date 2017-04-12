<template>
	<div class="goods">
		<div class="menu-warpper" ref="menuWarpper">
			<ul>
				<li v-for="(item,index) in goods" class="menu-item" :class="{current:currentIndex===index}" @click="selectMenu(index,$event)">
					<span class="text border-1px">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
  	<div class="food-warpper" ref="foodWarpper">
  		<ul>
  			<li v-for="item in goods" :item="item" class="food-list food-list-hook">
  				<h1 class="title">{{item.name}}</h1>
  				<ul>
  					<li v-for="food in item.foods" class="food-item border-1px" @click="selectFoodShow(food)">
  						<div class="icon">
  							<img width="57px" :src="food.icon">
  						</div>
  						<div class="content">
  							<h2 class="name">{{food.name}}</h2>
  							<p class="descrition">{{food.descrition}}</p>
  							<div class="extra">
  								<span class="count">月售{{food.sellCount}}份</span>
  								<span>好评率{{food.rating}}%</span>
  							</div>
  							<div class="price">
  								<span class="now">￥{{food.price}}</span>
  								<span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
  							</div>
  							<div class="cartcontrol-warpper">
  								<cartcontrol :seller="seller" :food="food"></cartcontrol>
  							</div>
  						</div>
  					</li>
  				</ul>
  			</li>
  		</ul>
  	</div>
  	<shopcart ref="shopcart" :seller="seller" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"> 
    </shopcart>
    <food v-show="isShow" :isShow="isShow" ref="food" :selectFood="selectFood"></food>
	</div>
</template>

<script type="ecmascript-6/text">
	import BScroll from 'better-scroll';
	import shopcart from '../../components/shopcart/shopcart';
  import food from '../../components/food/food';
	import cartcontrol from '../../components/cartcontrol/cartcontrol';

	const ERR_OK = 0;

  export default{
  	props: {
  		seller: {
  			type: Object
  		}
  	},
  	data() {
  		return {
  			goods: [],
  			listHeight: [],// 高度集合，联动
  			scrollY: 0,// 监控Y轴
        isShow: false,
        toShowFood:{}
  		};
  	},
  	computed: {
  		currentIndex:function() {
  			/*当前位置，映射scrollY*/
  			for(let i=0;i<this.listHeight.length;i++) {
  				let height1 = this.listHeight[i];
  				let height2 = this.listHeight[i+1];
  				if(!height2 || (this.scrollY>=height1&&this.scrollY<height2)) {
  					/*如果在当前区间，或者height2不存在了，也就是height1已经到最后一个，返回index索引位置*/
  					return i;
  				};
  			};
  		},
  		selectFoods:function() {
  			let foods = [];
  			this.goods.forEach((good) => {
  				good.foods.forEach((food) => {
  					if(food.count) {
  						foods.push(food);
  					};
  				});
  			});
  			return foods;
  		},
      selectFood: function() {
        return this.toShowFood;
      }
  	},
  	created() {
  		this.classMap = ['decrease','discount','special','invoice','guarantee'];
  		this.$http.get('/api/goods').then((response) => {
  			response = response.body;
  			if (response.errno === ERR_OK) {
  				this.goods = response.data;
  				// console.log(this.goods);
  				this.$nextTick(() => {// 作用：可以在dom更新时候触发
  					this._initScroll();
  					// 取每一部分li高度，用来做联动的scrollTop
  					this._calculateHeight();
  				});
  			}
  		});
  		this.$root.eventHub.$on('cartAdd',(target)=>{
  			this._drop(target);
  		});
      this.$root.eventHub.$on('hideSelectFood',(isShow)=>{
        this.selectFoodHide(isShow);
      });
  	},
  	methods: {
  		selectMenu(index,event) {
  			if(!event._constructed) {
  				return;
  			};
  			let foodList = this.$refs.foodWarpper.getElementsByClassName('food-list-hook');// 找到列表
  			let el = foodList[index];// 定义需要滚动到的位置节点
  			this.foodScroll.scrollToElement(el,300);// 调用方法的scrollToElement来滚动到相对应位置，(element,time)
  			//console.log(index);
  		},
  		_initScroll() {
  			/*1.0到2.0的迁移，属性从1.0的v-el更新为2.0的ref，并且不兼容“-”字符*/
  			this.menuScroll = new BScroll(this.$refs.menuWarpper, {
  				// PC兼容
  				click:true
  			});

  			this.foodScroll = new BScroll(this.$refs.foodWarpper, {
  				click:true,
  				probeType: 3// scroll滚动来实时监听位置
  			});

  			this.foodScroll.on('scroll', (pos) => {
  				/*在foodscroll监听scroll事件，通过pos传入y轴数据来对比*/
  				this.scrollY = Math.abs(Math.round(pos.y));
  				// console.log(this.scrollY);
  			})
  		},
  		_calculateHeight() {
  			let foodList = this.$refs.foodWarpper.getElementsByClassName('food-list-hook');
  			let height = 0;
  			this.listHeight.push(height);
  			for(let i=0;i<foodList.length;i++) {
  				let item = foodList[i];
  				height += item.clientHeight;
  				this.listHeight.push(height);
  			}
  			// console.log(this.listHeight);
  		},
  		_drop(target) {
  			this.$refs.shopcart.drop(target);
  		},
      selectFoodShow(food) {
        this.isShow = true;
        //console.log(food);
        this.toShowFood = food;
        this.$refs.food._selectFoodShow(this.isShow);
      },
      selectFoodHide(isShow) {
        this.isShow = isShow;
      }
  	},
  	components: {
  		shopcart,
  		cartcontrol,
      food
  	}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin";

	.goods
		position:absolute
		top:174px
		bottom:46px
		width:100%
		display:flex
		overflow:hidden
		.menu-warpper
			flex: 0 0 80px
			width:80px
			background:#f3f5f7
			.menu-item
				display:table
				padding:0 12px
				height:54px
				width:56px
				line-height:14px
				&.current
					position:relative
					z-index:10
					margin-top:-1px
					background:#fff
					.text
						border-none()
						font-weight:700
				.icon
					display:inline-block
					vertical-align:top
					width:12px
					height:12px
					margin-right:2px
					background-size:12px 12px
					background-repeat:no-repeat
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')				
				.text
					display:table-cell
					width:56px
					vertical-align:middle
					font-size:12px
					border-1px(rgba(7,17,27,0.1))
		.food-warpper
			flex:1
			.title
				padding-left:14px
				height:26px
				line-height:26px
				border-left:2px solid #d9dde1
				font-size:12px
				color:rgb(147,153,159)
				background:#f3f5f7
			.food-item
				display:flex
				margin:18px
				padding-bottom:18px
				border-1px(rgba(7,17,27,0.1))
				&:last-child
					border-none()
					margin-bottom:0
				.icon
					flex:0 0 57px
					margin-right:10px
				.content
					flex:1
					.name
						margin:2px 0 8px
						font-size:14px
						line-height:14px
						color:rgb(7,17,27)
					.descrition,.extra
						/*margin-bottom:8px*/
						font-size:10px
						line-height:12px
						color:rgb(147,153,159)
					.extra
						.count
							margin-right:12px
					.price
						font-weight:700
						line-height:24px
						.now
							margin-right:8px
							font-size:14px
							color:rgb(240,20,20)
						.old
							text-decoration:line-through
							font-size:10px
							color:rgb(147,153,159)
					.cartcontrol-warpper
						position:absolute
						right:0
						bottom:12px
</style>
