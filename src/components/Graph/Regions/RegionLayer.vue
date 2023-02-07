<template>
    <l-feature-group v-if="show" @ready="setBounds" ref="regionFeature">
        <l-geo-json
            v-for="record in borders"
            :key="record.id"
            :options="options"
            :geojson="record"
        />
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
</template>

<script>
import {useGeojsonBordersStore} from "@/stores/Geojson/GeojsonBorders";
import CitiesLayer from "@/components/Graph/Regions/CitiesLayer";
import L from "leaflet";
import {
    LGeoJson,
    LFeatureGroup,
} from "@vue-leaflet/vue-leaflet";

export default {
    name: "RegionLayer",
    props: {
        show: {
            type: Boolean,
            default: false
        },
        enableTooltip: {
            type: Boolean,
            default: true
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
        zoom: {
            type: Number,
            default: 0
        },
    },
    emits: ['ready', 'setBounds'],
    data() {
        return {
            borders: [],
        }
    },
    components: {
        CitiesLayer,
        LGeoJson,
        LFeatureGroup
    },
    async mounted() {
        this.$emit('ready', false)

        // const country = await getTrash('country', 'cz')
        const result = await useGeojsonBordersStore().getRegionsBorders()

        if (result === null) {
            this.$notify({
                'title': 'Chyba',
                'text': 'Nepodařilo se získat nedávné články. Zkuste to prosím později',
                'type': 'error'
            })
            return
        }
        this.borders = result;
        this.$emit('ready', true)
    },
    methods: {
        setBounds(e) {
            this.$emit('setBounds', e)
        },
    },
    computed: {
        options() {
            return {
                onEachFeature: this.onEachFeatureFunction,
                style: this.styles
            }
        },
        styles() {
            return {
                color: "#1F5E4A",
                weight: 1,
                opacity: 1,
                fillColor: "#1F5E4A",
                fillOpacity: .3
            }
        },
        onEachFeatureFunction() {
            if (!this.enableTooltip) {
                return () => {
                };
            }

            return (feature, layer) => {
                if (feature.properties && feature.properties.name) {
                    layer.on('click', () => {
                        this.$emit('geography-selected', feature.properties.id)
                    })
                    layer.bindPopup(feature.properties.name, {closeButton: false, offset: L.point(0, -30)});
                    layer.on('mouseover', () => {
                        // change background color of layer to indicate mouseover to slightly darker
                        if (this.show) {
                            layer.setStyle({
                                fillOpacity: .7,
                            });
                        }
                        // layer.openPopup();
                    });
                    layer.on('mouseout', () => {
                        // change background color of layer to indicate mouseover to slightly darker
                        if (this.show) {
                            layer.setStyle({
                                fillOpacity: .3,
                            });
                        }
                    });
                    layer.on('mouseleave', function () {
                        // change background color back
                        layer.closePopup();
                    });
                }
            };
        }
    },
}
</script>

<style scoped>

</style>
