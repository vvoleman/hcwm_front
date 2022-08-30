<template>
    <div class="col-md-10 col-xxl-8 mx-auto">
        <h1 class="text-center" style="margin-bottom: 15px">{{ $t('ui.graphs.trashes_overview') }}</h1>
        <div class="select-list">
            <button class="select-box" :class="{'active':selected === 'byGeography'}" @click="selected = 'byGeography'">
                {{ $t('ui.graphs.by_geography.titles.main') }}
            </button>
            <button class="select-box" :class="{'active':selected === 'byRegions'}" @click="selected = 'byRegions'">
                {{ $t('ui.graphs.trashes_regions_yearly') }}
            </button>
        </div>
        <div>

<!--            <TrashByDistricts v-if="selected === 'byDistricts'"/>-->
            <TrashByGeography v-if="selected === 'byGeography'" />
            <TrashByRegions v-if="selected === 'byRegions'"/>
        </div>
    </div>
</template>

<script>
import TrashByRegions from "@/components/Graph/TrashByRegions";
import TrashByGeography from "@/components/Graph/TrashByGeography";

export default {
    name: "DataGraphs",
    components: {TrashByGeography, TrashByRegions},
    data() {
        return {
            selected: 'byGeography'
        }
    },
}
</script>

<style>
.select-list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;

}

.select-box {
    padding: 15px;
    background: #dddddd;
    margin: 5px;
    border: none;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
}

.active {
    background: #f7b731;
}
</style>