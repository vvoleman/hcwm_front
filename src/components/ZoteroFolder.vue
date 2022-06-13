<template>
    <router-link :to="'/'+path" :title="text">
        <div class="zotero-folder">
            {{ text }}
        </div>
    </router-link>
</template>

<script>

export default {
    name: "ZoteroFolder",
    props: {
        text: String,
        path: String
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
@import "@/assets/css/variables.css";

.zotero-folder {
    padding: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    background: var(--folder-bg);
    color: var(--folder-color);
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
    font-weight: bold;
}

a {
    text-decoration: none;
}
</style>