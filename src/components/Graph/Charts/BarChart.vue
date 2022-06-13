<template>
    <Bar
        :chart-options="chartOptions"
        :chart-data="getChartData"
        :chart-id="chartId"
        :dataset-id-key="datasetIdKey"
        :plugins="plugins"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
        :height="height"
    />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import {stringToColor} from "@/logics/hash";
import {getTrashesByDistrict} from "@/logics/api/trashes";
import {trashes} from "@/assets/js/trashes";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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
            default: 'bar-chart'
        },
        datasetIdKey: {
            type: String,
            default: 'label'
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
        }
    },
    mounted() {
        this.load()
    },
    data() {
        return {
            datasets:[],
            labels:[],
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function(value) {
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

            const keys = Object.keys(records)

            let datasets = []

            for (const key of keys) {
                datasets.push({
                    label: key,
                    backgroundColor: stringToColor(trashes[key]),
                    data: Object.values(records[key])
                })
            }
            this.datasets = datasets
            this.labels = Object.keys(records[keys[0]]);
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
        districtCode(){
            this.load()
        }
    }
}
</script>