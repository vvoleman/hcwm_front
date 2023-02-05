<template>
    <l-feature-group v-if="show">
        <l-geo-json
            :geojson="countryBorders"
            :options="options"
        />
    </l-feature-group>
</template>

<script>
import {useGeojsonBordersStore} from "@/stores/Geojson/GeojsonBorders";

import {
    LGeoJson,
    LFeatureGroup,
} from "@vue-leaflet/vue-leaflet";

export default {
    name: "CountryLayer",
    props:{
        show: {
            type: Boolean,
            default: false
        },
        fillOpacity: {
            type: Number,
            default: 0.2
        },
    },
    data() {
        return {
            countryBorders: [],
        }
    },
    components: {
        LGeoJson,
        LFeatureGroup,
    },
    async mounted() {
        const borders = await useGeojsonBordersStore().getCountryBorders('cz');
        this.countryBorders = borders;
    },
    computed: {
        options() {
            return {
                style: this.styles
            }
        },
        styles() {
            return {
                color: '#1F5E4A',
                weight: 3,
                opacity: 1,
                fillColor: 'black',
                fillOpacity: this.fillOpacity
            }
        }
    }
}
</script>

<style scoped>

</style>