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
					language: code,
					item: item
				}
			})
			console.log(this.translationsPromise)
			const response = await this.translationsPromise

			if (response.status === 200) {
				this.translations[hashed] = response.data.data.translation
			}
			this.translationsPromise[hashed] = null
		},
		async loadOrAwait(item,code,hashed) {
			if(this.translationsPromise[hashed] === null || this.translationsPromise[hashed] === undefined) {
				await this.load(item, code, hashed)
			} else {
				await this.translationsPromise
			}
		},
		async translate(item,code) {
			console.log(item,code)
			let hashed = this.hash(item,code)
			if(this.translations[hashed] === undefined) {
				console.log(this.translations[hashed])
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

			let defaultFallback = this.getTranslation(texts, 'cs');

			if (defaultFallback !== undefined) {
				console.log('No translation for ' + code + ' found, using cs instead');
				return defaultFallback
			}

			console.error('No translations found');
		},
		hash(text, code){
			return simpleHash(text+code)
		}
	},
})