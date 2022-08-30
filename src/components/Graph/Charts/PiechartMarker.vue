<template>
    <custom-marker
        :map="map"
        :marker="getCoords(region.coords)"
    >
        <div>
            <Pie
                :ref="region.id"
                :chart-options="chartOptions"
                :chart-data="chartData"
                :width="width"
                :height="height"
            />
        </div>
    </custom-marker>
</template>

<script>
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import CustomMarker from "@/components/vue-leaflet-custom-marker";
import {Pie} from 'vue-chartjs'
import {stringToColor} from "@/logics/hash";
import {getUnit} from "@/logics/units";

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
    name: "PiechartMarker",
    props: {
        width: {type: Number, required:true},
        height: {type: Number, required:true},
        map: {type: Object, required: true},
        region: {type: Object, required: true},
        year: {type: Number, required: true},
    },
    data() {
        return {
            labels: [],
            datasets: [],
            sum: null,
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 0,
                        right: 4,
                        top: 0,
                        bottom: 0
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                        position: 'bottom'
                    },
                    tooltip: {
                        caretSize: 0,
                        position: "nearest",
                        callbacks: {
                            label: (context)=>{
                                return `${this.$t('ui.graphs.trashes.'+(context.label))} - ${getUnit(context.raw)}`
                            },
                            afterBody: (context) => {
                                context = context[0]
                                let arr = [];

                                arr.push(((context.raw / this.sum) * 100).toFixed(2) + '%')

                                return arr;
                            }
                        }
                    },
                }
            }
        }
    },
    components: {
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
        chartData() {
            return {
                labels: this.labels,
                datasets: this.datasets
            }
        },
    },
    watch: {
        year() {
            this.updateData()
        },
        width() {
            this.$refs[this.region.id].updateChart()
        }
    }
}
</script>

<style scoped>

</style>