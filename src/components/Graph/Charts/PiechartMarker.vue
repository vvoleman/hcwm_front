<template>
    <custom-marker
        :map="map"
        alignment="topleft"
        :marker="getCoords(region.coords)"
        :style="{marginLeft: offset.left+'px', marginTop: offset.top+'px'}"
        class="marker"
    >
        <div >
            <Pie
                :ref="region.id"
                :chart-options="chartOptions"
                :chart-data="chartData"
                :width="sizes.width"
                :height="sizes.height"
            />
            <tooltip
                :show="tooltip.show"
                :name="tooltip.name"
                :rawValue="tooltip.rawValue"
                :percValue="tooltip.percValue"
                :x="tooltip.x"
                :y="tooltip.y"
            />
            <div :ref="'tooltip_'+region.id"></div>
        </div>
    </custom-marker>
</template>

<script>
import {ArcElement, Chart as ChartJS, Legend} from 'chart.js';
import CustomMarker from "@/components/vue-leaflet-custom-marker";
import {Pie} from 'vue-chartjs'
import {stringToColor} from "@/logics/hash";
import {getUnit} from "@/logics/units";
import Tooltip from "@/components/Graph/Charts/Tooltip";
import {prettify} from "@/logics/helpers";

ChartJS.register(ArcElement, Legend);
export default {
    name: "PiechartMarker",
    props: {
        sizes: {type: Object, required: true},
        map: {type: Object, required: true},
        region: {type: Object, required: true},
        year: {type: Number, required: true},
    },
    data() {
        return {
            tooltip: {
                show: false,
                name: '',
                rawValue: '',
                percValue: '',
                x: 0,
                y: 0,
            },
            labels: [],
            datasets: [],
            sum: null,
            chartOptions: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                        position: 'bottom'
                    },
                    tooltip: {
                        enabled: false,
                        caretSize: 0,
                        position: "nearest",
                        callbacks: {
                            label: (context) => {
                                return `${this.$t('ui.graphs.trashes.' + (context.label))} - ${getUnit(context.raw)}`
                            },
                            afterBody: (context) => {
                                context = context[0]
                                let arr = [];
                                arr.push(((context.raw / this.sum) * 100).toFixed(2) + '%')
                                return arr;
                            },
                        },
                        external: (tooltipModel) => {
                            let tooltip = tooltipModel.tooltip
                            let dataPoint = tooltip.dataPoints[0];
                            this.tooltip.name = this.$t('ui.graphs.trashes.' + (dataPoint.label))
                            this.tooltip.rawValue = prettify(getUnit(dataPoint.raw))
                            this.tooltip.percValue = ((dataPoint.raw / this.sum) * 100).toFixed(2) + '%';
                            this.tooltip.show = tooltip.opacity > 0;
                        }
                    },
                }
            }
        }
    },
    components: {
        Tooltip,
        CustomMarker,
        Pie
    },
    mounted() {
        this.updateData()
    },
    methods: {
        getCoords(obj) {
            return {lat: obj.latitude, lng: obj.longitude}
        },
        getYear(trashes) {
            const keys = Object.keys(trashes)
            const results = {}
            for (const key of keys) {
                results[key] = trashes[key][this.year]
            }
            return results
        },
        updateData() {
            let datasets = []
            const trashes = this.region.trashes.records
            const keys = Object.keys(trashes)
            let data = []
            for (const key of keys) {
                data.push(trashes[key])
            }
            datasets.push({
                label: keys,
                borderWidth: 0.5,
                backgroundColor: keys.map((key) => {
                    return stringToColor(key)
                }),
                data: data
            })
            this.labels = keys;
            this.sum = this.region.trashes.sum
            this.datasets = datasets
        }
    },
    computed: {
        offset() {
            return {
                top: -this.sizes.height/2,
                left: -this.sizes.width/2
            }
        },
        chartData() {
            return {
                labels: this.labels,
                datasets: this.datasets
            }
        },
        myStyles() {
            return {
                height: `${this.sizes.height}px`,
                position: 'relative'
            }
        }
    },
    watch: {
        year() {
            this.updateData()
        },
        sizes() {
            let chart = this.$refs[this.region.id].chart

            chart.resize(this.sizes.width, this.sizes.height);

            this.$refs[this.region.id].updateChart()
        }
    }
}
</script>

<style>
.marker-wrapper canvas {

}
</style>

<style scoped>
.tooltip {
    left: 0;
    padding: 30px;
    background: black;
    color: white;
    position: absolute;
    z-index: 5;
}

.pie-container {
    position: relative;
}
</style>