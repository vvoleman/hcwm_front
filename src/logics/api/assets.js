import axios from "axios";
import {API_ENDPOINT} from "@/logics/variables";

let languages = []

async function loadCategories() {

	const response = await axios.get(`${API_ENDPOINT}/assets/categories`)

	if(response.status !== 200){
		console.error('API error cannnot load categories');
		return;
	}

	localStorage.setItem('_categories', JSON.stringify(response.data.data))

	return response.data.data;
}

async function getLanguages() {
	if(languages.length > 0) return languages;
	const response = await axios.get(`${API_ENDPOINT}/assets/languages`)

	languages = response.data.data;

	return response.data.data

}


async function getDistricts(){
	let districts = localStorage.getItem('_districts');

	if(districts !== null) return JSON.parse(districts);

	const response = await axios.get(`${API_ENDPOINT}/assets/districts`)

	localStorage.setItem('_districts', JSON.stringify(response.data.data))

	return response.data.data
}

export { loadCategories, getLanguages, getDistricts }