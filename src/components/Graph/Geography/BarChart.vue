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
import {Bar} from 'vue-chartjs'
import {Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement} from 'chart.js'
import {stringToColor} from "@/logics/hash";

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
    components: {Bar},
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
            default: () => {
            }
        },
        plugins: {
            type: Object,
            default: () => {
            }
        },
        trash: {
            type: Object,
            default: () => {
            }
        }
    },
    mounted() {
        this.doTheMagic(this.trash)
    },
    data() {
        return {
            sums: {},
            datasets: [],
            labels: [],
            chartOptions: {
                duration: 0,
                animation: {
                    onComplete: () => {
                        this.$emit('chart-ready')
                    }
                },
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
                                return new Intl.NumberFormat(this.language, {maximumSignificantDigits: 3,}).format(value) + ' t';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat(this.language, {
                                        maximumSignificantDigits: 3,
                                        style: 'percent',
                                    }).format(context.parsed.y / this.sums[context.label])
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        }
    },
    methods: {
        doTheMagic(records) {
            // records = this.reformat(records)
            if (records === null) return;
            const keys = Object.keys(records)
            if (keys.length === 0) return;
            let datasets = []


            this.sums = this.sumByYear(records)
            for (const key of keys) {
                datasets.push({
                    label: this.$t(`ui.graphs.trashes.${key}`),
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
                for (const year of years) {
                    if (results[year] === undefined) {
                        results[year] = {}
                    }

                    results[year][type] = obj[year]
                }
            }

            return results
        },
        sumByYear(records) {
            let results = {}

            let keys = Object.keys(records);
            let years = Object.keys(records[keys[0]])
            let sum
            for (const year of years) {
                sum = 0
                for (const key of keys) {
                    sum += records[key][year]
                }
                results[year] = sum
            }

            return results

        }
    },
    computed: {
        getChartData() {
            return {
                labels: this.labels,
                datasets: this.datasets
            }
        },
        language() {
            return this.$i18n.locale
        }
    },
    watch: {
        trash() {
            this.doTheMagic(this.trash)
        }
    }
}
</script>