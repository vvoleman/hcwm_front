<template>
    <div>
        <h3>{{ name }}</h3>
        <li>Za rok {{year}} vyprodukováno: {{unit(sum)}}</li>
        <hr>
        <Bar
            :chart-options="chartOptions"
            :chart-data="getChartData"
            :width="400"
            :height="400"
        />
    </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import {stringToColor} from "@/logics/hash";
import {getUnit} from "@/logics/units";
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: "RegionDetails",
    props: {
        name: String,
        data: {
            type: Object,
        },
        year: Number
    },
    components: {Bar},
    data(){
        return {
            datasets:[],
            labels:[],
            chartOptions: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        stacked: true
                    }

                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${((context.raw/ this.sum) * 100).toFixed(2)  + '%'} (${getUnit(context.raw)})`
                            }
                        }
                    }
                }
            }
        }
    },
    methods:{
        unit(x){
            return getUnit(x)
        }
    },
    computed:{
        getChartData() {
            let labels = this.orderedLabels

            const size = labels.length
            let values = []
            let arr;
            labels.forEach((label,i)=>{
                arr = new Array(size)
                arr[i] = this.data[label][this.year]

                values.push({
                    label: label,
                    backgroundColor: stringToColor(label),
                    data: arr
                })
            })



            return {
                labels: labels,
                datasets: values
            }
        },
        orderedLabels(){
            return Object.keys(this.data).sort((a, b) => {
                return this.data[b][this.year] - this.data[a][this.year]
            });
        },
        sum(){
            const values = Object.values(this.data).map((item) => item[this.year])
            let sum = 0;
            for(const value of values){
                sum += value
            }
            return sum
        }
    },
}
</script>

<style scoped>

</style>