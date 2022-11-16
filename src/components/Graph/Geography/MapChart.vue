<template>
    <l-map
        ref="map"
        :options="mapOptions"
        v-model="zoom"
        v-model:zoom="zoom"
        :center="center"
        :bounds="bounds"
        :max-zoom="zooms[type].max"
        :min-zoom="zooms[type].min"
    >
        <l-control>
            <TrashLegend/>
        </l-control>
        <l-control-layers></l-control-layers>
        <l-tile-layer
            :name="$t('ui.graphs.by_regions.base_layer')"
            layer-type="overlay"
            :visible="false"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ></l-tile-layer>
        <l-feature-group v-if="showCountry" @ready="setBounds">
            <div class="border-danger">
            <l-geo-json
                v-for="record in geojson"
                :key="record.id"
                :geojson="record"
                :options="options"
                :options-style="styleFunction"
            />
            </div>
            <div>
                <CitiesLayer
                    :zoom="zoom"
                    :map="map"
                    :year="year"
                    :type="type"
                    :id="id"
                />
            </div>
        </l-feature-group>
        <div v-if="attempt">
            <l-feature-group
                ref="feature"
                @ready="setBounds"
                v-for="(value, key) in details"
                :key="key">
                <div v-if="canDisplayDetail(key)">
                    <l-geo-json

                        v-for="record in value"
                        :key="record.id"
                        :options="optionsDetails"
                        :geojson="record"
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
/* eslint-disable */
import "leaflet/dist/leaflet.css"

import TrashLegend from "@/components/Graph/TrashLegend";
import {
    LControl,
    LGeoJson,
    LLayerGroup,
    LMap,
    LMarker,
    LTileLayer,
    LFeatureGroup,
    LControlLayers
} from "@vue-leaflet/vue-leaflet";
import CitiesLayer from "@/components/Graph/Regions/CitiesLayer";
import {latLngBounds, latLng} from "leaflet";
import {useGeojsonBordersStore} from "@/stores/Geojson/GeojsonBorders";
let originColor = {
    color: "#1F5E4A",
    opacity: 0.5,
}
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
        LFeatureGroup,
        LControlLayers
    },
    props: {
        year: {
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
        },
        selectedAreasIds: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            mapOptions: {
                dragging: true,
            },
            maxBounds: latLngBounds(
                latLng(48.48225286612173, 11.620001806296331),
                latLng(51.008241453210516, 19.935055736755313)
            ),
            zooms: {
                region: {min: 8, max: 12},
                country: {min: 7, max: 8},
                '': {min: 7, max: 8}
            },
            attempt: true,
            bounds: [],
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
        zoomType() {
            return this.zooms[this.type];
        },
        showCountry() {
            for (let i in this.displayDetails) {
                return false
            }
            return true
        },
        map() {
            return this.$refs.map;
        },
        options() {
            return {
                onEachFeature: this.onEachFeatureFunction,
                style: this.styleFunction,
            };
        },
        optionsDetails() {
            return {
                style: function () {
                    return {
                        color: "#1F5E4A",
                        weight: 1,
                        opacity: 1,
                        fillColor: "#1F5E4A",
                        fillOpacity: 0.5,
                    }
                },
                onEachFeature: (feature, layer) => {
                    if (feature.properties && feature.properties.name) {
                         layer.bindPopup(feature.properties.name, {closeButton: false, offset: L.point(0,0)});
                         layer.on('mouseover', function() { layer.openPopup(); });
                         layer.on('mouseout', function() { layer.closePopup(); });
                    }
                }
            }
        },
        styleFunction() {
            return {
                color: "#1F5E4A",
                weight: 1,
                opacity: 1,
                fillColor: "#1F5E4A",
                fillOpacity: 0.3,
            }
        },
        onEachFeatureFunction() {
            if (!this.enableTooltip) {
                return () => {
                };
            }

            return (feature, layer) => {
                if (feature.properties && feature.properties.name) {
                    layer.on('click', ()=>{
                        this.$emit('geography-selected', feature.properties.id)
                    })
                    layer.bindPopup(feature.properties.name, {closeButton: false, offset: L.point(0, -30)});
                    layer.on('mouseover', function () {
                        // change background color of layer to indicate mouseover to slightly darker
                        layer.setStyle({
                            fillOpacity: .7,
                        });
                        //layer.openPopup();
                    });
                    layer.on('mouseout', function () {
                        // change background color of layer to indicate mouseover to slightly darker
                        layer.setStyle({
                            fillOpacity: .3,
                        });
                    });
                    layer.on('mouseleave', function () {
                        // change background color back
                        layer.closePopup();
                    });
                }

                layer.on('mounted', () => {
                    this.setStyle({
                        fillColor: '#ff0000',
                        color: '#ff0000'
                    });
                })
            };
        }
    },
    methods: {
        setBounds(e) {
            this.$nextTick(() => {
                this.bounds = e.getBounds()
            })
        },
        async toggleDetails(id) {
            this.details[id] = await useGeojsonBordersStore().getDistrictsBorders(id)

            if (Object.keys(this.displayDetails).length > 0) {
                this.displayDetails = {}
            }
            this.displayDetails[id] = null;
            this.$emit('ready')
        },
        canDisplayDetail(id) {
            return this.displayDetails[id] !== undefined;
        }
    },
    async mounted() {
        // const country = await getTrash('country', 'cz')
        const result = await useGeojsonBordersStore().getRegionsBorders()

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
        this.$emit('ready')
    },
    watch: {
        id() {
            if (!this.attempt) return;

            if (this.type === 'district') return;

            if (this.type === 'country') {
                this.displayDetails = {};
                this.$emit('ready')
                return
            }

            this.toggleDetails(this.id)
        }
    }
}
</script>

<style scoped>

</style>