import {defineStore} from "pinia";
import axios from "axios";
import {API_ENDPOINT} from "@/logics/variables";
import {useTrashStore} from "@/stores/Trash/TrashStore";

export const useRegionStore = defineStore('RegionStore', {
	state: () => {
		return {
			regions: {},
			regionsPromise: null
		}
	},
	actions: {
		async load(countryId) {
			let store = useTrashStore()
			// eslint-disable-next-line no-unreachable

			let isSettingForeign = store.promises.region === null
			if (isSettingForeign) {
				this.regionsPromise = axios.get(`${API_ENDPOINT}/geography/country/${countryId}`)
				store.promises.region = this.regionsPromise
			} else {
				this.regionsPromise = store.promises.region
			}

			const response = await this.regionsPromise

			if (response.status === 200) {
				let id = response.data.data.country_id
				this.regions[id] = response.data.data.regions
				store.country[id] = response.data.data.trashes
			}

			if (isSettingForeign) {
				store.promises.region = null
			}
			this.regionsPromise = null
		},
		async getAllRegions(countryId) {
			if(Object.keys(this.regions).length === 0) {
				await this.loadOrAwait(countryId)
			}

			if(this.regions[countryId] !== undefined) {
				return this.regions[countryId]
			}

			return null
		},
		async getRegion(countryId, regionId){
			if(Object.keys(this.regions).length === 0) {
				await this.loadOrAwait(countryId)
			}

			if(this.regions[countryId] !== undefined) {
				let found = this.regions[countryId].filter(region => region.region_id === regionId)

				return found.length === 1 ? found[0] : null
			}
			return null
		},

		async loadOrAwait(id) {
			if (this.regionsPromise === null) {
				await this.load(id)
			} else {
				await this.regionsPromise
			}
		}
	}
})