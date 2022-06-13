<template>
    <div class="bg-items">
        <div class="block-label">
            <h3>{{$t('ui.items.recent_items')}}:</h3>
        </div>
        <div class="items d-lg-flex flex-wrap">
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
    </div>
</template>

<script>
import SingleItem from "@/components/Results/SingleItem";
import {getRecent} from "@/logics/api/filterItems";
export default {
    name: "RecentItems",
    components: {SingleItem},
    data(){
        return {
            items: []
        }
    },
    mounted() {
        getRecent().then(result => {
            if(result == null){
                this.$notify({
                    'title': 'Chyba',
                    'text': 'Nepodařilo se získat nedávné články. Zkuste to prosím později',
                    'type': 'error'
                })
                return
            }

            this.items = result
        })
    }
}
</script>

<style scoped>
@import "@/assets/css/variables.css";

.block-label{
    padding:10px;
}
.bg-items{
    padding:20px;
    background: #f8f8f8;
}
</style>