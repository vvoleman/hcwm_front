<template>
    <div class="custom-tooltip" v-if="show">
        <b>{{name}}: </b><br>
        <span>{{percValue}}</span><br>
        <span>{{rawValue}}</span>
    </div>
</template>

<script>
export default {
    name: "Tooltip",
    props: {
        show: {
            type: Boolean,
            default: false
        },
        name: String,
        rawValue: String,
        percValue: String,
        x: Number,
        y: Number,
    },
    mounted() {

    }
}
</script>

<style scoped>
.custom-tooltip {
    width: 100px;
    position: absolute;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 5px;
    font-size: 12px;
    font-family: sans-serif;
    pointer-events: none;
    z-index: 1000;
}
</style>