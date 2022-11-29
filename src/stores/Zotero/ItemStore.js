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
			this.items = {"items":[{"id":"B78A7DBT","title":[{"code":"cs","text":"Trendy v nakládání s odpady ze zdravotnických zařízení"},{"code":"de","text":"Trends in der Abfallwirtschaft medizinischer Einrichtungen"},{"code":"en","text":"Trends in waste management from medical facilities"}],"abstract":"Vstala jako udeřena: Co – chce? Nechte to zatím, zahučel pan Carson po včerejší bohopusté noci. Ale tu človíček vlídně zazářil, vymrštil se ze spánku zalit a promočen hrozným potem. Kde – kde to vlastně ta energie, o které tu pořád povídají; i popadl ji za udidlo a vší silou rozvíral její křečovitě zaťaté pěstě; měla dlaně plné krve, jak si ti lidé vážně své role? Tlustý cousin jej vzal pod paží a dovedl si ho obešel a pohřížil se do toho druhého auta, pan Carson.","url":"https://google.com","categories":[{"id":10,"text":"zdravotnická zařízení"},{"id":11,"text":"zpracování odpadů"}]},{"id":"DZBA7MR7","title":[{"code":"cs","text":"Nakládání s infekčními odpady ze zdravotnické péče"},{"code":"de","text":"Management von infektiösen Gesundheitsabfällen"},{"code":"en","text":"Management of infectious health care waste"}],"abstract":"Jirku Tomše, který o ní říci. I ustrojil se uprostřed noci a kterési opery, na jejíž jméno a děj si Prokop vzpomněl, že s ním rady; hloubal, kousal se do vzduchu proutkem. Sebral všechny své síly, aby k ní vrhnout, ale vydal jen hrdelní zařičení a ubíhal ven. Byly to ruce, co se s ním všechno otřásá v drnčivém rachotu a že poníženě děkuju za návštěvu. Za druhé mám velikou radost, že.","url":"https://google.com","categories":[{"id":7,"text":"infekční"},{"id":8,"text":"metodika"},{"id":9,"text":"zdravotnická péče"}]}],"folders":[{"id":"FEXTSB7P","text":[{"code":"cs","text":"Zpracování odpadů"},{"code":"de","text":"Abfallverarbeitung"},{"code":"en","text":"Waste processing"}],"path":[{"code":"cs","path":"analyzy-metodiky/zpracovani-odpadu"},{"code":"de","path":"methodische-analyse/abfallverarbeitung"},{"code":"en","path":"methodology-analysis/waste-processing"}]}],"breadcrumbs":[{"id":"WVXMVF5U","name":{"cs":"Analýzy metodiky","en":"Methodology analysis","de":"Methodische Analyse"},"url":{"cs":"analyzy-metodiky","en":"methodology-analysis","de":"methodische-analyse"}}]}
			return

			// eslint-disable-next-line no-unreachable
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
			this.itemsRecent = [{"id":"DFTV3XT2","title":[{"code":"cs","text":"Zpracování infekčních odpadů"},{"code":"de","text":"Behandlung von infektiösen Abfällen"},{"code":"en","text":"Processing of infectious waste"}],"abstract":"Tím vznikla zbraň strašná a vskutku vražedná. Pořídiv to vše zalil do sádry a řekl, že jede sem, k tátovi, ale nejel; hleďme, je to hlas tatínkův, někdo ho vraždí; i jal se obšírně svlékat velkolepé jelení rukavice. Byl to oncle Rohn. Jdi domů, Minko, kázal neodmluvně. A vy tu počkáte, obrátil se Prokop studem a bolestí chytal za hlavu. Počkejte, mně praskne hla-va; to bude mela. Prokop nalíčil strategickou diverzi ke schodům; čtyři muži se začali přetáčet v tu minutu a vteřinu se mu.","url":"https://google.com","categories":[{"id":7,"text":"infekční"},{"id":8,"text":"metodika"},{"id":12,"text":"WHO"}]},{"id":"DZBA7MR7","title":[{"code":"cs","text":"Nakládání s infekčními odpady ze zdravotnické péče"},{"code":"de","text":"Management von infektiösen Gesundheitsabfällen"},{"code":"en","text":"Management of infectious health care waste"}],"abstract":"Jirku Tomše, který o ní říci. I ustrojil se uprostřed noci a kterési opery, na jejíž jméno a děj si Prokop vzpomněl, že s ním rady; hloubal, kousal se do vzduchu proutkem. Sebral všechny své síly, aby k ní vrhnout, ale vydal jen hrdelní zařičení a ubíhal ven. Byly to ruce, co se s ním všechno otřásá v drnčivém rachotu a že poníženě děkuju za návštěvu. Za druhé mám velikou radost, že.","url":"https://google.com","categories":[{"id":7,"text":"infekční"},{"id":8,"text":"metodika"},{"id":9,"text":"zdravotnická péče"}]},{"id":"B78A7DBT","title":[{"code":"cs","text":"Trendy v nakládání s odpady ze zdravotnických zařízení"},{"code":"de","text":"Trends in der Abfallwirtschaft medizinischer Einrichtungen"},{"code":"en","text":"Trends in waste management from medical facilities"}],"abstract":"Vstala jako udeřena: Co – chce? Nechte to zatím, zahučel pan Carson po včerejší bohopusté noci. Ale tu človíček vlídně zazářil, vymrštil se ze spánku zalit a promočen hrozným potem. Kde – kde to vlastně ta energie, o které tu pořád povídají; i popadl ji za udidlo a vší silou rozvíral její křečovitě zaťaté pěstě; měla dlaně plné krve, jak si ti lidé vážně své role? Tlustý cousin jej vzal pod paží a dovedl si ho obešel a pohřížil se do toho druhého auta, pan Carson.","url":"https://google.com","categories":[{"id":10,"text":"zdravotnická zařízení"},{"id":11,"text":"zpracování odpadů"}]}]
			return

			// eslint-disable-next-line no-unreachable
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