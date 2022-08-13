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
	}
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

async function getDistricts(regionId) {
	if (store.getDistricts[regionId] !== undefined) {
		return store.getDistricts[regionId]
	}

	const response = await axios.get(`${API_ENDPOINT}/geography/region/${regionId}`)

	if (response.status === 200) {
		store.getDistricts[regionId] = response.data.data.districts
		store.trashes.region = response.data.data.trashes

		return response.data.data.districts;
	} else {
		return null;
	}
}

async function getTrash(type, id) {
	const allowed = ['country', 'region', 'district']

	if (allowed.filter(x=>x===type).length === 0) {
		console.error(`Trash for ${type} not allowed`)
		return {}
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
	console.log(type, id, store.names)
	return result['name']
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
	getName
}