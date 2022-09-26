<template>
    <div class="legend-big d-md-flex flex-wrap">
        <div class="line col-md-3" v-for="trash in trashes" :key="trash.code" :style="{'backgroundColor': trash.background}">
            <div>
                <div class="trash-box" :style="{'backgroundColor': trash.color}"></div>
                <b>{{ trash.code }}</b>
            </div>
            <span>{{ trash.name }}</span>
        </div>
    </div>
</template>

<script>
import {useTrashStore} from "@/stores/Trash/TrashStore";
import {stringToColor} from "@/logics/hash";
import {lightenColor} from "@/logics/helpers";

export default {
    name: "TrashLegendBig",
    components: {},
    data(){
        return {
            trashes: {}
        }
    },
    async mounted() {
        let result = []

        const trashes = await useTrashStore().getTrashLegend()

        let color;
        for (const key of Object.keys(trashes.allowed)) {
            color = stringToColor(key)
            result.push({
                code: key,
                name: trashes.allowed[key],
                color: color,
                background: lightenColor(color,0.7)
            })
        }

        for (const key of Object.keys(trashes.others)) {
            color = stringToColor('others')
            result.push({
                code: key,
                name: trashes.others[key],
                color: color,
                background: lightenColor(color,0.9)
            })
        }

        this.trashes = result
    }
}
</script>

<style scoped>
.legend-big {
    justify-content: center;
    margin-bottom: 20px;
}
span{
    display:block;
}
.line {
    box-shadow: var(--folder-alt-shadow);
    border-radius: 5px;
    margin:10px;
    background: var(--main-color-dark);
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: start;
}
.trash-box {
    width: 20px;
    height: 20px;
    border: 2px solid black;
    margin-right: 10px;
    display: inline-block;
}
</style>