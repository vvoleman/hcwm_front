<template>
    <div class="filter-select">
        <label>{{ label }}</label>
        <Multiselect
            mode="tags"
            :create-option="true"
            label="name"
            :close-on-select="true"
            v-model="selected"
            :options="options"
        >
            <template v-slot:singlelabel="{ value }">
                <slot name="singlelabel" :value="value"></slot>
            </template>

            <template v-slot:option="{ option }">
                <slot name="option" :option="option"></slot>
            </template>

        </Multiselect>
    </div>
</template>

<script>
import Multiselect from '@vueform/multiselect'
export default {
    name: "SelectMultiple",
    components: { Multiselect },
    data(){
        return {
            selected: this.value
        }
    },
    props: {
        label: String,
        options: {
            type: Array,
            default: () => {return []}
        },
        value: [String, Number, Array],
        searchable: {
            type:Boolean,
            default: ()=>{return false}
        }
    },
    watch: {
        selected() {
            this.$emit('input', this.selected)
        }
    }
}
</script>

<!--<script setup>-->
<!--import Multiselect from 'vue-multiselect'-->
<!--import {defineProps, ref} from "vue";-->

<!--defineProps({-->
<!--    label: String,-->
<!--    options: Array-->
<!--})-->

<!--const selectValue = ref(null)-->

<!--</script>-->

<style scoped>
.filter-select label{
    background: var(--main-color-dark);
    font-weight: bold;
    color:white;
    padding:5px 15px;
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2);
}

.filter-select {
    margin-top:10px;
    width: calc(100%/12 * 3.85);
}

@media only screen and (max-width: 720px) {
    .filter-select {
        width: 100%;
    }
}
</style>
<style src="@vueform/multiselect/themes/default.css"></style>
<style>
.multiselect-tag {
    background: #f7b731;
    color:black
}
</style>