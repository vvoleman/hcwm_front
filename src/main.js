import { createApp } from 'vue'
import router from '@/router/index'
import i18n from '@/plugins/i18n/i18n'
import vClickOutside from "click-outside-vue3"
import Notifications from '@kyvg/vue3-notification'
import Donut from 'vue-css-donut-chart';

import { createPinia } from 'pinia'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import 'vue-css-donut-chart/dist/vcdonut.css';

import App from '@/App.vue'

createApp(App)
	.use(router)
	.use(i18n)
	.use(Notifications)
	.use(vClickOutside)
	.use(createPinia())
	.use(Donut)
	.mount('#app')
