<template>
    <div class="tags d-md-flex">
        <div v-for="area in areas" :key="area.id" class="tag">
            {{area.name}}
            <button @click="cancel(area.id)">&times;</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "SelectAreas",
    emits: ['cancel'],
    props: {
        areas: {
            type: Array,
            default: () => []
        },
    },
    data(){
        return {
            adjusted: {}
        }
    },
    methods: {
        cancel(id) {
            console.log(id)
            this.$emit('cancel', id)
        },
    }
}
</script>

<style scoped>
.tags {
    display: flex;
    flex-wrap: wrap;
    margin: 5px 0;
}
.tag {
    background-color: var(--main-color-middle);
    color:white;
    padding:5px 15px;
}
.tag + .tag {
    margin-left: 5px;
}
button {
    border:none;
    margin-left: 5px;
    border-radius: 2px;
}
</style>