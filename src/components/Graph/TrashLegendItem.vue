<template>
    <div class="line" :title="nameDynamic" :class="{'alone': name === undefined}" :style="{backgroundColor: background}">
        <div class="trash-box" :style="{'backgroundColor': colorDynamic}"></div>
        <b>{{ code }}</b>
    </div>
</template>

<script>
import {useTrashStore} from "@/stores/Trash/TrashStore";
import {stringToColor} from "@/logics/hash";
import {lightenColor} from "@/logics/helpers";

export default {
    name: "TrashLegendItem",
    props:{
        code: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: false
        },
        color: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            nameDynamic: '',
            colorDynamic: '',
            background: '',
        }
    },
    async mounted() {
        if (this.name !== undefined) {
            this.nameDynamic = this.name
            this.colorDynamic = this.color
            return;
        }

        const trashes = await useTrashStore().getTrashLegend()
        this.nameDynamic = trashes.allowed[this.code] ?? trashes.others[this.code]
        this.colorDynamic = stringToColor(this.code)
        this.background = lightenColor(this.colorDynamic,0.7)
    }
}
</script>

<style scoped>
.alone {
    box-shadow: var(--folder-alt-shadow);
    display:flex;
    align-items: center;
    border-radius: 10px;
    padding: 5px 10px !important;
    background: var(--main-color-dark);
}
.line {
    width: auto;
    padding: 5px;
    display: inline-flex;
    align-items: start;
}
.trash-box {
    width: 20px;
    height: 20px;
    border: 2px solid black;
    margin-right: 10px;
    display: inline-block;
}
.text {
    padding: 0px 5px;
}
</style>