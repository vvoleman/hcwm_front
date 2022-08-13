<template>
    <div class="details">
        <div class="legends">
            <div v-for="trash in items" :key="trash.code" class="legend">
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
import {trashes} from "@/assets/js/trashes";

export default {
    name: "TrashLegend",
    props: {
        trashes: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        items() {
            let data = []
            for (const trash in this.trashes) {
                data.push({
                    code: trash,
                    color: stringToColor(trash),
                    name: trashes[trash]
                })
            }

            return data;
        }
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