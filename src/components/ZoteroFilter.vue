<template>
    <div class="filter-block col-md-10 col-11 mx-auto">
        <SearchInput @update="(data) => {selectedQuery = data}" @search="search"/>
        <div class="advanced-filter-separator">
            <span>{{ $t('ui.collections.advanced_filter') }}</span>
            <button
                @click="displayAdvanced = !displayAdvanced"
                class="center icon btn-gray"
                :class="{'dripicons-chevron-up': displayAdvanced, 'dripicons-chevron-down': !displayAdvanced}"></button>
        </div>
        <transition>
            <div class="advanced-filter-block col-md-10 mx-auto" v-if="displayAdvanced">
                <div class="arrow-up"></div>
                <div class="d-md-flex flex-wrap selects">
                    <SelectMultiple
                        :label="$t('ui.collections.filter.languages')"
                        :options="languages"
                        :value="selectedLanguages"
                        @input="(data) => {selectedLanguages = data}"
                    >
                        <template v-slot:singlelabel="{value}">
                            <div class="multiselect-single-label">
                                <img class="character-label-icon" :src="value.flag" style="margin-right: 5px"> {{ value.name }}
                            </div>
                        </template>
                        <template v-slot:option="{option}">
                            <img class="character-option-icon" :src="option.flag" style="margin-right: 5px"> {{ option.name }}
                        </template>
                    </SelectMultiple>
                    <SelectMultiple
                        :searchable="true"
                        :label="$t('ui.collections.filter.categories')"
                        :value="selectedCategories"
                        @input="(data)=>{selectedCategories = data}"
                        :options="categories"/>
                </div>
<!--                <div class="col-12 mx-auto result-number">-->
<!--                    <span><b>0</b> výsledků</span>-->
<!--                </div>-->
            </div>
        </transition>
    </div>
</template>

<script>
import {getLanguages} from "@/logics/api/languages";
import FilterData from "@/logics/api/data/FilterData";
import {loadCategories} from "@/logics/api/assets";

export default {
    name: "ZoteroFilter",
    data() {
        return {
            displayAdvanced: false,
            languages: [],
            categories: [],
            selectedLanguages: [],
            selectedCategories: [],
            selectedQuery: ''
        }
    },
    mounted() {
        getLanguages().then(value => {
            //remap to value name flag
            this.languages = value.map(language => {
                return {
                    value: language.code,
                    name: language.name,
                    flag: language.flag
                }
            })
        })
        loadCategories().then(value =>{
            this.categories = value.map(category =>{
                return {
                    value: category.id,
                    name: category.text
                };
            })
        })
    },
    methods: {
        search() {
            const filterData = new FilterData()
            filterData.query = this.selectedQuery
            filterData.languages = [...this.selectedLanguages]
            filterData.categories = [...this.selectedCategories]
            filterData.currentFolder = this.$router.currentRoute.value.fullPath
            filterData.usedLanguage = this.$i18n.locale
            this.$emit('search', filterData)
        }
    },
    watch:{
        $route(){
            this.search()
        }
    }
}
</script>

<script setup>
import SearchInput from "@/components/SearchInput";
import SelectMultiple from "@/components/SelectMultiple";
</script>

<style scoped>
.filter-block {
    margin-top: 20px;
}

.selects > * {
    margin-right: 15px;
}

.advanced-filter-separator {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.advanced-filter-separator button.icon {
    margin-left: 15px;
    width: 40px;
    height: 40px;
}

.advanced-filter-block {
    box-shadow: var(--folder-alt-shadow);
    padding: 30px;
    margin-top: 30px;
    background: var(--folder-alt-bg);
    border-radius: 5px;
    min-height: 50px;
}

.arrow-up {
    position: absolute;
    margin-top: -40px;
    left: calc(50% - 25px);
    width: 0;
    height: 0;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;

    border-bottom: 25px solid #eee;
}

.result-number {
    margin-top: 20px;
    margin-bottom: -15px;
    text-align: center;
    opacity: 0.7;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>