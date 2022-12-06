<template>
    <nav class="navbar navbar-expand-lg" style="margin-bottom: 10px">
        <div class="container-fluid align-items-start">
            <router-link to="/"><span class="logo">HCWM</span></router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="icon dripicons-menu"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <div>
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/">{{ $t('ui.pages.collections.navbar') }}</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/graphs">{{ $t('ui.pages.graphs.navbar') }}</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/about">{{ $t('ui.pages.about.navbar') }}</router-link>
                        </li>
                    </ul>
                </div>
                <div class="navbar-nav navbar-right">
                    <LanguagePicker />
                </div>
            </div>

        </div>

    </nav>
</template>

<script>
import LanguagePicker from "@/components/LanguagePicker";
export default {
    name: "NavBar",
    components: {LanguagePicker}
}
</script>

<style scoped>
    @import "@/assets/css/variables.css";

    .navbar {
        background-color: var(--navbar-bg);
        font-family: var(--navbar-font), serif;
        box-shadow: 0px 3px 0px 0px rgba(32,80,70,.8);
    }

    .navbar a {
        font-weight: normal;
        color: var(--navbar-color);
    }

    .navbar-brand{
        font-weight: bold;
        font-size: 25px;
    }

    .nav-link:not(.navbar-brand) {
        text-decoration: none;
        background-image: linear-gradient(var(--navbar-color), var(--navbar-color));
        background-position: 0% 100%;
        background-repeat: no-repeat;
        background-size: 0% 2px;
        transition: 0.1s;
    }

    .nav-link:hover,
    .nav-link:focus {
        color: var(--navbar-color-hover);
        text-decoration: none;
        background-size: 100% 2px;
    }

    .navbar-right {
        margin-left: auto;
    }
    .logo{
        font-family: var(--logo-font), serif;
        color: var(--logo-color);
        font-size: var(--logo-size);
        text-decoration: none !important;
        margin-right:20px;
    }
    a {
        text-decoration: none;
    }
</style>