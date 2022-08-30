import axios from "axios";
import {API_ENDPOINT} from "@/logics/variables";

async function getRegionsBorders() {
	const response = await axios.get(`${API_ENDPOINT}/geography/region/borders`)

	if (response.status === 200) {

		return response.data.data;
	} else {
		return null;
	}
}

async function getDistrictsBorders(id) {
	const response = await axios.get(`${API_ENDPOINT}/geography/district/borders/${id}`)

	if (response.status === 200) {

		return response.data.data;
	} else {
		return null;
	}
}

export {
	getRegionsBorders,
	getDistrictsBorders
}