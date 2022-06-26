<template>
    <custom-marker
        :map="map"
        :marker="getCoords(region.properties.city.coords)"
    >
        <div>
            <Pie
                :chart-options="chartOptions"
                :chart-data="chartData"
                :width="150"
                :height="50"
            />
        </div>
    </custom-marker>
</template>

<script>
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import CustomMarker from "@/components/vue-leaflet-custom-marker";
import {Pie} from 'vue-chartjs'
import {stringToColor} from "@/logics/hash";
import {trashes} from "@/assets/js/trashes";
import {getUnit} from "@/logics/units";

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
    name: "PiechartMarker",
    props: {
        map: Object,
        region: Object,
        year: Number,
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
                                return `${context.label} - ${getUnit(context.raw)}`
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
            return {lat: obj[1], lng: obj[0]}
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
            this.datasets = [];
            const region = this.region.properties.trashes;
            const keys = Object.keys(region)

            let data = []
            let sums = 0
            for (const key of keys) {
                sums += region[key][this.year]
                data.push(region[key][this.year])
            }

            this.datasets.push({
                label: keys,
                borderWidth: 0.5,
                backgroundColor: keys.map((key) => {
                    return stringToColor(trashes[key])
                }),
                data: data
            })
            this.labels = keys;

            this.sum = sums
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
        }
    }
}
</script>

<style scoped>

</style>