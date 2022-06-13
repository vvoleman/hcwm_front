import axios from "axios";
import {API_ENDPOINT} from "@/logics/variables";

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

export {getTrashesByDistrict, getRegionsData}