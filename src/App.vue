<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由外链 -->
    <keep-alive><router-view :seller="seller"></router-view></keep-alive>
  </div>
</template>

<script type="ecmascript-6/text">
  import header from './components/header/header.vue';
  import {urlParse} from './common/js/util.js';

  const ERR_OK = 0;

  export default {
    data () {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            //console.log(queryParam);
            return queryParam.id;
          })()
        }
      };
    },
    created () {
      this.$http.get('/api/seller?id='+this.seller.id).then((response) => {
        response = response.body;// 此处已经更改为body为OBJ对象
        if (response.errno === ERR_OK) {
          //this.seller = response.data;
          // console.log(response);
          this.seller = Object.assign({},this.seller,response.data)
          //vue扩展属性,不然数据本身没有id，会造成数据把id覆盖掉
          //console.log(this.seller.id);
        };
      });
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl" 

  .tab
    display:flex
    width:100%
    height:40px
    line-height:40px
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex:1
      text-align:center
      &>a
        display:block
        font-size:14px
        color:rgb(77,85,93)
        &.active
          color:rgb(240,20,20)
</style>
