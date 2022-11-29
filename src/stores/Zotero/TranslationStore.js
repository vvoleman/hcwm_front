import {defineStore} from "pinia";
import axios from "axios";
import {API_ENDPOINT} from "@/logics/variables";
import {simpleHash} from "@/logics/hash";

export const useTranslationStore = defineStore('ZoteroTranslationStore', {
	state: () => {
		return {
			translations: {},
			translationsPromise: {}
		}
	},
	actions: {
		async load(item,code,hashed) {
			this.translationsPromise = axios.get(`${API_ENDPOINT}/translate`, {
				params: {
					lang: code,
					item: item
				}
			})
			const response = await this.countriesPromise

			if (response.status === 200) {
				this.translations[hashed] = response.data.data.translation
			}
			this.translationsPromise[hashed] = null
		},
		async loadOrAwait(item,code,hashed) {
			if(this.countriesPromise === null) {
				await this.load(item, code, hashed)
			} else {
				await this.countriesPromise
			}
		},
		async translate(item,code) {
			let hashed = this.hash(item,code)

			if(this.translations[hashed] === undefined) {
				await this.loadOrAwait(item, code, hashed)
			}

			return this.translations[hashed]
		},
		getTranslation(texts, code){
			for (const item of texts) {
				if(item.code === code){
					return item;
				}
			}
			console.error('No translations found');
		},
		hash(text, code){
			return simpleHash(text+code)
		}
	},
})