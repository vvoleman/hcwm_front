<template>
    <Line
        :chart-options="chartOptions"
        :chart-data="getChartData"
        :dataset-id-key="datasetIdKey"
        :plugins="plugins"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
    />
</template>

<script>
import { Line } from 'vue-chartjs'
import {Chart as ChartJS, Title, Filler, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement} from 'chart.js'
import {stringToColor} from "@/logics/hash";
import {getTrashesByDistrict} from "@/logics/api/trashes";
import {linearRegression} from "@/logics/math/regression";

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

export default {
    name: 'LineChart',
    components: { Line },
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
            hovering: false,
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: true,
                },
                scales: {
                    x: {
                        // stacked: true
                    },
                    y: {
                        // stacked: true,
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function(value) {
                                return new Intl.NumberFormat(this.language, {maximumSignificantDigits:3,}).format(value) + ' t';
                            }
                        }
                    }
                },
                legend: {
                    display: true,
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat(this.language, { maximumSignificantDigits: 3, }).format(context.parsed.y)+' t'
                                }
                                return label;
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
            if (keys.length === 0) return;

            let datasets = []
            let color
            for (const key of keys) {
                color = stringToColor(key)
                datasets.push({
                    label: this.$t(`ui.graphs.trashes.${key}`),
                    backgroundColor: color,
                    borderColor: color,
                    // Vyzkoušet
                    // borderDash: [5],
                    data: Object.values(records[key]),
                    pointBorderColor: "#000",
                    pointRadius:5,
                    pointHoverRadius:7,
                    tension: 0.2,
                })

                // Regression
                let linear = this.linear(Object.values(records[key]))
                let data = new Array(11).fill(null);
                data[0] = linear(2009)
                data[data.length-1] = linear(2019)
                datasets.push({
                    label: `Trend ${this.$t(`ui.graphs.trashes.${key}`)}`,
                    backgroundColor: color,
                    borderColor: color,
                    // Vyzkoušet
                    // borderDash: [5],
                    data: data,
                    spanGaps:true,
                    tension: 0.2,
                    hidden:true,
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
        },
        linear(data) {
            let y = data
            let x = []
            for (let i = 0; i < 11; i++) {
                x.push(2009+i)
            }
            return linearRegression(x,y)
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