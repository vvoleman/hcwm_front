<template>
    <div class="item">
        <div class="title-line">
            <h3>
                {{ getTranslation(title, currentLocale).text }}
            </h3>
            <!--<TranslateModal
                v-if="displayTranslate"
                @close="displayTranslate = !displayTranslate"
                @select="translateAbstract"
            />!-->
            <button class="btn-gray center icon dripicons-map" @click="displayTranslate = !displayTranslate">
            </button>
        </div>
        <div class="abstract special-scroll">
            <Transition>
                <blockquote v-if="!loadingTranslation">{{ text }}</blockquote>
            </Transition>
        </div>
        <div class="attributes">
            <div class="box">
                <b class="dripicons-calendar"></b>
                <span>{{ formattedDate }}</span>
            </div>
            <div class="box url">
                <b class="dripicons-web"></b>
                <a :href="url">{{ formattedUrl }}</a>
            </div>
        </div>
        <hr v-if="categories.length > 0">
        <div class="tags">
            <button class="tag" v-for="tag in categories" :key="tag.id" @click="handleTagClick(tag.id)">
                <span>
                    {{ tag.text }}
                </span>
            </button>
        </div>
    </div>
</template>

<script>
import {useTranslationStore} from "@/stores/Zotero/TranslationStore";
import {mapActions} from "pinia";
import {emitter} from "@/composables/useEvent";
import FilterData from "@/logics/api/data/FilterData";

export default {
    name: "SingleItem",
    components: {},
    props: {
        id: String,
        title: Array,
        abstract: String,
        categories: Array,
        url: String,
        addedAt: String,
    },
    data() {
        return {
            displayTranslate: false,
            loadingTranslation: false,
            text: this.abstract
        }
    },
    computed: {
        currentLocale() {
            return this.$i18n.locale
        },
        formattedUrl() {
            // get domain name: https://google.com -> google.com
            return this.url.replace(/(https?:\/\/)?(www\.)?/g, '').split('/')[0]
        },
        formattedDate() {
            console.log(this.addedAt)
            if (this.addedAt === undefined) return this.$t('ui.items.no_date')

            return new Date(this.addedAt).toLocaleDateString()
        }
    },
    methods: {
        ...mapActions(useTranslationStore, ['getTranslation']),
        async translateAbstract(code) {
            this.loadingTranslation = true
            const result = await useTranslationStore().translate(this.id, code)
            this.loadingTranslation = false

            if (result != null) {
                console.log(result)
                this.text = result
            }
        },
        handleTagClick(id) {
            let data = new FilterData()
            data.categories = [id]
            emitter.emit('filter-changed', data)
        }
    }
}
</script>

<style scoped>
.attributes {
    display: inline-flex;
    gap: 5px;
    flex-wrap: wrap;
}

.item a {
    text-decoration: none;
    color: inherit;
}

.item {
    padding: 15px;
    /*width: calc(33% - 10px);*/
    margin-right: 10px;
    box-shadow: var(--material-shadow);
    min-height: 50px;
    background: #fff;
    border-radius: 2px;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
}

.box > * {
    margin-left: 5px;
}

.box b {
    font-weight: bold;
}

.dripicons-calendar {
    margin-top: -1px;
}

.box {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: white;
    background: var(--main-color-dark);
    padding: 5px;
    margin-top: 10px;
    box-shadow: var(--material-shadow-light);
}

.tag::before {
    content: '#';
    margin-right: 5px;
}

.tag {
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 5px;
    color: var(--tag-color);
    background: var(--tag-bg);
}

.item .tags {
    display: inline-flex;
    gap: 5px;
}

.item .tags .tag {
    display: inline-block;
}

.item .title-line {
    display: flex;
    justify-content: space-between;
}

.item .abstract {
    height: 220px;
    overflow-y: auto;
    margin-bottom: 10px;
}

blockquote {
    border-left: 8px solid var(--main-color-dark);
    padding: 0.5em 10px;
}

blockquote p {
    display: inline;
}

.item .title-line h3 {
    width: 80%;
    height: 100px;
    overflow-x: auto;
    font-size: 20px;
}

.item .title-line button {
    width: 40px;
    height: 40px;
}

.item .tags {
    /*margin-top: 10px;*/
}

.item .tags .tag {
    display: inline-block;
    border: none;
}

.item .tags .tag:hover {
    background: var(--main-color-darkest);
}

@media only screen and (max-width: 720px) {
    .item {
        width: calc(100% / 12 * 3.8);
    }

    .item .title-line {
        justify-content: space-between;
    }

    .item {
        padding: 30px;
        width: 100%;
    }
}

</style>