<template>
    <footer class="d-flex flex-wrap justify-content-between align-items-center">
        <div class="col-md-4 d-flex align-items-center">
            <a href="https://tacr.cz" class="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                <!-- Import picture !-->
                <img :src="logo" alt="logo" width="64" height="">
            </a>

        </div>
        <span class="">&copy; 2022 xxx</span>
        <ul class="nav col-md-4 justify-content-end d-flex">

            <li class="ms-3"><a class="" href="https://tacr.cz">TAČR</a></li>
            <li class="ms-3"><a class="" href="https://fm.tul.cz">TUL</a></li>
            <li class="ms-3"><a class="" href="https://jispen.inisoft.cz">JISPEN</a></li>
        </ul>
    </footer>
</template>

<script>
import logo from '@/assets/images/logo/logo_TACR_zakl_inv.png'

export default {
    name: "Footer",
    data() {
        return {
            logo: logo
        }
    }
}
</script>

<style scoped>
footer {
    margin-top:30px;
    padding: 1.3rem 5rem;
    color: white;
    background: var(--main-color-darkest);
    box-shadow: 0px -6px 0px 0px rgba(32,80,70,.6);
    /*box-shadow: 0 -6px 0px rgba(0,0,0,0.11), 0 -6px 0px rgba(0,0,0,0.23);*/
}
footer .nav a {
    color: white;
    text-decoration: none;
    background-image: linear-gradient(var(--navbar-color), var(--navbar-color));
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: 0% 2px;
    transition: 0.1s;
}
footer .nav a:hover{
    color: var(--navbar-color-hover);
    text-decoration: none;
    background-size: 100% 2px;
}
</style>