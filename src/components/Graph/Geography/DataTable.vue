<template>
    <table class="table table-hover">
        <thead>
        <tr>
            <th>{{ name }}</th>
            <template v-for="year in years" :key="year">
                <th>{{ $t('ui.maps.by_geography.amount') }}<br>{{ year }}</th>
                <th>{{ $t('ui.maps.by_geography.fraction') }}<br>{{ year }}</th>
            </template>

        </tr>
        </thead>
        <tbody>
        <tr v-for="(trash, key) in trashes" :key="key">
            <td>{{ key }}</td>
            <template v-for="(value,year) in trash" :key="year">
                <td>{{prettify(value)}}</td>
                <td>{{prettify(value/formatted[year]*100, '%')}}</td>
            </template>
        </tr>
        </tbody>
        <tfoot>
            <tr>
                <td>{{ $t('ui.maps.by_geography.sum') }}</td>
                <template v-for="(value, year) in formatted" :key="year">
                    <td>{{ prettify(value) }}</td>
                    <td>100%</td>
                </template>
            </tr>
        </tfoot>
    </table>
</template>

<script>
export default {
    name: "DataTable",
    props: {
        trashes: {
            type: Object,
            required: true
        },
        name: {
            type: String,
            required: true
        },
    },
    data(){
        return {
            formatted: {}
        }
    },
    methods:{
        updateFormatted() {
            let keys = Object.keys(this.trashes)

            let byYears = {}

            const years = Object.keys(this.trashes[keys[0]])
            for (const key of keys) {
                for (const year of years) {
                    if(byYears[year] === undefined) {
                        byYears[year] = {}
                    }

                    byYears[year][key] = this.trashes[key][year]
                }
            }

            this.formatted = {}
            for (const year of years) {
                this.formatted[year] = Object.values(byYears[year]).reduce((a,b)=>a+b)
            }
        },
        // eslint-disable-next-line no-unused-vars
        prettify(value, suffix = ' t', precision = 2) {
            return Number.parseFloat(value)
                .toFixed(precision)
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                .replace('.',',')+suffix;
        },
    },
    mounted() {
        this.updateFormatted()
    },
    computed: {
        years() {
            let keys = Object.keys(this.trashes)

            if (keys.length === 0) return [];

            return Object.keys(this.trashes[keys[0]])
        }
    },
    watch: {
        trashes() {
            this.updateFormatted()
        }
    }
}
</script>

<style scoped>
th,td{
    text-align: center;
}
td:first-of-type, th:not(th:first-of-type), tfoot {
    background: orange;
    font-weight: bold;
}
th:first-of-type{
    background: #398FF7;
}
td:nth-child(2n+1),th:nth-child(2n+1) {
    border-right: 3px solid black;
}
</style>