import {defineStore} from "pinia";

import {useTrashStore} from "@/stores/Trash/TrashStore";
import {useRegionStore} from "@/stores/Geography/RegionStore";
import {useDistrictStore} from "@/stores/Geography/DistrictStore";
import {useCountryStore} from "@/stores/Geography/CountryStore";

export const useGeographyStore = defineStore('GeographyStore', {
	state: () => {
		return {
			names: {
				country: {},
				region: {},
				district: {}
			},
			ids: {
				'country': 'region',
				'region': 'district',
				'district': 'district'
			}
		}

	},
	actions: {
		async getGeography(type, id) {
			switch (type) {
				case 'country':
					return await useRegionStore().getAllRegions(id)
				case 'region':
					return await useDistrictStore().getAllDistricts(id)
				case 'district':
					return await useDistrictStore().getAllDistricts(id)
			}
		},
		findIn(key, value, array) {
			for (const item of array) {
				if (item[key] === value) {
					return item
				}
			}
			return null
		},
		flatten(array) {
			let temp = []
			const keys = Object.keys(array)
			for (const key of keys) {
				let items = array[key]
				for (const item of items) {
					temp.push(item)
				}
			}

			return temp;
		},
		cacheName(type, id) {
			if (this.names[type][id] !== undefined) {
				return this.names[type][id]
			}

			let result;
			switch (type) {
				case 'country':
					result = this.findIn('country_id', id, useCountryStore().countries);
					break;
				case 'region':
					result = this.findIn('region_id', id, this.flatten(useRegionStore().regions));
					break;
				case 'district':
					result = this.findIn('district_id', id, this.flatten(useDistrictStore().districts));
					break;
			}
			if (result === null) return '';

			this.names[type][id] = result['name']
			return result['name']
		},
		getName(type, id, alt = false) {
			const allowed = ['country', 'region', 'district']

			if (allowed.filter(x => x === type).length === 0) {
				console.error(`Trash for ${type} not allowed. Can't get its name`)
				return {}
			}

			return ((alt && type === 'district') ? 'ORP ' : '') + this.cacheName(type, id)
		}
		,
		async getTrashSwitch(type, id) {
			switch (type) {
				case 'country':
					return await useTrashStore().getTrashesOfType('region', id)
				case 'region':
					return await useTrashStore().getTrashesOfType('district', id)
				case 'district':
					return await useTrashStore().getTrashesOfType('district', id)
			}
		},
		getTrashesInYear(trashes, year) {
			let results = {records: {}}
			const keys = Object.keys(trashes)
			let sum = 0;
			for (const key of keys) {
				results.records[key] = trashes[key][year]
				sum += results.records[key]
			}

			results.sum = sum

			return results
		},
		async getGeographyWithTrashes(type, id, year) {
			if (!this.isTypeAllowed(type)) {
				return null
			}

			const geographies = await this.getGeography(type, id)

			let results = []

			// const trashes = await getTrashesOfRegions(id)
			const trashes = await this.getTrashSwitch(type, id)
			console.log(trashes, geographies, this.ids[type] + '_id')
			for (const geography of geographies) {
				results.push({
					name: geography.name,
					id: geography[this.ids[type] + '_id'],
					parent: geography.parent_id,
					trashes: this.getTrashesInYear(trashes[geography[this.ids[type] + '_id']], year),
					coords: geography.coords
				})
			}

			return results;
		}
		,
		isTypeAllowed(type) {
			const allowed = ['country', 'region', 'district']

			const result = allowed.filter(x => x === type).length === 0

			if (result) {
				console.error(`Trash for ${type} not allowed`)
			}

			return !result
		}
	}
})