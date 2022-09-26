<template>
    <div class="col-md-10 col-xxl-8 mx-auto main">
        <div class="hero">
            <h1 class="text-center title" style="margin-bottom: 15px">{{ $t('ui.graphs.trashes_overview') }}</h1>
            <div>
                <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis pulvinar. Duis sapien nunc, commodo
                    et, interdum suscipit, sollicitudin et, dolor. Mauris tincidunt sem sed arcu. Integer lacinia. Fusce
                    tellus. Vivamus ac leo pretium faucibus. Fusce aliquam vestibulum ipsum. Integer tempor. Duis
                    viverra diam non justo. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat
                    ante, in pharetra metus odio a lectus. Duis ante orci, molestie vitae vehicula venenatis, tincidunt
                    ac pede. Nulla pulvinar eleifend sem. Cras pede libero, dapibus nec, pretium sit amet, tempor
                    quis.
                </p>
                <b>Zdroje: <a href="#">něco</a></b>
            </div>
        </div>

        <TrashLegendBig />

        <div class="select-list d-md-block d-flex justify-content-center flex-wrap">
            <button class="select-box" :class="{'active':selected === 'byGeography'}" @click="selected = 'byGeography'">
                {{ $t('ui.graphs.by_geography.titles.main') }}
            </button>
            <button class="select-box" :class="{'active':selected === 'byRegions'}" @click="selected = 'byRegions'">
                {{ $t('ui.graphs.trashes_regions_yearly') }}
            </button>
        </div>
        <div>

            <!--            <TrashByDistricts v-if="selected === 'byDistricts'"/>-->
            <TrashByGeography v-if="selected === 'byGeography'"/>
            <TrashByRegions v-if="selected === 'byRegions'"/>
        </div>
    </div>
</template>

<script>
import TrashByRegions from "@/components/Graph/TrashByRegions";
import TrashByGeography from "@/components/Graph/TrashByGeography";
import TrashLegendBig from "@/components/Graph/TrashLegendBig";

export default {
    name: "DataGraphs",
    components: {TrashLegendBig, TrashByGeography, TrashByRegions},
    data() {
        return {
            selected: 'byRegions'
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
    flex: 1 1 0px;
    padding: 15px;
    background: var(--folder-alt-bg);
    color: var(--folder-alt-color);
    margin: 5px;
    border: none;
    box-shadow: var(--folder-alt-shadow)
}

.active {
    background: var(--main-color-dark);
    color: var(--folder-color);
}

.hero {
    padding: 20px;
}

.select-list {
    margin-bottom: 40px;
}
</style>