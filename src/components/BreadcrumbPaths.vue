<template>
    <div class="breadcrumbs">
        <router-link to="/">{{ $t('ui.items.root') }}</router-link>
        <span v-for="(part,i) in breadcrumbs" :key="part.url">
            &raquo; <router-link v-if="i !== breadcrumbs.length-1" :to="'/'+part.url[lang]">{{ part.name[lang] }}</router-link>
            <span v-else>{{ part.name[lang] }}</span>
        </span>
    </div>
</template>

<script>
export default {
    name: "BreadcrumbsPath",
    props: {
        breadcrumbs: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        prepareParts() {
            const path = this.$router.currentRoute.value.path;

            if (path === '/'){
                this.parts = [];
                return;
            }

            const pathParts = path.split('/')
            pathParts.shift();
            const result = []

            let temp;
            for (let i = 0; i < pathParts.length; i++) {
                temp = [];
                for (let j = 0; j <= i; j++) {
                    temp.push(pathParts[j]);
                }
                result.push({
                    'text': pathParts[i],
                    'url': '/'+temp.join('/')
                })
            }
            this.parts = result
        }
    },
    mounted() {
        // this.prepareParts()
    },
    watch:{
        $route (){
            this.prepareParts()
        }
    },
    computed: {
        lang() {
            return this.$i18n.locale
        }
    }
}
</script>

<style scoped>
.breadcrumbs {
    display:inline-block;
    border-radius: 5px;
    padding: 3px 15px;
    background: var(--main-color-darkest);
    color:white;

}

.breadcrumbs a {
    font-weight: bold;
    color: inherit;
    text-decoration: none;
    transition: .1s ease;
}

.breadcrumbs a:hover{
    color: #f7b731;
}
</style>