<template>
    <h3>{{ $t('ui.graphs.by_geography.titles.main') }}</h3>
    <div>
        <SelectGeography @update="handleSelectUpdate" @ready="handleReady" @loading="handleSelectLoading"/>
    </div>
    <!--    <h1>{{selected.loading}}, {{selected.type}} - {{selected.id}}</h1>-->
    <spin-loader v-if="selected.loading"/>
    <div class="segment chart-box">
        <h4>{{ $t('ui.graphs.by_geography.titles.individual_types') }}</h4>
        <BarChart class="chart" :trash="trashes"/>
    </div>

    <div class="segment chart-box">
        <h4>{{ $t('ui.graphs.by_geography.titles.trend_types') }}</h4>
        <LineChart v-if="trashes !== null && !selected.loading" class="chart" :trash="trashes"></LineChart>
    </div>

    <div class="segment chart-box" style="min-height: 0px">
        <h4>{{ $t('ui.graphs.by_geography.titles.table') }}</h4>
        <div class="scroll-table">
            <DataTable class="data-table" v-if="trashes !== null && !selected.loading" :trashes="trashes" :name="name"/>
        </div>
    </div>
</template>

<script>

import SelectGeography from "@/components/Graph/Geography/SelectGeography";
import LineChart from "@/components/Graph/Geography/LineChart";
import BarChart from "@/components/Graph/Geography/BarChart";
import DataTable from "@/components/Graph/Geography/DataTable";
import {getName, getTrash} from "@/logics/api/geography/basic";
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
            isReady: false
        }
    },
    async mounted() {
    },
    methods: {
        async handleSelectUpdate(data) {
            if (data.id === this.selected.id) {
                return
            }

            if (this.isReady) {
                this.trashes = await getTrash(data.type, data.id)
            }

            this.selected = {
                loading: this.selected.loading,
                type: data.type,
                id: data.id
            }
        },
        handleSelectLoading(data) {
            this.selected.loading = data
        },
        async handleReady() {
            if (this.isReady) return

            this.isReady = true
            this.trashes = await getTrash(this.selected.type, this.selected.id)
        }
    },
    computed: {
        name() {
            return getName(this.selected.type, this.selected.id)
        },
        type() {
            return this.selected.type
        }
    },
}
</script>

<style scoped>

.data-table {
    width: 50%;
    overflow: auto;
}
</style>