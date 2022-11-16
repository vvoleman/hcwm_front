<template>
    <div class="zotero-items" v-if="items.length > 0">
        <SingleItem
            v-for="item in items"
            :key="item.id"
            :id="item.id"
            :title="item.title"
            :abstract="item.abstract"
            :categories="item.categories"
            :url="item.url"
        />
    </div>
    <div v-else class="text-center">
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
    }
}
</script>

<style scoped>
.zotero-items {
    display:flex;
    flex-wrap: wrap;
}
/* every .zotero-items .abstract should have a same heigh */

</style>