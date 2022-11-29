<template>
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="dropdown-language" role="button"
           data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span><img style="margin-right: 5px" :src="selected.flag" width="30"
                   alt="cs"> {{selected.name}}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown-language">
            <li v-for="language in getUnselectedLanguages" :key="language.code">
                <a class="dropdown-item" @click="selectedLanguage(language.code)">
                    <img style="margin-right: 5px" :src="language.flag" width="30"
                         :alt="language.code">
                    {{ language.name }}
                </a>
            </li>
        </ul>
    </li>
</template>

<script>
import '@/assets/images/flags/cs/width_40.png'
import {useAssetStore} from "@/stores/Zotero/AssetStore";

export default {
    name: "LanguagePicker",
    data() {
        return {
            languages: [],
            selected: {}
        }
    },
    async mounted() {
        this.languages = await useAssetStore().allLanguages
        this.selectedLanguage(this.$i18n.locale)
    },
    methods: {
        async selectedLanguage(code) {
            const filteredLanguages = await useAssetStore().allLanguages

            if (filteredLanguages.length === 0) {
                code = this.$i18n.fallbackLocale
            }
            let newLanguage = this.filterLanguage(code)
            console.log('Selected language: '+code)

            if (newLanguage.length === 0) {
                console.error('Unable to select language!');
                return;
            }

            this.selected = newLanguage[0]
            localStorage.setItem('i18n', this.selected.code)
            this.$i18n.locale = this.selected.code
        },
        filterLanguage(code) {
            return this.languages.filter((language) => language.code === code)
        }
    },
    computed: {
        getUnselectedLanguages() {
            const selectedLanguage = this.selected;
            return this.languages.filter((language) => {
                return selectedLanguage == null ? true : language.code !== selectedLanguage.code
            })
        }
    }

}
</script>

<style scoped>
@import "@/assets/css/variables.css";

.nav-link:hover,
.nav-link:focus {
    color: var(--navbar-color-hover);
    text-decoration: none;
    background-size: 100% 2px;
}

.nav-link {
    text-decoration: none;
    background-image: linear-gradient(var(--navbar-color), var(--navbar-color));
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: 0% 2px;
    transition: 0.1s;
}

a.nav-link {
    color: var(--navbar-color)
}
.dropdown-menu.show {
    position: absolute;
    right:0;
    left:inherit;
}
#dropdown-language:hover, .item:hover {
    background-size: 0;
}
</style>