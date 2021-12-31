import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { store } from './script/store'


import ObjectView from './views/object/ObjectView.vue';
import UnitView from './views/unit/UnitView.vue';
import CustomerView from './views/customer/CustomerView.vue';
import SupplierView from './views/supplier/SupplierView.vue';
import ImportView from './views/import/ImportView.vue';

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
    path: '/customer',
    component: CustomerView
  },
  {
    path: '/supplier',
    component: SupplierView
  },
  {
    path: '/import',
    component: ImportView
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
Vue.prototype.$store = store;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
