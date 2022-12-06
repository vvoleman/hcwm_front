<template>
    <div class="item">
        <div class="title-line">
            <h3>
                {{ getTranslation(title, currentLocale).text }}
            </h3>
            <TranslateModal
                v-if="displayTranslate"
                @close="displayTranslate = !displayTranslate"
                @select="translateAbstract"
            />
            <button class="btn-gray center icon dripicons-map" @click="displayTranslate = !displayTranslate">

            </button>
        </div>
        <div class="abstract special-scroll">
            <Transition>
                <p v-if="!loadingTranslation">{{ text }}</p>
            </Transition>
        </div>
        <div class="box">
            <b>Datum přidání:</b>
            <span>{{formattedDate}}</span>
        </div>
        <div class="box url">
            <b>URL:</b>
            <a :href="url">{{ formattedUrl }}</a>
        </div>
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
import TranslateModal from "@/components/TranslateModal";
import {useTranslationStore} from "@/stores/Zotero/TranslationStore";
import {mapActions} from "pinia";
import {emitter} from "@/composables/useEvent";
import FilterData from "@/logics/api/data/FilterData";

export default {
    name: "SingleItem",
    components: {TranslateModal},
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
            if (this.addedAt === undefined) return ' - '

            return new Date(this.addedAt).toLocaleDateString()
        }
    },
    methods: {
        ...mapActions(useTranslationStore, ['getTranslation']),
        async translateAbstract(code) {
            console.log(code)
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
.item a {
    color: inherit;
}
.item {
    padding: 15px;
    width: calc(33% - 10px);
    margin-right: 10px;
    box-shadow: 0 0 3px 0 rgb(0 0 0 / 20%);
    min-height: 50px;
    background: #eee;
    border-radius: 5px;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
}

.box > *{
    margin-left: 5px;
}

.box {
    background: #ddd;
    padding: 5px 10px;
    margin-top: 10px;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
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
    margin: 2px;
    background: var(--tag-bg);
}

.item .tags {
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
    padding: 5px;
    background: #ddd;
    margin-top: 10px;
}

.item .tags .tag {
    display: inline-block;
}

.item .title-line {
    display: flex;
    justify-content: space-between;
}

.item .abstract {
    margin-top: 5px;
    background: #ddd;
    padding: 15px;
    height: 220px;
    overflow-y: auto;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
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
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
    padding: 5px;
    background: #ddd;
    margin-top: 10px;
}

.item .tags .tag {
    display: inline-block;
    border:none;
}
.item .tags .tag:hover{
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

@media only screen and (max-width: 1200px) {
    .item {
        width: calc(100% / 12 * 4 - 10px);
    }
}

@media only screen and (max-width: 850px) {
    .item {
        width: calc(100% / 12 * 6 - 10px);
    }
}

@media only screen and (max-width: 600px) {
    .item {
        margin-left: 15px;
        width: calc(100% / 12 * 12 - 30px);
    }
}

</style>