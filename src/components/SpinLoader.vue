<template>
    <div class="center-flex">
        <div class="lds-dual-ring"></div>
    </div>
</template>

<script>
export default {
    name: "SpinLoader"
}
</script>

<style scoped>
.lds-dual-ring {
    display: block;
    width: 80px;
    height: 80px;
}
.lds-dual-ring:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid var(--main-color-dark);
    border-color: var(--main-color-dark) transparent var(--main-color-dark) transparent;
    animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.center-flex {
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>