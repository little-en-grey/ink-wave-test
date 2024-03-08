
<template>
    <v-app>
        <v-app-bar fixed app>
            <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
        </v-app-bar>
        <v-main>
            <v-container>
                <slot />
            </v-container>
        </v-main>
        <v-footer app>
            <span>&copy; {{ new Date().getFullYear() }} {{ pageTitle }}</span>
        </v-footer>
    </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'

const pageTitle = ref('INK WAVE')
const darkTheme = ref(true)
const theme = useTheme()

theme.global.name.value = darkTheme.value ? 'dark' : 'light'

</script>
