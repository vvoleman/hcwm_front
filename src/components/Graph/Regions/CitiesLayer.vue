<template>
    <div class="border">
        <PiechartMarker
            v-for="region in trashes"
            :key="region.id"
            :map="map"
            :region="region"
            :year="year"
            :sizes="size"
        />
    </div>
</template>

<script>
import PiechartMarker from "@/components/Graph/Charts/PiechartMarker";
import {useGeographyStore} from "@/stores/Geography/GeographyStore";

export default {
    name: "CitiesLayer",
    components: {
        // eslint-disable-next-line vue/no-unused-components
        PiechartMarker,
    },
    props: {
        zoom: Number,
        map: Object,
        type: String,
        id: String,
        year: Number,
    },
    data() {
        return {
            sizes: {
                country: {
                    7: {
                        width: 60,
                        height: 60
                    },
                    8: {
                        width: 110,
                        height: 110
                    },
                    9: {
                        width: 180,
                        height: 180
                    },
                    10: {
                        width: 250,
                        height: 250
                    },
                },
                region: {
                    7: {
                        width: 30,
                        height: 30
                    },
                    8: {
                        width: 30,
                        height: 30
                    },
                    9: {
                        width: 50,
                        height: 50
                    },
                    10: {
                        width: 90,
                        height: 90
                    },
                }

            },
            trashes: {},
        }
    },
    mounted() {
        this.setTrashes(this.type, this.id, this.year)
    },
    methods: {
        async setTrashes(type, id, year) {
            this.trashes = await useGeographyStore().getGeographyWithTrashes(type, id, year)
        }
    },
    computed: {
        size() {
            //return this.sizes[7]
            return this.sizes[this.type][this.zoom] || this.sizes.country[7]
        }
    },
    watch: {
        year() {
            this.setTrashes(this.type, this.id, this.year)
        },
        id() {
            this.setTrashes(this.type, this.id, this.year)
        },
        zoom() {
            // this.width = Math.max(this.default.width,0.5*this.default.width * (this.zoom - 7));
            // this.height = Math.max(this.default.height,0.5*this.default.height * (this.zoom - 7));
        }
    }


}
</script>

<style scoped>
</style>