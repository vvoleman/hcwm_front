import {defineStore} from "pinia";
import axios from "axios";
import {API_ENDPOINT} from "@/logics/variables";

export const useAssetStore = defineStore('ZoteroAssetStore', {
	state: () => {
		return {
			categories: [],
			categoriesPromise: null,
			languages: [],
			languagesPromise: null,
		}
	},
	actions: {
		async loadCategories() {
			this.categoriesPromise = axios.get(`${API_ENDPOINT}/assets/categories`)
			const response = await this.categoriesPromise

			if (response.status === 200) {
				this.categories = response.data.data
			}
			this.categoriesPromise = null
		},
		async loadOrAwaitCategories() {
			if(this.categoriesPromise === null) {
				await this.loadCategories()
			} else {
				await this.categoriesPromise
			}
		},
		async loadLanguages() {
			this.languagesPromise = axios.get(`${API_ENDPOINT}/assets/languages`)

			try {
				const response = await this.languagesPromise
				if (response.status === 200) {
					this.languages = response.data.data
				}
			} catch (e) {
				console.error('Unable to retrieve languages')
				this.languages = []
			}


			this.languagesPromise = null
		},
		async loadOrAwaitLanguages() {
			if(this.languagesPromise === null) {
				await this.loadLanguages()
			} else {
				await this.languagesPromise
			}
		}
	},
	getters: {
		async allCategories(){
			if (this.categories.length === 0) {
				await this.loadOrAwaitCategories()
			}

			return this.categories
		},
		async allLanguages(){
			if (this.languages.length === 0) {
				await this.loadOrAwaitLanguages()
			}

			return this.languages
		}
	}
})