<template>
    <Bar
        :chart-data="getChartData"
        :dataset-id-key="datasetIdKey"
        :plugins="plugins"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
        :height="height"
        :chart-options="chartOptions"
    />
</template>

<script>
import { Bar } from 'vue-chartjs'
import {Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement} from 'chart.js'
import {stringToColor} from "@/logics/hash";
import {getTrashesByDistrict} from "@/logics/api/trashes";

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
    components: { Bar },
    props: {
        districtCode: {
            type: Number,
            default: 1000
        },
        chartId: {
            type: String,
            default: 'line-chart'
        },
        datasetIdKey: {
            type: String,
            default: 'aaa'
        },
        width: {
            type: Number,
            default: 400
        },
        height: {
            type: Number,
            default: 400
        },
        cssClasses: {
            default: '',
            type: String
        },
        styles: {
            type: Object,
            default: () => {}
        },
        plugins: {
            type: Object,
            default: () => {}
        },
        trash: {
            type: Object,
            default: () => {}
        }
    },
    mounted() {
        this.doTheMagic(this.trash)
    },
    data() {
        return {
            datasets:[],
            labels:[],
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: true,
                },
                fill: true,
                cubicInterpolationMode: 'monotone',
                legend: {
                    position: 'right' // place legend on the right side of chart
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function (value) {
                                return value + ' t';
                            }
                        }
                    }
                }
            }
        }
    },
    methods:{
        doTheMagic(records){
            // records = this.reformat(records)

            const keys = Object.keys(records)
            if (keys.length === 0) return;
            let datasets = []

            // for(const key of keys) {
            //     datasets.push({
            //         label: key,
            //         backgroundColor: stringToColor(key),
            //         data: Object.values(records[key]),
            //         tension: 0.2,
            //         fill: true
            //     })
            // }

            for (const key of keys) {
                datasets.push({
                    label: key,
                    backgroundColor: stringToColor(key),
                    data: Object.values(records[key]),
                    tension: 0.2,
                    fill: true
                })
            }

            this.datasets = datasets
            this.labels = Object.keys(records[keys[0]])
        },
        reformat(records) {
            let results = {}
            const keys = Object.keys(records)

            for (const type of keys) {
                let obj = records[type]
                const years = Object.keys(obj)
                for(const year of years) {
                    if (results[year] === undefined) {
                        results[year] = {}
                    }

                    results[year][type] = obj[year]
                }
            }

            return results
        },
        async load(){
            const result = await getTrashesByDistrict(this.districtCode)

            if(result === null) {
                this.$notify({
                    'title': 'Chyba',
                    'text': 'Nepodařilo se získat data. Zkuste to prosím později',
                    'type': 'error'
                })
                return
            }

            this.doTheMagic(result)
        }
    },
    computed:{
        getChartData() {
            return {
                labels: this.labels,
                datasets: this.datasets
            }
        }
    },
    watch:{
        trash(){
            this.doTheMagic(this.trash)
        }
    }
}
</script>