<template>
    <h3>{{ $t('ui.maps.trashes_regions_yearly') }}</h3>
    <div>
        <label for="yearSelect" style="margin-right: 5px">{{$t('ui.maps.choose_year')}}:</label>
        <select id="yearSelect" v-model="year">
            <option :value="2009+i-1" :key="i" v-for="i in 10">{{2009+i-1}}</option>
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
                :zoom-control="false"
            >
                <l-tile-layer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                ></l-tile-layer>
                <l-geo-json
                    v-if="show"
                    :geojson="geojson"
                    :options="options"
                    :options-style="styleFunction"

                />
                <CitiesLayer :map="map" :geojson="geojson" :year="year"/>
            </l-map>
        </div>
        <div class="details col-md-6 mx-auto">
            <div class="legends">
                <div v-for="trash in getTrashesCode" :key="trash.code" class="legend">
                    <div class="line">
                        <div class="trash-box" :style="{'backgroundColor': trash.color}"></div>
                        <b>{{ trash.code }}</b>
                    </div>
                    <div class="text">
                        {{ trash.name }}
                    </div>
                </div>
            </div>
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
import {latLng} from "leaflet";
import "leaflet/dist/leaflet.css"
import {
    LMap,
    LTileLayer,
    LMarker,
    // LIcon,
    // LTooltip,
    LGeoJson,
} from "@vue-leaflet/vue-leaflet";

import {getRegionsData} from "@/logics/api/trashes";
import CitiesLayer from "@/components/Graph/Charts/CitiesLayer";
import {stringToColor} from "@/logics/hash";
import {trashes} from "@/assets/js/trashes";
import RegionDetails from "@/components/Graph/RegionDetails";

export default {
    name: 'TrashByRegions',
    components: {
        RegionDetails,
        CitiesLayer,
        LMap,
        LTileLayer,
        // eslint-disable-next-line vue/no-unused-components
        LMarker,
        LGeoJson,
    },
    data() {
        return {
            zoom: 7,
            year: 2009,
            iconWidth: 25,
            iconHeight: 40,
            loading: false,
            show: true,
            enableTooltip: true,
            center: latLng(49.743876792996865, 15.339122571121992),
            marker: latLng(49.743876792996865, 15.339122571121992),
            geojson: [],
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

            const trashesData = this.geojson[0].properties.trashes;
            let data = []
            for (const trash in trashesData) {
                data.push({
                    code: trash,
                    color: stringToColor(trashes[trash]),
                    name: trashes[trash]
                })
            }

            return data
        },
        map() {
            return this.$refs.map;
        },
        options() {
            return {
                onEachFeature: this.onEachFeatureFunction
            };
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
        onEachFeatureFunction() {
            if (!this.enableTooltip) {
                return () => {
                };
            }

            return (feature, layer) => {
                layer.on('click', (e) => {
                    this.selectedRegion = e.target.feature.properties
                })

                layer.bindTooltip(
                    `<b>${feature.properties.name}</b>`,
                    {permanent: false, sticky: true}
                );
            };
        }
    },
    async mounted() {
        const result = await getRegionsData()

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
.trash-box {
    width: 20px;
    height: 20px;
    border: 2px solid black;
    margin-right: 10px;
    display: inline-block;
}

.legend {
    display: inline-block;
    width: 100%;
    transition: .1s;
}

.legend:hover {
    background: #eee;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.3);
}

.line {
    padding: 5px;
    display: flex;
    align-items: center;
}

.text {
    padding: 0px 5px;
}
</style>