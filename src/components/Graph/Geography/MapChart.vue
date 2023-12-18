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
        <div>
            <CountryLayer :show="true" :fill-opacity="type !== 'region' ? 0 : null"/>
            <RegionLayer
                :show="showCountry"
                :zoom="zoom"
                :map="map"
                :year="year"
                :type="type"
                :id="id"
                @ready="handleReady"
                @setBounds="setBounds"
            />
        </div>

        <div>
            <DistrictLayer
                :zoom="zoom"
                :map="map"
                :year="year"
                :type="type"
                :id="id"
                @ready="handleReady"
                @setBounds="setBounds"/>
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
import RegionLayer from "@/components/Graph/Regions/RegionLayer";
import DistrictLayer from "@/components/Graph/Regions/DistrictLayer";
import CountryLayer from "@/components/Graph/Regions/CountryLayer";

let originColor = {
    color: "#1F5E4A",
    opacity: 0.5,
}
export default {
    name: "MapChart",
    components: {
        CountryLayer,
        DistrictLayer,
        RegionLayer,
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
    emits: ['ready'],
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
                region: {min: 7, max: 12},
                country: {min: 7, max: 12},
                '': {min: 7, max: 12}
            },
            bounds: [],
            zoom: 7,
            enableTooltip: true,
            center: latLng(49.743876792996865, 15.339122571121992),
            marker: latLng(49.743876792996865, 15.339122571121992),
            isReady: false
        }
    },
    computed: {
        showCountry() {
            return this.type !== 'region'
        },
        map() {
            return this.$refs.map;
        },
        onEachFeatureFunction() {
            if (!this.enableTooltip) {
                return () => {
                };
            }

            return (feature, layer) => {
                if (feature.properties && feature.properties.name) {
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
        handleReady(isReady) {
            this.isReady = isReady
        }
    },
    watch: {
        isReady() {
            if (this.isReady) {
                this.$emit('ready')
            }
        },
    }
}
</script>
<style>
.leaflet-container path{
    transition:  .1s;
}
</style>
<style scoped>

</style>
