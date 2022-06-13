class FilterData {

	query = null;
	currentFolder = null;
	categories = [];
	languages = [];

	getDataObject() {
		return {
			query: this.query,
			currentFolder: this.currentFolder,
			categories: this.categories,
			languages: this.languages,
		}
	}

}

export default FilterData