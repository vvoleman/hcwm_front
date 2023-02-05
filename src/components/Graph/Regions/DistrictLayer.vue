<template>
    <l-feature-group
        ref="feature"
        @ready="handleReady"
        v-for="(value, key) in details"
        :key="key">
        <div v-if="canDisplayDetail(key)">
            <l-geo-json
                v-for="record in value"
                :key="record.id"
                :options="options"
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
</template>

<script>
import {useGeojsonBordersStore} from "@/stores/Geojson/GeojsonBorders";
import L from "leaflet";
import {
    LGeoJson,
    LFeatureGroup,
} from "@vue-leaflet/vue-leaflet";
import CitiesLayer from "@/components/Graph/Regions/CitiesLayer";

export default {
    name: "DistrictLayer",
    props: {
        zoom: {
            type: Number,
            default: 0
        },
        map: {
            type: Object,
            default: null
        },
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
    },
    emits: ['ready', 'setBounds'],
    components: {
        CitiesLayer,
        LGeoJson,
        LFeatureGroup,
    },
    data() {
        return {
            displayDetails: {},
            details: {},
        }
    },
    methods: {
        async toggleDetails(id) {
            this.$emit('ready', false)
            this.details[id] = await useGeojsonBordersStore().getDistrictsBorders(id)

            if (Object.keys(this.displayDetails).length > 0) {
                this.displayDetails = {}
            }
            this.displayDetails[id] = null;
            this.$emit('ready', true)
        },
        canDisplayDetail(id) {
            return this.displayDetails[id] !== undefined;
        },
        handleReady(e) {
            this.$emit('setBounds', e)
        }
    },
    computed: {
        options() {
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
                        layer.bindPopup(feature.properties.name, {closeButton: false, offset: L.point(0, 0)});
                        layer.on('mouseover', () => {
                            layer.setStyle({
                                fillOpacity: .7,
                            });
                            layer.openPopup();
                        });
                        layer.on('mouseout', () => {
                            layer.closePopup();
                            layer.setStyle({
                                fillOpacity: .5,
                            });

                        });
                        layer.on('mouseleave', function () {
                            // change background color back
                            layer.closePopup();
                        });
                    }
                }
            }
        },
    },
    watch: {
        id() {
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