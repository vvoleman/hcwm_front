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
                7: {
                    width: 80,
                    height: 80
                },
                8: {
                    width: 100,
                    height: 100
                },
                9: {
                    width: 120,
                    height: 120
                },
                10: {
                    width: 140,
                    height: 140
                },
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
            return this.sizes[this.zoom] || this.sizes[7]
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