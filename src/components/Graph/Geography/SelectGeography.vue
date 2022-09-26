<template>
    <div class="d-block d-md-flex body">
        <div class="item" v-if="!disableYear && selected.year !== 0">
            <label for="year">{{ $t('ui.graphs.choose_year') }}</label>
            <select id="year" v-model="selected.year">
                <!-- Loop through years -->
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
        </div>

        <div class="item">
            <label for="countries">{{ $t('ui.graphs.by_geography.country') }}</label>
            <select id="countries" v-model="selected.country">
                <option v-for="c in countries" :key="c.country_id" :value="c.country_id">{{ c.name }}</option>
            </select>
        </div>

        <div class="item" v-if="selected.country !== ''">
            <label for="regions">{{ $t('ui.graphs.by_geography.region') }}</label>
            <select name="" id="regions" v-model="selected.region">
                <option value="">{{ $t('ui.graphs.by_geography.no_region') }}</option>
                <option v-for="c in regions" :key="c.region_id" :value="c.region_id">{{ c.name }}</option>
            </select>
        </div>

        <div class="item" v-if="!disableDistrict && selected.region !== ''">
            <label for="districts">{{ $t('ui.graphs.by_geography.district') }}</label>
            <select id="districts" v-model="selected.district">
                <option value="">{{ $t('ui.graphs.by_geography.no_district') }}</option>
                <option v-for="c in districts" :key="c.district_id" :value="c.district_id">{{ c.name }}</option>
            </select>
        </div>
    </div>
</template>

<script>
import {useCountryStore} from "@/stores/Geography/CountryStore";
import {useDistrictStore} from "@/stores/Geography/DistrictStore";
import {useRegionStore} from "@/stores/Geography/RegionStore";

export default {
    name: "SelectGeography",
    components: {},
    props: {
        disableDistrict: {
            type: Boolean,
            default: false
        },
        disableYear: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            years: [],
            countries: [],
            regions: [],
            districts: [],
            selected: {
                country: '',
                region: '',
                district: '',
                year: 0
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
        // Set this.years to be an array of years from 2009 to 2019 (inclusive)
        this.years = Array.from({length: 11}, (v, k) => k + 2009);

        // this.selected.year is first year in this.years
        this.selected.year = this.years[0];

        this.setLoading('country', true)
        this.countries = await useCountryStore().allCountries
        this.selected.country = this.countries[0].country_id
        this.setLoading('country', false)

        await this.loadRegions()

        this.notifyOnChange();
        this.notifyReady();
    }
    ,
    methods: {
        notifyOnChange() {
            const type = this.selectedGeography

            let message = {
                type: type,
                id: this.selected[type],
                parentId: this.selectedParent
            }

            if (!this.disableYear) {
                message.year = this.selected.year
            }

            this.$emit('update', message)
        },
        notifyReady() {
            this.$emit('ready')
        },
        setLoading(type, value) {
            this.loadings[type] = value

            this.isLoading = value ? value : this.loadings['country'] && this.loadings['region'] && this.loadings['district']
        },
        async loadRegions() {
            this.regions = await useRegionStore().getAllRegions(this.selected.country)
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
        selectedRegion() {
            return this.selected.region
        },
        selectedDistrict() {
            return this.selected.district
        },
        selectedYear() {
            return this.selected.year
        },
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
        selectedYear() {
            this.notifyOnChange()
        },
        async selectedRegion() {
            this.selected.district = ''
            if (this.selected.region !== '') {
                this.setLoading('district', true)
                this.districts = await useDistrictStore().getAllDistricts(this.selectedRegion)
                this.setLoading('district', false)


            }
            this.notifyOnChange()
        },
        async selectedDistrict() {

            if (this.selected.region === "") return;
            console.log(this.selected)
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

body{
    margin-bottom: 1rem;
}

/* All .item will have same height based on child with biggest height. Make some space between them (left and right) */
.item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 100%;
    margin-right: 5px;
}

label {
    /*clip-path: polygon(75% 0, 0 0, 0 100%, 75% 100%, 100% 50%);*/
    padding: 12px 20px;
    height: auto;
    background: var(--main-color-dark);
    color: white;
}

select {
    background: var(--folder-alt-bg);
    border: none;
    border-radius: 0px;
    padding: 15px;
}

select[disabled] {
    opacity: 0.6;
}


@media screen and (max-width: 768px) {

    /* All .item will have 90% width and centered. Labels inside .item will have same width. Use flexboxes */
    .item {
        width: 95%;
        margin: 0 auto;
        align-items: flex-start;
    }

    .item label {
        width: 40%;
    }

    .item select {
        width: 100%;
    }
}

.item:not(.item:last-of-type) {
    margin-bottom: 5px;
}
</style>