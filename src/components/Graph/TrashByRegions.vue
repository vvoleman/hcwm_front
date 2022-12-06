<template>
    <h3>{{ $t('ui.graphs.by_regions.titles.main') }}</h3>
    <div>
        <SelectGeography @update="handleGeographyUpdate" :disable-district="true" :disable-year="false"/>
    </div>
    <SegmentWrapper>
        <template #title>
            <h4>{{ $t('ui.graphs.by_regions.titles.map') }}</h4>
            <b class="subtitle">{{ selected.year }}</b>
            <small v-if="!isReady" class="subtitle"><br>{{ $t('ui.graphs.loading') }}</small>
        </template>
        <template #body>
            <SelectAreas :areas="selectedAreas" @cancel="cancelSelection" />
            <div class="col-md-12 map-container">
                <MapgChart
                    :year="selected.year"
                    :type="selected.type"
                    :id="selected.id"
                    :selected-areas-ids="selectedAreasIds"
                    @geography-selected="handleGeographySelected"
                    @ready="mapReady"
                />
            </div>
        </template>
    </SegmentWrapper>
    <SegmentWrapper>
        <template #title>
            <h4>{{ $t('ui.graphs.by_regions.titles.table') }}</h4>
            <b class="subtitle">{{ selected.year }}</b>
        </template>
        <template #body>
            <div class="scroll-table">
                <data-table
                    v-bind="selected"
                    :year="selected.year"
                    id-table="trashByRegions"
                    :area-selected="selectedAreas"
                    @exportTable="exportTable"
                    @cancelSelection="cancelSelection"
                />
            </div>
        </template>
    </SegmentWrapper>
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
                Vivamus ac leo pretium faucibus.
            </p>
            <p>Fusce aliquam vestibulum ipsum. Integer tempor. Duis viverra diam non
                justo. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus
                odio a lectus
                <TrashLegendItem code="F180104"/>
                . Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Nulla pulvinar
                eleifend sem. Cras pede libero, dapibus nec, pretium sit amet, tempor quis.
            </p>

        </template>
    </SegmentWrapper>
</template>
<script>

import MapChart from "@/components/Graph/Geography/MapChart";
import SelectGeography from "@/components/Graph/Geography/SelectGeography";
import GeographyDetails from "@/components/Graph/Geography/GeographyDetails";
import DataTable from "@/components/Graph/Regions/DataTable";
import {useGeographyStore} from "@/stores/Geography/GeographyStore";
import {useTrashStore} from "@/stores/Trash/TrashStore";
import SegmentWrapper from "@/components/Graph/SegmentWrapper";
import TrashLegendItem from "@/components/Graph/TrashLegendItem";
import SelectAreas from "@/components/Graph/Regions/SelectAreas";
import {downloadTable} from "@/logics/api/spreadsheets";

export default {
    name: 'TrashByRegions',
    components: {
        SelectAreas,
        TrashLegendItem,
        SegmentWrapper,
        DataTable,
        // eslint-disable-next-line vue/no-unused-components
        GeographyDetails,
        SelectGeography,
        MapChart
    },
    data() {
        return {
            isReady: false,
            trashes: {},
            selected: {
                type: '',
                id: '',
                parentId: '',
                year: 2009
            },
            selectedAreasIds: {},
            selectedAreas: []
        };
    },
    computed: {
        name() {
            return useGeographyStore().getName(this.selected.type, this.selected.id)
        },
    },
    methods: {
        async exportTable(id) {
            await downloadTable(id, `${this.selected.type}/${this.selected.id}/${this.selected.year}`, `trashByRegions-${this.selected.year}`)
        },
        cancelSelection(id){
            if (id !== null && this.selectedAreasIds[id]) {
                this.selectedAreasIds[id] = false;
            } else {
                this.selectedAreasIds = {};
            }
            this.setSelectedAreas()
        },
        async handleGeographyUpdate(data) {
            this.isReady = false;
            if (data.id === this.selected.id && data.year === this.selected.year) {
                return
            }

            this.selected = {type: data.type, id: data.id, parentId: data.parentId, year: data.year}
            await this.refreshTrash(data.type, data.id)
        },
        async handleGeographySelected(data) {
            this.selectedAreasIds[data] = 1
            await this.setSelectedAreas()
        },
        async setSelectedAreas() {
            let areasLoaded = await useGeographyStore().getGeography(this.selected.type, this.selected.id)
            let areas = []
            let name = this.selected.type === 'country' ? 'region' : 'district'
            console.log(this.selectedAreasIds)
            for (const item of Object.values(areasLoaded)) {
                let idName = name+'_id'
                let val = this.selectedAreasIds[item[idName]]
                if (val) {
                    areas.push({
                        id: item[idName],
                        name: item['name']
                    })
                }
            }
            this.selectedAreas = areas
        },
        async refreshTrash(geographyType, id) {
            this.trashes = await useTrashStore().getTrash(geographyType, id)
            // this.selected.name =
        },
        mapReady() {
            this.isReady = true
        }
    },
    async mounted() {
    },
    watch: {}
};
</script>
<style>
canvas {
    z-index:4 !important;
}
</style>
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

.map-container {
    height: 500px;
}

</style>