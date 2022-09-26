<template>
    <div class="details">
        <button class="col-12" @click="visible = !visible">{{visible ? "Zavřít" : "Otevřít"}}</button>
        <div class="legends" v-show="visible">
            <div v-for="trash in trashes" :key="trash.code" class="legend">
                <TrashLegendItem :code="trash.code" :name="trash.name" :color="trash.color"/>
            </div>
        </div>
    </div>
</template>

<script>
import {stringToColor} from "@/logics/hash";
import {useTrashStore} from "@/stores/Trash/TrashStore";
import TrashLegendItem from "@/components/Graph/TrashLegendItem";

export default {
    name: "TrashLegend",
    components: {
        TrashLegendItem
    },
    data(){
        return {
            visible: true,
            trashes: {}
        }
    },
    async mounted() {
        let result = []

        const trashes = await useTrashStore().getTrashLegend()

        for (const key of Object.keys(trashes.allowed)) {
            result.push({
                code: key,
                name: trashes.allowed[key],
                color: stringToColor(key)
            })
        }

        for (const key of Object.keys(trashes.others)) {
            result.push({
                code: key,
                name: trashes.others[key],
                color: stringToColor('others')
            })
        }

        this.trashes = result
    }
}
</script>

<style scoped>
.details {
    background: white;
    width: 10vw;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
}


.legend {
    display: inline-block;
    width: 100%;
    transition: .1s;
}

.legend:hover {
    background: #eee;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.3);
}


</style>