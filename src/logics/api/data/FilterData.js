class FilterData {

	query = null;
	currentFolder = null;
	categories = [];
	languages = [];
	usedLanguage = null;

	getDataObject() {
		return {
			query: this.query,
			currentFolder: this.currentFolder,
			categories: this.categories,
			languages: this.languages,
			usedLanguage: this.usedLanguage
		}
	}

}

export default FilterData