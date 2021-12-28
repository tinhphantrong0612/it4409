import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'


import ObjectView from './views/object/ObjectView.vue';
import UnitView from './views/unit/UnitView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/object',
    component: ObjectView
  },
  {
    path: '/unit',
    component: UnitView
  },
  {
    path: '/',
    redirect: '/object'
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
