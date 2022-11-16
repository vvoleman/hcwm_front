import {createRouter, createWebHistory} from 'vue-router'
import ZoteroList from "@/views/ZoteroList";
import DataGraphs from "@/views/DataGraphs";
import AboutProject from "@/views/AboutProject";
import i18n from "@/plugins/i18n/i18n";

const routes = [
	{
		path: '/graphs',
		component: DataGraphs,
		name: i18n.global.t('ui.pages.graphs.title')
	},
	{
		path: '/about',
		component: AboutProject,
		name: i18n.global.t('ui.pages.about.title')
	},
	{
		path: '/:pathMatch(.*)*',
		component: ZoteroList,
		name: i18n.global.t('ui.pages.collections.title')
	},
]

const router = createRouter({
	// 4. Provide the history implementation to use. We are using the hash history for simplicity here.
	history: createWebHistory(),
	routes, // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
	document.title = `${to.name} | HCWM`
	next();
});

export default router