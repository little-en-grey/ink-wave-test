<template>
    <v-app dark>
        <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
            <v-list>
                <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar :clipped-left="clipped" fixed app>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer />
        </v-app-bar>
        <v-main>
            <v-container>
                <Nuxt />
            </v-container>
        </v-main>
        <v-footer :absolute="!fixed" app>
            <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
    </v-app>
</template>

<script>
export default {
    name: 'OperationLayout',
    data() {
        return {
            clipped: false,
            drawer: false,
            fixed: false,
            items: [
                {
                    icon: 'mdi-controller',
                    title: 'チーム紹介カード',
                    to: '/output-team',
                },
                {
                    icon: 'mdi-sword-cross',
                    title: '本日の結果(1試合分)',
                    to: '/todays-result',
                },
                {
                    icon: 'mdi-sword-cross',
                    title: '本日の結果(全試合分)',
                    to: '/todays-result2',
                },
            ],
            miniVariant: false,
            right: true,
            rightDrawer: false,
            title: 'INK WAVE',
        }
    },
}
</script>
