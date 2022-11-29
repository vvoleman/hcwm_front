<template>
    <div class="container">
        <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div class="col-md-4 d-flex align-items-center">
                <a href="/" class="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                    <!-- Import picture !-->
                    <img :src="logo" alt="logo" width="64" height="">
                </a>
                <span class="mb-3 mb-md-0 text-muted">&copy; 2022 Company, Inc</span>
            </div>

            <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
                <li class="ms-3"><a class="text-muted" href="#">TAČR</a></li>
                <li class="ms-3"><a class="text-muted" href="#">TUL</a></li>
                <li class="ms-3"><a class="text-muted" href="#">Další odkaz</a></li>
            </ul>
        </footer>
    </div>
</template>

<script>
import logo from '@/assets/images/logo/logo_TACR_zakl.png'
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
</style>