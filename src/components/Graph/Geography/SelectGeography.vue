<template>
    <div class="d-flex">
        <div class="item">
            <label for="countries">{{$t('ui.graphs.by_geography.country')}}</label>
            <select id="countries" v-model="selected.country" disabled>
                <option v-for="c in countries" :key="c.country_id" :value="c.country_id">{{ c.name }}</option>
            </select>
        </div>

        <div class="item" v-if="selected.country !== ''">
            <label for="regions">{{$t('ui.graphs.by_geography.region')}}</label>
            <select name="" id="regions" v-model="selected.region">
                <option value="">{{ $t('ui.graphs.by_geography.no_region') }}</option>
                <option v-for="c in regions" :key="c.region_id" :value="c.region_id">{{ c.name }}</option>
            </select>
        </div>

        <div class="item" v-if="!disableDistrict && selected.region !== ''">
            <label for="districts">{{$t('ui.graphs.by_geography.district')}}</label>
            <select id="districts" v-model="selected.district">
                <option value="">{{ $t('ui.graphs.by_geography.no_district') }}</option>
                <option v-for="c in districts" :key="c.district_id" :value="c.district_id">{{ c.name }}</option>
            </select>
        </div>
    </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {getAllCountries, getDistricts, getRegions} from "@/logics/api/geography/basic";

export default {
    name: "SelectGeography",
    props: {
        disableDistrict: {
            type: Boolean,
            default: false
        }
    },
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
            shouldNotify: false,
            isLoading: false,
        }
    },
    async mounted() {
        this.setLoading('country', true)
        this.countries = await getAllCountries()
        this.selected.country = this.countries[0].country_id
        this.setLoading('country', false)

        await this.loadRegions()

        this.notifyOnChange();
        this.notifyReady();
    },
    methods:{
        notifyOnChange() {
            const type = this.selectedGeography
            this.$emit('update', {
                type: type,
                id: this.selected[type],
                parentId: this.selectedParent
            })
        },
        notifyReady() {
            this.$emit('ready')
        },
        setLoading(type, value) {
            this.loadings[type] = value

            this.isLoading = value ? value :this.loadings['country'] && this.loadings['region'] && this.loadings['district']
        },
        async loadRegions() {
            this.regions = await getRegions(this.selected.country)
        }

    },
    computed: {
        selectedGeography() {
            const options = ['district', 'region', 'country']
            const checkChar = ''

            for (let option of options) {
                if (this.selected[option] !== checkChar) {
                    return option
                }
            }

            return 'country'
        },
        selectedRegion(){return this.selected.region},
        selectedDistrict(){return this.selected.district},
        selectedParent() {
            const type = this.selectedGeography

            let result;
            switch (type) {
                case 'region':
                    result = this.regions.filter(x => x.region_id === this.selected.region)

                    return result.length > 0 ? result[0].parent_id : null
                case 'district':
                    result = this.districts.filter(x => x.district_id === this.selected.district)

                    return result.length > 0 ? result[0].parent_id : null
                default:
                    return null
            }

        }
    },
    watch: {
        selected: {
            async handler() {
                // this.notifyOnChange()
            },
            deep: true
        },
        async selectedRegion() {
            this.selected.district = ''
            if (this.selected.region !== '') {
                this.setLoading('district', true)
                this.districts = await getDistricts(this.selectedRegion)
                this.setLoading('district', false)


            }
            this.notifyOnChange()
        },
        async selectedDistrict() {

            if (this.selected.region === "") return;
            //
            this.notifyOnChange('selectedDistrict')
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