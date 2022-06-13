import axios from "axios";
import {API_ENDPOINT} from "@/logics/variables";

async function getEstimatedItemCount(filterData) {
	const response = await axios.get(`${API_ENDPOINT}/items/count`, {
		params: filterData.getDataObject()
	})
	console.log(response);
	return Math.floor(Math.random() * 100);
}

async function getItems(filterData) {
	const response = await axios.get(`${API_ENDPOINT}/items/`, {
		params: filterData.getDataObject()
	})

	if(response.status === 200) {
		return response.data;
	} else {
		return null;
	}
}

async function getRecent(){
	const response = await axios.get(`${API_ENDPOINT}/items/recent`)

	if(response.status === 200) {
		return response.data.data;
	} else {
		return null;
	}
}

export {getItems, getEstimatedItemCount, getRecent}