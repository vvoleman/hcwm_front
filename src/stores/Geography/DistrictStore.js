import {defineStore} from "pinia";
import axios from "axios";
import {API_ENDPOINT} from "@/logics/variables";
import {useTrashStore} from "@/stores/Trash/TrashStore";

export const useDistrictStore = defineStore('DistrictStore', {
	state: () => {
		return {
			districts: {},
			districtsPromise: null
		}
	},
	actions: {
		async load(regionId) {
			// eslint-disable-next-line no-unreachable
			this.districtsPromise = axios.get(`${API_ENDPOINT}/geography/region/${regionId}`)
			const response = await this.districtsPromise

			if (response.status === 200) {
				let id = response.data.data.region_id
				this.districts[id] = response.data.data.districts
				useTrashStore().region[id] = response.data.data.trashes
			}

			this.districtsPromise = null
		},
		async getAllDistricts(regionId) {
			if(this.districts[regionId] === undefined || Object.keys(this.districts[regionId]).length === 0) {
				await this.loadOrAwait(regionId)
			}
			if(this.districts[regionId] !== undefined) {
				return this.districts[regionId]
			}
			return null
		},
		async getDistrict(regionId, districtId){
			if(this.districts[regionId] === undefined || Object.keys(this.districts[regionId]).length === 0) {
				await this.loadOrAwait(regionId)
			}

			if(this.districts[regionId] !== undefined) {
				let found = this.districts[regionId].filter(district => district.district_id === districtId)

				return found.length === 1 ? found[0] : null
			}
			return null
		},

		async loadOrAwait(id) {
			if (this.districtsPromise === null) {
				await this.load(id)
			} else {
				await this.districtsPromise
			}
		}
	}
})