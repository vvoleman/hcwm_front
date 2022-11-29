<!--suppress HtmlUnknownAttribute -->
<template>
    <transition>
        <div class="drop" v-click-outside="close">
            {{ $t('ui.items.select_language') }}
            <multiselect
                :options="languages"
                v-model="selected"
            >
                <template v-slot:singlelabel="{value}">
                    <div class="multiselect-single-label">
                        <img class="character-label-icon" :src="value.flag" style="margin-right: 10px"> {{ value.name }}
                    </div>
                </template>
                <template v-slot:option="{option}">
                    <img class="character-option-icon" :src="option.flag" width="30"> <span
                    style="margin-left: 5px">{{ option.name }}</span>
                </template>
            </multiselect>
            <button @click="run" class="btn btn-custom" style="width: 100%;margin-top:10px">Přeložit</button>
        </div>
    </transition>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import {useAssetStore} from "@/stores/Zotero/AssetStore";

export default {
    name: "TranslateModal",
    components: {Multiselect},
    data() {
        return {
            selected: null,
            languages: []
        }
    },
    async mounted() {
        this.languages = (await useAssetStore().allLanguages).map((lang) => {
            return {
                value: lang.code,
                name: lang.name,
                flag: lang.flag
            }
        })
    },
    methods: {
        close() {
            this.$emit('close')
        },
        run() {
            this.$emit('close')
            this.$emit('select', this.selected)
        }
    }
}
</script>

<style scoped>
.drop {
    position: absolute;
    margin-left: auto;
    min-height: 100px;
    padding: 15px;
    background: white;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
}
.btn-custom {
    background: var(--main-color-dark);
    color: white;
}
.btn-custom:hover {
    background: var(--main-color-darkest);
    color:white;
}
</style>