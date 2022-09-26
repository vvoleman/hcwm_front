<template>
    <table class="table table-hover">
        <thead>
        <tr>
            <th>{{ name }}</th>
            <template v-for="year in years" :key="year">
                <th>{{ $t('ui.graphs.by_geography.amount') }}<br>{{ year }}</th>
                <th>{{ $t('ui.graphs.by_geography.fraction') }}<br>{{ year }}</th>
            </template>
            <th>{{ $t('ui.graphs.by_geography.amount') }}<br>{{ $t('ui.graphs.by_geography.total') }}</th>
            <th>{{ $t('ui.graphs.by_geography.fraction') }}<br>{{ $t('ui.graphs.by_geography.total') }}</th>

        </tr>
        </thead>
        <tbody>
        <tr v-for="(trash, key) in trashes" :key="key">
            <td>{{ $t(`ui.graphs.trashes.${key}`) }}</td>
            <template v-for="(value,year) in trash" :key="year">
                <td>{{prettify(value)}}</td>
                <td>{{prettify(value/formatted[year]*100, '%')}}</td>
            </template>
            <td>{{prettify(trashSums[key])}}</td>
            <td>{{prettify(trashSums[key]/totalSum*100, '%')}}</td>
        </tr>
        </tbody>
        <tfoot>
            <tr>
                <td>{{ $t('ui.graphs.by_geography.total') }}</td>
                <template v-for="(value, year) in formatted" :key="year">
                    <td>{{ prettify(value) }}</td>
                    <td>100%</td>
                </template>
                <td>{{prettify(totalSum)}}</td>
                <td>100%</td>
            </tr>
        </tfoot>
    </table>
</template>

<script>
import {prettify} from "@/logics/helpers";

export default {
    name: "DataTable",
    props: {
        trashes: {
            type: Object,
            required: true
        },
        name: {
            type: String,
            required: true
        },
    },
    data(){
        return {
            formatted: {},
            trashSums: {},
            totalSum: 0,
        }
    },
    methods:{
        updateFormatted() {
            let keys = Object.keys(this.trashes)

            let byYears = {}

            const years = Object.keys(this.trashes[keys[0]])
            for (const key of keys) {
                for (const year of years) {
                    if(byYears[year] === undefined) {
                        byYears[year] = {}
                    }

                    byYears[year][key] = this.trashes[key][year]
                }
            }

            this.formatted = {}
            for (const year of years) {
                this.formatted[year] = Object.values(byYears[year]).reduce((a,b)=>a+b)
            }
        },
        // eslint-disable-next-line no-unused-vars
        prettify(value, suffix = ' t', precision = 2) {
            return prettify(value, suffix, precision)
        },

        calculateTrashSums(trashes) {
            let sums = {}

            let keys = Object.keys(trashes)
            for (const trashType of keys) {
                if (sums[trashType] === undefined) {
                    sums[trashType] = 0
                }

                for (const year of Object.keys(trashes[trashType])) {
                    sums[trashType] += trashes[trashType][year]
                }
            }

            this.trashSums = sums
            this.totalSum = Object.values(sums).reduce((a,b)=>a+b)
        },
    },
    mounted() {
        this.updateFormatted()
        this.calculateTrashSums(this.trashes)
    },
    computed: {
        years() {
            let keys = Object.keys(this.trashes)

            if (keys.length === 0) return [];

            return Object.keys(this.trashes[keys[0]])
        }
    },
    watch: {
        trashes() {
            this.updateFormatted()
        }
    }
}
</script>

<style scoped>
@import "@/assets/css/dataTable.css";
</style>