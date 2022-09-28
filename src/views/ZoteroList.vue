<template>
    <div>
        <ZoteroFilter @search="search" />
        <ZoteroResults :items="items" :folders="folders" :is-loading="isLoading" :breadcrumbs="breadcrumbs"/>
    </div>
</template>

<script>
import ZoteroFilter from "@/components/ZoteroFilter";
import ZoteroResults from "@/components/Results/ZoteroResults";

import { getItems } from "@/logics/api/filterItems";
import FilterData from "@/logics/api/data/FilterData";

export default {
    name: "ZoteroList",
    components: {ZoteroResults, ZoteroFilter},
    data(){
        return {
            items: [],
            folders: [],
            breadcrumbs: [],
            isLoading: false
        }
    },
    mounted() {
        const data = new FilterData();
        data.currentFolder = this.$router.currentRoute.value.fullPath
        this.loadItems(data)
    },
    methods: {
        async loadItems(data){
            this.isLoading = true;
            const response = await getItems(data)
            this.isLoading = false;
            if(response !== null){
                this.items = response.items;
                this.folders = response.folders;
                this.breadcrumbs = response.breadcrumbs
            } else {
                console.error('loadItems API error');
            }
        },
        search(data) {
            this.loadItems(data)
        }
    },

}
</script>

<style scoped>

</style>