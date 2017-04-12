<template>
  <div ref="sellerInfoWrapper" class="seller-wrapper">
	  <div class="seller-content">
	  	<div class="seller-title">
		  	<div class="main-info">
		  		<h2 class="title">{{seller.name}}</h2>
		  		<div class="scoreInfo">
		  			<star class="star" :score="seller.score" :size="36"></star>
		  			<span class="scoreAll">({{seller.ratingCount}})</span>
		  			<span class="sellCount">月售{{seller.sellCount}}单</span>
		  		</div>
		  		<div class="favorite">
		  			<div class="icon icon-favorite" :class="isColor" @click="toggleFav"></div>
		  			<span class="text">{{isFav}}</span>
		  		</div>
		  	</div>
	  		<div class="shopInfo">
	  			<div class="minPrice">
	  				<h3 class="title">起送价</h3>
	  				<div class="price">{{seller.minPrice}}<span class="smalltext">元</span></div>
	  			</div>
	  			<div class="send">
	  				<h3 class="title">商家配送</h3>
	  				<div class="price">{{seller.deliveryPrice}}<span class="smalltext">元</span></div>
	  			</div>
	  			<div class="sendTime">
	  				<h3 class="title">平均配送时间</h3>
	  				<div class="price">{{seller.deliveryTime}}<span class="smalltext">分钟</span></div>
	  			</div>
	  		</div>
	  	</div>
	  	<div class="lines"></div>
			<div class="bulletinInfo">
				<h2 class="title">公告与活动</h2>
				<p class="bulletin">{{seller.bulletin}}</p>
			</div>
			<div class="supportsInfo">
				<ul>
					<li v-for="(item,index) in seller.supports" class="support">
						<span class="icon" :class="classMap[seller.supports[index].type]"></span>
						<span class="text">{{seller.supports[index].description}}</span>
					</li>
				</ul>
			</div>
			<div class="lines"></div>
			<div class="sellerPics">
				<h2 class="title">商家实景</h2>
				<div ref="picList" class="pic-list">
					<ul class="list-wrapper" :style="{'width':getWidth}">
						<li v-for="pic in seller.pics" class="pic">
							<img :src="pic"/>
						</li>
					</ul>
				</div>
			</div>
			<div class="lines"></div>
			<div class="sellerInfo">
				<h2 class="title">商家信息</h2>
				<ul>
					<li v-for="info in seller.infos" class="info">{{info}}</li>
				</ul>
			</div>
		</div>
  </div>
</template>

<script type="ecmascript-6/text">
	import BScroll from 'better-scroll';
	import star from '../../components/star/star';
	import {saveToLocal,loadFromLocal} from '../../common/js/store.js';

  export default {
  	props: {
  		seller: {
  			type: Object
  		}
  	},
  	data() {
  		return {
  			isfavorite: (() => {
  				return loadFromLocal(this.seller.id,'favorite',false);
  			})()
  		}
  	},
  	computed: {
  		getWidth: function() {
  			return this.seller.pics.length*126 - 6 + 'px';
  		},
  		isFav: function() {
  			return this.isfavorite?'已收藏':'未收藏';
  		},
  		isColor: function() {
  			return this.isfavorite?'redIcon':'';
  		}
  	},
  	methods: {
  		toggleFav(event) {
  			if(!event._constructed) {
  				return;
  			};
  			this.isfavorite = !this.isfavorite;
  			saveToLocal(this.seller.id,'favorite',this.isfavorite);
  		},
  		fashDom() {
				if(!this.scroll){
					//this.$refs.sellerInfoWrapper.style.height = this.$refs.sellerInfoWrapper.offsetHeight + 'px';
          this.scroll = new BScroll(this.$refs.sellerInfoWrapper,{
            click : true
          });
        }else {
          this.scroll.refresh();
        };
			},
			fashDomX() {
				if(!this.Picscroll){
					this.$refs.picList.style.width = this.$refs.picList.offsetWidth + 'px';
          this.Picscroll = new BScroll(this.$refs.picList,{
            click : true,
          	scrollX : true
          });
        }else {
          this.Picscroll.refresh();
        };
			}
  	},
  	created() {
  		this.classMap = ['decrease','discount','special','invoice','guarantee'];
  		this.$nextTick(() => {
  			this.fashDom();
  			this.fashDomX();
  		});
  	},
  	components: {
  		star
  	}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin";
	.seller-wrapper
		width:100%
		position:absolute
		top:174px
		bottom:0px
		overflow:hidden
		.seller-title
			box-sizing:border-box
			padding:0 18px
			width:100%
			font-size:0
			.main-info
				box-sizing:border-box
				padding:18px 0
				width:100%
				position:relative
				border-1px(rgba(147,153,159,0.2))
				.title
					margin-bottom:8px
					font-size:10px
					color:rgb(7,17,27)
					line-height:14px
				.scoreInfo
					.star
						vertical-align:top
						display:inline-block
						margin-right:8px
					.scoreAll,.sellCount
						font-size:10px
						color:rgb(77,85,93)
						line-height:18px
					.scoreAll
						margin-right:12px
				.favorite
					position:absolute
					top:18px
					right:0
					text-align:center
					.icon
						font-size:24px
						color:rgb(147,153,159)
						line-height:24px
						margin-bottom:4px
						&.redIcon
							color:rgb(240,20,20)
					.text
						font-size:10px
						color:rgb(77,85,93)
						line-height:10px
			.shopInfo
				display:flex
				width:100%
				padding:18px 0
				.minPrice,.send,.sendTime
					flex:1
					text-align:center
					border-right:1px solid rgba(147,153,159,0.2)
					.title
						font-size:10px
						color:rgb(147,153,159)
						line-height:10px
						margin-bottom:4px
					.price
						font-size:24px
						font-weight:200
						color:rgb(7,17,27)
						line-height:24px
						.smalltext
							font-size:10px
							color:rgb(147,153,159)
							line-height:10px
				.sendTime
					border:none
		.lines
				width:100%
				height:16px
				background-color:#f3f5f7
				border-top:1px solid rgba(7,17,27,0.1)
				border-bottom:1px solid rgba(7,17,27,0.1)
		.bulletinInfo
			box-sizing:border-box
			width:100%
			padding:18px 18px 16px
			.title
				margin-bottom:8px
				font-size:14px
				color:rgb(7,17,27)
				line-height:14px
			.bulletin
				padding:0 12px
				font-size:12px
				font-weight:200
				color:rgb(240,20,20)
				line-height:24px
		.supportsInfo
			box-sizing:border-box
			width:100%
			padding:0 18px
			.support
				box-sizing:border-box
				width:100%
				padding:16px 12px
				border-top:1px solid rgba(7,17,27,0.1)
				font-size:0
				.icon
					display:inline-block
					vertical-align:top
					width:16px
					height:16px
					margin-right:6px
					background-size:16px 16px
					background-repeat:no-repeat
					&.decrease
						bg-image('decrease_4')
					&.discount
						bg-image('discount_4')
					&.guarantee
						bg-image('guarantee_4')
					&.invoice
						bg-image('invoice_4')
					&.special
						bg-image('special_4')
				.text
					line-height:16px
					font-size:12px
					font-weight:200
					color:rgb(7,17,27)
		.sellerPics
			box-sizing:border-box
			width:100%
			padding:18px
			overflow:hidden
			.title
				margin-bottom:8px
				font-size:10px
				color:rgb(7,17,27)
				line-height:14px
			.pic-list
				height:90px
				.list-wrapper
					.pic
						display:inline-block
						width:120px
						height:90px
						margin-right:6px
						&:last-child
							margin-right:0
						img
							width:100%
							height:100%
		.sellerInfo
			box-sizing:border-box
			width:100%
			padding:18px
			.title
				margin-bottom:8px
				font-size:14px
				color:rgb(7,17,27)
				line-height:14px
			.info
				box-sizing:border-box
				width:100%
				padding:16px 12px
				border-top:1px solid rgba(7,17,27,0.1)
				font-size:12px
				font-weight:200
				color:rgb(7,17,27)
				line-height:16px
</style>
