<template>
    <table class="table table-hover">
        <thead>
        <tr>
            <th></th>
            <template v-for="trash in trashTypes" :key="trash">
                <th>{{ $t('ui.graphs.by_geography.amount') }}<br>{{ trash }}</th>
                <th>{{ $t('ui.graphs.by_geography.fraction') }}<br>{{ trash }}</th>
            </template>
            <th>Celkem podíl</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(region, key) in trashes" :key="key">
            <td class="name">{{ region.name }}</td>
            <template v-for="(value,key) in region.trashes.records" :key="key">
                <td>{{ prettify(value) }}</td>
                <td>{{ prettify(value / region.trashes.sum * 100, '%') }}</td>
            </template>
            <td>{{ prettify(region.trashes.sum / totalSum * 100, '%') }}</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td>{{ $t('ui.graphs.by_geography.sum') }}</td>
            <template v-for="trash in trashTypes" :key="trash">
                <td>{{ prettify(sumOfType(trash)) }}</td>
                <td>100%</td>
            </template>
            <td></td>
        </tr>
        </tfoot>
    </table>
</template>

<script>
import {getGeographyWithTrashes, prettify} from "@/logics/api/geography/advanced";

export default {
    name: "DataTable",
    props: {
        type: {
            type: String,
            default: '',
        },
        id: {
            type: String,
            default: '',
        },
        parentId: {
            type: String,
            default: ''
        },
        year: {
            type: Number,
            default: 2009
        }
    },
    beforeCreate() {
    },
    mounted() {

    },
    data() {
        return {
            trashes: [],
            trashTypes: []
        }
    },
    methods: {
        async loadTrashes() {
            let id = this.type === 'district' ? this.parentId : this.id
            this.trashes = await getGeographyWithTrashes(this.type, id, this.year)
            this.trashTypes = Object.keys(this.trashes[0].trashes.records)
        },
        isEmpty() {
            if (this.trashes === undefined) return true

            for (let i in this.trashes) {
                return false
            }
            return true
        },
        prettify(value, suffix = ' t', precision = 2) {
            return prettify(value, suffix, precision)
        },
        sumOfType(type) {
            let sum = 0;
            for (const region of this.trashes) {
                sum += region.trashes.records[type]
            }
            return sum
        }
    },
    computed: {
        totalSum() {
            let sum = 0;
            for (const region of this.trashes) {
                sum += region.trashes.sum
            }
            return sum
        }
    },
    watch: {
        id() {
            this.loadTrashes()
        },
        year() {
            this.loadTrashes()
        }
    }
}
</script>

<style scoped>
@import "@/assets/css/dataTable.css";
</style>