<template>
    <div>
        <SelectGeography @update="handleSelectUpdate" @loading="handleSelectLoading"/>
    </div>
    <h1>{{selected.loading}}, {{selected.type}} - {{selected.id}}</h1>
    <spin-loader v-if="selected.loading"/>
    <BarChart v-if="trashes !== null && !selected.loading" class="chart" :trash="trashes" height="400px"/>
<!--    <TrashLegend :trashes="trashes" style="width:50vw"/>-->
    <LineChart v-if="trashes !== null && !selected.loading" class="chart" :trash="trashes" height="400px"></LineChart>
    <DataTable class="data-table" v-if="trashes !== null && !selected.loading" :trashes="trashes" :name="name" />
</template>

<script>

import SelectGeography from "@/components/Graph/Geography/SelectGeography";
import LineChart from "@/components/Graph/Geography/LineChart";
import BarChart from "@/components/Graph/Geography/BarChart";
import DataTable from "@/components/Graph/Geography/DataTable";
import {getName} from "@/logics/api/geography/basic";
import SpinLoader from "@/components/SpinLoader";
export default {
    name: "TrashByGeography",
    // eslint-disable-next-line vue/no-unused-components
    components: {SpinLoader, DataTable, BarChart, SelectGeography, LineChart},
    data() {
        return {
            selected: {
                loading: false,
                type: '',
                id: ''
            },
            trashes: null,
        }
    },
    async mounted() {
    },
    methods: {
        handleSelectUpdate(data) {
            this.trashes = data.trashes

            this.selected = {
                loading: this.selected.loading,
                type: data.type,
                id: data.id
            }
        },
        handleSelectLoading(data) {
            this.selected.loading = data
        }
    },
    computed: {
        name() {
            console.log('name');
            return getName(this.selected.type, this.selected.id)
        }
    },
    watch: {}
}
</script>

<style scoped>
.chart{
    margin-top: 20px;
    background: #fafafa;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.3);
}
.data-table{
    width:50%;
    overflow: auto;
}
</style>