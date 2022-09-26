<template>
    <div class="segment chart-box">
        <div class="title">
            <slot name="title" />
            <slot name="subtitle" class="subtitle"></slot>
        </div>
        <slot name="body"></slot>
    </div>
</template>

<script>
export default {
    name: "SegmentWrapper",
}
</script>

<style scoped>

</style>