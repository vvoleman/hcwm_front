<template>
    <div class="item">
        <div class="title-line">
            <h3>
                {{ getTranslations(title, currentLocale).text }}
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
        <div class="tags">
            <div class="tag" v-for="tag in categories" :key="tag.id">{{ tag.text }}</div>
        </div>
    </div>
</template>

<script>
import TranslateModal from "@/components/TranslateModal";
import {translate} from "@/logics/api/languages";
export default {
    name: "SingleItem",
    components: {TranslateModal},
    props: {
        id: String,
        title: Array,
        abstract: String,
        categories: Array,
        url: String
    },
    data(){
        return {
            displayTranslate: false,
            loadingTranslation: false,
            text: this.abstract
        }
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
        },
        async translateAbstract(code) {
            this.loadingTranslation = true
            const result = await translate(code, this.id)
            this.loadingTranslation = false

            if(result != null){
                this.text = result
            }

        }
    }
}
</script>

<style scoped>
.item {
    padding: 15px;
    width: calc(100% / 12 * 3 - 10px);
    margin-right:10px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.2);
    min-height: 50px;
    background: #eee;
    border-radius: 5px;
    margin-top: 15px;
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
    font-size: 23px;
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