<template>
    <div>
        <PiechartMarker
            v-for="region in trashes"
            :key="region.id"
            :map="map"
            :region="region"
            :year="year"
            :width="width"
            :height="height"
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
            trashes: {},
            default: {
                width: 50,
                height: 50
            },
            width: 50,
            height: 50,
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
    watch: {
        year() {
            this.setTrashes(this.type, this.id, this.year)
        },
        id() {
            this.setTrashes(this.type, this.id, this.year)
        },
        zoom() {
            this.width = Math.max(this.default.width,0.5*this.default.width * (this.zoom - 7));
            this.height = Math.max(this.default.height,0.5*this.default.height * (this.zoom - 7));
        }
    }


}
</script>

<style scoped>

</style>