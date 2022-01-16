import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { store } from './script/store'


import ObjectView from './views/user/object/ObjectView.vue';
import UnitView from './views/user/unit/UnitView.vue';
import CustomerView from './views/user/customer/CustomerView.vue';
import SupplierView from './views/user/supplier/SupplierView.vue';
import ImportView from './views/user/import/ImportView.vue';
import ExportView from './views/user/export/ExportView.vue';

import StorageView from './views/admin/storage/StorageView.vue';
import MessageView from './views/admin/message/MessageView.vue';

import AuthorizeIndexView from './views/authorize/AuthorizeIndexView.vue';
import LoginView from './views/authorize/LoginView.vue';
import RegisterView from './views/authorize/RegisterView.vue';

import UserIndexView from './views/user/UserIndexView.vue';
import AdminIndexView from './views/admin/AdminIndexView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/authorize', component: AuthorizeIndexView, children: [
      {
        path: '/login',
        component: LoginView
      },
      {
        path: '/register',
        component: RegisterView
      },
      {
        path: '/',
        redirect: '/login'
      }
    ]
  },
  {
    path: '/admin',
    component: AdminIndexView,
    children: [
      {
        path: '/storage',
        component: StorageView
      },
      {
        path: '/message',
        component: MessageView
      },
      {
        path: '/',
        redirect: '/storage'
      }
    ]
  },
  {
    path: '/app',
    component: UserIndexView,
    children: [
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
        path: '/export',
        component: ExportView
      }
    ]
  }, {
    path: '/:pathMatch(.*)*',
    redirect: '/authorize'
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

Vue.config.productionTip = false
Vue.prototype.$store = store;
Vue.prototype.$currentOrigin = `http://${window.location.hostname}:3000`;
store.action.setCurrentOrigin(Vue.prototype.$currentOrigin);
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
