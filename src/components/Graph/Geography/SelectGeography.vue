<template>
    <div class="d-flex">
        <div class="item">
            <label for="countries">{{$t('ui.maps.by_geography.country')}}</label>
            <select id="countries" v-model="selected.country">
                <option v-for="c in countries" :key="c.country_id" :value="c.country_id">{{ c.name }}</option>
            </select>
        </div>

        <div class="item" v-if="selected.country !== ''">
            <label for="regions">{{$t('ui.maps.by_geography.region')}}</label>
            <select name="" id="regions" v-model="selected.region">
                <option value="">{{ $t('ui.maps.by_geography.no_region') }}</option>
                <option v-for="c in regions" :key="c.region_id" :value="c.region_id">{{ c.name }}</option>
            </select>
        </div>

        <div class="item" v-if="selected.region !== ''">
            <label for="districts">{{$t('ui.maps.by_geography.district')}}</label>
            <select id="districts" v-model="selected.district">
                <option value="">{{ $t('ui.maps.by_geography.no_district') }}</option>
                <option v-for="c in districts" :key="c.district_id" :value="c.district_id">{{ c.name }}</option>
            </select>
        </div>
    </div>
</template>

<script>
import {getAllCountries, getDistricts, getRegions, getTrash} from "@/logics/api/geography/basic";

export default {
    name: "SelectGeography",
    data() {
        return {
            countries: [],
            regions: [],
            districts: [],
            selected: {
                country: '',
                region: '',
                district: ''
            },
            loadings: {
                country: false,
                region: false,
                district: false
            },
            trashes: {},
            isLoading: false,
        }
    },
    async mounted() {
        this.setLoading('country', true)
        this.countries = await getAllCountries()
        this.selected.country = this.countries[0].country_id
        this.setLoading('country', false)
    },
    methods:{
        notifyOnChange() {
            const type = this.selectedGeography
            this.$emit('update', {
                type: type,
                id: this.selected[type],
                trashes: this.trashes,
            })
        },
        setLoading(type, value) {
            this.loadings[type] = value

            this.isLoading = value ? value :this.loadings['country'] && this.loadings['region'] && this.loadings['district']
        }
    },
    computed: {
        selectedCountry() {
            return this.selected.country
        },
        selectedRegion() {
            return this.selected.region
        },
        selectedDistrict() {
            return this.selected.district
        },
        selectedGeography() {
            const options = ['district', 'region', 'country']
            const checkChar = ''

            for (let option of options) {
                if (this.selected[option] !== checkChar) {
                    return option
                }
            }

            return 'country'
        }
    },
    watch: {
        async selectedCountry() {
            this.setLoading('region', true)
            this.regions = await getRegions(this.selectedCountry)

            this.trashes = await getTrash('country', this.selected.country)
            this.notifyOnChange('selectedCountry')
            this.setLoading('region', false)
        },
        async selectedRegion() {
            this.selected.district = ''
            let type = 'region'
            let id = this.selected.region
            if (this.selectedRegion === '') {
                type = 'country'
                id = this.selected.country
            } else {
                this.setLoading('district', true)
                this.districts = await getDistricts(this.selectedRegion)
                this.setLoading('district', false)
            }
            console.log(type,id,this.selected)
            this.trashes = await getTrash(type, id)
            this.notifyOnChange('selectedRegion')
        },
        async selectedDistrict() {
            let type = 'district'
            let id = this.selected.district

            if (this.selected.region === "") return;

            if(this.selected.district === '') {
                type = 'region'
                id = this.selected.region
            }

            this.setLoading(type, true)
            console.log(`Running ${type} ${id}`)
            this.trashes = await getTrash(type, id)
            this.notifyOnChange('selectedDistrict')
            this.setLoading(type, false)
        },
        async selectedGeography() {
            // this.trashes = await getTrash('region', this.selected.region)
        },
        async trashes() {

        },
        async isLoading() {
            this.$emit('loading', this.isLoading)
        }

    }
}
</script>

<style scoped>
label{
    clip-path: polygon(75% 0, 0 0, 0 100%, 75% 100%, 100% 50%);
    padding: 12px 50px 12px 20px;
    background: #f7b731;
}
select {
    margin-left:-30px;
    padding: 12px 20px 12px 30px;
}
.item:not(.item:first-of-type){
    margin-left:5px;
}
</style>