<template>
    <notifications position="bottom right" />
    <NavBar />
    <router-view></router-view>
    <Footer />
</template>

<script>

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
export default {
  name: 'App',
    components: {NavBar, Footer},
    mounted() {
        const savedLanguage = localStorage.getItem('i18n')
        if (savedLanguage !== null) {
            this.$i18n.locale = savedLanguage
        }
    }
}
</script>

<style>
body{
    font-family: var(--body-font);
}
.btn-gray{
    border:none;
    padding:15px;
    border-radius: 5px;
    color: white;
    background: var(--main-color-dark);
    box-shadow: 0px 0px 3px 0px rgba(221,211,203,0.3);
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
.scroll-table{
    width: 100%;
    overflow: auto;
}
.segment{
    margin-top:35px;
}
.chart {
    height: auto;
    min-height: 400px;
}
.chart-box{
    font-family: var(--navbar-font);
    min-height: 400px;
    margin-top: 20px;
    background: #fbfaf9;
    border-radius: 3px;
    padding: 20px;
    box-shadow: 0px 0px 3px 0px rgb(221, 211, 203);
}

.title {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 10px;
    background-image: linear-gradient(#ccc,#ccc);
    background-size: 50% 2px;
    background-position: bottom center;
    background-repeat: no-repeat;
}

.subtitle {
    font-size:1.3em;
    color: var(--navbar-bg);
}
</style>
