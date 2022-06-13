import { createRouter, createWebHistory } from 'vue-router'
import ZoteroList from "@/views/ZoteroList";
import DataGraphs from "@/views/DataGraphs";

const routes = [
	{ path: '/graphs', component: DataGraphs },
	{ path: '/:pathMatch(.*)*', component: ZoteroList },
]

const router = createRouter({
	// 4. Provide the history implementation to use. We are using the hash history for simplicity here.
	history: createWebHistory(),
	routes, // short for `routes: routes`
})

export default router