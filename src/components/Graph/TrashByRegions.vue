<template>
    <h3>{{ $t('ui.maps.trashes_regions_yearly') }}</h3>
    <div>
        <label for="yearSelect" style="margin-right: 5px">{{ $t('ui.maps.choose_year') }}:</label>
        <select id="yearSelect" v-model="year">
            <option :value="2009+i-1" :key="i" v-for="i in 10">{{ 2009 + i - 1 }}</option>
        </select>
    </div>
    <div class="d-md-flex flex-wrap justify-content-between " style="margin-bottom: 15px;">
        <div style="height: 500px" class="col-md-12">
            <l-map
                :="false"
                ref="map"
                v-model="zoom"
                v-model:zoom="zoom"
                :center="center"
                :max-zoom="10"
                :min-zoom="7"
            >
                <l-control-layers>
                    <l-control>
                        <TrashLegend :trashes="getTrashesCode" />
                    </l-control>
                </l-control-layers>
                <l-tile-layer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                ></l-tile-layer>
                <l-layer-group v-if="show">
                    <l-geo-json
                        v-for="record in geojson"
                        :key="record.id"
                        :geojson="record"
                        :options="options"
                        :options-style="styleFunction"
                    />
                </l-layer-group>
                <l-layer-group

                    v-for="(value, key) in details"
                    :key="key">
                    <div v-if="canDisplayDetail(key)">
                        <l-geo-json

                            v-for="record in value"
                            :key="record.id"
                            :geojson="record"
                            :options="optionsDetails"
                        />
                    </div>


                </l-layer-group>

                <CitiesLayer :map="map" :geojson="geojson" :year="year"/>
            </l-map>
        </div>
        <region-details
            class="col-md-5"
            v-if="selectedRegion !== null"
            :name="selectedRegion.name"
            :year="year"
            :data="selectedRegion.trashes"
        />
    </div>
</template>
<script>
/* eslint-disable */
import {latLng} from "leaflet";
import "leaflet/dist/leaflet.css"
import {LGeoJson, LLayerGroup, LMap, LMarker, LTileLayer, LControl} from "@vue-leaflet/vue-leaflet";
import CitiesLayer from "@/components/Graph/Charts/CitiesLayer";

import {getCountryData, getRegionDetails, getRegionsData} from "@/logics/api/trashes";
import {stringToColor} from "@/logics/hash";
import {trashes} from "@/assets/js/trashes";
import RegionDetails from "@/components/Graph/RegionDetails";
import TrashLegend from "@/components/Graph/TrashLegend";

export default {
    name: 'TrashByRegions',
    components: {
        TrashLegend,
        RegionDetails,
        LMap,
        LTileLayer,
        // eslint-disable-next-line vue/no-unused-components
        LMarker,
        CitiesLayer,
        LGeoJson,
        LLayerGroup,
        LControl,
    },
    data() {
        return {
            zoom: 7,
            year: 2009,
            iconWidth: 25,
            iconHeight: 40,
            loading: false,
            show: true,
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
        };
    },
    computed: {
        getTrashesCode() {
            if (this.geojson.length === 0) return [];

            return this.geojson[0].properties.trashes;
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
                onEachFeature: this.onEachFeatureFunctionDetails
            }
        },
        styleFunction() {
            const fillColor = this.fillColor; // important! need touch fillColor in computed for re-calculate when change fillColor
            return () => {
                return {
                    weight: 2,
                    color: "#ECEFF1",
                    opacity: 1,
                    fillColor: fillColor,
                    fillOpacity: 1
                };
            };
        },
        onEachFeatureFunctionDetails() {
            if (!this.enableTooltip) {
                return () => {
                };
            }

            return (feature, layer) => {
                layer.on('click', (e) => {
                    this.selectedRegion = e.target.feature.properties
                })
                // layer.on('mounted', () => {
                //     layer.bindTooltip(
                //         `<b>${feature.properties.name}</b>`,
                //         {permanent: false, sticky: true}
                //     );
                // })
            };
        },
        onEachFeatureFunction() {
            if (!this.enableTooltip) {
                return () => {
                };
            }

            return (feature, layer) => {
                layer.on('click', (e) => {
                    this.selectedRegion = e.target.feature.properties
                    this.toggleDetails(this.selectedRegion['ISO3166-2'])
                })
                layer.on('mounted', () => {
                    layer.bindTooltip(
                        `<b>${feature.properties.name}</b>`,
                        {permanent: false, sticky: true}
                    );
                })
            };
        }
    },
    methods: {
        async toggleDetails(id) {
            this.details[id] = await getRegionDetails(id)

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
        const country = await getCountryData()
        const result = await getRegionsData()

        this.selectedRegion = {
            'name': 'Česká republika',
            'trashes': country
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
};
</script>
<style scoped>

</style>