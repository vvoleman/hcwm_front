<template>
    <h1>Ted</h1>
    <custom-marker
        v-if="region !== null"
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
            <div class="tooltip" :id="region.id"></div>
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
                plugins: {
                    legend: {
                        display: false,
                        position: 'bottom'
                    },
                    tooltip: {
                        enabled: false,
                        caretSize: 0,
                        position: "nearest",
                        // external: (context) => {
                        //     // Tooltip Element
                        //     let tooltipEl = document.getElementById(this.region.id);
                        //     console.log(tooltipEl)
                        //
                        //     // Create element on first render
                        //     if (!tooltipEl) {
                        //         tooltipEl = document.createElement('div');
                        //         tooltipEl.id = this.region.id;
                        //         document.body.appendChild(tooltipEl);
                        //     }
                        //
                        //     tooltipEl.innerHTML = '<table></table>';
                        //
                        //     // Hide if no tooltip
                        //     const tooltipModel = context.tooltip;
                        //     if (tooltipModel.opacity === 0) {
                        //         tooltipEl.style.opacity = 0;
                        //         return;
                        //     }
                        //
                        //     // Set caret Position
                        //     tooltipEl.classList.remove('above', 'below', 'no-transform');
                        //     if (tooltipModel.yAlign) {
                        //         tooltipEl.classList.add(tooltipModel.yAlign);
                        //     } else {
                        //         tooltipEl.classList.add('no-transform');
                        //     }
                        //
                        //     function getBody(bodyItem) {
                        //         return bodyItem.lines;
                        //     }
                        //
                        //     // Set Text
                        //     if (tooltipModel.body) {
                        //         const titleLines = tooltipModel.title || [];
                        //         const bodyLines = tooltipModel.body.map(getBody);
                        //
                        //         let innerHtml = '<thead>';
                        //
                        //         titleLines.forEach(function(title) {
                        //             innerHtml += '<tr><th>' + title + '</th></tr>';
                        //         });
                        //         innerHtml += '</thead><tbody>';
                        //
                        //         bodyLines.forEach(function(body, i) {
                        //             const colors = tooltipModel.labelColors[i];
                        //             let style = 'background:' + colors.backgroundColor;
                        //             style += '; border-color:' + colors.borderColor;
                        //             style += '; border-width: 2px';
                        //             const span = '<span style="' + style + '"></span>';
                        //             innerHtml += '<tr><td>' + span + body + '</td></tr>';
                        //         });
                        //         innerHtml += '</tbody>';
                        //
                        //         let tableRoot = tooltipEl.querySelector('table');
                        //         tableRoot.innerHTML = innerHtml;
                        //     }
                        //
                        //     const position = context.chart.canvas.getBoundingClientRect();
                        //
                        //     // Display, position, and set styles for font
                        //     tooltipEl.style.opacity = 1;
                        //     tooltipEl.style.position = 'absolute';
                        //     tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                        //     tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                        //     tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
                        //     tooltipEl.style.pointerEvents = 'none';
                        // },
                        callbacks: {
                            label: (context)=>{
                                return `${this.$t('ui.graphs.trashes.'+(context.label))} - ${getUnit(context.raw)}`
                            },
                            afterBody: (context) => {
                                context = context[0]
                                let arr = [];
                                arr.push(((context.raw / this.sum) * 100).toFixed(2) + '%')
                                return arr;
                            },
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
.tooltip {
    left: 0;
    padding:30px;
    background: black;
    color:white;
    position:absolute;
    z-index: 5;
}
</style>