<template>
    <l-map
        disabled
        :="false"
        ref="map"
        :draggable="false"
        v-model="zoom"
        v-model:zoom="zoom"
        :center="center"
        :bounds="bounds"
        :min-zoom="7"
        :max-zoom="9"
    >
        <l-control>
            <TrashLegend/>
        </l-control>
        <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ></l-tile-layer>
        <l-layer-group v-if="showCountry">
            <l-geo-json
                v-for="record in geojson"
                :key="record.id"
                :geojson="record"
                :options="options"
                :options-style="styleFunction"
            />
            <CitiesLayer
                :zoom="zoom"
                :map="map"
                :year="year"
                :type="type"
                :id="id"
            />
        </l-layer-group>
        <div v-if="attempt">
        <l-feature-group
            ref="feature"
            @ready="test"
            v-for="(value, key) in details"
            :key="key">
            <div v-if="canDisplayDetail(key)">
                <l-geo-json

                    v-for="record in value"
                    :key="record.id"
                    :geojson="record"
                    :options="optionsDetails"
                    :options-style="styleFunction"
                />
                <CitiesLayer
                    :zoom="zoom"
                    :map="map"
                    :year="year"
                    :type="type"
                    :id="id"
                />
            </div>


        </l-feature-group>
        </div>
    </l-map>
</template>

<script>
import "leaflet/dist/leaflet.css"

import TrashLegend from "@/components/Graph/TrashLegend";
import {LControl, LGeoJson, LLayerGroup, LMap, LMarker, LTileLayer, LFeatureGroup} from "@vue-leaflet/vue-leaflet";
import CitiesLayer from "@/components/Graph/Regions/CitiesLayer";
import {latLng} from "leaflet";
// eslint-disable-next-line no-unused-vars
import {getDistrictsBorders, getRegionsBorders} from "@/logics/api/geography/geojson";

export default {
    name: "MapChart",
    components: {
        TrashLegend,
        LMap,
        LTileLayer,
        // eslint-disable-next-line vue/no-unused-components
        LMarker,
        // eslint-disable-next-line vue/no-unused-components
        CitiesLayer,
        LGeoJson,
        LLayerGroup,
        LControl,
        LFeatureGroup
    },
    props:{
        year:{
            type: Number,
            default: 2009
        },
        type: {
            type: String,
            default: ''
        },
        id: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            attempt: true,
            bounds:[],
            zoom: 7,
            iconWidth: 25,
            iconHeight: 40,
            loading: false,
            layers: [],
            enableTooltip: true,
            center: latLng(49.743876792996865, 15.339122571121992),
            marker: latLng(49.743876792996865, 15.339122571121992),
            geojson: [],
            details: {},
            displayDetails: {},
            counter: 0,
            selectedRegion: null,
            fillColor: "#e4ce7f",
            url: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }
    },
    computed: {
        showCountry(){
            for(let i in this.displayDetails){return false} return true
        },
        map() {
            return this.$refs.map;
        },
        options() {
            return {
                onEachFeature: this.onEachFeatureFunction
            };
        },
        optionsDetails() {
            return {
                // onEachFeature: this.onEachFeatureFunctionDetails
            }
        },
        styleFunction() {
            return () => {
                return {
                    weight: 2,
                    color: "#242424",
                    opacity: 0.3,
                    fillColor: "#242424",
                    fillOpacity: 1
                };
            };
        },
        onEachFeatureFunction() {
            if (!this.enableTooltip) {
                return () => {
                };
            }

            return (feature, layer) => {


                layer.on('mounted', () => {
                    this.setStyle({
                        fillColor: '#ff0000',
                        color: '#ff0000'
                    });
                    layer.bindTooltip(
                        `<b>${feature.properties.name}</b>`,
                        {permanent: false, sticky: true}
                    );
                })
            };
        }
    },
    methods: {
        test(e){
            this.$nextTick(() => {
                this.bounds = e.getBounds()
            })
        },
        async toggleDetails(id) {
            this.details[id] = await getDistrictsBorders(id)

            if (Object.keys(this.displayDetails).length > 0) {
                this.displayDetails = {}
            }
            this.displayDetails[id] = null;

        },
        canDisplayDetail(id) {
            return this.displayDetails[id] !== undefined;
        }
    },
    async mounted() {
        // const country = await getTrash('country', 'cz')
        const result = await getRegionsBorders()

        this.selectedRegion = {
            'name': 'Česká republika',
            'trashes': {}
        }

        if (result === null) {
            this.$notify({
                'title': 'Chyba',
                'text': 'Nepodařilo se získat nedávné články. Zkuste to prosím později',
                'type': 'error'
            })
            return
        }
        this.geojson = result;
    },
    watch: {
        id() {
            if(!this.attempt) return;

            if(this.type === 'district') return;

            if(this.type === 'country') {this.displayDetails = {}; return}

            this.toggleDetails(this.id)
        }
    }
}
</script>

<style scoped>

</style>