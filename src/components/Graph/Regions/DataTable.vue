<template>
    <div class="d-md-flex flex-wrap"
         :class="{'justify-content-between':areaSelected.length > 0, 'justify-content-end': areaSelected.length === 0}">
        <div v-if="areaSelected != null && areaSelected.length > 0">
            <button @click="cancelSelection" class="btn-export">
                {{ $t('ui.graphs.cancel_selection_btn') }}
            </button>
            <button @click="changeOnlySelected" class="btn-export">
                {{ $t('ui.graphs.show_only_selection_btn') }}
            </button>
        </div>
        <button @click="exportTable" class="btn-export" :aria-label="$t('ui.graphs.export_btn')">Exportovat</button>
    </div>
    <table class="table table-hover" :id="idTable">
        <thead>
        <tr>
            <th class="v-center">{{ name }}</th>
            <template v-for="trash in trashTypes" :key="trash">
                <th>{{ $t('ui.graphs.by_geography.amount') }}<br>{{ trash }}</th>
                <th>{{ $t('ui.graphs.by_geography.fraction') }}<br>{{ trash }}</th>
            </template>
            <th>{{ $t('ui.graphs.by_geography.amount') }}<br>{{ $t('ui.graphs.by_geography.total') }}</th>
            <th>{{ $t('ui.graphs.by_geography.fraction') }}<br>{{ $t('ui.graphs.by_geography.total') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(region, key) in filteredData" :key="key" :class="{'selected': isSelected(region.id)}">
            <td class="name">{{ region.name }}</td>
            <template v-for="(value,key) in region.trashes.records" :key="key">
                <td>{{ prettify(value) }}</td>
                <td>{{ prettify(value / trashSums[key] * 100, '%') }}</td>
            </template>
            <td>{{ prettify(region.trashes.sum) }}</td>
            <td>{{ prettify(region.trashes.sum / totalSum * 100, '%') }}</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td>{{ $t('ui.graphs.by_geography.total') }}</td>
            <template v-for="trash in trashTypes" :key="trash">
                <td>{{ prettify(sumOfType(trash)) }}</td>
                <td>{{ prettify(percSumOfType(trash), '%') }}</td>
            </template>
            <td>{{ prettify(totalSum, ' t') }}</td>
            <td>100%</td>
        </tr>
        </tfoot>
    </table>
</template>

<script>
import {prettify} from "@/logics/helpers";
import {useGeographyStore} from "@/stores/Geography/GeographyStore";

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
        },
        idTable: {
            type: String,
            required: true
        },
        areaSelected: {
            type: Array,
            default: () => []
        }
    },
    beforeCreate() {
    },
    mounted() {

    },
    data() {
        return {
            trashes: [],
            trashTypes: [],
            trashSums: [],
            adjustedSelection: {},
            showOnlySelected: false,
        }
    },
    methods: {
        changeOnlySelected() {
            console.log(`Changing from ${this.showOnlySelected} to ${!this.showOnlySelected}`)
            this.showOnlySelected = !this.showOnlySelected
        },
        cancelSelection() {
            this.$emit('cancelSelection', null)
        },
        adjustSelection() {
            let adjusted = {}
            for (const area of this.areaSelected.values()) {
                adjusted[area.id] = area
            }
            this.adjustedSelection = adjusted
        },
        isSelected(id) {
            return !!this.adjustedSelection[id]
        },
        async loadTrashes() {
            let id = this.type === 'district' ? this.parentId : this.id
            this.trashes = await useGeographyStore().getGeographyWithTrashes(this.type, id, this.year)
            this.trashTypes = Object.keys(this.trashes[0].trashes.records)

            this.calculateTrashSums(this.trashes, this.trashTypes)
        },
        isEmpty() {
            if (this.trashes === undefined) return true

            for (let i in this.trashes) {
                return false
            }
            return true
        },
        exportTable() {
            this.$emit('exportTable', this.idTable)
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
        },
        calculateTrashSums(trashes, types) {
            let sums = {}

            for (const region of trashes) {
                for (const type of types) {
                    if (sums[type] === undefined) {
                        sums[type] = 0
                    }

                    sums[type] += region.trashes.records[type]
                }
            }

            this.trashSums = sums
        },
        percSumOfType(type) {
            let sums = 0;

            for (const region of this.trashes) {
                sums += this.getPercentage(region.trashes.records[type], type)
            }
            return sums
        },
        getPercentage(value, type) {
            return value / this.trashSums[type] * 100
        },
    },
    computed: {
        totalSum() {
            let sum = 0;
            for (const region of this.filteredData) {
                sum += region.trashes.sum
            }
            return sum
        },
        name() {
            return useGeographyStore().getName(this.type, this.id)
        },
        filteredData() {
            let ids = this.areaSelected.map(area => area.id)
            return this.trashes.filter((region) => {
                return ids.includes(region.id) || !this.showOnlySelected
            })
        }
    },
    watch: {
        id() {
            this.loadTrashes()
        },
        year() {
            this.loadTrashes()
        },
        areaSelected() {
            this.adjustSelection()
        }
    }
}
</script>

<style scoped>
@import "@/assets/css/dataTable.css";

.v-center {
    vertical-align: middle;
}

.selected {
    background-color: var(--main-color-light);
}

.selected .name {
    background-color: inherit;
}
</style>