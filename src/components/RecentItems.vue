<template>
    <div class="bg-items">
        <div class="block-label">
            <h2>{{$t('ui.items.recent_items')}}:</h2>
        </div>
        <div class="items">
            <SingleItem
                v-for="item in items"
                :key="item.id"
                :id="item.id"
                :title="item.title"
                :abstract="item.abstract"
                :categories="item.categories"
                :url="item.url"
                :addedAt="item.dateAdded"
            />
        </div>
    </div>
</template>

<script>
import SingleItem from "@/components/Results/SingleItem";
import {useItemStore} from "@/stores/Zotero/ItemStore";
export default {
    name: "RecentItems",
    components: {SingleItem},
    data(){
        return {
            items: []
        }
    },
    async mounted() {
        let recent = await useItemStore().recentItems;

        if (recent === null) {
            this.$notify({
                title: this.$t('ui.error'),
                text: this.$t('ui.items.errors.recent_items'),
                type: 'error'
            })
        } else {
            this.items = recent;
        }
    }
}
</script>

<style scoped>
@import "@/assets/css/variables.css";
@import "@/assets/css/items.css";

.block-label{
    padding:10px;
    border-bottom: 2px solid var(--main-color-dark);
}

</style>