import {defineStore} from "pinia";
import axios from "axios";
import {API_ENDPOINT} from "@/logics/variables";
import {toRaw} from "vue";
// import axios from "axios";
// import {API_ENDPOINT} from "@/logics/variables";

export const useTrashStore = defineStore('TrashStore', {
	state: () => {
		return {
			'country': {},
			'region': {},
			'district': {},
			'promises': {
				'country': null,
				'region': null,
				'district': null,
				'ofType': {
					'country': null,
					'region': null,
					'district': null,
				},
				'legend': null
			},
			'legend': {},
			'colors': {},
		}
	},
	actions: {
		async load(type, id) {
			this.promises[type] = axios.get(`${API_ENDPOINT}/geography/${type}/${id}`)
			const response = await this.promises[type]

			if (response.status === 200) {
				this[type][id] = response.data.data.trashes
			}
			this.promises[type] = null
		},
		async loadOrAwait(type, id) {
			if (this.promises[type] === null) {
				await this.load(type, id)
			} else {
				await this.promises[type]
			}
		},
		isTypeAllowed(type) {
			const allowed = ['country', 'region', 'district']

			const result = allowed.filter(x => x === type).length === 0

			if (result) {
				console.error(`Trash for ${type} not allowed`)
			}

			return !result
		},
		async getTrash(type, id) {
			if (!this.isTypeAllowed(type)) return null;

			if (this.getType(type)[id] === undefined) {
				await this.loadOrAwait(type, id)
			}

			let result = this.getType(type)[id]
			if (result !== undefined) {
				return toRaw(result)
			}

			return null
		},
		async getTrashesOfType(type, id) {
			if (this.promises.ofType[type] === null) {
				this.promises.ofType[type] = axios.get(`${API_ENDPOINT}/geography/${type}/parent/${id}`)
			}

			let response = await this.promises.ofType[type]
			let result
			if (response.status === 200) {
				result = {}
				for (const area of response.data.data) {
					let areaId = area[type + '_id']
					if (this[type][areaId] === undefined) {
						this[type][areaId] = {}
					}
					this[type][areaId] = area.trashes
					result[areaId] = area.trashes
				}
			} else {
				result = null;
			}

			this.promises.ofType[type] = null

			return result
		},
		getType(type) {
			switch (type) {
				case 'country':
					return this.country
				case 'region':
					return this.region
				case 'district':
					return this.district
			}
		},
		async getTrashLegend() {
			if (this.promises['legend'] === null) {
				this.promises['legend'] = axios.get(`${API_ENDPOINT}/info/trashes`)
			}

			let response = await this.promises['legend']

			if (response.status === 200) {
				this.legend = response.data.data
				this.legend = {
					allowed: this.legend.allowed,
					others: this.legend.others,
				}
				this.colors = response.data.data.colors

				return this.legend
			} else {
				return null;
			}
		},
		async getColor(id) {
			if (this.colors[id] === undefined) {
				await this.getTrashLegend()
			}

			return this.colors[id]
		}
	}


})