<template>
    <div class="breadcrumbs">
        <router-link to="/">{{ $t('ui.items.root') }}</router-link>
        <span v-for="(part,i) in parts" :key="part.url">
            &raquo; <router-link v-if="i !== parts.length-1" :to="part.url">{{ part.text }}</router-link>
            <span v-else>{{ part.text }}</span>
        </span>
    </div>
</template>

<script>
export default {
    name: "BreadcrumbsPath",
    data(){
        return {
            parts: []
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
        this.prepareParts()
    },
    watch:{
        $route (){
            this.prepareParts()
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