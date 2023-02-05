<template>
    <div class="col-11 col-md-10 mx-auto">
        <BreadcrumbsPath :breadcrumbs="breadcrumbs"/>
        <div class="results-block">
            <div v-if="!isLoading">
                <div class="d-flex flex-wrap">
                    <div class="folder-block">
                        <ZoteroFolder
                            v-for="folder in folders"
                            :key="folder.id"
                            :text="getTranslation(folder.text,currentLocale).text"
                            :path="getTranslation(folder.path,currentLocale).path"/>
                    </div>
                </div>
                <div>
                    <ZoteroItems
                        :items="items"
                    />
                </div>
            </div>
            <div v-else class="center-flex">
                <SpinLoader class="loader"></SpinLoader>
            </div>
        </div>
        <RecentItems style="margin-top:40px"/>
    </div>

</template>

<script>
import BreadcrumbsPath from "@/components/BreadcrumbPaths";
import ZoteroFolder from '@/components/ZoteroFolder'
import ZoteroItems from "@/components/Results/ZoteroItems";
import SpinLoader from "@/components/SpinLoader";
import RecentItems from "@/components/RecentItems";
import {mapActions} from "pinia";
import {useTranslationStore} from "@/stores/Zotero/TranslationStore";

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
        breadcrumbs: {
            type:Array,
            default: () => []
        }
    },
    computed: {
        currentLocale() {
            return this.$i18n.locale
        }
    },
    methods: {
        ...mapActions(useTranslationStore, ['getTranslation']),
    }
}
</script>

<style scoped>
.center-flex {
    min-height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.results-block {
    margin-top: 20px;
    min-height: 500px;
}

.folder-block {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.loader{
    margin-top:15px;
    margin-left: auto;
    margin-right: auto;
}
</style>