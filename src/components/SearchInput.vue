<template>
    <div class="search-block">
        <input type="text" v-model="query">
        <button class="btn-search btn-gray" @click="$emit('search')">
            <span class="center icon dripicons-search"></span>
        </button>
    </div>
</template>

<script>
export default {
    name: "SearchInput",
    data(){
        return {
            query: ''
        }
    },
    watch: {
        query(){
            this.$emit('update', this.query)
        }
    }
}
</script>

<style scoped>
.search-block{
    display: flex;
    justify-content: center;
}

.search-block input{
    width: 60%;
    border: 1px solid #ccc;
    padding:5px;
    box-shadow: var(--material-shadow-light);
}

.search-block .btn-search{
    margin-left:15px;
    width: 40px;
    height: 40px;
}
.search-block .btn-search:hover span{
    transform: scale(1.5);
}
</style>