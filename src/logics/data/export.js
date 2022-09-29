import * as XLSX from "xlsx";

function exportTableToExcel(table, name, type = 'xlsx'){
	var file = XLSX.utils.table_to_book(table, {sheet: "sheet1"});

	XLSX.write(file, { bookType: type, bookSST: true, type: 'base64' });

	XLSX.writeFile(file, `${name}.${type}`);

	// var downloadLink;
	// var dataType = 'application/vnd.ms-excel';
	// var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
	//
	// // Specify file name
	// filename = filename?filename+'.xls':'excel_data.xls';
	//
	// // Create download link element
	// downloadLink = document.createElement("a");
	//
	// document.body.appendChild(downloadLink);
	//
	// if(navigator.msSaveOrOpenBlob){
	// 	var blob = new Blob(['\ufeff', tableHTML], {
	// 		type: dataType
	// 	});
	// 	navigator.msSaveOrOpenBlob( blob, filename);
	// }else{
	// 	// Create a link to the file
	// 	downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
	//
	// 	// Setting the file name
	// 	downloadLink.download = filename;
	//
	// 	//triggering the function
	// 	downloadLink.click();
	// }
}

export { exportTableToExcel }