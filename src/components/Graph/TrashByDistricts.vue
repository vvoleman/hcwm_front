<template>
    <h3>{{ $t('ui.maps.trashes_district_yearly') }}</h3>
    <div>
        <label for="selectDistrict">{{ $t('ui.maps.choose_district') }}:</label>
        <select v-model="selectedDistrict" id="selectDistrict" style="margin-left: 15px">
            <option v-for="(value, key) in districts" :key="key" :value="key">{{value}}</option>
        </select>
    </div>
    <BarChart style="height: 500px" :district-code="selectedDistrict" />
</template>

<script>
import BarChart from "@/components/Graph/Charts/BarChart";
import {getDistricts} from "@/logics/api/assets";
export default {
    name: "TrashByDistricts",
    components: {BarChart},
    data(){
        return {
            selectedDistrict: 1000,
            districts:[]
        }
    },
    async mounted() {
        this.districts = await getDistricts()
    },
    computed:{
    }
}
</script>

<style scoped>

</style>