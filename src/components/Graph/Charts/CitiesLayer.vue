<template>
    <PiechartMarker
        v-for="region in geojson"
        :key="region.id"
        :map="map"
        :region="region"
        :year="year"
    />
</template>

<script>
import PiechartMarker from "@/components/Graph/Charts/PiechartMarker";

export default {
    name: "CitiesLayer",
    props: {
        map: Object,
        geojson: Array,
        year: Number,
        labels: []
    },
    components: {
        PiechartMarker,
    }
}
</script>

<style scoped>

</style>