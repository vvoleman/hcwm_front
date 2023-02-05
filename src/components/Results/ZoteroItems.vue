<template>
    <div class="items" v-if="items.length > 0">
        <SingleItem
            v-for="item in items"
            :key="item.id"
            :id="item.id"
            :title="item.title"
            :abstract="item.abstract"
            :categories="item.categories"
            :added-at="item.dateAdded"
            :url="item.url"
        />
    </div>
    <div v-else class="text-center no-results">
        <b>{{ $t('ui.items.no_results') }}</b>
    </div>
</template>

<script>
import SingleItem from "@/components/Results/SingleItem";
export default {
    name: "ZoteroItems",
    components: {SingleItem},
    props: {
        items: Array
    },
}
</script>

<style scoped>
@import "@/assets/css/items.css";
.no-results {
    margin-top: 20px;
    color: rgba(0,0,0,0.5);
}

/* every .zotero-items .abstract should have a same heigh */

</style>