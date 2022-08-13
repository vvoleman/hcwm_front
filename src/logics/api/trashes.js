import axios from "axios";
import {API_ENDPOINT} from "@/logics/variables";

let store = {
	'getRegionDetails':{},
	'getCountryData':null
}

async function getTrashesByDistrict(districtCode) {
	const response = await axios.get(`${API_ENDPOINT}/statistic/getTrashByDistrict`,{
		params: {
			district_id: districtCode
		}
	})

	if(response.status === 200) {
		return response.data.data;
	} else {
		return null;
	}
}

async function getRegionsData() {
	const response = await axios.get(`${API_ENDPOINT}/statistic/getRegionsData`);

	if(response.status === 200) {
		return response.data.data;
	} else {
		return null;
	}
}

async function getRegionDetails(regionId) {
	if(store.getRegionDetails[regionId] !== undefined) {
		return store.getRegionDetails[regionId]
	}

	const response = await axios.get(`${API_ENDPOINT}/statistic/getRegionDetails`, {
		params: {
			region_id: regionId
		}
	});

	if(response.status === 200) {
		store.getRegionDetails[regionId] = response.data.data;

		return response.data.data;
	} else {
		return null;
	}
}

async function getCountryData() {
	if(store.getCountryData !== null) {
		return store.getCountryData
	}

	const response = await axios.get(`${API_ENDPOINT}/statistic/getCountryData`, );

	if(response.status === 200) {
		store.getCountryData = response.data.data;

		return response.data.data;
	} else {
		return null;
	}
}

export {getTrashesByDistrict, getRegionsData, getRegionDetails, getCountryData}