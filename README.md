# elemeApp
饿了么APP/vue2.0
初次学习vue2.0，从1.0的文档升迁练习之后打算做一个实战的项目，因此选择高仿一个饿了么的外卖APP
本次高仿项目主要用到
vue2.0 vue-router vue-resource(2.0已经不更新，替换为axios) vuex mock数据(mock.js效果会更好，但是没有高仿性) localStorage
ECMAScript-6手写笔
项目中遇到问题解决:
   1：vue2.0解决vue-router切换之间缓存问题，1.0的keep-alive属性替换为包裹在视图外层的组件，通过main.js配置路由来解决
   2：通过localStorage解决刷新页面，丢失收藏状态，以及不同商家显示应对收藏状态
   3：组件间复杂通信，解决父子间组件通信，以及兄弟间通信等复杂交互问题
   4：利用betterScroll解决移动端滑屏，和商家图片展示横向滑屏
   5：利用vue强大生命周期hook子功能，解决筛选评论之后当前页betterScroll重新刷新问题
下一步项目计划：
   多米音乐APP
