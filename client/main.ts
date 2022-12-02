import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHeart as regHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as solidHeart } from '@fortawesome/free-regular-svg-icons'
import { faCompass as regCompass} from '@fortawesome/free-regular-svg-icons'
import { faMessage as regMessage} from '@fortawesome/free-regular-svg-icons'
import { faUser as regUser} from '@fortawesome/free-regular-svg-icons'
import { faGear as gear} from '@fortawesome/free-solid-svg-icons'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
Vue.use(VueCal);

library.add(regHeart, solidHeart, regCompass, regMessage, regUser, gear)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
