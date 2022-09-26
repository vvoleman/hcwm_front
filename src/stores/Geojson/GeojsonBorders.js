import axios from "axios";
import {API_ENDPOINT} from "@/logics/variables";
import {defineStore} from "pinia";

export const useGeojsonBordersStore = defineStore('GeojsonBordersStore', {
	state: () => {
		return {
			'regions': {},
			'districts': {},
			'promises': {
				'regions': null,
				'districts': {}
			}
		}
	},
	actions: {
		async getDistrictsBorders(id) {
			if (this.districts[id] !== undefined) {
				return this.districts[id]
			}

			if (this.promises.districts[id] === undefined) {
				this.promises.districts[id] = axios.get(`${API_ENDPOINT}/geography/district/borders/${id}`)
			}

			this.promises.districts[id] = axios.get(`${API_ENDPOINT}/geography/district/borders/${id}`)
			const response = await this.promises.districts[id]

			this.promises.districts[id] = undefined

			if (response.status === 200) {
				this.districts[id] = response.data.data

				return this.districts[id]
			} else {
				return null;
			}

		},
		async getRegionsBorders() {
			if (Object.keys(this.regions).length !== 0) {
				return this.regions
			}


			if (this.promises.regions === null) {
				this.promises.regions = axios.get(`${API_ENDPOINT}/geography/region/borders`)
			}

			const response = await this.promises.regions

			this.promises.regions = null

			if (response.status === 200) {
				this.regions = response.data.data;
				return this.regions
			} else {
				return null;
			}
		}
	}
})