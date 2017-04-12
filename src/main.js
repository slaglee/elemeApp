// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';

import './common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.config.productionTip = false;
/* eslint-disable no-new */
/* eslint-disable */
const router = new VueRouter({
	routes : [
		{path: '/goods',component: goods,mate: {keepAlive : true}},
		{path: '/ratings',component: ratings,mate: {keepAlive : true}},
		{path: '/seller',component: seller,mate: {keepAlive : true}}
	],
	linkActiveClass:'active'
});

new Vue({
  el: '#app',
  router,
  data: {
  	eventHub: new Vue()
  },
  template: '<App/>',
  components: { App }
});

router.push('/goods')// 1.0-router.go()
