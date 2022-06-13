import {API_ENDPOINT} from "@/logics/variables";
import axios from "axios";
import {simpleHash} from "@/logics/hash";

async function getLanguages() {
	const response = await axios.get(`${API_ENDPOINT}/assets/languages`)

	return response.data.data;
/*
	console.log()

	return [
		{
			code: 'cs',
			name: 'čeština',
			flag: '@/assets/images/flags/cs/width_40.png'
		},
		{
			code: 'en',
			name: 'english',
			flag: '@/assets/images/flags/en/width_40.png'
		},
		{
			code: 'de',
			name: 'deutsch',
			flag: '@/assets/images/flags/de/width_40.png'
		},
	]*/

}

function getTranslations(arr, code){
	for (const item of arr) {
		if(item.code === code){
			return item;
		}
	}
	console.error('No translations found');
}

async function translate(code, item) {
	const hashed = simpleHash(code+item+code)

	let translation = localStorage.getItem(`_translation_${hashed}`)

	if(translation) return translation;

	const response = await axios.get(`${API_ENDPOINT}/translate`, {
		params: {
			item: item,
			language: code
		}
	})

	if (response.status === 200) {
		translation = response.data.data.translation

		localStorage.setItem(`_translation_${hashed}`, translation)

		return translation;
	}

	console.error('Cannot get translation for ID: '+item);
}

export { getLanguages, getTranslations, translate }