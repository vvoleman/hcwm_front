import {
	getDistricts,
	getRegions,
	getTrashesOfDistricts,
	getTrashesOfRegions,
	isTypeAllowed
} from "@/logics/api/geography/basic";

const ids = {
	'country': 'region',
	'region': 'district',
	'district': 'district'
}

async function getGeographyWithTrashes(type, id, year) {
	if (!isTypeAllowed(type)) {
		return null
	}

	const geographies = await getGeography(type, id)

	let results = []

	// const trashes = await getTrashesOfRegions(id)
	const trashes = await getTrashSwitch(type, id)
	for (const geography of geographies) {
		results.push({
			name: geography.name,
			id: geography[ids[type]+'_id'],
			parent: geography.parent_id,
			trashes: getTrashesInYear(trashes[geography[ids[type]+'_id']],year),
			coords: geography.coords
		})
	}

	return results;


}

function getTrashesInYear(trashes, year) {
	let results = {records:{}}
	const keys = Object.keys(trashes)
	let sum = 0;
	for (const key of keys) {
		results.records[key] = trashes[key][year]
		sum += results.records[key]
	}

	results.sum = sum

	return results
}

function prettify(value, suffix = ' t', precision = 2) {
	return Number.parseFloat(value)
		.toFixed(precision)
		.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
		.replace('.',',')+suffix;
}

async function getGeography(type, id) {
	switch (type) {
		case 'country':
			return await getRegions(id)
		case 'region':
			return await getDistricts(id)
		case 'district':
			return await getDistricts(id)
	}
}

async function getTrashSwitch(type, id) {
	switch (type) {
		case 'country':
			return await getTrashesOfRegions(id)
		case 'region':
			return await getTrashesOfDistricts(id)
		case 'district':
			return await getTrashesOfDistricts(id)
	}
}

export {
	getGeographyWithTrashes,
	prettify
}