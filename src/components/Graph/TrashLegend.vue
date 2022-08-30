<template>
    <div class="details">
        <button class="col-12" @click="visible = !visible">{{visible ? "Zavřít" : "Otevřít"}}</button>
        <div class="legends" v-show="visible">
            <div v-for="trash in trashes" :key="trash.code" class="legend">
                <div class="line" :title="trash.name">
                    <div class="trash-box" :style="{'backgroundColor': trash.color}"></div>
                    <b>{{ trash.code }}</b>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {stringToColor} from "@/logics/hash";
import {getTrashLegend} from "@/logics/api/geography/basic";

export default {
    name: "TrashLegend",
    data(){
        return {
            visible: true,
            trashes: {}
        }
    },
    async mounted() {
        let result = []

        const trashes = (await getTrashLegend())

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
.trash-box {
    width: 20px;
    height: 20px;
    border: 2px solid black;
    margin-right: 10px;
    display: inline-block;
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

.line {
    padding: 5px;
    display: flex;
    align-items: center;
}

.text {
    padding: 0px 5px;
}
</style>