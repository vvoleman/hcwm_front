<template>
    <h3>{{ $t('ui.graphs.by_geography.titles.main') }}</h3>
    <div>
        <SelectGeography @update="handleSelectUpdate" @ready="handleReady" @loading="handleSelectLoading"/>
    </div>
    <!--    <h1>{{selected.loading}}, {{selected.type}} - {{selected.id}}</h1>-->
    <div class="segment chart-box">
        <div class="title">
            <h4>{{ $t('ui.graphs.by_geography.titles.individual_types') }}</h4>
            <b class="subtitle">{{name}}</b>
        </div>
        <spin-loader v-show="!chartsLoaded.bar"/>
        <BarChart @chart-ready="chartReady('bar')" class="chart" :trash="trashes" v-show="chartsLoaded.bar"/>
    </div>

    <div class="segment chart-box">
        <div class="title">
            <h4>{{ $t('ui.graphs.by_geography.titles.trend_types') }}</h4>
            <b class="subtitle">{{name}}</b>
        </div>
        <spin-loader v-show="!chartsLoaded.line"/>
        <LineChart @chart-ready="chartReady('line')" v-if="trashes !== null && !selected.loading" class="chart" :trash="trashes" v-show="chartsLoaded.line"></LineChart>
    </div>

    <div class="segment chart-box" style="min-height: 0px" v-if="trashes !== null && !selected.loading">
        <div class="title">
            <h4>{{ $t('ui.graphs.by_geography.titles.table') }}</h4>
            <b class="subtitle">{{name}}</b>
        </div>
        <div v-show="isReady">
            <DataTable @exportTable="downloadDatasheet" :trashes="trashes" :name="name" idTable="trashByGeography"/>
        </div>
        <spin-loader v-show="!isReady"></spin-loader>
    </div>

    <SegmentWrapper>
        <template #title>
            <h4>{{ $t('ui.graphs.by_regions.titles.description') }}</h4>
        </template>
        <template #body>
            <p style="text-align: left">Výše uvedené vizualizace ukazují poměr typů zdravotnického odpadu v konkrétním
                roce na celém území. Je
                zřejmé, že na většině území je nejvíce produkován odpad
                <TrashLegendItem code="F180103"/>
                . Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis pulvinar. Duis sapien nunc, commodo et,
                interdum suscipit, sollicitudin et, dolor. Mauris tincidunt sem sed arcu. Integer lacinia. Fusce tellus.
                Vivamus ac leo pretium faucibus.</p>
            <p>Fusce aliquam vestibulum ipsum. Integer tempor. Duis viverra diam non
                justo. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus
                odio a lectus <TrashLegendItem code="F180104"/>. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Nulla pulvinar
                eleifend sem. Cras pede libero, dapibus nec, pretium sit amet, tempor quis.</p>

        </template>
    </SegmentWrapper>
</template>

<script>

import SelectGeography from "@/components/Graph/Geography/SelectGeography";
import LineChart from "@/components/Graph/Geography/LineChart";
import BarChart from "@/components/Graph/Geography/BarChart";
import DataTable from "@/components/Graph/Geography/DataTable";
import SpinLoader from "@/components/SpinLoader";
import {useTrashStore} from "@/stores/Trash/TrashStore";
import {useGeographyStore} from "@/stores/Geography/GeographyStore";
import SegmentWrapper from "@/components/Graph/SegmentWrapper";
import TrashLegendItem from "./TrashLegendItem";
import {downloadTable} from "@/logics/api/spreadsheets";

export default {
    name: "TrashByGeography",
    // eslint-disable-next-line vue/no-unused-components
    components: {SpinLoader, DataTable, BarChart, SelectGeography, LineChart, SegmentWrapper, TrashLegendItem},
    data() {
        return {
            selected: {
                loading: false,
                type: '',
                id: ''
            },
            chartsLoaded: {
                bar: false,
                line: false
            },
            trashes: null,
            isReady: false
        }
    },
    async mounted() {
    },
    methods: {
        async downloadTable(id) {
            await downloadTable(id, `${this.selected.type}/${this.selected.id}/${this.y}`)
        },
        async handleSelectUpdate(data) {
            if (data.id === this.selected.id) {
                return
            }

            if (this.isReady) {
                this.trashes = await useTrashStore().getTrash(data.type, data.id)
            }

            this.selected = {
                loading: this.selected.loading,
                type: data.type,
                id: data.id
            }
        },
        handleSelectLoading(data) {
            if(data) {
                let keys = Object.keys(this.chartsLoaded)
                for (const key of keys) {
                    this.chartsLoaded[key] = false;
                }
            }

            this.selected.loading = data
        },
        async handleReady() {
            if (this.isReady) return

            this.isReady = true
            this.trashes = await useTrashStore().getTrash(this.selected.type, this.selected.id)
        },
        chartReady(type) {
            if (!this.isReady) {
                return
            }

            this.chartsLoaded[type] = true
        }
    },
    computed: {
        name() {
            return useGeographyStore().getName(this.selected.type, this.selected.id, true)
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
.segment{
    margin-top: 30px;
}
</style>