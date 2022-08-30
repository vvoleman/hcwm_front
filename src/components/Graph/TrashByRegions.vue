<template>
    <h3>{{ $t('ui.graphs.by_regions.titles.main') }}</h3>
    <div>
        <label for="yearSelect" style="margin-right: 5px">{{ $t('ui.graphs.choose_year') }}:</label>
        <select id="yearSelect" v-model="year">
            <option :value="2009+i-1" :key="i" v-for="i in 10">{{ 2009 + i - 1 }}</option>
        </select>
        <SelectGeography @update="handleGeographyUpdate" :disable-district="true"/>
    </div>
    <div class="d-md-flex flex-wrap justify-content-between segment chart-box map-box">
        <h4>{{ $t('ui.graphs.by_regions.titles.map') }}</h4>
        <div class="col-md-12 map-container">
            <MapChart
                :year="year"
                :type="selected.type"
                :id="selected.id"
            />
        </div>
        <!--        <geography-details-->
        <!--            class="col-md-5"-->
        <!--            :name="name"-->
        <!--            :year="year"-->
        <!--            :trashes="trashes"-->
        <!--        />-->
    </div>
    <div class="segment chart-box">
        <h4>{{ $t('ui.graphs.by_regions.titles.table') }}</h4>
        <div class="scroll-table">
            <data-table v-bind="selected" :year="year"/>
        </div>
    </div>

</template>
<script>

import MapChart from "@/components/Graph/Geography/MapChart";
import SelectGeography from "@/components/Graph/Geography/SelectGeography";
import GeographyDetails from "@/components/Graph/Geography/GeographyDetails";
import {getName, getTrash} from "@/logics/api/geography/basic";
import DataTable from "@/components/Graph/Regions/DataTable";

export default {
    name: 'TrashByRegions',
    components: {
        DataTable,
        // eslint-disable-next-line vue/no-unused-components
        GeographyDetails,
        SelectGeography,
        MapChart
    },
    data() {
        return {
            trashes: {},
            selected: {
                type: '',
                id: '',
                parentId: '',
            },
            year: 2009
        };
    },
    computed: {
        name() {
            return getName(this.selected.type, this.selected.id)
        },
    },
    methods: {
        async handleGeographyUpdate(data) {
            if (data.id === this.selected.id) {
                return
            }

            this.selected = {type: data.type, id: data.id, parentId: data.parentId}
            await this.refreshTrash(data.type, data.id)
        },
        async refreshTrash(geographyType, id) {
            this.trashes = await getTrash(geographyType, id)
            // this.selected.name =
        }
    },
    async mounted() {
    },
    watch: {}
};
</script>
<style scoped>
label {
    clip-path: polygon(75% 0, 0 0, 0 100%, 75% 100%, 100% 50%);
    padding: 12px 40px 12px 20px;
    background: #f7b731;
}

select {
    margin-left: -40px;
    padding: 12px 20px 12px 40px;
}
.map-container{
    height: 500px;
}
</style>