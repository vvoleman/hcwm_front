import {defineStore} from "pinia";
import axios from "axios";
import {API_ENDPOINT} from "@/logics/variables";

export const useItemStore = defineStore('ZoteroItemsStore', {
	state: () => {
		return {
			items: [],
			itemsRecent: [],
			itemsPromise: null,
			itemsRecentPromise: null,
			lastFiltered: null,
		}
	},
	actions: {
		async load(filterData) {
			this.itemsPromise = axios.get(`${API_ENDPOINT}/items/`, {
				params: filterData.getDataObject()
			})
			this.lastFiltered = filterData.getDataObject()
			try {
				const response = await this.itemsPromise
				if (response.status === 200) {
					this.items = response.data.data
				}
			} catch (e) {
				console.error('Unable to retrieve items')
				this.items = {'items': [], 'folders': [], 'breadcrumbs': []}
			}

			this.itemsPromise = null
		},
		async loadOrAwait(filterData) {
			if(this.itemsPromise === null) {
				await this.load(filterData)
			} else {
				await this.itemsPromise
			}
		},
		async loadRecent() {
			this.itemsRecentPromise = axios.get(`${API_ENDPOINT}/items/recent`)

			try {
				const response = await this.itemsRecentPromise
				if (response.status === 200) {
					this.itemsRecent = response.data.data
				}
			} catch (e) {
				console.error('Unable to retrieve recent items')
				this.itemsRecent = []
			}

			this.itemsRecentPromise = null
		},
		async loadOrAwaitRecent() {
			if(this.itemsRecentPromise === null) {
				await this.loadRecent()
			} else {
				await this.itemsRecentPromise
			}
		},
		isDirty(filterData){
			if (this.lastFiltered === null) return true

			return filterData.getDataObject() !== this.lastFiltered
		},
		async getFilteredItems(filterData) {
			if (this.isDirty(filterData)) {
				await this.load(filterData)
			} else {
				await this.loadOrAwait(filterData)
			}

			return this.items
		}
	},
	getters: {
		async recentItems(){
			if (this.itemsRecent.length === 0) {
				await this.loadOrAwaitRecent()
			}

			return this.itemsRecent
		},
	}
})