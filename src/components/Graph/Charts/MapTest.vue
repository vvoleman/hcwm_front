<template>
    <div>
        <!-- Make a list of checkboxes with labels  !-->
        <div v-for="(item,key) in layers" :key="key">
            {{key}}
            <input type="checkbox" :id="key" :value="states[key]">
            <label :for="key">{{ states[key] }}</label>
            <button @click="toggleLayer(key)">Change</button>
        </div>
    </div>
    <div id="container" class="col-md-12">
        <div id="mapContainer"></div>
    </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import {MarkerClusterGroup} from "leaflet.markercluster";
import L from "leaflet";
import {getRegionsBorders} from "@/logics/api/geography/geojson";

export default {
    name: "MapTest",
    data() {
        return {
            center: [49.743876792996865, 15.339122571121992],
            map: null,
            layers: {},
            states:{}
        }
    },
    async mounted() {
        this.setupLeafletMap();

        this.setupGeojson()
    },
    methods: {
        setupLeafletMap: function () {
            this.map = L.map("mapContainer", {
                dragging: true,
            }).setView(this.center, 13);
            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution:
                        'Map data &copy <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 10,
                    minZoom: 7,
                }
            ).addTo(this.map);

            this.setupGeojson()
        },
        async setupGeojson() {
            if(this.map === null) return;
            const geojson = await getRegionsBorders();

            let markers = new MarkerClusterGroup()
            for (const item of geojson) {

                this.states[item.properties.id] = true
                this.layers[item.properties.id] = L.geoJSON(item, {
                    style: {
                        color: "#1F5E4A",
                        weight: 1,
                        opacity: 1,
                        fillColor: "#1F5E4A",
                        fillOpacity: 0.3,
                    }
                }).addTo(this.map)
                console.log(item.properties)
                let coords = item.properties.coords
                var marker = L.marker(new L.LatLng(coords.latitude, coords.longitude), { title: item.properties.name });
                markers.addLayer(marker)
            }
            markers.addTo(this.map)
        },
        toggleLayer(id) {
            if (this.states[id]) {
                this.map.removeLayer(this.layers[id])
                this.states[id] = false
            } else {
                this.map.addLayer(this.layers[id])
                this.states[id] = true
            }
        }
    },
}
</script>

<style scoped>
#mapContainer {
    height: 500px;
}
</style>