import {API_ENDPOINT} from "@/logics/variables";

async function downloadTable(id, url, name) {
	console.log("downloadTable", id, url, name);
	window.open(`${API_ENDPOINT}/spreadsheet/${id}/${url}`, '_blank')

}

export {downloadTable}