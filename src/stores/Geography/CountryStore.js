import {defineStore} from "pinia";
import axios from "axios";
import {API_ENDPOINT} from "@/logics/variables";

export const useCountryStore = defineStore('CountryStore', {
	state: () => {
		return {
			countries: [],
			countriesPromise: null
		}
	},
	actions: {
		async load() {
			this.countriesPromise = axios.get(`${API_ENDPOINT}/geography/country`)
			const response = await this.countriesPromise

			if (response.status === 200) {
				this.countries = response.data.data
			}
			this.countriesPromise = null
		},
		async loadOrAwait() {
			if(this.countriesPromise === null) {
				await this.load()
			} else {
				await this.countriesPromise
			}
		}
	},
	getters: {
		async allCountries(){
			if (this.countries.length === 0) {
				await this.loadOrAwait()
			}

			return this.countries
		},
		async getCountry() {
			return async (id) => {
				if (this.countries.length === 0) {
					await this.loadOrAwait()
				}

				let found = this.countries.filter(country => country.country_id === id)
				return found.length === 1 ? found[0] : null
			}

		},
	}
})