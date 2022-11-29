<template>
    <div>
        <div>
<!--            &lt;!&ndash; Make a checkbox with label that changes state of 'includeRegression'  &ndash;&gt;-->
<!--            <label class="checkbox">-->
<!--                <input type="checkbox" v-model="includeRegression">-->
<!--                <span class="checkmark"></span>-->
<!--                &lt;!&ndash; Translate the label &ndash;&gt;-->
<!--                {{ $t('ui.graphs.by_geography.include_regression') }}-->
<!--            </label>-->
        </div>
        <Line
            ref="moree"
            :chart-options="chartOptions"
            :chart-data="getChartData"
            :dataset-id-key="datasetIdKey"
            :css-classes="cssClasses"
            :styles="styles"
            :width="width"
        />
    </div>
</template>

<script>
import {Line} from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Filler,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from 'chart.js'
import {stringToColor} from "@/logics/hash";
import {linearRegression} from "@/logics/math/regression";
import {lightenColor} from "@/logics/helpers";

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

export default {
    name: 'LineChart',
    components: {Line},
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
            includeRegression: false,
            datasets: [],
            labels: [],
            hovering: false,
            chartOptions: {
                animation: {
                    duration: 0,
                    onComplete: () => {
                        this.$emit('chart-ready')
                    }
                },
                legendCallback: function (chart) {
                    var legendHtml = [];
                    legendHtml.push('<ul>');
                    var item = chart.data.datasets[0];
                    for (var i = 0; i < item.data.length; i++) {
                        legendHtml.push('<li>');
                        legendHtml.push('<span class="chart-legend" style="background-color:' + item.backgroundColor[i] + '"></span>');
                        legendHtml.push('<span class="chart-legend-label-text">' + item.data[i] + ' person - ' + chart.data.labels[i] + ' times</span>');
                        legendHtml.push('</li>');
                    }

                    legendHtml.push('</ul>');
                    return legendHtml.join("");
                },
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
                            callback: function (value) {
                                return new Intl.NumberFormat(this.language, {maximumSignificantDigits: 3,}).format(value) + ' t';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat(this.language, {maximumSignificantDigits: 3,}).format(context.parsed.y) + ' t'
                                }
                                return label;
                            }
                        }
                    }
                },
            }
        }
    },
    methods: {
        doTheMagic(records) {
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
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.2,
                })
                let lighter = lightenColor(color, 0.3)
                // Regression
                let linear = this.linear(Object.values(records[key]))

                // Generate array of years from 2009 to 2019
                let data = Array.from({length: 11}, (v, k) => linear(k + 2009));

                datasets.push({
                    label: `Trend ${this.$t(`ui.graphs.trashes.${key}`)}`,
                    backgroundColor: lighter,
                    borderColor: lighter,
                    // Vyzkoušet
                    borderDash: [5],
                    data: data,
                    spanGaps: true,
                    tension: 0.2,
                    pointBorderColor: "#4d4d4d",
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    hidden: true,
                })
            }
            this.datasets = datasets
            this.labels = Object.keys(records[keys[0]]);
        },
        linear(data) {
            let y = data
            let x = []
            for (let i = 0; i < 11; i++) {
                x.push(2009 + i)
            }
            return linearRegression(x, y)
        }
    },
    computed: {
        getChartData() {
            return {
                labels: this.labels,
                datasets: this.datasets
            }
        }
    },
    watch: {
        trash() {
            this.doTheMagic(this.trash)
        }
    }
}
</script>

<style scoped>
/* .checkbox is toggleable button */

</style>