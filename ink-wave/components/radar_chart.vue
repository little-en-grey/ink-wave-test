<template>
    <Radar id="radarCanvas" :data="chartData" :options="chartConfig.options" :style="chartConfig.styles"/>
</template>

<script lang="ts">
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Legend
} from 'chart.js'
import { Radar } from 'vue-chartjs'
import * as chartConfig from '@/components/chartConfig.js'

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Legend
)

export default {
    name: 'App',
    components: {
        Radar
    },
    props: {
        width: {
            type: Number,
            default: 700
        },
        height: {
            type: Number,
            default: 700
        },
        chartData: {
            type: Object,
            default: () => chartConfig.data
        }
    },
    data() {
        return {
            chartConfig: chartConfig
        }
    }
}
</script>

<style scoped>
.chart-container {
    margin: 0 auto;
}
</style>
