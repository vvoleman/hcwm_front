import {API_ENDPOINT} from "@/logics/variables";
import axios from "axios";

let store = {
	'getAllCountries':null,
	'getRegions': {},
	'getDistricts': {},
	'trashes': {
		'country': {},
		'region': {},
		'district': {}
	},
	'names': {
		'country': {},
		'region': {},
		'district': {}
	},
	'loading': {
	},
	'trashLegend':null
}

async function getAllCountries() {

	if (store.getAllCountries !== null) {
		return store.getAllCountries
	}
	const response = await axios.get(`${API_ENDPOINT}/geography/country`)

	if (response.status === 200) {
		store.getAllCountries = response.data.data

		return response.data.data;
	} else {
		return null;
	}

}

async function getAllRegions() {
	return store.getRegions
}

async function getRegions(countryId) {
	if (store.getRegions[countryId] !== undefined) {
		return store.getRegions[countryId]
	}

	const response = await axios.get(`${API_ENDPOINT}/geography/country/${countryId}`)

	if (response.status === 200) {
		store.getRegions[countryId] = response.data.data.regions
		store.trashes.country = response.data.data.trashes

		return response.data.data.regions;
	} else {
		return null;
	}

}

async function getTrashesOfRegions(countryId) {
	const response = await axios.get(`${API_ENDPOINT}/geography/region/parent/${countryId}`)

	if (response.status === 200) {
		let result = {}
		for (const region of response.data.data) {
			store.trashes.region[region.region_id] = region.trashes

			result[region.region_id] = region.trashes
		}
		return result
	} else {
		return null;
	}
}

async function getTrashesOfDistricts(regionId) {
	const response = await axios.get(`${API_ENDPOINT}/geography/district/parent/${regionId}`)

	if (response.status === 200) {
		console.log(response.data.data)
		let result = {}
		for (const district of response.data.data) {
			store.trashes.district[district.district_id] = district.trashes

			result[district.district_id] = district.trashes
		}
		return result
	} else {
		return null;
	}
}

async function getDistricts(regionId) {
	if (store.getDistricts[regionId] !== undefined) {
		return store.getDistricts[regionId]
	}

	const response = await axios.get(`${API_ENDPOINT}/geography/region/${regionId}`)

	if (response.status === 200) {
		store.getDistricts[regionId] = response.data.data.districts
		store.trashes.region = response.data.data.trashes
		console.log(response.data.data)

		return response.data.data.districts;
	} else {
		return null;
	}
}

async function getTrashLegend() {
	if (store.trashLegend !== null) {
		return store.trashLegend
	}

	const response = await axios.get(`${API_ENDPOINT}/info/trashes/`)
	if (response.status === 200) {
		store.trashLegend = response.data.data

		return response.data.data;
	} else {
		return null;
	}
}

async function getTrash(type, id) {
	if (!isTypeAllowed(type)) {
		return null
	}

	if (store.trashes[type][id] !== undefined) {
		return store.trashes[type][id]
	}

	const response = await axios.get(`${API_ENDPOINT}/geography/${type}/${id}`)
	if (response.status === 200) {
		store.trashes[type][id] = response.data.data.trashes

		return response.data.data.trashes;
	} else {
		return null;
	}
}

function getName(type, id,) {
	const allowed = ['country', 'region', 'district']

	if (allowed.filter(x=>x===type).length === 0) {
		console.error(`Trash for ${type} not allowed`)
		return {}
	}

	return cacheName(type, id)

}

function findIn(key, value, array) {

	for (const item of array) {
		if (item[key] === value) {
			return item
		}
	}
	return null
}

function cacheName(type, id) {
	if (store.names[type][id] !== undefined) {
		return store.names[type][id]
	}

	let result;
	switch (type) {
		case 'country':
			result = findIn('country_id', id, store.getAllCountries);
			break;
		case 'region':
			result = findIn('region_id', id, flatten(store.getRegions));
			break;
		case 'district':
			result = findIn('district_id', id, flatten(store.getDistricts));
			break;
	}
	if (result === null) return '';

	store.names[type][id] = result['name']
	return result['name']
}

function isTypeAllowed(type) {
	const allowed = ['country', 'region', 'district']

	const result = allowed.filter(x=>x===type).length === 0

	if (result) {
		console.error(`Trash for ${type} not allowed`)
	}

	return !result
}

function flatten(array) {
	let temp = []
	const keys = Object.keys(array)
	for (const key of keys) {
		let items = array[key]
		for (const item of items) {
			temp.push(item)
		}
	}

	return temp;
}

export {
	getAllCountries,
	getRegions,
	getDistricts,
	getTrash,
	getName,
	getAllRegions,
	getTrashesOfRegions,
	getTrashesOfDistricts,
	isTypeAllowed,
	getTrashLegend
}