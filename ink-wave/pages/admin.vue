<template>
    <v-tabs v-model="tab" align-tabs="start" color="primary">
        <v-tab :value="1">チーム紹介カード</v-tab>
        <v-tab :value="2">本日の結果(1試合分)</v-tab>
        <v-tab :value="3">本日の結果(全試合分)</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
        <v-tabs-window-item>
            <OutputTeam v-if="tab == 1" />
            <TodaysResult v-if="tab == 2" />
            <TodaysResult2  v-if="tab == 3" />
        </v-tabs-window-item>
    </v-tabs-window>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OutputTeam from "@/components/output_team.vue";
import TodaysResult from "@/components/todays_result.vue";
import TodaysResult2 from "@/components/todays_result2.vue";
import {LOGO_DATA} from "@/consts/dataConst";

const tab = ref(null)

useHead({
    title: 'Admin',
})
</script>

<style scoped>
.confirm-image {
    width: 100%;
    height: auto;
}</style>












