<template>
    <h3>{{ $t('ui.graphs.by_regions.titles.main') }}</h3>
    <div>
        <SelectGeography @update="handleGeographyUpdate" :disable-district="true" :disable-year="false"/>
    </div>
    <SegmentWrapper>
        <template #title>
            <h4>{{ $t('ui.graphs.by_regions.titles.map') }}</h4>
            <b class="subtitle">{{ selected.year }}</b>
        </template>
        <template #body>
            <div class="col-md-12 map-container">
                <MapChart
                    :year="selected.year"
                    :type="selected.type"
                    :id="selected.id"
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
                <data-table v-bind="selected" :year="selected.year"/>
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
                Vivamus ac leo pretium faucibus.</p>
            <p>Fusce aliquam vestibulum ipsum. Integer tempor. Duis viverra diam non
                justo. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus
                odio a lectus <TrashLegendItem code="F180104"/>. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Nulla pulvinar
                eleifend sem. Cras pede libero, dapibus nec, pretium sit amet, tempor quis.</p>

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

export default {
    name: 'TrashByRegions',
    components: {
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
            trashes: {},
            selected: {
                type: '',
                id: '',
                parentId: '',
                year: 2009
            },
        };
    },
    computed: {
        name() {
            return useGeographyStore().getName(this.selected.type, this.selected.id)
        },
    },
    methods: {
        async handleGeographyUpdate(data) {
            if (data.id === this.selected.id && data.year === this.selected.year) {
                return
            }

            this.selected = {type: data.type, id: data.id, parentId: data.parentId, year: data.year}
            await this.refreshTrash(data.type, data.id)
        },
        async refreshTrash(geographyType, id) {
            this.trashes = await useTrashStore().getTrash(geographyType, id)
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

.map-container {
    height: 500px;
}

</style>