<template>
    <notifications position="bottom right" />
    <NavBar />
    <router-view></router-view>
</template>

<script>

import NavBar from "@/components/NavBar";
export default {
  name: 'App',
    components: {NavBar},
    mounted() {
        const savedLanguage = localStorage.getItem('i18n')
        if (savedLanguage !== null) {
            this.$i18n.locale = savedLanguage
        }
    }
}
</script>

<style>
.btn-gray{
    border:none;
    padding:15px;
    border-radius: 5px;
    background: #ddd;
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.3);
}

.center.icon{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    transition: 0.1s;
}

/* ===== Scrollbar CSS ===== */
/* Firefox */
.special-scroll {
    scrollbar-width: auto;
    scrollbar-color: #474747 #ffffff;
}

/* Chrome, Edge, and Safari */
.special-scroll::-webkit-scrollbar {
    width: 10px;
}

.special-scroll::-webkit-scrollbar-track {
    /*background: rgba(0, 0, 0, .2);*/
    background: #ccc;
}

.special-scroll::-webkit-scrollbar-thumb {
    background-color: #474747;
    border-radius: 10px;
    border: 0px solid #ffffff;
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
