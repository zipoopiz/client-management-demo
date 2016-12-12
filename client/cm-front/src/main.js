// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Element from 'element-ui'
import App from './App'
import './assets/css/reset.css'
import 'element-ui/lib/theme-default/index.css'

Vue.config.debug = true
Vue.use(Element)
Vue.http.options.root = 'http://localhost:8080/cm'

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
