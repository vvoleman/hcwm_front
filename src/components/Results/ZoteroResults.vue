<template>
    <div class="col-md-10 mx-auto">
        <div class="results-block">
            <BreadcrumbsPath/>
            <div v-if="!isLoading">
                <div class="folder-block">
                    <ZoteroFolder
                        v-for="folder in folders"
                        :key="folder.id"
                        :text="getTranslations(folder.text,currentLocale).text"
                        :path="getTranslations(folder.path,currentLocale).path"/>
                </div>
                <div>
                    <ZoteroItems
                        :items="items"
                    />
                </div>
            </div>
            <SpinLoader class="loader" v-else></SpinLoader>
        </div>
        <RecentItems style="margin-top:20px"/>
    </div>

</template>

<script>
import BreadcrumbsPath from "@/components/BreadcrumbPaths";
import ZoteroFolder from '@/components/ZoteroFolder'
import ZoteroItems from "@/components/Results/ZoteroItems";
import SpinLoader from "@/components/SpinLoader";
import RecentItems from "@/components/RecentItems";

export default {
    name: "ZoteroResults",
    components: {RecentItems, SpinLoader, ZoteroItems, ZoteroFolder, BreadcrumbsPath},
    data() {
        return {}
    },
    props: {
        items: Array,
        folders: Array,
        isLoading: Boolean,
    },
    computed: {
        currentLocale() {
            return this.$i18n.locale
        }
    },
    methods: {
        getTranslations(arr, code) {
            for (const item of arr) {
                if (item.code === code) {
                    return item;
                }
            }
            console.error('No translations found');
        }
    }
}
</script>

<style scoped>
.results-block {
    margin-top: 20px;
    min-height: 500px;
}

.folder-block {
    justify-content: start;
    display: flex;
    flex-wrap: wrap;

}
.loader{
    margin-top:15px;
    margin-left: auto;
    margin-right: auto;
}
</style>